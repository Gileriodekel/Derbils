import { validationLineage, validParentMarker } from './archived-lineage';
import { archivedGeneration } from '../archive';
import { validateCompetitionCommand } from './validate-competitions';
import { config, skillKeys } from '../../data/config';
import { breedingReason, policyReason } from '../mates';
import { permittedKinship } from '../kinship';
import { navigationTerrain } from '../food-sources';
import { isSafeLand, terrainCost, tileIndex } from '../map';
import type { Point, SaveState } from '../types';
import { exactKeys, finite, integer, requireValue } from './checks';

export function validateBreeding(s: SaveState): void {
  const ids=new Set(s.organisms.map(o=>o.id)), lives=new Map(validationLineage(s).map(l=>[l.id,l]));
  const rules=s.breedingRules;
  for(const list of [rules.blockedIndividuals,rules.encouragedIndividuals])requireValue(Array.isArray(list)
    &&list.every((id,i)=>ids.has(id)&&(i===0||list[i-1]<id)), 'individual breeding policy');
  for(const list of [rules.blockedPairs,rules.encouragedPairs,rules.exclusivePairs]){
    requireValue(Array.isArray(list),'pair policy');let prev='';
    for(const p of list){requireValue(Array.isArray(p)&&p.length===2&&p[0]<p[1]&&p.every(id=>ids.has(id))&&p.join(':')>prev,'canonical pair policy');prev=p.join(':');}
  }
  requireValue(new Set(rules.exclusivePairs.flat()).size===rules.exclusivePairs.length*2,'disjoint exclusive pairs');
  for(const c of s.creatures)requireValue(exactKeys(c.breeding,['cooldownUntil','clutches','nextAttemptTick'])
    &&integer(c.breeding.cooldownUntil)&&integer(c.breeding.nextAttemptTick)&&integer(c.breeding.clutches,0,config.breeding.maximumClutches),'breeding state');
  for(const l of s.lineage){
    requireValue(['founder','birth','rescue','legacy'].includes(l.origin)&&integer(l.generation)&&exactKeys(l.birthAptitudes,skillKeys)
      &&Object.values(l.birthAptitudes).every(q=>finite(q,0,1))&&Array.isArray(l.mutations),'birth summary');
    if(l.origin==='birth')requireValue(l.parentIds?.length===2,'two parents');
    if(!l.parentIds)requireValue(l.generation===0,'founder generation');
    else requireValue(l.generation===1+Math.max(...l.parentIds.map(id=>validParentMarker(id,s)?archivedGeneration(id):lives.get(id)!.generation)),'child generation');
    for(const m of l.mutations)requireValue(config.genes.some(g=>g.chromosome===m.chromosome&&g.id===m.locus)
      &&(m.haplotype===0||m.haplotype===1)&&exactKeys(m.before,['v','d'])&&exactKeys(m.after,['v','d']),'mutation record');
  }
  for(const event of s.events)if(event.command){
    const c=event.command;
    if(s.schemaVersion>=9&&(c.kind==='createCompetition'||c.kind==='cancelCompetition')){validateCompetitionCommand(c);continue;}
    if(s.schemaVersion>=10&&c.kind==='equipCosmetic'){requireValue(exactKeys(c,['kind','id','cosmetic'])&&ids.has(c.id)&&(c.cosmetic===null||Object.hasOwn(config.prizes.starter.cosmetics,c.cosmetic)),'cosmetic command');continue;}
    const individual=c.kind==='blockCreature'||c.kind==='encourageCreature';
    const pair=c.kind==='pair'||c.kind==='blockPair'||c.kind==='encouragePair'||c.kind==='forceBreed'||c.kind==='setAffinity';
    requireValue(exactKeys(c,['kind',...(pair?['a','b']:individual?['id']:[]),...(c.kind==='forceBreed'?[]:c.kind==='setAffinity'?['value']:['enabled'])])
      && (pair || individual || c.kind==='extinctionRescue') && (c.kind==='forceBreed'||(c.kind==='setAffinity'?finite(c.value,-100,100):typeof c.enabled==='boolean'))
      && (!('id' in c)||ids.has(c.id)) && (!('a' in c)||(ids.has(c.a)&&ids.has(c.b)&&c.a!==c.b)),'journal command');
  }
  const terrain=navigationTerrain(s.world), locked=new Set<string>();
  const walkable=(p:Point)=>finite(p.x,0,s.world.width-Number.EPSILON)&&finite(p.y,0,s.world.height-Number.EPSILON)
    &&Number.isFinite(terrainCost(terrain[tileIndex(p,s.world.width)]));
  requireValue(Array.isArray(s.sessions)&&s.sessions.length<=Math.floor(s.creatures.length/2)&&s.creatures.length+s.sessions.length<=s.settings.capacity,'courtship slots');
  requireValue(new Set(s.sessions.map(s=>s.id)).size===s.sessions.length,'unique courtship IDs');
  for(const session of s.sessions){
    requireValue(exactKeys(session,['id','participants','startedTick','workStartedTick','workTicks','nest','targets','paths'])
      &&/^s_[0-9]{8}$/.test(session.id)&&integer(Number(session.id.slice(2)),1,s.counters.session-1)
      &&Array.isArray(session.participants)&&session.participants.length===2&&Array.isArray(session.targets)&&session.targets.length===2&&Array.isArray(session.paths)&&session.paths.length===2
      &&integer(session.startedTick,0,s.clock.tick)&&integer(session.workTicks,0,config.breeding.courtshipWorkTicks-1)
      &&(session.workStartedTick===null ? session.workTicks===0 : integer(session.workStartedTick,session.startedTick,s.clock.tick))
      &&exactKeys(session.nest,['x','y'])&&walkable(session.nest)&&isSafeLand(terrain[tileIndex(session.nest,s.world.width)]),'courtship record');
    const parents=session.participants.map(id=>s.creatures.find(c=>c.id===id));
    requireValue(parents.every(c=>c&&c.stage==='adult'&&c.currentAction===null&&!locked.has(c.id))
      &&parents[0]!.id!==parents[1]!.id&&permittedKinship(s,parents[0]!.organismId,parents[1]!.organismId),'courtship participants');
    requireValue(!policyReason(s,parents[0]!,parents[1]!) && parents.every(c=>!breedingReason(s,c!,'completion',true)),'courtship eligibility/policies');
    for(let i=0;i<2;i++){
      const c=parents[i]!;locked.add(c.id);let previous=c.position;
      requireValue(walkable(session.targets[i])&&Array.isArray(session.paths[i]),'courtship target');
      for(const p of session.paths[i]){
        requireValue(walkable(p)&&Number.isInteger(p.x-.5)&&Number.isInteger(p.y-.5)
          &&(p.x===previous.x||p.y===previous.y)&&Math.abs(p.x-previous.x)+Math.abs(p.y-previous.y)<=1,'courtship path');previous=p;
      }
      requireValue(previous.x===session.targets[i].x&&previous.y===session.targets[i].y,'courtship destination');
    }
  }
}

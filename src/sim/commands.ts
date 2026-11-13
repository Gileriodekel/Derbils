import { syncAwardRecord } from './competition/inventory';
import { createCompetition } from './competition/create';
import { cancelCompetition, withdrawFromCompetitions } from './competition/scheduler';
import { config } from '../data/config';
import { applyEffects } from './needs';
import { canonicalPair } from './mates';
import { abortCourtship, conceive } from './courtship';
import { recordLifeEvent } from './life-records';
import { changeRelationship, ensureRelationship } from './social/relationships';
import { resolveInteraction } from './social/interaction';
import { abortSocialSession } from './social/sessions';
import type { OrganismPair, PlayerCommand, SaveState } from './types';

/** The one player intervention boundary. IDs in commands/policies are permanent organism IDs. */
export function applyPlayerCommand(state: SaveState, command: PlayerCommand): SaveState {
  command=JSON.parse(JSON.stringify(command)) as PlayerCommand;
  const next=JSON.parse(JSON.stringify(state)) as SaveState;
  if(command.kind==='createCompetition'){createCompetition(next,command,'player');return next;}
  if(command.kind==='cancelCompetition'){
    if(Object.keys(command).some(key=>key!=='kind'&&key!=='id'&&key!=='debug'))throw new Error('Invalid cancel command.');
    if(command.debug!==undefined&&typeof command.debug!=='boolean')throw new Error('Invalid debug cancellation flag.');
    const event=next.competitions.find(e=>e.id===command.id);
    if(!event)throw new Error('Competition is not active.');
    if(event.status==='running'&&!command.debug)throw new Error('A running competition has committed results; only debug cancellation can refund it.');
    cancelCompetition(next,event,command.debug?'debug cancellation':'player cancellation',command);return next;
  }
  if(command.kind==='equipCosmetic'){
    if(Object.keys(command).some(k=>!['kind','id','cosmetic'].includes(k)))throw new Error('Invalid cosmetic command.');
    const c=next.creatures.find(c=>c.organismId===command.id);
    if(!c||command.cosmetic!==null&&!c.awards.owned.includes(command.cosmetic))throw new Error('Select an owned cosmetic.');
    c.awards.equipped=command.cosmetic;syncAwardRecord(next,c);
    recordLifeEvent(next,{kind:'intervention',creatureId:c.id,from:c.stage,to:c.stage,relatedCreatureId:null,command});return next;
  }
  const ids='a' in command ? [command.a,command.b] : 'id' in command ? [command.id] : [];
  const creatures=ids.map(id=>next.creatures.find(c=>c.organismId===id));
  if(creatures.some(c=>!c)||new Set(ids).size!==ids.length)throw new Error('Select distinct living creatures.');
  const rules=next.breedingRules;
  if(command.kind==='extinctionRescue')next.settings.extinctionRescue=command.enabled;
  else if(command.kind==='setAffinity'){
    if(!Number.isFinite(command.value)||command.value<config.social.bondBounds[0]||command.value>config.social.bondBounds[1])throw new Error('Affinity must be between -100 and 100.');
    const [a,b]=creatures,existing=ensureRelationship(next,a!.organismId,b!.organismId);
    changeRelationship(next,a!.organismId,b!.organismId,'debug',{bond:command.value-existing.bond,mateBond:0,outcome:'neutral'},command.value);
    recordLifeEvent(next,{kind:'debugAffinity',creatureId:a!.id,from:a!.stage,to:a!.stage,relatedCreatureId:b!.id,command});return next;
  }
  else if(command.kind==='forceBreed'){
    const [a,b]=creatures;
    for(const c of [a!,b!])withdrawFromCompetitions(next,c.id,'debug force breed');
    for(const s of [...next.sessions])if(s.participants.includes(a!.id)||s.participants.includes(b!.id))abortCourtship(next,s);
    for(const s of [...next.social.sessions])if(s.participants.includes(a!.id)||s.participants.includes(b!.id))abortSocialSession(next,s);
    if(next.creatures.length+next.sessions.length>=next.settings.capacity)throw new Error('All population slots are occupied.');
    for(const c of [a!,b!])applyEffects(c,config.actions.court.effects);
    recordLifeEvent(next,{kind:'forceBreed',creatureId:a!.id,from:a!.stage,to:a!.stage,relatedCreatureId:b!.id,command});
    return conceive(next,a!,b!);
  } else if(command.kind==='blockCreature'||command.kind==='encourageCreature'){
    const key=command.kind==='blockCreature'?'blockedIndividuals':'encouragedIndividuals';
    rules[key]=rules[key].filter(id=>id!==command.id);
    if(command.enabled)rules[key].push(command.id);
    rules[key].sort();
  } else if ('a' in command) {
    const pair=canonicalPair(command.a,command.b);
    const key=command.kind==='pair'?'exclusivePairs':command.kind==='blockPair'?'blockedPairs':'encouragedPairs';
    rules[key]=rules[key].filter(p=>!(p[0]===pair[0]&&p[1]===pair[1]));
    if(command.kind==='pair'&&command.enabled)rules.exclusivePairs=rules.exclusivePairs.filter(p=>!p.includes(pair[0])&&!p.includes(pair[1]));
    if(command.enabled)rules[key].push(pair);
    if(command.kind==='pair'&&command.enabled){const [a,b]=creatures;changeRelationship(next,a!.organismId,b!.organismId,'pair',resolveInteraction(a!,b!,'pair',a!.rng,config));}
    rules[key].sort((a:OrganismPair,b:OrganismPair)=>a.join(':').localeCompare(b.join(':')));
  }
  const subject=creatures[0]??next.creatures[0];
  // Empty-world rescue toggles can still be journaled against the latest archived life.
  const subjectId=subject?.id??next.lineage.at(-1)?.id;
  if(subjectId)recordLifeEvent(next,{kind:'intervention',creatureId:subjectId,from:subject?.stage??null,to:subject?.stage??'dead',relatedCreatureId:creatures[1]?.id??null,command});
  if(command.kind==='blockPair'||command.kind==='blockCreature'||command.kind==='pair') {
    for(const s of [...next.sessions]) {
      const pair=s.participants.map(id=>next.creatures.find(c=>c.id===id)!.organismId);
      const blocked=rules.blockedIndividuals.some(id=>pair.includes(id))||rules.blockedPairs.some(p=>p.every(id=>pair.includes(id)))
        ||rules.exclusivePairs.some(p=>p.some(id=>pair.includes(id))&&!p.every(id=>pair.includes(id)));
      if(blocked)abortCourtship(next,s);
    }
  }
  return next;
}

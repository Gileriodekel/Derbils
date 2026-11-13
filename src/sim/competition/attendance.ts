import { config, needKeys } from '../../data/config';
import { skillAptitude } from '../genetics/expression';
import { skillCap, skillLevel } from '../skills';
import { personalityTrait } from '../personality';
import { distance, findPath } from '../navigation';
import { relationship } from '../social/relationships';
import { clamp } from '../needs';
import { entryReason } from './eligibility';
import { competitionEvent } from './journal';
import { bandIndex } from './state';
import type { Candidate, Competition, Creature, SaveState, Terrain } from '../types';
export function competitionCandidate(state:SaveState,c:Creature,e:Competition,attending=false):Candidate{
  const s=config.competitions,b=s.brain,level=e.skills.reduce((n,k)=>n+skillLevel(c,k)/skillCap(c,k),0)/e.skills.length;
  const aptitude=e.skills.reduce((n,k)=>n+skillAptitude(c,k),0)/e.skills.length;
  const rivalry=e.entrantIds.reduce((n,id)=>{const other=state.creatures.find(c=>c.id===id);return Math.max(n,other?Math.max(0,-(relationship(state,c.organismId,other.organismId)?.bond??0))/100:0);},0);
  return {kind:attending?'attendCompetition':'enterCompetition',target:{...s.venue.places[0]},targetFruitId:null,targetCompetitionId:e.id,
    relief:Object.fromEntries(needKeys.map(k=>[k,Math.max(0,-s.workEffects[k])])) as Candidate['relief'],
    personalityFit:personalityTrait(c,'competitiveness'),preference:clamp(b.moodWeight*c.mood,-1,1),
    growthInterest:clamp(b.skillWeight*level+b.aptitudeWeight*aptitude,0,1),socialAffinity:clamp(b.rivalryWeight* rivalry,0,1),
    encouragement:b.interest,courtshipInterest:0,estimatedTravelSeconds:distance(c.position,s.venue.places[0])/config.world.walkBaseSpeed,predictedFatigueIncrease:s.workEffects.fatigue};
}
export function competitionCandidates(state:SaveState,c:Creature):Candidate[]{
  if(!state.competitions.some(e=>e.status==='entryOpen')||state.clock.tick<c.competition.nextEntryTick)return [];
  c.competition.nextEntryTick=state.clock.tick+config.social.targetIntervalTicks;
  return state.competitions.flatMap(e=>{
    if(e.status!=='entryOpen')return [];
    const level=e.skills.reduce((n,k)=>n+skillLevel(c,k),0)/e.skills.length;
    const band=state.competitionState.statistics.entryBands[bandIndex(level,config.competitions.report.levelBands)];band.considered++;
    if(entryReason(state,c,e)||!c.needs)return [];
    // Forecast ordinary passive needs plus the documented work cost; self-care wins early.
    const seconds=e.endTick-state.clock.tick,stage=config.lifecycle.stages[c.stage].needMultiplier;
    if(c.needs.hunger+seconds*config.needs.perMinute.hunger*stage/60>e.entryRules.needMaximum-config.competitions.brain.readinessReserve
      ||c.needs.fatigue+seconds*config.needs.perMinute.fatigue*stage*config.needs.nightFatigueMultiplier/60+config.competitions.workEffects.fatigue>e.entryRules.needMaximum-config.competitions.brain.readinessReserve)return [];
    return [competitionCandidate(state,c,e)];
  });
}
export function enterCompetition(state:SaveState,c:Creature,e:Competition,terrain:readonly Terrain[]):boolean{
  if(entryReason(state,c,e))return false;
  const used=new Set(e.attendance.map(a=>`${a.target.x}:${a.target.y}`));
  const target=config.competitions.venue.places.find(p=>!used.has(`${p.x}:${p.y}`));if(!target)return false;
  const path=findPath(terrain,state.world.width,state.world.height,c.position,target,c);if(path===null)return false;
  e.entrantIds.push(c.id);e.attendance.push({id:c.id,entryPosition:{...c.position},target:{...target},path});c.currentAction=null;
  state.competitionState.statistics.accepted++;
  const level=e.skills.reduce((n,k)=>n+skillLevel(c,k),0)/e.skills.length;
  state.competitionState.statistics.entryBands[bandIndex(level,config.competitions.report.levelBands)].entered++;
  competitionEvent(state,e,'competitionEntered',null,c.id);return true;
}

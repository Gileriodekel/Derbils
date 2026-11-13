import { effectiveRunning } from '../dynasty/movement';
import { deliverPrizes, refundPrizes } from './prizes';
import { config, skillKeys } from '../../data/config';
import { navigationTerrain } from '../food-sources';
import { applyEffects, wellbeing } from '../needs';
import { moveShared } from '../courtship';
import { skillLevel, trainTick } from '../skills';
import { skillAptitude } from '../genetics/expression';
import { distance, nearestTile } from '../navigation';
import { isSafeLand, tileIndex } from '../map';
import { isEligible } from './eligibility';
import { resolveCompetition } from './resolve';
import { competitionEvent } from './journal';
import { commitCompetitionOutcome } from './outcomes';
import type { Competition, Creature, SaveState, Terrain } from '../types';

export function competitionLocked(state:SaveState,id:string):boolean{return state.competitions.some(e=>e.entrantIds.includes(id));}
function release(state:SaveState,e:Competition,id:string):void{
  const c=state.creatures.find(c=>c.id===id),attendance=e.attendance.find(a=>a.id===id);if(!c)return;
  if(e.status==='running'&&attendance){const terrain=navigationTerrain(state.world),p=attendance.entryPosition;
    const safe=isSafeLand(terrain[tileIndex(p,state.world.width)])?p:nearestTile(terrain,state.world.width,p,isSafeLand);if(safe)c.position={...safe};
  }
  c.currentAction=null;c.nextDecisionTick=state.clock.tick+1;
}
function archive(state:SaveState,e:Competition):void{
  state.competitions=state.competitions.filter(other=>other.id!==e.id);
  state.competitionHistory=[...state.competitionHistory,e].slice(-config.competitions.historyLimit);
}
export function cancelCompetition(state:SaveState,e:Competition,reason:string,command?:Extract<import('../types').PlayerCommand,{kind:'cancelCompetition'}>):void{
  if(e.status==='resolved'||e.status==='cancelled')throw new Error('Competition is already finished.');
  for(const id of e.entrantIds)release(state,e,id);
  refundPrizes(state,e);e.status='cancelled';e.finishedTick=state.clock.tick;e.cancellationReason=reason;e.attendance=[];e.results=null;
  const stats=state.competitionState.statistics;stats.cancelled++;stats.cancellationReasons[reason]=(stats.cancellationReasons[reason]??0)+1;
  competitionEvent(state,e,'competitionCancelled',reason,undefined,command);archive(state,e);
}
function drop(state:SaveState,e:Competition,id:string,reason:string):void{
  release(state,e,id);e.entrantIds=e.entrantIds.filter(other=>other!==id);e.attendance=e.attendance.filter(a=>a.id!==id);
  e.drops.push({id,tick:state.clock.tick,reason});
  if(e.results)projectResult(e);state.competitionState.statistics.dropped++;
  competitionEvent(state,e,'competitionDropped',reason,id);
}
/** Interval work. The venue overlay never replaces authoritative gathering coordinates. */
export function advanceCompetitionWork(state:SaveState,terrain:readonly Terrain[]):void{
  if(!state.competitions.length)return;
  const creatures=new Map(state.creatures.map(c=>[c.id,c]));
  for(const e of state.competitions){
    for(const a of e.attendance){const c=creatures.get(a.id);if(!c||!isEligible(c,e).eligible)continue;
      if(e.status==='entryOpen'){moveShared(c,a.path,terrain,state.world.width);continue;}
      if(e.status!=='running')continue;
      const elapsed=state.clock.tick-1-e.startTick;
      if(elapsed<0||elapsed>=config.competitions.durationTicks)continue;
      applyEffects(c,config.competitions.workEffects,1/config.competitions.durationTicks);
      const leg=e.format==='circuit'?Math.min(e.skills.length-1,Math.floor(elapsed/(config.competitions.durationTicks/e.skills.length))):0;
      const start=state.clock.tick-1,period=Math.floor(start/config.prizes.xpPeriodTicks),awards=c.awards;
      if(awards.xpPeriod!==period){awards.xpPeriod=period;awards.xpThisPeriod=0;}
      const skill=e.skills[leg],before=c.xp[skill];
      trainTick(c,skill,config.skills.improvisedQuality,start,Math.max(0,config.prizes.xpPerPeriodCap-awards.xpThisPeriod));
      const gain=c.xp[skill]-before;awards.xpThisPeriod=Math.min(config.prizes.xpPerPeriodCap,awards.xpThisPeriod+gain);awards.totalXp+=gain;
    }
  }
}
export interface SchedulerOperations { events:number; entrants:number }
/** Bounded active-event scheduling; tick supplies the single linear creature lookup. */
export function stepCompetitions(state:SaveState,creatures:ReadonlyMap<string,Creature>,operations?:SchedulerOperations):void{
  if(!state.competitions.length)return;
  for(const e of [...state.competitions]){
    if(operations)operations.events++;
    if(e.status==='scheduled'){
      if(state.clock.tick>=e.entryOpenTick){e.status='entryOpen';competitionEvent(state,e,'competitionOpened');}
      continue; // The entry-open boundary always exists, even for the shortest valid delay.
    }
    for(const id of [...e.entrantIds]){
      if(operations)operations.entrants++;
      const c=creatures.get(id),reason=c?isEligible(c,e).reason:'life ended';
      if(reason){drop(state,e,id,reason);continue;}
      if(e.status==='entryOpen'&&state.clock.tick>=e.startTick){const a=e.attendance.find(a=>a.id===id)!;
        if(a.path.length||distance(c!.position,a.target)>config.competitions.venue.arrivalTolerance)drop(state,e,id,'absent at start');
      }
    }
    if(e.status==='entryOpen'&&state.clock.tick>=e.startTick){
      if(e.entrantIds.length<config.competitions.minimumEntrants){cancelCompetition(state,e,'too few entrants');continue;}
      for(const skill of e.skills)state.competitionState.skillCooldowns[skill]=state.clock.tick+config.competitions.skillCooldownTicks;
      e.status='running';e.startedIds=[...e.entrantIds];
      e.snapshots=e.entrantIds.map(id=>{const c=creatures.get(id)!;c.competition.stats.entered++;
        return {id,organismId:c.organismId,levels:Object.fromEntries(skillKeys.map(k=>[k,k==='run'?Math.floor(effectiveRunning(c,state.clock.tick)):skillLevel(c,k)])) as Creature['xp'],
          aptitudes:Object.fromEntries(skillKeys.map(k=>[k,skillAptitude(c,k)])) as Creature['xp'],wellbeing:wellbeing(c.needs!),stagePerformance:config.lifecycle.stages[c.stage].performanceMultiplier,confidence:c.awards.confidenceUntilTick>state.clock.tick?config.prizes.confidenceBonus:0};
      });
      e.results=resolveCompetition(e,e.snapshots,state.rng.competition,config);state.rng.competition=e.results.rng;
      competitionEvent(state,e,'competitionStarted');continue;
    }
    if(e.status!=='running')continue;
    if(e.entrantIds.length<config.competitions.minimumEntrants){cancelCompetition(state,e,'too few remaining entrants');continue;}
    if(state.clock.tick<e.endTick)continue;
    // Keep committed rolls; dropping an entrant never rerolls another entrant.
    projectResult(e);
    if(!e.awarded)commitCompetitionOutcome(state,e);
    const paid=deliverPrizes(state,e.id);Object.assign(e,paid.competitions.find(p=>p.id===e.id)!);Object.assign(state,paid);
    competitionEvent(state,e,'competitionResult',e.results!.placements.map(p=>`${p.rank}. ${p.id} ${p.score.toFixed(3)}`).join('; '),e.results!.placements[0].id);
    for(const id of e.entrantIds)release(state,e,id);
    e.status='resolved';e.finishedTick=state.clock.tick;e.attendance=[];archive(state,e);
  }
}

function projectResult(e:Competition):void{
  const present=new Set(e.entrantIds),r=e.results!;
  r.placements=r.placements.filter(p=>present.has(p.id)).map((p,i)=>({...p,rank:i+1}));r.effects=r.effects.filter(p=>present.has(p.id));
  for(const round of r.rounds){round.ranking=round.ranking.filter(p=>present.has(p.id)).map((p,i)=>({...p,rank:i+1}));round.effects=round.effects.filter(p=>present.has(p.id));
    if(round.winnerId&&!present.has(round.winnerId))round.winnerId=null;
    round.margin=round.ranking.length>=2?Math.max(0,round.ranking[0].score-round.ranking[1].score):0;
  }
}
export function withdrawFromCompetitions(state:SaveState,id:string,reason:string):void{
  for(const e of [...state.competitions])if(e.entrantIds.includes(id)){
    drop(state,e,id,reason);
    if(e.status==='running'&&e.entrantIds.length<config.competitions.minimumEntrants)cancelCompetition(state,e,'too few remaining entrants');
  }
}

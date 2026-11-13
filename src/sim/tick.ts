import { stepDynastyCompetitions } from './dynasty/competitions';
import { advanceSocialLoneliness, socialFoodEncounters } from './dynasty/social';
import { recoverEnergy } from './dynasty/movement';
import { compactLineage } from './archive';
import { advance } from './advance';
import { collectChanges, observeJournal } from './event-output';
import { grantDailyCache } from './competition/inventory';
import { maintainPrizeFruit } from './competition/prizes';
import { advanceCompetitionWork, stepCompetitions, competitionLocked } from './competition/scheduler';
import { advanceCourtships, resolveCourtships } from './courtship';
import { advanceAppearanceModifiers } from './appearance/modifiers';
import { rescueExtinction } from './population';
import { config } from '../data/config';
import { advanceAction, resolveCompletion } from './actions';
import { decide, urgentActionMatches, validAction } from './brain';
import { growSources, navigationTerrain, validFoodClaim } from './food-sources';
import { advanceMood, advanceNeeds, wellbeing } from './needs';
import { zeroSkills } from './skills';
import { decayPersonality } from './personality';
import { isMobile } from './life-stages';
import { resolveLifeBoundaries } from './lifecycle';
import { advanceSocialSessions, resolveSocialSessions } from './social/sessions';
import { buildSpatialIndex } from './social/spatial';
import { maintainRelationships } from './social/relationships';
import type { Creature, RngStreams, SaveState, TickOutput, TickObserver } from './types';

/** One simulated second. Inputs, including RNG streams, are never mutated. */
export function tick(state: SaveState, rng: RngStreams = state.rng, output?: TickOutput, observer?: TickObserver): SaveState {
  let next: SaveState = {
    ...state, dynasty: { ...state.dynasty, events: [...state.dynasty.events] }, rng: { ...rng }, clock: { ...state.clock, tick: state.clock.tick + 1 },
    counters: { ...state.counters }, inventory: {fruit:{...state.inventory.fruit},seeds:{...state.inventory.seeds},items:{...state.inventory.items},cosmetics:{...state.inventory.cosmetics}}, prizeLedger:{...state.prizeLedger,supplied:{...state.prizeLedger.supplied},eaten:{...state.prizeLedger.eaten},overflow:{...state.prizeLedger.overflow}},
    competitions: state.competitions.map(e=>({...e,deliveries:[...e.deliveries],entrantIds:[...e.entrantIds],startedIds:[...e.startedIds],attendance:e.attendance.map(a=>({...a,path:a.path.map(p=>({...p}))})),drops:e.drops.map(d=>({...d})),results:e.results?{...e.results,rounds:e.results.rounds.map(r=>({...r,ranking:[...r.ranking],effects:[...r.effects]}))}:null})),
    competitionState: {...state.competitionState,skillCooldowns:{...state.competitionState.skillCooldowns},statistics:state.competitions.length?{...state.competitionState.statistics,cancellationReasons:{...state.competitionState.statistics.cancellationReasons},
      entryBands:state.competitionState.statistics.entryBands.map(b=>({...b})),aptitudeBands:state.competitionState.statistics.aptitudeBands.map(b=>({...b})),levelBands:state.competitionState.statistics.levelBands.map(b=>({...b})),placementCorrelation:{...state.competitionState.statistics.placementCorrelation}}:state.competitionState.statistics},
    social: { ...state.social, sessions: state.social.sessions.map(s => ({ ...s, paths: s.paths.map(p => p.map(q => ({ ...q }))) as typeof s.paths })),
      statistics: { ...state.social.statistics, aptitudeWins: state.social.statistics.aptitudeWins.map(b => ({ ...b })), correlation: { ...state.social.statistics.correlation } } },
    sessions: state.sessions.map(s => ({ ...s, paths: s.paths.map(p => p.map(q => ({...q}))) as typeof s.paths })),
    world: { ...state.world, plants: state.world.plants.map(p => ({ ...p, ...(p.berries ? { berries: [...p.berries] as [boolean, boolean] } : {}) })),
      looseFruit: state.world.looseFruit.filter(f => f.prize || state.clock.tick + 1 - f.droppedTick < config.food.looseSpoilDays * config.clock.dayTicks).map(f=>({...f,prize:f.prize?{...f.prize}:undefined})).map(f=>{if(!f.prize)delete f.prize;return f;}) },
    creatures: state.creatures.map(c => ({
      ...c, dynasty: { ...c.dynasty, food: c.dynasty.food.map(f => ({...f})) }, awards:{...c.awards,owned:[...c.awards.owned],trophies:[...c.awards.trophies],bestPerformance:{...c.awards.bestPerformance}}, competition: {...c.competition,stats:{...c.competition.stats,bestPlacement:{...c.competition.stats.bestPlacement}}}, breeding: { ...c.breeding }, position: { ...c.position }, needs: c.needs ? { ...c.needs } : null, welfare: { ...c.welfare },
      foodPreferences: { ...c.foodPreferences }, lastFiveFoods: [...c.lastFiveFoods],
      xp: { ...c.xp }, practiceTicks: { ...c.practiceTicks }, trainingTicks: { ...c.trainingTicks },
      activityPreferences: { ...c.activityPreferences }, skillBonuses: { ...c.skillBonuses },
      personalityDrift: { ...c.personalityDrift },
      social: { ...c.social, targets: [...c.social.targets], contestCooldowns: { ...c.social.contestCooldowns }, rivalBoosts: { ...c.social.rivalBoosts },
        rivalExtraXpToday: { ...c.social.rivalExtraXpToday }, rewardTicks: { ...c.social.rewardTicks }, preferences: { ...c.social.preferences } },
      currentAction: c.currentAction ? { ...c.currentAction, target: { ...c.currentAction.target }, path: c.currentAction.path.map(p => ({ ...p })) } : null,
    })).sort((a, b) => a.id.localeCompare(b.id)),
  };
  if(output){next.events=[...state.events];observeJournal(next.events,output);}
  observer?.phase('clone',state.creatures.length);
  growSources(next, state.clock.tick, next.clock.tick);
  observer?.phase('resources',next.world.plants.length);
  if (!next.creatures.length) {
    maintainPrizeFruit(next);
    if(next.competitions.length||next.settings.autoCompetitions)stepCompetitions(next,new Map());
    stepDynastyCompetitions(next);grantDailyCache(next);next=rescueExtinction(next);
    compactLineage(next);
    if(output)collectChanges(state,next,output);
    return next;
  }
  const terrain = navigationTerrain(next.world);
  const competitionWorkers:Creature[]=[];
  for (const creature of next.creatures) {
    creature.dynasty.moving=false;
    advanceAppearanceModifiers(creature, next.clock.tick);
    decayPersonality(creature);
    if (creature.social.mourning && creature.social.mourning.untilTick <= next.clock.tick) creature.social.mourning = null;
    if (!isMobile(creature)) continue;
    const inCompetition=competitionLocked(next,creature.id);
    if(inCompetition)competitionWorkers.push(creature);
    const locked = inCompetition || next.sessions.some(s => s.participants.includes(creature.id)) || next.social.sessions.some(s => s.participants.includes(creature.id));
    if (!locked && creature.currentAction && !validAction(next, creature, creature.currentAction, terrain)) creature.currentAction = null;
    advanceNeeds(creature, state.clock.tick);
    advanceSocialLoneliness(next,creature);
    // Urgency may interrupt even the eight-work-tick commitment.
    if (!locked && !urgentActionMatches(creature)) {
      creature.currentAction = null;
      decide(next, creature, terrain);
    }
    if (!locked) advanceAction(creature, terrain, next.world.width, state.clock.tick);
    // A bonus expiring at end still applied to [start,end); meals then add fresh bonuses.
    if(!inCompetition)expireSkillBonuses(creature,next.clock.tick);
  }
  observer?.phase('ordinaryWork',next.creatures.length);
  const courtshipOperations=next.sessions.length;
  advanceCourtships(next, terrain);
  observer?.phase('courtshipWork',courtshipOperations);
  const socialOperations=next.social.sessions.length;
  advanceSocialSessions(next, terrain);
  observer?.phase('socialWork',socialOperations);
  const competitionOperations=observer?next.competitions.reduce((n,e)=>n+e.entrantIds.length,0):0;
  advanceCompetitionWork(next, terrain);
  observer?.phase('competitionWork',competitionOperations);
  for(const creature of competitionWorkers)expireSkillBonuses(creature,next.clock.tick);
  for(const c of next.creatures)for(const skill of Object.keys(c.social.rivalBoosts) as (keyof typeof c.xp)[])
    if(c.social.rivalBoosts[skill]!.expiresTick<=next.clock.tick)delete c.social.rivalBoosts[skill];
  observer?.phase('sharedMaintenance',next.creatures.length);
  for (const creature of next.creatures) {
    if (!creature.needs) continue;
    recoverEnergy(creature);
    advanceMood(creature);
    creature.welfare.total += wellbeing(creature.needs) * config.clock.tickSeconds;
    creature.welfare.ticks += config.clock.tickSeconds;
  }
  observer?.phase('mood',next.creatures.length);
  next = resolveLifeBoundaries(next);
  observer?.phase('lifecycle',next.creatures.length);
  maintainPrizeFruit(next);
  next = resolveCourtships(next);
  observer?.phase('courtshipCompletion',courtshipOperations);
  resolveSocialSessions(next);
  observer?.phase('socialCompletion',socialOperations);
  if(next.competitions.length||next.settings.autoCompetitions)stepCompetitions(next,new Map(next.creatures.map(c=>[c.id,c])));
  observer?.phase('competitionCompletion',competitionOperations);
  stepDynastyCompetitions(next);
  grantDailyCache(next);
  maintainRelationships(next);
  socialFoodEncounters(next);
  next = rescueExtinction(next);
  observer?.phase('completion',next.competitions.length+next.social.sessions.length);
  const socialIndex = buildSpatialIndex(next.creatures,next.clock.tick);
  for (const creature of next.creatures) {
    if (next.clock.tick % config.clock.dayTicks === 0) { creature.practiceTicks = zeroSkills(); creature.social.rivalExtraXpToday = zeroSkills(); }
    if (next.clock.tick % config.social.maintenanceTicks === 0) for (const [id,until] of Object.entries(creature.social.contestCooldowns)) if (until <= next.clock.tick) delete creature.social.contestCooldowns[id];
    if (!isMobile(creature) || competitionLocked(next,creature.id) || next.sessions.some(s => s.participants.includes(creature.id)) || next.social.sessions.some(s => s.participants.includes(creature.id))) continue;
    const completed = resolveCompletion(next, creature);
    if (completed || !creature.currentAction || next.clock.tick >= creature.nextDecisionTick) {
      decide(next, creature, terrain, socialIndex);
      const interval = config.ai.decisionIntervalTicks;
      const offset = Number(creature.id.slice(2)) % interval;
      creature.nextDecisionTick = next.clock.tick + ((offset - next.clock.tick % interval + interval) % interval || interval);
    }
  }
  for(const c of next.creatures)if(c.currentAction&&['eat','gather'].includes(c.currentAction.kind)&&!validFoodClaim(next,c,c.currentAction)){c.currentAction=null;c.nextDecisionTick=next.clock.tick+1;}
  observer?.phase('decisions',next.creatures.length);
  compactLineage(next);
  observer?.phase('archive',next.lineage.length);
  if(output)collectChanges(state,next,output);
  return next;
}

export function advanceTicks(state: SaveState, count: number): SaveState {
  return advance(state,state.rng,count);
}

function expireSkillBonuses(creature:Creature,tick:number):void{
  for(const key of Object.keys(creature.skillBonuses) as (keyof typeof creature.skillBonuses)[])
    if(creature.skillBonuses[key]!.expiresTick<=tick)delete creature.skillBonuses[key];
}

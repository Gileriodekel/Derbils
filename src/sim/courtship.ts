import { lonelinessBreedingFactor } from './dynasty/social';
import { stageStartAge } from './life-stages';
import { movePath } from './dynasty/movement';
import { config, needKeys } from '../data/config';
import { breedingDensity, breedingPopulationTarget, breedingReason, compatibility, encouraged, hasEligibleMate, mateCandidates, occupiedSlots, policyReason } from './mates';
import { softmaxIndex, scoreUtility } from './utility';
import { uniform } from './rng';
import { distance } from './navigation';
import { courtshipSite } from './courtship-site';
import { applyEffects } from './needs';
import { crossover, mutate } from './genetics/inheritance';
import { spawnCreature } from './spawn';
import { recordLifeEvent } from './life-records';
import { completeCourtshipBond } from './social/outcomes';
import type { Candidate, Courtship, Creature, DeepReadonly, Point, SaveState, Terrain } from './types';

export function courtCandidate(state: SaveState, c: Creature, mate: Creature): Candidate {
  const effects=config.actions.court.effects, match=compatibility(state,c,mate);
  return { kind:'court',target:{...mate.position},targetCreatureId:mate.id,targetFruitId:null,
    relief:Object.fromEntries(needKeys.map(k => [k,Math.max(0,-effects[k])])) as Candidate['relief'],
    personalityFit:config.ai.defaultPersonalityFit,preference:0,growthInterest:0,
    socialAffinity:Math.max(-1,Math.min(1,match.bond/100+config.social.mateAffinityWeight*match.mateBond/100)),
    encouragement:encouraged(state,c,mate) ? config.breeding.encouragementUtility : 0,
    courtshipInterest:config.breeding.courtshipInterest*match.score,
    estimatedTravelSeconds:distance(c.position,mate.position)/config.world.walkBaseSpeed,
    predictedFatigueIncrease:Math.max(0,effects.fatigue) };
}

/** Mate softmax is separate from action softmax; at most one attempt roll per configured interval. */
export function offerCourtship(state: SaveState, c: Creature, nearby?: readonly DeepReadonly<Creature>[]): Candidate | null {
  if (breedingReason(state,c) || state.clock.tick < c.breeding.nextAttemptTick
    || state.clock.tick % config.ai.decisionIntervalTicks !== Number(c.id.slice(2)) % config.ai.decisionIntervalTicks) return null;
  c.breeding.nextAttemptTick=state.clock.tick+config.breeding.attemptIntervalTicks;
  if (occupiedSlots(state)>=state.settings.capacity) return null;
  const density=breedingDensity(state);
  if(density===0){
    // Ranking cannot affect a rejected proposal. Preserve the sampler and attempt draws exactly.
    if(config.breeding.candidateCount>0&&hasEligibleMate(state,c,nearby))c.rng=uniform(uniform(c.rng).state).state;
    return null;
  }
  const choices=mateCandidates(state,c,nearby).filter(m => !m.reason).slice(0,config.breeding.candidateCount);
  if (!choices.length) return null;
  const choice=softmaxIndex(choices.map(m => m.score + (m.encouraged ? config.breeding.encouragementUtility : 0)),c.rng,config.breeding.mateTemperature);
  c.rng=choice.rng;
  const match=choices[choice.index], mate=state.creatures.find(other => other.id===match.creatureId)!;
  const roll=uniform(c.rng); c.rng=roll.state;
  if (roll.value >= Math.min(1,config.breeding.attemptChance*match.score*density*lonelinessBreedingFactor(c)*lonelinessBreedingFactor(mate)
    *(match.encouraged ? config.breeding.encouragementMultiplier : 1))) return null;
  if (scoreUtility(mate,courtCandidate(state,mate,c)).total < config.breeding.recipientMinimumUtility) return null;
  return courtCandidate(state,c,mate);
}

export function startCourtship(state: SaveState, a: Creature, b: Creature, terrain: readonly Terrain[]): boolean {
  if (occupiedSlots(state)>=state.settings.capacity || breedingReason(state,a) || breedingReason(state,b)
    || policyReason(state,a,b) || compatibility(state,a,b).reason) return false;
  const site=courtshipSite(state,a,b,terrain);
  if(site){
    const session:Courtship={id:`s_${String(state.counters.session++).padStart(8,'0')}`,participants:[a.id,b.id],
      startedTick:state.clock.tick,workStartedTick:null,workTicks:0,...site};
    state.sessions=[...state.sessions,session];a.currentAction=null;b.currentAction=null;
    recordLifeEvent(state,{kind:'courtship',creatureId:a.id,from:'adult',to:'adult',relatedCreatureId:b.id});
    return true;
  }
  return false;
}

export function abortCourtship(state: SaveState, session: Courtship): void {
  state.sessions=state.sessions.filter(s => s.id!==session.id);
  for (const id of session.participants) {
    const c=state.creatures.find(c => c.id===id);
    if(c){c.currentAction=null;c.nextDecisionTick=state.clock.tick+1;}
  }
  recordLifeEvent(state,{kind:'courtshipAborted',creatureId:session.participants[0],from:'adult',to:'adult',relatedCreatureId:session.participants[1]});
}

/** The existing movement handler owns ordinary travel; shared travel/work is resolved once here. */
export function advanceCourtships(state: SaveState, terrain: readonly Terrain[]): void {
  for(const s of [...state.sessions]) {
    const parents=s.participants.map(id => state.creatures.find(c => c.id===id));
    const [a,b]=parents;
    if(!a||!b||breedingReason(state,a,'completion',true)||breedingReason(state,b,'completion',true)||policyReason(state,a,b)) {abortCourtship(state,s);continue;}
    if(s.workStartedTick===null) {
      const arrived=s.paths.every(p => p.length===0);
      if(!arrived && state.clock.tick-s.startedTick>config.breeding.travelTimeoutTicks){abortCourtship(state,s);continue;}
      if(!arrived) {
        for(let i=0;i<2;i++)moveShared(parents[i]!,s.paths[i],terrain,state.world.width);
        continue; // Travel/arrival cannot grant a full work tick.
      }
      if(breedingReason(state,a,'working',true)||breedingReason(state,b,'working',true)){abortCourtship(state,s);continue;}
      s.workStartedTick=state.clock.tick;
      recordLifeEvent(state,{kind:'mating',creatureId:a.id,from:'adult',to:'adult',relatedCreatureId:b.id});
    }
    for(const c of [a,b])applyEffects(c,config.actions.court.effects,1/config.breeding.courtshipWorkTicks);
    s.workTicks++;
  }
}
export function moveShared(c: Creature,path: Point[],terrain: readonly Terrain[],width: number): void {
  movePath(c,path,terrain,width,c.stageStartedTick+c.age-stageStartAge(c.stage,c.lifeIndex));
}

/** One completed clutch: independent offspring genomes, one parental cooldown/bond outcome.
 * The debug command still creates one egg. Natural clutches are bounded at completion. */
export function conceive(state: SaveState, a: Creature, b: Creature, nest: Point=a.position, eggs=1): SaveState {
  const [A,B]=[a,b].sort((x,y)=>x.organismId.localeCompare(y.organismId));
  let next=state;
  for(let i=0;i<eggs && occupiedSlots(next)<next.settings.capacity;i++){
    const crossed=crossover(A.genome,B.genome,next.rng.genetics),child=mutate(crossed.genome,crossed.rng);
    const born=spawnCreature({...next,rng:{...next.rng,genetics:child.rng}},child.genome,
      {stage:'egg',parentIds:[A.id,B.id],near:nest,mutations:child.mutations});
    if(born.creatures.length===next.creatures.length)break;
    next=born;
  }
  if(next.creatures.length===state.creatures.length) return state;
  completeCourtshipBond(next,a,b);
  for(const c of next.creatures.filter(c=>c.id===a.id||c.id===b.id)){
    c.breeding.clutches=Math.min(config.breeding.maximumClutches,c.breeding.clutches+1); c.breeding.cooldownUntil=state.clock.tick+config.breeding.cooldownDays*config.clock.dayTicks;
    c.lastCompletedAction='court';c.currentAction=null;
  }
  return next;
}
export function resolveCourtships(state: SaveState): SaveState {
  let next=state;
  for(const s of [...next.sessions]) {
    const [a,b]=s.participants.map(id=>next.creatures.find(c=>c.id===id));
    if(!a||!b||breedingReason(next,a,'completion',true)||breedingReason(next,b,'completion',true)||policyReason(next,a,b)){abortCourtship(next,s);continue;}
    if(s.workTicks<config.breeding.courtshipWorkTicks)continue;
    next.sessions=next.sessions.filter(other=>other.id!==s.id);
    // A session reserves one egg. Extra eggs use available room below the target;
    // shortening the clutch near capacity never discards an existing reservation.
    const eggs=Math.max(1,Math.min(config.breeding.clutchEggs,Math.floor(breedingPopulationTarget(next))-occupiedSlots(next)));
    next=conceive(next,a,b,s.nest,eggs);
  }
  return next;
}

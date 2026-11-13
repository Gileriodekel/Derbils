import { competitionCandidates, enterCompetition } from './competition/attendance';
import { offerCourtship, startCourtship } from './courtship';
import { config, actionKinds, fruitKinds, needKeys, skillKeys } from '../data/config';
import { isSafeLand, terrainCost, tileCenter, tileIndex } from './map';
import { distance, findPath, nearestTile } from './navigation';
import { urgentNeed } from './needs';
import { uniform } from './rng';
import { utilityTotal, softmaxIndex } from './utility';
import { availableFood, foodKind, validFoodClaim } from './food-sources';
import { foodPreference } from './preferences';
import { skillCap, skillLevel, trainingSkill } from './skills';
import { trainingTargets, validTraining } from './training';
import { skillAptitude } from './genetics/expression';
import { personalityTrait } from './personality';
import { socialCandidates } from './social/candidates';
import { buildSpatialIndex, type SpatialIndex } from './social/spatial';
import { startSocialSession } from './social/sessions';
import { breedingReason } from './mates';
import type { Action, ActionKind, Candidate, Creature, Point, SaveState, Terrain } from './types';

const actionRelief=Object.fromEntries(actionKinds.map(kind=>[kind,Object.fromEntries(needKeys.map(k=>[k,Math.max(0,-config.actions[kind].effects[k])]))])) as Record<ActionKind,Candidate['relief']>;
const fruitRelief=Object.fromEntries(fruitKinds.map(kind=>[kind,Object.fromEntries(needKeys.map(k=>[k,Math.max(0,-config.fruit[kind].effects[k])]))])) as Record<typeof fruitKinds[number],Candidate['relief']>;

export function makeCandidate(state: SaveState, creature: Creature, kind: ActionKind, target: Point, targetFruitId: string | null = null, targetPlantId?: string, targetItemId?: string): Candidate {
  const skill = trainingSkill(kind);
  const fruit = (kind === 'eat' || kind === 'gather') ? foodKind(state, { targetFruitId, targetPlantId }) : null;
  const effects = fruit ? config.fruit[fruit].effects : config.actions[kind].effects;
  const preference = fruit ? foodPreference(creature, fruit) : skill ? creature.activityPreferences[skill].learnedMean : 0;
  const candidate: Candidate = {
    kind, target, targetFruitId,
    relief: kind==='gather' ? actionRelief[kind] : fruit ? fruitRelief[fruit] : actionRelief[kind],
    personalityFit: skill === 'fly' ? personalityTrait(creature, 'boldness') : config.ai.defaultPersonalityFit,
    preference: fruit && (creature.needs?.hunger ?? 0) >= config.needs.urgentThreshold ? Math.max(0, preference) : preference,
    growthInterest: kind === 'gather' ? config.dynasty.plants.gatherInterest : skill ? skillAptitude(creature, skill) * (1 - skillLevel(creature, skill) / skillCap(creature, skill)) : 0,
    socialAffinity: 0, encouragement: skill && creature.social.rivalBoosts[skill] && creature.social.rivalBoosts[skill]!.expiresTick > state.clock.tick
      ? Math.min(config.social.rivalry.utilityBoost, config.social.rivalry.utilityBoost * creature.social.rivalBoosts[skill]!.amount / config.social.rivalry.xpBoost) : 0, courtshipInterest: 0,
    estimatedTravelSeconds: distance(creature.position, target) / config.world.walkBaseSpeed,
    predictedFatigueIncrease: Math.max(0, effects.fatigue),
  };
  if (targetPlantId) candidate.targetPlantId = targetPlantId;
  if (targetItemId) candidate.targetItemId = targetItemId;
  return candidate;
}

export function validAction(state: SaveState, creature: Creature, action: Action, terrain: readonly Terrain[]): boolean {
  const targetCode = terrain[tileIndex(action.target, state.world.width)];
  if (!Number.isFinite(terrainCost(targetCode))) return false;
  if (action.kind === 'eat' || action.kind === 'gather') return validFoodClaim(state, creature, action);
  if (action.kind === 'graze') return targetCode === 0;
  if (action.kind === 'sleep' || action.kind === 'idle') return isSafeLand(targetCode);
  if (action.kind === 'avoid') return state.creatures.some(c => c.id === action.targetCreatureId) && isSafeLand(targetCode);
  if (trainingSkill(action.kind)) return validTraining(state, creature, action, terrain);
  return config.lifecycle.stages[creature.stage].mobile;
}

export function urgentActionMatches(creature: Creature): boolean {
  const need = urgentNeed(creature);
  return need === null || (need === 'hunger'
    ? creature.currentAction?.kind === 'eat' || creature.currentAction?.kind === 'graze'
    : creature.currentAction?.kind === 'sleep');
}

/** Mutates only a private state/creature clone owned by tick. */
export function decide(state: SaveState, creature: Creature, terrain: readonly Terrain[], socialIndex?: SpatialIndex): void {
  if (!creature.needs || !config.lifecycle.stages[creature.stage].mobile) { creature.currentAction = null; return; }
  const current = creature.currentAction;
  const urgent = urgentNeed(creature);
  if (current && validAction(state, creature, current, terrain) && urgentActionMatches(creature)
    && (!urgent || !current.path.length) && current.workTicks < config.ai.minimumWorkCommitTicks) return;

  // Needs and all utility inputs are fixed throughout this decision. Sorting reuses exact scores.
  const scores = new Map<Candidate,number>();
  const keys = new Map<Candidate,string>();
  function orderKey(candidate:Candidate):string {
    let key=keys.get(candidate);if(key===undefined){key=stableKey(candidate);keys.set(candidate,key);}return key;
  }
  function score(candidate:Candidate):number {
    const previous=scores.get(candidate);if(previous!==undefined)return previous;
    const value=utilityTotal(creature,candidate);scores.set(candidate,value);return value;
  }
  const here = terrain[tileIndex(creature.position, state.world.width)];
  const safe = isSafeLand(here) ? { ...creature.position } : nearestTile(terrain, state.world.width, creature.position, isSafeLand);
  const grass = here === 0 ? { ...creature.position } : nearestTile(terrain, state.world.width, creature.position, t => t === 0);
  const candidates: Candidate[] = [];
  if (grass && !creature.dynasty.food.length && (urgent==='hunger' || (!state.world.plants.length && !state.world.looseFruit.length))) candidates.push(makeCandidate(state, creature, 'graze', grass));
  if (safe) candidates.push(makeCandidate(state, creature, 'sleep', safe), makeCandidate(state, creature, 'idle', safe));
  if (creature.needs.hunger >= config.needs.eatMinimumHunger) {
    const foods = availableFood(state, creature, terrain)
      .map(f => makeCandidate(state, creature, 'eat', f.target, f.targetFruitId, f.targetPlantId))
      .sort((a, b) => (urgent==='hunger' ? distance(creature.position,a.target)-distance(creature.position,b.target) : score(b)-score(a)) || orderKey(a).localeCompare(orderKey(b)))
      .slice(0, config.ai.candidateCounts.food);
    candidates.push(...foods);
  }
  if (!urgent) {
    if (creature.dynasty.food.length < config.dynasty.plants.carryCapacity) {
      const food = availableFood(state,creature,terrain).filter(f=>f.targetPlantId)
        .sort((a,b)=>distance(creature.position,a.target)-distance(creature.position,b.target)).slice(0,config.ai.candidateCounts.food);
      candidates.push(...food.map(f=>makeCandidate(state,creature,'gather',f.target,f.targetFruitId,f.targetPlantId)));
    }
    candidates.push(...competitionCandidates(state,creature));
    const index = socialIndex ?? buildSpatialIndex(state.creatures);
    // Choose a partner by the same seeded utility softmax, then let each behavior compete.
    // Keeping only the strongest edge would prevent newcomers from ever making friends.
    const offers = socialCandidates(state, creature, index, terrain), social: Candidate[] = [];
    for (const kind of ['play','comfort','contest','avoid'] as const) {
      const choices = offers.filter(candidate=>candidate.kind===kind); if (!choices.length) continue;
      const choice = softmaxIndex(choices.map(candidate=>score(candidate)),creature.rng);
      creature.rng=choice.rng; social.push(choices[choice.index]);
    }
    const court = !breedingReason(state,creature) && state.clock.tick>=creature.breeding.nextAttemptTick
      ? offerCourtship(state, creature) : null;
    if (court) social.unshift(court);
    candidates.push(...social.slice(0, config.social.targetLimit));
    const wanderTarget = current?.kind === 'wander' ? current.target : chooseWander(state, creature, terrain);
    if (wanderTarget) candidates.push(makeCandidate(state, creature, 'wander', wanderTarget));
    for (const skill of skillKeys) {
      const targets = trainingTargets(state, creature, skill, terrain)
        .map(t => makeCandidate(state, creature, config.skillCatalog[skill].trainingActivity, t.target, null, undefined, t.targetItemId))
        .sort((a, b) => score(b) - score(a) || orderKey(a).localeCompare(orderKey(b)))
        .slice(0, config.ai.candidateCounts.perSkill);
      candidates.push(...targets);
    }
  }
  const eligible = candidates.filter(c => urgent === null || (urgent === 'hunger' ? c.kind === 'eat' || c.kind === 'graze' : c.kind === 'sleep'));
  const ranked = eligible.map(candidate => ({ candidate, score: score(candidate) }))
    .sort((a, b) => b.score - a.score || orderKey(a.candidate).localeCompare(orderKey(b.candidate)));
  if (current && validAction(state, creature, current, terrain) && urgentActionMatches(creature)
    && (!urgent || !current.path.length || ranked.some(r=>r.candidate.kind===current.kind&&r.candidate.targetFruitId===current.targetFruitId))) {
    const currentScore = score(makeCandidate(state, creature, current.kind, current.target, current.targetFruitId, current.targetPlantId, current.targetItemId));
    if (!ranked.length || ranked[0].score <= currentScore + config.ai.switchMargin) return;
  }
  const reachable = ranked.slice(0, config.ai.pathAttempts).flatMap(entry => {
    const path = findPath(terrain, state.world.width, state.world.height, creature.position, entry.candidate.target, creature);
    return path === null ? [] : [{ ...entry, path }];
  });
  // A sealed-off high-scoring fruit must not prevent local self-care.
  if (!reachable.length) {
    const safeFallbacks = eligible.filter(c => c.kind === 'graze' || c.kind === 'sleep' || c.kind === 'idle');
    for (const candidate of safeFallbacks) {
      const path = findPath(terrain, state.world.width, state.world.height, creature.position, candidate.target, creature);
      if (path !== null) reachable.push({ candidate, score: score(candidate), path });
    }
  }
  if (!reachable.length) { creature.currentAction = null; return; }
  const selected = softmaxIndex(reachable.map(c => c.score), creature.rng);
  creature.rng = selected.rng;
  const choice = reachable[selected.index];
  if (choice.candidate.kind === 'enterCompetition') {
    const event=state.competitions.find(e=>e.id===choice.candidate.targetCompetitionId);
    if(event&&enterCompetition(state,creature,event,terrain))return;
    return;
  }
  if (choice.candidate.kind === 'court') {
    const mate = state.creatures.find(c => c.id === choice.candidate.targetCreatureId);
    if (mate) startCourtship(state, creature, mate, terrain);
    return;
  }
  if (choice.candidate.kind === 'play' || choice.candidate.kind === 'comfort' || choice.candidate.kind === 'contest') {
    const partner = state.creatures.find(c => c.id === choice.candidate.targetCreatureId);
    if (partner && startSocialSession(state, creature, partner, choice.candidate.kind, terrain)) return;
    // A declined invitation leaves valid work intact; otherwise walk to safe land.
    if (current && validAction(state,creature,current,terrain)) return;
    const path = safe && findPath(terrain,state.world.width,state.world.height,creature.position,safe,creature);
    creature.currentAction = path && safe ? { kind: 'idle', target: {...safe}, targetFruitId: null, path, workTicks: 0 } : null; return;
  }
  // Reselecting the same action preserves its commitment and work progress.
  if (current && choice.candidate.kind === current.kind && choice.candidate.targetFruitId === current.targetFruitId
    && choice.candidate.targetPlantId === current.targetPlantId
    && choice.candidate.targetItemId === current.targetItemId
    && distance(choice.candidate.target, current.target) === 0 && validAction(state, creature, current, terrain)) return;
  creature.currentAction = {
    kind: choice.candidate.kind, target: { ...choice.candidate.target }, targetFruitId: choice.candidate.targetFruitId,
    ...(choice.candidate.targetPlantId ? { targetPlantId: choice.candidate.targetPlantId } : {}),
    ...(choice.candidate.targetItemId ? { targetItemId: choice.candidate.targetItemId } : {}),
    ...(choice.candidate.targetCreatureId ? { targetCreatureId: choice.candidate.targetCreatureId } : {}),
    path: choice.path, workTicks: 0,
  };
}

function stableKey(candidate: Candidate): string {
  return `${candidate.kind}:${candidate.targetFruitId ?? candidate.targetPlantId ?? candidate.targetItemId ?? ''}:${candidate.target.y}:${candidate.target.x}`;
}

function chooseWander(state: SaveState, creature: Creature, terrain: readonly Terrain[]): Point | null {
  const radius = config.ai.wanderRadiusTiles;
  const options: Point[] = [];
  for (let y = Math.max(0, Math.floor(creature.position.y - radius)); y <= Math.min(state.world.height - 1, creature.position.y + radius); y += 1) {
    for (let x = Math.max(0, Math.floor(creature.position.x - radius)); x <= Math.min(state.world.width - 1, creature.position.x + radius); x += 1) {
      const target = tileCenter(y * state.world.width + x, state.world.width);
      if (Number.isFinite(terrainCost(terrain[y * state.world.width + x])) && distance(target, creature.position) > 0
        && (target.x - creature.position.x) ** 2 + (target.y - creature.position.y) ** 2 <= radius ** 2) options.push(target);
    }
  }
  if (!options.length) return null;
  const draw = uniform(creature.rng);
  creature.rng = draw.state;
  return options[Math.floor(draw.value * options.length)];
}

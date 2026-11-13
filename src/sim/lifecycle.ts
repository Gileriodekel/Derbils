import { newDerbilState } from './dynasty/state';
import { emptyAwards } from './competition/inventory';
import { emptyCompetitionMemory } from './competition/state';
import { config, fruitKinds, skillKeys } from '../data/config';
import { skillAptitude } from './genetics/expression';
import { newLineage, recordLifeEvent } from './life-records';
import { stageAtAge } from './life-stages';
import { emptySocialMemory } from './social/state';
import { initializeFamily, relationship, retainRelationships } from './social/relationships';
import { removeSocialLife } from './social/death';
import { emptySkillExperience, skillLevel, zeroSkills } from './skills';
import { nextUint, uniform } from './rng';
import { safeSpawnPosition } from './spawn';
import type { Creature, DeepReadonly, SaveState, TopSkill } from './types';

export function topSkill(c: DeepReadonly<Creature>): TopSkill {
  const skill = [...skillKeys].sort((a, b) => c.xp[b] - c.xp[a] || skillKeys.indexOf(a) - skillKeys.indexOf(b))[0];
  return { skill, level: skillLevel(c, skill), xp: c.xp[skill], aptitude: skillAptitude(c, skill) };
}

function friends(state: SaveState, c: Creature): Set<string> {
  const living = new Set(state.creatures.filter(other => other.id !== c.id).map(other => other.organismId));
  return new Set(state.relationships.flatMap(r => {
    const other = r.a === c.organismId ? r.b : r.b === c.organismId ? r.a : null;
    return other && living.has(other) && relationship(state,r.a,r.b)!.bond >= config.social.friendBond ? [other] : [];
  }));
}

export function rebirthEligible(state: SaveState, c: Creature): boolean {
  const r = config.lifecycle.rebirth;
  return c.welfare.ticks > 0 && c.welfare.total / c.welfare.ticks >= r.welfareMinimum
    && c.lifeIndex < r.maximum && friends(state, c).size >= r.friendMinimum;
}

function closeLife(state: SaveState, c: Creature, reason: 'oldAge' | 'rebirth'): void {
  state.lineage = state.lineage.map(l => l.id === c.id ? { ...l, deathTick: state.clock.tick,
    finalStage: c.stage, ageAtDeath: c.age, topSkill: topSkill(c), endReason: reason, awards: JSON.parse(JSON.stringify(c.awards)) } : l);
  state.organisms = state.organisms.map(o => o.id === c.organismId ? { ...o,
    lives: o.lives.map(l => l.creatureId === c.id ? { ...l, endedTick: state.clock.tick } : l) } : o);
  state.creatures = state.creatures.filter(other => other.id !== c.id);
}

function reborn(state: SaveState, old: Creature): void {
  const id = `c_${String(state.counters.creature).padStart(8, '0')}`;
  const position = safeSpawnPosition(state, old.position);
  if (!position) throw new Error('No safe rebirth location.');
  const retained = config.lifecycle.rebirth.memoryRetention;
  const rng = nextUint(state.rng.world); state.rng.world = rng; state.counters.creature += 1;
  const c: Creature = { ...old, ...emptySkillExperience(), id, lifeIndex: old.lifeIndex + 1,
    dynasty: { ...newDerbilState(), food: old.dynasty.food.map(f=>({...f})), reincarnationFruit: old.dynasty.reincarnationFruit },
    breeding: { cooldownUntil: 0, clutches: 0, nextAttemptTick: 0 }, appearanceModifiers: [],
    competition: emptyCompetitionMemory(), awards: {...emptyAwards(),owned:[...old.awards.owned],equipped:old.awards.equipped},
    social: { ...emptySocialMemory(), preferences: Object.fromEntries(Object.entries(old.social.preferences).map(([k,v])=>[k,{...v,learnedMean:v.learnedMean*retained}])) as Creature['social']['preferences'] },
    age: 0, stage: 'cocoon', stageStartedTick: state.clock.tick, position, needs: null,
    welfare: { total: 0, ticks: 0 }, xp: zeroSkills(), mood: config.mood.initial, recentValence: 0, rng,
    currentAction: null, lastCompletedAction: null, nextDecisionTick: state.clock.tick + 1,
    lastFiveFoods: [], lastMeal: null, lastPersonalityRewardTick: null,
    personalityDrift: Object.fromEntries(Object.entries(old.personalityDrift).map(([k, v]) => [k, v * retained])) as Creature['personalityDrift'],
    foodPreferences: Object.fromEntries(fruitKinds.map(k => [k, { ...old.foodPreferences[k], learnedMean: old.foodPreferences[k].learnedMean * retained }])) as Creature['foodPreferences'],
    activityPreferences: Object.fromEntries(skillKeys.map(k => [k, { ...old.activityPreferences[k], learnedMean: old.activityPreferences[k].learnedMean * retained }])) as Creature['activityPreferences'],
  };
  state.creatures.push(c);
  retainRelationships(state,old.organismId,retained);
  for(const other of state.creatures)if(other.currentAction?.targetCreatureId===old.id){other.currentAction=null;other.nextDecisionTick=state.clock.tick+1;}
  const previous = state.lineage.find(l => l.id === old.id)!;
  state.lineage = [...state.lineage, { ...newLineage(c, state.clock.tick, previous.parentIds), origin: previous.origin, generation: previous.generation, mutations: previous.mutations }];
  state.organisms = state.organisms.map(o => o.id === c.organismId ? { ...o, lives: [...o.lives,
    { creatureId: c.id, lifeIndex: c.lifeIndex, displayName: c.displayName, startedTick: state.clock.tick, endedTick: null }] } : o);
  recordLifeEvent(state, { kind: 'rebirth', creatureId: old.id, from: 'elder', to: 'cocoon', relatedCreatureId: id });
}

/** Tick-private boundary handler. New lives never receive work/age from their creation interval. */
export function resolveLifeBoundaries(state: SaveState): SaveState {
  let next = state;
  for (const c of [...state.creatures]) {
    c.age += config.clock.tickSeconds;
    const stage = stageAtAge(c.age, c.lifeIndex);
    if (stage === c.stage) continue;
    if (stage !== null) {
      const from = c.stage; c.stage = stage; c.stageStartedTick = next.clock.tick;
      if (stage === 'baby') { c.needs = { ...config.needs.newborn }; c.mood = config.mood.initial; initializeFamily(next,c.id); }
      recordLifeEvent(next, { kind: stage === 'baby' ? 'hatch' : 'stage', creatureId: c.id, from, to: stage, relatedCreatureId: null });
      continue;
    }
    let rebirth = c.dynasty.reincarnationFruit > 0;
    if(rebirth)c.dynasty.reincarnationFruit--;
    if (!rebirth && rebirthEligible(next, c)) { const draw = uniform(c.rng); c.rng = draw.state; rebirth = draw.value < config.lifecycle.rebirth.chance; }
    const affected = friends(next, c);
    closeLife(next, c, rebirth ? 'rebirth' : 'oldAge');
    if (rebirth) { reborn(next, c); continue; }
    for(const berry of c.dynasty.food)next.world.looseFruit.push({...berry,...c.position,droppedTick:next.clock.tick});
    removeSocialLife(next,c,affected);
    recordLifeEvent(next, { kind: 'death', creatureId: c.id, from: 'elder', to: 'dead', relatedCreatureId: null });
  }
  return next;
}

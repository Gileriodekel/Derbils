import { newDerbilState } from './dynasty/state';
import { emptyAwards } from './competition/inventory';
import { emptyCompetitionMemory } from './competition/state';
import { config, skillKeys } from '../data/config';
import { navigationTerrain } from './food-sources';
import { isSafeLand, tileCenter, tileIndex } from './map';
import { distance } from './navigation';
import { defaultFoodExperience } from './preferences';
import { nextUint } from './rng';
import { emptySkillExperience } from './skills';
import { randomGenome } from './genetics/founders';
import { validateGenome } from './genetics/validate';
import { zeroPersonalityDrift } from './personality';
import { stageStartAge } from './life-stages';
import { newLineage, recordLifeEvent } from './life-records';
import { emptySocialMemory } from './social/state';
import type { Creature, Genome, Point, SaveState, SpawnOptions } from './types';

export function safeSpawnPosition(state: SaveState, near: Point = config.initial.position): Point | null {
  const terrain = navigationTerrain(state.world), width = state.world.width;
  const occupied = new Set(state.creatures.map(c => tileIndex(c.position, width)));
  const candidates = terrain.flatMap((code, index) => isSafeLand(code) && !occupied.has(index) ? [index] : [])
    .sort((a, b) => distance(tileCenter(a, width), near) - distance(tileCenter(b, width), near) || a - b);
  return candidates.length ? tileCenter(candidates[0], width) : null;
}

/** Pure deterministic founder/egg creation; sessions reserve one future slot. */
export function spawnCreature(state: SaveState, providedGenome?: Genome, options: SpawnOptions = {}): SaveState {
  if (providedGenome) validateGenome(providedGenome);
  if (state.creatures.length + state.sessions.length >= state.settings.capacity) return state;
  const position = safeSpawnPosition(state, options.near);
  if (!position) return state;
  const parents = options.parentIds?.map(id => state.lineage.find(l => l.id === id));
  if (parents && parents.some(p => !p)) throw new Error('Missing parent lineage.');
  const id = `c_${String(state.counters.creature).padStart(8, '0')}`;
  const organismId = `o_${String(state.counters.organism).padStart(8, '0')}`;
  const stream = nextUint(state.rng.world);
  const appearanceSeed = nextUint(stream);
  const generated = providedGenome ? { genome: JSON.parse(JSON.stringify(providedGenome)) as Genome, rng: state.rng.genetics }
    : randomGenome(state.rng.genetics);
  const displayName = config.food.debugCreatureNames[(state.counters.creature - 1) % config.food.debugCreatureNames.length];
  const stage = options.stage ?? 'adult';
  const creature: Creature = {
    dynasty: newDerbilState(), id, organismId, lifeIndex: 0, displayName, stage, stageStartedTick: state.clock.tick, appearanceModifiers: [], awards: emptyAwards(),
    breeding: { cooldownUntil: 0, clutches: 0, nextAttemptTick: 0 }, social: emptySocialMemory(), competition: emptyCompetitionMemory(),
    age: stageStartAge(stage), welfare: { total: 0, ticks: 0 }, position,
    needs: stage === 'egg' ? null : { ...config.needs.newborn },
    mood: config.mood.initial, recentValence: 0,
    xp: Object.fromEntries(skillKeys.map(key => [key, 0])) as Creature['xp'],
    rng: stream, currentAction: null, lastCompletedAction: null, nextDecisionTick: state.clock.tick + 1,
    ...defaultFoodExperience(), ...emptySkillExperience(), genome: generated.genome,
    personalityDrift: zeroPersonalityDrift(), lastPersonalityRewardTick: null,
  };
  const next: SaveState = { ...state, rng: { ...state.rng, world: appearanceSeed, genetics: generated.rng },
    counters: { ...state.counters, creature: state.counters.creature + 1, organism: state.counters.organism + 1 },
    creatures: [...state.creatures, creature], organisms: [...state.organisms, {
      id: organismId, parents: parents ? parents.map(p => p!.organismId).sort() : [], appearanceSeed,
      lives: [{ creatureId: id, lifeIndex: 0, displayName, startedTick: state.clock.tick, endedTick: null }],
    }], lineage: [...state.lineage, newLineage(creature, state.clock.tick, options.parentIds ?? null)] };
  const record = next.lineage[next.lineage.length - 1];
  record.origin = options.origin ?? (parents ? 'birth' : 'founder');
  record.generation = parents ? 1 + Math.max(...parents.map(p => p!.generation)) : 0;
  record.mutations = options.mutations ?? [];
  recordLifeEvent(next, { kind: parents ? 'eggLaid' : options.origin === 'rescue' ? 'rescue' : 'spawn', creatureId: id, from: null, to: stage, relatedCreatureId: options.parentIds?.[0] ?? null });
  return next;
}

export function spawnEgg(state: SaveState, genome: Genome, parentIds?: [string, string], near?: Point): SaveState {
  return spawnCreature(state, genome, { stage: 'egg', parentIds, near });
}

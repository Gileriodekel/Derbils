import { beforeAll, describe, expect, it } from 'vitest';
import legacyFixture from './fixtures/milestone-2.json';
import { config, fruitKinds, needKeys, tasteKeys } from '../src/data/config';
import { createSingleHabitat as createHabitat } from './helpers';
import { spawnCreature } from '../src/sim/spawn';
import { advanceTicks, tick } from '../src/sim/tick';
import { completeMeal, foodPreference, foodRepeat, mealOutcome, tasteEnjoyment } from '../src/sim/preferences';
import { availableFood, growSources, navigationTerrain, plantApproaches, validFoodClaim } from '../src/sim/food-sources';
import { decide, makeCandidate } from '../src/sim/brain';
import { findPath } from '../src/sim/navigation';
import { decodeSave, encodeSave } from '../src/persistence/save';
import { validateLegacySave } from '../src/persistence/validate';
import { setTraitValue } from '../src/sim/genetics/edits';
import { derivePhenotype } from '../src/sim/genetics/expression';
import { randomGenome, genomeSeed } from '../src/sim/genetics/founders';
import type { Creature, Taste, FruitKind, SaveState } from '../src/sim/types';

function setTaste(c: Creature, taste: Taste) { for (const key of tasteKeys) c.genome = setTraitValue(c.genome, 'tasteBias', key, taste[key]); }

const threeCreatures = (seed = config.initial.seed) => spawnCreature(spawnCreature(createHabitat(seed)));

describe('fruit learning and utility', () => {
  it('applies the literal §10.2 preference, reward, valence and stress formulas from pre-meal state', () => {
    const c = createHabitat().creatures[0];
    setTaste(c, { sweet: 1, tart: 0, earthy: 0 });
    c.needs!.hunger = 80; c.needs!.stress = 20;
    c.lastFiveFoods = ['sunapple'];
    c.foodPreferences.sunapple = { learnedMean: .25, samples: 1 };
    const preference = .6 * (2 * .9 - 1) + .4 * .25 - .25 / 5;
    const reward = .65 * .8 + .25 * .8 + .10 * (2 / 14) - .20 / 5;
    expect(foodPreference(c, 'sunapple')).toBeCloseTo(preference, 14);
    expect(mealOutcome(c, 'sunapple').reward).toBeCloseTo(reward, 14);
    const oldGenomeIndependentXp = { ...c.xp };
    completeMeal(c, 'sunapple', 1);
    expect(c.foodPreferences.sunapple.learnedMean).toBeCloseTo(.8 * .25 + .2 * reward, 14);
    expect(c.needs!.hunger).toBe(50);
    expect(c.needs!.stress).toBeCloseTo(18 - 4 * preference, 14);
    expect(c.recentValence).toBeCloseTo(.15 * preference, 14);
    expect(c.foodPreferences.sunapple.samples).toBe(2);
    expect(c.lastMeal).toEqual({ fruit: 'sunapple', tick: 1, preference: expect.closeTo(preference), reward: expect.closeTo(reward) });
    expect(c.xp).toEqual(oldGenomeIndependentXp); // Eating adds a rate bonus, without direct XP or appearance changes.
  });
  it.each([
    ['liked', { sweet: 1, tart: 0, earthy: 0 }, 1],
    ['disliked', { sweet: 0, tart: 0, earthy: 1 }, -1],
  ] as const)('learns in the expected direction for %s fruit at stable repetition', (_, bias, direction) => {
    const c = createHabitat().creatures[0]; setTaste(c, bias);
    // Warm up the defined five-food window; compare learning without changing repeat penalty.
    for (let i = 0; i < 5; i++) { c.needs!.hunger = 80; completeMeal(c, 'sunapple', i); }
    const before = foodPreference(c, 'sunapple');
    for (let i = 5; i < 40; i++) { c.needs!.hunger = 80; completeMeal(c, 'sunapple', i); }
    expect((foodPreference(c, 'sunapple') - before) * direction).toBeGreaterThan(0);
    expect(c.foodPreferences.sunapple.learnedMean * direction).toBeGreaterThan(0);
    expect(foodPreference(c, 'sunapple')).toBeGreaterThanOrEqual(-1);
    expect(foodPreference(c, 'sunapple')).toBeLessThanOrEqual(1);
    expect(c.foodPreferences.sunapple.samples).toBe(40);
    expect(foodRepeat(c, 'sunapple')).toBe(1);
  });
  it('uses equal taste weights when all taste genes express zero', () => {
    const c = createHabitat().creatures[0]; setTaste(c, { sweet: 0, tart: 0, earthy: 0 });
    expect(tasteEnjoyment(c, 'sunapple')).toBeCloseTo(2 * (0.9 + 0.3 + 0.1) / 3 - 1);
  });
  it('usually chooses the preferred of equally available fruit across 512 seeded trials', () => {
    let preferred = 0;
    const template = createHabitat(1); template.world.plants = [];
    for (let seed = 1; seed <= 512; seed++) {
      const s = structuredClone(template);
      const c = s.creatures[0]; c.rng = seed; c.needs = { hunger: 80, fatigue: 0, boredom: 0, loneliness: 0, stress: 0 };
      setTaste(c, { sweet: 1, tart: 0, earthy: 0 });
      c.foodPreferences.sunapple.learnedMean = 1; c.foodPreferences.prismpear.learnedMean = -1;
      s.world.looseFruit = ['sunapple', 'prismpear'].map((kind, i) => ({ id: `f_${String(i + 1).padStart(8, '0')}`, kind: kind as FruitKind, ...c.position, droppedTick: 0 }));
      decide(s, c, navigationTerrain(s.world));
      if (c.currentAction?.targetFruitId === 'f_00000001') preferred++;
    }
    expect(preferred / 512).toBeGreaterThan(.75);
  });
  it('still eats the disliked remaining fruit when the preferred one is absent, ignoring urgent dislike penalties', () => {
    const s = createHabitat(1); s.world.plants = [];
    const c = s.creatures[0]; c.rng = 1; c.needs!.hunger = 95;
    setTaste(c, { sweet: 0, tart: 0, earthy: 1 });
    c.foodPreferences.sunapple.learnedMean = -1;
    s.world.looseFruit = [{ id: 'f_00000001', kind: 'sunapple', ...c.position, droppedTick: 0 }];
    expect(foodPreference(c, 'sunapple')).toBeLessThan(0);
    expect(makeCandidate(s, c, 'eat', c.position, 'f_00000001').preference).toBe(0);
    decide(s, c, navigationTerrain(s.world));
    expect(c.currentAction?.targetFruitId).toBe('f_00000001');
    expect(advanceTicks(s, config.actions.eat.workTicks).creatures[0].foodPreferences.sunapple.samples).toBe(1);
  });
});

describe('sources and concurrent meals', () => {
  it('routes around plant footprints instead of walking through them', () => {
    const s = createHabitat(); const p = s.world.plants[0];
    const path = findPath(navigationTerrain(s.world), s.world.width, s.world.height,
      { x: p.x - .5, y: p.y + .5 }, { x: p.x + 1.5, y: p.y + .5 });
    expect(path).not.toBeNull();
    expect(path!.some(point => Math.floor(point.x) === p.x && Math.floor(point.y) === p.y)).toBe(false);
    expect(path!.length).toBeGreaterThan(2);
  });
  it('commits simultaneous meals exactly once without negative stock or duplicate experience', () => {
    const s = threeCreatures(); const p = s.world.plants[0]; p.ripe = 2;
    const targets = plantApproaches(p, navigationTerrain(s.world), s.world.width, s.world.height);
    for (let i = 0; i < 2; i++) {
      const c = s.creatures[i]; c.position = { ...targets[i] };
      c.currentAction = { kind: 'eat', target: { ...targets[i] }, targetFruitId: null, targetPlantId: p.id, path: [], workTicks: config.actions.eat.workTicks - 1 };
    }
    const next = tick(s);
    expect(next.world.plants[0].ripe).toBe(0);
    expect(next.creatures[0].foodPreferences[p.kind].samples).toBe(1);
    expect(next.creatures[1].foodPreferences[p.kind].samples).toBe(1);
    expect(s.world.plants[0].ripe).toBe(2);
    expect(s.creatures[0].foodPreferences[p.kind].samples).toBe(0);
    expect(decodeSave(encodeSave(next))).toEqual(next);
  });
  it('places mature common sources (rare fruit is prize-only) and regrows depleted sources at the catalog rate', () => {
    const state = createHabitat();
    expect(state.world.plants.map(p => p.kind)).toEqual(config.sources.defaults.map(p=>p.kind));
    for (const p of state.world.plants) {
      p.ripe = 0; p.growthProgress = 0;
    }
    for (let end = 1; end <= Math.max(...fruitKinds.map(k => config.fruit[k].growthTicks)); end++) growSources(state, end - 1, end);
    for (const p of state.world.plants) expect(p.ripe).toBe(Math.min(config.fruit[p.kind].capacity, Math.floor(600 / config.fruit[p.kind].growthTicks)));
  });
  it('does not bank growth at capacity, and leaves claimed fruit counted until completion', () => {
    const state = createHabitat();
    const p = state.world.plants[0]; const c = state.creatures[0];
    const target = plantApproaches(p, navigationTerrain(state.world), state.world.width, state.world.height)[0];
    c.position = { ...target };
    c.currentAction = { kind: 'eat', target, targetFruitId: null, targetPlantId: p.id, path: [], workTicks: 0 };
    growSources(state, 0, 5000);
    expect(p.growthProgress).toBe(0);
    expect(p.ripe).toBe(config.fruit[p.kind].capacity);
    const next = advanceTicks(state, config.actions.eat.workTicks);
    expect(next.world.plants[0].ripe).toBe(config.fruit[p.kind].capacity - 1);
    expect(next.creatures[0].foodPreferences[p.kind].samples).toBe(1);
    expect(state.world.plants[0].ripe).toBe(config.fruit[p.kind].capacity);
  });
  it('never reserves the same loose fruit twice or over-claims a plant, and releases cancelled claims', () => {
    const s = threeCreatures(1); const p = s.world.plants[0]; p.ripe = 1;
    const first = s.creatures[0]; const second = s.creatures[1];
    const terrain = navigationTerrain(s.world);
    const target = plantApproaches(p, terrain, s.world.width, s.world.height)[0];
    first.currentAction = { kind: 'eat', target, targetFruitId: null, targetPlantId: p.id, path: [], workTicks: 0 };
    expect(availableFood(s, second, terrain).some(f => f.targetPlantId === p.id)).toBe(false);
    first.currentAction = null;
    expect(availableFood(s, second, terrain).some(f => f.targetPlantId === p.id)).toBe(true);
    first.currentAction = { kind: 'eat', target: { x: s.world.looseFruit[0].x, y: s.world.looseFruit[0].y }, targetFruitId: s.world.looseFruit[0].id, path: [], workTicks: 0 };
    expect(availableFood(s, second, terrain).some(f => f.targetFruitId === first.currentAction!.targetFruitId)).toBe(false);
  });
  it('gives distinct source approach cells to simultaneous eaters', () => {
    const s = threeCreatures(); const p = s.world.plants[0]; const terrain = navigationTerrain(s.world);
    const [a, b] = s.creatures;
    const firstTarget = availableFood(s, a, terrain).find(f => f.targetPlantId === p.id)!;
    a.currentAction = { kind: 'eat', ...firstTarget, path: [], workTicks: 0 };
    const secondTarget = availableFood(s, b, terrain).find(f => f.targetPlantId === p.id)!;
    expect(secondTarget.target).not.toEqual(firstTarget.target);
  });
});

describe('schema 2 checkpoints and debug spawning', () => {
  it('keeps legacy positions and routes when default source cells would overlap them', () => {
    const legacy: unknown = structuredClone(legacyFixture);
    validateLegacySave(legacy);
    const c = legacy.creatures[0]; c.position = { x: 10.5, y: 30.5 };
    c.currentAction = { kind: 'wander', target: { x: 12.5, y: 30.5 }, targetFruitId: null,
      path: [{ x: 11.5, y: 30.5 }, { x: 12.5, y: 30.5 }], workTicks: 0 };
    const migrated = decodeSave(JSON.stringify(legacy));
    expect(migrated.creatures[0].position).toEqual(c.position);
    expect(migrated.creatures[0].currentAction).toEqual(c.currentAction);
    expect(migrated.world.plants.some(p => p.y === 30 && [10, 11, 12].includes(p.x))).toBe(false);
    expect(migrated.rng).toEqual(legacy.rng);
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });
  it('migrates a real Milestone 2 checkpoint without advancing RNG, time, needs, or its in-progress route', () => {
    const state = decodeSave(JSON.stringify(legacyFixture));
    expect(state.schemaVersion).toBe(10); expect(state.rulesVersion).toBe(config.rulesVersion);
    expect(state.clock).toEqual(legacyFixture.clock); expect(state.rng).toEqual(legacyFixture.rng);
    expect(state.creatures[0].rng).toBe(legacyFixture.creatures[0].rng);
    expect(state.creatures[0].needs).toEqual(legacyFixture.creatures[0].needs);
    expect(state.creatures[0].currentAction).toEqual(legacyFixture.creatures[0].currentAction);
    expect(state.creatures[0].genome).toEqual(randomGenome(genomeSeed(Number(state.saveId.slice(6)), state.creatures[0].id)).genome);
    expect(Object.values(state.creatures[0].foodPreferences).every(p => p.samples === 0 && p.learnedMean === 0)).toBe(true);
    expect(state.world.plants).toHaveLength(fruitKinds.length);
    expect(advanceTicks(decodeSave(encodeSave(state)), 1000)).toEqual(advanceTicks(state, 1000));
    expect(decodeSave(JSON.stringify(legacyFixture))).toEqual(state);
  });
  it('preserves a mid-source-meal checkpoint, its claims and partial growth exactly', () => {
    let state = threeCreatures(); let found = false;
    for (let i = 0; i < 5000; i++) {
      state = tick(state);
      if (state.creatures.some(c => c.currentAction?.targetPlantId && c.currentAction.workTicks >= 3)) {
        found = true;
        expect(advanceTicks(decodeSave(encodeSave(state)), 1000)).toEqual(advanceTicks(state, 1000));
        break;
      }
    }
    expect(found).toBe(true);
  });
  it('spawns to the configured cap, uses distinct saved tastes and streams, and preserves the input', () => {
    const initial = createHabitat(); const before = encodeSave(initial);
    const state = spawnCreature(spawnCreature(initial));
    expect(encodeSave(initial)).toBe(before);
    expect(state.creatures).toHaveLength(3);
    expect(new Set(state.creatures.map(c => JSON.stringify(derivePhenotype(c.genome).tasteBias))).size).toBe(3);
    expect(new Set(state.creatures.map(c => c.rng)).size).toBe(3);
    let full = state;
    while (full.creatures.length < config.lifecycle.capacity) full = spawnCreature(full);
    expect(full.creatures).toHaveLength(30);
    expect(spawnCreature(full)).toBe(full);
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });
  it('is deterministic for three creatures and 5,000 ticks including preferences', () => {
    expect(advanceTicks(threeCreatures(12345), 5000)).toEqual(advanceTicks(threeCreatures(12345), 5000));
  });
});

describe('three-creature 20,000-tick habitat', () => {
  let final: SaveState;
  let maxHunger = 0;
  let minPreference = Infinity; let maxPreference = -Infinity;
  const errors: string[] = [];
  const regenerated = new Set<string>();
  beforeAll(() => {
    let state = threeCreatures(271828);
    // Distinct taste inputs make this a preference-diversity check rather than a lucky meal order.
    state.creatures.forEach((c,i)=>setTaste(c,{sweet:Number(i===0),tart:Number(i===1),earthy:Number(i===2)}));
    const emptyFor = new Map<string, number>();
    for (let i = 0; i < 20000; i++) {
      const previousPlants = state.world.plants;
      state = tick(state);
      for (const c of state.creatures) {
        maxHunger = Math.max(maxHunger, c.needs!.hunger);
        for (const key of needKeys) if (!Number.isFinite(c.needs![key]) || c.needs![key] < 0 || c.needs![key] > 100) errors.push(`need ${key}`);
        for (const kind of fruitKinds) {
          const score = foodPreference(c, kind); minPreference = Math.min(minPreference, score); maxPreference = Math.max(maxPreference, score);
          if (!Number.isFinite(score) || Math.abs(c.foodPreferences[kind].learnedMean) > 1) errors.push('preference');
        }
        if (c.currentAction?.kind === 'eat' && !validFoodClaim(state, c, c.currentAction)) errors.push('claim');
      }
      for (const p of state.world.plants) {
        if (p.ripe < 0 || p.ripe > config.fruit[p.kind].capacity) errors.push('stock');
        const empty = p.ripe === 0 ? (emptyFor.get(p.id) ?? 0) + 1 : 0; emptyFor.set(p.id, empty);
        if (empty > config.fruit[p.kind].growthTicks + 1) errors.push('permanently empty');
        if (p.ripe > previousPlants.find(prior => prior.id === p.id)!.ripe) regenerated.add(p.id);
      }
    }
    final = state;
  }, 30000);
  it('keeps needs and learned/derived preferences bounded', () => {
    expect(errors).toEqual([]); expect(minPreference).toBeGreaterThanOrEqual(-1); expect(maxPreference).toBeLessThanOrEqual(1);
  });
  it('feeds all three indefinitely from regenerating sources without starvation', () => {
    expect(maxHunger).toBeLessThan(config.needs!.urgentThreshold);
    expect(regenerated.size).toBeGreaterThan(0);
    for (const c of final.creatures) {
      expect(Object.values(c.foodPreferences).reduce((sum, p) => sum + p.samples, 0)).toBeGreaterThan(5);
      expect(fruitKinds.filter(kind => c.foodPreferences[kind].samples > 0).length).toBeGreaterThanOrEqual(2);
    }
    expect(decodeSave(encodeSave(final))).toEqual(final);
  });
  it('develops meaningfully different favorite rankings with a fixed seed', () => {
    const rankings = final.creatures.map(c => [...fruitKinds].sort((a, b) => foodPreference(c, b) - foodPreference(c, a)));
    expect(new Set(rankings.map(r => r[0])).size).toBeGreaterThanOrEqual(2);
    const a = final.creatures[0];
    expect(final.creatures.slice(1).some(c => fruitKinds.some(kind => Math.abs(foodPreference(c, kind) - foodPreference(a, kind)) > .05))).toBe(true);
  });
});

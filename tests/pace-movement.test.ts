import { describe, expect, it } from 'vitest';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { advanceFrame, setSpeed } from '../src/sim/runner';
import { advance } from '../src/sim/advance';
import { tick } from '../src/sim/tick';
import { advanceForeground } from '../src/app/foreground';
import { movementRoute, sampleRoute, visiblePosition } from '../src/render/movement';
import { movePath } from '../src/sim/dynasty/movement';
import { findPath } from '../src/sim/navigation';
import { spawnPlant, navigationTerrain } from '../src/sim/food-sources';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { validateState } from '../src/sim/validate-state';
import type { LifeStage, Point, Terrain } from '../src/sim/types';

describe('foreground pacing', () => {
  it('switches immediately out of an accelerated backlog, retaining only sub-tick progress', () => {
    const old = createHabitat(64, 1); old.clock.speed = 1000; old.clock.fractionalSeconds = 7000.25;
    const slow = setSpeed(old, 1); expect(slow.clock.fractionalSeconds).toBe(.25);
    expect(advanceFrame(slow, 1).clock.tick).toBe(old.clock.tick + 1);
    const paused = setSpeed(old, 0); expect(advanceFrame(paused, 10)).toBe(paused);
    expect(setSpeed({ ...old, clock: { ...old.clock, speed: 1 } }, 1).clock.fractionalSeconds).toBe(.25);
    expect(old.clock.fractionalSeconds).toBe(7000.25);
  });
  it('yields without changing exact tick results and retains adjacent snapshots for rendering', () => {
    const initial = createHabitat(65, 2); let state = initial, batches = 0;
    while (state.clock.tick < 120) {
      let time = 0;
      const batch = advanceForeground(state, 120 - state.clock.tick, 8, () => time += 4);
      expect(batch.completed).toBeGreaterThan(0); expect(batch.completed).toBeLessThanOrEqual(2);
      expect(batch.previous.clock.tick).toBe(batch.state.clock.tick - 1);
      state = batch.state; batches++;
    }
    expect(batches).toBeGreaterThan(1); expect(state).toEqual(advance(initial, initial.rng, 120));
    expect(advanceForeground(state, 0, 8, () => 0).state).toBe(state);
  });
});

describe('movement and map edges', () => {
  it('interpolates through a path corner instead of cutting across it', () => {
    const s = createHabitat(66, 1), before = s.creatures[0]; before.position = { x: .5, y: .5 };
    before.currentAction = { kind: 'wander', targetFruitId: null, target: { x: 1.5, y: 1.5 }, path: [{ x: 1.5, y: .5 }, { x: 1.5, y: 1.5 }], workTicks: 0 };
    const after = { ...before, position: { x: 1.5, y: 1.5 } }, route = movementRoute(s, before, after);
    expect(sampleRoute(route, .25)).toEqual({ x: 1, y: .5 });
    expect(sampleRoute(route, .5)).toEqual({ x: 1.5, y: .5 });
    expect(sampleRoute(route, .75)).toEqual({ x: 1.5, y: 1 });
    expect(sampleRoute(route, 1)).toEqual(after.position);
  });
  it('rejects movement off all four map edges, including a right-edge row alias', () => {
    const terrain = Array<Terrain>(16).fill(0), c = createHabitat(67, 1).creatures[0];
    for (const [start, end] of [
      [{ x: .5, y: 1.5 }, { x: -1, y: 1.5 }], [{ x: 3.5, y: 1.5 }, { x: 4, y: 1.5 }],
      [{ x: 1.5, y: .5 }, { x: 1.5, y: -1 }], [{ x: 1.5, y: 3.5 }, { x: 1.5, y: 4 }],
    ] as [Point, Point][]) {
      c.position = { ...start }; const path = [{ ...end }]; movePath(c, path, terrain, 4, 0);
      expect(c.position).toEqual(start); expect(path).toEqual([]);
      expect(findPath(terrain, 4, 4, start, end, c)).toBeNull();
    }
  });
  it('keeps whole adult, baby, egg and cocoon sprites within the world rectangle', () => {
    const c = createHabitat(68, 1).creatures[0];
    for (const stage of ['adult', 'elder', 'baby', 'egg', 'cocoon'] as LifeStage[]) {
      const creature = { ...c, stage }, scale = stage === 'egg' || stage === 'cocoon' ? 1 : config.lifecycle.stages[stage].scale;
      const halfWidth = config.dynasty.art.sizeTiles * scale / 2;
      for (const point of [{ x: 0, y: 0 }, { x: 172, y: 92 }]) {
        const shown = visiblePosition(point, creature, 172, 92);
        expect(shown.x - halfWidth).toBeGreaterThanOrEqual(0); expect(shown.x + halfWidth).toBeLessThanOrEqual(172);
        expect(shown.y).toBeGreaterThan(0); expect(shown.y).toBeLessThan(92);
      }
    }
  });
  it('returns independent paths when navigation cache entries are reused', () => {
    const terrain = Array<Terrain>(25).fill(0), start = { x: .5, y: .5 }, end = { x: 4.5, y: 4.5 };
    const original = findPath(terrain, 5, 5, start, end)!;
    const copy = structuredClone(original); original[0].x = 99; original.shift();
    expect(findPath(terrain, 5, 5, start, end)).toEqual(copy);
    expect(findPath(terrain, 5, 5, { x: .2, y: .8 }, { x: 4.7, y: 4.2 })!.at(-1)).toEqual({ x: 4.7, y: 4.2 });
  });
});

describe('half-density plants and old saves', () => {
  it('starts with 15 plants and never replenishes beyond 20', () => {
    const s = createHabitat(69, 1); expect(s.world.plants).toHaveLength(15);
    for (let i = 0; i < 100; i++) spawnPlant(s);
    expect(s.world.plants).toHaveLength(20); expect(validateState(s, config)).toEqual([]);
  });
  it('accepts an older 40-plant world and thins both terrain groups deterministically on the next tick', () => {
    const s = createHabitat(70, 1), terrain = navigationTerrain(s.world), taken = new Set(s.world.plants.map(p => p.y * s.world.width + p.x));
    for (let i = 0; s.world.plants.length < 40 && i < terrain.length; i++) {
      if (![0, 3].includes(terrain[i]) || taken.has(i)) continue;
      const id = `p_${String(s.counters.plant++).padStart(8, '0')}`;
      const ids = [0, 1].map(() => `f_${String(s.counters.fruit++).padStart(8, '0')}`) as [string, string];
      s.world.plants.push({ ...s.world.plants[0], id, x: i % s.world.width, y: Math.floor(i / s.world.width), berries: [true, true], berryIds: ids, ripe: 2 });
    }
    s.creatures[0].dynasty.food.push({ id: `f_${String(s.counters.fruit++).padStart(8, '0')}`, kind: 'sunapple' });
    const oldFood = structuredClone(s.creatures[0].dynasty.food), saved = encodeCheckpoint(s, 123), loaded = decodeCheckpoint(saved).state;
    expect(loaded).toEqual(s); expect(loaded.world.plants).toHaveLength(40);
    const next = tick(loaded); expect(next.world.plants).toHaveLength(20); expect(next).toEqual(tick(s));
    expect(next.creatures[0].dynasty.food).toEqual(oldFood); expect(validateState(next, config)).toEqual([]);
    expect(decodeCheckpoint(encodeCheckpoint(next, 123)).state).toEqual(next);
  });
});

import { describe, expect, it } from 'vitest';
import { config, needKeys } from '../src/data/config';
import { makeCandidate, decide } from '../src/sim/brain';
import { createSingleHabitat as createHabitat } from './helpers';
import { createTerrain, decodeTerrain, encodeTerrain, tileIndex } from '../src/sim/map';
import { findPath } from '../src/sim/navigation';
import { advanceTicks, tick } from '../src/sim/tick';
import { scoreUtility } from '../src/sim/utility';
import { decodeSave, encodeSave } from '../src/persistence/save';
import type { ActionKind, SaveState } from '../src/sim/types';

describe('milestone 2 headless life', () => {
  it('produces identical full state after 5,000 ticks from the same seed', () => {
    const a = advanceTicks(createHabitat(93201), 5000);
    const b = advanceTicks(createHabitat(93201), 5000);
    expect(a).toEqual(b);
    expect(a).not.toEqual(advanceTicks(createHabitat(93202), 5000));
  });
  it('does not mutate any part of its state or RNG inputs', () => {
    const state = advanceTicks(createHabitat(), 75);
    const before = encodeSave(state);
    const rng = { ...state.rng };
    tick(state, rng);
    expect(encodeSave(state)).toBe(before);
    expect(rng).toEqual(state.rng);
  });
  it('keeps every need bounded and feeds/rests autonomously for 10,000 ticks', () => {
    let state = createHabitat();
    let maxHunger = 0;
    const completed = new Set<ActionKind>();
    for (let i = 0; i < 10000; i += 1) {
      state = tick(state);
      const c = state.creatures[0];
      for (const key of needKeys) {
        expect(Number.isFinite(c.needs![key])).toBe(true);
        expect(c.needs![key]).toBeGreaterThanOrEqual(0);
        expect(c.needs![key]).toBeLessThanOrEqual(100);
      }
      expect(c.mood).toBeGreaterThanOrEqual(-1);
      expect(c.mood).toBeLessThanOrEqual(1);
      maxHunger = Math.max(maxHunger, c.needs!.hunger);
      if (c.lastCompletedAction) completed.add(c.lastCompletedAction);
      expect(state.world.looseFruit.length).toBeGreaterThanOrEqual(0);
    }
    expect(maxHunger).toBeLessThan(config.needs!.urgentThreshold);
    expect(new Set([...completed].filter(kind => !kind.startsWith('train_')))).toEqual(new Set(['eat', 'sleep', 'graze', 'wander', 'idle']));
    expect(state.creatures).toHaveLength(1);
    expect(state.clock.tick).toBe(10000);
  });
  it.each(['travel', 'eat', 'sleep', 'graze'] as const)('continues identically after a save during %s', phase => {
    let state = createHabitat(271828);
    let found = false;
    for (let i = 0; i < 5000; i += 1) {
      state = tick(state);
      const action = state.creatures[0].currentAction;
      if (action && (phase === 'travel' ? action.path.length > 0 : action.kind === phase && action.workTicks >= 3)) {
        found = true;
        expect(advanceTicks(decodeSave(encodeSave(state)), 750)).toEqual(advanceTicks(state, 750));
        break;
      }
    }
    expect(found).toBe(true);
  });
  it('handles fruit disappearing during a meal without a partial consumption or negative resource', () => {
    const state = createHabitat();
    const c = state.creatures[0];
    c.currentAction = { kind: 'eat', target: { ...c.position }, targetFruitId: state.world.looseFruit[0].id, path: [], workTicks: 7 };
    state.world.looseFruit = [];
    const next = tick(state);
    expect(next.world.looseFruit).toEqual([]);
    expect(next.creatures[0].needs!.hunger).toBeGreaterThanOrEqual(c.needs!.hunger);
    expect(next.creatures[0].currentAction?.kind).not.toBe('eat');
  });
});

describe('utility brain', () => {
  function hungryState(): SaveState {
    const state = createHabitat(1);
    const c = state.creatures[0];
    c.needs = { hunger: 95, fatigue: 5, boredom: 5, loneliness: 0, stress: 0 };
    c.rng = 1;
    state.world.looseFruit = [{ id: 'f_00000001', kind: 'sunapple', ...c.position, droppedTick: 0 }];
    return state;
  }
  it('scores eating above grazing and chooses it when hungry with nearby fruit', () => {
    const state = hungryState();
    const c = state.creatures[0];
    const eat = makeCandidate(state, c, 'eat', c.position, state.world.looseFruit[0].id);
    const graze = makeCandidate(state, c, 'graze', c.position);
    expect(scoreUtility(c, eat).total).toBeGreaterThan(scoreUtility(c, graze).total);
    decide(state, c, createTerrain());
    expect(c.currentAction?.kind).toBe('eat');
  });
  it('rests when exhausted, and hunger wins equal urgent deficits', () => {
    const state = hungryState();
    const c = state.creatures[0];
    c.needs!.hunger = 20;
    c.needs!.fatigue = 95;
    decide(state, c, createTerrain());
    expect(c.currentAction?.kind).toBe('sleep');
    c.needs!.hunger = 95;
    decide(state, c, createTerrain());
    expect(['eat', 'graze']).toContain(c.currentAction?.kind);
  });
  it('implements every utility coefficient, scaling, clamping, and penalty from §5.3', () => {
    const state = hungryState();
    const c = state.creatures[0];
    c.needs = { hunger: 50, fatigue: 25, boredom: 80, loneliness: 40, stress: 20 };
    c.lastCompletedAction = 'graze';
    const candidate = {
      ...makeCandidate(state, c, 'graze', c.position),
      relief: { hunger: 15, fatigue: 72, boredom: 10, loneliness: 18, stress: 3 },
      personalityFit: 0.8, preference: -0.4, growthInterest: 0.3, socialAffinity: 0.5,
      encouragement: 0.15, courtshipInterest: 0.2, estimatedTravelSeconds: 60, predictedFatigueIncrease: 5,
    };
    const needBenefit = .30 * .5 ** 2 * .5 + .30 * .25 ** 2 + .15 * .8 ** 2 * .5 + .15 * .4 ** 2 + .10 * .2 ** 2 * .25;
    expect(scoreUtility(c, candidate).total).toBeCloseTo(2 * needBenefit + .18 * .8 + .12 * -.4 + .12 * .3 + .10 * .5 + .15 + .2 - .15 - .20 * .25 - .08, 14);
  });
  it('keeps an ordinary action committed for eight work ticks, then respects hysteresis', () => {
    const state = hungryState();
    const c = state.creatures[0];
    c.needs!.hunger = 80;
    c.currentAction = { kind: 'idle', target: { ...c.position }, targetFruitId: null, path: [], workTicks: 7 };
    decide(state, c, createTerrain());
    expect(c.currentAction.kind).toBe('idle');
    c.currentAction.workTicks = 8;
    decide(state, c, createTerrain());
    expect(c.currentAction.kind).toBe('eat');
    const current = c.currentAction;
    decide(state, c, createTerrain());
    expect(c.currentAction).toBe(current);
  });
});

describe('habitat navigation', () => {
  it('returns from shallow water to self-care when the top food targets are unreachable', () => {
    const state = createHabitat(1);
    const c = state.creatures[0];
    c.position = { x: 34.5, y: 20.5 };
    c.needs!.hunger = 99;
    state.world.looseFruit = [0, 1, 2].map(i => ({ id: `f_${String(i + 1).padStart(8, '0')}`, kind: 'sunapple', x: 43.5 + i, y: 20.5, droppedTick: 0 }));
    decide(state, c, createTerrain());
    expect(c.currentAction?.kind).toBe('graze');
    expect(c.currentAction!.path.length).toBeGreaterThan(0);
    expect(advanceTicks(state, 150).creatures[0].needs!.hunger).toBeLessThan(99);
  });
  it('matches the specified map and survives an inaccessible food target', () => {
    const terrain = createTerrain();
    expect(terrain).toHaveLength(64 * 48);
    expect(decodeTerrain(encodeTerrain(terrain))).toEqual(terrain);
    expect(terrain[20 * 64 + 44]).toBe(3);
    expect(terrain[30 * 64 + 10]).toBe(1);
    expect(terrain[8 * 64 + 10]).toBe(4);
    expect(findPath(terrain, 64, 48, config.initial.position, { x: 44.5, y: 20.5 })).toBeNull();
    const state = createHabitat(1);
    state.creatures[0].needs!.hunger = 99;
    state.world.looseFruit = [{ id: 'f_00000001', kind: 'sunapple', x: 44.5, y: 20.5, droppedTick: 0 }];
    const next = advanceTicks(state, 500);
    expect(next.creatures[0].needs!.hunger).toBeLessThan(99);
    expect(terrain[tileIndex(next.creatures[0].position, 64)]).not.toBe(3);
  });
  it('uses cardinal paths with stable tie-breaking and never crosses deep/blocked terrain', () => {
    const terrain = createTerrain();
    const path = findPath(terrain, 64, 48, { x: 30.5, y: 20.5 }, { x: 56.5, y: 20.5 })!;
    expect(path.length).toBeGreaterThan(0);
    let previous = { x: 30.5, y: 20.5 };
    for (const point of path) {
      expect(Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y)).toBe(1);
      expect([3, 5]).not.toContain(terrain[tileIndex(point, 64)]);
      previous = point;
    }
    expect(path).toEqual(findPath(terrain, 64, 48, { x: 30.5, y: 20.5 }, { x: 56.5, y: 20.5 }));
  });
});

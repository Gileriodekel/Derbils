import { describe, expect, it } from 'vitest';
import { config } from '../src/data/config';
import { createSingleHabitat as createHabitat } from './helpers';
import { advanceFrame, setSpeed } from '../src/sim/runner';
import { tick } from '../src/sim/tick';
import { decodeSave, encodeSave } from '../src/persistence/save';
import { loadLocal, saveLocal } from '../src/persistence/storage';
import type { SaveState } from '../src/sim/types';

describe('durable milestone checkpoints', () => {
  it('round-trips through the localStorage adapter with an in-progress action and fractional clock', () => {
    const slots = new Map<string, string>();
    const storage = { getItem: (key: string) => slots.get(key) ?? null, setItem: (key: string, value: string) => { slots.set(key, value); } };
    expect(loadLocal(storage)).toBeNull();
    const state = advanceFrame(setSpeed(createHabitat(), 10), 8.125);
    saveLocal(storage, state);
    expect(slots.has(config.persistence.key)).toBe(true);
    expect(advanceFrame(loadLocal(storage)!, 12.05)).toEqual(advanceFrame(state, 12.05));
  });
  it.each([
    ['zero creature RNG', (s: SaveState) => { s.creatures[0].rng = 0; }],
    ['out-of-range need', (s: SaveState) => { s.creatures[0].needs!.hunger = 101; }],
    ['missing organism', (s: SaveState) => { s.organisms = []; }],
    ['invalid genome locus count', (s: SaveState) => { s.creatures[0].genome.temperament.haplotypes[0].pop(); }],
    ['bad categorical dominance', (s: SaveState) => { (s.creatures[0].genome.palette.haplotypes[0][5] as {d:number}).d = 999; }],
    ['missing terrain', (s: SaveState) => { s.world.terrainRle.pop(); }],
    ['duplicate fruit ID', (s: SaveState) => { s.world.plants[1].berryIds![0] = s.world.plants[0].berryIds![0]; }],
    ['regressed ID counter', (s: SaveState) => { s.counters.creature = 1; }],
    ['unsupported speed', (s: SaveState) => { (s.clock.speed as number) = 4; }],
    ['negative backlog', (s: SaveState) => { s.clock.fractionalSeconds = -1; }],
    ['missing food claim', (s: SaveState) => {
      s.creatures[0].currentAction = { kind: 'eat', target: { ...s.creatures[0].position }, targetFruitId: 'f_99999999', path: [], workTicks: 0 };
    }],
  ] as const)('rejects %s before replacing state', (_, corrupt) => {
    const state = createHabitat();
    corrupt(state);
    expect(() => decodeSave(JSON.stringify(state))).toThrow(/Invalid save/);
  });
  it('validates every checkpoint throughout a moving, working 2,400-tick run', () => {
    let state = createHabitat();
    for (let i = 0; i < 2400; i += 1) {
      state = tick(state);
      // Every tick includes fractional positions and every work-boundary edge case.
      encodeSave(state);
    }
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });
  it('propagates quota errors and malformed saves instead of reporting success', () => {
    expect(() => saveLocal({ setItem: () => { throw new Error('Quota exceeded'); } }, createHabitat())).toThrow('Quota exceeded');
    expect(() => loadLocal({ getItem: () => '{bad json' })).toThrow();
  });
});

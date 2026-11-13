import { describe, expect, it } from 'vitest';
import { nextUint, uniform } from '../src/sim/rng';
import { createFoundationState } from '../src/sim/state';
import { advanceTicks, tick } from '../src/sim/tick';
import { advanceFrame, setSpeed } from '../src/sim/runner';
import { decodeSave, encodeSave } from '../src/persistence/save';

describe('milestone 1 foundation', () => {
  it('matches the spec xorshift32 fixture', () => {
    let rng = 1;
    const sequence = Array.from({ length: 5 }, () => (rng = nextUint(rng)));
    expect(sequence).toEqual([270369, 67634689, 2647435461, 307599695, 2398689233]);
    expect(uniform(1).value).toBe(270369 / 4294967296);
    expect(createFoundationState(0).rng.world).toBe(1);
    expect(() => nextUint(0)).toThrow();
  });
  it('produces the same state for the same seed after 1,000 steps', () => {
    expect(advanceTicks(createFoundationState(7), 1000)).toEqual(advanceTicks(createFoundationState(7), 1000));
  });
  it('is pure, including the RNG input', () => {
    const state = createFoundationState(11);
    const before = encodeSave(state);
    expect(tick(state).clock.tick).toBe(1);
    expect(encodeSave(state)).toBe(before);
  });
  it('advances exactly one tick per simulated second and pauses without consuming a remainder', () => {
    const state = advanceFrame(createFoundationState(), 0.4);
    const paused = setSpeed(state, 0);
    expect(advanceFrame(paused, 1000)).toBe(paused);
    expect(advanceFrame(setSpeed(paused, 1), 0.6).clock.tick).toBe(1);
    expect(advanceFrame(setSpeed(createFoundationState(), 10), 1).clock.tick).toBe(10);
    expect(advanceFrame(setSpeed(createFoundationState(), 100), 1).clock.tick).toBe(100);
  });
  it('retains capped-frame backlog and serializes the accumulator', () => {
    let state = advanceFrame(setSpeed(createFoundationState(), 100), 2.25);
    state = decodeSave(encodeSave(state));
    state = advanceFrame(advanceFrame(state, 0), 0);
    expect(state.clock.tick).toBe(225);
    expect(state.clock.fractionalSeconds).toBe(0);
  });
  it('continues identically after saving mid-run', () => {
    const mid = advanceTicks(createFoundationState(99), 413);
    expect(advanceTicks(decodeSave(encodeSave(mid)), 587)).toEqual(advanceTicks(createFoundationState(99), 1000));
  });
  it('rejects unknown save versions and corrupt RNG states', () => {
    const state = createFoundationState();
    expect(() => decodeSave(encodeSave({ ...state, rulesVersion: 'future' }))).toThrow();
    state.rng.world = 0;
    expect(() => decodeSave(encodeSave(state))).toThrow();
  });
});

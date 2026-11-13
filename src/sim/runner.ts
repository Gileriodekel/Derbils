import { config } from '../data/config';
import { advanceTicks } from './tick';
import type { SaveState, Speed } from './types';

export function setSpeed(state: SaveState, speed: Speed): SaveState {
  if (!config.clock.foregroundSpeeds.includes(speed)) throw new Error('Unsupported speed.');
  // Switching pace discards unprocessed whole-tick wall-time debt, not completed
  // simulation work. Preserve sub-tick progress so slowing down takes effect now.
  return { ...state, clock: { ...state.clock, speed,
    fractionalSeconds: state.clock.fractionalSeconds % config.clock.tickSeconds } };
}

/** Elapsed seconds come from the host; the core never reads a clock. Backlog is retained. */
export function advanceFrame(state: SaveState, elapsedSeconds: number): SaveState {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) throw new Error('Invalid frame interval.');
  if (state.clock.speed === 0) return state;
  const budget = state.clock.fractionalSeconds + elapsedSeconds * state.clock.speed;
  const count = Math.min(Math.floor(budget / config.clock.tickSeconds), config.clock.maxTicksPerFrame);
  const next = advanceTicks(state, count);
  return { ...next, clock: { ...next.clock, fractionalSeconds: budget - count * config.clock.tickSeconds } };
}

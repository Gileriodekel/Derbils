import previous from '../data/legacy/timing-v11.json';
import { config } from '../data/config';
import { lifespan } from './life-stages';
import type { SaveState } from './types';

export function historicalDayTicks(state: SaveState, tick: number): number {
  const boundary = state.dynasty.calendarChangedAtTick;
  return boundary !== null && tick <= boundary ? previous.dayTicks : config.clock.dayTicks;
}
export function lifespanAtDeath(state: SaveState, tick: number, lifeIndex: number): number {
  return historicalDayTicks(state, tick) === previous.dayTicks
    ? lifeIndex === 0 ? previous.firstLifespan : previous.rebornLifespan
    : lifespan(lifeIndex);
}

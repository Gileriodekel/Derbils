import { config } from '../../data/config';
import type { DerbilState, DynastyState } from '../types';
export function newDerbilState(): DerbilState {
  return { energy: config.dynasty.movement.baseEnergy, movementMode: 'walk', moving: false, fast: false,
    food: [], nextSocialTick: 0, runningPenaltyUntil: 0, reincarnationFruit: 0 };
}
export function newDynastyState(tick = 0): DynastyState {
  const day = Math.floor(tick / config.clock.dayTicks), c = config.dynasty.competitions;
  return { calendarChangedAtTick: null, nextPlantTick: tick + config.dynasty.plants.spawnEveryTicks,
    nextDerbyDay: (Math.floor(day / c.derbyDays) + 1) * c.derbyDays,
    nextCupDay: (Math.floor(day / c.cupDays) + 1) * c.cupDays,
    championOrganismId: null, events: [], legacyRecords: [] };
}

import { newDynastyState } from './dynasty/state';
import { config } from '../data/config';
import { starterInventory, initialPrizeLedger } from './competition/inventory';
import { nextUint, normalizeSeed } from './rng';
import { emptyCompetitionState } from './competition/state';
import { emptySocialState } from './social/state';
import type { SaveState } from './types';

export function createFoundationState(seed = config.initial.seed): SaveState {
  const normalized = normalizeSeed(seed);
  return {
    schemaVersion: 12, dynasty: newDynastyState(), rulesVersion: config.rulesVersion, saveId: `world_${normalized}`, revision: 0,
    clock: { tick: 0, wallAnchorMs: 0, speed: 1, offlineEnabled: false, fractionalSeconds: 0, catchup: null },
    rng: { world: normalized, genetics: nextUint(normalized), competition: nextUint(nextUint(normalized)) },
    counters: { creature: 1, organism: 1, item: 1, plant: 1, fruit: 1, session: 1, competition: 1, event: 1 },
    settings: { autoBreed: config.breeding.enabled, autoImmigration: false, capacity: config.lifecycle.capacity, extinctionRescue: config.breeding.extinctionRescue, autoPrizes: config.prizes.autoPrizes, autoCompetitions: config.competitions.autoCompetitions },
    breedingRules: { blockedPairs: [], encouragedPairs: [], exclusivePairs: [], blockedIndividuals: [], encouragedIndividuals: [] },
    world: {
      width: config.world.widthTiles, height: config.world.heightTiles,
      terrainRle: [[0, config.world.widthTiles * config.world.heightTiles]], terrainRevision: 0,
      items: [], plants: [], looseFruit: [], nextImmigrationTick: config.clock.dayTicks, lastCacheDay: 0,
    },
    creatures: [], organisms: [], relationships: [], social: emptySocialState(), sessions: [], competitions: [], competitionHistory: [], competitionState: emptyCompetitionState(),
    inventory: starterInventory(), prizeLedger: initialPrizeLedger(), events: [], lineage: [], discoveries: [],
  };
}

export function initialSeed(state: SaveState): number {
  return Number(state.saveId.slice('world_'.length));
}

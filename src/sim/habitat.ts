import { config } from '../data/config';
import { withDefaultSources } from './food-sources';
import { createTerrain, encodeTerrain } from './map';
import { spawnCreature } from './spawn';
import { stageStartAge } from './life-stages';
import { createFoundationState } from './state';
import type { SaveState } from './types';

export function createHabitat(seed = config.initial.seed, founderCount = config.breeding.founderCount): SaveState {
  const state = createFoundationState(seed);
  state.world.terrainRle = encodeTerrain(createTerrain());
  state.world.looseFruit = config.initial.fruit.map((fruit, index) => ({
    id: `f_${String(index + 1).padStart(8, '0')}`, kind: fruit.kind,
    x: fruit.position.x, y: fruit.position.y, droppedTick: 0,
  }));
  state.counters.fruit = state.world.looseFruit.length + 1;
  let next = withDefaultSources(state);
  for (let i = 0; i < founderCount; i++) {
    next = spawnCreature(next);
    if (i === 0) {
      const first = next.creatures[0]; first.displayName = config.names.founderName;
      next.organisms[0].lives[0].displayName = first.displayName;
      next.lineage[0].displayName = first.displayName;
    }
    if (i >= config.breeding.initialAdults) {
      const c = next.creatures[next.creatures.length - 1];
      c.stage = 'juvenile'; c.age = stageStartAge('juvenile');
    }
    const c = next.creatures[next.creatures.length - 1];
    const adult = c.stage === 'adult', groupSize = adult ? Math.min(founderCount, config.breeding.initialAdults) : founderCount-config.breeding.initialAdults;
    const index = adult ? i : i-config.breeding.initialAdults;
    const spread = adult ? config.breeding.founderAdultSpreadDays*config.clock.dayTicks
      : config.lifecycle.stages.juvenile.durationTicks*config.breeding.founderJuvenileSpreadFraction;
    const offset = Math.floor(Math.min(spread,config.lifecycle.stages[c.stage].durationTicks-1)*index/Math.max(1,groupSize-1));
    c.age+=offset;c.stageStartedTick=offset ? -offset : 0;
  }
  return next;
}

import { config } from '../data/config';
import { computeAppearance } from '../sim/appearance/derive';
import type { AppearanceSpec, Creature, DeepReadonly } from '../sim/types';
import { createSceneCache } from './cache';
import type { Facing } from './scene/types';

/** Snapshot references are immutable; weak entries do not retain old creatures or world history. */
export function createAppearanceView() {
  let snapshots = new WeakMap<DeepReadonly<Creature>, { seed: number; spec: AppearanceSpec }>();
  const scenes = createSceneCache();
  function spec(c: DeepReadonly<Creature>, seed: number): AppearanceSpec {
    const previous = snapshots.get(c);
    if (previous?.seed === seed) return previous.spec;
    const result = computeAppearance(c, config, seed); snapshots.set(c, { seed, spec: result }); return result;
  }
  return { spec, scene(c: DeepReadonly<Creature>, seed: number, facing: Facing, scale: number) { return scenes.get(spec(c, seed), facing, scale); },
    reset(){snapshots=new WeakMap();scenes.clear();},
    statistics: scenes.statistics };
}

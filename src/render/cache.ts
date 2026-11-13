import { config } from '../data/config';
import type { AppearanceSpec, Config, DeepReadonly } from '../sim/types';
import { buildScene } from './scene/build';
import { hash32 } from './scene/hash';
import type { DrawCommand, Facing } from './scene/types';

export function appearanceHash(spec: DeepReadonly<AppearanceSpec>): string {
  return hashSignature(JSON.stringify(spec));
}
function hashSignature(signature: string): string {
  return hash32(signature).toString(16).padStart(8, '0') + hash32(signature, 2246822507).toString(16).padStart(8, '0');
}

/** Bounded LRU owned by rendering. Full signatures guard against hash collisions. */
export function createSceneCache(settings: DeepReadonly<Config> = config) {
  const entries = new Map<string, { signature: string; scene: DeepReadonly<DrawCommand[]> }>();
  let hits = 0, misses = 0;
  const limits = settings.appearance.cache;
  function freeze<T>(value: T): T {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  }
  return {
    get(spec: DeepReadonly<AppearanceSpec>, facing: Facing, displayScale = 1): DeepReadonly<DrawCommand[]> {
      const quantized = Math.round(displayScale / limits.scaleQuantum) * limits.scaleQuantum;
      const signature = JSON.stringify(spec), key = `${hashSignature(signature)}:${quantized}:${facing}`;
      const previous = entries.get(key);
      if (previous?.signature === signature) { hits++; entries.delete(key); entries.set(key, previous); return previous.scene; }
      misses++;
      const scene = freeze(buildScene(spec, facing, settings));
      if (limits.maximum > 0) {
        entries.set(key, { signature, scene });
        while (entries.size > limits.maximum) entries.delete(entries.keys().next().value!);
      }
      return scene;
    },
    clear() { entries.clear(); hits = 0; misses = 0; },
    statistics() { return { hits, misses, size: entries.size, maximum: limits.maximum }; },
  };
}

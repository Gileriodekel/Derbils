import type { DeepReadonly, FamilyTie, SaveState } from '../types';
type World = DeepReadonly<SaveState>;
const caches = new WeakMap<World['organisms'], Map<string, string[]>>();
function parents(state: World) {
  let cached = caches.get(state.organisms);
  if (!cached) {
    cached = new Map(state.organisms.map(o=>[o.id,[...o.parents]]));
    caches.set(state.organisms, cached);
  }
  return cached;
}
/** Direction is from a to b. Genealogical facts never live on relationship edges. */
export function familyTie(state: World, a: string, b: string): FamilyTie {
  const p = parents(state), A = p.get(a) ?? [], B = p.get(b) ?? [];
  if (A.includes(b)) return 'parent';
  if (B.includes(a)) return 'child';
  return a !== b && A.some(id => B.includes(id)) ? 'sibling' : 'none';
}

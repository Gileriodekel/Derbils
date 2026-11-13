import { isArchivedAncestor } from './archive';
import type { DeepReadonly, SaveState } from './types';

/** Organism ancestry survives rebirth; ancestors through two generations exclude first cousins. */
export function permittedKinship(state: DeepReadonly<SaveState>, a: string, b: string): boolean {
  if (a === b) return false;
  const nodes = new Map(state.organisms.map(o => [o.id, o]));
  function ancestors(id: string, depth = Infinity, found = new Set<string>()): Set<string> {
    if(isArchivedAncestor(id))return found;
    const node = nodes.get(id);
    if (!node) throw new Error('Missing ancestor data.');
    if (depth <= 0) return found;
    for (const parent of node.parents) if (depth < Infinity || !found.has(parent)) {
      found.add(parent); ancestors(parent, depth - 1, found);
    }
    return found;
  }
  if (ancestors(a).has(b) || ancestors(b).has(a)) return false;
  const shallowA = ancestors(a, 2), shallowB = ancestors(b, 2);
  return ![...shallowA].some(id => shallowB.has(id));
}

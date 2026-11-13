import { derivePhenotype } from './expression';
import { crossover, mutate } from './inheritance';
import type { DeepReadonly, OffspringPreview, SaveState } from '../types';

/** Read-only preview: uses a copy of the requested seed, consumes no live RNG and creates no life. */
export function previewOffspring(state: DeepReadonly<SaveState>, first: string, second: string, rng = state.rng.genetics): OffspringPreview {
  if (first === second) throw new Error('Choose two different creatures.');
  const candidates = [first,second].map(id=>state.creatures.find(c=>c.id===id));
  if (!candidates[0] || !candidates[1]) throw new Error('Both preview parents must be in this habitat.');
  const [a,b] = [candidates[0],candidates[1]].sort((x,y)=>x.organismId.localeCompare(y.organismId));
  const parents: [string,string] = [a.id,b.id];
  const crossed = crossover(a.genome, b.genome, rng), mutated = mutate(crossed.genome, crossed.rng);
  return { ...mutated, phenotype: derivePhenotype(mutated.genome), parents };
}

import { locusFor } from './catalog';
import type { DeepReadonly, Genome, TraitGroup } from '../types';

/** Debug/migration edit of a quantitative trait, quantized to the allele-byte resolution. */
export function setTraitValue(input: DeepReadonly<Genome>, group: TraitGroup, trait: string, value: number): Genome {
  const { definition: d, index } = locusFor(group, trait);
  if (d.dominanceType !== 'partial' || !Number.isFinite(value) || value < d.traitRange![0] || value > d.traitRange![1])
    throw new Error('Trait edit requires an in-range quantitative value.');
  const [min, max] = d.alleleRange!, [outMin, outMax] = d.traitRange!;
  const total = Math.round((value - outMin) / (outMax - outMin) * (max - min) * 2);
  return { ...input, [d.chromosome]: { haplotypes: input[d.chromosome].haplotypes.map((h, i) =>
    h.map((a, j) => j === index ? { v: min + (i === 0 ? Math.floor(total / 2) : Math.ceil(total / 2)), d: 1 } : { ...a })) } } as Genome;
}

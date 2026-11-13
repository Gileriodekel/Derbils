import { config } from '../../data/config';
import { uniform } from '../rng';
import { chromosomes, chromosomeLoci } from './catalog';
import type { Allele, DeepReadonly, Genome, GenomeResult, MutationRecord, MutationResult } from '../types';

/** One linked gamete from each parent, in caller-supplied canonical parent order. No mutation here. */
export function crossover(parentA: DeepReadonly<Genome>, parentB: DeepReadonly<Genome>, rng: number): GenomeResult {
  const genome = {} as Genome;
  const draw = () => { const result = uniform(rng); rng = result.state; return result.value; };
  for (const chromosome of chromosomes) {
    const gamete = (parent: DeepReadonly<Genome>): Allele[] => {
      const length = chromosomeLoci(chromosome).length;
      const start = draw() < 1 / 2 ? 0 : 1;
      const cut = draw() < config.genetics.crossoverChance ? 1 + Math.floor(draw() * (length - 1)) : length;
      return Array.from({ length }, (_, i) => ({ ...parent[chromosome].haplotypes[i < cut ? start : 1 - start][i] }));
    };
    genome[chromosome] = { haplotypes: [gamete(parentA), gamete(parentB)] };
  }
  return { genome, rng };
}

type MutationRates = Pick<typeof config.genetics, 'quantitativeMutation' | 'categoricalMutation' | 'dominanceMutation'>;

/** Baseline §3.4 mutations. Acquired exposure is inactive in 5a; no breeding calls this function. */
export function mutate(input: DeepReadonly<Genome>, rng: number, rates: MutationRates = config.genetics): MutationResult {
  const genome = {} as Genome, mutations: MutationRecord[] = [];
  const draw = () => { const result = uniform(rng); rng = result.state; return result.value; };
  for (const chromosome of chromosomes) {
    const definitions = chromosomeLoci(chromosome);
    const mutateHaplotype = (h: 0 | 1): Allele[] => definitions.map((locus, i) => {
      const before = input[chromosome].haplotypes[h][i], after = { ...before };
      if (locus.dominanceType === 'categorical') {
        if (draw() < rates.categoricalMutation) {
          const options = locus.options!.filter(o => o.value !== before.v);
          const chosen = options[Math.floor(draw() * options.length)]; after.v = chosen.value; after.d = chosen.dominance;
        }
      } else {
        if (draw() < rates.quantitativeMutation) {
          const [stepMin, stepMax] = config.genetics.mutationStep;
          const sign = draw() < 1 / 2 ? -1 : 1;
          const step = stepMin + Math.floor(draw() * (stepMax - stepMin + 1));
          const [min, max] = locus.alleleRange!;
          let value = (before.v as number) + sign * step;
          if (locus.dominanceType === 'circular') value = ((value - min) % (max - min + 1) + max - min + 1) % (max - min + 1) + min;
          else value = value < min ? 2 * min - value : value > max ? 2 * max - value : value;
          after.v = value;
        }
        if (draw() < rates.dominanceMutation) after.d = after.d === 0 ? 1 : 0;
      }
      if (after.v !== before.v || after.d !== before.d) mutations.push({ chromosome, locus: locus.id, haplotype: h, before: { ...before }, after: { ...after } });
      return after;
    });
    genome[chromosome] = { haplotypes: [mutateHaplotype(0), mutateHaplotype(1)] };
  }
  return { genome, rng, mutations };
}

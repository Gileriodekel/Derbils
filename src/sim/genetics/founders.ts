import { uniform, normalizeSeed } from '../rng';
import { chromosomes, chromosomeLoci } from './catalog';
import type { Allele, Chromosome, Genome, GenomeResult } from '../types';

export function randomGenome(rng: number): GenomeResult {
  const genome = {} as Genome;
  const draw = () => { const result = uniform(rng); rng = result.state; return result.value; };
  for (const key of chromosomes) {
    const definitions = chromosomeLoci(key);
    const haplotype = (): Allele[] => definitions.map(locus => {
      if (locus.dominanceType === 'categorical') {
        let sample = draw();
        const option = locus.options!.find(o => { sample -= o.founderWeight; return sample < 0; }) ?? locus.options!.at(-1)!;
        return { v: option.value, d: option.dominance };
      }
      const [min, max] = locus.founderRange!;
      return { v: min + Math.floor(draw() * (max - min + 1)), d: draw() < 1 / 2 ? 0 : 1 };
    });
    const chromosome: Chromosome = { haplotypes: [haplotype(), haplotype()] };
    genome[key] = chromosome;
  }
  return { genome, rng };
}

/** Stable identity seed for historical migrations; never consumes a saved stream. */
export function genomeSeed(seed: number, id: string): number {
  let rng = normalizeSeed(seed);
  for (const char of id) rng = normalizeSeed(Math.imul(rng ^ char.charCodeAt(0), 16777619));
  return normalizeSeed(Math.imul(rng ^ (rng >>> 16), 2246822507));
}

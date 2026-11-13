import { chromosomes, chromosomeLoci } from './catalog';
import type { Genome } from '../types';

function object(v: unknown): v is Record<string, unknown> { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function keys(v: unknown, names: readonly string[]): v is Record<string, unknown> {
  return object(v) && Object.keys(v).length === names.length && names.every(k => Object.hasOwn(v, k));
}
function requireGenome(ok: unknown): asserts ok { if (!ok) throw new Error('Invalid genome: loci, allele values or dominance ranks.'); }

/** Validates the full four-pair/26-locus contract using the catalog, including intrinsic ranks. */
export function validateGenome(data: unknown): asserts data is Genome {
  requireGenome(keys(data, chromosomes));
  for (const chromosome of chromosomes) {
    const c = data[chromosome], definitions = chromosomeLoci(chromosome);
    requireGenome(keys(c, ['haplotypes']) && Array.isArray(c.haplotypes) && c.haplotypes.length === 2);
    for (const h of c.haplotypes) {
      requireGenome(Array.isArray(h) && h.length === definitions.length);
      for (const [i, a] of h.entries()) {
        requireGenome(keys(a, ['v', 'd']) && (a.d === 0 || a.d === 1));
        const d = definitions[i];
        if (d.dominanceType === 'categorical') requireGenome(d.options?.some(o => o.value === a.v && o.dominance === a.d));
        else requireGenome(typeof a.v === 'number' && Number.isInteger(a.v) && d.alleleRange
          && a.v >= d.alleleRange[0] && a.v <= d.alleleRange[1]);
      }
    }
  }
}

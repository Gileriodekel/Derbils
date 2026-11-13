import { config, fruitKinds, tasteKeys } from '../../data/config';
import { loci, locusAlleles, locusFor } from './catalog';
import type { Allele, Creature, DeepReadonly, Genome, LocusDefinition, Phenotype, Skill, TraitGroup, Taste } from '../types';

/** §3.2 partial dominance, circular hue mean, or intrinsic categorical dominance. */
export function expressLocus(a: DeepReadonly<Allele>, b: DeepReadonly<Allele>, locus: LocusDefinition): number | string {
  if (locus.dominanceType === 'categorical') {
    if (a.d !== b.d) return a.d > b.d ? a.v : b.v;
    const first = locus.options!.find(o => o.value === a.v || o.value === b.v);
    return first!.value;
  }
  if (typeof a.v !== 'number' || typeof b.v !== 'number') throw new Error('Quantitative locus needs numeric alleles.');
  const dominant = config.genetics.dominantWeight;
  const weight = a.d === b.d ? 1 / 2 : a.d > b.d ? dominant : 1 - dominant;
  const [min, max] = locus.alleleRange!, [outMin, outMax] = locus.traitRange!;
  if (locus.dominanceType === 'circular') {
    const period = max - min + 1;
    const angleA = (a.v - min) / period * 2 * Math.PI, angleB = (b.v - min) / period * 2 * Math.PI;
    const x = weight * Math.cos(angleA) + (1 - weight) * Math.cos(angleB);
    const y = weight * Math.sin(angleA) + (1 - weight) * Math.sin(angleB);
    const fraction = Math.hypot(x, y) < config.genetics.circularEpsilon
      ? Math.min(a.v, b.v) / period : ((Math.atan2(y, x) / (2 * Math.PI)) % 1 + 1) % 1;
    return outMin + fraction * (outMax - outMin);
  }
  const q = (weight * (a.v - min) + (1 - weight) * (b.v - min)) / (max - min);
  return outMin + q * (outMax - outMin);
}

type Expression = { av: number | string; ad: number; bv: number | string; bd: number; value: number | string };
const expressions = new WeakMap<DeepReadonly<Genome>, Map<LocusDefinition, Expression>>();
/** Derived cache only. Check allele values as well as identity, including debug/in-place edits. */
function expressed(genome: DeepReadonly<Genome>, locus: typeof loci[number]): number | string {
  const [a, b] = locusAlleles(genome, locus);
  let cache = expressions.get(genome);
  if (!cache) { cache = new Map(); expressions.set(genome, cache); }
  const old = cache.get(locus.definition);
  if (old && old.av === a.v && old.ad === a.d && old.bv === b.v && old.bd === b.d) return old.value;
  const value = expressLocus(a, b, locus.definition);
  cache.set(locus.definition, { av: a.v, ad: a.d, bv: b.v, bd: b.d, value });
  return value;
}
export function expressTrait(genome: DeepReadonly<Genome>, group: TraitGroup, trait: string): number | string {
  return expressed(genome, locusFor(group, trait));
}

export function derivePhenotype(genome: DeepReadonly<Genome>): Phenotype {
  const result = { aptitudes: {}, tasteBias: {}, fruitTaste: {}, personality: {}, palette: {}, body: {} };
  for (const locus of loci) {
    (result[locus.definition.traitGroup] as Record<string, number | string>)[locus.definition.trait] = expressed(genome, locus);
  }
  const taste = result.tasteBias as Taste;
  const sum = tasteKeys.reduce((n, key) => n + taste[key], 0);
  result.fruitTaste = Object.fromEntries(fruitKinds.map(kind => [kind,
    2 * tasteKeys.reduce((n, key) => n + (sum > 0 ? taste[key] / sum : 1 / tasteKeys.length) * config.fruit[kind].taste[key], 0) - 1]));
  return result as Phenotype;
}

export function skillAptitude(c: DeepReadonly<Pick<Creature, 'genome'>>, skill: Skill): number {
  return expressTrait(c.genome, 'aptitudes', skill) as number;
}

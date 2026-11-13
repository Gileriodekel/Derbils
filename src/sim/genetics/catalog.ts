import { config } from '../../data/config';
import type { ChromosomeKey, DeepReadonly, Genome, LocusDefinition, TraitGroup } from '../types';

export const chromosomes = [...new Set(config.genes.map(locus => locus.chromosome))];
export const loci = config.genes.map(definition => ({ definition,
  index: config.genes.filter(l => l.chromosome === definition.chromosome).indexOf(definition) }));
const traits = new Map<TraitGroup, Map<string, typeof loci[number]>>();
for (const locus of loci) {
  let group = traits.get(locus.definition.traitGroup);
  if (!group) { group = new Map(); traits.set(locus.definition.traitGroup, group); }
  group.set(locus.definition.trait, locus);
}

export function locusFor(group: TraitGroup, trait: string) {
  const locus = traits.get(group)?.get(trait);
  if (!locus) throw new Error(`Unknown genetic trait ${group}.${trait}.`);
  return locus;
}

export function locusAlleles(genome: DeepReadonly<Genome>, locus: { definition: LocusDefinition; index: number }) {
  const chromosome = genome[locus.definition.chromosome];
  return [chromosome.haplotypes[0][locus.index], chromosome.haplotypes[1][locus.index]] as const;
}

export function chromosomeLoci(chromosome: ChromosomeKey) {
  return config.genes.filter(l => l.chromosome === chromosome);
}

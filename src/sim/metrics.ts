import { loci, locusAlleles } from './genetics/catalog';
import type { DeepReadonly, SaveState } from './types';

/** Fraction of diploid loci with different values; ranks cannot inflate allele diversity. */
export function geneticDiversity(state: DeepReadonly<SaveState>) {
  const population=state.creatures;
  let heterozygous=0;
  const distinct=loci.map(locus=>{
    const values=new Set<string>();
    for(const c of population){
      const [a,b]=locusAlleles(c.genome,locus);if(a.v!==b.v)heterozygous++;
      values.add(String(a.v));values.add(String(b.v));
    }
    return {locus:locus.definition.id,alleles:values.size};
  });
  return {heterozygosity:population.length?heterozygous/(population.length*loci.length):0,
    meanDistinctAlleles:distinct.reduce((n,l)=>n+l.alleles,0)/loci.length,distinct};
}

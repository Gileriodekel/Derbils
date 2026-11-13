import { config } from '../../data/config';
import { locusFor } from '../genetics/catalog';
import { validateGenome } from '../genetics/validate';
import { setTraitValue } from '../genetics/edits';
import type { AppearanceGenePatch, SaveState } from '../types';

/** Explicit debug edit, limited to visible gene channels; XP, acquired modifiers and RNG are untouched. */
export function setAppearanceGenes(state: SaveState, id: string, patch: AppearanceGenePatch): SaveState {
  const c = state.creatures.find(c => c.id === id);
  if (!c) throw new Error('Select a living creature.');
  const definitions = config.genes.filter(g => g.traitGroup === 'palette' || g.traitGroup === 'body');
  let genome = JSON.parse(JSON.stringify(c.genome)) as typeof c.genome;
  for (const [trait, value] of Object.entries(patch)) {
    const definition = definitions.find(g => g.trait === trait);
    if (!definition) throw new Error('Only palette and proportion genes may be edited here.');
    const { index } = locusFor(definition.traitGroup, trait);
    if (definition.dominanceType === 'partial') {
      if (typeof value !== 'number') throw new Error('Use a numeric gene value.');
      genome = setTraitValue(genome, definition.traitGroup, trait, value);
      continue;
    }
    let allele;
    if (definition.dominanceType === 'circular') {
      const [min, max] = definition.traitRange!, [low, high] = definition.alleleRange!;
      if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Hue is outside its gene range.');
      allele = { v: low + Math.round((value - min) / (max - min) * (high - low + 1)) % (high - low + 1), d: 1 as const };
    } else {
      const option = definition.options!.find(o => o.value === value);
      if (!option) throw new Error('Unknown pattern or ear style.');
      allele = { v: option.value, d: option.dominance };
    }
    for (const haplotype of genome[definition.chromosome].haplotypes) haplotype[index] = { ...allele };
  }
  validateGenome(genome);
  return { ...state, creatures: state.creatures.map(other => other.id === id ? { ...other, genome } : other) };
}

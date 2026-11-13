import { derivePhenotype } from '../genetics/expression';
import { genomeSeed } from '../genetics/founders';
import { resolvePalette } from './palette';
import { clampRange } from './color';
import { skillLevel } from '../skills';
import type { AppearanceSpec, Config, Creature, DeepReadonly, Proportion, VisiblePart } from '../types';

/** Derived only. Production callers supply the permanent organism's saved appearance seed. */
export function computeAppearance(creature: DeepReadonly<Creature>, config: DeepReadonly<Config>, appearanceSeed = genomeSeed(config.appearance.pattern.fallbackSeed, creature.organismId)): AppearanceSpec {
  const catalog = config.appearance;
  const choices = new Map<string, VisiblePart>();
  const mobile = config.lifecycle.stages[creature.stage].mobile;
  const levels = Object.fromEntries(catalog.skillOrder.map(skill => [skill, skillLevel(creature, skill)]));
  for (const part of catalog.parts) {
    if (!mobile) break;
    if(part.cosmetic&&creature.awards.equipped!==part.cosmetic)continue;
    const level = part.skill === null ? 0 : levels[part.skill];
    const tier = part.tiers.filter(t => t.levelThreshold <= level).at(-1);
    if (!tier) continue;
    const slot = catalog.slots.find(s => s.id === part.slot)!;
    const candidate = { partId: part.id, slot: part.slot, tier: tier.tier, sourceSkill: part.skill,
      layerIndex: catalog.layerOrder.indexOf(slot.layer) };
    const existing = choices.get(part.slot);
    const priority = (p: VisiblePart) => p.sourceSkill === null ? catalog.skillOrder.length : catalog.skillOrder.indexOf(p.sourceSkill);
    if (!existing || candidate.tier > existing.tier || (candidate.tier === existing.tier && priority(candidate) < priority(existing)))
      choices.set(part.slot, candidate);
  }
  const phenotype = derivePhenotype(creature.genome);
  const proportions = Object.fromEntries(Object.entries(catalog.proportions).map(([key, bounds]) =>
    [key, clampRange(phenotype.body[key as Proportion], bounds)])) as AppearanceSpec['proportions'];
  return { parts: [...choices.values()].sort((a, b) => a.layerIndex - b.layerIndex ||
    catalog.parts.findIndex(p => p.id === a.partId) - catalog.parts.findIndex(p => p.id === b.partId)),
    stage: creature.stage, bodyScale: config.lifecycle.stages[creature.stage].scale, baseColors: resolvePalette(creature, config, phenotype.palette),
    proportions, ears: phenotype.body.ears, pattern: { kind: phenotype.palette.pattern, seed: phenotype.palette.pattern === 'solid' ? 0 : appearanceSeed } };
}

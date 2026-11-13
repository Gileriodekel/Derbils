import { config, skillKeys } from '../data/config';
import { randomGenome } from '../sim/genetics/founders';
import { setTraitValue } from '../sim/genetics/edits';
import { setAppearanceGenes } from '../sim/appearance/edits';
import { crossover, mutate } from '../sim/genetics/inheritance';
import { createHabitat } from '../sim/habitat';
import { normalizeSeed, uniform } from '../sim/rng';
import { skillCap, xpAtLevel } from '../sim/skills';
import { hash32 } from './scene/hash';
import type { Creature, Genome } from '../sim/types';

export interface GallerySample { id: string; label: string; preset: string; creature: Creature; appearanceSeed: number }

/** Detached QA fixtures. Never advances or writes the player's world or its random streams. */
export function gallerySamples(seed = config.appearance.gallery.seed): GallerySample[] {
  const world = createHabitat(seed, 1), template = world.creatures[0];
  const clone = () => JSON.parse(JSON.stringify(template)) as Creature;
  function maxed(skills: readonly typeof skillKeys[number][], genome?: Genome, level?: number): Creature {
    const c = clone(); if (genome) c.genome = genome;
    for (const skill of skills) {
      c.genome = setTraitValue(c.genome, 'aptitudes', skill, 1);
      c.xp[skill] = xpAtLevel(level ?? config.skillCatalog[skill].levelCap, skill);
    }
    return c;
  }
  const samples: GallerySample[] = [];
  const add = (id: string, label: string, preset: string, creature: Creature, appearanceSeed = hash32(`${seed}:${id}`) || 1) => samples.push({ id, label, preset, creature, appearanceSeed });
  const originalSeed = world.organisms[0].appearanceSeed;
  add('base', 'Base · level 0', 'base', clone(), originalSeed);
  for (const skill of skillKeys) add(skill, `${config.skillCatalog[skill].name} · max`, skill, maxed([skill]), originalSeed);
  add('all', 'All skills · max', 'all', maxed(skillKeys), originalSeed);
  let rng = normalizeSeed(seed);
  for (let i = 0; i < config.appearance.gallery.randomCount; i++) {
    const c = clone(), result = randomGenome(rng); c.genome = result.genome; rng = result.rng;
    for (const skill of skillKeys) { const roll = uniform(rng); rng = roll.state;
      c.xp[skill] = xpAtLevel(Math.floor(roll.value * (skillCap(c, skill) + 1)), skill); }
    add(`random-${String(i + 1).padStart(2, '0')}`, `Founder ${String(i + 1).padStart(2, '0')}`, 'random', c);
  }
  for (const level of config.appearance.gallery.progression) add(`progression-${level}`, `Same genes · level ${level}`, 'progression', maxed(skillKeys, undefined, level), originalSeed);
  const parents: Creature[] = [];
  for (const letter of ['a', 'b']) {
    const result = randomGenome(rng); rng = result.rng;
    const c = maxed(skillKeys, result.genome, config.appearance.gallery.progression.at(-1));
    parents.push(c); add(`parent-${letter}`, `Parent ${letter.toUpperCase()}`, 'family', c);
  }
  for (let i = 0; i < config.appearance.gallery.offspring; i++) {
    const crossed = crossover(parents[0].genome, parents[1].genome, rng), child = mutate(crossed.genome, crossed.rng); rng = child.rng;
    const c = clone(); c.genome = child.genome;
    for (const skill of skillKeys) c.xp[skill] = xpAtLevel(config.appearance.gallery.progression.at(-1)!, skill);
    add(`offspring-${i + 1}`, `Offspring ${i + 1}`, 'family', c);
  }
  const colorRanges = [
    {id:'warm-body-cool-tail',patch:{baseHue:25,feetHue:120,eyeHue:220,tailHue:260}},
    {id:'cool-body-warm-tail',patch:{baseHue:220,feetHue:330,eyeHue:40,tailHue:25}},
    {id:'muted-colors',patch:{saturation:45}},
    {id:'bright-colors',patch:{saturation:85}},
  ];
  for (const { id, patch } of colorRanges) {
    const c = maxed(skillKeys), state = { ...world, creatures: [c] };
    add(`range-${id}`, id.replaceAll('-', ' '), 'ranges', setAppearanceGenes(state, c.id, patch).creatures[0]);
  }
  return samples;
}

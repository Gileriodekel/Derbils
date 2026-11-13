import { config, needKeys } from '../data/config';
import type { Creature, Needs } from './types';
import { personalityTrait } from './personality';

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function applyEffects(creature: Creature, effects: Needs, scale = 1): void {
  if (!creature.needs) return;
  for (const key of needKeys) creature.needs[key] = clamp(creature.needs[key] + effects[key] * scale);
}

/** Internal tick helpers mutate only the tick's private clone. */
export function advanceNeeds(creature: Creature, tick: number): void {
  if (!creature.needs) return;
  const { needs, world, clock } = config;
  const sleeping = creature.currentAction?.kind === 'sleep' && creature.currentAction.path.length === 0;
  const rates = { ...needs.perMinute };
  rates.hunger *= config.lifecycle.stages[creature.stage].needMultiplier;
  rates.fatigue *= config.lifecycle.stages[creature.stage].needMultiplier;
  rates.boredom *= needs.curiosityBoredomBase + needs.curiosityBoredomWeight * personalityTrait(creature, 'curiosity');
  rates.loneliness *= needs.sociabilityLonelinessBase + needs.sociabilityLonelinessWeight * personalityTrait(creature, 'sociability');
  if ((tick % clock.dayTicks) / clock.dayTicks >= world.nightStart) rates.fatigue *= needs.nightFatigueMultiplier;
  if (sleeping) {
    rates.fatigue = 0;
    rates.boredom = 0;
    rates.loneliness *= needs.sleepLonelinessMultiplier;
  }
  applyEffects(creature, rates, clock.tickSeconds / 60);
}

export function wellbeing(needs: Needs): number {
  return 1 - needKeys.reduce((sum, key) => sum + config.mood.needWeights[key] * needs[key], 0) / 100;
}

export function advanceMood(creature: Creature): void {
  if (!creature.needs) return;
  creature.recentValence *= Math.exp(-config.clock.tickSeconds / config.mood.valenceDecayTicks);
  const target = clamp(2 * wellbeing(creature.needs) - 1 + creature.recentValence, -1, 1);
  creature.mood += (target - creature.mood) * (1 - Math.exp(-config.clock.tickSeconds / config.mood.responseTicks));
}

export function urgentNeed(creature: Pick<Creature, 'needs'>): 'hunger' | 'fatigue' | null {
  if (!creature.needs) return null;
  const { hunger, fatigue } = creature.needs;
  const threshold = config.needs.urgentThreshold;
  if (hunger >= threshold && hunger >= fatigue) return 'hunger';
  if (fatigue >= threshold) return 'fatigue';
  return hunger >= threshold ? 'hunger' : null;
}

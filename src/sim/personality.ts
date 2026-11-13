import { config } from '../data/config';
import { expressTrait } from './genetics/expression';
import type { Creature, DeepReadonly, PersonalityTrait } from './types';

export function zeroPersonalityDrift(): Creature['personalityDrift'] {
  return Object.fromEntries(config.genes.filter(g => g.traitGroup === 'personality').map(g => [g.trait, 0])) as Creature['personalityDrift'];
}

export function personalityTrait(c: DeepReadonly<Creature>, trait: PersonalityTrait): number {
  return Math.max(0, Math.min(1, (expressTrait(c.genome, 'personality', trait) as number) + c.personalityDrift[trait]));
}

export function decayPersonality(c: Creature): void {
  const decay = Math.exp(-config.clock.tickSeconds / (config.personality.returnTimeDays * config.clock.dayTicks));
  for (const trait of Object.keys(c.personalityDrift) as PersonalityTrait[]) c.personalityDrift[trait] *= decay;
}

/** Only the first completion of a new training activity exists in this milestone's event set. */
export function rewardNewActivity(c: Creature, tick: number): void {
  if (c.lastPersonalityRewardTick !== null && tick - c.lastPersonalityRewardTick < config.personality.rewardCooldownTicks) return;
  c.personalityDrift.boldness = Math.min(config.personality.driftLimit, c.personalityDrift.boldness + config.personality.positiveEventStep);
  c.lastPersonalityRewardTick = tick;
}

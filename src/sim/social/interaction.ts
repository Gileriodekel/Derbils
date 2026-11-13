import { personalityTrait } from '../personality';
import { uniform } from '../rng';
import type { Config, Creature, DeepReadonly, InteractionKind, InteractionResult } from '../types';

/** Initiator/recipient order is explicit. Only play consumes a roll; neither input is mutated. */
export function resolveInteraction(a: DeepReadonly<Creature>, b: DeepReadonly<Creature>, kind: Exclude<InteractionKind, 'contest' | 'debug' | 'share' | 'steal' | 'fight'>,
  rng: number, settings: DeepReadonly<Config>, existingBond = 0): InteractionResult {
  const s = settings.social;
  let rude = false;
  if (kind === 'play') {
    const gentle = (personalityTrait(a, 'gentleness') + personalityTrait(b, 'gentleness')) / 2;
    const competitive = (personalityTrait(a, 'competitiveness') + personalityTrait(b, 'competitiveness')) / 2;
    const roll = uniform(rng); rng = roll.state;
    rude = roll.value < s.rudePlayBaseChance + s.rudePlayTraitChance * (1 - gentle) * competitive;
  }
  const source = s.outcomes[kind === 'play' ? rude ? 'rudePlay' : 'friendlyPlay' : kind];
  const effect: InteractionResult = { ...source, valence: [...source.valence], stress: [...source.stress], rng,
    outcome: rude ? 'rude' : kind === 'avoid' ? 'neutral' : 'friendly' };
  if (kind === 'play' && !rude) {
    const sociability = (personalityTrait(a, 'sociability') + personalityTrait(b, 'sociability')) / 2;
    effect.bond *= (s.positiveScaleBase + s.positiveSociabilityWeight * sociability)
      * (s.affinityScaleBase + s.affinityScaleWeight * (existingBond - s.bondBounds[0]) / (s.bondBounds[1] - s.bondBounds[0]));
  }
  return effect;
}

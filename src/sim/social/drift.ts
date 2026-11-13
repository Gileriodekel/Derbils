import { config } from '../../data/config';
import { clamp } from '../needs';
import type { Creature, SocialRewardKind } from '../types';

export function rewardSocialExperience(c: Creature, kind: SocialRewardKind, tick: number, recipient = false): void {
  const previous = c.social.rewardTicks[kind];
  if (previous !== undefined && tick - previous < config.personality.rewardCooldownTicks) return;
  const p = config.personality, s = config.social;
  if (kind === 'friendlyPlay') c.personalityDrift.sociability = clamp(c.personalityDrift.sociability + p.positiveEventStep, -p.driftLimit, p.driftLimit);
  if (kind === 'contest') c.personalityDrift.competitiveness = clamp(c.personalityDrift.competitiveness + p.positiveEventStep, -p.driftLimit, p.driftLimit);
  if (kind === 'comfort' && recipient) c.personalityDrift.gentleness = clamp(c.personalityDrift.gentleness + p.positiveEventStep, -p.driftLimit, p.driftLimit);
  if (kind === 'rudePlay') {
    const trait = recipient ? 'boldness' : 'gentleness', step = recipient ? s.rudeRecipientBoldnessStep : s.rudeGentlenessStep;
    c.personalityDrift[trait] = clamp(c.personalityDrift[trait] + step, -p.driftLimit, p.driftLimit);
  }
  c.social.rewardTicks[kind] = tick;
}

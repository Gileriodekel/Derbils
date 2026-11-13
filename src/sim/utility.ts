import { config, needKeys } from '../data/config';
import { clamp } from './needs';
import { uniform } from './rng';
import type { Candidate, Creature, UtilityScore } from './types';

/** Literal §5.3 formula; unavailable later-milestone inputs are explicitly zero. */
export function scoreUtility(creature: Creature, candidate: Candidate): UtilityScore {
  const needs = creature.needs;
  if (!needs) return { total: 0, terms: {} };
  const { ai, mood } = config;
  const needBenefit = needKeys.reduce((sum, key) => sum + mood.needWeights[key]
    * (needs[key] / 100) ** 2 * clamp(candidate.relief[key] / ai.reliefScales[key], 0, 1), 0);
  const terms = {
    needs: ai.utility.needs * needBenefit,
    personality: ai.utility.personality * candidate.personalityFit,
    preference: ai.utility.preference * candidate.preference,
    growth: ai.utility.growth * candidate.growthInterest,
    social: ai.utility.social * candidate.socialAffinity,
    encouragement: candidate.encouragement,
    courtship: candidate.courtshipInterest,
    travel: -ai.utility.travelPenalty * clamp(candidate.estimatedTravelSeconds / ai.travelScaleSeconds, 0, 1),
    fatigue: -ai.utility.fatiguePenalty * clamp(candidate.predictedFatigueIncrease / ai.fatiguePenaltyScale, 0, 1),
    repeat: -ai.utility.repeatPenalty * Number(creature.lastCompletedAction === candidate.kind),
  };
  return { total: Object.values(terms).reduce((sum, term) => sum + term, 0), terms };
}

/** Same ordered sum as scoreUtility, without inspector-only term-object allocation in hot decisions. */
export function utilityTotal(creature: Creature, candidate: Candidate): number {
  const needs=creature.needs;if(!needs)return 0;
  const {ai,mood}=config;let benefit=0;
  for(const key of needKeys)benefit+=mood.needWeights[key]*(needs[key]/100)**2*clamp(candidate.relief[key]/ai.reliefScales[key],0,1);
  return ai.utility.needs*benefit + ai.utility.personality*candidate.personalityFit
    + ai.utility.preference*candidate.preference + ai.utility.growth*candidate.growthInterest
    + ai.utility.social*candidate.socialAffinity + candidate.encouragement + candidate.courtshipInterest
    - ai.utility.travelPenalty*clamp(candidate.estimatedTravelSeconds/ai.travelScaleSeconds,0,1)
    - ai.utility.fatiguePenalty*clamp(candidate.predictedFatigueIncrease/ai.fatiguePenaltyScale,0,1)
    - ai.utility.repeatPenalty*Number(creature.lastCompletedAction===candidate.kind);
}

export function softmaxIndex(scores: readonly number[], rng: number, temperature = config.ai.temperature): { index: number; rng: number } {
  if (!scores.length) throw new Error('Cannot choose from an empty candidate list.');
  const max = Math.max(...scores);
  const weights = scores.map(score => Math.exp((score - max) / temperature));
  const draw = uniform(rng);
  let remaining = draw.value * weights.reduce((sum, weight) => sum + weight, 0);
  for (let i = 0; i < weights.length; i += 1) {
    remaining -= weights[i];
    if (remaining < 0) return { index: i, rng: draw.state };
  }
  return { index: weights.length - 1, rng: draw.state };
}

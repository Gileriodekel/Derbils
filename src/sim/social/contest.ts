import { uniform } from '../rng';
import type { Config, ContestEntrant, ContestResult, DeepReadonly, Skill } from '../types';

/** Shared one-skill performance resolver for informal sessions and future organized entrants. */
export function resolveContest(participants: readonly DeepReadonly<ContestEntrant>[], skill: Skill, rng: number, settings: DeepReadonly<Config>): ContestResult {
  if (participants.length < 2 || new Set(participants.map(p => p.id)).size !== participants.length) throw new Error('A contest needs distinct participants.');
  const s = settings.social.contest, startRng = rng;
  const ranking = [...participants].sort((a,b) => a.id.localeCompare(b.id)).map(p => {
    const condition = (s.conditionBase + s.conditionWeight * p.wellbeing) * p.stagePerformance * (1 + (p.confidence??0));
    const effective = (s.skillOffset + p.level) * condition, stamina = (s.skillOffset + p.staminaLevel) * condition;
    const base = skill === 'stamina' ? effective : s.primaryWeight * effective + s.staminaWeight * stamina;
    const first = uniform(rng), second = uniform(first.state); rng = second.state;
    return { ...p, rank: 0, base, score: base * (1 + s.noiseAmplitude * (first.value + second.value - 1)) };
  }).sort((a,b) => (Math.abs(b.score-a.score) >= s.tieEpsilon ? b.score-a.score : 0)
    || (Math.abs(b.base-a.base) >= s.tieEpsilon ? b.base-a.base : 0) || a.id.localeCompare(b.id));
  ranking.forEach((p,i) => { p.rank = i + 1; });
  const margin = Math.max(0, ranking[0].score - ranking[1].score), winnerId = margin < s.tieEpsilon ? null : ranking[0].id;
  return { skill, ranking, winnerId, margin, startRng, rng, effects: ranking.map(p => ({ id: p.id, valence: p.id === winnerId ? s.winnerValence : s.otherValence })) };
}

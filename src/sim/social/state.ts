import { config, skillKeys } from '../../data/config';
import type { SocialMemory, SocialState } from '../types';

export function emptySocialMemory(): SocialMemory {
  return { nextTargetTick: 0, targets: [], contestCooldowns: {}, rivalBoosts: {},
    rivalExtraXpToday: Object.fromEntries(skillKeys.map(k => [k, 0])) as SocialMemory['rivalExtraXpToday'], rewardTicks: {},
    preferences: { play: { learnedMean: 0, samples: 0 }, comfort: { learnedMean: 0, samples: 0 }, contest: { learnedMean: 0, samples: 0 } },
    mourning: null, lastInteraction: null };
}
export function emptySocialState(): SocialState {
  return { sessions: [], nextMaintenanceTick: 0, statistics: { interactions: 0, friendlyPlays: 0, rudePlays: 0, contests: 0,
    friendships: 0, rivalries: 0, mateBondsFormed: 0, mateBondsBroken: 0, matings: 0, bondedMatings: 0, friendMatings: 0,
    aptitudeWins: Array.from({ length: config.social.contest.aptitudeBands.length + 1 }, () => ({ entries: 0, wins: 0 })),
    correlation: { count: 0, levels: 0, levelsSquared: 0, wins: 0, levelWins: 0 } } };
}

import { config } from '../../data/config';
import type { CompetitionMemory, CompetitionState } from '../types';
export function emptyCompetitionMemory(): CompetitionMemory {
  return { nextEntryTick: 0, stats: { entered: 0, wins: 0, podiums: 0, bestPlacement: {} } };
}
export function emptyCompetitionState(): CompetitionState {
  const bands = (n: number) => Array.from({length:n+1},()=>({entries:0,wins:0}));
  return { skillCooldowns: {}, nextAutoTick: config.competitions.autoCadenceTicks, statistics: {
    held:0,cancelled:0,cancellationReasons:{},entrants:0,dropped:0,accepted:0,
    entryBands:Array.from({length:config.competitions.report.levelBands.length+1},()=>({considered:0,entered:0})),
    aptitudeBands:bands(config.competitions.report.aptitudeBands.length),levelBands:bands(config.competitions.report.levelBands.length),
    placementCorrelation:{count:0,levels:0,levelsSquared:0,placements:0,placementsSquared:0,levelPlacements:0}
  }};
}
export const bandIndex=(value:number,bounds:readonly number[])=>{const i=bounds.findIndex(b=>value<b);return i<0?bounds.length:i;};

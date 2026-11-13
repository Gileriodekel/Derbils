import { config } from '../../data/config';
import type { DeepReadonly, SaveState } from '../types';
export function competitionMetrics(state:DeepReadonly<SaveState>){
  const s=state.competitionState.statistics,q=s.placementCorrelation;
  const denominator=Math.sqrt((q.count*q.levelsSquared-q.levels**2)*(q.count*q.placementsSquared-q.placements**2));
  const rates=(rows:typeof s.aptitudeBands,bounds:readonly number[])=>rows.map((r,i)=>({...r,low:i?bounds[i-1]:0,high:bounds[i]??null,winRate:r.entries?r.wins/r.entries:null}));
  return {held:s.held,cancelled:s.cancelled,cancellationReasons:s.cancellationReasons,averageEntrants:s.held?s.entrants/s.held:0,
    fillRate:s.held+s.cancelled?s.held/(s.held+s.cancelled):null,accepted:s.accepted,dropped:s.dropped,droppedShare:s.accepted?s.dropped/s.accepted:0,
    entryByLevelBand:s.entryBands.map((r,i)=>({...r,low:i?config.competitions.report.levelBands[i-1]:0,high:config.competitions.report.levelBands[i]??null,rate:r.considered?r.entered/r.considered:null})),
    aptitudeWins:rates(s.aptitudeBands,config.competitions.report.aptitudeBands),levelWins:rates(s.levelBands,config.competitions.report.levelBands),
    levelPlacementCorrelation:denominator?(q.count*q.levelPlacements-q.levels*q.placements)/denominator:null};
}

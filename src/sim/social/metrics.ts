import { config } from '../../data/config';
import { relationship } from './relationships';
import { familyTie } from './family';
import type { DeepReadonly, SaveState } from '../types';

export function socialMetrics(state:DeepReadonly<SaveState>){
  const s=config.social,edges=state.relationships.map(r=>relationship(state,r.a,r.b)!),degree=new Map<string,number>();
  for(const r of edges)for(const id of [r.a,r.b])degree.set(id,(degree.get(id)??0)+1);
  const families=edges.map(r=>familyTie(state,r.a,r.b));
  const counts={friends:edges.filter(r=>r.bond>=s.friendBond).length,closeFriends:edges.filter(r=>r.bond>=s.closeFriendBond).length,
    disliked:edges.filter(r=>r.bond<=s.dislikedBond).length,rivals:edges.filter(r=>r.bond<=s.dislikedBond).length,
    mateBonds:edges.filter(r=>r.mateBond>=s.mateBondThreshold).length,positive:edges.filter(r=>r.bond>0).length,negative:edges.filter(r=>r.bond<0).length};
  const stats=state.social.statistics,q=stats.correlation,denominator=Math.sqrt((q.count*q.levelsSquared-q.levels*q.levels)*(q.count*q.wins-q.wins*q.wins));
  return{relationships:edges.length,mateConnections:edges.filter(r=>r.mateBond>0).length,types:counts,
    family:{parentChild:families.filter(t=>t==='parent'||t==='child').length,siblings:families.filter(t=>t==='sibling').length},
    positiveShare:counts.positive+counts.negative?counts.positive/(counts.positive+counts.negative):0,
    affinityDistribution:s.report.affinityBins.slice(0,-1).map((low,i)=>({low,high:s.report.affinityBins[i+1],count:edges.filter(r=>r.bond>=low&&(i===s.report.affinityBins.length-2?r.bond<=s.report.affinityBins[i+1]:r.bond<s.report.affinityBins[i+1])).length})),
    meanRelationships:state.creatures.length?2*edges.length/state.creatures.length:0,maximumRelationships:Math.max(0,...degree.values()),
    friendshipsFormed:stats.friendships,rivalriesFormed:stats.rivalries,mateBondsFormed:stats.mateBondsFormed,mateBondsBroken:stats.mateBondsBroken,
    matings:stats.matings,bondedMatingShare:stats.matings?stats.bondedMatings/stats.matings:0,friendMatingShare:stats.matings?stats.friendMatings/stats.matings:0,
    contests:stats.contests,winRatesByAptitude:stats.aptitudeWins.map((b,i)=>({band:i,low:i?s.contest.aptitudeBands[i-1]:0,high:s.contest.aptitudeBands[i]??1,entries:b.entries,wins:b.wins,winRate:b.entries?b.wins/b.entries:0})),
    levelWinCorrelation:denominator?(q.count*q.levelWins-q.levels*q.wins)/denominator:0};
}

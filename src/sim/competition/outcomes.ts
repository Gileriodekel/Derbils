import { syncAwardRecord } from './inventory';
import { competitionEvent } from './journal';
import { config } from '../../data/config';
import { clamp } from '../needs';
import { commitContestRelationship } from '../social/outcomes';
import { bandIndex } from './state';
import type { Competition, SaveState } from '../types';
export function commitCompetitionOutcome(state:SaveState,e:Competition):void{
  const champion=state.creatures.find(c=>c.id===e.results?.placements[0]?.id);if(champion)state.dynasty.championOrganismId=champion.organismId;
  const result=e.results!,settings=config.competitions,stats=state.competitionState.statistics;
  const entrants=result.placements.map(p=>state.creatures.find(c=>c.id===p.id)!);
  // Divide group contact among peers so an eight-person event cannot mint seven times a pair reward.
  for(let i=0;i<entrants.length;i++)for(let j=i+1;j<entrants.length;j++)
    commitContestRelationship(state,entrants[i],entrants[j],result.placements[0].id,[0,0],settings.stakesMultiplier/(entrants.length-1));
  for(const row of result.placements){
    const c=state.creatures.find(c=>c.id===row.id)!,s=c.competition.stats,win=Number(row.rank===1);
    s.wins+=win;s.podiums+=Number(row.rank<=settings.podiumPlaces);
    for(const skill of e.skills)s.bestPlacement[skill]=Math.min(s.bestPlacement[skill]??row.rank,row.rank);
    c.recentValence=clamp(c.recentValence+(config.prizes.rankValence[row.rank-1]??config.prizes.otherValence),...config.food.valenceBounds);
    if(win)c.awards.confidenceUntilTick=state.clock.tick+config.prizes.confidenceDays*config.clock.dayTicks;
    c.awards.wins+=win;
    for(const skill of e.skills)c.awards.bestPerformance[skill]=Math.max(c.awards.bestPerformance[skill]??0,row.score);
    if(!c.awards.trophies.some(t=>t.competitionId===e.id)){
      c.awards.trophies=[...c.awards.trophies,{competitionId:e.id,skills:[...e.skills],placement:row.rank,tick:state.clock.tick}].slice(-config.prizes.trophyLimit);
      competitionEvent(state,e,'trophyEarned',`${e.skills.join('/')} · placement ${row.rank}`,c.id);
    }
    // Exactly the specified activity learning; no extra winner XP or mating prestige.
    for(const skill of e.skills){
      const memory=c.activityPreferences[skill],start=e.snapshots.find(p=>p.id===c.id)!;
      const reward=clamp(config.skills.rewardWellbeingWeight*(wellbeing(c.needs!)-start.wellbeing)+config.skills.levelReward*Number(skillLevel(c,skill)>start.levels[skill]),-1,1);
      c.activityPreferences[skill]={learnedMean:clamp((1-config.skills.learningRate)*memory.learnedMean+config.skills.learningRate*reward,-1,1),samples:memory.samples+1};
    }
    syncAwardRecord(state,c);
    const apt=stats.aptitudeBands[bandIndex(row.aptitude,settings.report.aptitudeBands)],level=stats.levelBands[bandIndex(row.level,settings.report.levelBands)];
    apt.entries++;apt.wins+=win;level.entries++;level.wins+=win;
    const q=stats.placementCorrelation;q.count++;q.levels+=row.level;q.levelsSquared+=row.level**2;q.placements+=row.rank;q.placementsSquared+=row.rank**2;q.levelPlacements+=row.level*row.rank;
  }
  stats.held++;stats.entrants+=entrants.length;
}
import { wellbeing } from '../needs';
import { skillLevel } from '../skills';

import { resolveContest } from '../social/contest';
import type { Competition, CompetitionResult, CompetitionSnapshot, Config, DeepReadonly, Skill } from '../types';

/** Every roll and one-skill score comes exclusively from the M8 kernel. No prizes or awards. */
export function resolveCompetition(event:DeepReadonly<Competition>,entrants:readonly DeepReadonly<CompetitionSnapshot>[],rng:number,settings:DeepReadonly<Config>):CompetitionResult{
  const format=settings.competitions.formats.find(f=>f.id===event.format);
  if(!format||entrants.length<settings.competitions.minimumEntrants||entrants.length>event.entryRules.maximumEntrants||new Set(entrants.map(p=>p.id)).size!==entrants.length)throw new Error('Invalid competition entrants or format.');
  const startRng=rng,rounds:CompetitionResult['rounds']=[];
  for(let i=0;i<format.rounds;i++){
    const skill:Skill=event.format==='circuit'?event.skills[i]:event.skill;
    const result=resolveContest(entrants.map(c=>({id:c.id,level:c.levels[skill],staminaLevel:c.levels.stamina,wellbeing:c.wellbeing,stagePerformance:c.stagePerformance,aptitude:c.aptitudes[skill],...(c.confidence===undefined?{}:{confidence:c.confidence})})),skill,rng,settings);
    rounds.push(result);rng=result.rng;
  }
  const aggregate=(values:number[])=>format.aggregation==='harmonic'?values.length/values.reduce((n,s)=>n+1/s,0):values.reduce((n,s)=>n+s,0)/values.length;
  const placements=entrants.map(c=>({id:c.id,rank:0,score:aggregate(rounds.map(r=>r.ranking.find(row=>row.id===c.id)!.score)),
    base:aggregate(rounds.map(r=>r.ranking.find(row=>row.id===c.id)!.base)),
    level:event.skills.reduce((n,k)=>n+c.levels[k],0)/event.skills.length,aptitude:event.skills.reduce((n,k)=>n+c.aptitudes[k],0)/event.skills.length
  })).sort((a,b)=>(Math.abs(b.score-a.score)>=settings.social.contest.tieEpsilon?b.score-a.score:0)
    ||(Math.abs(b.base-a.base)>=settings.social.contest.tieEpsilon?b.base-a.base:0)||a.id.localeCompare(b.id));
  placements.forEach((p,i)=>p.rank=i+1);
  return {placements,rounds,startRng,rng,effects:placements.map(c=>({id:c.id,valence:rounds.reduce((n,r)=>n+r.effects.find(e=>e.id===c.id)!.valence,0)/rounds.length}))};
}

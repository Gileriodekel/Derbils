import { effectiveRunning } from './movement';
import { config, skillKeys } from '../../data/config';
import { isEligible } from '../competition/eligibility';
import { resolveContest } from '../social/contest';
import { syncAwardRecord } from '../competition/inventory';
import { skillLevel } from '../skills';
import { skillAptitude } from '../genetics/expression';
import { wellbeing } from '../needs';
import { recordLifeEvent } from '../life-records';
import type { DynastyEvent, SaveState } from '../types';
/** Automatic field events use the established performance resolver for five rounds.
 * They do not relocate participants or interrupt their physically travelled routes. */
function run(s:SaveState,kind:DynastyEvent['kind'],day:number):void {
  const id=`cpt_${String(s.counters.competition++).padStart(8,'0')}`;
  const entrants=s.creatures.filter(c=>isEligible(c,{skills:[],entryRules:config.competitions.entry}).eligible).slice(0,config.competitions.maximumEntrants);
  const scores=new Map(entrants.map(c=>[c.id,0]));
  if(entrants.length>=config.competitions.minimumEntrants) {
    for(const skill of skillKeys){
      const result=resolveContest(entrants.map(c=>({id:c.id,level:skill==='run'?effectiveRunning(c,s.clock.tick):skillLevel(c,skill),staminaLevel:skillLevel(c,'stamina'),wellbeing:wellbeing(c.needs!),
        stagePerformance:config.lifecycle.stages[c.stage].performanceMultiplier,aptitude:skillAptitude(c,skill)})),skill,s.rng.competition,config);
      s.rng.competition=result.rng;for(const row of result.ranking)scores.set(row.id,scores.get(row.id)!+row.score/skillKeys.length);
    }
  } else scores.clear();
  const ranking=[...scores].map(([id,score])=>({id,score})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const winner=s.creatures.find(c=>c.id===ranking[0]?.id);
  const event:DynastyEvent={id,kind,day,tick:day*config.clock.dayTicks,winnerId:winner?.id??null,ranking,awarded:true};
  // Append first: repeated invocation at the same boundary cannot duplicate rewards.
  s.dynasty.events=[...s.dynasty.events,event].slice(-config.dynasty.competitions.historyLimit);
  if(!winner)return;
  for(const [i,row]of ranking.entries()){
    const c=entrants.find(c=>c.id===row.id)!;c.competition.stats.entered++;if(i<config.competitions.podiumPlaces)c.competition.stats.podiums++;
    if(i===0){c.competition.stats.wins++;c.awards.wins++;}
    for(const skill of skillKeys)c.competition.stats.bestPlacement[skill]=Math.min(c.competition.stats.bestPlacement[skill]??Infinity,i+1);
    c.awards.trophies=[...c.awards.trophies,{competitionId:id,skills:[...skillKeys],placement:i+1,tick:s.clock.tick}].slice(-config.prizes.trophyLimit);
    syncAwardRecord(s,c);
  }
  s.dynasty.championOrganismId=winner.organismId;
  if(kind==='cup')winner.dynasty.reincarnationFruit++;
  else for(let i=0;i<config.dynasty.competitions.berryPrize;i++){
    const skill=skillKeys[i%skillKeys.length];winner.dynasty.food.push({id:`f_${String(s.counters.fruit++).padStart(8,'0')}`,kind:config.dynasty.stats[skill].fruit});
  }
  recordLifeEvent(s,{kind:'competitionResult',creatureId:winner.id,from:winner.stage,to:winner.stage,relatedCreatureId:null,
    competitionEvent:{id,reason:`${kind==='derby'?'Derbil Derby':'Derbil Cup'} · day ${day} · ${kind==='cup'?'Reincarnation fruit':`${config.dynasty.competitions.berryPrize} berries`}`}});
}
export function stepDynastyCompetitions(s:SaveState):void {
  const day=Math.floor(s.clock.tick/config.clock.dayTicks),d=s.dynasty,c=config.dynasty.competitions;
  while(Math.min(d.nextDerbyDay,d.nextCupDay)<=day){
    // Derby first on common boundaries. Counters advance even if entry is empty.
    if(d.nextDerbyDay<=d.nextCupDay){const scheduled=d.nextDerbyDay;d.nextDerbyDay+=c.derbyDays;run(s,'derby',scheduled);}
    else {const scheduled=d.nextCupDay;d.nextCupDay+=c.cupDays;run(s,'cup',scheduled);}
  }
}

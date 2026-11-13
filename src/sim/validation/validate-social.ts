import { config, skillKeys } from '../../data/config';
import { navigationTerrain } from '../food-sources';
import { terrainCost, tileIndex } from '../map';
import { validTraining } from '../training';
import { resolveContest } from '../social/contest';
import { emptySocialState } from '../social/state';
import type { Point, SaveState } from '../types';
import { exactKeys, finite, integer, object, requireValue } from './checks';

export function validateSocial(s:SaveState):void{
  const t=s.clock.tick,cfg=config.social,byId=new Map(s.creatures.map(c=>[c.id,c])),active=new Set(s.creatures.map(c=>c.organismId)),known=new Set(s.organisms.map(o=>o.id));
  requireValue(exactKeys(s.social,['sessions','nextMaintenanceTick','statistics'])&&integer(s.social.nextMaintenanceTick,0,t+cfg.maintenanceTicks),'social root');
  const stats=s.social.statistics,shape=emptySocialState().statistics;
  requireValue(exactKeys(stats,Object.keys(shape)),'social statistics');
  for(const key of Object.keys(shape))if(key!=='aptitudeWins'&&key!=='correlation')requireValue(integer(stats[key as keyof typeof stats]),'social count');
  requireValue(Array.isArray(stats.aptitudeWins)&&stats.aptitudeWins.length===cfg.contest.aptitudeBands.length+1
    &&stats.aptitudeWins.every(b=>exactKeys(b,['entries','wins'])&&integer(b.entries)&&integer(b.wins,0,b.entries)),'contest aptitude counts');
  requireValue(exactKeys(stats.correlation,Object.keys(shape.correlation))&&Object.values(stats.correlation).every(n=>finite(n,0,Number.MAX_SAFE_INTEGER))
    &&integer(stats.correlation.count)&&integer(stats.correlation.wins,0,stats.correlation.count),'contest correlation');
  const degree=new Map<string,number>();requireValue(s.relationships.length<=cfg.maximumRelationships,'relationship global cap');
  const kinds=['play','comfort','contest','court','pair','avoid','debug','share','steal','fight'];
  for(const r of s.relationships){
    requireValue(active.has(r.a)&&active.has(r.b),'living relationship endpoints');
    for(const id of [r.a,r.b]){degree.set(id,(degree.get(id)??0)+1);requireValue(degree.get(id)!<=cfg.relationshipsPerCreature,'relationship degree cap');}
    requireValue(Array.isArray(r.history)&&r.history.length<=cfg.historyLimit,'relationship history');let previous=0;
    for(const h of r.history){requireValue(exactKeys(h,['kind','outcome','tick'])&&kinds.includes(h.kind)&&['friendly','rude','neutral'].includes(h.outcome)&&integer(h.tick,previous,t),'interaction history');previous=h.tick;}
  }
  for(const c of s.creatures){
    const m=c.social;
    requireValue(exactKeys(m,['nextTargetTick','targets','contestCooldowns','rivalBoosts','rivalExtraXpToday','rewardTicks','preferences','mourning','lastInteraction'])
      &&integer(m.nextTargetTick,0,t+cfg.targetIntervalTicks)&&Array.isArray(m.targets)&&m.targets.length<=cfg.targetLimit&&new Set(m.targets).size===m.targets.length
      &&m.targets.every(id=>active.has(id)&&id!==c.organismId),'social memory');
    requireValue(object(m.contestCooldowns)&&Object.entries(m.contestCooldowns).every(([id,until])=>active.has(id)&&id!==c.organismId&&integer(until,0,t+cfg.contest.cooldownTicks)),'contest cooldowns');
    requireValue(object(m.rivalBoosts)&&Object.entries(m.rivalBoosts).every(([skill,b])=>skillKeys.includes(skill as typeof skillKeys[number])&&exactKeys(b,['amount','expiresTick'])
      &&finite(b.amount,0,cfg.rivalry.xpBoost)&&integer(b.expiresTick,0,t+cfg.targetIntervalTicks)),'rival practice boost');
    requireValue(exactKeys(m.rivalExtraXpToday,skillKeys)&&Object.values(m.rivalExtraXpToday).every(n=>finite(n,0,cfg.rivalry.dailyExtraXpCap+Number.EPSILON*100)),'daily rival XP cap');
    requireValue(object(m.rewardTicks)&&Object.entries(m.rewardTicks).every(([kind,tick])=>['friendlyPlay','rudePlay','comfort','contest'].includes(kind)&&integer(tick,0,t)),'social drift cooldowns');
    requireValue(exactKeys(m.preferences,['play','comfort','contest'])&&Object.values(m.preferences).every(v=>exactKeys(v,['learnedMean','samples'])&&finite(v.learnedMean,-1,1)&&integer(v.samples)),'social learning');
    requireValue(m.mourning===null||(exactKeys(m.mourning,['organismId','untilTick'])&&known.has(m.mourning.organismId)&&integer(m.mourning.untilTick,t+1,t+cfg.mourning.durationTicks)),'mourning');
    requireValue(m.lastInteraction===null||(exactKeys(m.lastInteraction,['kind','outcome','tick','partner'])&&kinds.includes(m.lastInteraction.kind)&&known.has(m.lastInteraction.partner)
      &&integer(m.lastInteraction.tick,0,t)&&['friendly','rude','neutral'].includes(m.lastInteraction.outcome)),'last interaction');
  }
  requireValue(Array.isArray(s.social.sessions)&&s.social.sessions.length<=Math.floor(s.creatures.length/2),'social session count');
  const locked=new Set(s.sessions.flatMap(s=>s.participants)),ids=new Set(s.sessions.map(s=>s.id)),terrain=navigationTerrain(s.world);
  const walkable=(p:Point)=>exactKeys(p,['x','y'])&&finite(p.x,0,s.world.width-Number.EPSILON)&&finite(p.y,0,s.world.height-Number.EPSILON)&&Number.isFinite(terrainCost(terrain[tileIndex(p,s.world.width)]));
  for(const session of s.social.sessions){
    requireValue(exactKeys(session,['id','kind','participants','startedTick','workStartedTick','workTicks','targets','paths','targetItemId','skill','result','workStarts'])
      &&/^s_[0-9]{8}$/.test(session.id)&&integer(Number(session.id.slice(2)),1,s.counters.session-1)&&!ids.has(session.id)&&['play','comfort','contest'].includes(session.kind)
      &&integer(session.startedTick,0,t)&&integer(session.workTicks,0,config.actions[session.kind].workTicks-1)
      &&(session.workStartedTick===null?session.workTicks===0:integer(session.workStartedTick,session.startedTick,t))
      &&Array.isArray(session.participants)&&session.participants.length===2&&new Set(session.participants).size===2
      &&Array.isArray(session.targets)&&session.targets.length===2&&Array.isArray(session.paths)&&session.paths.length===2,'social session');ids.add(session.id);
    const pair=session.participants.map(id=>byId.get(id));
    requireValue(pair.every(c=>c?.needs&&config.lifecycle.stages[c.stage].mobile&&c.currentAction===null&&!locked.has(c.id)),'social participants');
    for(const [i,c]of pair.entries()){
      locked.add(c!.id);let previous=c!.position;
      requireValue(walkable(session.targets[i])&&Array.isArray(session.paths[i]),'social target');
      for(const p of session.paths[i]){requireValue(walkable(p)&&Number.isInteger(p.x-.5)&&Number.isInteger(p.y-.5)&&(p.x===previous.x||p.y===previous.y)
        &&Math.abs(p.x-previous.x)+Math.abs(p.y-previous.y)<=1,'social cardinal path');previous=p;}
      requireValue(previous.x===session.targets[i].x&&previous.y===session.targets[i].y,'social destination');
      if(session.kind==='contest')requireValue(session.skill&&skillKeys.includes(session.skill)&&validTraining(s,c!,{kind:config.skillCatalog[session.skill].trainingActivity,target:session.targets[i],targetFruitId:null,
        ...(session.targetItemId?{targetItemId:session.targetItemId}:{}),path:[],workTicks:0},terrain),'contest practice site');
    }
    requireValue(session.kind==='contest'||(session.skill===null&&session.targetItemId===null&&session.result===null),'noncontest fields');
    if(session.workStartedTick===null)requireValue(session.workStarts===null&&session.result===null,'unstarted social work');
    else{
      requireValue(Array.isArray(session.workStarts)&&session.workStarts.length===2&&session.workStarts.every(w=>exactKeys(w,['wellbeing','level'])&&finite(w.wellbeing,0,1)&&integer(w.level,0,100))
        &&session.paths.every(p=>!p.length),'social work snapshots');
      if(session.kind==='contest'){
        const result=session.result;
        requireValue(result&&exactKeys(result,['skill','ranking','winnerId','margin','startRng','rng','effects'])&&result.skill===session.skill&&Array.isArray(result.ranking)&&result.ranking.length===2
          &&integer(result.startRng,1,0xffffffff)&&integer(result.rng,1,0xffffffff),'committed contest');
        for(const row of result.ranking)requireValue(exactKeys(row,['id','level','staminaLevel','wellbeing','stagePerformance','aptitude','rank','base','score'])&&session.participants.includes(row.id)
          &&integer(row.level,0,100)&&integer(row.staminaLevel,0,100)&&finite(row.wellbeing,0,1)&&finite(row.stagePerformance,0,1)&&finite(row.aptitude,0,1),'contest snapshot');
        const expected=resolveContest(result.ranking,result.skill,result.startRng,config);
        requireValue(expected.winnerId===result.winnerId&&expected.margin===result.margin&&expected.rng===result.rng
          &&expected.ranking.every((r,i)=>r.id===result.ranking[i].id&&r.score===result.ranking[i].score&&r.base===result.ranking[i].base&&r.rank===result.ranking[i].rank)
          &&Array.isArray(result.effects)&&result.effects.length===2&&expected.effects.every((r,i)=>exactKeys(result.effects[i],['id','valence'])&&r.id===result.effects[i].id&&r.valence===result.effects[i].valence),'contest score integrity');
      }
    }
  }
}

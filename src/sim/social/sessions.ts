import { config } from '../../data/config';
import { applyEffects, clamp, urgentNeed, wellbeing } from '../needs';
import { personalityTrait } from '../personality';
import { skillLevel, trainTick } from '../skills';
import { skillAptitude } from '../genetics/expression';
import { makeCandidate } from '../brain';
import { utilityTotal } from '../utility';
import { moveShared } from '../courtship';
import { recordLifeEvent } from '../life-records';
import { distance } from '../navigation';
import { socialCandidate, sociallyBusy } from './candidates';
import { meetingSite } from './sites';
import { relationship } from './relationships';
import { resolveInteraction } from './interaction';
import { resolveContest } from './contest';
import { commitContestRelationship, commitSocialOutcome } from './outcomes';
import type { Creature, SaveState, SocialKind, SocialSession, Terrain, InteractionResult } from '../types';

const eligible=(c:Creature)=>!!c.needs&&config.lifecycle.stages[c.stage].mobile&&!urgentNeed(c)&&c.needs.stress<config.skills.stressExclusionThreshold;
export function startSocialSession(state:SaveState,a:Creature,b:Creature,kind:SocialKind,terrain:readonly Terrain[]):boolean{
  const s=config.social;
  if(a.id===b.id||!eligible(a)||!eligible(b)||sociallyBusy(state,a.id)||sociallyBusy(state,b.id)
    ||Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)>s.radiusTiles)return false;
  if(kind==='comfort'&&personalityTrait(a,'gentleness')<s.comfortGentleness)return false;
  if(kind==='contest'&&((a.social.contestCooldowns[b.organismId]??0)>state.clock.tick||(b.social.contestCooldowns[a.organismId]??0)>state.clock.tick))return false;
  const offered=utilityTotal(b,socialCandidate(state,b,a,kind,true)),current=b.currentAction;
  const currentScore=current?utilityTotal(b,makeCandidate(state,b,current.kind,current.target,current.targetFruitId,current.targetPlantId,current.targetItemId)):0;
  if(offered<s.inviteMinimumUtility||offered<currentScore-s.inviteCurrentUtilityMargin)return false;
  const site=meetingSite(state,a,b,terrain,kind==='contest');if(!site)return false;
  const session:SocialSession={id:`s_${String(state.counters.session++).padStart(8,'0')}`,kind,participants:[a.id,b.id],
    startedTick:state.clock.tick,workStartedTick:null,workTicks:0,...site,result:null,workStarts:null};
  state.social.sessions.push(session);a.currentAction=null;b.currentAction=null;return true;
}
export function abortSocialSession(state:SaveState,session:SocialSession):void{
  state.social.sessions=state.social.sessions.filter(s=>s.id!==session.id);
  for(const id of session.participants){const c=state.creatures.find(c=>c.id===id);if(c){c.currentAction=null;c.nextDecisionTick=state.clock.tick+1;}}
}
export function advanceSocialSessions(state:SaveState,terrain:readonly Terrain[]):void{
  for(const s of [...state.social.sessions]){
    const pair=s.participants.map(id=>state.creatures.find(c=>c.id===id)),[a,b]=pair;
    if(!a||!b||!eligible(a)||!eligible(b)){abortSocialSession(state,s);continue;}
    if(s.workStartedTick===null){
      if(!s.paths.every(path=>!path.length)){
        if(state.clock.tick-s.startedTick>config.social.travelTimeoutTicks){abortSocialSession(state,s);continue;}
        for(let i=0;i<2;i++)moveShared(pair[i]!,s.paths[i],terrain,state.world.width);
        continue;
      }
      if(distance(a.position,b.position)>config.social.proximityTiles){abortSocialSession(state,s);continue;}
      s.workStartedTick=state.clock.tick;s.workStarts=pair.map(c=>({wellbeing:wellbeing(c!.needs!),level:s.skill?skillLevel(c!,s.skill):0})) as SocialSession['workStarts'];
      if(s.kind==='contest'&&s.skill){
        s.result=resolveContest(pair.map(c=>({id:c!.id,level:skillLevel(c!,s.skill!),staminaLevel:skillLevel(c!,'stamina'),wellbeing:wellbeing(c!.needs!),
          stagePerformance:config.lifecycle.stages[c!.stage].performanceMultiplier,aptitude:skillAptitude(c!,s.skill!)})),s.skill,state.rng.competition,config);
        // Aptitudes are reporting metadata, never a second performance multiplier.
        state.rng.competition=s.result.rng;
      }
    }
    const duration=config.actions[s.kind].workTicks;
    for(const [i,c] of pair.entries()){
      applyEffects(c!,s.kind==='comfort'&&i===1?config.social.comfortRecipientEffects:config.actions[s.kind].effects,1/duration);
      if(s.kind==='contest'&&s.skill)trainTick(c!,s.skill,config.skills.improvisedQuality,state.clock.tick-1);
    }
    s.workTicks++;
  }
}
export function resolveSocialSessions(state:SaveState):void{
  for(const s of [...state.social.sessions]){
    const pair=s.participants.map(id=>state.creatures.find(c=>c.id===id)),[a,b]=pair;
    if(!a||!b||!eligible(a)||!eligible(b)){abortSocialSession(state,s);continue;}
    if(s.workTicks<config.actions[s.kind].workTicks)continue;
    state.social.sessions=state.social.sessions.filter(other=>other.id!==s.id);
    const before=relationship(state,a.organismId,b.organismId);
    let result:InteractionResult;
    if(s.kind==='contest'&&s.result){
      const t=config.social.contest;
      const valence=pair.map(c=>s.result!.effects.find(e=>e.id===c!.id)!.valence) as [number,number];
      commitContestRelationship(state,a,b,s.result.winnerId,valence);
      result={bond:0,mateBond:0,valence,stress:[0,0],outcome:'neutral',rng:a.rng};
      for(const [i,c] of pair.entries()){
        c!.social.contestCooldowns[pair[1-i]!.organismId]=state.clock.tick+t.cooldownTicks;
        const row=s.result.ranking.find(r=>r.id===c!.id)!,stats=state.social.statistics;
        const band=t.aptitudeBands.findIndex(n=>row.aptitude<n),bucket=stats.aptitudeWins[band<0?t.aptitudeBands.length:band],win=Number(row.id===s.result.winnerId);
        bucket.entries++;bucket.wins+=win;const q=stats.correlation;q.count++;q.levels+=row.level;q.levelsSquared+=row.level*row.level;q.wins+=win;q.levelWins+=row.level*win;
      }
      state.social.statistics.contests++;
      recordLifeEvent(state,{kind:'contest',creatureId:a.id,from:a.stage,to:a.stage,relatedCreatureId:b.id,socialResult:{skill:s.skill,winnerId:s.result.winnerId,margin:s.result.margin}});
    }else{result=resolveInteraction(a,b,s.kind==='contest'?'play':s.kind,a.rng,config,before?.bond??0);a.rng=result.rng;}
    if(s.kind!=='contest')commitSocialOutcome(state,a,b,s.kind,result);
    for(const [i,c] of pair.entries()){
      const memory=c!.social.preferences[s.kind],start=s.workStarts![i];
      const socialReward=s.kind==='play'?result.outcome==='rude'?config.social.learningRude:config.social.learningFriendly:0;
      const reward=clamp(config.skills.rewardWellbeingWeight*(wellbeing(c!.needs!)-start.wellbeing)+socialReward
        +config.skills.levelReward*Number(!!s.skill&&skillLevel(c!,s.skill)>start.level),-1,1);
      c!.social.preferences[s.kind]={learnedMean:clamp((1-config.skills.learningRate)*memory.learnedMean+config.skills.learningRate*reward,-1,1),samples:memory.samples+1};
      c!.lastCompletedAction=s.kind;c!.currentAction=null;c!.nextDecisionTick=state.clock.tick+1;
    }
  }
}

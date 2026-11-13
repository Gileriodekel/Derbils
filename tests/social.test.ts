import { describe, expect, it } from 'vitest';
import old from './fixtures/milestone-7b.json';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { tick, advanceTicks } from '../src/sim/tick';
import { applyPlayerCommand } from '../src/sim/commands';
import { forceStage } from '../src/sim/debug-lifecycle';
import { lifespan } from '../src/sim/life-stages';
import { setTraitValue } from '../src/sim/genetics/edits';
import { emptySocialMemory } from '../src/sim/social/state';
import { familyTie } from '../src/sim/social/family';
import { changeRelationship, decayRelationship, ensureRelationship, initializeFamily, maintainRelationships, relationship } from '../src/sim/social/relationships';
import { resolveInteraction } from '../src/sim/social/interaction';
import { resolveContest } from '../src/sim/social/contest';
import { startSocialSession } from '../src/sim/social/sessions';
import { meetingSite } from '../src/sim/social/sites';
import { buildSpatialIndex } from '../src/sim/social/spatial';
import { socialCandidates } from '../src/sim/social/candidates';
import { rewardSocialExperience } from '../src/sim/social/drift';
import { removeSocialLife } from '../src/sim/social/death';
import { navigationTerrain } from '../src/sim/food-sources';
import { trainingTargets } from '../src/sim/training';
import { trainTick } from '../src/sim/skills';
import { compatibility } from '../src/sim/mates';
import { makeCandidate } from '../src/sim/brain';
import { softmaxIndex, utilityTotal } from '../src/sim/utility';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { Config, ContestEntrant, Creature, Relationship, SaveState } from '../src/sim/types';

const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
function freeze<T>(v:T):T{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function ready(count=2){const s=createHabitat(808,count);s.settings.autoBreed=false;
  for(const c of s.creatures){c.needs={hunger:20,fatigue:20,boredom:60,loneliness:70,stress:10};c.mood=.6;c.currentAction=null;}
  return s;
}
function established(s:SaveState,bond=60,rivalry=0,mateBond=0){const[a,b]=s.creatures;const r=ensureRelationship(s,a.organismId,b.organismId);r.bond=Math.max(-100,bond-rivalry);r.mateBond=mateBond;return r;}
const entrant=(id:string,level:number):ContestEntrant=>({id,level,staminaLevel:20,wellbeing:.9,stagePerformance:1,aptitude:.5});
const friendly=()=>{const c=clone(config) as Config;c.social.rudePlayBaseChance=c.social.rudePlayTraitChance=0;return c;};

describe('sparse relationships, family and bounded search',()=>{
  it('starts sparse, creates one symmetric edge on contact, and derives family from lineage',()=>{
    let s=ready();expect(s.relationships).toEqual([]);
    changeRelationship(s,s.creatures[0].organismId,s.creatures[1].organismId,'play',resolveInteraction(...s.creatures as [Creature,Creature],'play',1,friendly()));
    expect(s.relationships).toHaveLength(1);expect(relationship(s,s.creatures[1].organismId,s.creatures[0].organismId)).toEqual(relationship(s,s.creatures[0].organismId,s.creatures[1].organismId));
    s=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId});
    s=advanceTicks(s,config.lifecycle.stages.egg.durationTicks);
    const child=s.creatures.at(-1)!;
    expect(familyTie(s,child.organismId,s.creatures[0].organismId)).toBe('parent');
    expect(familyTie(s,s.creatures[0].organismId,child.organismId)).toBe('child');
    expect(relationship(s,child.organismId,s.creatures[0].organismId)).toMatchObject({bond:config.social.newbornParentBond});
    const second=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId});
    const sibling=second.creatures.at(-1)!;sibling.needs={...config.needs.newborn};initializeFamily(second,sibling.id);
    expect(familyTie(second,child.organismId,sibling.organismId)).toBe('sibling');
    expect(relationship(second,child.organismId,sibling.organismId)?.bond).toBe(config.social.newbornSiblingBond);
    expect(familyTie(s,s.creatures[0].organismId,s.creatures[1].organismId)).toBe('none');
  });
  it('enforces both caps and deterministic weakest-first eviction',()=>{
    const s=ready(30);
    for(let i=0;i<s.creatures.length;i++)for(let j=i+1;j<s.creatures.length;j++)changeRelationship(s,s.creatures[i].organismId,s.creatures[j].organismId,'debug',{
      bond:(i*31+j*17)%201-100,mateBond:0,outcome:'neutral'});
    expect(s.relationships.length).toBeLessThanOrEqual(config.social.maximumRelationships);
    for(const c of s.creatures)expect(s.relationships.filter(r=>r.a===c.organismId||r.b===c.organismId).length).toBeLessThanOrEqual(config.social.relationshipsPerCreature);
    const source=ready(config.social.relationshipsPerCreature+4),a=source.creatures[0];
    for(const [i,b]of source.creatures.slice(1).entries())changeRelationship(source,a.organismId,b.organismId,'debug',{bond:i*5,mateBond:0,outcome:'neutral'});
    expect(relationship(source,a.organismId,source.creatures[1].organismId)).toBeNull();
  });
  it('applies exact lazy grace/decay and prunes a negligible unfamiliar nonfamily edge',()=>{
    const r:Relationship={a:'a',b:'b',bond:80,mateBond:70,lastContactTick:0,lastDecayTick:0,history:[]};
    const day=config.clock.dayTicks;
    expect(decayRelationship(r,day).bond).toBe(80);
    expect(decayRelationship(r,day*2).bond).toBeCloseTo(80*Math.exp(-1/config.social.bondDecayDays),12);
    expect(decayRelationship({...r,bond:-80},day*2).bond).toBeCloseTo(-80*Math.exp(-1/config.social.bondDecayDays),12);
    const s=ready();established(s,.01);maintainRelationships(s);expect(s.relationships).toEqual([]);
  });
  it('inspects a fixed budget rather than every pair, even with dense larger inputs',()=>{
    for(const count of [30,120]){
      const template=ready(1).creatures[0],creatures=Array.from({length:count},(_,i)=>({...clone(template),id:`c_${String(i+1).padStart(8,'0')}`,organismId:`o_${String(i+1).padStart(8,'0')}`}));
      const index=buildSpatialIndex(creatures,90);for(const c of creatures)index.query(c.position,c.id);
      expect(index.operations().indexed).toBe(count);expect(index.operations().inspected).toBeLessThanOrEqual(count*config.social.scanLimit);
      if(count===30)expect(index.operations().inspected).toBeLessThan(count*(count-1));
    }
    const s=ready(),c=s.creatures[0],index=buildSpatialIndex(s.creatures),terrain=navigationTerrain(s.world);
    socialCandidates(s,c,index,terrain);const ops=index.operations().queries;socialCandidates(s,c,index,terrain);expect(index.operations().queries).toBe(ops);
    expect(c.social.nextTargetTick).toBe(config.social.targetIntervalTicks);
  });
});

describe('pure interactions, contests and motivation',()=>{
  it('friendly play respects affinity and sociability, avoid never adds affinity, and inputs stay unchanged',()=>{
    const[a,b]=ready().creatures,A=clone(a),B=clone(b),cfg=friendly();
    const liked=resolveInteraction(freeze(a),freeze(b),'play',17,cfg,70),disliked=resolveInteraction(a,b,'play',17,cfg,-60);
    expect(liked.bond).toBeGreaterThan(disliked.bond);expect(liked.valence[0]).toBeGreaterThan(0);
    const low={...A,genome:setTraitValue(A.genome,'personality','sociability',0)},high={...A,genome:setTraitValue(A.genome,'personality','sociability',1)};
    expect(resolveInteraction(high,B,'play',17,cfg).bond).toBeGreaterThan(resolveInteraction(low,B,'play',17,cfg).bond);
    expect(resolveInteraction(a,b,'avoid',17,cfg).bond).toBeLessThanOrEqual(0);expect(a).toEqual(A);expect(b).toEqual(B);
  });
  it('uses exact rude probability branches and bounded per-event personality drift without changing genes',()=>{
    const s=ready(),c=s.creatures[0],genome=clone(c.genome),cfg=clone(config) as Config;cfg.social.rudePlayBaseChance=1;
    const result=resolveInteraction(c,s.creatures[1],'play',7,cfg);expect(result.bond).toBe(config.social.outcomes.rudePlay.bond);expect(result.stress[1]).toBe(8);
    rewardSocialExperience(c,'friendlyPlay',0);expect(c.personalityDrift.sociability).toBe(config.personality.positiveEventStep);
    rewardSocialExperience(c,'friendlyPlay',1);expect(c.personalityDrift.sociability).toBe(config.personality.positiveEventStep);
    for(let t=60;t<20000;t+=60)rewardSocialExperience(c,'friendlyPlay',t);
    expect(c.personalityDrift.sociability).toBe(config.personality.driftLimit);
    rewardSocialExperience(c,'rudePlay',20000);expect(c.personalityDrift.gentleness).toBe(config.social.rudeGentlenessStep);
    expect(c.genome).toEqual(genome);
  });
  it('ranks more than two entrants deterministically without mutating snapshots or multiplying aptitude',()=>{
    const entrants=freeze([entrant('a',30),entrant('b',40),entrant('c',50)]),before=clone(entrants);
    const result=resolveContest(entrants,'run',42,config);expect(resolveContest(entrants,'run',42,config)).toEqual(result);
    expect(result.ranking.map(r=>r.rank)).toEqual([1,2,3]);expect(result.winnerId).toBe('c');expect(entrants).toEqual(before);
    const changed=entrants.map(p=>({...p,aptitude:1-p.aptitude}));
    expect(resolveContest(changed,'run',42,config).ranking.map(p=>p.score)).toEqual(result.ranking.map(p=>p.score));
  });
  it('has near-even equal-skill wins and increasing advantage with a skill gap',()=>{
    const rates=[];for(const gap of [0,1,10]){let wins=0,rng=173;for(let i=0;i<3000;i++){
      const result=resolveContest([entrant('a',40),entrant('b',40+gap)],'run',rng,config);rng=result.rng;wins+=Number(result.winnerId==='b');
    }rates.push(wins/3000);}
    expect(rates[0]).toBeGreaterThan(.45);expect(rates[0]).toBeLessThan(.55);expect(rates[1]).toBeGreaterThan(rates[0]);expect(rates[2]).toBeGreaterThan(rates[1]);
  });
  it('gives similar-skill rivals bounded training utility and extra XP, with a hard daily cap',()=>{
    const s=ready(),c=s.creatures[0];established(s,0,80);const terrain=navigationTerrain(s.world);
    socialCandidates(s,c,buildSpatialIndex(s.creatures),terrain);
    const boosted=makeCandidate(s,c,'train_run',c.position),plain={...boosted,encouragement:0};
    expect(boosted.encouragement).toBeGreaterThan(0);expect(boosted.encouragement).toBeLessThanOrEqual(config.social.rivalry.utilityBoost);
    let baseline=0,motivated=0;for(let rng=1;rng<=2000;rng++){
      const alternative=utilityTotal(c,plain);
      baseline+=Number(softmaxIndex([alternative,alternative],rng*104729).index===0);
      motivated+=Number(softmaxIndex([utilityTotal(c,boosted),alternative],rng*104729).index===0);
    }expect(motivated).toBeGreaterThan(baseline);
    c.needs={...config.needs.newborn};let total=0;
    for(let t=0;t<5000;t++){
      if(t%config.clock.dayTicks===0){total+=c.social.rivalExtraXpToday.run;c.social.rivalExtraXpToday.run=0;}
      c.social.rivalBoosts.run={amount:config.social.rivalry.xpBoost,expiresTick:t+30};trainTick(c,'run',1,t);
      expect(c.social.rivalExtraXpToday.run).toBeLessThanOrEqual(config.social.rivalry.dailyExtraXpCap);
    }
    expect(total+c.social.rivalExtraXpToday.run).toBeGreaterThan(0);expect(total+c.social.rivalExtraXpToday.run).toBeLessThanOrEqual(5*config.social.rivalry.dailyExtraXpCap);
  });
  it('applies the last valid rival-boost interval before removing the expired sample',()=>{
    const s=ready(1),c=s.creatures[0],terrain=navigationTerrain(s.world),target=trainingTargets(s,c,'run',terrain)[0];
    c.position={...target.target};c.currentAction={kind:'train_run',target:target.target,targetItemId:target.targetItemId,targetFruitId:null,path:[],workTicks:0};
    c.social.rivalBoosts.run={amount:config.social.rivalry.xpBoost,expiresTick:1};const next=tick(s);
    expect(next.creatures[0].social.rivalExtraXpToday.run).toBeGreaterThan(0);expect(next.creatures[0].social.rivalBoosts.run).toBeUndefined();
  });
});

describe('saved sessions, mate bonds, loss and replay',()=>{
  it.each(['play','contest'] as const)('round-trips mid-%s travel and work with committed outcomes',kind=>{
    let s=ready();established(s,60,45,50);for(const c of s.creatures){c.genome=setTraitValue(c.genome,'personality','competitiveness',.8);c.personalityDrift.sociability=.1;}
    expect(startSocialSession(s,s.creatures[0],s.creatures[1],kind,navigationTerrain(s.world))).toBe(true);
    expect(advanceTicks(decodeSave(encodeSave(s)),100)).toEqual(advanceTicks(s,100));
    const id=s.social.sessions[0].id;for(let i=0;i<100&&s.social.sessions.find(p=>p.id===id)?.workTicks!==7;i++)s=tick(s);
    const session=s.social.sessions.find(p=>p.id===id)!;expect(session.workTicks).toBe(7);if(kind==='contest')expect(session.result?.ranking).toHaveLength(2);
    if(kind==='contest'){
      expect(tick(s).social.sessions[0].result).toEqual(session.result);
      const tampered=clone(s);tampered.social.sessions[0].result!.ranking[0].score+=1;
      expect(()=>decodeSave(JSON.stringify(tampered))).toThrow(/contest score integrity/);
    }
    const json=encodeSave(s);expect(advanceTicks(decodeSave(json),150)).toEqual(advanceTicks(s,150));
    tick(freeze(s));expect(encodeSave(s)).toBe(json);
  });
  it('completes shared work without mutating a frozen existing relationship or its memories',()=>{
    let s=ready();established(s,60);expect(startSocialSession(s,s.creatures[0],s.creatures[1],'play',navigationTerrain(s.world))).toBe(true);
    while(s.social.sessions[0].workTicks<config.actions.play.workTicks-1)s=tick(s);
    const before=encodeSave(s),next=tick(freeze(s));expect(encodeSave(s)).toBe(before);
    expect(next.relationships).not.toEqual(s.relationships);expect(next.social.statistics.interactions).toBe(1);
  });
  it('cancels shared work for urgent needs and resolves no partial social outcome',()=>{
    const s=ready();expect(startSocialSession(s,s.creatures[0],s.creatures[1],'play',navigationTerrain(s.world))).toBe(true);
    s.creatures[0].needs!.hunger=85;const next=tick(s);expect(next.social.sessions).toEqual([]);expect(next.social.statistics.interactions).toBe(0);
  });
  it('never reserves a two-person contest over an unrelated trainer at a two-place prop',()=>{
    const s=ready(3),[a,b,trainer]=s.creatures,terrain=navigationTerrain(s.world),target=trainingTargets(s,trainer,'run',terrain)[0];
    trainer.position={...target.target};trainer.currentAction={kind:'train_run',target:target.target,targetItemId:target.targetItemId,targetFruitId:null,path:[],workTicks:0};
    a.rng=1;const site=meetingSite(s,a,b,terrain,true);expect(site).not.toBeNull();expect(site!.targetItemId).not.toBe(target.targetItemId);
  });
  it('includes swimming when both peers can reach distinct adjacent shoreline practice cells',()=>{
    const s=ready(),[a,b]=s.creatures,terrain=navigationTerrain(s.world),chosen=new Set();
    for(let seed=1;seed<=64;seed++){a.rng=seed*104729;chosen.add(meetingSite(s,a,b,terrain,true)?.skill);}
    expect(chosen.has('swim')).toBe(true);
  });
  it('comfort applies recipient stress relief once and rewards only the recipient gentleness',()=>{
    let s=ready();const[a,b]=s.creatures;a.genome=setTraitValue(a.genome,'personality','gentleness',1);b.needs!.stress=40;
    const genes=s.creatures.map(c=>clone(c.genome));expect(startSocialSession(s,a,b,'comfort',navigationTerrain(s.world))).toBe(true);
    const id=s.social.sessions[0].id;while(s.social.sessions.some(p=>p.id===id))s=tick(s);
    const[A,B]=s.creatures;expect(B.needs!.stress).toBeCloseTo(40+config.needs.perMinute.stress*s.clock.tick/60+config.social.comfortRecipientEffects.stress,8);
    expect(B.recentValence).toBe(config.social.outcomes.comfort.valence[1]);expect(A.personalityDrift.gentleness).toBe(0);
    expect(B.personalityDrift.gentleness).toBe(config.personality.positiveEventStep);expect(s.creatures.map(c=>c.genome)).toEqual(genes);
    rewardSocialExperience(A,'rudePlay',s.clock.tick);rewardSocialExperience(B,'rudePlay',s.clock.tick,true);
    expect(A.personalityDrift.gentleness).toBe(config.social.rudeGentlenessStep);expect(B.personalityDrift.boldness).toBe(config.social.rudeRecipientBoldnessStep);
  });
  it('migrates a real 7b family save without changing clocks, RNG, drift, genes or work',()=>{
    const s=decodeSave(JSON.stringify(old));expect(s.schemaVersion).toBe(10);expect(s.clock).toEqual(old.clock);expect(s.rng).toEqual(old.rng);
    expect(s.creatures.map(({social,competition,awards,...rest})=>{expect(competition.stats.entered).toBe(0);expect(social).toEqual(emptySocialMemory());return rest;})).toEqual(old.creatures);
    const child=s.creatures.at(-1)!;expect(relationship(s,child.organismId,s.creatures[0].organismId)?.bond).toBe(config.social.newbornParentBond);
    expect(decodeSave(encodeSave(s))).toEqual(s);
    const impossible=clone(old);(impossible.creatures[0] as {lastCompletedAction:string|null}).lastCompletedAction='play';
    expect(()=>decodeSave(JSON.stringify(impossible))).toThrow(/creature decision state/);
  });
  it('raises mating bonds, fades them, keeps mates nonexclusive and applies the exact compatibility term',()=>{
    let s=ready(3);s.settings.autoBreed=true;const[a,b,c]=s.creatures;established(s,70);
    s=applyPlayerCommand(s,{kind:'forceBreed',a:a.organismId,b:b.organismId});
    expect(relationship(s,a.organismId,b.organismId)).toMatchObject({bond:78,mateBond:25});
    s=applyPlayerCommand(s,{kind:'forceBreed',a:a.organismId,b:b.organismId});expect(relationship(s,a.organismId,b.organismId)?.mateBond).toBe(50);
    expect(s.breedingRules.exclusivePairs).toEqual([]);
    const r=relationship(s,a.organismId,b.organismId)!;expect(decayRelationship(r,s.clock.tick+config.clock.dayTicks*3).mateBond).toBeLessThan(r.mateBond);
    changeRelationship(s,a.organismId,c.organismId,'debug',{bond:100,mateBond:0,outcome:'neutral'});
    for(const x of s.creatures){x.breeding.cooldownUntil=0;x.needs=x.needs?{...config.needs.newborn}:null;}
    const bonded=compatibility(s,s.creatures[0],s.creatures[1]),other=compatibility(s,s.creatures[0],s.creatures[2]);
    expect(bonded.score).toBeCloseTo(.55*.86+.2*bonded.traitSimilarity+.15*bonded.tasteSimilarity+.1*bonded.geneticDifference+.1*.5,12);
    expect(other.score).toBeGreaterThan(bonded.score);
    const child=s.creatures.at(-1)!;child.stage='adult';child.needs={...config.needs.newborn};expect(compatibility(s,s.creatures[0],child).reason).toBe('Disallowed relative');
  });
  it('routes debug affinity through commands and preserves exact saved state',()=>{
    const s=ready(),command={kind:'setAffinity' as const,a:s.creatures[0].organismId,b:s.creatures[1].organismId,value:-70};
    const next=applyPlayerCommand(freeze(s),command);expect(applyPlayerCommand(s,command)).toEqual(next);expect(next.relationships[0].bond).toBe(-70);
    expect(next.events.at(-1)?.kind).toBe('debugAffinity');expect(decodeSave(encodeSave(next))).toEqual(next);expect(s.relationships).toEqual([]);
  });
  it('chooses an established mate more often with the configured bond term than with zero bond weight',()=>{
    const s=ready(3);s.settings.autoBreed=true;const[a,b,c]=s.creatures;
    changeRelationship(s,a.organismId,b.organismId,'debug',{bond:80,mateBond:70,outcome:'neutral'});
    changeRelationship(s,a.organismId,c.organismId,'debug',{bond:35,mateBond:0,outcome:'neutral'});
    const matches=[compatibility(s,a,b),compatibility(s,a,c)];let active=0,disabled=0;
    for(let seed=1;seed<=3000;seed++){
      active+=Number(softmaxIndex(matches.map(m=>m.score),seed*104729,config.breeding.mateTemperature).index===0);
      disabled+=Number(softmaxIndex(matches.map(m=>m.score-config.breeding.compatibilityWeights.bond*Math.max(0,m.bond/100)),seed*104729,config.breeding.mateTemperature).index===0);
    }
    expect(active).toBeGreaterThan(disabled);expect(active).toBeLessThan(3000);
  });
  it('removes permanent-death edges and applies one bounded expiring friend grief effect',()=>{
    let s=ready(2);s.settings.extinctionRescue=false;s=forceStage(s,s.creatures[0].id,'elder');const dying=s.creatures[0];
    s.clock.tick=config.lifecycle.stages.elder.durationTicks-1;dying.age=lifespan()-1;s.creatures[1].age+=s.clock.tick;
    const r=established(s,80);r.lastContactTick=r.lastDecayTick=s.clock.tick;dying.welfare={total:0,ticks:0};
    const next=tick(s),friend=next.creatures[0];expect(next.relationships).toEqual([]);expect(friend.social.mourning?.organismId).toBe(dying.organismId);
    expect(friend.recentValence).toBeLessThan(0);expect(friend.needs!.stress).toBeGreaterThan(s.creatures[1].needs!.stress);
    const later=advanceTicks(next,config.social.mourning.durationTicks);expect(later.creatures[0].social.mourning).toBeNull();
    const isolated=ready(),before=clone(isolated.creatures[1]);removeSocialLife(isolated,isolated.creatures[0],new Set());expect(isolated.creatures[1].recentValence).toBe(before.recentValence);
    removeSocialLife(isolated,isolated.creatures[0],new Set([isolated.creatures[1].organismId]),false);
    expect(isolated.creatures[1].social.mourning).toBeNull();expect(isolated.creatures[1].recentValence).toBe(before.recentValence);
  });
  it('replays 50,000 ticks with bonds, contests and acquired effects exactly',()=>{
    const start=createHabitat(808),A=advanceTicks(start,50000),B=advanceTicks(start,50000);
    expect(A).toEqual(B);expect(A.social.statistics.interactions).toBeGreaterThan(0);expect(A.social.statistics.contests).toBeGreaterThan(0);
    expect(A.relationships.length).toBeGreaterThan(0);expect(start.relationships).toEqual([]);
  },180000);
  it('holds all relationship bounds/caps/living references for 100,000 ticks',()=>{
    let s=createHabitat(809);for(let t=0;t<100000;t++){
      s=tick(s);const living=new Set(s.creatures.map(c=>c.organismId)),degree=new Map<string,number>();
      for(const r of s.relationships){
        if(!living.has(r.a)||!living.has(r.b)||r.bond<config.social.bondBounds[0]||r.bond>config.social.bondBounds[1]
          ||r.mateBond<0||r.mateBond>100)throw new Error(`Invalid relationship at tick ${s.clock.tick}`);
        for(const id of[r.a,r.b])degree.set(id,(degree.get(id)??0)+1);
      }
      if(s.relationships.length>config.social.maximumRelationships||Math.max(0,...degree.values())>config.social.relationshipsPerCreature)throw new Error(`Relationship cap at tick ${s.clock.tick}`);
      if(t%1000===0)encodeSave(s);
    }
    expect(s.social.statistics.friendships).toBeGreaterThan(0);expect(s.social.statistics.rivalries).toBeGreaterThan(0);
  },240000);
  it('keeps social code headless and excludes social data from appearance derivation',()=>{
    const sim=Object.values(import.meta.glob<string>('../src/sim/**/*.ts',{query:'?raw',import:'default',eager:true})).join('\n');
    expect(sim).not.toMatch(/\b(?:window|document|Canvas\w*)\b|from\s+['"][^'"]*render/);
    const appearance=Object.values(import.meta.glob<string>('../src/sim/appearance/**/*.ts',{query:'?raw',import:'default',eager:true})).join('\n');
    expect(appearance).not.toMatch(/relationships|\.social\b/);
  });
});

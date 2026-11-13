import { describe, expect, it } from 'vitest';
import old from './fixtures/milestone-8.json';
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { tick, advanceTicks } from '../src/sim/tick';
import { applyPlayerCommand } from '../src/sim/commands';
import { createCompetition } from '../src/sim/competition/create';
import { isEligible, entryReason, rulesReason } from '../src/sim/competition/eligibility';
import { competitionCandidate, enterCompetition } from '../src/sim/competition/attendance';
import { resolveCompetition } from '../src/sim/competition/resolve';
import { stepCompetitions as schedule, cancelCompetition } from '../src/sim/competition/scheduler';
import { competitionMetrics } from '../src/sim/competition/metrics';
import { resolveContest } from '../src/sim/social/contest';
import { ensureRelationship } from '../src/sim/social/relationships';
import { navigationTerrain } from '../src/sim/food-sources';
import { xpAtLevel, xpGain } from '../src/sim/skills';
import { setTraitValue } from '../src/sim/genetics/edits';
import { forceStage } from '../src/sim/debug-lifecycle';
import { lifespan } from '../src/sim/life-stages';
import { decide } from '../src/sim/brain';
import { utilityTotal } from '../src/sim/utility';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { CompetitionFormat, CompetitionSnapshot, Creature, SaveState } from '../src/sim/types';

const stepCompetitions=(s:SaveState,ops?:{events:number;entrants:number})=>schedule(s,new Map(s.creatures.map(c=>[c.id,c])),ops);
const clone=<T>(x:T):T=>JSON.parse(JSON.stringify(x)) as T;
const command=(format:CompetitionFormat='dash',skill:typeof skillKeys[number]='run')=>({kind:'createCompetition' as const,format,skill,entryRules:clone(config.competitions.entry),startDelay:config.competitions.defaultStartDelay});
function ready(n=3){const s=createHabitat(901,n);s.settings.autoBreed=false;s.settings.extinctionRescue=false;
  for(const c of s.creatures){c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};c.mood=.8;c.currentAction=null;c.breeding.nextAttemptTick=1000000;
    for(const k of skillKeys){c.genome=setTraitValue(c.genome,'aptitudes',k,.9);c.xp[k]=xpAtLevel(30,k);}}
  return s;
}
function event(s:SaveState,format:CompetitionFormat='dash'){return createCompetition(s,command(format,format==='power'?'strength':'run'));}
function opened(n=3,format:CompetitionFormat='dash'){
  let s=ready(n);event(s,format);s=advanceTicks(s,s.competitions[0].entryOpenTick);
  // Clear unrelated ordinary actions. Enter through the production eligibility/attendance boundary.
  s.social.sessions=[];s.sessions=[];
  for(const c of s.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};}
  for(const c of s.creatures)if(!s.competitions[0].entrantIds.includes(c.id))expect(enterCompetition(s,c,s.competitions[0],navigationTerrain(s.world))).toBe(true);
  return s;
}
const snapshot=(id:string,level=30):CompetitionSnapshot=>({id,organismId:`o_${id}`,levels:Object.fromEntries(skillKeys.map(k=>[k,level])) as Creature['xp'],aptitudes:Object.fromEntries(skillKeys.map(k=>[k,.5])) as Creature['xp'],wellbeing:.9,stagePerformance:1});
function runTo(s:SaveState,target:number){return advanceTicks(s,target-s.clock.tick);}
function frozen<T>(x:T):T{if(x&&typeof x==='object'){Object.values(x).forEach(frozen);Object.freeze(x);}return x;}

describe('formal format kernel',()=>{
  for(const format of ['dash','circuit','power'] as const)for(const count of [2,3,5,8])it(`${format} ranks ${count} entrants exactly once`,()=>{
    const s=ready(),e=event(s,format),entrants=Array.from({length:count},(_,i)=>snapshot(`c_${String(i+1).padStart(8,'0')}`,20+i));
    const result=resolveCompetition(frozen(clone(e)),frozen(clone(entrants)),917,config);
    expect(result.placements.map(p=>p.rank)).toEqual(Array.from({length:count},(_,i)=>i+1));expect(new Set(result.placements.map(p=>p.id)).size).toBe(count);
    expect(result.rounds).toHaveLength(format==='dash'?1:3);
    for(const p of result.placements){const scores=result.rounds.map(r=>r.ranking.find(row=>row.id===p.id)!.score);
      const expected=format==='circuit'?scores.length/scores.reduce((n,v)=>n+1/v,0):scores.reduce((n,v)=>n+v,0)/scores.length;expect(p.score).toBe(expected);}
  });
  it('rejects too many entrants and obeys the configured maximum',()=>{
    const e=event(ready());expect(()=>resolveCompetition(e,Array.from({length:config.competitions.maximumEntrants+1},(_,i)=>snapshot(String(i))),1,config)).toThrow(/Invalid competition entrants/);
  });
  it('a pair dash is exactly the direct M8 resolver with the same RNG',()=>{
    const e=event(ready()),entrants=[snapshot('a',30),snapshot('b',31)],rng=771;
    const direct=resolveContest(entrants.map(c=>({id:c.id,level:c.levels.run,staminaLevel:c.levels.stamina,aptitude:c.aptitudes.run,wellbeing:c.wellbeing,stagePerformance:c.stagePerformance})),'run',rng,config);
    const formal=resolveCompetition(e,entrants,rng,config);expect(formal.rounds).toEqual([direct]);expect(formal.rng).toBe(direct.rng);expect(formal.effects).toEqual(direct.effects);
  });
  it('skill predicts placement, close gaps allow upsets and larger gaps win more',()=>{
    const e=event(ready()),rates:number[]=[];
    for(const gap of [0,1,5,15]){let wins=0,rankSum=0;
      for(let seed=1;seed<=1600;seed++){const r=resolveCompetition(e,[snapshot('a',30),snapshot('b',30+gap)],seed*7919,config);wins+=Number(r.placements[0].id==='b');rankSum+=r.placements.find(p=>p.id==='b')!.rank;}
      rates.push(wins/1600);if(gap>0)expect(rankSum/1600).toBeLessThan(1.5);
    }
    expect(rates[1]).toBeGreaterThan(rates[0]);expect(rates[2]).toBeGreaterThan(rates[1]);expect(rates[3]).toBeGreaterThanOrEqual(rates[2]);expect(rates[1]).toBeLessThan(1);
  });
});

describe('entry rules and autonomous choice',()=>{
  it('checks each intrinsic gate with a stable reason',()=>{
    const s=ready(),e=event(s),base=s.creatures[0];expect(isEligible(base,e)).toEqual({eligible:true,reason:null});
    const cases:[string,(c:Creature)=>void][]=[['stage',c=>{c.stage='egg';c.needs=null;}],['stage',c=>{c.stage='baby';}],['hunger',c=>{c.needs!.hunger=61;}],['fatigue',c=>{c.needs!.fatigue=61;}],['stress',c=>{c.needs!.stress=61;}],['mood',c=>{c.mood=-.3;}],['elder time',c=>{c.stage='elder';c.age=lifespan()-100;}]];
    for(const [reason,edit] of cases){const c=clone(base);edit(c);expect(isEligible(c,e)).toEqual({eligible:false,reason});}
    for(const [level,reason] of [[31,'run below minimum'],[29,'run above maximum']] as const){e.entryRules.levels.run={minimum:level,maximum:level};expect(isEligible(base,e).reason).toBe(reason);}
    delete e.entryRules.levels.run;e.skill='swim';e.skills=['swim'];base.xp.swim=0;expect(isEligible(base,e).reason).toBe('swim below minimum');
    e.skill='fly';e.skills=['fly'];base.xp.fly=xpAtLevel(24,'fly');expect(isEligible(base,e).reason).toBe('fly below minimum');
  });
  it('rejects duplicates, busy/full entries, and an unrelated-only rule excludes actual relatives',()=>{
    const s=opened(3),e=s.competitions[0];expect(entryReason(s,s.creatures[0],e)).toBe('already entered');
    const s2=ready(),e2=event(s2);s2.clock.tick=e2.entryOpenTick;e2.status='entryOpen';
    s2.organisms[1].parents=[s2.organisms[0].id];e2.entryRules.relatedEntrantsAllowed=false;
    expect(enterCompetition(s2,s2.creatures[0],e2,navigationTerrain(s2.world))).toBe(true);expect(entryReason(s2,s2.creatures[1],e2)).toBe('related entrant');
    e2.entryRules.relatedEntrantsAllowed=true;e2.entryRules.maximumEntrants=2;expect(enterCompetition(s2,s2.creatures[1],e2,navigationTerrain(s2.world))).toBe(true);expect(entryReason(s2,s2.creatures[2],e2)).toBe('full');
  });
  it('healthy skilled competitors choose entry, urgent and out-of-band creatures never do',()=>{
    let healthy=0;
    for(let seed=1;seed<=40;seed++){const s=ready(),e=event(s),c=s.creatures[0];e.status='entryOpen';s.clock.tick=e.entryOpenTick;c.rng=seed*7919;
      c.genome=setTraitValue(c.genome,'personality','competitiveness',1);decide(s,c,navigationTerrain(s.world));healthy+=Number(e.entrantIds.includes(c.id));}
    expect(healthy).toBeGreaterThan(20);
    for(const mode of ['hunger','fatigue','band'] as const){const s=ready(),e=event(s),c=s.creatures[0];e.status='entryOpen';s.clock.tick=e.entryOpenTick;
      if(mode==='band')e.entryRules.levels.run={minimum:50,maximum:100};else c.needs![mode]=99;
      for(let t=0;t<Math.min(60,e.startTick-s.clock.tick);t++){c.currentAction=null;c.nextDecisionTick=0;decide(s,c,navigationTerrain(s.world));s.clock.tick++;}expect(e.entrantIds).not.toContain(c.id);}
  });
  it('uses mood, aptitude, skill, competitiveness, rivalry, needs and distance in the unchanged utility',()=>{
    const s=ready(),e=event(s),a=s.creatures[0],b=s.creatures[1];e.entrantIds=[b.id];const before=competitionCandidate(s,a,e);
    ensureRelationship(s,a.organismId,b.organismId).bond=-100;const after=competitionCandidate(s,a,e);expect(after.socialAffinity).toBeGreaterThan(before.socialAffinity);
    expect(utilityTotal(a,after)).toBeGreaterThan(utilityTotal(a,before));expect(after.growthInterest).toBeGreaterThan(0);expect(after.preference).toBeGreaterThan(0);expect(after.relief.boredom).toBe(15);
  });
});

describe('scheduler, persistence and commands',()=>{
  it('observes every marker and resolves only once with exact work and life stats',()=>{
    let s=opened(),e=s.competitions[0],start=e.startTick,end=e.endTick;expect(e.status).toBe('entryOpen');
    s=runTo(s,start-1);expect(s.competitions[0].status).toBe('entryOpen');s=tick(s);expect(s.competitions[0].status).toBe('running');
    const work=s.creatures.map(c=>c.trainingTicks.run);s=runTo(s,end-1);expect(s.competitions[0].status).toBe('running');s=tick(s);
    expect(s.competitions).toEqual([]);expect(s.competitionHistory).toHaveLength(1);e=s.competitionHistory[0];expect(e.status).toBe('resolved');
    expect(e.results!.placements).toHaveLength(3);for(const [i,c] of s.creatures.entries()){expect(c.trainingTicks.run-work[i]).toBe(90);expect(c.competition.stats.entered).toBe(1);expect(c.competition.stats.podiums).toBe(1);}
    expect(s.creatures.reduce((n,c)=>n+c.competition.stats.wins,0)).toBe(1);const stats=clone(s.competitionState.statistics);stepCompetitions(s);expect(s.competitionState.statistics).toEqual(stats);
    expect(decodeSave(encodeSave(s))).toEqual(s);expect(e.prize).toBeNull();
  });
  for(const format of ['dash','circuit','power'] as const)it(`round-trips ${format} scheduled, transit, waiting, mid-run and history without rerolls`,()=>{
    let s=ready();event(s,format);expect(decodeSave(encodeSave(s))).toEqual(s);s=opened(3,format);
    expect(s.competitions[0].attendance.some(a=>a.path.length)).toBe(true);
    for(const target of [s.clock.tick,s.competitions[0].startTick-1,s.competitions[0].startTick+45,s.competitions[0].endTick]){
      s=runTo(s,target);const saved=decodeSave(encodeSave(s));expect(advanceTicks(saved,10)).toEqual(advanceTicks(s,10));
      expect(tick(frozen(clone(s)))).toEqual(tick(s));
    }
  });
  it('applies a fruit bonus through its last valid competition work interval',()=>{
    let s=opened();s=runTo(s,s.competitions[0].startTick+5);const c=s.creatures[0];
    c.skillBonuses.run={amount:.2,expiresTick:s.clock.tick+1};
    const before=c.xp.run,expected=xpGain(c,'run',config.skills.improvisedQuality,s.clock.tick);
    const next=tick(s).creatures.find(other=>other.id===c.id)!;
    expect(next.xp.run-before).toBeCloseTo(expected,10);expect(next.skillBonuses.run).toBeUndefined();
  });
  it('migrates a real M8 checkpoint without changing any previous data or RNG',()=>{
    const migrated=decodeSave(JSON.stringify(old));expect(migrated.schemaVersion).toBe(10);expect(migrated.rng).toEqual(old.rng);expect(migrated.clock).toEqual(old.clock);expect(migrated.relationships).toEqual(old.relationships);expect(migrated.social).toEqual(old.social);
    expect(migrated.competitions).toEqual([]);expect(migrated.competitionHistory).toEqual([]);expect(migrated.settings.autoCompetitions).toBe(false);
    for(const [i,c] of migrated.creatures.entries()){const {competition,awards,...rest}=c;expect(awards.owned).toEqual([]);expect(rest).toEqual(old.creatures[i]);expect(competition.stats).toEqual({entered:0,wins:0,podiums:0,bestPlacement:{}});}
  });
  it('rejects tampered committed scores, duplicate locks, prizes and impossible clocks',()=>{
    let s=opened();s=runTo(s,s.competitions[0].startTick+10);
    for(const edit of [(x:SaveState)=>{x.competitions[0].results!.placements[0].score++;},(x:SaveState)=>{x.competitions[0].prize={placements:[{rank:1,kind:'fruit',id:'sunapple',quantity:99}]};},(x:SaveState)=>{x.competitions[0].endTick++;},(x:SaveState)=>{x.competitions[0].entrantIds.push(x.competitions[0].entrantIds[0]);}]){const corrupted=clone(s);edit(corrupted);expect(()=>decodeSave(JSON.stringify(corrupted))).toThrow();}
  });
  it('advances scheduling and cancels with no entrants in an extinct habitat',()=>{
    let s=ready(1);s.creatures[0].stage='elder';s.creatures[0].age=lifespan()-1;s=tick(s);expect(s.creatures).toEqual([]);
    s=applyPlayerCommand(s,command());const end=s.competitions[0].startTick;
    s=runTo(s,end);expect(s.competitions).toEqual([]);expect(s.competitionHistory.at(-1)?.cancellationReason).toBe('too few entrants');
    expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('cancels underfilled events without stats, relationship effects or result rolls',()=>{
    const s=ready(1),e=event(s);s.clock.tick=e.entryOpenTick;stepCompetitions(s);enterCompetition(s,s.creatures[0],e,navigationTerrain(s.world));
    const rng=s.rng.competition,stats=clone(s.creatures[0].competition.stats);s.clock.tick=e.startTick;stepCompetitions(s);
    expect(e.status).toBe('cancelled');expect(e.cancellationReason).toBe('too few entrants');expect(s.creatures[0].competition.stats).toEqual(stats);expect(s.relationships).toEqual([]);expect(s.rng.competition).toBe(rng);
  });
  it('drops dead, hungry, invalid-stage and absent entrants; survivors keep committed scores',()=>{
    for(const mode of ['dead','hungry','stage','absent'] as const){let s=opened(5);s=runTo(s,mode==='absent'?s.competitions[0].startTick-1:s.competitions[0].startTick+10);
      const e=s.competitions[0],c=s.creatures[0],before=e.results?clone(e.results):null;
      if(mode==='dead'){c.stage='elder';c.age=lifespan()-1;c.lifeIndex=0;c.welfare={total:0,ticks:0};s=tick(s);}
      else {if(mode==='hungry')c.needs!.hunger=99;else if(mode==='stage')s=forceStage(s,c.id,'baby');else {c.position={x:1.5,y:1.5};e.attendance.find(a=>a.id===c.id)!.path=[];}s=tick(s);}
      expect(s.competitions[0].entrantIds,mode).not.toContain(c.id);expect(s.competitions[0].drops.find(d=>d.id===c.id)?.reason).toBeTruthy();expect(s.competitions[0].results?.placements.some(p=>p.id===c.id)??false).toBe(false);
      const restored=decodeSave(encodeSave(s));expect(runTo(restored,e.endTick)).toEqual(runTo(s,e.endTick));
      s=runTo(s,e.endTick);const result=s.competitionHistory[0].results!;expect(result.placements).toHaveLength(4);expect(result.placements.some(p=>p.id===c.id)).toBe(false);
      if(before)for(const row of result.placements)expect(row.score).toBe(before.placements.find(p=>p.id===row.id)!.score);
    }
  });
  it('validates commands, keeps input immutable, enforces limits/cooldowns and cancels any active status',()=>{
    const s=ready(),cmd=command();const created=applyPlayerCommand(frozen(clone(s)),cmd);expect(created.competitions).toHaveLength(1);expect(s.competitions).toEqual([]);expect(applyPlayerCommand(s,cmd)).toEqual(created);
    expect(()=>applyPlayerCommand(created,cmd)).toThrow(/limit/);
    for(const bad of [{...cmd,skill:'nope'},{...cmd,format:'bracket'},{...cmd,startDelay:-1},{...cmd,extra:true},{...cmd,entryRules:{...cmd.entryRules,extra:true}},{...cmd,entryRules:{...cmd.entryRules,maximumEntrants:9}},{...cmd,entryRules:{...cmd.entryRules,allowedStages:['egg']}},{...cmd,format:'power',skill:'run'}])expect(()=>applyPlayerCommand(s,bad as never)).toThrow();
    const copy=clone(cmd),saved=applyPlayerCommand(s,copy);copy.entryRules.allowedStages.length=0;
    expect(decodeSave(encodeSave(saved))).toEqual(saved);
    expect(rulesReason({...cmd.entryRules,levels:{run:{minimum:50,maximum:40}}})).toBe('Invalid skill band.');
    for(const at of ['scheduled','entryOpen','running']){let world=at==='scheduled'?created:opened();if(at==='running')world=runTo(world,world.competitions[0].startTick);
      const id=world.competitions[0].id,after=applyPlayerCommand(world,{kind:'cancelCompetition',id,debug:true});expect(after.competitions).toEqual([]);expect(after.competitionHistory.at(-1)?.status).toBe('cancelled');expect(decodeSave(encodeSave(after))).toEqual(after);
      expect(()=>applyPlayerCommand(after,{kind:'cancelCompetition',id})).toThrow(/not active/);}
  });
  it('keeps prizes null, offspring stats empty, and trims oldest history while preserving totals',()=>{
    let s=opened();s=runTo(s,s.competitions[0].endTick);const parent=s.creatures[0];expect(parent.competition.stats.entered).toBe(1);
    const bred=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId});expect(bred.creatures.at(-1)!.competition.stats).toEqual({entered:0,wins:0,podiums:0,bestPlacement:{}});
    s=ready();for(let i=0;i<config.competitions.historyLimit+5;i++){const e=event(s);cancelCompetition(s,e,'test cancellation');}expect(s.competitionHistory).toHaveLength(config.competitions.historyLimit);expect(s.competitionHistory[0].id).toBe('cpt_00000006');expect(s.competitionState.statistics.cancelled).toBe(config.competitions.historyLimit+5);expect(s.competitionHistory.every(e=>e.prize===null)).toBe(true);
  });
  it('counts scheduler work by active events and bounded entrants, not all creature-event pairs',()=>{
    const counts=[];for(const n of [3,30]){const s=ready(n);event(s);const ops={events:0,entrants:0};stepCompetitions(s,ops);counts.push(ops);}
    expect(counts).toEqual([{events:1,entrants:0},{events:1,entrants:0}]);
  });
  it('auto competitions are deterministic for 50,000 ticks and record valid bounded state',()=>{
    const run=()=>{let s=createHabitat(271828);s.settings.autoCompetitions=true;
      for(let i=0;i<50000;i++){s=tick(s);if(i%5000===0)encodeSave(s);}return s;};
    const a=run(),b=run();expect(a).toEqual(b);expect(a.competitionState.statistics.held).toBeGreaterThan(5);
    for(const c of a.creatures){
      const all=[...a.competitionHistory,...a.competitions],resolved=a.competitionHistory.filter(e=>e.status==='resolved');
      expect(c.competition.stats.entered).toBe(all.filter(e=>e.startedIds.includes(c.id)).length);
      expect(c.competition.stats.wins).toBe(resolved.filter(e=>e.results?.placements[0].id===c.id).length);
      expect(c.competition.stats.podiums).toBe(resolved.filter(e=>e.results?.placements.some(p=>p.id===c.id&&p.rank<=config.competitions.podiumPlaces)).length);
    }
    const metrics=competitionMetrics(a);expect(metrics.fillRate).toBeGreaterThanOrEqual(config.competitions.report.minimumFillRate);expect(metrics.averageEntrants).toBeGreaterThanOrEqual(2);expect(metrics.droppedShare).toBeLessThanOrEqual(config.competitions.report.maximumDropShare);
    expect(decodeSave(encodeSave(a))).toEqual(a);expect(a.competitionHistory.every(e=>e.prize===null)).toBe(true);
  },180000);
});

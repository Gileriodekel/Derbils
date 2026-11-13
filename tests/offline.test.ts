import { describe, expect, it } from 'vitest';
import { config } from '../src/data/config';
import { computeCatchUpTicks, planAdvance } from '../src/app/time';
import { createCatchUp } from '../src/app/catchup';
import { createHabitat } from '../src/sim/habitat';
import { advance } from '../src/sim/advance';
import { tick } from '../src/sim/tick';
import { hashState } from '../src/sim/hash';
import { uniform } from '../src/sim/rng';
import { advanceFrame } from '../src/sim/runner';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { assertInvariants } from './helpers/invariants';
import old from './fixtures/milestone-9b.json';
import type { Config } from '../src/sim/types';
const tuning=config.offline;
const run=(s:ReturnType<typeof createHabitat>,n:number)=>advance(s,s.rng,n);

describe('wall-clock planning outside the simulation',()=>{
  it('reuses the fixed timestep and applies threshold, rate, cap and skew flags',()=>{
    expect(tuning.ticksPerRealSecond).toBe(1/config.clock.tickSeconds);
    expect(computeCatchUpTicks(10000,10001,tuning)).toMatchObject({ticks:0,belowThreshold:true});
    expect(computeCatchUpTicks(10000,50000,tuning)).toMatchObject({ticks:10,capped:false,skewed:false});
    expect(computeCatchUpTicks(0,40000,{...tuning,offlineRateMultiplier:.5}).ticks).toBe(20);
    expect(computeCatchUpTicks(0,Number.MAX_VALUE,tuning)).toMatchObject({ticks:tuning.maxCatchUpTicks,capped:true});
    for(const saved of [undefined,null,NaN,Infinity,200])expect(computeCatchUpTicks(saved,100,tuning)).toMatchObject({ticks:0,skewed:true});
    expect(computeCatchUpTicks(0,NaN,tuning)).toMatchObject({ticks:0,skewed:true});
    expect(computeCatchUpTicks(0,100000,{...tuning,enabled:false}).ticks).toBe(0);
  });
  it('keeps normal frames realtime, bounds accelerated frames, and sends stalls/hidden time to replay',()=>{
    const frame=planAdvance(0,1000,{speed:1,fractionalSeconds:.2},config);
    expect(frame).toMatchObject({realtimeTicks:1,catchUpTicks:0});expect(frame.fractionalSeconds).toBeCloseTo(.2);
    const accelerated=planAdvance(0,4000,{speed:1000,fractionalSeconds:0},config);
    expect(accelerated.realtimeTicks).toBeLessThanOrEqual(config.clock.maxTicksPerFrame);
    expect(accelerated.catchUpTicks).toBe(0);
    expect(accelerated.realtimeTicks+accelerated.fractionalSeconds/config.clock.tickSeconds).toBe(4000);
    expect(planAdvance(0,40000,{speed:1000,fractionalSeconds:0},config)).toMatchObject({realtimeTicks:0,catchUpTicks:10});
    expect(planAdvance(0,40000,{speed:1,fractionalSeconds:0,hidden:true},config)).toMatchObject({realtimeTicks:0,catchUpTicks:10});
    expect(planAdvance(0,40000,{speed:0,fractionalSeconds:.2,hidden:true},config).ticks).toBe(0);
    expect(planAdvance(0,40000,{speed:1,fractionalSeconds:0,offlineEnabled:false},config).ticks).toBe(0);
    expect(planAdvance(100,0,{speed:1,fractionalSeconds:.2},config)).toMatchObject({ticks:0,skewed:true});
  });
  it('carries fractional offline time and consumes a capped absence only once through the next checkpoint',()=>{
    const first=planAdvance(0,5000,{speed:1,fractionalSeconds:0,hidden:true},config);
    const second=planAdvance(5000,10000,{speed:1,fractionalSeconds:first.fractionalSeconds,hidden:true},config);
    expect(first.catchUpTicks+second.catchUpTicks).toBe(2);expect(second.fractionalSeconds).toBe(.5);
    const oldTime=0,now=1e12,state=createHabitat(1),plan=computeCatchUpTicks(oldTime,now,tuning);
    const saved=decodeCheckpoint(encodeCheckpoint(state,now));
    expect(plan.capped).toBe(true);expect(computeCatchUpTicks(saved.savedAtWallClock,now,tuning).ticks).toBe(0);
  });
});

describe('one exact tick path',()=>{
  it('has invariant grouping, explicit RNG input, ordinary-loop and save/resume equivalence',()=>{
    const initial=createHabitat(100),n=1000;
    const whole=run(initial,n);let fixed=initial,random=initial,normal=initial,rng=91;
    for(let i=0;i<n;i+=25)fixed=run(fixed,Math.min(25,n-i));
    while(random.clock.tick<n){const draw=uniform(rng);rng=draw.state;random=run(random,Math.min(n-random.clock.tick,1+Math.floor(draw.value*57)));}
    for(let i=0;i<n;i++)normal=advanceFrame(normal,1);
    expect(hashState(whole)).toBe(hashState(fixed));expect(hashState(whole)).toBe(hashState(random));expect(hashState(whole)).toBe(hashState(normal));
    const saved=decodeCheckpoint(encodeCheckpoint(run(initial,400),10000));
    const job=createCatchUp(saved.state,600,{now:()=>0,config});while(!job.snapshot().done)job.step();
    expect(hashState(job.snapshot().state)).toBe(hashState(whole));assertInvariants(job.snapshot().state,config);
    expect(()=>advance(initial,initial.rng,-1)).toThrow();expect(()=>advance(initial,initial.rng,Infinity)).toThrow();
  },30000);
  it('returns the same state with event output absent or present and never mutates its input',()=>{
    const state=createHabitat(5),before=hashState(state),out={events:[],changes:[]};
    expect(tick(state,state.rng,out)).toEqual(tick(state));expect(hashState(state)).toBe(before);
  });
  it('survives a close during replay by recomputing from the untouched durable checkpoint',()=>{
    const initial=createHabitat(701),durable=encodeCheckpoint(initial,10000),target=500;
    const interrupted=createCatchUp(initial,target,{now:()=>0,config});interrupted.step();interrupted.step();
    expect(interrupted.snapshot().completed).toBeGreaterThan(0);expect(durable).toBe(encodeCheckpoint(initial,10000));
    const reloaded=decodeCheckpoint(durable),again=createCatchUp(reloaded.state,target,{now:()=>0,config});
    while(!again.snapshot().done)again.step();expect(hashState(again.snapshot().state)).toBe(hashState(run(initial,target)));
  },30000);
});

describe('yielding replay runner',()=>{
  it('obeys fake-clock budgets, min/max ticks, monotonic progress and boundary cancellation',()=>{
    let now=0;const settings:Config={...config,offline:{...tuning,minTicksPerSlice:3,maxTicksPerSlice:5,sliceBudgetMs:2}};
    const job=createCatchUp(createHabitat(99),24,{now:()=>now+=10,config:settings});
    let progress=0;
    for(let i=0;i<3;i++){const result=job.step();expect(result.ticks).toBe(3);expect(result.progress).toBeGreaterThan(progress);progress=result.progress;}
    job.cancel();const cancelled=job.step();expect(cancelled.ticks).toBe(0);expect(cancelled.completed).toBe(9);expect(cancelled.summary.skipped).toBe(true);assertInvariants(cancelled.state,config);
    const limited=createCatchUp(createHabitat(99),12,{now:()=>0,config:settings});expect(limited.step().ticks).toBe(5);expect(limited.step().ticks).toBe(5);expect(limited.step().ticks).toBe(2);
  });
  it('uses macrotask yields, supports empty jobs and cancels after a progress notification',async()=>{
    let yields=0;const job=createCatchUp(createHabitat(1),100,{now:()=>0,config,yieldControl:async()=>{yields++;}});
    const result=await job.run(()=>job.cancel());expect(yields).toBe(1);expect(result.completed).toBe(tuning.maxTicksPerSlice);expect(result.cancelled).toBe(true);
    const empty=createCatchUp(createHabitat(1),0,{now:()=>0,config});expect((await empty.run()).progress).toBe(1);
  });
});

it('loads an actual 9b save with no inferred absence and only the declared tuning-version migration',()=>{
  const loaded=decodeCheckpoint(JSON.stringify(old));expect(loaded.schemaVersion).toBe(12);expect(loaded.savedAtWallClock).toBeNull();
  expect(loaded.state).toEqual({...old,rulesVersion:config.rulesVersion});expect(computeCatchUpTicks(loaded.savedAtWallClock,10000,tuning)).toMatchObject({ticks:0,skewed:true});assertInvariants(loaded.state,config);
});
it('round trips outer timestamps while keeping them out of simulation state',()=>{
  const state=createHabitat(91),encoded=encodeCheckpoint(state,12345),loaded=decodeCheckpoint(encoded);
  expect(loaded.savedAtWallClock).toBe(12345);expect(loaded.state).toEqual(state);expect('savedAtWallClock' in state).toBe(false);
  expect(()=>decodeCheckpoint(encoded.replace('12345','null'))).toThrow(/checksum/i);
  const missingTimestamp=JSON.parse(encoded);delete missingTimestamp.checksum;missingTimestamp.savedAtWallClock=null;
  expect(decodeCheckpoint(JSON.stringify({...missingTimestamp,checksum:hashState(missingTimestamp)})).savedAtWallClock).toBeNull();
  expect(decodeCheckpoint(JSON.stringify({schemaVersion:11,savedAtWallClock:null,offlineEnabled:true,state})).savedAtWallClock).toBeNull();
});

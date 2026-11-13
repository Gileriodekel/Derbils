import {stageStartAge} from '../src/sim/life-stages';
import {describe,it,expect} from 'vitest';
import {createHabitat} from '../src/sim/habitat';
import {tick} from '../src/sim/tick';
import {config,needKeys} from '../src/data/config';
import {encodeCheckpoint,decodeCheckpoint} from '../src/persistence/checkpoint';
import {validateState} from '../src/sim/validate-state';

describe('current Dynasty gameplay acceptance',()=>{
 it('replays 5,000 ticks exactly and survives 10,000 ticks with autonomous meals and rest',()=>{
  let s=createHabitat(93201,1),twin=createHabitat(93201,1),loaded=s;const actions=new Set<string>();let maxHunger=0;
  s.settings.extinctionRescue=false;twin.settings.extinctionRescue=false;
  s.creatures[0].dynasty.reincarnationFruit=10;twin.creatures[0].dynasty.reincarnationFruit=10;
  for(let i=0;i<10000;i++){
   s=tick(s);if(i<5000)twin=tick(twin);
   if(i===2499)loaded=decodeCheckpoint(encodeCheckpoint(s,123)).state;else if(i>=2500&&i<5000)loaded=tick(loaded);
   const c=s.creatures[0];expect(c).toBeDefined();if(c.needs)for(const key of needKeys){expect(c.needs![key]).toBeGreaterThanOrEqual(0);expect(c.needs![key]).toBeLessThanOrEqual(100);}
   maxHunger=Math.max(maxHunger,c.needs?.hunger??0);if(c.lastCompletedAction)actions.add(c.lastCompletedAction);
   if(i===4999){expect(s).toEqual(twin);expect(s).toEqual(loaded);}
   if(i%1000===999)expect(validateState(s,config)).toEqual([]);
  }
  expect(maxHunger).toBeLessThan(100);expect(actions.has('eat')).toBe(true);expect(actions.has('sleep')).toBe(true);expect(s.creatures).toHaveLength(1);
 },120000);
 it('the actual tick crosses a Derby boundary once, including saving immediately before and after',()=>{
  let s=createHabitat(91,2);s.clock.tick=15*config.clock.dayTicks-1;s.world.lastCacheDay=14;s.dynasty.nextPlantTick=s.clock.tick+config.dynasty.plants.spawnEveryTicks;
  for(const c of s.creatures){c.stageStartedTick=s.clock.tick;c.age=stageStartAge('adult');c.needs={hunger:0,fatigue:0,boredom:0,loneliness:0,stress:0};c.mood=.8;}
  s=tick(decodeCheckpoint(encodeCheckpoint(s,123)).state);
  expect(s.dynasty.events).toHaveLength(1);expect(s.dynasty.events[0].kind).toBe('derby');expect(s.creatures.reduce((n,c)=>n+c.dynasty.food.length,0)).toBe(config.dynasty.competitions.berryPrize);
  const continued=tick(decodeCheckpoint(encodeCheckpoint(s,123)).state);expect(continued).toEqual(tick(s));expect(continued.dynasty.events).toHaveLength(1);
 });
 it('rejects corrupt new timers, energy, tokens and retired gameplay fields',()=>{
  const edits=[(s:ReturnType<typeof createHabitat>)=>{s.creatures[0].dynasty.energy=1e6;},
   (s:ReturnType<typeof createHabitat>)=>{s.creatures[0].dynasty.reincarnationFruit=-1;},
   (s:ReturnType<typeof createHabitat>)=>{s.creatures[0].dynasty.runningPenaltyUntil=2*config.clock.dayTicks+1;},
   (s:ReturnType<typeof createHabitat>)=>{s.dynasty.nextCupDay=31;},
   (s:ReturnType<typeof createHabitat>)=>{s.creatures[0].dynasty.food=[{id:s.world.plants[0].berryIds![0],kind:s.world.plants[0].kind}];},
   (s:ReturnType<typeof createHabitat>)=>{Object.assign(s.creatures[0].xp,{climb:1});}];
  for(const edit of edits){const s=createHabitat(92,1);edit(s);expect(()=>encodeCheckpoint(s,123)).toThrow();}
 });
});

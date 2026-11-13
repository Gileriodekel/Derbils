import { describe, expect, it } from 'vitest';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { setDebugSkill, skillLevel } from '../src/sim/skills';
import { findPath } from '../src/sim/navigation';
import { decodeTerrain } from '../src/sim/map';
import { energyCapacity, movePath } from '../src/sim/dynasty/movement';
import { availableFood, consumeFood, navigationTerrain } from '../src/sim/food-sources';
import { completeMeal } from '../src/sim/preferences';
import { tick } from '../src/sim/tick';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { validateState } from '../src/sim/validate-state';
import type { Terrain } from '../src/sim/types';
function skilled(){let s=createHabitat(17,2);for(const skill of ['run','swim','fly'] as const)s=setDebugSkill(s,s.creatures[0].id,skill,40,1);return s;}
describe('terrain, energy, and physical food',()=>{
 it('routes through land, water and a flight barrier, never through a blocked tile',()=>{
  const s=skilled(),c=s.creatures[0],terrain:Terrain[]=[0,0,3,3,3,4,4,4,0,0,5];c.position={x:.5,y:.5};
  const path=findPath(terrain,11,1,c.position,{x:9.5,y:.5},c)!;expect(path).not.toBeNull();
  const modes=new Set<string>();for(let i=0;i<20&&path.length;i++){movePath(c,path,terrain,11,i);modes.add(c.dynasty.movementMode);}
  expect(c.position).toEqual({x:9.5,y:.5});expect(modes.has('swim')).toBe(true);expect(modes.has('fly')).toBe(true);
  expect(findPath(terrain,11,1,c.position,{x:10.5,y:.5},c)).toBeNull();
  const low=s.creatures[1];low.position={x:.5,y:.5};expect(findPath(terrain,11,1,low.position,{x:9.5,y:.5},low)).toBeNull();
 });
 it('closes every platform back and still lands on the intended platform with Flight',()=>{
  const s=skilled(),terrain=navigationTerrain(s.world),low=s.creatures[1],flyer=s.creatures[0];
  for(const target of [{x:120.5,y:46.5},{x:125.5,y:28.5},{x:125.5,y:20.5}]){
    expect(terrain[Math.floor(target.y)*s.world.width+Math.floor(target.x)]).toBe(0);
    expect(findPath(terrain,s.world.width,s.world.height,low.position,target,low)).toBeNull();
    const path=findPath(terrain,s.world.width,s.world.height,flyer.position,target,flyer)!;expect(path).not.toBeNull();
    for(let i=0;i<1000&&path.length;i++)movePath(flyer,path,terrain,s.world.width,i);
    expect(flyer.position).toEqual(target);expect(flyer.dynasty.movementMode).toBe('walk');
  }
 });
 it('arrives at exact fractional food locations using cardinal segments',()=>{
  const s=skilled(),c=s.creatures[0],terrain:Terrain[]=[0,0,0];c.position={x:.12,y:.8};
  const goal={x:2.27,y:.3},path=findPath(terrain,3,1,c.position,goal,c)!;
  let previous=c.position;for(const p of path){expect(p.x===previous.x||p.y===previous.y).toBe(true);previous=p;}
  for(let i=0;i<10&&path.length;i++)movePath(c,path,terrain,3,i);expect(c.position).toEqual(goal);
 });
 it('higher stamina sustains fast movement longer; exhausted Derbils still move',()=>{
  let s=skilled();s=setDebugSkill(s,s.creatures[1].id,'run',40,1);s=setDebugSkill(s,s.creatures[1].id,'stamina',70,1);
  const [a,b]=s.creatures;const terrain=Array<Terrain>(500).fill(0);
  for(const c of [a,b]){c.position={x:.5,y:.5};c.dynasty.energy=energyCapacity(c);}
  const paths=[a,b].map(c=>findPath(terrain,500,1,c.position,{x:499.5,y:.5},c)!);
  for(let i=0;i<60;i++)for(const [n,c]of [a,b].entries())movePath(c,paths[n],terrain,500,i);
  expect(b.position.x).toBeGreaterThan(a.position.x);expect(a.position.x).toBeGreaterThan(.5);
  a.dynasty.energy=0;a.dynasty.fast=false;const x=a.position.x;movePath(a,paths[0],terrain,500,61);expect(a.position.x-x).toBeCloseTo(config.dynasty.movement.normal.walk);
 });
 it('spawns two-berry plants on their valid terrain and consumes each berry at most once',()=>{
  let s=createHabitat(77,2);const terrain=navigationTerrain(s.world);
  expect(s.world.plants.length).toBe(config.dynasty.plants.initial);
  for(const p of s.world.plants){expect([0,3]).toContain(terrain[p.y*s.world.width+p.x]);expect(p.berries).toEqual([true,true]);expect(p.ripe).toBe(2);}
  const p=s.world.plants.find(p=>terrain[p.y*s.world.width+p.x]===0)!,[a,b]=s.creatures;
  for(const c of [a,b]){c.position={x:p.x+.5,y:p.y+.5};c.currentAction={kind:'eat',target:{...c.position},targetPlantId:p.id,targetFruitId:p.berryIds![0],path:[],workTicks:0};}
  expect(consumeFood(s,a)).toBe(p.kind);expect(consumeFood(s,b)).toBeNull();expect(p.berries).toEqual([false,true]);expect(p.ripe).toBe(1);
  b.currentAction!.targetFruitId=p.berryIds![1];expect(consumeFood(s,b)).toBe(p.kind);expect(s.world.plants.some(other=>other.id===p.id)).toBe(false);
  a.position={x:1.5,y:1.5};a.currentAction={kind:'eat',target:{x:2.5,y:1.5},targetFruitId:s.world.plants[0].berryIds![0],targetPlantId:s.world.plants[0].id,path:[],workTicks:0};expect(consumeFood(s,a)).toBeNull();
 });
 it('has global awareness without reservation, and berries grant only their associated XP',()=>{
  const s=createHabitat(31,2),[a,b]=s.creatures,p=s.world.plants.find(p=>decodeTerrain(s.world.terrainRle)[p.y*s.world.width+p.x]===0)!;
  a.currentAction={kind:'eat',target:{x:p.x+.5,y:p.y+.5},targetPlantId:p.id,targetFruitId:p.berryIds![0],path:[],workTicks:0};
  expect(availableFood(s,b,navigationTerrain(s.world)).some(f=>f.targetFruitId===p.berryIds![0])).toBe(true);
  const before={...a.xp};completeMeal(a,'sunapple',0);expect(a.xp.run).toBe(before.run+config.dynasty.plants.berryXp);expect(a.xp.swim).toBe(before.swim);expect(skillLevel(a,'run')).toBeGreaterThan(0);
 });
 it('continues deterministically after saving with moving and carried-food state',()=>{
  let s=createHabitat(43,3);for(let i=0;i<500;i++)s=tick(s);
  expect(validateState(s,config)).toEqual([]);
  let loaded=decodeCheckpoint(encodeCheckpoint(s,100)).state;
  for(let i=0;i<500;i++){s=tick(s);loaded=tick(loaded);}
  expect(loaded).toEqual(s);expect(validateState(s,config)).toEqual([]);
 },30000);
});

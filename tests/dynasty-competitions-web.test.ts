import { describe,it,expect } from 'vitest';
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { setDebugSkill } from '../src/sim/skills';
import { stageStartAge } from '../src/sim/life-stages';
import { stepDynastyCompetitions } from '../src/sim/dynasty/competitions';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { ensureRelationship } from '../src/sim/social/relationships';
import { compatibility } from '../src/sim/mates';
import { createSocialLayout } from '../src/ui/social-layout';
import { socialGraph } from '../src/ui/social-web';
import { validateState } from '../src/sim/validate-state';
describe('automatic events and champion attractiveness',()=>{
 it('runs 15/30/45/60 boundaries once, Derby before Cup, persisting prizes and next deadlines',()=>{
  let s=createHabitat(61,2);for(const [i,c]of s.creatures.entries())for(const skill of skillKeys)s=setDebugSkill(s,c.id,skill,i===0?70:20,1);
  const r=ensureRelationship(s,s.creatures[0].organismId,s.creatures[1].organismId);r.bond=70;r.mateBond=60;

  for(const day of [15,30,45,60]){
    s.clock.tick=day*config.clock.dayTicks;s.world.lastCacheDay=day;s.dynasty.nextPlantTick=s.clock.tick+config.dynasty.plants.spawnEveryTicks;
    for(const c of s.creatures){c.age=stageStartAge('adult');c.stageStartedTick=s.clock.tick;c.needs={hunger:0,fatigue:0,boredom:0,loneliness:0,stress:0};}
    stepDynastyCompetitions(s);const saved=encodeCheckpoint(s,100);stepDynastyCompetitions(s);expect(encodeCheckpoint(s,100)).toBe(saved);
    s=decodeCheckpoint(saved).state;
  }
  expect(s.dynasty.events.map(e=>`${e.day}:${e.kind}`)).toEqual(['15:derby','30:derby','30:cup','45:derby','60:derby','60:cup']);
  expect(s.creatures[0].dynasty.food.length).toBe(4*config.dynasty.competitions.berryPrize);expect(s.creatures[0].dynasty.reincarnationFruit).toBe(2);
  expect(s.dynasty.championOrganismId).toBe(s.creatures[0].organismId);const championScore=compatibility(s,s.creatures[1],s.creatures[0]).score;
  const without=structuredClone(s);without.dynasty.championOrganismId=null;
  expect(championScore-compatibility(without,without.creatures[1],without.creatures[0]).score).toBeCloseTo(config.dynasty.competitions.championAttraction);
  expect(validateState(s,config)).toEqual([]);
 });
});
describe('social graph',()=>{
 it('clusters friends and mates, gives foes no attractive force, and keeps parent direction separate',()=>{
  const ids=['a','b','c','d'],a=createSocialLayout(),b=createSocialLayout();
  a.update(ids,[],100);b.update(ids,[{a:'a',b:'b',kind:'foe',strength:-80}],100);expect([...a.positions]).toEqual([...b.positions]);
  const close=createSocialLayout(),positions=close.update(ids,[{a:'a',b:'b',kind:'mate',strength:100}],300);
  expect(Math.hypot(positions.get('a')!.x-positions.get('b')!.x,positions.get('a')!.y-positions.get('b')!.y)).toBeLessThan(140);
  const s=createHabitat(62,2),[parent,child]=s.creatures;s.organisms[1].parents=[parent.organismId];ensureRelationship(s,parent.organismId,child.organismId).bond=-90;
  const graph=socialGraph(s);expect(graph.links).toContainEqual({a:parent.organismId,b:child.organismId,kind:'parent',strength:0});expect(graph.links.some(e=>e.kind==='foe')).toBe(true);
  ensureRelationship(s,parent.organismId,child.organismId).bond=70;expect(socialGraph(s).links.some(e=>e.kind==='friend')).toBe(true);
 });
});

import { describe, it, expect } from 'vitest';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { setDebugSkill } from '../src/sim/skills';
import { shareFood, stealFood, fight, relationshipLabel, relationshipColor, lonelinessBreedingFactor } from '../src/sim/dynasty/social';
import { ensureRelationship, changeRelationship } from '../src/sim/social/relationships';
import { commitSocialOutcome } from '../src/sim/social/outcomes';
import { effectiveRunning } from '../src/sim/dynasty/movement';
import { compatibility } from '../src/sim/mates';
import { lifespan } from '../src/sim/life-stages';
import { tick } from '../src/sim/tick';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { validateState } from '../src/sim/validate-state';
import type { Creature, SaveState } from '../src/sim/types';
function give(s:SaveState,c:Creature){c.dynasty.food.push({id:`f_${String(s.counters.fruit++).padStart(8,'0')}`,kind:'sunapple'});}
describe('one social spectrum and owned food',()=>{
 it('shares with friends, steals from foes, and never duplicates a token',()=>{
  const s=createHabitat(50,2),[a,b]=s.creatures;give(s,a);const id=a.dynasty.food[0].id;
  const r=ensureRelationship(s,a.organismId,b.organismId);r.bond=70;
  expect(shareFood(s,a,b)).toBe(true);expect(a.dynasty.food).toHaveLength(0);expect(b.dynasty.food[0].id).toBe(id);
  expect(stealFood(s,a,b)).toBe(false);r.bond=-70; // changeRelationship replaces edges; set authoritative edge below.
  ensureRelationship(s,a.organismId,b.organismId).bond=-70;
  expect(stealFood(s,a,b)).toBe(true);expect(a.dynasty.food[0].id).toBe(id);expect(b.dynasty.food).toHaveLength(0);
  expect(validateState(s,config)).toEqual([]);
 });
 it('fights use Strength, real stakes, a saved two-day modifier, and a seeded tie',()=>{
  let s=createHabitat(51,2);s=setDebugSkill(s,s.creatures[0].id,'run',50,1);s=setDebugSkill(s,s.creatures[1].id,'strength',60,1);
  const [a,b]=s.creatures;ensureRelationship(s,a.organismId,b.organismId).bond=-80;give(s,a);give(s,b);
  const xp=a.xp.run;expect(fight(s,a,b)).toBe(b.id);expect(a.dynasty.food).toHaveLength(0);expect(b.dynasty.food).toHaveLength(2);
  expect(a.dynasty.runningPenaltyUntil).toBe(2*config.clock.dayTicks);expect(effectiveRunning(a,0)).toBe(30);expect(a.xp.run).toBe(xp);
  const loaded=decodeCheckpoint(encodeCheckpoint(s,100)).state.creatures[0];expect(effectiveRunning(loaded,2*config.clock.dayTicks)).toBe(50);expect(loaded.xp.run).toBe(xp);
  expect(fight(s,a,b)).toBeNull(); // no stake, no invented food
  give(s,a);const before=s.rng.competition;a.xp.strength=b.xp.strength; a.genome=structuredClone(b.genome);const copy=structuredClone(s);
  expect(fight(s,a,b)).toBe(fight(copy,copy.creatures[0],copy.creatures[1]));expect(s.rng.competition).not.toBe(before);expect(s).toEqual(copy);
 });
 it('uses equal thirds, forms mate bonds before eggs, and breaks bonds without changing ancestry',()=>{
  expect(relationshipLabel(-100/3)).toBe('Foe');expect(relationshipLabel(0)).toBe('Neutral');expect(relationshipLabel(100/3)).toBe('Friend');
  expect(relationshipColor(-100)).toBe('#f7a598');expect(relationshipColor(100)).toBe('#a2dab6');
  const s=createHabitat(52,2),[a,b]=s.creatures;ensureRelationship(s,a.organismId,b.organismId).bond=70;
  expect(compatibility(s,a,b).reason).toContain('Mate bond');
  const ancestry=structuredClone(s.organisms);
  for(let i=0;i<5;i++)commitSocialOutcome(s,a,b,'play',{bond:1,mateBond:0,valence:[0,0],stress:[0,0],outcome:'friendly',rng:a.rng});
  expect(ensureRelationship(s,a.organismId,b.organismId).mateBond).toBeGreaterThanOrEqual(config.social.mateBondThreshold);
  expect(compatibility(s,a,b).reason).toBeNull();
  changeRelationship(s,a.organismId,b.organismId,'debug',{bond:-100,mateBond:0,outcome:'rude'});
  expect(ensureRelationship(s,a.organismId,b.organismId).mateBond).toBe(0);expect(s.organisms).toEqual(ancestry);
  a.needs!.loneliness=0;const supported=lonelinessBreedingFactor(a);a.needs!.loneliness=100;expect(lonelinessBreedingFactor(a)).toBeLessThan(supported);
 });
});
describe('guaranteed next reincarnation',()=>{
 it('consumes one fruit at life expiry, including beyond the normal two-rebirth limit, with exact save continuation',()=>{
  let s=createHabitat(53,1);s.settings.autoBreed=false;s.settings.extinctionRescue=false;
  for(let life=0;life<3;life++){
    const c=s.creatures[0];s.clock.tick+=config.lifecycle.stages.elder.durationTicks;
    c.stage='elder';c.age=lifespan(c.lifeIndex)-1;c.stageStartedTick=s.clock.tick-(config.lifecycle.stages.elder.durationTicks-1);c.needs={...config.needs.newborn};c.currentAction=null;c.dynasty.reincarnationFruit=1;
    s.world.lastCacheDay=Math.floor(s.clock.tick/config.clock.dayTicks);s.dynasty.nextPlantTick=s.clock.tick+config.dynasty.plants.spawnEveryTicks;
    const genome=structuredClone(c.genome),organism=c.organismId;
    const loaded=decodeCheckpoint(encodeCheckpoint(s,100)).state;s=tick(s);expect(tick(loaded)).toEqual(s);
    expect(s.creatures[0].stage).toBe('cocoon');expect(s.creatures[0].lifeIndex).toBe(life+1);expect(s.creatures[0].organismId).toBe(organism);expect(s.creatures[0].genome).toEqual(genome);
    expect(s.creatures[0].dynasty.reincarnationFruit).toBe(0);expect(Object.values(s.creatures[0].xp).every(x=>x===0)).toBe(true);
    expect(validateState(s,config)).toEqual([]);
  }
 });
});

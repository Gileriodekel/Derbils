import {describe,it,expect} from 'vitest';
import {config} from '../src/data/config';
import {createHabitat} from '../src/sim/habitat';
import {ensureRelationship,decayRelationship,changeRelationship} from '../src/sim/social/relationships';
import {commitSocialOutcome} from '../src/sim/social/outcomes';
import {compatibility,mateCandidates,breedingDensity} from '../src/sim/mates';
import {offerCourtship,conceive} from '../src/sim/courtship';
import {rescueExtinction} from '../src/sim/population';
import {forceStage} from '../src/sim/debug-lifecycle';
import {permittedKinship} from '../src/sim/kinship';
import {socialCandidates} from '../src/sim/social/candidates';
import {buildSpatialIndex} from '../src/sim/social/spatial';
import {navigationTerrain} from '../src/sim/food-sources';
import {tick} from '../src/sim/tick';
import {validateState} from '../src/sim/validate-state';
import {encodeCheckpoint,decodeCheckpoint} from '../src/persistence/checkpoint';
import type {SaveState,Creature} from '../src/sim/types';
function friendly(s:SaveState,a:Creature,b:Creature){commitSocialOutcome(s,a,b,'play',{bond:1,mateBond:0,valence:[0,0],stress:[0,0],outcome:'friendly',rng:a.rng});}
function relatives(){
 let s=createHabitat(2468,2);s=conceive(s,s.creatures[0],s.creatures[1]);s=conceive(s,s.creatures[0],s.creatures[1]);
 for(const [i,c]of s.creatures.entries())s=forceStage(s,c.id,i<2?'elder':'adult');
 s.clock.tick=config.breeding.recovery.checkEveryTicks;for(const c of s.creatures)c.age+=s.clock.tick;
 s.world.lastCacheDay=Math.floor(s.clock.tick/config.clock.dayTicks);s.dynasty.nextPlantTick=s.clock.tick+config.dynasty.plants.spawnEveryTicks;
 return s;
}
describe('durable, voluntary mate bonds',()=>{
 it('helps adults meet unrelated peers while respecting player blocks',()=>{
  let s=createHabitat(41,3);s=conceive(s,s.creatures[0],s.creatures[1]);s=forceStage(s,s.creatures[3].id,'adult');
  const [a,b,peer,c]=s.creatures;
  c.position={x:75.5,y:45.5};a.position={x:75.5,y:46.5};b.position={x:76.5,y:45.5};peer.position={x:80.5,y:45.5};
  for(const life of s.creatures)life.needs={hunger:0,fatigue:0,boredom:0,loneliness:10,stress:0};
  for(const p of [a,b])ensureRelationship(s,c.organismId,p.organismId).bond=60;
  const index=buildSpatialIndex(s.creatures);socialCandidates(s,c,index,navigationTerrain(s.world));
  expect(c.social.targets[0]).toBe(peer.organismId);
  s.breedingRules.blockedIndividuals=[peer.organismId];c.social.nextTargetTick=0;
  socialCandidates(s,c,index,navigationTerrain(s.world));expect(c.social.targets[0]).not.toBe(peer.organismId);
 });
 it('forms with a buffer, survives separation and is strengthened by further friendly contact',()=>{
  const s=createHabitat(42,2),[a,b]=s.creatures;ensureRelationship(s,a.organismId,b.organismId).bond=60;
  friendly(s,a,b);expect(compatibility(s,a,b).reason).toBeNull();
  const formed=ensureRelationship(s,a.organismId,b.organismId);
  expect(formed.mateBond).toBe(config.dynasty.relationships.mateStartingBond);
  expect(decayRelationship(formed,6*config.clock.dayTicks).mateBond).toBeGreaterThan(config.social.mateBondThreshold);
  friendly(s,a,b);expect(ensureRelationship(s,a.organismId,b.organismId).mateBond).toBeGreaterThan(formed.mateBond);
  expect(s.social.statistics.mateBondsFormed).toBe(1);
 });
 it('respects the three-mate limit while reinforcing existing mates and permits real breakups',()=>{
  const s=createHabitat(43,5),[a,...others]=s.creatures;
  for(const b of others){ensureRelationship(s,a.organismId,b.organismId).bond=60;friendly(s,a,b);friendly(s,a,b);}
  expect(s.relationships.filter(r=>r.mateBond>=config.social.mateBondThreshold)).toHaveLength(3);
  expect(ensureRelationship(s,a.organismId,others[3].organismId).mateBond).toBe(0);
  for(let i=0;i<10;i++)friendly(s,a,others[0]);
  expect(ensureRelationship(s,a.organismId,others[0].organismId).mateBond).toBe(100);
  changeRelationship(s,a.organismId,others[0].organismId,'debug',{bond:-100,mateBond:0,outcome:'rude'});
  expect(ensureRelationship(s,a.organismId,others[0].organismId).mateBond).toBe(0);
 });
 it('keeps distant established mates available without bypassing hunger or family restrictions',()=>{
  const s=createHabitat(44,2),[a,b]=s.creatures;a.position={x:75.5,y:45.5};b.position={x:120.5,y:45.5};
  for(const c of [a,b]){c.needs={hunger:0,fatigue:0,boredom:0,loneliness:0,stress:0};c.mood=.8;}
  const r=ensureRelationship(s,a.organismId,b.organismId);r.bond=80;r.mateBond=80;
  expect(mateCandidates(s,a).filter(c=>!c.reason)).toHaveLength(1);
  let offered=false;
  for(let t=1;t<2400;t+=config.breeding.attemptIntervalTicks){s.clock.tick=t;if(offerCourtship(s,a)){offered=true;break;}}
  expect(offered).toBe(true);b.needs!.hunger=config.breeding.needMaximum;
  expect(compatibility(s,a,b).reason).toBe('Hungry');
  const family=relatives();expect(compatibility(family,family.creatures[2],family.creatures[3]).reason).toBe('Disallowed relative');
 });
});
describe('staggered founding ages and compatible state',()=>{
 it('spreads new founders without extra RNG and round-trips pre-world stage timestamps',()=>{
  const s=createHabitat(45);expect(new Set(s.creatures.map(c=>c.age)).size).toBe(s.creatures.length);
  expect(s.creatures.filter(c=>c.stage==='adult')).toHaveLength(config.breeding.initialAdults);
  expect(validateState(s,config)).toEqual([]);expect(createHabitat(45)).toEqual(s);
  const loaded=decodeCheckpoint(encodeCheckpoint(s,0)).state;expect(loaded).toEqual(s);expect(tick(loaded)).toEqual(tick(s));
  const forged=structuredClone(s);forged.creatures[0].stageStartedTick=-config.lifecycle.stages.adult.durationTicks;
  expect(validateState(forged,config).length).toBeGreaterThan(0);
 });
 it('loads an existing synchronized cohort without changing ages or relationships',()=>{
  const s=createHabitat(46);for(const c of s.creatures){c.age+=c.stageStartedTick;c.stageStartedTick=0;}
  s.creatures[0].breeding.clutches=5;s.creatures[0].breeding.cooldownUntil=3*config.clock.dayTicks;
  expect(validateState(s,config)).toEqual([]);expect(decodeCheckpoint(encodeCheckpoint(s,0)).state).toEqual(s);
 });
});
describe('limited rescue before a genetic dead end',()=>{
 it('reduces birth pressure as population approaches the target and reserves space for eggs',()=>{
  const small=createHabitat(40,12),large=createHabitat(40,23),full=createHabitat(40,24);
  expect(breedingDensity(small)).toBeGreaterThan(breedingDensity(large));expect(breedingDensity(large)).toBeGreaterThan(0);
  expect(breedingDensity(full)).toBe(0);
  large.sessions=[{id:'s_1',participants:[large.creatures[0].id,large.creatures[1].id],startedTick:0,workStartedTick:null,workTicks:0,nest:config.breeding.nest,targets:[large.creatures[0].position,large.creatures[1].position],paths:[[],[]]}];
  expect(breedingDensity(large)).toBe(0);
 });
 it('adds a bounded batch of unrelated eggs to a small related population and does not repeat while they grow',()=>{
  const s=relatives(),before=structuredClone(s),next=rescueExtinction(s),eggs=next.creatures.slice(s.creatures.length);
  expect(eggs).toHaveLength(config.breeding.recovery.eggs);expect(eggs.every(c=>c.stage==='egg')).toBe(true);
  expect(permittedKinship(next,eggs[0].organismId,next.creatures[2].organismId)).toBe(true);
  expect(rescueExtinction(next)).toBe(next);expect(s).toEqual(before);
  expect(next.lineage.slice(-2).every(l=>l.origin==='rescue')).toBe(true);
  expect(rescueExtinction(structuredClone(s))).toEqual(next);
  expect(decodeCheckpoint(encodeCheckpoint(next,0)).state).toEqual(next);
 });
 it('honors both controls, the checking interval, cooldown and capacity',()=>{
  const s=relatives();s.settings.extinctionRescue=false;expect(rescueExtinction(s)).toBe(s);
  s.settings.extinctionRescue=true;s.settings.autoBreed=false;expect(rescueExtinction(s)).toBe(s);
  s.settings.autoBreed=true;s.clock.tick++;expect(rescueExtinction(s)).toBe(s);s.clock.tick--;
  s.settings.capacity=s.creatures.length+1;expect(rescueExtinction(s).creatures).toHaveLength(s.settings.capacity);
  s.settings.capacity=30;s.lineage[0].origin='rescue';s.lineage[0].birthTick=s.clock.tick-1;expect(rescueExtinction(s)).toBe(s);
 });
 it('does not replace ordinary births or override player pairing restrictions',()=>{
  const s=createHabitat(47,2);s.clock.tick=config.breeding.recovery.checkEveryTicks;
  s.breedingRules.blockedPairs=[[s.creatures[0].organismId,s.creatures[1].organismId]];
  expect(rescueExtinction(s)).toBe(s);
  const extra=createHabitat(48,config.breeding.recovery.minimumYoung); // Enough independent youngsters to replace the current adults.
  for(const c of extra.creatures)c.stage='egg';extra.clock.tick=config.breeding.recovery.checkEveryTicks;
  expect(rescueExtinction(extra)).toBe(extra);
 });
 it('retains the six-egg rescue for a fully empty world',()=>{
  const s=createHabitat(49,0),next=rescueExtinction(s);
  expect(next.creatures).toHaveLength(config.breeding.rescueCount);expect(next.creatures.every(c=>c.stage==='egg')).toBe(true);
 });
});

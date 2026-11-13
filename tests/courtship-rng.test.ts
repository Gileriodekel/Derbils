import {expect,it} from 'vitest';
import {config} from '../src/data/config';
import {createHabitat} from '../src/sim/habitat';
import {forceStage} from '../src/sim/debug-lifecycle';
import {breedingDensity} from '../src/sim/mates';
import {offerCourtship} from '../src/sim/courtship';
import {ensureRelationship} from '../src/sim/social/relationships';
import {validateState} from '../src/sim/validate-state';
import {advanceTicks} from '../src/sim/tick';

function ready(count:number){
 let state=createHabitat(7654,count);
 state=advanceTicks(state,Number(state.creatures[0].id.slice(2))%config.ai.decisionIntervalTicks);
 for(const id of state.creatures.slice(0,4).map(c=>c.id))state=forceStage(state,id,'adult');
 state.settings.autoBreed=true;state.world.plants=state.world.plants.slice(0,1);
 for(const c of state.creatures.slice(0,4)){
  c.needs={hunger:0,fatigue:0,boredom:0,loneliness:100,stress:0};c.mood=.8;c.currentAction=null;
  c.position={x:config.breeding.nest.x+.5,y:config.breeding.nest.y+.5};c.breeding={cooldownUntil:0,clutches:0,nextAttemptTick:0};
 }
 const a=state.creatures[0];for(const b of state.creatures.slice(1,4))ensureRelationship(state,a.organismId,b.organismId).bond=70;
 return state;
}

it('preserves proposal RNG draws at soft capacity, including empty mate pools and the hard-cap guard',()=>{
 let saturated=ready(3);
 while(breedingDensity(saturated)>0&&saturated.creatures.length<config.lifecycle.capacity-1)saturated=ready(saturated.creatures.length+1);
 expect(breedingDensity(saturated)).toBe(0);
 const below=ready(saturated.creatures.length-1);expect(breedingDensity(below)).toBeGreaterThan(0);
 expect(validateState(saturated,config)).toEqual([]);expect(validateState(below,config)).toEqual([]);
 for(const poolSize of [1,3])for(let seed=1;seed<=64;seed++){
  const dense=structuredClone(saturated),loose=structuredClone(below);dense.creatures[0].rng=loose.creatures[0].rng=seed;
  dense.relationships=dense.relationships.slice(0,poolSize);loose.relationships=loose.relationships.slice(0,poolSize);
  const worldRng=structuredClone(dense.rng);
  expect(offerCourtship(dense,dense.creatures[0])).toBeNull();offerCourtship(loose,loose.creatures[0]);
  expect(loose.creatures[0].rng).not.toBe(seed);expect(dense.creatures[0].rng).toBe(loose.creatures[0].rng);
  expect(dense.creatures[0].breeding.nextAttemptTick).toBe(loose.creatures[0].breeding.nextAttemptTick);expect(dense.rng).toEqual(worldRng);
  const empty=structuredClone(saturated);empty.relationships=[];empty.creatures[0].rng=seed;
  expect(offerCourtship(empty,empty.creatures[0])).toBeNull();expect(empty.creatures[0].rng).toBe(seed);
 }
 const full=ready(config.lifecycle.capacity),rng=full.creatures[0].rng;
 expect(offerCourtship(full,full.creatures[0])).toBeNull();expect(full.creatures[0].rng).toBe(rng);
});

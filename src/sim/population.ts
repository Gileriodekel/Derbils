import { config } from '../data/config';
import { spawnCreature } from './spawn';
import { permittedKinship } from './kinship';
import { lifespan, stageStartAge } from './life-stages';
import { policyReason } from './mates';
import type { Creature, SaveState } from './types';

function breedingWindows(c:Creature):[number,number][]{
  const windows:[number,number][]=[];
  if(c.breeding.clutches<config.breeding.maximumClutches){
    const from=Math.max(0,stageStartAge('adult',c.lifeIndex)-c.age),until=stageStartAge('elder',c.lifeIndex)-c.age;
    if(until>from)windows.push([from,until]);
  }
  if(c.dynasty.reincarnationFruit>0){
    const reborn=lifespan(c.lifeIndex)-c.age;
    windows.push([reborn+stageStartAge('adult',c.lifeIndex+1),reborn+stageStartAge('elder',c.lifeIndex+1)]);
  }
  return windows;
}

/** The existing opt-in rescue protects the next generation before a synchronized
 * old cohort disappears. Real offspring/youngsters suppress further assistance. */
export function rescueExtinction(state: SaveState): SaveState {
  if(!state.settings.extinctionRescue)return state;
  const r=config.breeding.recovery;
  let count=config.breeding.rescueCount;
  if(state.creatures.length){
    if(!state.settings.autoBreed||state.clock.tick%r.checkEveryTicks!==0)return state;
    const horizon=stageStartAge('adult');
    const pending=state.sessions.length*config.breeding.clutchEggs;
    const projected=state.creatures.filter(c=>lifespan(c.lifeIndex)-c.age>horizon||c.dynasty.reincarnationFruit>0).length+pending;
    if(state.creatures.length>r.maximumPopulation&&projected>=r.minimumProjectedPopulation)return state;
    const future=state.creatures.map(c=>({c,windows:breedingWindows(c)})).filter(v=>v.windows.length);
    const pairs=future.flatMap((a,i)=>future.slice(i+1).flatMap(b=>
      permittedKinship(state,a.c.organismId,b.c.organismId)&&a.windows.some(A=>b.windows.some(B=>Math.min(A[1],B[1])-Math.max(A[0],B[0])>=r.minimumBreedingWindowTicks))
        ? [[a.c,b.c] as const] : []));
    const young=state.creatures.filter(c=>c.stage!=='adult'&&c.stage!=='elder').length+pending;
    const declining=projected<r.minimumProjectedPopulation&&young<r.minimumYoung;
    // Pair blocks must not be treated as an excuse to bypass the player's choice.
    if(pairs.length&&(!declining||pairs.every(([a,b])=>policyReason(state,a,b))))return state;
    const lastRescue=Math.max(-Infinity,...state.lineage.filter(l=>l.origin==='rescue').map(l=>l.birthTick));
    if(state.clock.tick-lastRescue<r.cooldownDays*config.clock.dayTicks)return state;
    count=r.eggs;
  }
  let next=state;
  for(let i=0;i<count;i++) next=spawnCreature(next,undefined,{stage:'egg',origin:'rescue',near:config.breeding.nest});
  return next;
}

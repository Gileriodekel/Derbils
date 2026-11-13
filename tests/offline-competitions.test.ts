import { expect, it } from 'vitest';
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { advance } from '../src/sim/advance';
import { createCatchUp } from '../src/app/catchup';
import { applyPlayerCommand } from '../src/sim/commands';
import { navigationTerrain } from '../src/sim/food-sources';
import { enterCompetition } from '../src/sim/competition/attendance';
import { setTraitValue } from '../src/sim/genetics/edits';
import { xpAtLevel } from '../src/sim/skills';
import { hashState } from '../src/sim/hash';
import { decodeCheckpoint, encodeCheckpoint } from '../src/persistence/checkpoint';
import { assertInvariants } from './helpers/invariants';
import type { CompetitionStatus, SaveState } from '../src/sim/types';
const run=(s:SaveState,n:number)=>advance(s,s.rng,n);
function fixture(status:CompetitionStatus){
  let state=createHabitat(901,3);state.settings.autoBreed=false;state.settings.extinctionRescue=false;
  for(const c of state.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};c.mood=.8;
    for(const k of skillKeys){c.genome=setTraitValue(c.genome,'aptitudes',k,.9);c.xp[k]=xpAtLevel(30,k);}}
  state=applyPlayerCommand(state,{kind:'createCompetition',format:'dash',skill:'run',startDelay:config.competitions.defaultStartDelay,entryRules:structuredClone(config.competitions.entry),prize:{placements:[{rank:1,kind:'fruit',id:'prismpear',quantity:2},{rank:2,kind:'cosmetic',id:'ribbon',quantity:1}]}});
  if(status==='scheduled')return state;
  state=run(state,state.competitions[0].entryOpenTick);state.social.sessions=[];state.sessions=[];
  for(const c of state.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};if(!state.competitions[0].entrantIds.includes(c.id))expect(enterCompetition(state,c,state.competitions[0],navigationTerrain(state.world))).toBe(true);}
  if(status==='entryOpen')return state;
  state=run(state,state.competitions[0].startTick-state.clock.tick);
  if(status==='running')return state;
  if(status==='cancelled')return applyPlayerCommand(state,{kind:'cancelCompetition',id:state.competitions[0].id,debug:true});
  return run(state,state.competitions[0].endTick-state.clock.tick);
}
for(const status of ['scheduled','entryOpen','running','resolved','cancelled'] as const)it(`replays a ${status} event with coherent references and exactly-once settlement`,()=>{
  const initial=fixture(status),saved=decodeCheckpoint(encodeCheckpoint(initial,10000));assertInvariants(saved.state,config);
  const job=createCatchUp(saved.state,500,{now:()=>0,config});while(!job.snapshot().done)job.step();
  const result=job.snapshot().state;expect(hashState(result)).toBe(hashState(run(initial,500)));assertInvariants(result,config);
  expect(result.competitions).toHaveLength(0);expect(result.competitionHistory).toHaveLength(1);
  const event=result.competitionHistory[0];expect(['resolved','cancelled']).toContain(event.status);
  if(event.status==='resolved'){expect(result.prizeLedger.delivered).toBe(3);expect(event.awarded).toBe(true);expect(event.deliveries).toHaveLength(2);}
  else expect(result.prizeLedger.refunded).toBe(3);
},30000);
for(const seed of [271828,314159,161803])it(`preserves population, needs and exact prize accounting for a maximum absence: ${seed}`,()=>{
  const initial=createHabitat(seed);initial.settings.autoCompetitions=true;initial.settings.autoPrizes=true;
  const job=createCatchUp(initial,config.offline.maxCatchUpTicks,{now:()=>0,config});
  while(!job.snapshot().done){const step=job.step();
    expect(step.state.creatures.length+step.state.sessions.length).toBeLessThanOrEqual(config.lifecycle.capacity);
    for(const c of step.state.creatures)if(c.needs){expect(c.needs.hunger).toBeLessThan(100);expect(c.needs.fatigue).toBeLessThan(100);}
  }
  const result=job.snapshot();expect(result.summary.rescueEggs).toBe(0);assertInvariants(result.state,config);
  expect(result.state.competitionState.statistics.held).toBeGreaterThan(0);
},180000);

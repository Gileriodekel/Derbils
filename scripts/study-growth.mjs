import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
try{
  const {config}=await server.ssrLoadModule('/src/data/config.ts');
  const {createHabitat}=await server.ssrLoadModule('/src/sim/habitat.ts');
  const {tick}=await server.ssrLoadModule('/src/sim/tick.ts');
  const {validateSave}=await server.ssrLoadModule('/src/persistence/validate.ts');
  const {encodeCheckpoint,decodeCheckpoint}=await server.ssrLoadModule('/src/persistence/checkpoint.ts');
  const {prizeBalances}=await server.ssrLoadModule('/src/sim/competition/balances.ts');
  const {permittedKinship}=await server.ssrLoadModule('/src/sim/kinship.ts');
  const {familyTie}=await server.ssrLoadModule('/src/sim/social/family.ts');
  const {isArchivedAncestor}=await server.ssrLoadModule('/src/sim/archive.ts');
  let state=createHabitat(271828,30);state.settings.autoCompetitions=true;state.settings.autoPrizes=true;
  const target=2000000,started=performance.now(),maximum={population:0,events:0,lineage:0,stubs:0,organisms:0,history:0,relationships:0,looseFruit:0};
  let maxHunger=0,maxFatigue=0,compactions=0;
  for(let n=1;n<=target;n++){
    const before=state;
    // Check every living-pair fact at each actual compaction, before the next tick can change population.
    state=tick(state);
    if(state.archive&&((state.archive.removedLives>(before.archive?.removedLives??0))||state.archive.stubs.length!==(before.archive?.stubs.length??0))){
      compactions++;
      const living=new Set(state.creatures.map(c=>c.organismId)),previous=new Set(before.creatures.map(c=>c.organismId));
      for(const a of living)if(previous.has(a))for(const b of living)if(previous.has(b)){
        assert.equal(permittedKinship(state,a,b),permittedKinship(before,a,b),'living kinship changed during compaction');
        assert.equal(familyTie(state,a,b),familyTie(before,a,b),'living family changed during compaction');
      }
    }
    assert(state.creatures.length+state.sessions.length<=config.lifecycle.capacity);
    for(const c of state.creatures)if(c.needs){maxHunger=Math.max(maxHunger,c.needs.hunger);maxFatigue=Math.max(maxFatigue,c.needs.fatigue);}
    for(const [key,value] of Object.entries({population:state.creatures.length,events:state.events.length,lineage:state.lineage.length,stubs:state.archive?.stubs.length??0,organisms:state.organisms.length,history:state.competitionHistory.length,relationships:state.relationships.length,looseFruit:state.world.looseFruit.length}))maximum[key]=Math.max(maximum[key],value);
    if(n%50000===0){
      validateSave(state);
      for(const [key,quantity] of Object.entries(prizeBalances(state)))assert.equal(quantity,state.prizeLedger.supplied[key]??0);
      console.log(JSON.stringify({tick:n,population:state.creatures.length,full:state.lineage.length,stubs:state.archive?.stubs.length??0,removed:state.archive?.removedLives??0,held:state.competitionState.statistics.held,seconds:(performance.now()-started)/1000}));
    }
  }
  const encoded=encodeCheckpoint(state,0),bytes=Buffer.byteLength(encoded,'utf8');decodeCheckpoint(encoded);
  assert(bytes<config.offline.archive.saveByteBudget,'save byte budget');
  assert(maximum.lineage<=config.offline.archive.maximumFullRecords);assert(maximum.stubs<=config.offline.archive.maximumStubs);
  assert(maximum.organisms<=config.offline.archive.maximumFullRecords+config.offline.archive.maximumStubs);
  assert(maximum.events<=config.lifecycle.eventLogLimit);assert(maximum.history<=config.competitions.historyLimit);assert(maximum.relationships<=config.social.maximumRelationships);assert(maximum.looseFruit<=config.prizes.looseCapacity);
  assert(state.world.items.length<=config.training.defaults.length);assert(state.world.plants.length<=config.sources.defaults.length);
  for(const o of state.organisms){assert(o.lives.length<=config.lifecycle.rebirth.maximum+1);for(const parent of o.parents)assert(state.organisms.some(o=>o.id===parent)||isArchivedAncestor(parent));}
  for(const c of state.creatures){assert(c.awards.trophies.length<=config.prizes.trophyLimit);assert(c.lastFiveFoods.length<=config.food.historyLength);assert(c.social.targets.length<=config.social.targetLimit);assert(Object.keys(c.social.contestCooldowns).length<config.lifecycle.capacity);}
  for(const r of state.relationships)assert(r.history.length<=config.social.historyLimit);
  console.log(JSON.stringify({kind:'growth-result',ticks:target,seed:271828,initialPopulation:30,population:state.creatures.length,maximum,bytes,budget:config.offline.archive.saveByteBudget,compactions,
    stubs:state.archive?.stubs.length??0,removedLives:state.archive?.removedLives??0,maxHunger,maxFatigue,seconds:(performance.now()-started)/1000,conserved:true}));
}finally{await server.close();}

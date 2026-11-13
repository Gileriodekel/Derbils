import {performance} from 'node:perf_hooks';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
try{
  const {config}=await server.ssrLoadModule('/src/data/config.ts');
  const {createHabitat}=await server.ssrLoadModule('/src/sim/habitat.ts');
  const {advance}=await server.ssrLoadModule('/src/sim/advance.ts');
  const {hashState}=await server.ssrLoadModule('/src/sim/hash.ts');
  for(const population of config.offline.bench.populations){
    let state=createHabitat(config.offline.bench.seed,population);state.settings.autoCompetitions=true;state.settings.autoPrizes=true;
    state=advance(state,state.rng,config.offline.bench.warmupTicks);
    const beforeHeld=state.competitionState.statistics.held,beforeDelivered=state.prizeLedger.delivered,beforeRefunded=state.prizeLedger.refunded;
    const phases={},operations={};let mark=performance.now();
    const observer={phase(name,count){const now=performance.now();phases[name]=(phases[name]??0)+now-mark;operations[name]=(operations[name]??0)+count;mark=now;}};
    const start=performance.now();mark=start;
    state=advance(state,state.rng,config.offline.bench.measuredTicks,undefined,observer);
    const seconds=(performance.now()-start)/1000,tps=config.offline.bench.measuredTicks/seconds;
    console.log(JSON.stringify({initialPopulation:population,finalPopulation:state.creatures.length,ticks:config.offline.bench.measuredTicks,
      seconds,ticksPerSecond:tps,estimatedMaximumCatchUpSeconds:config.offline.maxCatchUpTicks/tps,
      systems:{breeding:state.settings.autoBreed,social:true,competitions:state.settings.autoCompetitions,prizes:state.settings.autoPrizes},
      competitionsResolvedDuringSample:state.competitionState.statistics.held-beforeHeld,prizeUnitsDeliveredDuringSample:state.prizeLedger.delivered-beforeDelivered,prizeUnitsRefundedDuringSample:state.prizeLedger.refunded-beforeRefunded,
      phaseMilliseconds:phases,operationCounts:operations,hash:hashState(state)}));
  }
  console.log('Timing is observational, never asserted. Operation counts are records visited by each system pass; population may change autonomously. All systems enabled.');
}finally{await server.close();}

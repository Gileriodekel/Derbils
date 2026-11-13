import { createServer } from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
try {
  const {createHabitat}=await server.ssrLoadModule('/src/sim/habitat.ts');
  const {tick}=await server.ssrLoadModule('/src/sim/tick.ts');
  const {geneticDiversity}=await server.ssrLoadModule('/src/sim/metrics.ts');
  const {competitionMetrics}=await server.ssrLoadModule('/src/sim/competition/metrics.ts');
  const {prizeMetrics}=await server.ssrLoadModule('/src/sim/competition/prize-metrics.ts');
  const {socialMetrics}=await server.ssrLoadModule('/src/sim/social/metrics.ts');
  const {encodeSave}=await server.ssrLoadModule('/src/persistence/save.ts');
  const {lifespan}=await server.ssrLoadModule('/src/sim/life-stages.ts');
  const {config,skillKeys,lifeStages}=await server.ssrLoadModule('/src/data/config.ts');
  const args=process.argv.slice(2).filter(a=>a!=='--auto-competitions'&&a!=='--auto-prizes');
  const autoCompetitions=process.argv.includes('--auto-competitions')||process.env.CREATURE_AUTO_COMPETITIONS==='1';
  const ticks=Number(args[0]??config.breeding.reportTicks);
  const seeds=args.length>1?args.slice(1).flatMap(s=>s.split(',')).map(Number):config.breeding.reportSeeds;
  if(!Number.isSafeInteger(ticks)||ticks<1||!seeds.length||seeds.some(s=>!Number.isSafeInteger(s)))throw new Error('Usage: npm run report -- [positive ticks] [seed ...]');
  for(const seed of seeds){
    let state=createHabitat(seed),minimum=state.creatures.length,maximum=minimum,maxHunger=0,maxFatigue=0,rescues=0;
    const sourceCount=Number(process.env.CREATURE_REPORT_SOURCES??state.world.plants.length);
    if(!Number.isInteger(sourceCount)||sourceCount<0||sourceCount>state.world.plants.length)throw new Error('Invalid report source count');
    state.world.plants=state.world.plants.slice(0,sourceCount);
    state.settings.autoCompetitions=autoCompetitions;state.settings.autoPrizes=process.argv.includes('--auto-prizes')||process.env.CREATURE_AUTO_PRIZES==='1';
    let populationSum=0,populationSamples=0,birthsAtWindow=0;
    let minimumDiversity=geneticDiversity(state).heterozygosity,previousCount=state.creatures.length;
    let socialAt300k=null,firstFriendshipTick=null;
    const population=[];console.log(`Seed ${seed}; formal auto competitions ${state.settings.autoCompetitions?'ON':'OFF'}; ${ticks.toLocaleString()} ticks; cap ${state.settings.capacity}; autonomous breeding; extinction rescue ${state.settings.extinctionRescue?'enabled':'disabled'}; no ordinary immigration.`);
    function sample(){
      const diversity=geneticDiversity(state);
      population.push({tick:state.clock.tick,population:state.creatures.length,slots:state.creatures.length+state.sessions.length,
        ...Object.fromEntries(lifeStages.map(s=>[s,state.creatures.filter(c=>c.stage===s).length])),
        births:state.lineage.filter(l=>l.origin==='birth'&&state.organisms.find(o=>o.id===l.organismId).lives[0].creatureId===l.id).length,deaths:state.lineage.filter(l=>l.endReason==='oldAge').length,
        heterozygosity:+diversity.heterozygosity.toFixed(3),distinctAlleles:+diversity.meanDistinctAlleles.toFixed(2)});
    }
    sample();let previousLineage=state.lineage.length;
    for(let i=0;i<ticks;i++){
      state=tick(state);if(firstFriendshipTick===null&&state.social.statistics.friendships>0)firstFriendshipTick=state.clock.tick;
      if(state.clock.tick===config.social.pacing.ticks)socialAt300k=socialMetrics(state);minimum=Math.min(minimum,state.creatures.length);maximum=Math.max(maximum,state.creatures.length+state.sessions.length);
      for(const c of state.creatures)if(c.needs){maxHunger=Math.max(maxHunger,c.needs.hunger);maxFatigue=Math.max(maxFatigue,c.needs.fatigue);}
      // Living genomes never change in an autonomous report; membership boundaries cover every diversity change.
      if(state.lineage.length!==previousLineage||state.creatures.length!==previousCount)minimumDiversity=Math.min(minimumDiversity,geneticDiversity(state).heterozygosity);
      previousCount=state.creatures.length;
      if(state.lineage.length>previousLineage){rescues+=state.lineage.slice(previousLineage).filter(l=>l.origin==='rescue').length;previousLineage=state.lineage.length;}
      if(i===ticks-100001)birthsAtWindow=state.lineage.filter(l=>l.origin==='birth'&&state.organisms.find(o=>o.id===l.organismId).lives[0].creatureId===l.id).length;
      if(i>=Math.max(0,ticks-100000)){populationSum+=state.creatures.length;populationSamples++;}
      if(state.clock.tick%config.breeding.reportIntervalTicks===0||i===ticks-1){
        encodeSave(state);sample();console.log(JSON.stringify({seed,...population.at(-1),rescues,competitions:competitionMetrics(state),prizes:prizeMetrics(state),social:socialMetrics(state)}));
      }
    }
    console.log('Population and diversity over time:');console.table(population);
    const generations=[...new Set(state.lineage.map(l=>l.generation))].sort((a,b)=>a-b);
    const livingOrganisms=new Set(state.creatures.map(c=>c.organismId)),deadOrganisms=new Set(state.lineage.filter(l=>l.endReason==='oldAge').map(l=>l.organismId));
    console.log('Counts and average birth aptitude by generation:');
    console.table(generations.map(g=>{
      const records=state.lineage.filter(l=>l.generation===g&&state.organisms.find(o=>o.id===l.organismId).lives[0].creatureId===l.id);
      return {generation:g,born:records.length,living:records.filter(l=>livingOrganisms.has(l.organismId)).length,
        deaths:records.filter(l=>deadOrganisms.has(l.organismId)).length,
        ...Object.fromEntries(skillKeys.map(k=>[k,+(records.reduce((n,l)=>n+l.birthAptitudes[k],0)/records.length).toFixed(3)]))};
    }));
    console.log('Distinct active allele values per locus:');console.table(geneticDiversity(state).distinct);
    const dead=state.lineage.filter(l=>l.endReason==='oldAge');
    const lifeIndices=new Map(state.organisms.flatMap(o=>o.lives.map(l=>[l.creatureId,l.lifeIndex])));
    const firstDead=dead.filter(l=>lifeIndices.get(l.id)===0),rebornDead=dead.filter(l=>lifeIndices.get(l.id)>0);
    const average=records=>records.length?records.reduce((n,l)=>n+l.ageAtDeath,0)/records.length:null;
    console.log(JSON.stringify({seed,ticks,populationRange:[minimum,maximum],births:state.lineage.filter(l=>l.origin==='birth'&&state.organisms.find(o=>o.id===l.organismId).lives[0].creatureId===l.id).length,
      deaths:dead.length,meanPopulationLast100k:populationSum/populationSamples,birthsLast100k:state.lineage.filter(l=>l.origin==='birth'&&state.organisms.find(o=>o.id===l.organismId).lives[0].creatureId===l.id).length-birthsAtWindow,averageLifespan:average(dead),firstLifeAverageLifespan:average(firstDead),rebornAverageLifespan:average(rebornDead),allLifespansCanonical:state.lineage.filter(l=>l.endReason==='oldAge'||l.endReason==='rebirth').every(l=>l.ageAtDeath===lifespan(lifeIndices.get(l.id))),rebirths:state.lineage.filter(l=>l.endReason==='rebirth').length,
      maxHunger,maxFatigue,extinctionRescueFired:rescues>0,rescueEggs:rescues,minimumDiversity,diversity:geneticDiversity(state).heterozygosity,firstFriendshipTick,competitions:competitionMetrics(state),prizes:prizeMetrics(state),social:socialMetrics(state),socialAt300k}));
  }
} finally {await server.close();}

import { config, actionKinds, skillKeys } from '../data/config';
import { geneticDiversity } from '../sim/metrics';
import { derivePhenotype } from '../sim/genetics/expression';
import { skillCap, skillLevel } from '../sim/skills';
import { computeAppearance } from '../sim/appearance/derive';
import { competitionMetrics } from '../sim/competition/metrics';
import { socialMetrics } from '../sim/social/metrics';
import { playerEvents } from '../app/events';
import type { HealthProfile, SaveState } from '../sim/types';

export function createHealthCollector(initial:SaveState,profile:HealthProfile) {
  let samples=0,population=0,minimum=initial.creatures.length,maximum=minimum,rescues=0;
  let minDiversity=1,minAlleles=Infinity,aptitudeDrift=0,generation=0,adultSamples=0,capFractions=0,maxed=0,parts=0;
  let lifeSum=0,lifeCount=0,visible=0,inventoryMin=Infinity,inventoryMax=0;
  const skillTotals=skillKeys.map(()=>0),behaviors:Record<string,number>={selfCare:0,rest:0,training:0,social:0,travel:0,other:0};
  const perBehavior:Record<string,number>={},wins=new Map<string,number>();
  const baseline=skillKeys.map(k=>initial.creatures.reduce((n,c)=>n+derivePhenotype(c.genome).aptitudes[k],0)/initial.creatures.length);
  const visibleTicks:number[]=[];
  let adultTime=0;
  function observe(before:SaveState,state:SaveState) {
    minimum=Math.min(minimum,state.creatures.length);maximum=Math.max(maximum,state.creatures.length+state.sessions.length);
    const added=state.counters.event===before.counters.event?[]:state.events.filter(e=>Number(e.id.slice(2))>=before.counters.event);
    rescues+=added.filter(e=>e.kind==='rescue').length;
    for(const e of playerEvents(added,config.presentation)){
      while(visibleTicks.length&&e.tick-visibleTicks[0]>=config.presentation.eventWindowTicks)visibleTicks.shift();
      if(visibleTicks.length<config.presentation.eventRateCap){visible++;visibleTicks.push(e.tick);}
    }
    for(const e of added) {
      if(e.kind==='death'||e.kind==='rebirth'){
        const life=state.lineage.find(l=>l.id===e.creatureId);
        if(life?.ageAtDeath!==null&&life?.ageAtDeath!==undefined){lifeSum+=life.ageAtDeath;lifeCount++;}
      }
      if(e.kind==='competitionResult'){
        const event=state.competitionHistory.find(c=>c.id===e.competitionEvent?.id);
        const winner=event?.results?.placements[0]?.id;
        if(winner)wins.set(winner,(wins.get(winner)??0)+1);
      }
    }
    const locked=new Map<string,string>();
    for(const session of state.sessions)for(const id of session.participants)locked.set(id,'court');
    for(const session of state.social.sessions)for(const id of session.participants)locked.set(id,session.kind);
    for(const event of state.competitions)for(const id of event.entrantIds)locked.set(id,'competition');
    for(const c of state.creatures)if(c.stage==='adult'){
      adultTime++;const kind=locked.get(c.id)??c.currentAction?.kind??'idle';
      perBehavior[kind]=(perBehavior[kind]??0)+1;
      if(c.currentAction?.path.length)behaviors.travel++;
      else if(kind==='eat'||kind==='graze')behaviors.selfCare++;
      else if(kind==='sleep')behaviors.rest++;
      else if(kind.startsWith('train_')||kind==='contest'||kind==='competition')behaviors.training++;
      else if(['play','court','comfort','avoid'].includes(kind))behaviors.social++;
      else behaviors.other++;
    }
    if(state.clock.tick%profile.sampleEveryTicks!==0)return;
    samples++;population+=state.creatures.length;
    const diversity=geneticDiversity(state);minDiversity=Math.min(minDiversity,diversity.heterozygosity);
    minAlleles=Math.min(minAlleles,...diversity.distinct.filter(r=>!['pattern','ears'].includes(r.locus)).map(r=>r.alleles));
    generation=Math.max(generation,...state.lineage.map(l=>l.generation));
    const current=skillKeys.map(k=>state.creatures.reduce((n,c)=>n+derivePhenotype(c.genome).aptitudes[k],0)/Math.max(1,state.creatures.length));
    aptitudeDrift=Math.max(aptitudeDrift,...current.map((q,i)=>Math.abs(q-baseline[i])));
    for(const c of state.creatures)if(c.stage==='adult'){
      adultSamples++;const levels=skillKeys.map(k=>skillLevel(c,k)/skillCap(c,k));
      capFractions+=levels.reduce((n,v)=>n+v,0)/levels.length;maxed+=Number(levels.some(v=>v>=1));
      levels.forEach((v,i)=>skillTotals[i]+=v);
      parts+=computeAppearance(c,config).parts.filter(p=>p.sourceSkill!==null&&p.tier>0).length;
    }
    for(const group of Object.values(state.inventory))for(const n of Object.values(group)){inventoryMin=Math.min(inventoryMin,n);inventoryMax=Math.max(inventoryMax,n);}
  }
  function result(state:SaveState) {
    const c=competitionMetrics(state),s=socialMetrics(state),totalWins=[...wins.values()].reduce((n,v)=>n+v,0);
    const ticks=state.clock.tick-initial.clock.tick;
    // Retain complete measured generation means; rebirth lives count once per organism.
    const firstLives=new Set(state.organisms.map(o=>o.lives[0]?.creatureId));
    const groups=new Map<number,{count:number;sums:number[]}>();
    for(const life of state.lineage)if(firstLives.has(life.id)){
      let group=groups.get(life.generation);if(!group){group={count:0,sums:skillKeys.map(()=>0)};groups.set(life.generation,group);}
      group.count++;skillKeys.forEach((k,i)=>group.sums[i]+=life.birthAptitudes[k]);
    }
    const generations=[...groups].sort(([a],[b])=>a-b).map(([generation,g])=>({generation,count:g.count,means:Object.fromEntries(skillKeys.map((k,i)=>[k,g.sums[i]/g.count]))}));
    for(const row of generations)if(row.count>=initial.creatures.length)aptitudeDrift=Math.max(aptitudeDrift,...skillKeys.map((k,i)=>Math.abs(row.means[k]-baseline[i])));
    const values:Record<string,number>={
      'population.mean':population/Math.max(1,samples),'population.minimum':minimum,'population.maximum':maximum,'population.rescues':rescues,
      'population.starvationDeaths':0,'population.exhaustionDeaths':0,
      'life.meanLifespan':lifeCount?lifeSum/lifeCount:0,'life.generationsPer100k':generation/Math.max(1,ticks)*100000,
      'genetics.minimumDiversity':minDiversity,'genetics.minimumAlleles':Number.isFinite(minAlleles)?minAlleles:0,'genetics.aptitudeDrift':aptitudeDrift,
      'skills.meanCapFraction':capFractions/Math.max(1,adultSamples),'skills.maxedShare':maxed/Math.max(1,adultSamples),
      'skills.dominantShare':Math.max(...skillTotals)/Math.max(1,skillTotals.reduce((n,v)=>n+v,0)), 'skills.partsPerAdult':parts/Math.max(1,adultSamples),
      ...Object.fromEntries(Object.entries(behaviors).map(([k,n])=>[`behavior.${k}`,n/Math.max(1,adultTime)])),
      'social.positiveShare':s.positiveShare,'social.meanDegree':s.meanRelationships,'social.maximumDegree':s.maximumRelationships,
      'social.friendships':s.friendshipsFormed,'social.rivalries':s.rivalriesFormed,'social.bondedMatingShare':s.bondedMatingShare,
      'competitions.fillRate':c.fillRate??0,'competitions.cancellationRate':1-(c.fillRate??0),'competitions.winConcentration':totalWins?Math.max(...wins.values())/totalWins:0,
      'prizes.inventoryMinimum':Number.isFinite(inventoryMin)?inventoryMin:0,'prizes.inventoryMaximum':inventoryMax,
      'prizes.rareEatenPer100k':state.prizeLedger.rareFruitEaten/Math.max(1,ticks)*100000,'events.perHour':visible/Math.max(1,ticks)*3600,
    };
    const perActionBands:Record<string,[number,number]>={};
    const generalCeiling=Math.max(...Object.entries(profile.bands).filter(([key])=>key.startsWith('behavior.')).map(([,band])=>band[1]));
    for(const kind of [...actionKinds.filter(k=>!['enterCompetition','attendCompetition'].includes(k)),'competition']){
      const key=`behavior.action.${kind}`;values[key]=(perBehavior[kind]??0)/Math.max(1,adultTime);
      perActionBands[key]=kind.startsWith('train_')?[profile.bands['behavior.training'][0]/skillKeys.length,profile.bands['behavior.training'][1]]
        :kind==='sleep'?profile.bands['behavior.rest']
        :['eat','graze'].includes(kind)?[0,profile.bands['behavior.selfCare'][1]]
        :['play','comfort','avoid','court'].includes(kind)?[0,profile.bands['behavior.social'][1]]:[0,generalCeiling];
    }
    const checks=Object.entries({...profile.bands,...perActionBands}).map(([metric,[low,high]])=>({metric,value:values[metric],low,high,pass:Number.isFinite(values[metric])&&values[metric]>=low&&values[metric]<=high}));
    return {seed:Number(state.saveId.slice(6)),ticks,pass:checks.every(c=>c.pass),checks,generations,behaviors:Object.fromEntries(Object.entries(perBehavior).map(([k,v])=>[k,v/Math.max(1,adultTime)])),hash:null as string|null};
  }
  return {observe,result};
}

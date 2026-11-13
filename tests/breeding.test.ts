import { describe, expect, it, vi } from 'vitest';
import fixture from './fixtures/milestone-5b.json';
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { breedingReason, compatibility, mateCandidates } from '../src/sim/mates';
import { applyPlayerCommand } from '../src/sim/commands';
import { previewOffspring } from '../src/sim/genetics/preview';
import { courtCandidate, startCourtship, offerCourtship, conceive } from '../src/sim/courtship';
import { navigationTerrain } from '../src/sim/food-sources';
import { forceStage } from '../src/sim/debug-lifecycle';
import { permittedKinship } from '../src/sim/kinship';
import { stageStartAge } from '../src/sim/life-stages';
import { tick, advanceTicks } from '../src/sim/tick';
import { encodeSave, decodeSave } from '../src/persistence/save';
import { validateGenome } from '../src/sim/genetics/validate';
import { crossover, mutate } from '../src/sim/genetics/inheritance';
import * as inheritance from '../src/sim/genetics/inheritance';
import { foodPreference } from '../src/sim/preferences';
import { derivePhenotype } from '../src/sim/genetics/expression';
import { loci, locusAlleles } from '../src/sim/genetics/catalog';
import { softmaxIndex, scoreUtility, utilityTotal } from '../src/sim/utility';
import { setTraitValue } from '../src/sim/genetics/edits';
import type { SaveState, Creature } from '../src/sim/types';

function ready(count=2) {
  const s=createHabitat(7654,count);
  for(const c of s.creatures){c.needs={hunger:0,fatigue:0,boredom:0,loneliness:100,stress:0};c.mood=.8;c.currentAction=null;}
  // Eligible mating fixtures now need the real Milestone 8 bond gate, without exceeding sparse caps.
  for(const b of s.creatures.slice(1,4))s.relationships.push({a:s.creatures[0].organismId,b:b.organismId,bond:70,mateBond:60,lastContactTick:0,lastDecayTick:0,history:[]});
  return s;
}
function command(s:SaveState, kind:'pair'|'blockPair'|'encouragePair',enabled=true){return applyPlayerCommand(s,{kind,a:s.creatures[0].organismId,b:s.creatures[1].organismId,enabled});}
function begin(s=ready()) {expect(startCourtship(s,s.creatures[0],s.creatures[1],navigationTerrain(s.world))).toBe(true);return s;}

describe('eligibility, kinship and the exact available compatibility factors',()=>{
  it.each(['egg','baby','juvenile','elder'] as const)('excludes %s',stage=>{
    let s=ready();s=forceStage(s,s.creatures[0].id,stage);expect(breedingReason(s,s.creatures[0])).not.toBeNull();
    expect(startCourtship(s,s.creatures[0],s.creatures[1],navigationTerrain(s.world))).toBe(false);
  });
  it('checks every entry gate and permits healthy adults',()=>{
    const s=ready(),c=s.creatures[0];expect(breedingReason(s,c)).toBeNull();
    for(const edit of [(c:Creature)=>{c.needs!.hunger=55;},(c:Creature)=>{c.needs!.fatigue=55;},(c:Creature)=>{c.needs!.stress=50;},
      (c:Creature)=>{c.mood=.09;},(c:Creature)=>{c.breeding.cooldownUntil=1;},(c:Creature)=>{c.breeding.clutches=5;},
      (c:Creature)=>{c.age=stageStartAge('elder')-40;}]){
      const copy=structuredClone(s);edit(copy.creatures[0]);expect(breedingReason(copy,copy.creatures[0])).not.toBeNull();
    }
  });
  it('blocks ancestors, siblings and first cousins, permits unrelated founders and second cousins',()=>{
    const s=ready(4),[a,b,c,d]=s.organisms.map(o=>o.id);
    const add=(id:string,parents:string[])=>s.organisms.push({id,parents,appearanceSeed:1,lives:[]});
    add('x',[a,b]);add('y',[a,b]);add('z',[c,d]);add('u',['x','z']);add('v',['y',d]);
    add('u2',['u',c]);add('v2',['v',d]);
    expect(permittedKinship(s,a,b)).toBe(true);expect(permittedKinship(s,a,'u')).toBe(false);
    expect(permittedKinship(s,'x','y')).toBe(false);expect(permittedKinship(s,'u','v')).toBe(false);
    // Disjoint branches of two unrelated founder couples yield permitted second cousins.
    add('f1',[]);add('f2',[]);add('f3',[]);add('f4',[]);
    add('p1',['x','f1']);add('p2',['y','f2']);add('q1',['p1','f3']);add('q2',['p2','f4']);
    expect(permittedKinship(s,'q1','q2')).toBe(true);
  });
  it('uses full bond factors and the exact court utility terms',()=>{
    const s=ready(),[a,b]=s.creatures,m=compatibility(s,a,b),w=config.breeding.compatibilityWeights;
    expect(w.bond).toBe(.55);expect(m.bond).toBe(70);
    expect(m.score).toBeCloseTo(.55*.7+.2*m.traitSimilarity+.15*m.tasteSimilarity+.1*m.geneticDifference,14);
    const c=courtCandidate(s,a,b);expect(c.courtshipInterest).toBe(config.breeding.courtshipInterest*m.score);expect(c.relief.loneliness).toBe(15);expect(c.predictedFatigueIncrease).toBe(2);
    expect(scoreUtility(a,c).terms.courtshipInterest ?? c.courtshipInterest).toBeGreaterThan(0);
  });
});

describe('courtship, reproduction and exact saves',()=>{
  it('reserves one slot, approaches independently, commits one egg once, applies costs and cooldowns',()=>{
    let s=begin(),seenWork=false;const initial=s.creatures.length;
    for(let i=0;i<120&&s.creatures.length===initial;i++){
      const before=s;
      if(s.sessions[0]?.workStartedTick!==null&&s.sessions[0])seenWork=true;
      s=tick(s);
      if(before.sessions[0]?.workTicks===39){
        for(const old of before.creatures){const c=s.creatures.find(c=>c.id===old.id)!;
          expect(c.needs!.fatigue-old.needs!.fatigue).toBeCloseTo(config.needs.perMinute.fatigue/60+2/40,10);
          expect(c.needs!.loneliness-old.needs!.loneliness).toBeLessThan(0);
          expect(c.breeding.clutches).toBe(1);expect(c.breeding.cooldownUntil).toBe(s.clock.tick+3600);
        }
      }
    }
    expect(seenWork).toBe(true);expect(s.creatures).toHaveLength(3);expect(s.sessions).toHaveLength(0);
    const egg=s.creatures[2];expect(egg.stage).toBe('egg');expect(egg.age).toBe(0);expect(s.lineage[2].parentIds).toEqual(s.creatures.slice(0,2).map(c=>c.id));
    expect(s.organisms[2].parents).toEqual(s.creatures.slice(0,2).map(c=>c.organismId));
    expect(startCourtship(s,s.creatures[0],s.creatures[1],navigationTerrain(s.world))).toBe(false);
    expect(advanceTicks(s,100).creatures).toHaveLength(3);expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('uses unchanged 5a crossover then mutation and records complete mutation entries',()=>{
    const s=ready(),[a,b]=s.creatures,copy=structuredClone(s);
    const crossed=crossover(a.genome,b.genome,s.rng.genetics),expected=mutate(crossed.genome,crossed.rng);
    const reordered=structuredClone(s);reordered.creatures[0].id='c_00000099';
    const preview=previewOffspring(reordered,reordered.creatures[1].id,reordered.creatures[0].id,s.rng.genetics);
    expect(preview.parents).toEqual([reordered.creatures[0].id,reordered.creatures[1].id]);expect(preview.genome).toEqual(expected.genome);
    const next=conceive(s,a,b);expect(next.creatures[2].genome).toEqual(expected.genome);expect(next.rng.genetics).toBe(expected.rng);
    expect(next.lineage[2].mutations).toEqual(expected.mutations);
    // conceive is an internal resolver; public tick/commands clone its parents before calling it.
    expect(copy.creatures[0].genome).toEqual(next.creatures[0].genome);
  });
  it('inherits alleles at the same locus, no XP, drift or learned food/activity preference',()=>{
    const s=ready();for(const c of s.creatures){c.xp.run=5000;c.foodPreferences.sunapple={learnedMean:1,samples:5};c.lastFiveFoods=Array(5).fill('sunapple');c.lastMeal={fruit:'sunapple',tick:0,preference:1,reward:1};c.personalityDrift.boldness=.2;}
    const originalMutate=inheritance.mutate;
    const spy=vi.spyOn(inheritance,'mutate').mockImplementation((g,r)=>originalMutate(g,r,{quantitativeMutation:0,categoricalMutation:0,dominanceMutation:0}));
    try {
    const crossed=crossover(s.creatures[0].genome,s.creatures[1].genome,42);
    const child=mutate(crossed.genome,crossed.rng,{...config.genetics,quantitativeMutation:0,categoricalMutation:0,dominanceMutation:0});
    validateGenome(child.genome);
    for(const locus of loci){const alleles=locusAlleles(child.genome,locus);
      for(let p=0;p<2;p++)expect(locusAlleles(s.creatures[p].genome,locus)).toContainEqual(alleles[p]);}
    const next=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId}),egg=next.creatures[2];
    expect(Object.values(egg.xp)).toEqual(skillKeys.map(()=>0));expect(Object.values(egg.personalityDrift)).toEqual([0,0,0,0,0]);
    expect(Object.values(egg.foodPreferences).every(m=>m.learnedMean===0&&m.samples===0)).toBe(true);
    expect(Object.values(egg.activityPreferences).every(m=>m.learnedMean===0&&m.samples===0)).toBe(true);
    for(const locus of loci)for(let p=0;p<2;p++)expect(locusAlleles(s.creatures[p].genome,locus)).toContainEqual(locusAlleles(egg.genome,locus)[p]);
    expect(next.lineage[2].mutations).toEqual([]);
    expect(foodPreference(egg,'sunapple')).toBeCloseTo(config.food.genePreferenceWeight*derivePhenotype(egg.genome).fruitTaste.sunapple,14);
    } finally { spy.mockRestore(); }
  });
  it('round-trips travel and work, then eggs/cooldowns/flags, with identical continuation',()=>{
    let s=command(begin(),'encouragePair');
    expect(advanceTicks(decodeSave(encodeSave(s)),100)).toEqual(advanceTicks(s,100));
    while(s.sessions[0]?.workTicks<12)s=tick(s);
    expect(s.sessions[0]?.workTicks).toBe(12);const original=encodeSave(s);tick(s);expect(encodeSave(s)).toBe(original);
    const end=advanceTicks(s,100);expect(end.creatures.some(c=>c.stage==='egg')).toBe(true);
    expect(advanceTicks(decodeSave(original),100)).toEqual(end);
    expect(advanceTicks(decodeSave(encodeSave(end)),200)).toEqual(advanceTicks(end,200));
  });
  it('cancels immediately when blocked and aborts on urgent needs, travel timeout and elderhood',()=>{
    expect(command(begin(),'blockPair').sessions).toHaveLength(0);
    const urgent=begin();urgent.creatures[0].needs!.hunger=85;expect(tick(urgent).sessions).toHaveLength(0);
    const elder=begin();elder.creatures[0].age=stageStartAge('elder')-1;expect(tick(elder).sessions).toHaveLength(0);
    const timeout=begin();timeout.sessions[0].startedTick=0;timeout.clock.tick=61;expect(tick(timeout).sessions).toHaveLength(0);
  });
  it('exchanges the final free slot atomically and rejects another reservation or spawn',()=>{
    const s=ready(29);expect(startCourtship(s,s.creatures[0],s.creatures[1],navigationTerrain(s.world))).toBe(true);
    expect(startCourtship(s,s.creatures[2],s.creatures[3],navigationTerrain(s.world))).toBe(false);
    const next=advanceTicks(s,100);expect(next.creatures.length+next.sessions.length).toBeLessThanOrEqual(30);
    expect(next.creatures).toHaveLength(30);
  });
  it('migrates a real 5b checkpoint, preserving its exact ages, work, genome and RNG',()=>{
    const s=decodeSave(JSON.stringify(fixture));expect(s.schemaVersion).toBe(10);expect(s.settings.capacity).toBe(30);
    expect(Object.keys(s.settings)).not.toContain('auto'+'ReplaceOnDeath');expect(s.settings.extinctionRescue).toBe(true);
    for(const c of s.creatures){const old=fixture.creatures.find(o=>o.id===c.id)!;
      expect(c.breeding).toEqual({cooldownUntil:0,clutches:0,nextAttemptTick:0});expect(c.age).toBe(old.age);expect(c.currentAction).toEqual(old.currentAction);expect(c.genome).toEqual(old.genome);}
    expect(s.clock).toEqual(fixture.clock);expect(s.rng).toEqual(fixture.rng);expect(decodeSave(encodeSave(s))).toEqual(s);
  });
});

describe('player policies and seeded variety',()=>{
  it('Pair overrides preference through exclusivity, while age and needs still gate it',()=>{
    let s=ready(4);s=applyPlayerCommand(s,{kind:'pair',a:s.creatures[0].organismId,b:s.creatures[2].organismId,enabled:true});
    expect(mateCandidates(s,s.creatures[0]).find(m=>m.creatureId===s.creatures[1].id)?.reason).toBe('Exclusively paired elsewhere');
    s=command(s,'pair');
    expect(mateCandidates(s,s.creatures[0]).filter(m=>!m.reason).map(m=>m.creatureId)).toEqual([s.creatures[1].id]);
    const next=advanceTicks(s,20000);
    expect(next.lineage.some(l=>l.parentIds?.includes(s.creatures[0].id)&&l.parentIds?.includes(s.creatures[1].id))).toBe(true);
    s.creatures[0].needs!.hunger=55;expect(breedingReason(s,s.creatures[0])).toBe('Hungry');
    s=forceStage(s,s.creatures[0].id,'juvenile');expect(breedingReason(s,s.creatures[0])).toBe('Adults only');
  },30000);
  it('blocks a pair or individual across a long run, persists flags and logs exact commands',()=>{
    for(const individual of [false,true]){
      const initial=ready(),a=initial.creatures[0].organismId;
      const cmd=individual?{kind:'blockCreature' as const,id:a,enabled:true}:{kind:'blockPair' as const,a,b:initial.creatures[1].organismId,enabled:true};
      const s=applyPlayerCommand(initial,cmd),next=advanceTicks(decodeSave(encodeSave(s)),20000);
      expect(next.lineage).toHaveLength(2);expect(s.events.at(-1)?.command).toEqual(cmd);
      expect(applyPlayerCommand(initial,cmd)).toEqual(s);expect(initial.breedingRules.blockedPairs).toEqual([]);
      expect(applyPlayerCommand(s,{...cmd,enabled:false}).breedingRules[individual?'blockedIndividuals':'blockedPairs']).toEqual([]);
    }
  },30000);
  it('mate softmax has variety and selects a strongly better candidate most often',()=>{
    const s=ready(4),a=s.creatures[0];
    for(const trait of config.genes.filter(g=>g.traitGroup==='personality'||g.traitGroup==='tasteBias')){
      a.genome=setTraitValue(a.genome,trait.traitGroup,trait.trait,.1);
      s.creatures[1].genome=setTraitValue(s.creatures[1].genome,trait.traitGroup,trait.trait,.1);
      for(const c of s.creatures.slice(2))c.genome=setTraitValue(c.genome,trait.traitGroup,trait.trait,.8);
    }
    const matches=mateCandidates(s,a).filter(m=>!m.reason);expect(matches.length).toBeGreaterThan(1);
    const counts=new Map<string,number>();let rng=7654;
    for(let i=0;i<2000;i++){const choice=softmaxIndex(matches.map(m=>m.score),rng);rng=choice.rng;const id=matches[choice.index].creatureId;counts.set(id,(counts.get(id)??0)+1);}
    expect(counts.size).toBeGreaterThan(1);expect(counts.get(s.creatures[1].id)).toBeGreaterThan(1500);
  });
  it('encouragement raises accepted proposal frequency under the same seeded trials',()=>{
    let ordinary=0,nudged=0;const base=ready();base.clock.tick=1;for(const c of base.creatures)c.age++;const boosted=command(base,'encouragePair');
    for(let i=1;i<=512;i++)for(const [initial,boost] of [[base,false],[boosted,true]] as const){
      let s=structuredClone(initial);const c=s.creatures[0];c.rng=i*104729;c.breeding.nextAttemptTick=0;
      if(offerCourtship(s,c)&&startCourtship(s,c,s.creatures[1],navigationTerrain(s.world))){
        s=advanceTicks(s,100);
        if(s.lineage.some(l=>l.origin==='birth')){if(boost)nudged++;else ordinary++;}
      }
    }
    expect(nudged).toBeGreaterThan(ordinary*1.2);expect(courtCandidate(boosted,boosted.creatures[0],boosted.creatures[1]).encouragement).toBe(.15);
  });
  it('debug force breed bypasses eligibility, logs itself, preserves input and never exceeds cap',()=>{
    const s=ready();s.creatures[0].stage='juvenile';s.creatures[0].needs!.hunger=99;
    const before=JSON.stringify(s),next=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId});
    expect(next.creatures).toHaveLength(3);expect(next.events.some(e=>e.kind==='forceBreed')).toBe(true);expect(JSON.stringify(s)).toBe(before);
    const active=begin(),forced=applyPlayerCommand(active,{kind:'forceBreed',a:active.creatures[0].organismId,b:active.creatures[1].organismId});
    expect(forced.sessions).toEqual([]);expect(forced.creatures).toHaveLength(3);expect(decodeSave(encodeSave(forced))).toEqual(forced);
  });
  it('matches detailed utility exactly and rejects corrupt policies, commands and unreserved court work',()=>{
    const s=ready();const candidate=courtCandidate(s,s.creatures[0],s.creatures[1]);
    expect(utilityTotal(s.creatures[0],candidate)).toBe(scoreUtility(s.creatures[0],candidate).total);
    for(const edit of [(x:SaveState)=>{x.breedingRules.blockedPairs=[['missing','other']];},
      (x:SaveState)=>{x.creatures[0].breeding.clutches=6;},
      (x:SaveState)=>{x.creatures[0].currentAction={kind:'court',target:{...x.creatures[0].position},targetFruitId:null,path:[],workTicks:0};},
      (x:SaveState)=>{x.events[0].command={kind:'blockCreature',id:'missing',enabled:true};}]){
      const copy=structuredClone(s);edit(copy);expect(()=>decodeSave(JSON.stringify(copy))).toThrow(/Invalid save/);
    }
  });
  it('contains no live reference to the removed death mechanism',()=>{
    const source=Object.values(import.meta.glob<string>('../src/**/*',{query:'?raw',import:'default',eager:true})).join('\n');
    expect(source).not.toContain('auto'+'ReplaceOnDeath');expect(source).not.toContain('TEMP'+'ORARY');
  });
});

describe('recovery and replay',()=>{
  it.each([true,false])('extinction rescue flag %s is observed and founders are archived explicitly',enabled=>{
    let s=ready(1);s=applyPlayerCommand(s,{kind:'blockCreature',id:s.creatures[0].organismId,enabled:true});
    s.settings.extinctionRescue=enabled;s=forceStage(s,s.creatures[0].id,'elder');const next=advanceTicks(s,7200);
    expect(next.creatures).toHaveLength(enabled?config.breeding.rescueCount:0);
    expect(next.events.filter(e=>e.kind==='rescue')).toHaveLength(enabled?config.breeding.rescueCount:0);
    if(enabled)for(const l of next.lineage.slice(1)){expect(l.origin).toBe('rescue');expect(l.parentIds).toBeNull();expect(l.generation).toBe(0);}
    expect(decodeSave(encodeSave(next))).toEqual(next);
  },30000);
  it('replays 50,000 ticks with the same seed and timed player commands exactly',()=>{
    function run(){let s=createHabitat(314159);for(let i=0;i<50000;i++){
      if(i===1000||i===4000)s=applyPlayerCommand(s,{kind:'encouragePair',a:s.creatures[0].organismId,b:s.creatures[1].organismId,enabled:i===1000});
      s=tick(s);
    }return s;}
    const a=run(),b=run();expect(a).toEqual(b);expect(a.lineage.some(l=>l.origin==='birth')).toBe(true);
    expect(a.lineage.length).toBeGreaterThan(6);
  },180000);
});

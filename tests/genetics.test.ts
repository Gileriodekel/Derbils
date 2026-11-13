import { describe, expect, it } from 'vitest';
import fixture from './fixtures/milestone-4.json';
import { config, fruitKinds, tasteKeys } from '../src/data/config';
import { chromosomes, loci, locusAlleles, locusFor } from '../src/sim/genetics/catalog';
import { randomGenome, genomeSeed } from '../src/sim/genetics/founders';
import { derivePhenotype, expressLocus, skillAptitude } from '../src/sim/genetics/expression';
import { crossover, mutate } from '../src/sim/genetics/inheritance';
import { setTraitValue } from '../src/sim/genetics/edits';
import { previewOffspring } from '../src/sim/genetics/preview';
import { validateGenome } from '../src/sim/genetics/validate';
import { createSingleHabitat as createHabitat } from './helpers';
import { spawnCreature } from '../src/sim/spawn';
import { foodPreference, tasteEnjoyment } from '../src/sim/preferences';
import { advanceTicks } from '../src/sim/tick';
import { trainTick, skillCap, skillLevel, xpAtLevel } from '../src/sim/skills';
import { advanceNeeds } from '../src/sim/needs';
import { decayPersonality, personalityTrait, rewardNewActivity } from '../src/sim/personality';
import { encodeSave, decodeSave } from '../src/persistence/save';
import { validateMilestone4Save } from '../src/persistence/validate';
import type { Genome, TraitGroup } from '../src/sim/types';

function setPair(g: Genome, group: TraitGroup, trait: string, a: number, b: number, da: 0|1 = 1, db: 0|1 = 1) {
  const locus = locusFor(group,trait), h = g[locus.definition.chromosome].haplotypes;
  h[0][locus.index] = {v:a,d:da}; h[1][locus.index] = {v:b,d:db};
}

describe('catalog, founders and expression', () => {
  it('generates and expresses at least 1,000 valid seeded genomes within every catalog range', () => {
    expect(config.genes).toHaveLength(26); expect(chromosomes).toHaveLength(4);
    let rng = 947125, alleleCount = 0;
    const categories = new Set<string>(), template = createHabitat().creatures[0];
    for (let i=0;i<1000;i++) {
      const result = randomGenome(rng); rng = result.rng;
      expect(() => validateGenome(result.genome)).not.toThrow();
      const p = derivePhenotype(result.genome);
      for (const locus of loci) {
        const pair = locusAlleles(result.genome,locus); alleleCount += pair.length;
        const value = (p[locus.definition.traitGroup] as Record<string,number|string>)[locus.definition.trait];
        if (locus.definition.dominanceType === 'categorical') {
          expect(locus.definition.options!.some(o=>o.value===value)).toBe(true); categories.add(String(value));
        } else {
          const [lo,hi] = locus.definition.traitRange!;
          expect(value).toBeGreaterThanOrEqual(lo); expect(value).toBeLessThanOrEqual(hi);
          for (const a of pair) {
            expect(a.v).toBeGreaterThanOrEqual(locus.definition.founderRange![0]);
            expect(a.v).toBeLessThanOrEqual(locus.definition.founderRange![1]);
          }
        }
      }
      for (const kind of fruitKinds) {
        const c = {...template, genome:result.genome};
        expect(p.fruitTaste[kind]).toBeCloseTo(tasteEnjoyment(c,kind),14);
      }
    }
    expect(alleleCount).toBe(52000); expect(categories.size).toBe(7);
  }, 15000);
  it('is deterministic, returns advanced RNG and derives without caching mutable phenotype', () => {
    expect(randomGenome(1234)).toEqual(randomGenome(1234)); expect(randomGenome(1234).rng).not.toBe(1234);
    const g = randomGenome(1234).genome, a = derivePhenotype(g), b = derivePhenotype(g);
    expect(a).toEqual(b); a.aptitudes.run = -1; expect(derivePhenotype(g)).toEqual(b);
  });
  it('uses partial dominance, equal rank averaging and circular hue with the exact tie rule', () => {
    const q = locusFor('aptitudes','run').definition;
    expect(expressLocus({v:0,d:1},{v:255,d:0},q)).toBe(.25);
    expect(expressLocus({v:0,d:0},{v:255,d:1},q)).toBe(.75);
    expect(expressLocus({v:0,d:1},{v:255,d:1},q)).toBe(.5);
    expect(expressLocus({v:0,d:0},{v:255,d:0},q)).toBe(.5);
    const hue = locusFor('palette','baseHue').definition;
    expect(expressLocus({v:0,d:1},{v:128,d:1},hue)).toBe(0);
    expect(expressLocus({v:255,d:1},{v:0,d:1},hue)).toBeCloseTo(359.296875,10);
    expect(expressLocus({v:0,d:0},{v:128,d:1},hue)).toBeCloseTo(180,10);
  });
  it('uses intrinsic categorical dominance and catalog-order ties independently of parent order', () => {
    const pattern = locusFor('palette','pattern').definition, ears = locusFor('body','ears').definition;
    expect(expressLocus({v:'solid',d:1},{v:'spots',d:0},pattern)).toBe('solid');
    expect(expressLocus({v:'stripes',d:0},{v:'spots',d:0},pattern)).toBe('spots');
    expect(expressLocus({v:'spots',d:0},{v:'stripes',d:0},pattern)).toBe('spots');
    expect(expressLocus({v:'round',d:1},{v:'folded',d:0},ears)).toBe('round');
    expect(expressLocus({v:'folded',d:0},{v:'pointed',d:0},ears)).toBe('pointed');
  });
  it('rejects malformed JSON genomes, extra loci, invalid ranges and false categorical ranks', () => {
    const g = randomGenome(4).genome;
    for (const corrupt of [(x:Genome)=>x.aptitude.haplotypes[0].pop(),
      (x:Genome)=>{x.aptitude.haplotypes[1][0].v=256;},
      (x:Genome)=>{const l=locusFor('palette','pattern');x.palette.haplotypes[0][l.index]={v:'spots',d:1};}]) {
      const bad = structuredClone(g); corrupt(bad); expect(()=>validateGenome(bad)).toThrow(/Invalid genome/);
    }
    expect(()=>validateGenome({...g, extra:{}})).toThrow();
  });
});

describe('pure inheritance and mutation', () => {
  it('inherits at the same locus from the correct parent, with at most one cut per linked chromosome', () => {
    const a = randomGenome(21).genome, b = randomGenome(22).genome;
    for (let i=0;i<6;i++) { a.aptitude.haplotypes[0][i]={v:80,d:0};a.aptitude.haplotypes[1][i]={v:160,d:1}; }
    const before = JSON.stringify([a,b]); let rng=128411;
    for (let trial=0;trial<1000;trial++) {
      const child = crossover(a,b,rng); rng=child.rng;
      for (const locus of loci) {
        for (const h of [0,1] as const) {
          const parent = h===0?a:b;
          expect(parent[locus.definition.chromosome].haplotypes.some(p=>JSON.stringify(p[locus.index])===JSON.stringify(child.genome[locus.definition.chromosome].haplotypes[h][locus.index]))).toBe(true);
        }
      }
      const origin=child.genome.aptitude.haplotypes[0].map(a=>a.v===80?0:1);
      expect(origin.slice(1).filter((v,i)=>v!==origin[i]).length).toBeLessThanOrEqual(1);
    }
    expect(JSON.stringify([a,b])).toBe(before);
  });
  it('keeps identical homozygous parents identical with mutation disabled', () => {
    const g=randomGenome(5).genome;
    for (const chr of chromosomes) g[chr].haplotypes[1]=structuredClone(g[chr].haplotypes[0]);
    const crossed=crossover(g,g,22);
    const unmutated=mutate(crossed.genome,crossed.rng,{quantitativeMutation:0,categoricalMutation:0,dominanceMutation:0});
    expect(unmutated.genome).toEqual(g); expect(unmutated.mutations).toEqual([]);
  });
  it('matches mutation-rate bands across 520,000 allele trials, with valid bounded results and complete records', () => {
    const original=randomGenome(391).genome, before=JSON.stringify(original);
    let rng=458121, quantitative=0, categorical=0, dominance=0;
    for(let t=0;t<10000;t++) {
      const result=mutate(original,rng);rng=result.rng;validateGenome(result.genome);
      for(const record of result.mutations) {
        const locus=loci.find(l=>l.definition.chromosome===record.chromosome&&l.definition.id===record.locus)!;
        expect(record.before).toEqual(original[record.chromosome].haplotypes[record.haplotype][locus.index]);
        expect(record.after).toEqual(result.genome[record.chromosome].haplotypes[record.haplotype][locus.index]);
        if(locus.definition.dominanceType==='categorical') categorical++;
        else { if(record.before.v!==record.after.v)quantitative++;if(record.before.d!==record.after.d)dominance++; }
      }
    }
    expect(quantitative/480000).toBeGreaterThan(.0065);expect(quantitative/480000).toBeLessThan(.0095);
    expect(dominance/480000).toBeGreaterThan(.0013);expect(dominance/480000).toBeLessThan(.0027);
    expect(categorical/40000).toBeGreaterThan(.002);expect(categorical/40000).toBeLessThan(.006);
    expect(JSON.stringify(original)).toBe(before);
  });
  it('reflects quantitative boundaries, wraps hue and never changes intrinsic ranks independently', () => {
    const g=randomGenome(4).genome;
    for(const locus of loci)if(locus.definition.dominanceType!=='categorical') {
      const chr=g[locus.definition.chromosome];chr.haplotypes[0][locus.index]={v:0,d:0};chr.haplotypes[1][locus.index]={v:255,d:1};
    }
    let rng=123456;
    for(let i=0;i<100;i++){const result=mutate(g,rng,{quantitativeMutation:1,categoricalMutation:1,dominanceMutation:1});rng=result.rng;validateGenome(result.genome);}
  });
  it('keeps offspring mean aptitude between the parents and produces varied siblings', () => {
    const a=randomGenome(92).genome,b=randomGenome(251).genome;
    setPair(a,'aptitudes','run',64,96);setPair(b,'aptitudes','run',160,192);
    const low=derivePhenotype(a).aptitudes.run, high=derivePhenotype(b).aptitudes.run;
    let total=0,rng=45671;const siblings=new Set<string>();
    for(let i=0;i<2000;i++){const c=crossover(a,b,rng);rng=c.rng;total+=derivePhenotype(c.genome).aptitudes.run;siblings.add(JSON.stringify(c.genome));}
    expect(total/2000).toBeGreaterThan(low);expect(total/2000).toBeLessThan(high);expect(siblings.size).toBeGreaterThan(100);
  });
  it('reproduces recessive pattern inheritance at about 25% without mutation', () => {
    const g=randomGenome(53).genome,l=locusFor('palette','pattern');
    g.palette.haplotypes[0][l.index]={v:'solid',d:1};g.palette.haplotypes[1][l.index]={v:'spots',d:0};
    let rng=457121,spots=0;
    for(let i=0;i<5000;i++){const c=crossover(g,g,rng);rng=c.rng;if(derivePhenotype(c.genome).palette.pattern==='spots')spots++;}
    expect(spots/5000).toBeGreaterThan(.22);expect(spots/5000).toBeLessThan(.28);
  });
});

describe('gene effects, tools and persistence', () => {
  it('changes training gain in the direction of the only changed aptitude gene', () => {
    const low=createHabitat().creatures[0], high=structuredClone(low);
    low.genome=setTraitValue(low.genome,'aptitudes','run',.1);high.genome=setTraitValue(high.genome,'aptitudes','run',.9);
    for(let t=0;t<240;t++){trainTick(low,'run',1,t);trainTick(high,'run',1,t);}
    expect(high.xp.run).toBeGreaterThan(low.xp.run);expect(skillAptitude(high,'run')).toBeGreaterThan(skillAptitude(low,'run'));
  });
  it('changes initial fruit preferences solely through taste genes and keeps learning experiential', () => {
    const a=createHabitat().creatures[0],b=structuredClone(a);
    for(const key of tasteKeys){a.genome=setTraitValue(a.genome,'tasteBias',key,key==='sweet'?1:0);b.genome=setTraitValue(b.genome,'tasteBias',key,key==='earthy'?1:0);}
    expect(a.foodPreferences).toEqual(b.foodPreferences);expect(foodPreference(a,'sunapple')).toBeGreaterThan(foodPreference(b,'sunapple'));
    expect(foodPreference(a,'vinefig')).toBeLessThan(foodPreference(b,'vinefig'));
  });
  it('uses gene baseline plus experiential drift, decays it, and limits new-activity rewards', () => {
    const c=createHabitat().creatures[0];c.genome=setTraitValue(c.genome,'personality','boldness',.5);
    expect(personalityTrait(c,'boldness')).toBe(.5);rewardNewActivity(c,0);expect(personalityTrait(c,'boldness')).toBeCloseTo(.505);
    rewardNewActivity(c,1);expect(personalityTrait(c,'boldness')).toBeCloseTo(.505);
    decayPersonality(c);expect(c.personalityDrift.boldness).toBeCloseTo(.005*Math.exp(-1/(20*1200)),14);
    const curious=structuredClone(c), quiet=structuredClone(c);
    curious.genome=setTraitValue(curious.genome,'personality','curiosity',1);quiet.genome=setTraitValue(quiet.genome,'personality','curiosity',0);
    advanceNeeds(curious,0);advanceNeeds(quiet,0);expect(curious.needs!.boredom).toBeGreaterThan(quiet.needs!.boredom);
  });
  it('spawns random and supplied genomes atomically with a hard cap and no derived state', () => {
    const s=createHabitat(),g=randomGenome(74).genome,before=encodeSave(s);
    const next=spawnCreature(s,g);expect(next.creatures[1].genome).toEqual(g);expect(next.rng.genetics).toBe(s.rng.genetics);
    g.aptitude.haplotypes[0][0].v=0;expect(next.creatures[1].genome).not.toEqual(g);expect(encodeSave(s)).toBe(before);
    let full=spawnCreature(next);while(full.creatures.length<config.lifecycle.capacity)full=spawnCreature(full);expect(spawnCreature(full)).toBe(full);
    expect(()=>spawnCreature(s,{} as Genome)).toThrow();
    for(const c of full.creatures){expect(c).not.toHaveProperty('phenotype');expect(c).not.toHaveProperty('innateBias');expect(c).not.toHaveProperty('innateAptitude');}
  });
  it('previews canonical parents without creating a creature or drawing live RNG', () => {
    const s=spawnCreature(createHabitat()),[a,b]=s.creatures,before=encodeSave(s);
    const preview=previewOffspring(s,a.id,b.id,19283);
    expect(previewOffspring(s,b.id,a.id,19283)).toEqual(preview);validateGenome(preview.genome);
    expect(preview.phenotype).toEqual(derivePhenotype(preview.genome));expect(encodeSave(s)).toBe(before);
    expect(()=>previewOffspring(s,a.id,a.id)).toThrow();
  });
  it('migrates a real Milestone 4 checkpoint deterministically while preserving XP, needs, memories, clocks and RNG', () => {
    const s=decodeSave(JSON.stringify(fixture)),c=s.creatures[0],old=fixture.creatures[0];
    expect(s.schemaVersion).toBe(10);expect(s.rng).toEqual(fixture.rng);expect(s.clock).toEqual(fixture.clock);
    expect(c.needs).toEqual(old.needs);expect(c.xp).toEqual(old.xp);expect(c.foodPreferences).toEqual(old.foodPreferences);
    expect(c.trainingTicks).toEqual(old.trainingTicks);expect(c.currentAction).toEqual(old.currentAction);
    expect(c.genome).toEqual(randomGenome(genomeSeed(Number(s.saveId.slice(6)),c.id)).genome);
    expect(decodeSave(JSON.stringify(fixture))).toEqual(s);
    expect(advanceTicks(decodeSave(encodeSave(s)),1000)).toEqual(advanceTicks(s,1000));
  });
  it('preserves high-XP progress when a random migration genome would impose a lower cap', () => {
    const data:unknown=structuredClone(fixture);validateMilestone4Save(data);
    data.creatures[0].innateAptitude.run=1;data.creatures[0].xp.run=xpAtLevel(95,'run')+1;
    const s=decodeSave(JSON.stringify(data)),c=s.creatures[0];
    expect(c.xp.run).toBe(data.creatures[0].xp.run);expect(skillLevel(c,'run')).toBe(95);expect(skillCap(c,'run')).toBeGreaterThanOrEqual(96);
    expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('replays 5,000 ticks identically with genomes and checkpoints', () => {
    const initial=spawnCreature(spawnCreature(createHabitat(92371)));
    const a=advanceTicks(initial,5000),b=advanceTicks(initial,5000);expect(a).toEqual(b);
    const mid=advanceTicks(initial,1731);expect(advanceTicks(decodeSave(encodeSave(mid)),3269)).toEqual(a);
  });
  it('has no active taste/aptitude placeholder paths anywhere in src', () => {
    const sources = import.meta.glob<string>('../src/**/*', { query: '?raw', import: 'default', eager: true });
    for (const [path, source] of Object.entries(sources).filter(([p]) => !p.startsWith('../src/persistence/') && p !== '../src/sim/types.ts')) {
      expect(source, path).not.toMatch(/innateBias|innateAptitude|createFoodExperience|createSkillExperience/);
    }
  });
});

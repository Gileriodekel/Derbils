import { beforeAll, describe, expect, it } from 'vitest';
import fixture from './fixtures/milestone-3.json';
import { config, skillKeys } from '../src/data/config';
import { createSingleHabitat as createHabitat } from './helpers';
import { spawnCreature } from '../src/sim/spawn';
import { advanceTicks, tick } from '../src/sim/tick';
import { skillCap, skillLevel, xpAtLevel, xpGain, trainTick, applySkillBonuses, setDebugSkill } from '../src/sim/skills';
import { decide, makeCandidate } from '../src/sim/brain';
import { navigationTerrain } from '../src/sim/food-sources';
import { trainingApproaches } from '../src/sim/training';
import { completeMeal } from '../src/sim/preferences';
import { decodeSave, encodeSave } from '../src/persistence/save';
import { setTraitValue } from '../src/sim/genetics/edits';
import { derivePhenotype } from '../src/sim/genetics/expression';
import { randomGenome, genomeSeed } from '../src/sim/genetics/founders';
import type { SaveState } from '../src/sim/types';

const three = () => spawnCreature(spawnCreature(createHabitat(271828)));

describe('skill formulas and work', () => {
  it('inverts every XP threshold, caps and preserves within-level XP', () => {
    const c = createHabitat().creatures[0]; c.genome = setTraitValue(c.genome,'aptitudes','run',1);
    for (let level = 0; level <= 100; level++) {
      c.xp.run = xpAtLevel(level, 'run'); expect(skillLevel(c, 'run')).toBe(level);
      if (level > 0) { c.xp.run -= .001; expect(skillLevel(c, 'run')).toBe(level - 1); }
      if (level < 100) expect(xpAtLevel(level + 1, 'run') - xpAtLevel(level, 'run')).toBe(10 + 4 * level);
    }
    c.genome = setTraitValue(c.genome,'aptitudes','run',.5); expect(skillCap(c, 'run')).toBe(70);
    expect(xpAtLevel(25, 'run')).toBe(1450);
  });
  it('uses every exact §6 factor and gates unhealthy training', () => {
    const c = createHabitat().creatures[0]; c.genome = setTraitValue(c.genome,'aptitudes','run',.5); c.mood = 1;
    expect(xpGain(c, 'run', 1, 0)).toBe(1);
    c.xp.run = xpAtLevel(35, 'run'); c.mood = 0;
    c.practiceTicks.run = 240; c.skillBonuses.run = { amount: .25, expiresTick: 600 };
    expect(xpGain(c, 'run', .75, 0)).toBeCloseTo(.75 * (1 - .75 * .5 ** 2) * .875 * 1.25 * .5, 14);
    expect(xpGain(c, 'run', 1, 600)).toBeCloseTo((1 - .75 * .5 ** 2) * .875 * .5, 14);
    for (const [need, value] of [['hunger',85], ['fatigue',85], ['stress',90]] as const) {
      const fresh = createHabitat().creatures[0]; fresh.needs![need] = value;
      expect(xpGain(fresh, 'run', 1, 0)).toBe(0);
    }
  });
  it('higher aptitude yields more XP over identical forced work and high levels gain more slowly', () => {
    const low = createHabitat().creatures[0], high = structuredClone(low);
    low.genome = setTraitValue(low.genome,'aptitudes','run',.1); high.genome = setTraitValue(high.genome,'aptitudes','run',.9);
    for (let t = 0; t < 300; t++) { trainTick(low, 'run', 1, t); trainTick(high, 'run', 1, t); }
    expect(high.xp.run).toBeGreaterThan(low.xp.run);
    const advanced = structuredClone(high), novice = structuredClone(high);
    advanced.xp.run = xpAtLevel(60, 'run'); novice.xp.run = 0;
    expect(xpGain(advanced, 'run', 1, 0)).toBeLessThan(xpGain(novice, 'run', 1, 0));
  });
  it('resets daily practice only at the boundary, and preserves the last eligible bonus interval', () => {
    const s = createHabitat(); s.clock.tick = 1199;
    const c = s.creatures[0]; c.age += s.clock.tick; c.genome = setTraitValue(c.genome,'aptitudes','run',.5); c.practiceTicks.run = 240; c.trainingTicks.run = 240;
    c.skillBonuses.run = { amount: .25, expiresTick: 1200 };
    c.currentAction = { kind: 'train_run', target: {...c.position}, targetFruitId: null, path: [], workTicks: 0 };
    const next = tick(s), n = next.creatures[0];
    expect(n.xp.run).toBeGreaterThan(0); expect(n.skillBonuses.run).toBeUndefined();
    expect(n.trainingTicks.run).toBe(241); expect(n.practiceTicks.run).toBe(0);
    expect(next.creatures[0].currentAction?.workStart).toBeDefined();
    expect(encodeSave(next)).toBeTruthy();
  });
  it('has no XP in transit and learns only completed training rewards', () => {
    const s = createHabitat(), c = s.creatures[0];
    c.currentAction = { kind:'train_run', target:{x:c.position.x+1,y:c.position.y}, targetFruitId:null,
      path:[{x:c.position.x+1,y:c.position.y}], workTicks:0 };
    const arrival = advanceTicks(s, 2);
    expect(arrival.creatures[0].xp.run).toBe(0);
    const worked = advanceTicks(arrival, config.actions.train_run.workTicks);
    expect(worked.creatures[0].xp.run).toBeGreaterThan(0);
    expect(worked.creatures[0].activityPreferences.run.samples).toBe(1);
  });
});

describe('training choices, fruit and debug commands', () => {
  it('a healthy bored creature trains nearby; urgent self-care still wins', () => {
    const s = createHabitat(1), c = s.creatures[0];
    c.needs = { hunger:0, fatigue:0, boredom:100, loneliness:0, stress:0 }; c.rng = 1;
    const terrain = navigationTerrain(s.world), spot = s.world.items.find(i => i.skill === 'run')!;
    c.position = trainingApproaches(spot, terrain, s.world.width, s.world.height)[0];
    c.genome = setTraitValue(c.genome,'aptitudes','run',1);
    expect(makeCandidate(s,c,'train_run',c.position).growthInterest).toBe(1);
    decide(s,c,terrain); expect(c.currentAction?.kind.startsWith('train_')).toBe(true);
    c.needs!.fatigue = 95; decide(s,c,terrain); expect(c.currentAction?.kind).toBe('sleep');
    c.needs!.fatigue = 0; c.needs!.hunger = 95; c.currentAction = null;
    s.world.looseFruit = [{id:'f_00000001', kind:'sunapple', ...c.position, droppedTick:0}];
    decide(s,c,terrain); expect(s.creatures[0].currentAction?.kind).toBe('eat');
  });
  it('activates the exact catalog bonus, with direct stat XP, and ignores empty effects', () => {
    const c = createHabitat().creatures[0];
    const before = structuredClone(c.xp); completeMeal(c,'sunapple',10);
    expect(c.xp.run).toBe(before.run+config.dynasty.plants.berryXp); expect(c.skillBonuses.run).toEqual({amount:.25,expiresTick:610});
    const noBonus = structuredClone(c); noBonus.skillBonuses = {};
    expect(xpGain(c,'run',1,10)).toBeCloseTo(xpGain(noBonus,'run',1,10)*1.25,14);
    applySkillBonuses(noBonus,{skillBonuses:{},skillBonusDurationTicks:600},10);
    expect(noBonus.skillBonuses).toEqual({});
    completeMeal(c,'sparkcherry',20); expect(c.skillBonuses.run?.expiresTick).toBe(610);
    completeMeal(c,'sunapple',30); expect(c.skillBonuses.run?.expiresTick).toBe(630);
    expect(Object.keys(c.skillBonuses)).not.toContain('climb');
  });
  it('sets debug values atomically, validates caps, and leaves the original unchanged', () => {
    const s = createHabitat(), id = s.creatures[0].id, before = encodeSave(s);
    const changed = setDebugSkill(s,id,'run',45,.5);
    expect(skillLevel(changed.creatures[0],'run')).toBe(45);
    expect(encodeSave(s)).toBe(before);
    expect(() => setDebugSkill(s,id,'run',99,.5)).toThrow();
    expect(decodeSave(encodeSave(changed))).toEqual(changed);
  });
});

describe('schema 3 checkpoints', () => {
  it('deterministically migrates the real Milestone 3 fixture, preserving previous state', () => {
    const s = decodeSave(JSON.stringify(fixture)), c = s.creatures[0];
    expect(s.schemaVersion).toBe(10); expect(s.clock).toEqual(fixture.clock); expect(s.rng).toEqual(fixture.rng);
    expect(c.rng).toBe(fixture.creatures[0].rng); expect(c.needs).toEqual(fixture.creatures[0].needs);
    expect(c.foodPreferences).toEqual(fixture.creatures[0].foodPreferences); expect(c.xp).toEqual(fixture.creatures[0].xp);
    expect(derivePhenotype(c.genome)).toEqual(derivePhenotype(randomGenome(genomeSeed(Number(fixture.saveId.slice(6)),c.id)).genome));
    expect(decodeSave(JSON.stringify(fixture))).toEqual(s);
  });
  it('continues identically from a mid-training checkpoint including work-start reward and boost', () => {
    let s = three();
    for (let t = 0; t < 5000; t++) {
      s = tick(s);
      if (s.creatures.some(c => c.currentAction?.kind.startsWith('train_') && c.currentAction.workTicks >= 3)) {
        expect(advanceTicks(decodeSave(encodeSave(s)),500)).toEqual(advanceTicks(s,500)); return;
      }
    }
    throw new Error('No training found');
  });
});

describe('30,000-tick training habitat', () => {
  let final: SaveState; const errors: string[] = []; let maxHunger = 0, maxFatigue = 0;
  beforeAll(() => {
    let s = three();
    for(const c of s.creatures)for(const taste of ['sweet','tart','earthy'] as const)c.genome=setTraitValue(c.genome,'tasteBias',taste,1);
    for (let t = 0; t < 30000; t++) {
      const prior = s; s = tick(s);
      for (const c of s.creatures) {
        maxHunger = Math.max(maxHunger,c.needs!.hunger); maxFatigue = Math.max(maxFatigue,c.needs!.fatigue);
        const before = prior.creatures.find(p => p.id === c.id)!;
        for (const skill of skillKeys) {
          if (!Number.isFinite(c.xp[skill]) || c.xp[skill] < before.xp[skill] || c.xp[skill] > xpAtLevel(skillCap(c,skill),skill)
            || skillLevel(c,skill) < skillLevel(before,skill) || skillLevel(c,skill) > skillCap(c,skill)) errors.push(`${c.id}:${skill}:${t}`);
        }
      }
    }
    final = s;
  }, 60000);
  it('has monotonic, bounded XP and levels throughout (including 20,000 ticks)', () => { expect(errors).toEqual([]); });
  it('survives without starvation/exhaustion and trains every skill in at least one creature', () => {
    expect(maxHunger).toBeLessThan(config.needs!.urgentThreshold); expect(maxFatigue).toBeLessThan(config.needs!.urgentThreshold);
    for (const skill of skillKeys) expect(final.creatures.some(c => c.xp[skill] > 0)).toBe(true);
    expect(decodeSave(encodeSave(final))).toEqual(final);
  });
  it('develops different top skills with at least a two-level lead in two creatures', () => {
    const tops = final.creatures.map(c => [...skillKeys].sort((a,b) => c.xp[b]-c.xp[a]));
    const specialists = final.creatures.filter((c,i) => skillLevel(c,tops[i][0]) - skillLevel(c,tops[i][1]) >= 2);
    expect(specialists.length).toBeGreaterThanOrEqual(2);
    expect(new Set(specialists.map(c => [...skillKeys].sort((a,b)=>c.xp[b]-c.xp[a])[0])).size).toBeGreaterThanOrEqual(2);
  });
});

import { describe, expect, it } from 'vitest';
import fixture from './fixtures/milestone-7a.json';
import { config, lifeStages, skillKeys } from '../src/data/config';
import { computeAppearance } from '../src/sim/appearance/derive';
import { setAppearanceGenes } from '../src/sim/appearance/edits';
import { advanceAppearanceModifiers, applyFruitAppearance } from '../src/sim/appearance/modifiers';
import { randomGenome } from '../src/sim/genetics/founders';
import { setTraitValue } from '../src/sim/genetics/edits';
import { locusFor } from '../src/sim/genetics/catalog';
import { crossover } from '../src/sim/genetics/inheritance';
import { createHabitat } from '../src/sim/habitat';
import { advanceTicks, tick } from '../src/sim/tick';
import { xpAtLevel } from '../src/sim/skills';
import { applyPlayerCommand } from '../src/sim/commands';
import { buildScene } from '../src/render/scene/build';
import { appearanceLayout } from '../src/render/scene/layout';
import { sceneBounds, transformPoint } from '../src/render/scene/bounds';
import { createSceneCache, appearanceHash } from '../src/render/cache';
import { animationPose, animateScene } from '../src/render/animation';
import { createAppearanceView } from '../src/render/appearance-view';
import { gallerySamples } from '../src/render/gallery';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { Creature, Proportion } from '../src/sim/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
const template = createHabitat(7123, 1).creatures[0];
function maxed(genome = template.genome): Creature {
  let g = clone(genome);
  for (const skill of skillKeys) g = setTraitValue(g, 'aptitudes', skill, 1);
  return { ...clone(template), genome: g, xp: Object.fromEntries(skillKeys.map(s => [s, xpAtLevel(70, s)])) as Creature['xp'] };
}
const derive = (c: Creature) => computeAppearance(c, config);

describe('gene palette and proportions', () => {
  it('resolves readable finite colors across 1,000 seeded genomes and every stage', () => {
    let rng = 17;
    for (let i = 0; i < 1000; i++) {
      const result = randomGenome(rng); rng = result.rng;
      for (const stage of lifeStages) for (const color of Object.values(derive({ ...template, genome: result.genome, stage }).baseColors)) {
        expect(color.hue).toBeGreaterThanOrEqual(0); expect(color.hue).toBeLessThan(360);
        expect(color.saturation).toBeGreaterThanOrEqual(config.appearance.palette.saturationBounds[0]);
        expect(color.saturation).toBeLessThanOrEqual(config.appearance.palette.saturationBounds[1]);
        expect(color.lightness).toBeGreaterThanOrEqual(config.appearance.palette.lightnessBounds[0]);
        expect(color.lightness).toBeLessThanOrEqual(config.appearance.palette.lightnessBounds[1]);
        expect(Object.values(color).every(Number.isFinite)).toBe(true);
      }
    }
  }, 30000);
  it('keeps palette/proportions independent of learned parts and part presence independent of visible genes', () => {
    const trained = maxed(), plain = { ...clone(trained), xp: { ...template.xp } };
    expect(derive(trained).baseColors).toEqual(derive(plain).baseColors);
    expect(derive(trained).proportions).toEqual(derive(plain).proportions);
    expect(derive(trained).parts).not.toEqual(derive(plain).parts);
    const world = createHabitat(10, 1); world.creatures[0] = trained;
    const changed = setAppearanceGenes(world, trained.id, { baseHue: 150, accentHue: 280, width: .65, height: 1.5, head: .7, limb: 1.7, tail: .5 });
    expect(derive(changed.creatures[0]).parts).toEqual(derive(trained).parts);
    expect(derive(changed.creatures[0]).baseColors).not.toEqual(derive(trained).baseColors);
    expect(derive(changed.creatures[0]).proportions).not.toEqual(derive(trained).proportions);
    expect(changed.creatures[0].xp).toEqual(trained.xp); expect(changed.rng).toEqual(world.rng);
    expect(() => setAppearanceGenes(world, trained.id, { width: 99 })).toThrow();
  });
  it('keeps body joints inside the body ellipse and the complete rig bounded at all 32 proportion extremes', () => {
    const keys = Object.keys(config.appearance.proportions) as Proportion[];
    for (let bits = 0; bits < 32; bits++) {
      const c = maxed();
      for (const [i, key] of keys.entries()) c.genome = setTraitValue(c.genome, 'body', key, config.appearance.proportions[key][(bits >> i) & 1]);
      const spec = derive(c), layout = appearanceLayout(spec, config);
      for (const p of spec.parts) {
        const slot = config.appearance.slots.find(s => s.id === p.slot)!;
        if (slot.attachTo) continue; // Tail fans attach to tail tips, shadows to the feet.
        const root = layout.root(p.partId);
        expect((root.x / (11 * spec.proportions.width)) ** 2 + (root.y / (13 * spec.proportions.height)) ** 2).toBeLessThanOrEqual(1);
      }
      for (const facing of ['left', 'right'] as const) {
        const commands = buildScene(spec, facing, config), b = sceneBounds(commands);
        expect(Math.hypot(Math.max(Math.abs(b.minX), Math.abs(b.maxX)), Math.max(Math.abs(b.minY), Math.abs(b.maxY))))
          .toBeLessThanOrEqual(config.appearance.frame.maximumRadius);
        const shaft = commands.find(c => c.partId === 'stamina-tail')!, fan = commands.find(c => c.partId === 'swim-tail-fan')!;
        const tier = config.appearance.parts.find(p => p.id === 'stamina-tail')!.tiers.at(-1)!;
        const tip = transformPoint(tier.attachments!.tip, shaft.transform);
        expect(fan.transform.e).toBeCloseTo(tip.x); expect(fan.transform.f).toBeCloseTo(tip.y);
        const animated = sceneBounds(animateScene(commands, animationPose(17, 'extreme', 'idle', 1, false)));
        expect(Math.hypot(Math.max(Math.abs(animated.minX), Math.abs(animated.maxX)), Math.max(Math.abs(animated.minY), Math.abs(animated.maxY))))
          .toBeLessThanOrEqual(config.appearance.frame.maximumRadius);
      }
    }
  });
  it('expresses all four clipped gene patterns and three static ear variants without changing part sets', () => {
    const world = createHabitat(901, 1), reference = derive(world.creatures[0]).parts;
    for (const pattern of ['solid', 'spots', 'stripes', 'marbled'] as const) for (const ears of ['round', 'pointed', 'folded'] as const) {
      const c = setAppearanceGenes(world, world.creatures[0].id, { pattern, ears }).creatures[0], spec = derive(c);
      expect(spec.parts).toEqual(reference); expect(spec.pattern.kind).toBe(pattern); expect(spec.ears).toBe(ears);
      const commands = buildScene(spec, 'right', config), patterns = commands.filter(c => c.partId === 'body-pattern');
      expect(patterns.length > 0).toBe(pattern !== 'solid'); expect(patterns.every(c => c.clip !== undefined)).toBe(true);
      expect(commands.find(c => c.partId === 'base-ears')!.primitive).toBe(ears === 'round' ? 'ellipse' : 'polygon');
    }
  });
  it('has heritable palette/proportion values and varied siblings across 100 seeded crosses', () => {
    const a = clone(template.genome), b = clone(template.genome);
    for (const group of ['palette', 'body'] as const) for (const def of config.genes.filter(g => g.traitGroup === group && g.dominanceType !== 'categorical')) {
      const { index } = locusFor(group, def.trait);
      const low = def.dominanceType === 'circular' ? 0 : 64, step = 32;
      a[def.chromosome].haplotypes[0][index] = { v: low, d: 1 }; a[def.chromosome].haplotypes[1][index] = { v: low + step, d: 1 };
      b[def.chromosome].haplotypes[0][index] = { v: low + step, d: 1 }; b[def.chromosome].haplotypes[1][index] = { v: low + step * 2, d: 1 };
    }
    const A = derive({ ...template, genome: a }), B = derive({ ...template, genome: b }), signatures = new Set<string>();
    let rng = 767;
    for (let i = 0; i < 100; i++) {
      const crossed = crossover(a, b, rng); rng = crossed.rng;
      const child = derive({ ...template, genome: crossed.genome });
      for (const key of Object.keys(A.proportions) as Proportion[]) {
        expect(child.proportions[key]).toBeGreaterThanOrEqual(A.proportions[key]); expect(child.proportions[key]).toBeLessThanOrEqual(B.proportions[key]);
      }
      expect(child.baseColors.primary.hue).toBeGreaterThanOrEqual(A.baseColors.primary.hue);
      expect(child.baseColors.primary.hue).toBeLessThanOrEqual(B.baseColors.primary.hue);
      signatures.add(appearanceHash(child));
    }
    expect(signatures.size).toBeGreaterThan(1);
  });
  it('distinguishes at least the configured fraction of 200 seeded founders', () => {
    const hashes = new Set<string>(); let rng = 235;
    for (let i = 0; i < 200; i++) { const result = randomGenome(rng); rng = result.rng; hashes.add(appearanceHash(derive({ ...template, genome: result.genome }))); }
    expect(hashes.size).toBeGreaterThanOrEqual(Math.ceil(200 * config.appearance.gallery.distinctFraction));
  });
  it('composes exact elder desaturation and genome-colored eggs', () => {
    const adult = derive(template), elder = derive({ ...template, stage: 'elder' }), egg = derive({ ...template, stage: 'egg' });
    for (const role of Object.keys(adult.baseColors) as (keyof typeof adult.baseColors)[]) {
      expect(elder.baseColors[role].saturation).toBeCloseTo(adult.baseColors[role].saturation * config.lifecycle.stages.elder.saturationMultiplier);
      expect(egg.baseColors[role]).toEqual(adult.baseColors[role]);
    }
    const other = { ...template, genome: randomGenome(8).genome, stage: 'egg' as const };
    expect(derive(other).baseColors).not.toEqual(egg.baseColors); expect(egg.parts).toEqual([]);
  });
});

function mealState() {
  const s = createHabitat(37, 1), c = s.creatures[0];
  const fruit={id:`f_${String(s.counters.fruit++).padStart(8,'0')}`,kind:'sunapple' as const,...c.position,droppedTick:0};s.world.looseFruit.push(fruit);
  c.position = { x: fruit.x, y: fruit.y };
  c.currentAction = { kind: 'eat', target: { ...c.position }, targetFruitId: fruit.id, path: [], workTicks: config.actions.eat.workTicks - 1 };
  return s;
}
describe('acquired modifiers, schema 7 and deterministic replay', () => {
  it('adds one exact configured modifier when a real meal completes, without changing DNA', () => {
    const s = mealState(), genome = clone(s.creatures[0].genome), next = tick(freeze(s)), modifier = next.creatures[0].appearanceModifiers[0];
    expect(modifier.sourceFruit).toBe('sunapple'); expect(modifier.magnitude).toBe(config.appearance.modifiers.strengthPerFruit);
    expect(modifier.expiresTick).toBe(1 + config.appearance.modifiers.expiryDays * config.clock.dayTicks);
    expect(next.creatures[0].genome).toEqual(genome); expect(s.creatures[0].appearanceModifiers).toEqual([]);
    expect(derive(next.creatures[0]).baseColors.primary).not.toEqual(derive(s.creatures[0]).baseColors.primary);
  });
  it('enforces count/stack/strength caps, exponential half-life, expiry and a no-effect fruit', () => {
    const c = clone(template), settings = config.appearance.modifiers;
    const noEffect = { ...config.fruit.sunapple, appearance: { ...config.fruit.sunapple.appearance, tintRgb: null } };
    applyFruitAppearance(c, noEffect, 'sunapple', 0); expect(c.appearanceModifiers).toEqual([]);
    applyFruitAppearance(c, config.fruit.sunapple, 'sunapple', 0);
    for (let tick = 1; tick <= config.clock.dayTicks; tick++) advanceAppearanceModifiers(c, tick);
    expect(c.appearanceModifiers[0].magnitude).toBeCloseTo(settings.strengthPerFruit / 2, 12);
    const firstRgb = [...c.appearanceModifiers[0].rgb];
    applyFruitAppearance(c, config.fruit.dewberry, 'dewberry', config.clock.dayTicks);
    const incoming = [0x70, 0xb9, 0xe5].map(n => n / 255);
    for (const [i, value] of c.appearanceModifiers[0].rgb.entries()) expect(value).toBeCloseTo(.8 * firstRgb[i] + .2 * incoming[i], 12);
    for (let i = 0; i < 100; i++) applyFruitAppearance(c, config.fruit.prismpear, 'prismpear', config.clock.dayTicks);
    expect(c.appearanceModifiers).toHaveLength(1); expect(c.appearanceModifiers[0].magnitude).toBe(settings.maximumStrength);
    advanceAppearanceModifiers(c, c.appearanceModifiers[0].expiresTick); expect(c.appearanceModifiers).toEqual([]);
  });
  it('keeps acquired modifiers out of an actual offspring and hatchling', () => {
    let s = createHabitat(55, 2);
    for (const c of s.creatures) applyFruitAppearance(c, config.fruit.spiralfruit, 'spiralfruit', 0);
    s = applyPlayerCommand(s, { kind: 'forceBreed', a: s.creatures[0].organismId, b: s.creatures[1].organismId });
    const id = s.creatures.at(-1)!.id; expect(s.creatures.at(-1)!.appearanceModifiers).toEqual([]);
    s = advanceTicks(s, config.lifecycle.stages.egg.durationTicks);
    expect(s.creatures.find(c => c.id === id)!.appearanceModifiers).toEqual([]);
  });
  it('migrates a genuine 7a checkpoint without advancing time, RNG or retained progression', () => {
    const migrated = decodeSave(JSON.stringify(fixture));
    expect(migrated.schemaVersion).toBe(11); expect(migrated.clock).toEqual(fixture.clock); expect(migrated.rng).toEqual(fixture.rng);
    for(const [i,c]of migrated.creatures.entries()){
      const old=fixture.creatures[i];expect(c.age).toBe(old.age);expect(c.organismId).toBe(old.organismId);expect(c.genome.shape).toEqual(old.genome.shape);expect(c.genome.temperament).toEqual(old.genome.temperament);
      for(const skill of skillKeys)expect(c.xp[skill]).toBe(old.xp[skill]);expect(c.foodPreferences).toEqual(old.foodPreferences);expect(c.appearanceModifiers).toEqual([]);
    }
  });
  it('round-trips active modifiers and continued simulation, excluding render-only fields', () => {
    const mid = advanceTicks(tick(mealState()), 417), saved = encodeSave(mid), loaded = decodeSave(saved);
    expect(loaded.creatures[0].appearanceModifiers.length).toBeGreaterThan(0);
    expect(derive(loaded.creatures[0])).toEqual(derive(mid.creatures[0]));
    expect(advanceTicks(loaded, 1000)).toEqual(advanceTicks(mid, 1000));
    expect(saved).not.toMatch(/"(?:appearanceSpec|animationPose|reducedMotion|sceneCache)"/);
    const bad = clone(mid); bad.creatures[0].appearanceModifiers[0].magnitude = 100;
    expect(() => encodeSave(bad)).toThrow();
  });
  it('replays 50,000 ticks exactly including acquired modifiers', () => {
    const start = mealState(), first = advanceTicks(start, 50000), second = advanceTicks(start, 50000);
    expect(first).toEqual(second); expect(start.creatures[0].appearanceModifiers).toEqual([]);
  }, 120000);
});

describe('render-only animation and bounded scene cache', () => {
  it('is deterministic, phase-separated, bounded and disabled by reduced motion', () => {
    const tuning = config.appearance.animation;
    for (const mood of [-1, 0, 1]) for (const behavior of ['idle', 'sleep', 'eat', 'court']) for (let i = 0; i < 500; i++) {
      const tick = i / 30, pose = animationPose(tick, 'c_00000001', behavior, mood, false);
      expect(animationPose(tick, 'c_00000001', behavior, mood, false)).toEqual(pose);
      expect(Math.abs(pose.offsetY)).toBeLessThanOrEqual(tuning.bobPixels);
      expect(Math.abs(pose.rotation)).toBeLessThanOrEqual(tuning.tiltRadians);
      expect(Math.abs(pose.tailRotation)).toBeLessThanOrEqual(tuning.swayRadians);
      expect(pose.scaleX).toBeGreaterThanOrEqual(1 - tuning.breathing); expect(pose.scaleX).toBeLessThanOrEqual(1 + tuning.breathing);
      expect(pose.eyeScaleY).toBeGreaterThanOrEqual(tuning.closedEyeScale); expect(pose.eyeScaleY).toBeLessThanOrEqual(1);
    }
    expect(animationPose(1, 'a', 'idle', 1, false)).not.toEqual(animationPose(1, 'b', 'idle', 1, false));
    expect(animationPose(1, 'a', 'idle', 1, true)).toEqual({ scaleX: 1, scaleY: 1, offsetY: 0, rotation: 0, tailRotation: 0, eyeScaleY: 1 });
  });
  it('does not mutate cached scenes or sim state and on/off runs produce the same state', () => {
    let s = mealState(); const initial = clone(s);
    for (let i = 0; i < 500; i++) {
      s = tick(s);
      if (i % 30 === 0) {
        const commands = freeze(buildScene(derive(s.creatures[0]), 'right', config));
        const before = JSON.stringify(commands);
        animateScene(commands, animationPose(i, s.creatures[0].id, 'idle', s.creatures[0].mood, false));
        expect(JSON.stringify(commands)).toBe(before);
      }
    }
    expect(s).toEqual(advanceTicks(initial, 500));
  });
  it('returns identical immutable scenes, separates facing/scale buckets and evicts within its bound', () => {
    const cache = createSceneCache(), spec = derive(maxed());
    expect(cache.get(spec, 'right')).toEqual(buildScene(spec, 'right', config));
    expect(cache.get(clone(spec), 'right', 1.01)).toBe(cache.get(spec, 'right', 1));
    expect(cache.statistics().misses).toBe(1);
    expect(cache.get(spec, 'left')).toEqual(buildScene(spec, 'left', config));
    cache.get(spec, 'left', 2); expect(cache.statistics().misses).toBe(3);
    for (let i = 0; i < config.appearance.cache.maximum + 10; i++) {
      const changed = clone(spec); changed.baseColors.primary.hue = (spec.baseColors.primary.hue + i + 1) % 360;
      cache.get(changed, 'right'); expect(cache.statistics().size).toBeLessThanOrEqual(config.appearance.cache.maximum);
    }
    const before = cache.statistics().misses; cache.get(spec, 'right'); expect(cache.statistics().misses).toBe(before + 1);
  });
  it('reuses unchanged appearance across snapshots and keeps gallery comparisons controlled', () => {
    const view = createAppearanceView(), c = maxed(), seed = 98123;
    expect(view.spec(c, seed)).toBe(view.spec(c, seed));
    const first = view.scene(c, seed, 'right', 1);
    expect(view.scene(c, seed, 'right', 1)).toBe(first);
    expect(view.scene({ ...c, position: { x: 1, y: 1 } }, seed, 'right', 1)).toBe(first);
    expect(view.statistics().misses).toBe(1);
    const samples = gallerySamples(), progression = samples.filter(s => s.preset === 'progression');
    expect(progression).toHaveLength(config.appearance.gallery.progression.length);
    for (const sample of progression) {
      expect(sample.creature.genome).toEqual(progression[0].creature.genome);
      expect(sample.appearanceSeed).toBe(progression[0].appearanceSeed);
    }
    const family = samples.filter(s => s.preset === 'family');
    expect(family).toHaveLength(2 + config.appearance.gallery.offspring);
    for (const sample of family) {
      expect(sample.creature.xp).toEqual(family[0].creature.xp);
      expect(derive(sample.creature).parts).toEqual(derive(family[0].creature).parts);
    }
    expect(new Set(family.map(s => appearanceHash(derive(s.creature)))).size).toBeGreaterThan(1);
  });
  it('removes the temporary palette path and keeps the pure module boundaries', () => {
    const source = Object.entries(import.meta.glob<string>('../src/**/*',{ query: '?raw', import: 'default', eager: true }))
      .filter(([name]) => !name.endsWith('.css')).map(([,value]) => value).join('\n');
    expect(source).not.toContain('lightness' + 'Offset'); expect(source).not.toContain('Milestone 7b replaces');
    const pure = Object.values(import.meta.glob<string>('../src/render/scene/**/*.ts',{ query:'?raw',import:'default',eager:true })).join('\n');
    expect(pure).not.toMatch(/\b(?:window|document|Canvas\w*|DOM\w*)\b/);
  });
});

import { describe, expect, it } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { config, lifeStages, skillKeys } from '../src/data/config';
import { computeAppearance } from '../src/sim/appearance/derive';
import { buildScene } from '../src/render/scene/build';
import { sceneBounds, transformPoint } from '../src/render/scene/bounds';
import { sceneToSvg } from '../src/render/svg';
import { gallerySamples } from '../src/render/gallery';
import { createHabitat } from '../src/sim/habitat';
import { setDebugSkill } from '../src/sim/skills';
import { applyPlayerCommand } from '../src/sim/commands';
import { setTraitValue } from '../src/sim/genetics/edits';
import { locusFor } from '../src/sim/genetics/catalog';
import { advanceTicks } from '../src/sim/tick';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { Config, Creature, Skill } from '../src/sim/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
const samples = gallerySamples();
const base = samples[0].creature;
const all = samples.find(s => s.id === 'all')!.creature;
const appearance = (c: Creature, data: Config = config) => computeAppearance(c, data);
const scene = (c: Creature) => buildScene(appearance(c), 'right', config);

describe('pure skill appearance derivation', () => {
  it('derives identical detached data without mutating frozen inputs or random streams', () => {
    const c = freeze(clone(all)), data = freeze(clone(config)), before = JSON.stringify([c, data]);
    const result = computeAppearance(c, data);
    expect(computeAppearance(c, data)).toEqual(result);
    expect(JSON.stringify([c, data])).toBe(before);
    result.parts[0].tier = -1; result.baseColors.primary.hue = -1;
    expect(computeAppearance(c, data)).toEqual(appearance(all));
  });
  it('has only threshold-zero base parts at level zero and uses the exact spec thresholds', () => {
    const parts = appearance(base).parts;
    expect(parts.some(p => p.partId === 'base-body')).toBe(true);
    expect(parts.some(p => p.partId === 'base-head')).toBe(true);
    expect(parts.every(p => p.tier === 0)).toBe(true);
    for (const part of config.appearance.parts) {
      if (!part.skill) continue;
      const world = createHabitat(7001, 1);
      expect(part.tiers.every(t => [0, 10, 25, 45, 70].includes(t.levelThreshold))).toBe(true);
      let previousTier = -1;
      for (let level = 0; level <= config.skillCatalog[part.skill].levelCap; level++) {
        const c = setDebugSkill(world, world.creatures[0].id, part.skill, level, 1).creatures[0];
        const actual = appearance(c).parts.find(p => p.partId === part.id);
        const expected = part.tiers.filter(t => t.levelThreshold <= level).at(-1);
        expect(actual?.tier, `${part.id} at ${level}`).toBe(expected?.tier);
        expect(actual?.tier ?? -1).toBeGreaterThanOrEqual(previousTier); previousTier = actual?.tier ?? -1;
      }
    }
  });
  it('recomputes parts when a debug edit lowers a level', () => {
    const world = createHabitat(7001, 1), id = world.creatures[0].id;
    const trained = setDebugSkill(world, id, 'fly', 70, 1);
    expect(appearance(trained.creatures[0]).parts.some(p => p.sourceSkill === 'fly')).toBe(true);
    expect(appearance(setDebugSkill(trained, id, 'fly', 0, 1).creatures[0]).parts.some(p => p.sourceSkill === 'fly')).toBe(false);
  });
  it('responds to visible genes while food memories remain independent', () => {
    const c = clone(all), expected = appearance(c);
    for (const trait of ['width', 'height', 'head', 'limb', 'tail']) c.genome = setTraitValue(c.genome, 'body', trait, 1);
    for (const trait of ['accentHue', 'eyeHue']) {
      const locus = locusFor('palette', trait);
      for (const h of c.genome[locus.definition.chromosome].haplotypes) h[locus.index].v = 0;
    }
    expect(appearance(c).parts).toEqual(expected.parts);
    expect(appearance(c).baseColors).not.toEqual(expected.baseColors);
    expect(appearance(c).proportions).not.toEqual(expected.proportions);
    const changed = appearance(c);
    c.lastFiveFoods = ['sunapple', 'prismpear']; c.foodPreferences.sunapple = { learnedMean: 1, samples: 100 };
    expect(appearance(c)).toEqual(changed);
  });
  it('covers every skill and every tier with valid bounded primitive data', () => {
    const data = config.appearance;
    expect(new Set(data.parts.map(p => p.id)).size).toBe(data.parts.length);
    for (const skill of skillKeys) expect(data.parts.some(p => p.skill === skill)).toBe(true);
    for (const part of data.parts) {
      expect(part.skill === null || skillKeys.includes(part.skill)).toBe(true);
      expect(data.slots.some(s => s.id === part.slot)).toBe(true);
      expect(part.tiers.length).toBeGreaterThan(0);
      for (const tier of part.tiers) {
        expect(tier.recipe.length).toBeGreaterThan(0);
        for (const recipe of tier.recipe) {
          expect(['ellipse', 'polygon', 'path']).toContain(recipe.primitive);
          expect(recipe.scale.x).toBeGreaterThan(0); expect(recipe.scale.y).toBeGreaterThan(0);
          expect(recipe.fillRole === null || recipe.fillRole in data.palette.roles).toBe(true);
          expect(recipe.strokeRole === null || recipe.strokeRole in data.palette.roles).toBe(true);
          if (recipe.primitive === 'ellipse') { expect(recipe.radius.x).toBeGreaterThan(0); expect(recipe.radius.y).toBeGreaterThan(0); }
          else expect(recipe.points.length).toBeGreaterThanOrEqual(recipe.primitive === 'polygon' ? 3 : 2);
          expect(JSON.stringify(recipe)).not.toMatch(/NaN|Infinity/);
        }
      }
    }
  });
  it('resolves shared slots by highest tier, then configured skill order, then catalog order', () => {
    const data = clone(config), part = data.appearance.parts.find(p => p.id === 'fly-front-wing')!;
    const competitor = { ...clone(part), id: 'competing-swim-wing', skill: 'swim' as Skill };
    data.appearance.parts.push(competitor);
    expect(appearance(all, data).parts.find(p => p.slot === part.slot)?.partId).toBe(competitor.id);
    data.appearance.parts.reverse();
    expect(appearance(all, data).parts.find(p => p.slot === part.slot)?.partId).toBe(competitor.id);
    competitor.tiers = competitor.tiers.filter(t => t.tier < 4);
    expect(appearance(all, data).parts.find(p => p.slot === part.slot)?.partId).toBe(part.id);
  });
  it('does not inherit acquired parts: an actual two-parent egg hatches with only base parts', () => {
    let state = createHabitat(8080, 2);
    for (const id of state.creatures.map(c => c.id)) for (const skill of skillKeys) state = setDebugSkill(state, id, skill, 100, 1);
    expect(appearance(state.creatures[0]).parts.some(p => p.tier === 4)).toBe(true);
    state = applyPlayerCommand(state, { kind: 'forceBreed', a: state.creatures[0].organismId, b: state.creatures[1].organismId });
    const childId = state.creatures.at(-1)!.id;
    state = advanceTicks(state, config.lifecycle.stages.egg.durationTicks);
    const child = state.creatures.find(c => c.id === childId)!;
    expect(child.stage).toBe('baby'); expect(Object.values(child.xp).every(xp => xp === 0)).toBe(true);
    expect(appearance(child).parts.map(p => [p.partId, p.tier])).toEqual(appearance(base).parts.map(p => [p.partId, p.tier]));
  });
  it('preserves derived appearance through the current save and continued replay', () => {
    let state = createHabitat(9001, 1);
    state = setDebugSkill(state, state.creatures[0].id, 'fly', 70, 1);
    state = advanceTicks(state, 31);
    const saved = encodeSave(state), loaded = decodeSave(saved);
    expect(loaded.schemaVersion).toBe(11);
    expect(appearance(loaded.creatures[0])).toEqual(appearance(state.creatures[0]));
    expect(saved).not.toMatch(/"(?:appearanceSpec|parts|baseColors|renderTransitions|bodyScale)"/);
    expect(advanceTicks(loaded, 50)).toEqual(advanceTicks(state, 50));
  });
});

describe('numeric scene construction and exports', () => {
  it('builds identical detached commands without mutating frozen appearance/config', () => {
    const spec = freeze(appearance(all)), data = freeze(clone(config)), before = JSON.stringify([spec, data]);
    const first = buildScene(spec, 'right', data);
    expect(buildScene(spec, 'right', data)).toEqual(first);
    expect(JSON.stringify([spec, data])).toBe(before);
    first[0].transform.e = -999;
    expect(buildScene(spec, 'right', data)).toEqual(scene(all));
  });
  it('follows configured layer order, stably within every part and across runs', () => {
    for (const sample of samples) {
      const commands = scene(sample.creature);
      expect(commands.map(c => c.layerIndex)).toEqual(commands.map(c => c.layerIndex).sort((a, b) => a - b));
      expect(scene(sample.creature)).toEqual(commands);
      for (const c of commands) expect(c.layerIndex).toBe(config.appearance.layerOrder.indexOf(config.appearance.slots.find(s => s.id === c.slot)!.layer));
    }
  });
  it('has finite coordinates and remains inside the configured radius for max and 200 random skill sets', () => {
    const creatures = [...samples.slice(0, 8)];
    for (let seed = 1; seed <= 10; seed++) creatures.push(...gallerySamples(seed).filter(s => s.preset === 'random'));
    expect(creatures).toHaveLength(208);
    function finite(value: unknown) {
      if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
      else if (value && typeof value === 'object') Object.values(value).forEach(finite);
    }
    for (const sample of creatures) for (const facing of ['left', 'right'] as const) {
      const commands = buildScene(appearance(sample.creature), facing, config); finite(commands);
      const b = sceneBounds(commands);
      expect(Math.hypot(Math.max(Math.abs(b.minX), Math.abs(b.maxX)), Math.max(Math.abs(b.minY), Math.abs(b.maxY))))
        .toBeLessThanOrEqual(config.appearance.frame.maximumRadius + 1e-9);
    }
  });
  it('uniformly fits an oversized recipe without changing part order or the appearance spec', () => {
    const data = clone(config), spec = appearance(all), before = clone(spec);
    const wing = data.appearance.parts.find(p => p.id === 'fly-front-wing')!;
    for (const recipe of wing.tiers.at(-1)!.recipe) { recipe.scale.x *= 20; recipe.scale.y *= 20; }
    const commands = buildScene(spec, 'right', data), bounds = sceneBounds(commands);
    expect(Math.hypot(Math.max(Math.abs(bounds.minX), Math.abs(bounds.maxX)), Math.max(Math.abs(bounds.minY), Math.abs(bounds.maxY))))
      .toBeCloseTo(data.appearance.frame.maximumRadius - data.appearance.animation.boundsMargin, 9);
    expect(spec).toEqual(before);
    expect(commands.map(c => c.partId)).toEqual(scene(all).map(c => c.partId));
  });
  it('applies lifecycle scales to the complete rig and renders dormant stages without skill parts', () => {
    const adult = scene(base);
    for (const stage of lifeStages) {
      const c = { ...clone(base), stage }, spec = appearance(c), commands = scene(c);
      expect(spec.bodyScale).toBe(config.lifecycle.stages[stage].scale);
      if (stage === 'egg' || stage === 'cocoon') {
        expect(spec.parts).toEqual([]); expect(commands.every(c => c.partId === stage)).toBe(true);
      } else commands.forEach((c, i) => {
        for (const key of ['a', 'b', 'c', 'd', 'e', 'f'] as const) expect(c.transform[key]).toBeCloseTo(adult[i].transform[key] * spec.bodyScale, 12);
      });
    }
  });
  it('keeps all learned parts on elders and desaturates every role', () => {
    const adult = appearance(all), elder = appearance({ ...all, stage: 'elder' });
    expect(elder.parts).toEqual(adult.parts);
    for (const role of ['primary', 'secondary', 'accent', 'shade'] as const) {
      expect(elder.baseColors[role].saturation).toBeCloseTo(adult.baseColors[role].saturation * config.lifecycle.stages.elder.saturationMultiplier);
    }
  });
  it('mirrors every resolved x coordinate around the body while preserving layers and y', () => {
    const spec = appearance(all), right = buildScene(spec, 'right', config), left = buildScene(spec, 'left', config);
    right.forEach((c, i) => {
      expect(left[i].partId).toBe(c.partId); expect(left[i].layerIndex).toBe(c.layerIndex);
      for (const p of [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: -1, y: 1 }]) {
        const a = transformPoint(p, c.transform), b = transformPoint(p, left[i].transform);
        expect(b.x).toBeCloseTo(-a.x, 12); expect(b.y).toBeCloseTo(a.y, 12);
      }
    });
  });
  it('attaches the swim fan to each current stamina tail tip', () => {
    for (const tier of config.appearance.parts.find(p => p.id === 'stamina-tail')!.tiers) {
      const spec = appearance(all); spec.parts.find(p => p.partId === 'stamina-tail')!.tier = tier.tier;
      const commands = buildScene(spec, 'right', config), fan = commands.find(c => c.partId === 'swim-tail-fan')!;
      const shaft = commands.find(c => c.partId === 'stamina-tail')!;
      const tip = transformPoint(tier.attachments!.tip, shaft.transform);
      expect(fan.transform.e).toBeCloseTo(tip.x); expect(fan.transform.f).toBeCloseTo(tip.y);
    }
  });
  it('exports each required gallery sample as well-formed XML with one element per command', () => {
    const gallery = config.appearance.gallery;
    expect(samples).toHaveLength(2 + skillKeys.length + gallery.randomCount + gallery.progression.length + 2 + gallery.offspring + 4);
    expect(samples.filter(s => s.preset === 'random')).toHaveLength(gallery.randomCount);
    for (const sample of samples) {
      const commands = buildScene(computeAppearance(sample.creature, config, sample.appearanceSeed), 'right', config), errors: string[] = [];
      const svg = sceneToSvg(commands, config.appearance.frame.maximumRadius, config.appearance.gallery.cellPixels, `${sample.label} <&"'`);
      const parsed = new DOMParser({ onError: (_level, message) => errors.push(message) }).parseFromString(svg, 'image/svg+xml');
      expect(errors).toEqual([]); expect(parsed.documentElement!.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(Array.from(parsed.getElementsByTagName('*')).filter(e => e.hasAttribute('data-part'))).toHaveLength(commands.length);
      expect(parsed.getElementsByTagName('title')[0].textContent).toBe(`${sample.label} <&"'`);
    }
  });
  it('does not load platform types into either pure boundary or reverse the sim dependency', async () => {
    const module = 'node:fs/promises', fs = await import(module);
    async function files(dir: string): Promise<string[]> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      return (await Promise.all(entries.map((entry: { name: string; isDirectory(): boolean }) => entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]))).flat();
    }
    for (const path of [...await files('src/sim'), ...await files('src/render/scene')]) {
      const source = await fs.readFile(path, 'utf8');
      expect(source, path).not.toMatch(/\b(?:window|document|HTML\w*Element|Canvas\w*|OffscreenCanvas|DOM\w*)\b/);
      if (path.startsWith('src/sim/')) expect(source, path).not.toMatch(/from\s+['"][^'"]*render/);
    }
  });
});

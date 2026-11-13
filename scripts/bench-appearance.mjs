import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

// Reuses the project's existing TypeScript loader; no browser or canvas is created.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom' });
try {
  const { config, skillKeys } = await server.ssrLoadModule('/src/data/config.ts');
  const { createHabitat } = await server.ssrLoadModule('/src/sim/habitat.ts');
  const { setTraitValue } = await server.ssrLoadModule('/src/sim/genetics/edits.ts');
  const { xpAtLevel } = await server.ssrLoadModule('/src/sim/skills.ts');
  const { computeAppearance } = await server.ssrLoadModule('/src/sim/appearance/derive.ts');
  const { buildScene } = await server.ssrLoadModule('/src/render/scene/build.ts');
  const { createSceneCache } = await server.ssrLoadModule('/src/render/cache.ts');
  const tuning = config.appearance.bench;
  const state = createHabitat(config.appearance.gallery.seed, tuning.creatures);
  const specs = state.creatures.map(c => {
    c.stage = 'adult';
    for (const skill of skillKeys) {
      c.genome = setTraitValue(c.genome, 'aptitudes', skill, 1);
      c.xp[skill] = xpAtLevel(config.skillCatalog[skill].levelCap, skill);
    }
    return computeAppearance(c, config, state.organisms.find(o => o.id === c.organismId).appearanceSeed);
  });
  const cache = createSceneCache(config), scale = config.appearance.gallery.cellPixels / (config.appearance.frame.maximumRadius * 2);
  const uncached = spec => buildScene(spec, 'right', config), cached = spec => cache.get(spec, 'right', scale);
  for (let i = 0; i < tuning.warmup; i++) for (const spec of specs) { uncached(spec); cached(spec); }
  function measure(build) {
    let total = 0, worst = 0, calls = 0;
    for (let i = 0; i < tuning.iterations; i++) for (const spec of specs) {
      const start = performance.now(); build(spec); const elapsed = performance.now() - start;
      total += elapsed; worst = Math.max(worst, elapsed); calls++;
    }
    return { averageMs: total / calls, worstMs: worst, calls };
  }
  const results = { creatures: specs.length, allPartsPerCreature: specs[0].parts.length, iterations: tuning.iterations,
    uncached: measure(uncached), cached: measure(cached), cache: cache.statistics() };
  console.log(JSON.stringify(results, null, 2));
  console.log('Timings include cache lookup and hashing; worst samples include runtime/GC scheduling. No timing assertions.');
} finally { await server.close(); }

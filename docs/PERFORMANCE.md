# Performance and longer play

This update preserves the rules, balance, fixed-tick order, random draws and save schema. It removes redundant work and replaces repeatedly decoded Derbil SVG images with reusable vector geometry. All ten supplied SVG files retain their original SHA256 hashes.

## Changes

- Exact nearest swimming-practice lookups use sorted terrain rows and binary searches. Fractional Manhattan distances, candidate limits and tie order match the complete scan.
- Genetic expressions verify allele values before reuse; normalized inherited tastes and candidate sort keys avoid repeated calculation. Learned preferences, recent meals and current needs still participate normally. Social counts reuse the original decay arithmetic without copying relationship histories.
- The live renderer compiles the supplied path groups once, retaining original outlines, colors, growth, accessories and animation transforms. Each living life owns a reusable canvas at current device-pixel/zoom resolution. Full original SVG export remains available. Egg/cocoon SVG keeps its embedded highlight.
- Per-life rendering records are pruned and reset on world replacement. Remaining SVG images use bounded entry/pixel caches. Unseen sprites/map canvases are not painted; simulation continues. Inspector layout reads are batched and expensive hidden panels defer work, while competition state stays current and unchanged journal rows are reused.

## Measurements

Two paired trials per implementation, each with 200 warmup ticks and 3,000 measured ordinary ticks per scenario. The table combines measured time across both trials. These are observational Node 24 results on shared cloud hardware; they are not timing assertions or guarantees for a player's device.

| Scenario | Before ticks/s | After ticks/s | Speedup |
|---|---:|---:|---:|
| fresh (tick 0) | 857 | 1,360 | 1.59× |
| mature (tick 300,000) | 744 | 1,324 | 1.78× |
| oldest (tick 441,374) | 381 | 776 | 2.04× |

Every paired sample has an identical final state hash. A stronger comparison checks **all 37,000 ticks** against a frozen pre-change core:22k fresh, 5k from tick 300k and 10k from tick 441374, covering births, development and event boundaries. Every authoritative field matches at every step.

Interactive profiling of a developed 20-Derbil world exposed heavy SVG decoding and native-resource retention; an earlier session reached roughly 3.7 GB renderer RSS before it was stopped. Merely reducing image dimensions still left 258 SVG documents and about 3 frames/s in a profiled 100× sample. The reusable-path renderer reduced that sample to 29 documents and roughly 30 frames/s while achieving 100 ticks/s. This is diagnostic shared-host evidence, not a controlled total-memory guarantee. The final browser regression also checks five developed-world play/import cycles: SVG document count stays below 128, collected JS-heap growth stays below 15 MiB, and every observed sprite raster meets the current device resolution through 8× zoom.

## Long play and save compatibility

A copy of the developed world ran **800,000 additional ticks**, from 441374 to**1,241,374** (about 1,034 game days total), through the scheduled history-maintenance threshold. All 80 periodic state validations passed. The final world has 21 living Derbils, 317 detailed life records and 193 organisms; its checkpoint is672,595 bytes. These are observations of this seed, not a new population-balance acceptance.

Collected Node heap stayed between24.9 and26.8MiB across those samples and ended at25.1MiB. Study wall timings include pauses made for isolated browser tests and other work; use the paired benchmarks above for speed comparisons. Checkpoint round trip plus 1,000 further ticks matches exactly. No history-retention limit, need behavior, breeding rule or lifespan was weakened to achieve these results.

State schema 11/envelope 13 and rules 0.11.0 remain. The new presentation-only image budget changes config hash to `28cb9e0c5b93b870`, so the existing tuning-change notice can appear. The final standalone build imports the actual tick 261374 upload and exports its state exactly, advances normally, and preserves paused tick/rescue preference on reload. The original upload is untouched. No external game assets or page errors were observed.

## Verification and reproduction

- 104 focused Vitest checks pass, with one historical 200k validator study excluded. Production build and both TypeScript graphs pass. `npm run dev` starts and serves the game.
- All 10 Chromium cases pass: breeding/rescue; repeated developed-world imports/resource bounds/full-resolution8× zoom; map controls; 30 moving Derbils with delayed SVG assets; pacing; smooth movement/edges; save/recovery/mobile; and vector-art comparisons.
- 18 SVG-reference/Canvas comparisons cover normal/enlarged artwork, independent colors, developed parts, babies/elders, walking/flight poses, all three accessories and diet tint. Maximum mean absolute channel difference is0.00005964 on a0–255 scale; no pixel differs by more than 16 in any channel. Source SVG hashes match. The comparison sheet is in `.logs/performance/svg-canvas-comparison.png`.
- The historical all-feature `npm test` suite still has older map/stat/social assumptions and goldens. It was not rewritten or declared green. Standalone HTTP behavior was tested; managed Chromium blocks personal-computer `file:` QA. 1000× remains a CPU-dependent target with achieved rate shown.

```sh
npm run build
npx vitest run tests/performance-regressions.test.ts
npm run test:dynasty
npm run test:breeding
npm run test:smoke
npm run bench:long-play -- --ticks 10000
npm run bench:long-play -- --world exported-world.json --ticks 800000
```

The long-play command reads its input without modifying it and writes a report/checkpoint under `.logs`. Machine-readable evidence is in [reports/performance.json](reports/performance.json); detailed local diagnostics are in `.logs/performance/`.

Download: https://github.com/Gileriodekel/creature/raw/253bef30ca10f731880139d9646b387bbf7f0d5e/Derbil-Dynasty-Preview.zip

Published ZIP: 435,127 bytes; SHA256 `4b7d3e94c7bb4e4b9add33a326215fc3911bc2526ce66f275b9bb04795100dc5`. Hosted bytes were fetched back and matched the local package, both member CRCs and the embedded HTML. Only the previously authorized playable-preview ZIP was published; source/main was not deployed.

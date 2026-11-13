# Known issues and scope limits

## Current 0.12 SVG/gameplay preview

- No dedicated **Cup reincarnation-fruit illustration** was supplied. The reward is shown as text/count and its saved lifecycle effect works; no new illustration is claimed. All ten supplied SVGs are integrated unchanged. Normal berry artwork comes from Bush.svg/Kelp.svg.
- Current focused checks and production browser checks are documented in [DYNASTY_VERIFICATION.md](DYNASTY_VERIFICATION.md). The full historical `npm test` suite is not green: old map, six-stat, regrowth, reservation and relationship expectations still need updating, as do obsolete golden captures. The original tests remain visible.
- Breeding is improved but indefinite unassisted stability is unproven. Three current 120k-tick / 2,000-day worlds stayed between 8 and 26 with recovery enabled, producing 939–982 natural eggs and using 164–188 rescue eggs each. Existing collapsed/uploaded worlds also recovered. Peak hunger reached 100 in long runs. See [POPULATION_REPLACEMENT.md](POPULATION_REPLACEMENT.md); these outcomes do not establish unassisted survival or complete welfare balance. Older reports use their original tuning and calendars.
- Standalone HTML works in Chromium over HTTP. This environment blocks browser navigation to `file:` URLs, so personal-computer double-click behavior remains manual QA. GitHub downloads require repository access; this chat has no direct file-attachment upload tool.
- Automatic competitions resolve as field events without moving participants to the manual competition venue. They use five rounds of the existing performance resolver; an event with fewer than two eligible entrants records no winner/prize.

- Performance measurements describe shared cloud hardware, not guaranteed frame rates on every computer. The1000× setting remains a target with achieved rate displayed. Long-play and rendering evidence is in [PERFORMANCE.md](PERFORMANCE.md); the resource limits there are not a hard cap on total browser memory.

## Historical 10b notes

The prior balancing effort remains paused; its measurements below describe the old rules, not the new map and food system. See M10B_PAUSED_STATUS.md. Final five-seed balance and full soak were incomplete; no full success was claimed.

- Gameplay remains the milestone-defined subset: no gardening/building, immigration, petting/activity encouragement, mutation exposures or phenotype discovery system was added. Item prizes are donated inventory tokens; the existing fixed practice props remain usable.
- Healthy populations historically settle near the hard cap30, above the spec's12–24 mean target. The source contains provisional config-only tuning; no production tuning is accepted yet. The current golden test still references the original9b baseline and needs the documented config-only capture after acceptance.
- The browser30-adult/all-parts check measured16.7ms median,33.4ms p95,22.43ms mean and50ms worst intervals over240 frames (roughly45 average fps) on shared cloud Chromium. It does not establish60fps on a physical laptop. The Node cached appearance path averaged.027ms/call; runtime/GC affects worst samples.
- The full companion save schema was not supplied with the original document. Checked-in TypeScript contracts, historical fixtures and semantic validators define the implemented save formats. Schema11's fixture reconstructs the exact old wrapper around a real9b snapshot.
- Archive compaction intentionally discards distant detailed lives under10a's requested retention rules. Living-family/kinship facts and resource ledgers remain exact; retained-history CLI tables are not a permanent census of every old life.
- localStorage fallback can run out of room before it can retain three large revisions. A failed spare write keeps the existing verified save and offers Export. Browser storage can still be removed outside the application; portable JSON copies remain useful.
- Page-exit saving is best effort because the browser may stop asynchronous work. The previous verified autosave remains safe. A normal successful autosave interval is15seconds; the app never claims a failed write succeeded.
- FNV checksums detect accidental corruption; they are not authentication. Cross-engine bit identity for transcendental math is not promised; determinism tests use the same JavaScript engine/rules.
- Playwright uses `/usr/bin/chromium` in this environment. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` or install Chromium with Playwright on another machine. No browser test is intentionally skipped here.

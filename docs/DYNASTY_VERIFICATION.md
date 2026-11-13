# Dynasty update verification

Current 0.12 verification is in [POPULATION_REPLACEMENT.md](POPULATION_REPLACEMENT.md): 113 focused checks, all 12 Chromium cases, standalone save compatibility and three 2,000-day population studies. The relationship/calendar update is recorded in [SOCIAL_CALENDAR.md](SOCIAL_CALENDAR.md). Earlier sections below describe their original builds and timing.

The current request is `DERBIL_REQUIREMENTS.md`. Its new SVG/map/five-stat/food/social/event behavior intentionally supersedes the old six-stat map and regenerating-source specifications. Historical input fixtures and golden files were not rewritten.

## Checks and evidence

- Production build and browser/headless TypeScript checks pass.
- Eleven historical save fixtures migrate and validate. Current saves preserve all new fields and RNG state exactly. The real uploaded world at tick 336,218 (24 living Derbils) loads and continues identically after a new checkpoint.
- Dedicated `dynasty-*` tests cover five-stat schemas, retained genetic/progression data, independent colors and original SVG groups, egg/cocoon prediction, closed platform entry, mixed-mode travel, exact fractional destinations, stamina energy, individual berry ownership, sharing/theft/fights and penalty expiry, mates/breakups, Cup fruit after the natural reincarnation cap, 15/30/45/60-day scheduling, champion attractiveness, social clusters and parent direction.
- The current gameplay test compares two 5,000-tick runs and a midpoint save/load, then runs to 10,000 ticks, checking needs, autonomous eating/rest and state validity. A separate final default-population run also passed 5k replay/save continuation and 10k validation, observing walking/swimming/flight, a mate bond and a birth (12→13 living). Peak hunger was 91.18/100 and fatigue 56.394/100 in that scenario; `.logs/dynasty/gameplay-final.log` records the results.
- The broader focused run passed 105 tests in 11 files, excluding the two explicitly long 50k/600k historical studies. It includes corruption/quota/ownership/save-race tests and earlier appearance utilities. The final current run passed **35/35** tests in seven files (`.logs/dynasty/acceptance-final.log`), and another **37/37** persistence, robustness, foundation and build checks passed (`.logs/dynasty/regression-final.log`).
- Three production Chromium smoke tests pass: static subfolder loading, nonblank Canvas, selection/manual prizes, exact paused save/reload, offline return, second-tab ownership, mobile/keyboard controls, settings, and visible recovery from corrupted saves.
- An additional browser scenario imports at tick 17,999, advances one ordinary tick, verifies the Derby's five actual berries, saves/reloads exactly, inspects friend/mate/foe graph links and advances another 400 ordinary ticks. No browser errors. `.logs/dynasty/browser-gameplay.json` records results.
- The actual Cup champion from the exploratory population snapshot continued through life expiry by tick52,200, reincarnating once with identical genes and one fruit consumed; current validation and checkpoint round-trip passed. Three consecutive guaranteed reincarnations beyond the natural cap also pass targeted tests.
- The standalone HTML passes the same Derby/prize/travel/paused-save-reload browser scenario over local HTTP, with no page errors (`.logs/dynasty/standalone-gameplay.json`). The managed browser blocks `file:` navigation; double-click on a personal computer remains manual QA. The ZIP contains only that HTML and START-HERE.txt; each member's CRC and the Git-hosted ZIP's bytes were checked. Final visual checks also verify all five displayed stat names,27-locus labeling and no skill-column overlap.

## Historical suite limitations

`npm test` is **not certified green**. An additional legacy behavior run passed 151 tests and failed 33, with 16 long cases deselected. Most failures assert deliberately replaced behavior: schema 10, six/26 gene loci, 64×48 terrain, impassable water, reserved fruit, regrowing plants, dedicated training props, separate rivalry/familiarity, or migration that preserves old map routes. Two older long mating-policy cases also exceeded their 30-second budgets. New Dynasty tests exercise the replacement contracts; old assertions remain visible rather than being silently disabled.

The old 9b full-state goldens already mismatched provisional 10b tuning before this request and cannot describe 0.11 gameplay. The paused multi-million-tick 10b acceptance/soak was not resumed. Do not infer population or performance guarantees from those old results. The default `npm test` still exposes these unresolved historical test updates; use the focused command for current feature verification, not as a claim that every historical test passed.

## Balance and missing art

The larger map required faster travel and more plant replenishment. An exploratory population run formed mate bonds and eggs autonomously and fired the day-15 Derby and day-30 Derby/Cup, with valid checkpoints. It also exposed episodes of extreme hunger while pursuing distant favorite fruit. The final emergency policy shortlists the nearest reachable foods and permits reconsidering urgent journeys; its single-Derbil 10k acceptance passes. Long-term population balance is still provisional.

All ten supplied SVG files are present and unchanged, with hashes in `ASSET_HASHES.json`. Normal berries are extracted from Bush.svg's BERRY_1/BERRY_2 groups. **No dedicated Cup reincarnation-fruit illustration was supplied**; its reward is shown as text/count and has a real saved lifecycle effect. Existing ribbon/crown/pin recipes are reused, with no claim that matching new accessory SVGs were supplied.


## Map controls and flicker follow-up

Production build and both TypeScript graphs pass.49 focused tests pass across camera transforms, delayed/out-of-order image loads, old settings defaults, persistence/robustness, terrain, artwork and legacy save migration; the historical200k validator study was excluded. All5 Chromium cases pass, including wheel anchoring, drag versus click, zoomed picking, fit/keyboard controls, no page scroll during map zoom, persistent bubble hiding, paused exact save/reload and mobile layout.

A real30-Derbil simulation at10× was rendered with new SVG image loads artificially delayed120ms. All30 stayed drawn in every sampled frame over180+ frames, with positions changing. No browser page errors occurred. Standalone packaging additionally verifies wheel zoom, preference persistence and exact paused reload while served from a directory containing only the HTML; it requests no external game assets. Evidence: `.logs/dynasty/map-controls-unit.log`, `map-controls-browser.log`, `map-standalone-check.json` and `map-zoom.png`.

## Speed, smooth movement, plant density and map edges

- Reproduced the original bug: after accelerated play, selecting 1× still processed 500 ticks in about three seconds, and a pause click waited about 25 seconds. The old whole-tick backlog was being drained synchronously.
- 41 focused checks pass across pacing, route interpolation, all four map edges, full-sprite bounds, independent cached paths, 15/20 plant limits, older 40-plant checkpoints, 5k determinism/save continuation, 10k single-Derbil needs/survival, world/data contracts and offline boundaries (`.logs/pace/tests.log`). Another 34 persistence, robustness and configuration checks pass; the historical 200k study was excluded (`persistence.log`).
- Production build and both TypeScript graphs pass. All 7 Chromium cases pass (`browser.log`): all speed buttons, 1000× → 1× and pause without backlog, keyboard shortcuts, intermediate drawn positions, full images inside map bounds, earlier zoom/pan/bubble/flicker checks, and save/recovery/mobile scenarios.
- Pre/post-cache 1,000-tick states are byte-identical for seeds 271828 and 92 (`verify-cache.log`). Observed headless throughput increased from about 102 to 467 ticks/second for 12 Derbils and 84 to 196 for 30 in those short runs; these are shared-host measurements, not guaranteed device rates. The UI exposes actual rate rather than promising every computer can achieve 1000 ticks/second.
- Current schema/envelope versions are unchanged. Older paused 40-plant saves load exactly, then deterministically thin on their next tick while retaining owned food. The new tuning hash uses the existing compatibility warning. Long-term population balance and the historical full-suite limitations above remain unresolved.
- A fresh default 12-Derbil world ran 10,000 ticks with the reduced plant count. Every Derbil stayed within the map on every tick; all ten periodic checkpoint validations passed. Peak hunger was 92.46/100 and fatigue 50.42/100, with autonomous eating, rest, walking, swimming and flight. The 5k twin run and midpoint checkpoint continuation matched exactly. Population remained 12, with no mate bonds in this short sample. The actual uploaded tick-336,218 world also migrated, validated and continued identically after a checkpoint (`.logs/pace/gameplay.log`).
- The final self-contained HTML passes standalone-only HTTP checks for exact paused reload, persistent action hiding and wheel/fit controls with no external game-asset requests or page errors (`.logs/pace/standalone-check.json`). Observed standalone 1×/10×/100× rates tracked their targets; 1000× ran faster than 100× but remained CPU-limited. Returning to 1× yielded two ticks over two seconds, and pause yielded zero (`standalone-pace.log`).
- Published `Derbil-Dynasty-Preview.zip` at commit `a154597ab40ed930d12244067ff979f4dc6721db` on the authorized `playable-preview` branch. The 432,819-byte ZIP was fetched back, matched byte-for-byte and passed all member CRC checks. SHA256: `352d0b173325ad2168c3b6648f0208ae6a9e781a7d78461e430237e483ec2792`. Source/main was not deployed.


## Breeding rebalance and early genetic rescue

-95 focused tests pass:61 breeding/current-Dynasty/pacing/foundation/offline checks and34 persistence/robustness/config checks. One historical200k validator study was excluded. Production build and browser/headless TypeScript graphs pass. Full historical-suite limitations above remain.
- All8 Chromium scenarios pass, including voluntary courtship and egg laying, early rescue for related survivors, rescue-toggle persistence, speed controls, movement/bounds, map controls, delayed-image flicker, save recovery and mobile layout. Two earlier runs competed with four CPU-heavy studies and timed out collecting animation frames; rerunning with those studies paused passed without changing test assertions. All studies were then resumed and completed.
- Three300k final-config worlds survive with rescue ON, reach generations5–7 and each receive two rescue eggs. Two dip below the unchanged minimum-six population target, so the complete balance diagnostic is not claimed green. The actual uploaded save advances261374→441374, finishes20, and produces44 ordinary births with no additional rescue. Every long run has valid checkpoints/map bounds and exact save+1k continuation. See BREEDING_BALANCE.md and reports/breeding-balance.json.
- Final standalone HTML served alone imports the actual uploaded world at261374 and exports its state exactly, then advances normally. Paused reload preserves tick and disabled rescue preference. No external game assets or browser page errors occur (`.logs/breeding-balance/standalone.json`). Original upload remains untouched. Personal-computer file: operation remains manual QA; managed Chromium only permits HTTP.

- Published the breeding update ZIP at `84f0c63c393d76433b875cf7533d637c2641fa57` on the authorized `playable-preview` branch. 434,822 bytes; SHA256 `9b55c9d5cd0f0c9977d9fd181ed6f0b22ec26cedfd05ff0bc30f6a8e19868a0a`. Fetched hosted bytes match the local ZIP and all member CRCs/embedded HTML. Download: https://github.com/Gileriodekel/creature/raw/84f0c63c393d76433b875cf7533d637c2641fa57/Derbil-Dynasty-Preview.zip. Source/main was not deployed.


## Longer-play performance update

Performance update published at `253bef30ca10f731880139d9646b387bbf7f0d5e` on playable-preview: 435,127 bytes, SHA256 `4b7d3e94c7bb4e4b9add33a326215fc3911bc2526ce66f275b9bb04795100dc5`. Hosted bytes and all member CRCs/HTML verified. https://github.com/Gileriodekel/creature/raw/253bef30ca10f731880139d9646b387bbf7f0d5e/Derbil-Dynasty-Preview.zip

104 focused checks and10 Chromium scenarios pass; production build/typechecks and dev startup pass. All37,000 baseline-comparison ticks match exactly. An800,000-tick extension reaches1,241,374 with80 successful validations, stable collected heap and exact checkpoint continuation.18 pixel comparisons retain the supplied artwork and all ten SVG hashes match. The final standalone import/export preserves the actual uploaded state. Detailed measurements, reproduction and limits: PERFORMANCE.md and reports/performance.json. The historical full suite is still not green.


## Population replacement and fast-speed lighting

Published and fetched back the updated standalone ZIP on playable-preview at `57e82438dcca8b71e5e1af7cd0a2376261275173`. Size: 563,127 bytes; SHA256 `548da83737a08abbe5697479709316ca888524fbffb7a605b7a43d20f367c0cd`. Hosted bytes match the local ZIP, both member CRCs pass, and embedded HTML matches the tested standalone.

Download: https://github.com/Gileriodekel/creature/raw/57e82438dcca8b71e5e1af7cd0a2376261275173/Derbil-Dynasty-Preview.zip

113 focused checks and all 12 Chromium cases pass. Three 120k-tick / 2,000-day worlds stay between 8 and 26 with recovery enabled. Uploaded/older worlds recover, checkpoint continuation is exact, and standalone import/export plus paused reload pass with no external game assets or browser errors. No source/main deployment occurred. Schema12/envelope14 unchanged; config d8be34aea6beaac1. See POPULATION_REPLACEMENT.md for natural birth/rescue counts and limits.

GitHub account with repository access is required. No direct chat attachment uploader is available.

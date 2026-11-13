# Population replacement and fast-speed lighting

This follow-up uses rules 0.12.0, state schema 12, checkpoint envelope 14 and config hash `d8be34aea6beaac1`. Earlier balance reports describe their original builds and calendars.

The shorter lifetime exposed two breeding bottlenecks: all pairs queued for one distant nest, and each successful courtship produced only one egg. Rescue also waited too long to replace an aging cohort or a family with no overlapping, eligible breeding adults.

Pairs now meet on nearby reachable land, with independent pairs courting concurrently. Natural clutches produce up to three independently inherited eggs, with one parental clutch count and cooldown. Each active pair retains its minimum one-egg reservation; extra eggs respect the other reservations, the food-adjusted population target and hard capacity. Positive potential mates receive a small additional interest in continuing their relationship. Existing family, consent, needs and player restrictions remain.

The existing optional population recovery looks ahead to egg-to-adult time and checks overlapping future breeding windows. It can add up to four unrelated eggs every three days when replacement is endangered. Enough young/pending offspring suppress demographic assistance. It preserves the user's rescue and automatic-breeding preferences, including disabled rescue in imported saves. No nest is required or drawn. The legacy saved `Courtship.nest` field now means that pair's local land meeting point.

At 100× and 1000×, day/night cycles had become rapid whole-map flashes. Rendering now uses steady cycle-average lighting at those speeds and under reduced motion, with smooth real-time transitions. Ordinary-speed dawn/dusk remains gradual. Resizing to unchanged dimensions no longer clears the canvas. Simulation time and day/night behavior are unchanged.

## Verified population behavior

Three ordinary headless runs completed 120,000 ticks each: **2,000 game days**, with recovery enabled. Every tick was observed for population bounds; state validated every 10,000 ticks and at completion. Each final checkpoint continued identically for another 1,000 ticks after save/load.

| Seed | Minimum | Maximum | Final | Natural eggs | Rescue eggs | Reincarnations |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 271828 | 8 | 24 | 16 | 939 | 168 | 94 |
| 314159 | 8 | 24 | 17 | 941 | 188 | 104 |
| 161803 | 8 | 26 | 20 | 982 | 164 | 98 |

All three pass the existing diagnostic: no extinction, minimum/final population at least six, capacity at most 30 and continuing natural births. Most new eggs were ordinary offspring; recovery remained necessary in these runs. These results do not guarantee survival with rescue disabled, arbitrary custom tuning or deliberately blocked breeding. Peak hunger reached 100 in these long runs; this change does not establish complete welfare balance. Detailed results: [reports/population-replacement.json](reports/population-replacement.json).

Recovery checks also advanced three existing worlds for 12,000 ticks, then compared another 1,000 ticks with and without a checkpoint:

| Starting world | Initial population | Reached eight after | Natural eggs over first 12k | Rescue eggs over first 12k | Final at 13k |
| --- | ---: | ---: | ---: | ---: | ---: |
| Collapsed trial world | 3 | 240 ticks / 4 days | 98 | 24 | 24 |
| Actual uploaded tick-261,374 world | 6 | 346 ticks / 5.77 days | 92 | 16 | 23 |
| Developed tick-1,241,374 world | 21 | Already above eight | 94 | 20 | 22 |

No world became empty or exceeded capacity during the 12k observation; all checkpoint comparisons matched exactly. Original uploaded files were not changed. The recorded minima and birth/rescue counts describe the first 12k; the final population includes the extra 1k continuation check.

## Checks and compatibility

- Production build, browser/headless TypeScript checks and standalone build pass.
- 113 focused tests pass across 17 files; one historical 200k diagnostic was excluded. New regressions cover simultaneous land courtships, independent three-egg genomes, capacity reservations, checkpoint replay, earlier recovery, opt-out and lighting transitions.
- All 12 Chromium scenarios pass, including real breeding/rescue, speed changes, movement, map bounds, zoom, delayed artwork, social bands, reload and mobile controls. The final strengthened lighting test also passes: every sampled frame remains stable at 100× and 1000×, and ten unchanged resize events preserve the bitmap.
- Existing saves retain their data and settings. The final standalone HTML imports/exports the actual uploaded world exactly after its existing calendar migration, resumes play, saves and reloads the paused tick and disabled recovery preference. No external game assets or browser errors occur.
- Saved field shapes did not change. New local/concurrent courtship saves require this updated app; older validators assumed one fixed meeting site. Config mismatch notices identify the new tuning. Earlier calendar migrations remain in place.

Evidence is in `.logs/population-v2/`: `final-tests.log`, `browser.log`, `lighting-final.log`, `build-final.log`, `standalone-build.log`, `standalone.json`, `long/summary.json` and `recovery.json`. Reproduce the population study with `node scripts/breeding-study.mjs --ticks 120000 --out .logs/population-verification`.

The full historical `npm test` suite still contains obsolete expectations and is not claimed green; see [DYNASTY_VERIFICATION.md](DYNASTY_VERIFICATION.md). Standalone browser QA uses HTTP; personal-computer double-click behavior remains manual QA. GitHub downloads require repository access; this environment has no chat attachment uploader.

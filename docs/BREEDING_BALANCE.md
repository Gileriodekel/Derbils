# Breeding rebalance

These measurements describe the earlier 0.11 calendar. The 0.12 one-minute day, shorter lifetime and additional bonding changes have new results in [SOCIAL_CALENDAR.md](SOCIAL_CALENDAR.md).

The tick-261374 save had already lost its original population: its seven births could not replace 19 permanent old-age deaths. By tick109200, every surviving pair was related closely enough to be ineligible. Six rescue eggs appeared after the last death at259375. The earlier10k check was too short to measure replacement across generations.

## Changes

- Positive social interactions form more durable mate bonds (75 initial points, threshold50), reinforce them, and allow a five-day grace period before slower decay. Friendships form faster; social choices modestly favor eligible unrelated adults and existing mates.
- Mates can seek each other farther away. Two-day breeding cooldowns, stronger courtship interest and a smaller loneliness penalty improve opportunities. Adulthood, kinship, voluntary acceptance, welfare, player restrictions and the three-mate limit still apply.
- Birth pressure declines above12 Derbils and stops at a food-adjusted target of24, below the hard cap30. New worlds stagger founder ages to spread old-age deaths; imported ages and existing cooldown deadlines stay intact.
- The visible **Rescue eggs for endangered populations** option now adds two unrelated eggs when12 or fewer remain and no permitted future pair exists. It checks daily, waits12 days between assistance, counts young future partners and honors capacity. Temporary needs or player pair restrictions do not trigger it. Turning rescue off disables this assistance; turning autonomous breeding off disables early rescue. Empty worlds retain the previous six-egg rescue.

## Measured results

Final config hash: `8b3c8085d32eeec3`. Each new world ran300,000 ordinary ticks (250 game days) with rescue enabled. Births below exclude rescue eggs. Generation counts use the game's zero-based founder generation.

| World | Min / max | Mean | Final | Births | Rescue eggs | Highest generation |
|---|---:|---:|---:|---:|---:|---:|
| Seed271828 | 4 / 24 | 14.54 | 12 | 49 | 2 | 6 |
| Seed314159 | 5 / 24 | 12.33 | 17 | 45 | 2 | 7 |
| Seed161803 | 9 / 24 | 19.66 | 10 | 51 | 2 | 5 |
| Uploaded save, another180,000 ticks | 6 / 24 | 17.63 | 20 | 44 | 0 | 4 |

No final run went extinct. Each new world used one pair of rescue eggs. The uploaded save started with six Derbils at261374 and ended at441374; its original file was not edited. All runs validate state every10k ticks, check map bounds on every tick, and match an exact checkpoint round trip followed by1,000 further ticks. Machine-readable results are in [reports/breeding-balance.json](reports/breeding-balance.json).

For context, the previous rules with rescue disabled left seed271828 with one Derbil at180k, only11 births and no birth after42513. This is a diagnostic baseline, not a controlled comparison of rescue settings. An initial stronger-breeding trial filled the30 cap too often; the24 target was retained instead. A second trial still stranded a small related cohort, motivating eligible-peer preference and earlier genetic rescue.

## Limits and reproducibility

This reduces collapse risk; it does not establish indefinite stability. Two final seeds dipped to four/five and **miss the unchanged diagnostic minimum of six**. The complete three-seed `balance:breeding` command therefore reports failures for those targets even though no world went extinct. Rescue contributed to all three new-world outcomes; these are not unassisted survival claims. Peak hunger reached100 in all long runs (nonfatal under current lifecycle rules), so welfare balance also remains open.

Current verification:95 focused checks, production build/both TypeScript graphs and all8 Chromium cases pass. One historical200k validator study was excluded. The full historical `npm test` still includes obsolete map/stat/social assertions and goldens; it is not green. Standalone browser verification confirms exact import/export of the actual uploaded state, advancement, paused reload, rescue preference persistence and no external game-asset requests. Managed Chromium permits HTTP but blocks personal-computer `file:` QA.

```sh
npm run test:breeding
npm run test:dynasty
npm run test:smoke
npm run balance:breeding -- --ticks 300000
npm run balance:breeding -- --seed 271828 --ticks 300000 --unassisted
npm run balance:breeding -- --world /path/to/world.json --ticks 180000
```

Long studies use the ordinary simulation and write reports/checkpoints under `.logs/breeding-study`; they take several minutes. `--unassisted` explicitly disables rescue. The imported-world command reads its input without modifying it. Current schema11/envelope13 are unchanged and previous worlds load without resetting their histories. New founder pre-world timestamps may be rejected by older app builds; retain exports before upgrading.

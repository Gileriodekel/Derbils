# Milestone 10b balance record

The production baseline is Milestone 10a / rules .9.1. All tests use the ordinary tick with auto competitions and prizes enabled. `health.json` contains the chosen bands; their rationale is in DECISIONS.md. Targets are not widened in response to failures.

| Experiment | File/key | Before | After | Why | Disposition |
|---|---|---:|---:|---|---|
| Baseline | gameplay JSON | existing | unchanged | Measure before tuning and preserve the nine original goldens | First500k seed complete: mean28.518 fails12–24; other32 bands pass |
| Carrying-capacity candidate | breeding.json / referenceSources | 10 | 20 | Test whether the existing resource-sensitive breeding density can achieve the spec's 12–24 mean while retaining kinship and survival rules | Seed271828 passes all33 original bands at500k: mean21.740, max23, minimum diversity.7985, no rescue. Four other seeds and the old scarcity comparison are running; not shipped yet. |

Quick profile: initial two-seed run passes all 33 checks at20,000 ticks. It uses explicit early-window bands for outcomes not yet statistically measurable, rather than claiming it exercises complete lifetimes. A fresh run is part of `npm test`.

Full baseline and scenario outcomes, accepted/rejected changes, golden hash results and final measurements are appended after verification. Detailed machine-readable results are written to `.logs/m10b-balance-full.json` and full soak summaries to `.logs/m10b-soak-full.json`.

Baseline seed271828 /500k: population12–30, mean28.518, no rescue, minimum diversity.6923, mean lifespan58,421 ticks, fill92.42%, winner concentration4.92%. The baseline misses only the population mean band; do not widen it.

Reference20 diagnostic: population12–23, mean21.740, no rescue, minimum diversity.7985, mean lifespan58,447 ticks, fill95.45%, winner concentration4.76%. All six ordinary training shares remain above the later explicit per-discipline floor.

| Follow-up diagnostic | breeding.json / founderCount | 12 | 16 | Reference20's half-food world falls to2 creatures by300k; test four extra unrelated juvenile founders while keeping eight adults, the cap and all kinship/needs gates | Isolated copy; healthy1m and half-food500k reports running; not shipped |

The scarcity failure is a lineage-branch bottleneck, not lethal hunger: the gentle grazing fallback remains active. No population/diversity band or older scarcity assertion is loosened.

Reference20 additional seeds:314159 passes;161803 and141421 invoke rescue;57721 ends with insufficient alleles and no social connections. Reject reference20 alone as an overall solution.

Reference20 +founders16: the healthy diagnostic has already invoked rescue by350k (stop this rejected run early, do not claim the planned1m completed). The half-food500k diagnostic also rescues, with mean final-window population17.596. Reject the extra-founders candidate.

| Third diagnostic | breeding.json / maximumClutches | 5 | 3 | Test whether limiting repeated offspring by one life preserves unrelated family branches at the lower ceiling; keep twelve founders and all kinship gates | Isolated reference20+clutches3 copy; not shipped |

| Alternative diagnostic | breeding.json / attemptChance | .50 | .03 | Retain the full30-slot carrying ceiling as a buffer for unrelated offspring, but slow proposals to seek a12–24 mean; compare with the failed lower-ceiling approach | Isolated copy with all other production defaults; not shipped |

| Modest-capacity diagnostic | breeding.json / referenceSources | 10 | 15 | The23-slot ceiling lost lineages; test the existing25.33-slot soft ceiling without changing founders, kinship, need gates or birth quotas | Isolated copy, seeds271828/57721 first; not shipped |

Reference20 +clutches3: seed57721 completes500k but fires6 rescue eggs, failing the unchanged zero-rescue band. Reject the candidate; stop the two other partial seed runs rather than claim they completed. The half-food diagnostic also invokes rescue and has final-window mean8.739, with zero births in that last100k window.

The isolated freeze comparison changes no production code:5k ticks from30 founders produce identical hashc91b347590b3b6ea. With other studies paused, frozen/unfrozen wall times were7.855/6.459s (CPU10.081/8.626s); shared-load times were20.994/15.196s. Retain immutable validated configuration. Most observed slowdown was shared CPU contention; the study bundle removes development-module overhead separately.

AttemptChance.03: seed57721 completes500k with12 rescue eggs, minimum allele count1, positive-relationship share1 (above.995), fill.6212 and cancellation.3788. Reject it; stop seed271828's partial run at400k. The half-food500k report also rescues, with final-window mean8.309. Slower proposals do not preserve enough breeding branches under the existing exclusions.

Reference15: both500k seeds miss ONLY population mean (27182824.384;5772124.014 versus12–24). All49other checks pass on each, with no rescue. This gives a measured basis for a one-step tighter capacity setting.

| Next provisional production tuning | breeding.json / referenceSources | 10 | 16 | The15 diagnostic is healthy but narrowly above the mean band;16 gives a24.75 soft ceiling while preserving the original founders, quotas, gates and kinship | Fullfive-seed/scenario study pending; not yet accepted |
| Declared tuning version | balance.json / rulesVersion; package version | 0.9.1 | 0.10.0 | SPEC§16 requires a declared rules version for a gameplay parameter change. Schema10old-rules migration changes this metadata only; every other field/RNG/tick is preserved. | Provisional with reference16; original9b golden file preserved |

The first full-suite attempt is deliberately stopped before tuning settles (21cases passed, two-million-tick growth run incomplete at≥500k). Its log remainsm10b-tests-baseline-partial.log. Run the complete suite afresh on the final configuration; partial progress is not a full-suite pass.

Reference16 completed allfive default500k runs:314159 and141421 passall50;271828 fails rescue6/allelefloor1 (mean18.624);161803 fails fill.5303/cancel.4697 (mean23.030);57721 fails fill.6212/cancel.3788 (mean23.470). Reject. Default results are retained inm10b-balance-ref16-partial.json; the scenario cohort and just-started legacy rich/poor preflights were canceled after rejection, with no full-scenario/legacy outcome claimed.

| Next coupled diagnostic | File/key | Baseline | Trial | Why |
|---|---|---:|---:|---|
| Food response | breeding.json / referenceSources | 10 | 14 | With floor12, keep a similar default soft ceiling24.857 (previous24.75), while preserving the hard cap30 |
| Food response | breeding.json / foodCapacityFloor | 16 | 12 | Five-source soft ceiling becomes18.429 rather than20.375, giving room for the older poor/rich<.8 requirement alongside the12–24 default mean |
| Mate variety | breeding.json / candidateCount | 4 | 8 | Explore more already-eligible partners to preserve breeding branches at the lower ceiling |
| Mate variety | breeding.json / mateTemperature | .30 | .60 | Flatten the existing weighted sampler; keep kinship, readiness and compatibility gates unchanged |
| Voluntary events | competitions.json / brain.interest | .28 | .40 | Two otherwise healthy seeds underfill events; increase existing utility interest without changing eligibility, minimum entrants or the scoring formula |

This coupled candidate is provisional. No health band, welfare/kinship gate, life duration, competition cadence, formula or RNG algorithm changes. Rules remain the declared0.10.0 for the config-only10b tuning. Fullfive-seed/scenario verification and the legacy suite remain required before accepting it.

Validation of the coupled candidate:107existing breeding/social/competition/prize cases passed; two100k-tick replay cases exceeded their original180s wall-clock budgets(229.761/223.573s). Investigating exposed unused full mate ranking at zero soft density. The exact-RNG performance fix preserves complete pre-change serialized states at24,000 differential ticks across12constructed runs. Both original replays now pass in148.938/147.356s with budgets and assertions unchanged. This optimization changes no measured trajectories or health criteria. A separate128-trial RNG regression passes; types and numeric/boolean config/document coverage pass.

The coupled candidate completes all five default seeds: four pass all50checks;141421 fails rescue6 and minimum allele count1. Low-food and high-crowding scenarios pass; fast cadence ends with3creatures against minimum12; idle is still running. Reject it as a final configuration.

| Final buffer-capacity diagnostic | Baseline | Trial | Reason |
|---|---:|---:|---|
| breeding.referenceSources | 10 | 10 | Retain the30-slot healthy carrying ceiling as a buffer for unrelated branches |
| breeding.foodCapacityFloor | 16 | 12 | Preserve a stronger scarce-food response |
| breeding.densityFullUntil | 18 | 0 | Taper proposals across the entire density range rather than immediately filling every opening |
| breeding.attemptChance | .5 | .2 | Slow density-driven births moderately while preserving more low-population proposals than the rejected.03 trial |
| breeding.candidateCount / mateTemperature | 4 / .3 | 8 / .6 | Retain the wider eligible mate sampler |
| competitions.brain.interest | .28 | .4 | Retain better default event attendance |

This diagnostic runs in an isolated copy: two500k seeds(141421/271828) and the120k fast-cadence scenario. It changes no production config, stage timing, readiness or kinship gate, health band or test assertion. If these cannot meet the targets, retain robust original gameplay settings and report the population-target gap rather than ship a demonstrated extinction regression.

The retained-capacity buffer trial passes the fast-competition scenario with29final creatures and no rescue. While its full default measurements continue, a separate targeted gate trial tests whether the lower ceiling can retain enough already-unrelated partners: minimumBond15→10 and minimumCompatibility.35→.30, atop the coupled candidate. These remain voluntary social/compatibility gates, with unchanged health, adulthood, clutch, cooldown and kinship requirements. They are tunable JSON values, not a formula change. Test141421/500k and fast-cadence271828/120k first; no production edit or accepted result yet. This explicitly supersedes the prior intention to leave every compatibility threshold unchanged.

The coupled full command finishes with exit1:4/5default seeds and3/4scenarios pass. The idle500k scenario passes with final population24/no rescue. Completed results are preserved in `.logs/m10b-balance-coupled.json`; the current canonical report will be replaced only by the final-config command.

| Coupled candidate | Mean population / final scenario population | Failed checks |
|---|---:|---|
| 271828 | 23.300 | PASS |
| 314159 | 23.558 | PASS |
| 161803 | 23.422 | PASS |
| 57721 | 23.566 | PASS |
| 141421 | 17.678 | population.rescues=6, genetics.minimumAlleles=1 |
| 271828 / low-food | 13.000 | PASS |
| 314159 / high-crowding | 23.000 | PASS |
| 161803 / idle | 24.000 | PASS |
| 271828 / fast-competitions | 3.000 | finalPopulation3 <12 |

Environment interruption: the buffer trial stopped after200k on each default seed (fast scenario had completedPASS); the gate trial stopped after startup. These are incomplete default studies, not failures or passes. Completed coupled results remain intact. Resume verification from new independent processes.

Targeted acquaintance-gate trial COMPLETES:141421/500k passes all50checks(mean23.392,min population12,rescue0,min quantitative allele count6,fill.98485,hash96a46dc45e78c613); fast-cadence271828/120k also passes(final23,rescue0). Promote ONLY provisionally to production: minimumBond15→10 and minimumCompatibility.35→.30 atop the coupled candidate. Existing family, adult and welfare gates remain; all readiness conditions remain voluntary. This tunes the existing two JSON thresholds as explicitly permitted by10b, rather than changing mating logic or health bands. Full root cohort/scenarios and inherited regressions must still pass.


## Dynasty 0.11 preliminary observations

The supplied 172×92 map replaces the earlier habitat; previous 10b balance acceptance cannot transfer to these rules. Current tunables are in `dynasty.json` and `TUNING.md`. Default movement 1.2/.9/1.1 tiles/s, plant cap40 with 10-tick replenishment, berry XP30 and social mate gain25/minimum score40 are provisional defaults, not accepted multi-seed tuning.

An exploratory seed271828 run from12 founders reached22 living Derbils at tick50,000, with10 births, naturally formed mate bonds and exactly the day15 Derby/day30 Derby+Cup. Validation at each5,000-tick checkpoint passed. The run included259 creature-ticks with hunger≥99 (roughly900k observed creature-ticks), before the final urgent-nearest-food targeting fix. Do not claim those episodes were eliminated across populations. Continuing the saved population to52,200 confirmed its actual Cup champion reincarnated once, retained genes and consumed exactly one guarantee; validation and checkpoint round-trip passed.

Current single-Derbil10k acceptance observes eating/resting, bounded needs and hunger below100. Current default-population10k replay evidence is in `.logs/dynasty/gameplay-final.log`; this is a short scenario, not a new full balance/soak acceptance. Existing measurement bands and old goldens were not weakened or replaced to manufacture a pass.


## Breeding follow-up after the uploaded population collapse

Accepted as a risk-reduction update, not full balance acceptance: config `8b3c8085d32eeec3`, same schema11/envelope13. Durable/reinforced mate bonds, eligible-peer social preference, wider mate search, two-day cooldowns and reduced loneliness penalty address low replacement. Stagger initial ages only in new worlds; taper births from12 to a food-adjusted24 target. Optional early rescue introduces two unrelated eggs when12 or fewer have no future permitted pair, with a12-day cooldown.

Rejected first trial: stronger breeding repeatedly filled the30 cap. Retain24 soft target. Second trial: one unassisted180k cohort ended with seven related survivors and no birth since134856, motivating eligible-peer preference and earlier genetic rescue. Previous-rule diagnostic seed271828 ended with one at180k/11 births (rescue disabled).

Final three300k studies, rescue ON: seeds271828/314159/161803 finish12/17/10, with49/45/51 ordinary births and generations6/7/5. Every world used two rescue eggs; no extinction. Minimum populations4/5/9 mean two miss the existing six-minimum diagnostic band. Do not widen the band or claim all diagnostics passed. The uploaded save finishes20 after180k additional ticks,44 births and zero additional rescue eggs. Long-run peak hunger100 remains open. All checkpoint+1k continuations match;95 focused checks and8 browser cases pass. Detailed results, reproducibility and caveats: BREEDING_BALANCE.md and reports/breeding-balance.json.

# Tuning table

Generated with `npm run tuning:doc`. Every numeric catalog value and boolean switch is included (including geometry and test targets). Change the explicit validator contract when adding a key. Target bands are acceptance criteria, never automatic tuning.

| File | Key path | Current | Unit | Valid range | Description |
|---|---|---:|---|---|---|
| balance.json | `clock.tickSeconds` | 1 | seconds/tick (contract) | integer [1, 1] | balance: clock / tick Seconds. |
| balance.json | `clock.dayTicks` | 60 | ticks | integer [1e-12, 100000000] | balance: clock / day Ticks. |
| balance.json | `clock.foregroundSpeeds[0]` | 0 | coefficient | [0, 10000000] | balance: clock / foreground Speeds[0]. |
| balance.json | `clock.foregroundSpeeds[1]` | 1 | coefficient | [0, 10000000] | balance: clock / foreground Speeds[1]. |
| balance.json | `clock.foregroundSpeeds[2]` | 10 | coefficient | [0, 10000000] | balance: clock / foreground Speeds[2]. |
| balance.json | `clock.foregroundSpeeds[3]` | 100 | coefficient | [0, 10000000] | balance: clock / foreground Speeds[3]. |
| balance.json | `clock.foregroundSpeeds[4]` | 1000 | coefficient | [0, 10000000] | balance: clock / foreground Speeds[4]. |
| balance.json | `clock.maxTicksPerFrame` | 100 | ticks | integer [1, 100000000] | balance: clock / max Ticks Per Frame. |
| balance.json | `needs.perMinute.hunger` | 12 | need points/minute | [-100, 100] | balance: needs / per Minute / hunger. |
| balance.json | `needs.perMinute.fatigue` | 1.2 | need points/minute | [-100, 100] | balance: needs / per Minute / fatigue. |
| balance.json | `needs.perMinute.boredom` | 9 | need points/minute | [-100, 100] | balance: needs / per Minute / boredom. |
| balance.json | `needs.perMinute.loneliness` | 1.6 | need points/minute | [-100, 100] | balance: needs / per Minute / loneliness. |
| balance.json | `needs.perMinute.stress` | -0.8 | need points/minute | [-100, 100] | balance: needs / per Minute / stress. |
| balance.json | `needs.newborn.hunger` | 25 | need deficit points | [0, 100] | balance: needs / newborn / hunger. |
| balance.json | `needs.newborn.fatigue` | 15 | need deficit points | [0, 100] | balance: needs / newborn / fatigue. |
| balance.json | `needs.newborn.boredom` | 10 | need deficit points | [0, 100] | balance: needs / newborn / boredom. |
| balance.json | `needs.newborn.loneliness` | 10 | need deficit points | [0, 100] | balance: needs / newborn / loneliness. |
| balance.json | `needs.newborn.stress` | 0 | need deficit points | [0, 100] | balance: needs / newborn / stress. |
| balance.json | `needs.urgentThreshold` | 85 | need deficit points | [0, 100] | balance: needs / urgent Threshold. |
| balance.json | `needs.eatMinimumHunger` | 15 | need deficit points | [0, 100] | balance: needs / eat Minimum Hunger. |
| balance.json | `needs.sleepExitFatigue` | 15 | need deficit points | [0, 100] | balance: needs / sleep Exit Fatigue. |
| balance.json | `needs.sleepLonelinessMultiplier` | 0.5 | ratio | [0, 1] | balance: needs / sleep Loneliness Multiplier. |
| balance.json | `needs.nightFatigueMultiplier` | 1.25 | coefficient | [0, 10000000] | balance: needs / night Fatigue Multiplier. |
| balance.json | `needs.curiosityBoredomBase` | 0.75 | coefficient | [0, 10000000] | balance: needs / curiosity Boredom Base. |
| balance.json | `needs.curiosityBoredomWeight` | 0.5 | ratio | [0, 1] | balance: needs / curiosity Boredom Weight. |
| balance.json | `needs.sociabilityLonelinessBase` | 0.25 | coefficient | [0, 10000000] | balance: needs / sociability Loneliness Base. |
| balance.json | `needs.sociabilityLonelinessWeight` | 0.75 | ratio | [0, 1] | balance: needs / sociability Loneliness Weight. |
| balance.json | `mood.needWeights.hunger` | 0.3 | weighted fraction | [0, 1] | balance: mood / need Weights / hunger. |
| balance.json | `mood.needWeights.fatigue` | 0.3 | weighted fraction | [0, 1] | balance: mood / need Weights / fatigue. |
| balance.json | `mood.needWeights.boredom` | 0.15 | weighted fraction | [0, 1] | balance: mood / need Weights / boredom. |
| balance.json | `mood.needWeights.loneliness` | 0.15 | weighted fraction | [0, 1] | balance: mood / need Weights / loneliness. |
| balance.json | `mood.needWeights.stress` | 0.1 | weighted fraction | [0, 1] | balance: mood / need Weights / stress. |
| balance.json | `mood.responseTicks` | 60 | ticks | integer [1e-12, 100000000] | balance: mood / response Ticks. |
| balance.json | `mood.valenceDecayTicks` | 120 | ticks | integer [1e-12, 100000000] | balance: mood / valence Decay Ticks. |
| balance.json | `mood.labelThreshold` | 0.25 | mood | [-1, 1] | balance: mood / label Threshold. |
| balance.json | `mood.initial` | 0.5 | mood | [-1, 1] | balance: mood / initial. |
| balance.json | `ai.decisionIntervalTicks` | 5 | ticks | integer [1e-12, 100000000] | balance: ai / decision Interval Ticks. |
| balance.json | `ai.minimumWorkCommitTicks` | 8 | ticks | integer [0, 100000000] | balance: ai / minimum Work Commit Ticks. |
| balance.json | `ai.switchMargin` | 0.12 | coefficient | [0, 10000000] | balance: ai / switch Margin. |
| balance.json | `ai.temperature` | 0.08 | softmax temperature | [1e-12, 10] | balance: ai / temperature. |
| balance.json | `ai.candidateCounts.food` | 4 | coefficient | [0, 10000000] | balance: ai / candidate Counts / food. |
| balance.json | `ai.candidateCounts.perSkill` | 2 | coefficient | [0, 10000000] | balance: ai / candidate Counts / per Skill. |
| balance.json | `ai.pathAttempts` | 3 | coefficient | [0, 10000000] | balance: ai / path Attempts. |
| balance.json | `ai.wanderRadiusTiles` | 3 | coefficient | [0, 10000000] | balance: ai / wander Radius Tiles. |
| balance.json | `ai.defaultPersonalityFit` | 0.5 | coefficient | [0, 10000000] | balance: ai / default Personality Fit. |
| balance.json | `ai.utility.needs` | 2 | utility coefficient | [0, 10] | balance: ai / utility / needs. |
| balance.json | `ai.utility.personality` | 0.18 | utility coefficient | [0, 10] | balance: ai / utility / personality. |
| balance.json | `ai.utility.preference` | 0.12 | utility coefficient | [0, 10] | balance: ai / utility / preference. |
| balance.json | `ai.utility.growth` | 0.12 | utility coefficient | [0, 10] | balance: ai / utility / growth. |
| balance.json | `ai.utility.social` | 0.1 | utility coefficient | [0, 10] | balance: ai / utility / social. |
| balance.json | `ai.utility.travelPenalty` | 0.15 | utility coefficient | [0, 10] | balance: ai / utility / travel Penalty. |
| balance.json | `ai.utility.fatiguePenalty` | 0.2 | utility coefficient | [0, 10] | balance: ai / utility / fatigue Penalty. |
| balance.json | `ai.utility.repeatPenalty` | 0.08 | utility coefficient | [0, 10] | balance: ai / utility / repeat Penalty. |
| balance.json | `ai.reliefScales.hunger` | 30 | need deficit points | [1e-12, 100] | balance: ai / relief Scales / hunger. |
| balance.json | `ai.reliefScales.fatigue` | 36 | need deficit points | [1e-12, 100] | balance: ai / relief Scales / fatigue. |
| balance.json | `ai.reliefScales.boredom` | 20 | need deficit points | [1e-12, 100] | balance: ai / relief Scales / boredom. |
| balance.json | `ai.reliefScales.loneliness` | 18 | need deficit points | [1e-12, 100] | balance: ai / relief Scales / loneliness. |
| balance.json | `ai.reliefScales.stress` | 12 | need deficit points | [1e-12, 100] | balance: ai / relief Scales / stress. |
| balance.json | `ai.travelScaleSeconds` | 30 | seconds | [1e-12, 86400] | balance: ai / travel Scale Seconds. |
| balance.json | `ai.fatiguePenaltyScale` | 20 | coefficient | [1e-12, 10000000] | balance: ai / fatigue Penalty Scale. |
| balance.json | `personality.driftLimit` | 0.3 | personality drift | [0, 1] | balance: personality / drift Limit. |
| balance.json | `personality.returnTimeDays` | 20 | habitat days | [0, 10000] | balance: personality / return Time Days. |
| balance.json | `personality.positiveEventStep` | 0.005 | coefficient | [-10000000, 10000000] | balance: personality / positive Event Step. |
| balance.json | `personality.rewardCooldownTicks` | 60 | ticks | integer [0, 100000000] | balance: personality / reward Cooldown Ticks. |
| balance.json | `world.widthTiles` | 172 | coefficient | [0, 10000000] | balance: world / width Tiles. |
| balance.json | `world.heightTiles` | 92 | coefficient | [0, 10000000] | balance: world / height Tiles. |
| balance.json | `world.tilePixels` | 32 | coefficient | [0, 10000000] | balance: world / tile Pixels. |
| balance.json | `world.walkBaseSpeed` | 0.8 | coefficient | [0, 10000000] | balance: world / walk Base Speed. |
| balance.json | `world.terrainCosts.grass` | 1 | coefficient | [0, 10000000] | balance: world / terrain Costs / grass. |
| balance.json | `world.terrainCosts.soil` | 1.2 | coefficient | [0, 10000000] | balance: world / terrain Costs / soil. |
| balance.json | `world.terrainCosts.shallowWalking` | 1.8 | coefficient | [0, 10000000] | balance: world / terrain Costs / shallow Walking. |
| balance.json | `world.terrainCosts.rock` | 2 | coefficient | [0, 10000000] | balance: world / terrain Costs / rock. |
| balance.json | `world.pond.x` | 44 | geometry units | [-256, 256] | balance: world / pond / x. |
| balance.json | `world.pond.y` | 20 | geometry units | [-256, 256] | balance: world / pond / y. |
| balance.json | `world.pond.outer.x` | 10 | geometry units | [-256, 256] | balance: world / pond / outer / x. |
| balance.json | `world.pond.outer.y` | 8 | geometry units | [-256, 256] | balance: world / pond / outer / y. |
| balance.json | `world.pond.inner.x` | 7 | geometry units | [-256, 256] | balance: world / pond / inner / x. |
| balance.json | `world.pond.inner.y` | 5 | geometry units | [-256, 256] | balance: world / pond / inner / y. |
| balance.json | `world.rock.min.x` | 10 | geometry units | [-256, 256] | balance: world / rock / min / x. |
| balance.json | `world.rock.min.y` | 8 | geometry units | [-256, 256] | balance: world / rock / min / y. |
| balance.json | `world.rock.max.x` | 17 | geometry units | [-256, 256] | balance: world / rock / max / x. |
| balance.json | `world.rock.max.y` | 13 | geometry units | [-256, 256] | balance: world / rock / max / y. |
| balance.json | `world.soil.min.x` | 8 | geometry units | [-256, 256] | balance: world / soil / min / x. |
| balance.json | `world.soil.min.y` | 29 | geometry units | [-256, 256] | balance: world / soil / min / y. |
| balance.json | `world.soil.max.x` | 22 | geometry units | [-256, 256] | balance: world / soil / max / x. |
| balance.json | `world.soil.max.y` | 36 | geometry units | [-256, 256] | balance: world / soil / max / y. |
| balance.json | `world.nightStart` | 0.7 | coefficient | [0, 10000000] | balance: world / night Start. |
| balance.json | `world.nightOverlayAlpha` | 0.22 | ratio | [0, 1] | balance: world / night Overlay Alpha. |
| balance.json | `world.navigationCacheEntries` | 512 | entries | integer [1, 32768] | Maximum derived entries per terrain-keyed navigation cache |
| balance.json | `initial.seed` | 271828 | uint32 seed | integer [0, 4294967295] | balance: initial / seed. |
| balance.json | `initial.position.x` | 73.5 | geometry units | [-256, 256] | balance: initial / position / x. |
| balance.json | `initial.position.y` | 45.5 | geometry units | [-256, 256] | balance: initial / position / y. |
| balance.json | `food.looseSpoilDays` | 2 | habitat days | [0, 10000] | balance: food / loose Spoil Days. |
| balance.json | `food.historyLength` | 5 | count | integer [0, 10000000] | balance: food / history Length. |
| balance.json | `food.learningRate` | 0.2 | probability / update fraction | [0, 1] | balance: food / learning Rate. |
| balance.json | `food.genePreferenceWeight` | 0.6 | ratio | [0, 1] | balance: food / gene Preference Weight. |
| balance.json | `food.learnedPreferenceWeight` | 0.4 | ratio | [0, 1] | balance: food / learned Preference Weight. |
| balance.json | `food.repeatPreferencePenalty` | 0.25 | coefficient | [0, 10000000] | balance: food / repeat Preference Penalty. |
| balance.json | `food.rewardTasteWeight` | 0.65 | ratio | [0, 1] | balance: food / reward Taste Weight. |
| balance.json | `food.rewardHungerWeight` | 0.25 | ratio | [0, 1] | balance: food / reward Hunger Weight. |
| balance.json | `food.rewardStressWeight` | 0.1 | ratio | [0, 1] | balance: food / reward Stress Weight. |
| balance.json | `food.rewardStressScale` | 14 | coefficient | [-10000000, 10000000] | balance: food / reward Stress Scale. |
| balance.json | `food.rewardLowHungerThreshold` | 25 | coefficient | [-10000000, 10000000] | balance: food / reward Low Hunger Threshold. |
| balance.json | `food.rewardLowHungerPenalty` | 0.3 | coefficient | [-10000000, 10000000] | balance: food / reward Low Hunger Penalty. |
| balance.json | `food.rewardRepeatPenalty` | 0.2 | coefficient | [-10000000, 10000000] | balance: food / reward Repeat Penalty. |
| balance.json | `food.valenceWeight` | 0.15 | ratio | [0, 1] | balance: food / valence Weight. |
| balance.json | `food.positiveStressRelief` | 4 | coefficient | [-10000000, 10000000] | balance: food / positive Stress Relief. |
| balance.json | `food.valenceBounds[0]` | -0.5 | coefficient | [-10000000, 10000000] | balance: food / valence Bounds[0]. |
| balance.json | `food.valenceBounds[1]` | 0.5 | coefficient | [-10000000, 10000000] | balance: food / valence Bounds[1]. |
| balance.json | `food.favoriteThreshold` | 0.35 | ratio | [0, 1] | balance: food / favorite Threshold. |
| balance.json | `food.dislikeThreshold` | -0.25 | coefficient | [-10000000, 10000000] | balance: food / dislike Threshold. |
| balance.json | `food.labelMinimumMeals` | 3 | count | integer [0, 10000000] | balance: food / label Minimum Meals. |
| balance.json | `food.reactionTicks` | 12 | ticks | integer [0, 100000000] | balance: food / reaction Ticks. |
| balance.json | `persistence.autosaveRealSeconds` | 15 | seconds | [0, 86400] | balance: persistence / autosave Real Seconds. |
| balance.json | `persistence.snapshotMaximumRealHz` | 10 | refreshes/second | [0.1, 120] | balance: persistence / snapshot Maximum Real Hz. |
| balance.json | `skills.capBase` | 40 | skill levels | integer [1, 100] | balance: skills / cap Base. |
| balance.json | `skills.capRange` | 60 | coefficient | [0, 10000000] | balance: skills / cap Range. |
| balance.json | `skills.baseXpPerSecond` | 1 | coefficient | [0, 10000000] | balance: skills / base Xp Per Second. |
| balance.json | `skills.aptitudeBase` | 0.6 | coefficient | [0, 10000000] | balance: skills / aptitude Base. |
| balance.json | `skills.aptitudeWeight` | 0.8 | ratio | [0, 1] | balance: skills / aptitude Weight. |
| balance.json | `skills.capTaper` | 0.75 | coefficient | [0, 10000000] | balance: skills / cap Taper. |
| balance.json | `skills.moodBase` | 0.75 | coefficient | [-10000000, 10000000] | balance: skills / mood Base. |
| balance.json | `skills.moodWeight` | 0.25 | ratio | [0, 1] | balance: skills / mood Weight. |
| balance.json | `skills.dedicatedQuality` | 1 | coefficient | [0, 10000000] | balance: skills / dedicated Quality. |
| balance.json | `skills.improvisedQuality` | 0.75 | coefficient | [0, 10000000] | balance: skills / improvised Quality. |
| balance.json | `skills.dailyFullRateTicks` | 240 | ticks | integer [0, 100000000] | balance: skills / daily Full Rate Ticks. |
| balance.json | `skills.dailyReducedMultiplier` | 0.5 | ratio | [0, 1] | balance: skills / daily Reduced Multiplier. |
| balance.json | `skills.stressExclusionThreshold` | 90 | coefficient | [-10000000, 10000000] | balance: skills / stress Exclusion Threshold. |
| balance.json | `skills.learningRate` | 0.2 | probability / update fraction | [0, 1] | balance: skills / learning Rate. |
| balance.json | `skills.levelReward` | 0.1 | coefficient | [-10000000, 10000000] | balance: skills / level Reward. |
| balance.json | `skills.rewardWellbeingWeight` | 2 | coefficient | [-10000000, 10000000] | balance: skills / reward Wellbeing Weight. |
| balance.json | `skills.levelUpMessageTicks` | 12 | ticks | integer [0, 100000000] | balance: skills / level Up Message Ticks. |
| balance.json | `genetics.crossoverChance` | 0.65 | probability / update fraction | [0, 1] | balance: genetics / crossover Chance. |
| balance.json | `genetics.quantitativeMutation` | 0.008 | coefficient | [0, 10000000] | balance: genetics / quantitative Mutation. |
| balance.json | `genetics.categoricalMutation` | 0.004 | coefficient | [0, 10000000] | balance: genetics / categorical Mutation. |
| balance.json | `genetics.dominanceMutation` | 0.002 | coefficient | [0, 10000000] | balance: genetics / dominance Mutation. |
| balance.json | `genetics.mutationStep[0]` | 1 | allele-byte mutation magnitude | integer [1, 255] | balance: genetics / mutation Step[0]. |
| balance.json | `genetics.mutationStep[1]` | 24 | allele-byte mutation magnitude | integer [1, 255] | balance: genetics / mutation Step[1]. |
| balance.json | `genetics.dominantWeight` | 0.75 | ratio | [0, 1] | balance: genetics / dominant Weight. |
| balance.json | `genetics.circularEpsilon` | 1e-9 | coefficient | [0, 10000000] | balance: genetics / circular Epsilon. |
| lifecycle.json | `stages.egg.durationTicks` | 30 | ticks | integer [1, 100000000] | lifecycle: stages / egg / duration Ticks. |
| lifecycle.json | `stages.egg.mobile` | false | flag | false, true | Boolean switch for lifecycle: stages.egg.mobile. |
| lifecycle.json | `stages.egg.scale` | 1 | coefficient | [0, 10000000] | lifecycle: stages / egg / scale. |
| lifecycle.json | `stages.egg.saturationMultiplier` | 1 | saturation multiplier | [0, 1] | lifecycle: stages / egg / saturation Multiplier. |
| lifecycle.json | `stages.egg.needMultiplier` | 0 | ratio | [0, 1] | lifecycle: stages / egg / need Multiplier. |
| lifecycle.json | `stages.egg.xpMultiplier` | 0 | ratio | [0, 1] | lifecycle: stages / egg / xp Multiplier. |
| lifecycle.json | `stages.egg.skillCap` | 0 | skill levels | integer [0, 100] | lifecycle: stages / egg / skill Cap. |
| lifecycle.json | `stages.egg.performanceMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / egg / performance Multiplier. |
| lifecycle.json | `stages.baby.durationTicks` | 120 | ticks | integer [1, 100000000] | lifecycle: stages / baby / duration Ticks. |
| lifecycle.json | `stages.baby.mobile` | true | flag | false, true | Boolean switch for lifecycle: stages.baby.mobile. |
| lifecycle.json | `stages.baby.scale` | 0.55 | coefficient | [0, 10000000] | lifecycle: stages / baby / scale. |
| lifecycle.json | `stages.baby.saturationMultiplier` | 1 | saturation multiplier | [0, 1] | lifecycle: stages / baby / saturation Multiplier. |
| lifecycle.json | `stages.baby.needMultiplier` | 1.2 | coefficient | [0, 10000000] | lifecycle: stages / baby / need Multiplier. |
| lifecycle.json | `stages.baby.xpMultiplier` | 0.6 | ratio | [0, 1] | lifecycle: stages / baby / xp Multiplier. |
| lifecycle.json | `stages.baby.skillCap` | 15 | skill levels | integer [0, 100] | lifecycle: stages / baby / skill Cap. |
| lifecycle.json | `stages.baby.performanceMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / baby / performance Multiplier. |
| lifecycle.json | `stages.juvenile.durationTicks` | 240 | ticks | integer [1, 100000000] | lifecycle: stages / juvenile / duration Ticks. |
| lifecycle.json | `stages.juvenile.mobile` | true | flag | false, true | Boolean switch for lifecycle: stages.juvenile.mobile. |
| lifecycle.json | `stages.juvenile.scale` | 0.78 | coefficient | [0, 10000000] | lifecycle: stages / juvenile / scale. |
| lifecycle.json | `stages.juvenile.saturationMultiplier` | 1 | saturation multiplier | [0, 1] | lifecycle: stages / juvenile / saturation Multiplier. |
| lifecycle.json | `stages.juvenile.needMultiplier` | 1.1 | coefficient | [0, 10000000] | lifecycle: stages / juvenile / need Multiplier. |
| lifecycle.json | `stages.juvenile.xpMultiplier` | 1.25 | coefficient | [0, 10000000] | lifecycle: stages / juvenile / xp Multiplier. |
| lifecycle.json | `stages.juvenile.skillCap` | 45 | skill levels | integer [0, 100] | lifecycle: stages / juvenile / skill Cap. |
| lifecycle.json | `stages.juvenile.performanceMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / juvenile / performance Multiplier. |
| lifecycle.json | `stages.adult.durationTicks` | 1200 | ticks | integer [1, 100000000] | lifecycle: stages / adult / duration Ticks. |
| lifecycle.json | `stages.adult.mobile` | true | flag | false, true | Boolean switch for lifecycle: stages.adult.mobile. |
| lifecycle.json | `stages.adult.scale` | 1 | coefficient | [0, 10000000] | lifecycle: stages / adult / scale. |
| lifecycle.json | `stages.adult.saturationMultiplier` | 1 | saturation multiplier | [0, 1] | lifecycle: stages / adult / saturation Multiplier. |
| lifecycle.json | `stages.adult.needMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / adult / need Multiplier. |
| lifecycle.json | `stages.adult.xpMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / adult / xp Multiplier. |
| lifecycle.json | `stages.adult.skillCap` | 100 | skill levels | integer [0, 100] | lifecycle: stages / adult / skill Cap. |
| lifecycle.json | `stages.adult.performanceMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / adult / performance Multiplier. |
| lifecycle.json | `stages.elder.durationTicks` | 210 | ticks | integer [1, 100000000] | lifecycle: stages / elder / duration Ticks. |
| lifecycle.json | `stages.elder.mobile` | true | flag | false, true | Boolean switch for lifecycle: stages.elder.mobile. |
| lifecycle.json | `stages.elder.scale` | 0.95 | coefficient | [0, 10000000] | lifecycle: stages / elder / scale. |
| lifecycle.json | `stages.elder.saturationMultiplier` | 0.45 | saturation multiplier | [0, 1] | lifecycle: stages / elder / saturation Multiplier. |
| lifecycle.json | `stages.elder.needMultiplier` | 0.9 | ratio | [0, 1] | lifecycle: stages / elder / need Multiplier. |
| lifecycle.json | `stages.elder.xpMultiplier` | 0.5 | ratio | [0, 1] | lifecycle: stages / elder / xp Multiplier. |
| lifecycle.json | `stages.elder.skillCap` | 100 | skill levels | integer [0, 100] | lifecycle: stages / elder / skill Cap. |
| lifecycle.json | `stages.elder.performanceMultiplier` | 0.85 | ratio | [0, 1] | lifecycle: stages / elder / performance Multiplier. |
| lifecycle.json | `stages.cocoon.durationTicks` | 30 | ticks | integer [1, 100000000] | lifecycle: stages / cocoon / duration Ticks. |
| lifecycle.json | `stages.cocoon.mobile` | false | flag | false, true | Boolean switch for lifecycle: stages.cocoon.mobile. |
| lifecycle.json | `stages.cocoon.scale` | 1 | coefficient | [0, 10000000] | lifecycle: stages / cocoon / scale. |
| lifecycle.json | `stages.cocoon.saturationMultiplier` | 0.6 | saturation multiplier | [0, 1] | lifecycle: stages / cocoon / saturation Multiplier. |
| lifecycle.json | `stages.cocoon.needMultiplier` | 0 | ratio | [0, 1] | lifecycle: stages / cocoon / need Multiplier. |
| lifecycle.json | `stages.cocoon.xpMultiplier` | 0 | ratio | [0, 1] | lifecycle: stages / cocoon / xp Multiplier. |
| lifecycle.json | `stages.cocoon.skillCap` | 0 | skill levels | integer [0, 100] | lifecycle: stages / cocoon / skill Cap. |
| lifecycle.json | `stages.cocoon.performanceMultiplier` | 1 | ratio | [0, 1] | lifecycle: stages / cocoon / performance Multiplier. |
| lifecycle.json | `capacity` | 30 | active/reserved slots | integer [1, 30] | lifecycle: capacity. |
| lifecycle.json | `deathFadeRealSeconds` | 0.6 | seconds | [0, 86400] | lifecycle: death Fade Real Seconds. |
| lifecycle.json | `rebirth.welfareMinimum` | 0.7 | coefficient | [0, 10000000] | lifecycle: rebirth / welfare Minimum. |
| lifecycle.json | `rebirth.friendMinimum` | 2 | coefficient | [0, 10000000] | lifecycle: rebirth / friend Minimum. |
| lifecycle.json | `rebirth.friendBond` | 40 | coefficient | [-10000000, 10000000] | lifecycle: rebirth / friend Bond. |
| lifecycle.json | `rebirth.maximum` | 2 | coefficient | [0, 10000000] | lifecycle: rebirth / maximum. |
| lifecycle.json | `rebirth.chance` | 0.6 | probability / update fraction | [0, 1] | lifecycle: rebirth / chance. |
| lifecycle.json | `rebirth.memoryRetention` | 0.5 | ratio | [0, 1] | lifecycle: rebirth / memory Retention. |
| lifecycle.json | `rebirth.rivalryRetention` | 0.25 | ratio | [0, 1] | lifecycle: rebirth / rivalry Retention. |
| lifecycle.json | `rebirth.friendValence` | -0.2 | coefficient | [-10000000, 10000000] | lifecycle: rebirth / friend Valence. |
| lifecycle.json | `rebirth.friendStress` | 8 | coefficient | [-10000000, 10000000] | lifecycle: rebirth / friend Stress. |
| lifecycle.json | `eventLogLimit` | 1000 | count | integer [0, 10000000] | lifecycle: event Log Limit. |
| lifecycle.json | `visibleEventLimit` | 12 | count | integer [0, 10000000] | lifecycle: visible Event Limit. |
| lifecycle.json | `debugAgeTicks` | 1000 | ticks | integer [0, 100000000] | lifecycle: debug Age Ticks. |
| lifecycle.json | `debugAgeBatchTicks` | 100 | ticks | integer [0, 100000000] | lifecycle: debug Age Batch Ticks. |
| breeding.json | `clutchEggs` | 3 | eggs | integer [1, 6] | Maximum eggs per completed natural courtship, limited by space and the population target. |
| breeding.json | `enabled` | true | flag | false, true | Enable autonomous breeding. |
| breeding.json | `extinctionRescue` | true | flag | false, true | Allow rescue eggs after complete extinction. |
| breeding.json | `founderCount` | 12 | count | integer [0, 10000000] | breeding: founder Count. |
| breeding.json | `initialAdults` | 8 | coefficient | [0, 10000000] | breeding: initial Adults. |
| breeding.json | `rescueCount` | 6 | count | integer [0, 10000000] | breeding: rescue Count. |
| breeding.json | `minimumCompatibility` | 0.3 | coefficient | [0, 10000000] | breeding: minimum Compatibility. |
| breeding.json | `compatibilityWeights.bond` | 0.55 | ratio | [0, 1] | breeding: compatibility Weights / bond. |
| breeding.json | `compatibilityWeights.traits` | 0.2 | ratio | [0, 1] | breeding: compatibility Weights / traits. |
| breeding.json | `compatibilityWeights.taste` | 0.15 | ratio | [0, 1] | breeding: compatibility Weights / taste. |
| breeding.json | `compatibilityWeights.diversity` | 0.1 | ratio | [0, 1] | breeding: compatibility Weights / diversity. |
| breeding.json | `needMaximum` | 65 | coefficient | [0, 10000000] | breeding: need Maximum. |
| breeding.json | `stressMaximum` | 50 | coefficient | [-10000000, 10000000] | breeding: stress Maximum. |
| breeding.json | `minimumMood` | 0.1 | coefficient | [-10000000, 10000000] | breeding: minimum Mood. |
| breeding.json | `adultRemainingTicks` | 21 | ticks | integer [0, 100000000] | breeding: adult Remaining Ticks. |
| breeding.json | `maximumClutches` | 5 | count | integer [0, 10000000] | breeding: maximum Clutches. |
| breeding.json | `cooldownDays` | 2 | habitat days | integer [0, 10000] | breeding: cooldown Days. |
| breeding.json | `attemptIntervalTicks` | 10 | ticks | integer [0, 100000000] | breeding: attempt Interval Ticks. |
| breeding.json | `attemptChance` | 0.8 | probability / update fraction | [0, 1] | breeding: attempt Chance. |
| breeding.json | `encouragementUtility` | 0.15 | coefficient | [0, 10000000] | breeding: encouragement Utility. |
| breeding.json | `encouragementMultiplier` | 1.5 | coefficient | [0, 10000000] | breeding: encouragement Multiplier. |
| breeding.json | `courtshipInterest` | 2 | coefficient | [0, 10000000] | breeding: courtship Interest. |
| breeding.json | `recipientMinimumUtility` | 0.2 | coefficient | [0, 10000000] | breeding: recipient Minimum Utility. |
| breeding.json | `courtshipWorkTicks` | 20 | ticks | integer [0, 100000000] | breeding: courtship Work Ticks. |
| breeding.json | `travelTimeoutTicks` | 300 | ticks | integer [0, 100000000] | breeding: travel Timeout Ticks. |
| breeding.json | `radiusTiles` | 48 | coefficient | [0, 10000000] | breeding: radius Tiles. |
| breeding.json | `candidateCount` | 8 | count | integer [0, 10000000] | Maximum eligible nearby mates included in weighted partner selection. |
| breeding.json | `densityFullUntil` | 12 | coefficient | [0, 10000000] | breeding: density Full Until. |
| breeding.json | `foodCapacityFloor` | 12 | coefficient | [0, 10000000] | Soft population ceiling when no renewable food sources remain. |
| breeding.json | `referenceSources` | 14 | coefficient | [0, 10000000] | Renewable food-source count that yields the full carrying ceiling. |
| breeding.json | `nest.x` | 75 | geometry units | [-256, 256] | breeding: nest / x. |
| breeding.json | `nest.y` | 45 | geometry units | [-256, 256] | breeding: nest / y. |
| breeding.json | `reportTicks` | 1000000 | ticks | integer [0, 100000000] | breeding: report Ticks. |
| breeding.json | `reportSeeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | breeding: report Seeds[0]. |
| breeding.json | `reportSeeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | breeding: report Seeds[1]. |
| breeding.json | `reportSeeds[2]` | 161803 | uint32 seed | integer [0, 4294967295] | breeding: report Seeds[2]. |
| breeding.json | `reportIntervalTicks` | 50000 | ticks | integer [1, 100000000] | breeding: report Interval Ticks. |
| breeding.json | `diversityFloor` | 0.4 | coefficient | [0, 10000000] | breeding: diversity Floor. |
| breeding.json | `minimumBond` | 10 | coefficient | [-10000000, 10000000] | breeding: minimum Bond. |
| breeding.json | `mateBondWeight` | 0.1 | ratio | [0, 1] | breeding: mate Bond Weight. |
| breeding.json | `rivalryPenalty` | 0.1 | coefficient | [0, 10000000] | breeding: rivalry Penalty. |
| breeding.json | `mateTemperature` | 0.6 | coefficient | [1e-12, 10000000] | Mate softmax temperature; higher values flatten partner preference weights. |
| breeding.json | `founderAdultSpreadDays` | 12 | game days | [0, 30] | Age spread of adults in a new world |
| breeding.json | `founderJuvenileSpreadFraction` | 0.75 | fraction | [0, 0.99] | Fraction of juvenile stage used to spread new founder ages |
| breeding.json | `recovery.minimumProjectedPopulation` | 8 | creatures | integer [1, 1000000] | Early rescue protects this projected population at the next egg-to-adult horizon. |
| breeding.json | `recovery.minimumYoung` | 6 | creatures | integer [1, 1000000] | Existing eggs and young Derbils suppress further demographic assistance at this count. |
| breeding.json | `recovery.minimumBreedingWindowTicks` | 120 | ticks | integer [1, 1000000] | Minimum overlapping adult time for a viable future breeding pair. |
| breeding.json | `recovery.maximumPopulation` | 12 | Derbils | integer [1, 12] | Largest population eligible for early genetic rescue |
| breeding.json | `recovery.eggs` | 4 | eggs | integer [1, 6] | Unrelated eggs per early genetic rescue |
| breeding.json | `recovery.checkEveryTicks` | 60 | ticks | integer [1, 3600] | Interval between early genetic rescue assessments |
| breeding.json | `recovery.cooldownDays` | 3 | game days | integer [1, 100] | Minimum interval between early rescue batches |
| breeding.json | `targetPopulation` | 24 | Derbils | integer [13, 30] | Soft population limit for ordinary conception |
| social.json | `mateProgressInterest` | 0.4 | utility | [0, 2] | Additional interest in continuing a friendly potential mate relationship. |
| social.json | `mateSeekingInterest` | 0.5 | utility | [0, 2] | Adult interest in meeting an eligible new mate, divided by one plus current mate count. |
| social.json | `friendBond` | 33.333333333333336 | coefficient | [-10000000, 10000000] | social: friend Bond. |
| social.json | `closeFriendBond` | 70 | coefficient | [-10000000, 10000000] | social: close Friend Bond. |
| social.json | `dislikedBond` | -33.333333333333336 | coefficient | [-10000000, 10000000] | social: disliked Bond. |
| social.json | `mateBondThreshold` | 50 | coefficient | [-10000000, 10000000] | social: mate Bond Threshold. |
| social.json | `bondBounds[0]` | -100 | coefficient | [-10000000, 10000000] | social: bond Bounds[0]. |
| social.json | `bondBounds[1]` | 100 | coefficient | [-10000000, 10000000] | social: bond Bounds[1]. |
| social.json | `maximumRelationships` | 240 | unordered organism pairs | integer [0, 435] | social: maximum Relationships. |
| social.json | `relationshipsPerCreature` | 16 | relationships per organism | integer [0, 29] | social: relationships Per Creature. |
| social.json | `historyLimit` | 3 | count | integer [0, 10000000] | social: history Limit. |
| social.json | `decayGraceDays` | 1 | habitat days | [0, 10000] | social: decay Grace Days. |
| social.json | `bondDecayDays` | 30 | habitat days | [0, 10000] | social: bond Decay Days. |
| social.json | `rivalryDecayDays` | 10 | habitat days | [0, 10000] | social: rivalry Decay Days. |
| social.json | `maintenanceTicks` | 60 | ticks | integer [1, 100000000] | social: maintenance Ticks. |
| social.json | `pruneStrength` | 0.5 | coefficient | [0, 10000000] | social: prune Strength. |
| social.json | `initialFounderBond` | 15 | coefficient | [-10000000, 10000000] | social: initial Founder Bond. |
| social.json | `newbornParentBond` | 25 | coefficient | [-10000000, 10000000] | social: newborn Parent Bond. |
| social.json | `newbornSiblingBond` | 10 | coefficient | [-10000000, 10000000] | social: newborn Sibling Bond. |
| social.json | `radiusTiles` | 40 | coefficient | [0, 10000000] | social: radius Tiles. |
| social.json | `gridTiles` | 12 | coefficient | [0, 10000000] | social: grid Tiles. |
| social.json | `targetLimit` | 4 | count | integer [0, 10000000] | social: target Limit. |
| social.json | `scanLimit` | 16 | count | integer [0, 10000000] | social: scan Limit. |
| social.json | `targetIntervalTicks` | 30 | ticks | integer [0, 100000000] | social: target Interval Ticks. |
| social.json | `targetLonelinessWeight` | 0.25 | ratio | [0, 1] | social: target Loneliness Weight. |
| social.json | `targetDistanceScale` | 48 | coefficient | [0, 10000000] | social: target Distance Scale. |
| social.json | `inviteMinimumUtility` | 0.15 | coefficient | [0, 10000000] | social: invite Minimum Utility. |
| social.json | `inviteCurrentUtilityMargin` | 0.05 | coefficient | [0, 10000000] | social: invite Current Utility Margin. |
| social.json | `proximityTiles` | 2 | coefficient | [0, 10000000] | social: proximity Tiles. |
| social.json | `travelTimeoutTicks` | 120 | ticks | integer [0, 100000000] | social: travel Timeout Ticks. |
| social.json | `comfortGentleness` | 0.5 | coefficient | [0, 10000000] | social: comfort Gentleness. |
| social.json | `comfortStressMinimum` | 20 | coefficient | [-10000000, 10000000] | social: comfort Stress Minimum. |
| social.json | `comfortRecipientEffects.hunger` | 0 | coefficient | [-10000000, 10000000] | social: comfort Recipient Effects / hunger. |
| social.json | `comfortRecipientEffects.fatigue` | 0 | coefficient | [-10000000, 10000000] | social: comfort Recipient Effects / fatigue. |
| social.json | `comfortRecipientEffects.boredom` | 0 | coefficient | [-10000000, 10000000] | social: comfort Recipient Effects / boredom. |
| social.json | `comfortRecipientEffects.loneliness` | -12 | coefficient | [-10000000, 10000000] | social: comfort Recipient Effects / loneliness. |
| social.json | `comfortRecipientEffects.stress` | -12 | coefficient | [-10000000, 10000000] | social: comfort Recipient Effects / stress. |
| social.json | `rudePlayBaseChance` | 0.12 | probability / update fraction | [0, 1] | social: rude Play Base Chance. |
| social.json | `rudePlayTraitChance` | 0.18 | ratio | [0, 1] | social: rude Play Trait Chance. |
| social.json | `positiveScaleBase` | 0.75 | coefficient | [0, 10000000] | social: positive Scale Base. |
| social.json | `positiveSociabilityWeight` | 0.25 | ratio | [0, 1] | social: positive Sociability Weight. |
| social.json | `affinityScaleBase` | 0.75 | coefficient | [0, 10000000] | social: affinity Scale Base. |
| social.json | `affinityScaleWeight` | 0.25 | ratio | [0, 1] | social: affinity Scale Weight. |
| social.json | `outcomes.friendlyPlay.bond` | 18 | relationship / need / valence delta | [-100, 100] | social: outcomes / friendly Play / bond. |
| social.json | `outcomes.friendlyPlay.mateBond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / friendly Play / mate Bond. |
| social.json | `outcomes.friendlyPlay.valence[0]` | 0.08 | coefficient | [-10000000, 10000000] | social: outcomes / friendly Play / valence[0]. |
| social.json | `outcomes.friendlyPlay.valence[1]` | 0.08 | coefficient | [-10000000, 10000000] | social: outcomes / friendly Play / valence[1]. |
| social.json | `outcomes.friendlyPlay.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / friendly Play / stress[0]. |
| social.json | `outcomes.friendlyPlay.stress[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / friendly Play / stress[1]. |
| social.json | `outcomes.rudePlay.bond` | -14 | relationship / need / valence delta | [-100, 100] | social: outcomes / rude Play / bond. |
| social.json | `outcomes.rudePlay.mateBond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / rude Play / mate Bond. |
| social.json | `outcomes.rudePlay.valence[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / rude Play / valence[0]. |
| social.json | `outcomes.rudePlay.valence[1]` | -0.12 | coefficient | [-10000000, 10000000] | social: outcomes / rude Play / valence[1]. |
| social.json | `outcomes.rudePlay.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / rude Play / stress[0]. |
| social.json | `outcomes.rudePlay.stress[1]` | 8 | coefficient | [-10000000, 10000000] | social: outcomes / rude Play / stress[1]. |
| social.json | `outcomes.comfort.bond` | 5 | relationship / need / valence delta | [-100, 100] | social: outcomes / comfort / bond. |
| social.json | `outcomes.comfort.mateBond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / comfort / mate Bond. |
| social.json | `outcomes.comfort.valence[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / comfort / valence[0]. |
| social.json | `outcomes.comfort.valence[1]` | 0.1 | coefficient | [-10000000, 10000000] | social: outcomes / comfort / valence[1]. |
| social.json | `outcomes.comfort.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / comfort / stress[0]. |
| social.json | `outcomes.comfort.stress[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / comfort / stress[1]. |
| social.json | `outcomes.court.bond` | 10 | relationship / need / valence delta | [-100, 100] | social: outcomes / court / bond. |
| social.json | `outcomes.court.mateBond` | 25 | relationship / need / valence delta | [-100, 100] | social: outcomes / court / mate Bond. |
| social.json | `outcomes.court.valence[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / court / valence[0]. |
| social.json | `outcomes.court.valence[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / court / valence[1]. |
| social.json | `outcomes.court.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / court / stress[0]. |
| social.json | `outcomes.court.stress[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / court / stress[1]. |
| social.json | `outcomes.pair.bond` | 5 | relationship / need / valence delta | [-100, 100] | social: outcomes / pair / bond. |
| social.json | `outcomes.pair.mateBond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / pair / mate Bond. |
| social.json | `outcomes.pair.valence[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / pair / valence[0]. |
| social.json | `outcomes.pair.valence[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / pair / valence[1]. |
| social.json | `outcomes.pair.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / pair / stress[0]. |
| social.json | `outcomes.pair.stress[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / pair / stress[1]. |
| social.json | `outcomes.avoid.bond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / avoid / bond. |
| social.json | `outcomes.avoid.mateBond` | 0 | relationship / need / valence delta | [-100, 100] | social: outcomes / avoid / mate Bond. |
| social.json | `outcomes.avoid.valence[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / avoid / valence[0]. |
| social.json | `outcomes.avoid.valence[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / avoid / valence[1]. |
| social.json | `outcomes.avoid.stress[0]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / avoid / stress[0]. |
| social.json | `outcomes.avoid.stress[1]` | 0 | coefficient | [-10000000, 10000000] | social: outcomes / avoid / stress[1]. |
| social.json | `contest.rivalry` | 4 | coefficient | [0, 10000000] | social: contest / rivalry. |
| social.json | `contest.lowRivalry` | 4 | coefficient | [0, 10000000] | social: contest / low Rivalry. |
| social.json | `contest.competitivenessMinimum` | 0.5 | coefficient | [0, 10000000] | social: contest / competitiveness Minimum. |
| social.json | `contest.bond` | 2 | coefficient | [-10000000, 10000000] | social: contest / bond. |
| social.json | `contest.winnerValence` | 0.1 | coefficient | [-10000000, 10000000] | social: contest / winner Valence. |
| social.json | `contest.otherValence` | 0.02 | coefficient | [-10000000, 10000000] | social: contest / other Valence. |
| social.json | `contest.cooldownTicks` | 120 | ticks | integer [0, 100000000] | social: contest / cooldown Ticks. |
| social.json | `contest.skillOffset` | 5 | coefficient | [0, 10000000] | social: contest / skill Offset. |
| social.json | `contest.conditionBase` | 0.55 | coefficient | [0, 10000000] | social: contest / condition Base. |
| social.json | `contest.conditionWeight` | 0.45 | ratio | [0, 1] | social: contest / condition Weight. |
| social.json | `contest.primaryWeight` | 0.85 | ratio | [0, 1] | social: contest / primary Weight. |
| social.json | `contest.staminaWeight` | 0.15 | ratio | [0, 1] | social: contest / stamina Weight. |
| social.json | `contest.noiseAmplitude` | 0.08 | coefficient | [0, 10000000] | social: contest / noise Amplitude. |
| social.json | `contest.tieEpsilon` | 1e-9 | coefficient | [0, 10000000] | social: contest / tie Epsilon. |
| social.json | `contest.aptitudeBands[0]` | 0.4 | coefficient | [0, 10000000] | social: contest / aptitude Bands[0]. |
| social.json | `contest.aptitudeBands[1]` | 0.6 | coefficient | [0, 10000000] | social: contest / aptitude Bands[1]. |
| social.json | `contest.rivalLossBond` | -6 | coefficient | [-10000000, 10000000] | social: contest / rival Loss Bond. |
| social.json | `contest.friendLossBond` | 0 | coefficient | [-10000000, 10000000] | social: contest / friend Loss Bond. |
| social.json | `rivalry.skillGap` | 12 | coefficient | [0, 10000000] | social: rivalry / skill Gap. |
| social.json | `rivalry.utilityBoost` | 0.1 | coefficient | [0, 10000000] | social: rivalry / utility Boost. |
| social.json | `rivalry.xpBoost` | 0.1 | coefficient | [0, 10000000] | social: rivalry / xp Boost. |
| social.json | `rivalry.dailyExtraXpCap` | 12 | coefficient | [0, 10000000] | social: rivalry / daily Extra Xp Cap. |
| social.json | `mateAffinityWeight` | 0.2 | ratio | [0, 1] | social: mate Affinity Weight. |
| social.json | `contestAffinityWeights[0]` | 0.5 | ratio | [0, 1] | social: contest Affinity Weights[0]. |
| social.json | `contestAffinityWeights[1]` | 0.5 | ratio | [0, 1] | social: contest Affinity Weights[1]. |
| social.json | `rudeGentlenessStep` | -0.005 | coefficient | [-10000000, 10000000] | social: rude Gentleness Step. |
| social.json | `rudeRecipientBoldnessStep` | -0.003 | coefficient | [-10000000, 10000000] | social: rude Recipient Boldness Step. |
| social.json | `avoidRadiusTiles` | 4 | coefficient | [0, 10000000] | social: avoid Radius Tiles. |
| social.json | `avoidDistanceTiles` | 3 | coefficient | [0, 10000000] | social: avoid Distance Tiles. |
| social.json | `mourning.enabled` | true | flag | false, true | Boolean switch for social: mourning.enabled. |
| social.json | `mourning.durationTicks` | 240 | ticks | integer [1, 100000000] | social: mourning / duration Ticks. |
| social.json | `overlays.visibility` | 20 | coefficient | [0, 10000000] | social: overlays / visibility. |
| social.json | `overlays.maximumLineWidth` | 5 | coefficient | [0, 10000000] | social: overlays / maximum Line Width. |
| social.json | `overlays.effectTicks` | 12 | ticks | integer [0, 100000000] | social: overlays / effect Ticks. |
| social.json | `pacing.earlyAdultTicks` | 10800 | ticks | integer [0, 100000000] | social: pacing / early Adult Ticks. |
| social.json | `pacing.positiveShare[0]` | 0.05 | ratio | [0, 1] | social: pacing / positive Share[0]. |
| social.json | `pacing.positiveShare[1]` | 0.995 | ratio | [0, 1] | social: pacing / positive Share[1]. |
| social.json | `pacing.minimumFriendships` | 1 | coefficient | [0, 10000000] | social: pacing / minimum Friendships. |
| social.json | `pacing.minimumRivalries` | 1 | coefficient | [0, 10000000] | social: pacing / minimum Rivalries. |
| social.json | `pacing.seeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | social: pacing / seeds[0]. |
| social.json | `pacing.seeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | social: pacing / seeds[1]. |
| social.json | `pacing.seeds[2]` | 161803 | uint32 seed | integer [0, 4294967295] | social: pacing / seeds[2]. |
| social.json | `pacing.ticks` | 300000 | ticks | integer [0, 100000000] | social: pacing / ticks. |
| social.json | `learningFriendly` | 0.2 | coefficient | [0, 10000000] | social: learning Friendly. |
| social.json | `learningRude` | -0.4 | coefficient | [-10000000, 10000000] | social: learning Rude. |
| social.json | `report.affinityBins[0]` | -100 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[0]. |
| social.json | `report.affinityBins[1]` | -50 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[1]. |
| social.json | `report.affinityBins[2]` | -30 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[2]. |
| social.json | `report.affinityBins[3]` | 0 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[3]. |
| social.json | `report.affinityBins[4]` | 40 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[4]. |
| social.json | `report.affinityBins[5]` | 70 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[5]. |
| social.json | `report.affinityBins[6]` | 100 | coefficient | [-10000000, 10000000] | social: report / affinity Bins[6]. |
| social.json | `targetBondWeight` | 0.15 | ratio | [0, 1] | social: target Bond Weight. |
| social.json | `mateDecayGraceDays` | 5 | game days | [1, 30] | Time without contact before mate-bond decay begins |
| social.json | `mateDecayDays` | 90 | game days | [1, 360] | Exponential decay timescale for mate bonds |
| social.json | `targetMateWeight` | 0.35 | utility points | [0, 1] | Social target preference for eligible unrelated adults and existing mates |
| competitions.json | `formats[0].rounds` | 1 | coefficient | [0, 10000000] | competitions: formats[0] / rounds. |
| competitions.json | `formats[1].rounds` | 3 | coefficient | [0, 10000000] | competitions: formats[1] / rounds. |
| competitions.json | `formats[2].rounds` | 3 | coefficient | [0, 10000000] | competitions: formats[2] / rounds. |
| competitions.json | `entry.maximumEntrants` | 8 | count | integer [0, 10000000] | competitions: entry / maximum Entrants. |
| competitions.json | `entry.needMaximum` | 60 | coefficient | [0, 10000000] | competitions: entry / need Maximum. |
| competitions.json | `entry.stressMaximum` | 60 | coefficient | [-10000000, 10000000] | competitions: entry / stress Maximum. |
| competitions.json | `entry.minimumMood` | -0.25 | coefficient | [-10000000, 10000000] | competitions: entry / minimum Mood. |
| competitions.json | `entry.relatedEntrantsAllowed` | true | flag | false, true | Allow related creatures to enter the same event. |
| competitions.json | `minimumEntrants` | 2 | count | integer [0, 10000000] | competitions: minimum Entrants. |
| competitions.json | `maximumEntrants` | 8 | count | integer [0, 10000000] | competitions: maximum Entrants. |
| competitions.json | `maximumConcurrent` | 1 | coefficient | [0, 10000000] | competitions: maximum Concurrent. |
| competitions.json | `entryWindowTicks` | 60 | ticks | integer [0, 100000000] | competitions: entry Window Ticks. |
| competitions.json | `defaultStartDelay` | 90 | coefficient | [0, 10000000] | competitions: default Start Delay. |
| competitions.json | `minimumStartDelay` | 1 | coefficient | [0, 10000000] | competitions: minimum Start Delay. |
| competitions.json | `maximumStartDelay` | 12000 | coefficient | [0, 10000000] | competitions: maximum Start Delay. |
| competitions.json | `durationTicks` | 90 | ticks | integer [1, 100000000] | competitions: duration Ticks. |
| competitions.json | `skillCooldownTicks` | 1200 | ticks | integer [0, 100000000] | competitions: skill Cooldown Ticks. |
| competitions.json | `historyLimit` | 200 | count | integer [0, 10000000] | competitions: history Limit. |
| competitions.json | `elderRemainingMinimumTicks` | 120 | ticks | integer [0, 100000000] | competitions: elder Remaining Minimum Ticks. |
| competitions.json | `requiredLevels.swim` | 10 | coefficient | [0, 10000000] | competitions: required Levels / swim. |
| competitions.json | `requiredLevels.fly` | 25 | coefficient | [0, 10000000] | competitions: required Levels / fly. |
| competitions.json | `venue.position.x` | 85 | geometry units | [-256, 256] | competitions: venue / position / x. |
| competitions.json | `venue.position.y` | 45 | geometry units | [-256, 256] | competitions: venue / position / y. |
| competitions.json | `venue.width` | 3 | coefficient | [0, 10000000] | competitions: venue / width. |
| competitions.json | `venue.height` | 2 | coefficient | [0, 10000000] | competitions: venue / height. |
| competitions.json | `venue.places[0].x` | 85.5 | geometry units | [-256, 256] | competitions: venue / places[0] / x. |
| competitions.json | `venue.places[0].y` | 44.5 | geometry units | [-256, 256] | competitions: venue / places[0] / y. |
| competitions.json | `venue.places[1].x` | 86.5 | geometry units | [-256, 256] | competitions: venue / places[1] / x. |
| competitions.json | `venue.places[1].y` | 44.5 | geometry units | [-256, 256] | competitions: venue / places[1] / y. |
| competitions.json | `venue.places[2].x` | 87.5 | geometry units | [-256, 256] | competitions: venue / places[2] / x. |
| competitions.json | `venue.places[2].y` | 44.5 | geometry units | [-256, 256] | competitions: venue / places[2] / y. |
| competitions.json | `venue.places[3].x` | 88.5 | geometry units | [-256, 256] | competitions: venue / places[3] / x. |
| competitions.json | `venue.places[3].y` | 45.5 | geometry units | [-256, 256] | competitions: venue / places[3] / y. |
| competitions.json | `venue.places[4].x` | 88.5 | geometry units | [-256, 256] | competitions: venue / places[4] / x. |
| competitions.json | `venue.places[4].y` | 46.5 | geometry units | [-256, 256] | competitions: venue / places[4] / y. |
| competitions.json | `venue.places[5].x` | 87.5 | geometry units | [-256, 256] | competitions: venue / places[5] / x. |
| competitions.json | `venue.places[5].y` | 47.5 | geometry units | [-256, 256] | competitions: venue / places[5] / y. |
| competitions.json | `venue.places[6].x` | 86.5 | geometry units | [-256, 256] | competitions: venue / places[6] / x. |
| competitions.json | `venue.places[6].y` | 47.5 | geometry units | [-256, 256] | competitions: venue / places[6] / y. |
| competitions.json | `venue.places[7].x` | 85.5 | geometry units | [-256, 256] | competitions: venue / places[7] / x. |
| competitions.json | `venue.places[7].y` | 47.5 | geometry units | [-256, 256] | competitions: venue / places[7] / y. |
| competitions.json | `venue.arrivalTolerance` | 0.001 | coefficient | [0, 10000000] | competitions: venue / arrival Tolerance. |
| competitions.json | `venue.resultTicks` | 120 | ticks | integer [0, 100000000] | competitions: venue / result Ticks. |
| competitions.json | `workEffects.hunger` | 0 | coefficient | [-10000000, 10000000] | competitions: work Effects / hunger. |
| competitions.json | `workEffects.fatigue` | 6 | coefficient | [-10000000, 10000000] | competitions: work Effects / fatigue. |
| competitions.json | `workEffects.boredom` | -15 | coefficient | [-10000000, 10000000] | competitions: work Effects / boredom. |
| competitions.json | `workEffects.loneliness` | -15 | coefficient | [-10000000, 10000000] | competitions: work Effects / loneliness. |
| competitions.json | `workEffects.stress` | 0 | coefficient | [-10000000, 10000000] | competitions: work Effects / stress. |
| competitions.json | `stakesMultiplier` | 1 | ratio | [0, 1] | competitions: stakes Multiplier. |
| competitions.json | `podiumPlaces` | 3 | coefficient | [0, 10000000] | competitions: podium Places. |
| competitions.json | `autoCompetitions` | false | flag | false, true | Enable automatic competition scheduling in new worlds. |
| competitions.json | `autoCadenceTicks` | 7500 | ticks | integer [0, 100000000] | competitions: auto Cadence Ticks. |
| competitions.json | `brain.interest` | 0.4 | coefficient | [0, 10000000] | Baseline interest in formal events used by the utility brain. |
| competitions.json | `brain.skillWeight` | 0.5 | ratio | [0, 1] | competitions: brain / skill Weight. |
| competitions.json | `brain.aptitudeWeight` | 0.5 | ratio | [0, 1] | competitions: brain / aptitude Weight. |
| competitions.json | `brain.moodWeight` | 0.5 | ratio | [0, 1] | competitions: brain / mood Weight. |
| competitions.json | `brain.rivalryWeight` | 1 | ratio | [0, 1] | competitions: brain / rivalry Weight. |
| competitions.json | `brain.readinessReserve` | 5 | coefficient | [0, 10000000] | competitions: brain / readiness Reserve. |
| competitions.json | `report.levelBands[0]` | 10 | coefficient | [0, 10000000] | competitions: report / level Bands[0]. |
| competitions.json | `report.levelBands[1]` | 25 | coefficient | [0, 10000000] | competitions: report / level Bands[1]. |
| competitions.json | `report.levelBands[2]` | 45 | coefficient | [0, 10000000] | competitions: report / level Bands[2]. |
| competitions.json | `report.levelBands[3]` | 70 | coefficient | [0, 10000000] | competitions: report / level Bands[3]. |
| competitions.json | `report.aptitudeBands[0]` | 0.4 | coefficient | [0, 10000000] | competitions: report / aptitude Bands[0]. |
| competitions.json | `report.aptitudeBands[1]` | 0.6 | coefficient | [0, 10000000] | competitions: report / aptitude Bands[1]. |
| competitions.json | `report.minimumFillRate` | 0.65 | coefficient | [0, 10000000] | competitions: report / minimum Fill Rate. |
| competitions.json | `report.maximumDropShare` | 0.5 | ratio | [0, 1] | competitions: report / maximum Drop Share. |
| competitions.json | `report.seeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | competitions: report / seeds[0]. |
| competitions.json | `report.seeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | competitions: report / seeds[1]. |
| competitions.json | `report.seeds[2]` | 161803 | uint32 seed | integer [0, 4294967295] | competitions: report / seeds[2]. |
| competitions.json | `report.stabilityTicks` | 500000 | ticks | integer [0, 100000000] | competitions: report / stability Ticks. |
| prizes.json | `maximumRankedPrizes` | 3 | prizes / fruit per placement | integer [1, 3] | prizes: maximum Ranked Prizes. |
| prizes.json | `maximumFruitPerPrize` | 3 | prizes / fruit per placement | integer [1, 3] | prizes: maximum Fruit Per Prize. |
| prizes.json | `stackCapacity` | 999 | count | integer [0, 10000000] | prizes: stack Capacity. |
| prizes.json | `looseCapacity` | 256 | count | integer [0, 10000000] | prizes: loose Capacity. |
| prizes.json | `deliveryWindowTicks` | 300 | ticks | integer [0, 100000000] | prizes: delivery Window Ticks. |
| prizes.json | `trophyLimit` | 200 | count | integer [0, 10000000] | prizes: trophy Limit. |
| prizes.json | `xpPeriodTicks` | 1200 | ticks | integer [0, 100000000] | prizes: xp Period Ticks. |
| prizes.json | `xpPerPeriodCap` | 120 | coefficient | [0, 10000000] | prizes: xp Per Period Cap. |
| prizes.json | `confidenceBonus` | 0.03 | coefficient | [0, 10000000] | prizes: confidence Bonus. |
| prizes.json | `confidenceDays` | 1 | habitat days | [0, 10000] | prizes: confidence Days. |
| prizes.json | `rankValence[0]` | 0.2 | coefficient | [-10000000, 10000000] | prizes: rank Valence[0]. |
| prizes.json | `rankValence[1]` | 0.1 | coefficient | [-10000000, 10000000] | prizes: rank Valence[1]. |
| prizes.json | `rankValence[2]` | 0.1 | coefficient | [-10000000, 10000000] | prizes: rank Valence[2]. |
| prizes.json | `otherValence` | 0.03 | coefficient | [-10000000, 10000000] | prizes: other Valence. |
| prizes.json | `starter.fruit.sunapple` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / sunapple. |
| prizes.json | `starter.fruit.dewberry` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / dewberry. |
| prizes.json | `starter.fruit.cloudplum` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / cloudplum. |
| prizes.json | `starter.fruit.vinefig` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / vinefig. |
| prizes.json | `starter.fruit.stonepear` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / stonepear. |
| prizes.json | `starter.fruit.ambermelon` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / ambermelon. |
| prizes.json | `starter.fruit.moonpeach` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / moonpeach. |
| prizes.json | `starter.fruit.sparkcherry` | 0 | inventory tokens | integer [0, 999] | prizes: starter / fruit / sparkcherry. |
| prizes.json | `starter.fruit.prismpear` | 4 | inventory tokens | integer [0, 999] | prizes: starter / fruit / prismpear. |
| prizes.json | `starter.fruit.spiralfruit` | 4 | inventory tokens | integer [0, 999] | prizes: starter / fruit / spiralfruit. |
| prizes.json | `starter.seeds.sunapple` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / sunapple. |
| prizes.json | `starter.seeds.dewberry` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / dewberry. |
| prizes.json | `starter.seeds.cloudplum` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / cloudplum. |
| prizes.json | `starter.seeds.vinefig` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / vinefig. |
| prizes.json | `starter.seeds.stonepear` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / stonepear. |
| prizes.json | `starter.seeds.ambermelon` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / ambermelon. |
| prizes.json | `starter.seeds.moonpeach` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / moonpeach. |
| prizes.json | `starter.seeds.sparkcherry` | 2 | inventory tokens | integer [0, 999] | prizes: starter / seeds / sparkcherry. |
| prizes.json | `starter.seeds.prismpear` | 1 | inventory tokens | integer [0, 999] | prizes: starter / seeds / prismpear. |
| prizes.json | `starter.seeds.spiralfruit` | 1 | inventory tokens | integer [0, 999] | prizes: starter / seeds / spiralfruit. |
| prizes.json | `starter.items.nest` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / nest. |
| prizes.json | `starter.items.bed` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / bed. |
| prizes.json | `starter.items.track` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / track. |
| prizes.json | `starter.items.wind_perch` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / wind_perch. |
| prizes.json | `starter.items.push_stone` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / push_stone. |
| prizes.json | `starter.items.trail_marker` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / trail_marker. |
| prizes.json | `starter.items.toy` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / toy. |
| prizes.json | `starter.items.competition_pad` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / competition_pad. |
| prizes.json | `starter.items.lantern` | 0 | inventory tokens | integer [0, 999] | prizes: starter / items / lantern. |
| prizes.json | `starter.cosmetics.ribbon` | 3 | inventory tokens | integer [0, 999] | prizes: starter / cosmetics / ribbon. |
| prizes.json | `starter.cosmetics.leaf_crown` | 0 | inventory tokens | integer [0, 999] | prizes: starter / cosmetics / leaf_crown. |
| prizes.json | `starter.cosmetics.star_pin` | 0 | inventory tokens | integer [0, 999] | prizes: starter / cosmetics / star_pin. |
| prizes.json | `cache.fruitQuantity` | 2 | tokens per daily cache | integer [0, 999] | prizes: cache / fruit Quantity. |
| prizes.json | `cache.seedQuantity` | 1 | tokens per daily cache | integer [0, 999] | prizes: cache / seed Quantity. |
| prizes.json | `cache.cosmeticQuantity` | 1 | tokens per daily cache | integer [0, 999] | prizes: cache / cosmetic Quantity. |
| prizes.json | `autoPrizes` | false | flag | false, true | Fund automatically scheduled events from inventory. |
| prizes.json | `auto[0].placements[0].rank` | 1 | placement rank | integer [1, 3] | prizes: auto[0] / placements[0] / rank. |
| prizes.json | `auto[0].placements[0].quantity` | 1 | prize tokens | integer [1, 3] | prizes: auto[0] / placements[0] / quantity. |
| prizes.json | `auto[0].placements[1].rank` | 2 | placement rank | integer [1, 3] | prizes: auto[0] / placements[1] / rank. |
| prizes.json | `auto[0].placements[1].quantity` | 1 | prize tokens | integer [1, 3] | prizes: auto[0] / placements[1] / quantity. |
| prizes.json | `auto[0].placements[2].rank` | 3 | placement rank | integer [1, 3] | prizes: auto[0] / placements[2] / rank. |
| prizes.json | `auto[0].placements[2].quantity` | 1 | prize tokens | integer [1, 1] | prizes: auto[0] / placements[2] / quantity. |
| prizes.json | `auto[1].placements[0].rank` | 1 | placement rank | integer [1, 3] | prizes: auto[1] / placements[0] / rank. |
| prizes.json | `auto[1].placements[0].quantity` | 1 | prize tokens | integer [1, 1] | prizes: auto[1] / placements[0] / quantity. |
| prizes.json | `auto[1].placements[1].rank` | 2 | placement rank | integer [1, 3] | prizes: auto[1] / placements[1] / rank. |
| prizes.json | `auto[1].placements[1].quantity` | 1 | prize tokens | integer [1, 3] | prizes: auto[1] / placements[1] / quantity. |
| prizes.json | `auto[1].placements[2].rank` | 3 | placement rank | integer [1, 3] | prizes: auto[1] / placements[2] / rank. |
| prizes.json | `auto[1].placements[2].quantity` | 1 | prize tokens | integer [1, 1] | prizes: auto[1] / placements[2] / quantity. |
| prizes.json | `auto[2].placements[0].rank` | 1 | placement rank | integer [1, 3] | prizes: auto[2] / placements[0] / rank. |
| prizes.json | `auto[2].placements[0].quantity` | 1 | prize tokens | integer [1, 1] | prizes: auto[2] / placements[0] / quantity. |
| prizes.json | `auto[2].placements[1].rank` | 2 | placement rank | integer [1, 3] | prizes: auto[2] / placements[1] / rank. |
| prizes.json | `auto[2].placements[1].quantity` | 1 | prize tokens | integer [1, 3] | prizes: auto[2] / placements[1] / quantity. |
| prizes.json | `auto[2].placements[2].rank` | 3 | placement rank | integer [1, 3] | prizes: auto[2] / placements[2] / rank. |
| prizes.json | `auto[2].placements[2].quantity` | 1 | prize tokens | integer [1, 1] | prizes: auto[2] / placements[2] / quantity. |
| prizes.json | `report.maximumWinShare` | 0.35 | ratio | [0, 1] | prizes: report / maximum Win Share. |
| skills.json | `run.xpLinear` | 8 | XP/level | [0, 1000] | skills: run / xp Linear. |
| skills.json | `run.xpQuadratic` | 2 | XP/level squared | [1e-12, 1000] | skills: run / xp Quadratic. |
| skills.json | `run.levelCap` | 100 | skill levels | integer [0, 100] | skills: run / level Cap. |
| skills.json | `swim.xpLinear` | 8 | XP/level | [0, 1000] | skills: swim / xp Linear. |
| skills.json | `swim.xpQuadratic` | 2 | XP/level squared | [1e-12, 1000] | skills: swim / xp Quadratic. |
| skills.json | `swim.levelCap` | 100 | skill levels | integer [0, 100] | skills: swim / level Cap. |
| skills.json | `fly.xpLinear` | 8 | XP/level | [0, 1000] | skills: fly / xp Linear. |
| skills.json | `fly.xpQuadratic` | 2 | XP/level squared | [1e-12, 1000] | skills: fly / xp Quadratic. |
| skills.json | `fly.levelCap` | 100 | skill levels | integer [0, 100] | skills: fly / level Cap. |
| skills.json | `strength.xpLinear` | 8 | XP/level | [0, 1000] | skills: strength / xp Linear. |
| skills.json | `strength.xpQuadratic` | 2 | XP/level squared | [1e-12, 1000] | skills: strength / xp Quadratic. |
| skills.json | `strength.levelCap` | 100 | skill levels | integer [0, 100] | skills: strength / level Cap. |
| skills.json | `stamina.xpLinear` | 8 | XP/level | [0, 1000] | skills: stamina / xp Linear. |
| skills.json | `stamina.xpQuadratic` | 2 | XP/level squared | [1e-12, 1000] | skills: stamina / xp Quadratic. |
| skills.json | `stamina.levelCap` | 100 | skill levels | integer [0, 100] | skills: stamina / level Cap. |
| fruits.json | `sunapple.effects.hunger` | -30 | coefficient | [-10000000, 10000000] | fruits: sunapple / effects / hunger. |
| fruits.json | `sunapple.effects.fatigue` | 0 | coefficient | [-10000000, 10000000] | fruits: sunapple / effects / fatigue. |
| fruits.json | `sunapple.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: sunapple / effects / boredom. |
| fruits.json | `sunapple.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: sunapple / effects / loneliness. |
| fruits.json | `sunapple.effects.stress` | -2 | coefficient | [-10000000, 10000000] | fruits: sunapple / effects / stress. |
| fruits.json | `sunapple.taste.sweet` | 0.9 | ratio | [0, 1] | fruits: sunapple / taste / sweet. |
| fruits.json | `sunapple.taste.tart` | 0.3 | ratio | [0, 1] | fruits: sunapple / taste / tart. |
| fruits.json | `sunapple.taste.earthy` | 0.1 | ratio | [0, 1] | fruits: sunapple / taste / earthy. |
| fruits.json | `sunapple.growthTicks` | 180 | ticks | integer [1, 10000000] | fruits: sunapple / growth Ticks. |
| fruits.json | `sunapple.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: sunapple / capacity. |
| fruits.json | `sunapple.skillBonuses.run` | 0.25 | ratio | [0, 1] | fruits: sunapple / skill Bonuses / run. |
| fruits.json | `sunapple.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: sunapple / skill Bonus Duration Ticks. |
| fruits.json | `sunapple.appearance.exposure.palette` | 0.02 | ratio | [0, 1] | fruits: sunapple / appearance / exposure / palette. |
| fruits.json | `sunapple.appearance.exposure.body` | 0 | ratio | [0, 1] | fruits: sunapple / appearance / exposure / body. |
| fruits.json | `sunapple.appearance.exposure.aptitude` | 0.02 | ratio | [0, 1] | fruits: sunapple / appearance / exposure / aptitude. |
| fruits.json | `sunapple.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `dewberry.effects.hunger` | -26 | coefficient | [-10000000, 10000000] | fruits: dewberry / effects / hunger. |
| fruits.json | `dewberry.effects.fatigue` | -4 | coefficient | [-10000000, 10000000] | fruits: dewberry / effects / fatigue. |
| fruits.json | `dewberry.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: dewberry / effects / boredom. |
| fruits.json | `dewberry.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: dewberry / effects / loneliness. |
| fruits.json | `dewberry.effects.stress` | -3 | coefficient | [-10000000, 10000000] | fruits: dewberry / effects / stress. |
| fruits.json | `dewberry.taste.sweet` | 0.6 | ratio | [0, 1] | fruits: dewberry / taste / sweet. |
| fruits.json | `dewberry.taste.tart` | 0.7 | ratio | [0, 1] | fruits: dewberry / taste / tart. |
| fruits.json | `dewberry.taste.earthy` | 0.1 | ratio | [0, 1] | fruits: dewberry / taste / earthy. |
| fruits.json | `dewberry.growthTicks` | 150 | ticks | integer [1, 10000000] | fruits: dewberry / growth Ticks. |
| fruits.json | `dewberry.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: dewberry / capacity. |
| fruits.json | `dewberry.skillBonuses.swim` | 0.25 | ratio | [0, 1] | fruits: dewberry / skill Bonuses / swim. |
| fruits.json | `dewberry.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: dewberry / skill Bonus Duration Ticks. |
| fruits.json | `dewberry.appearance.exposure.palette` | 0.04 | ratio | [0, 1] | fruits: dewberry / appearance / exposure / palette. |
| fruits.json | `dewberry.appearance.exposure.body` | 0 | ratio | [0, 1] | fruits: dewberry / appearance / exposure / body. |
| fruits.json | `dewberry.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: dewberry / appearance / exposure / aptitude. |
| fruits.json | `dewberry.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `cloudplum.effects.hunger` | -24 | coefficient | [-10000000, 10000000] | fruits: cloudplum / effects / hunger. |
| fruits.json | `cloudplum.effects.fatigue` | 0 | coefficient | [-10000000, 10000000] | fruits: cloudplum / effects / fatigue. |
| fruits.json | `cloudplum.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: cloudplum / effects / boredom. |
| fruits.json | `cloudplum.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: cloudplum / effects / loneliness. |
| fruits.json | `cloudplum.effects.stress` | -4 | coefficient | [-10000000, 10000000] | fruits: cloudplum / effects / stress. |
| fruits.json | `cloudplum.taste.sweet` | 0.7 | ratio | [0, 1] | fruits: cloudplum / taste / sweet. |
| fruits.json | `cloudplum.taste.tart` | 0.4 | ratio | [0, 1] | fruits: cloudplum / taste / tart. |
| fruits.json | `cloudplum.taste.earthy` | 0.2 | ratio | [0, 1] | fruits: cloudplum / taste / earthy. |
| fruits.json | `cloudplum.growthTicks` | 180 | ticks | integer [1, 10000000] | fruits: cloudplum / growth Ticks. |
| fruits.json | `cloudplum.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: cloudplum / capacity. |
| fruits.json | `cloudplum.skillBonuses.fly` | 0.25 | ratio | [0, 1] | fruits: cloudplum / skill Bonuses / fly. |
| fruits.json | `cloudplum.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: cloudplum / skill Bonus Duration Ticks. |
| fruits.json | `cloudplum.appearance.exposure.palette` | 0.02 | ratio | [0, 1] | fruits: cloudplum / appearance / exposure / palette. |
| fruits.json | `cloudplum.appearance.exposure.body` | 0 | ratio | [0, 1] | fruits: cloudplum / appearance / exposure / body. |
| fruits.json | `cloudplum.appearance.exposure.aptitude` | 0.03 | ratio | [0, 1] | fruits: cloudplum / appearance / exposure / aptitude. |
| fruits.json | `cloudplum.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `vinefig.effects.hunger` | -32 | coefficient | [-10000000, 10000000] | fruits: vinefig / effects / hunger. |
| fruits.json | `vinefig.effects.fatigue` | 2 | coefficient | [-10000000, 10000000] | fruits: vinefig / effects / fatigue. |
| fruits.json | `vinefig.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: vinefig / effects / boredom. |
| fruits.json | `vinefig.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: vinefig / effects / loneliness. |
| fruits.json | `vinefig.effects.stress` | -2 | coefficient | [-10000000, 10000000] | fruits: vinefig / effects / stress. |
| fruits.json | `vinefig.taste.sweet` | 0.5 | ratio | [0, 1] | fruits: vinefig / taste / sweet. |
| fruits.json | `vinefig.taste.tart` | 0.2 | ratio | [0, 1] | fruits: vinefig / taste / tart. |
| fruits.json | `vinefig.taste.earthy` | 0.8 | ratio | [0, 1] | fruits: vinefig / taste / earthy. |
| fruits.json | `vinefig.growthTicks` | 180 | ticks | integer [1, 10000000] | fruits: vinefig / growth Ticks. |
| fruits.json | `vinefig.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: vinefig / capacity. |
| fruits.json | `vinefig.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: vinefig / skill Bonus Duration Ticks. |
| fruits.json | `vinefig.appearance.exposure.palette` | 0 | ratio | [0, 1] | fruits: vinefig / appearance / exposure / palette. |
| fruits.json | `vinefig.appearance.exposure.body` | 0.04 | ratio | [0, 1] | fruits: vinefig / appearance / exposure / body. |
| fruits.json | `vinefig.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: vinefig / appearance / exposure / aptitude. |
| fruits.json | `vinefig.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `stonepear.effects.hunger` | -38 | coefficient | [-10000000, 10000000] | fruits: stonepear / effects / hunger. |
| fruits.json | `stonepear.effects.fatigue` | 4 | coefficient | [-10000000, 10000000] | fruits: stonepear / effects / fatigue. |
| fruits.json | `stonepear.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: stonepear / effects / boredom. |
| fruits.json | `stonepear.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: stonepear / effects / loneliness. |
| fruits.json | `stonepear.effects.stress` | -1 | coefficient | [-10000000, 10000000] | fruits: stonepear / effects / stress. |
| fruits.json | `stonepear.taste.sweet` | 0.3 | ratio | [0, 1] | fruits: stonepear / taste / sweet. |
| fruits.json | `stonepear.taste.tart` | 0.2 | ratio | [0, 1] | fruits: stonepear / taste / tart. |
| fruits.json | `stonepear.taste.earthy` | 0.9 | ratio | [0, 1] | fruits: stonepear / taste / earthy. |
| fruits.json | `stonepear.growthTicks` | 240 | ticks | integer [1, 10000000] | fruits: stonepear / growth Ticks. |
| fruits.json | `stonepear.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: stonepear / capacity. |
| fruits.json | `stonepear.skillBonuses.strength` | 0.25 | ratio | [0, 1] | fruits: stonepear / skill Bonuses / strength. |
| fruits.json | `stonepear.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: stonepear / skill Bonus Duration Ticks. |
| fruits.json | `stonepear.appearance.exposure.palette` | 0 | ratio | [0, 1] | fruits: stonepear / appearance / exposure / palette. |
| fruits.json | `stonepear.appearance.exposure.body` | 0.04 | ratio | [0, 1] | fruits: stonepear / appearance / exposure / body. |
| fruits.json | `stonepear.appearance.exposure.aptitude` | 0.01 | ratio | [0, 1] | fruits: stonepear / appearance / exposure / aptitude. |
| fruits.json | `stonepear.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `ambermelon.effects.hunger` | -40 | coefficient | [-10000000, 10000000] | fruits: ambermelon / effects / hunger. |
| fruits.json | `ambermelon.effects.fatigue` | -8 | coefficient | [-10000000, 10000000] | fruits: ambermelon / effects / fatigue. |
| fruits.json | `ambermelon.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: ambermelon / effects / boredom. |
| fruits.json | `ambermelon.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: ambermelon / effects / loneliness. |
| fruits.json | `ambermelon.effects.stress` | -3 | coefficient | [-10000000, 10000000] | fruits: ambermelon / effects / stress. |
| fruits.json | `ambermelon.taste.sweet` | 0.8 | ratio | [0, 1] | fruits: ambermelon / taste / sweet. |
| fruits.json | `ambermelon.taste.tart` | 0.2 | ratio | [0, 1] | fruits: ambermelon / taste / tart. |
| fruits.json | `ambermelon.taste.earthy` | 0.3 | ratio | [0, 1] | fruits: ambermelon / taste / earthy. |
| fruits.json | `ambermelon.growthTicks` | 240 | ticks | integer [1, 10000000] | fruits: ambermelon / growth Ticks. |
| fruits.json | `ambermelon.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: ambermelon / capacity. |
| fruits.json | `ambermelon.skillBonuses.stamina` | 0.25 | ratio | [0, 1] | fruits: ambermelon / skill Bonuses / stamina. |
| fruits.json | `ambermelon.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: ambermelon / skill Bonus Duration Ticks. |
| fruits.json | `ambermelon.appearance.exposure.palette` | 0.02 | ratio | [0, 1] | fruits: ambermelon / appearance / exposure / palette. |
| fruits.json | `ambermelon.appearance.exposure.body` | 0.02 | ratio | [0, 1] | fruits: ambermelon / appearance / exposure / body. |
| fruits.json | `ambermelon.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: ambermelon / appearance / exposure / aptitude. |
| fruits.json | `ambermelon.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `moonpeach.effects.hunger` | -26 | coefficient | [-10000000, 10000000] | fruits: moonpeach / effects / hunger. |
| fruits.json | `moonpeach.effects.fatigue` | 8 | coefficient | [-10000000, 10000000] | fruits: moonpeach / effects / fatigue. |
| fruits.json | `moonpeach.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: moonpeach / effects / boredom. |
| fruits.json | `moonpeach.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: moonpeach / effects / loneliness. |
| fruits.json | `moonpeach.effects.stress` | -14 | coefficient | [-10000000, 10000000] | fruits: moonpeach / effects / stress. |
| fruits.json | `moonpeach.taste.sweet` | 0.8 | ratio | [0, 1] | fruits: moonpeach / taste / sweet. |
| fruits.json | `moonpeach.taste.tart` | 0.1 | ratio | [0, 1] | fruits: moonpeach / taste / tart. |
| fruits.json | `moonpeach.taste.earthy` | 0.4 | ratio | [0, 1] | fruits: moonpeach / taste / earthy. |
| fruits.json | `moonpeach.growthTicks` | 210 | ticks | integer [1, 10000000] | fruits: moonpeach / growth Ticks. |
| fruits.json | `moonpeach.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: moonpeach / capacity. |
| fruits.json | `moonpeach.skillBonuses.stamina` | 0.1 | ratio | [0, 1] | fruits: moonpeach / skill Bonuses / stamina. |
| fruits.json | `moonpeach.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: moonpeach / skill Bonus Duration Ticks. |
| fruits.json | `moonpeach.appearance.exposure.palette` | 0.03 | ratio | [0, 1] | fruits: moonpeach / appearance / exposure / palette. |
| fruits.json | `moonpeach.appearance.exposure.body` | 0 | ratio | [0, 1] | fruits: moonpeach / appearance / exposure / body. |
| fruits.json | `moonpeach.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: moonpeach / appearance / exposure / aptitude. |
| fruits.json | `moonpeach.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `sparkcherry.effects.hunger` | -20 | coefficient | [-10000000, 10000000] | fruits: sparkcherry / effects / hunger. |
| fruits.json | `sparkcherry.effects.fatigue` | -12 | coefficient | [-10000000, 10000000] | fruits: sparkcherry / effects / fatigue. |
| fruits.json | `sparkcherry.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: sparkcherry / effects / boredom. |
| fruits.json | `sparkcherry.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: sparkcherry / effects / loneliness. |
| fruits.json | `sparkcherry.effects.stress` | 4 | coefficient | [-10000000, 10000000] | fruits: sparkcherry / effects / stress. |
| fruits.json | `sparkcherry.taste.sweet` | 0.4 | ratio | [0, 1] | fruits: sparkcherry / taste / sweet. |
| fruits.json | `sparkcherry.taste.tart` | 1 | ratio | [0, 1] | fruits: sparkcherry / taste / tart. |
| fruits.json | `sparkcherry.taste.earthy` | 0.1 | ratio | [0, 1] | fruits: sparkcherry / taste / earthy. |
| fruits.json | `sparkcherry.growthTicks` | 150 | ticks | integer [1, 10000000] | fruits: sparkcherry / growth Ticks. |
| fruits.json | `sparkcherry.capacity` | 6 | fruit capacity | integer [1, 10000000] | fruits: sparkcherry / capacity. |
| fruits.json | `sparkcherry.skillBonuses.run` | 0.15 | ratio | [0, 1] | fruits: sparkcherry / skill Bonuses / run. |
| fruits.json | `sparkcherry.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: sparkcherry / skill Bonus Duration Ticks. |
| fruits.json | `sparkcherry.appearance.exposure.palette` | 0 | ratio | [0, 1] | fruits: sparkcherry / appearance / exposure / palette. |
| fruits.json | `sparkcherry.appearance.exposure.body` | 0.02 | ratio | [0, 1] | fruits: sparkcherry / appearance / exposure / body. |
| fruits.json | `sparkcherry.appearance.exposure.aptitude` | 0.03 | ratio | [0, 1] | fruits: sparkcherry / appearance / exposure / aptitude. |
| fruits.json | `sparkcherry.rare` | false | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `prismpear.effects.hunger` | -30 | coefficient | [-10000000, 10000000] | fruits: prismpear / effects / hunger. |
| fruits.json | `prismpear.effects.fatigue` | 0 | coefficient | [-10000000, 10000000] | fruits: prismpear / effects / fatigue. |
| fruits.json | `prismpear.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: prismpear / effects / boredom. |
| fruits.json | `prismpear.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: prismpear / effects / loneliness. |
| fruits.json | `prismpear.effects.stress` | -6 | coefficient | [-10000000, 10000000] | fruits: prismpear / effects / stress. |
| fruits.json | `prismpear.taste.sweet` | 0.7 | ratio | [0, 1] | fruits: prismpear / taste / sweet. |
| fruits.json | `prismpear.taste.tart` | 0.6 | ratio | [0, 1] | fruits: prismpear / taste / tart. |
| fruits.json | `prismpear.taste.earthy` | 0.3 | ratio | [0, 1] | fruits: prismpear / taste / earthy. |
| fruits.json | `prismpear.growthTicks` | 600 | ticks | integer [1, 10000000] | fruits: prismpear / growth Ticks. |
| fruits.json | `prismpear.capacity` | 3 | fruit capacity | integer [1, 10000000] | fruits: prismpear / capacity. |
| fruits.json | `prismpear.skillBonuses.fly` | 0.2 | ratio | [0, 1] | fruits: prismpear / skill Bonuses / fly. |
| fruits.json | `prismpear.skillBonuses.swim` | 0.2 | ratio | [0, 1] | fruits: prismpear / skill Bonuses / swim. |
| fruits.json | `prismpear.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: prismpear / skill Bonus Duration Ticks. |
| fruits.json | `prismpear.appearance.exposure.palette` | 0.16 | ratio | [0, 1] | fruits: prismpear / appearance / exposure / palette. |
| fruits.json | `prismpear.appearance.exposure.body` | 0 | ratio | [0, 1] | fruits: prismpear / appearance / exposure / body. |
| fruits.json | `prismpear.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: prismpear / appearance / exposure / aptitude. |
| fruits.json | `prismpear.rare` | true | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| fruits.json | `spiralfruit.effects.hunger` | -34 | coefficient | [-10000000, 10000000] | fruits: spiralfruit / effects / hunger. |
| fruits.json | `spiralfruit.effects.fatigue` | 2 | coefficient | [-10000000, 10000000] | fruits: spiralfruit / effects / fatigue. |
| fruits.json | `spiralfruit.effects.boredom` | -4 | coefficient | [-10000000, 10000000] | fruits: spiralfruit / effects / boredom. |
| fruits.json | `spiralfruit.effects.loneliness` | 0 | coefficient | [-10000000, 10000000] | fruits: spiralfruit / effects / loneliness. |
| fruits.json | `spiralfruit.effects.stress` | -6 | coefficient | [-10000000, 10000000] | fruits: spiralfruit / effects / stress. |
| fruits.json | `spiralfruit.taste.sweet` | 0.5 | ratio | [0, 1] | fruits: spiralfruit / taste / sweet. |
| fruits.json | `spiralfruit.taste.tart` | 0.4 | ratio | [0, 1] | fruits: spiralfruit / taste / tart. |
| fruits.json | `spiralfruit.taste.earthy` | 0.9 | ratio | [0, 1] | fruits: spiralfruit / taste / earthy. |
| fruits.json | `spiralfruit.growthTicks` | 600 | ticks | integer [1, 10000000] | fruits: spiralfruit / growth Ticks. |
| fruits.json | `spiralfruit.capacity` | 3 | fruit capacity | integer [1, 10000000] | fruits: spiralfruit / capacity. |
| fruits.json | `spiralfruit.skillBonuses.strength` | 0.2 | ratio | [0, 1] | fruits: spiralfruit / skill Bonuses / strength. |
| fruits.json | `spiralfruit.skillBonusDurationTicks` | 600 | ticks | integer [1, 10000000] | fruits: spiralfruit / skill Bonus Duration Ticks. |
| fruits.json | `spiralfruit.appearance.exposure.palette` | 0 | ratio | [0, 1] | fruits: spiralfruit / appearance / exposure / palette. |
| fruits.json | `spiralfruit.appearance.exposure.body` | 0.16 | ratio | [0, 1] | fruits: spiralfruit / appearance / exposure / body. |
| fruits.json | `spiralfruit.appearance.exposure.aptitude` | 0 | ratio | [0, 1] | fruits: spiralfruit / appearance / exposure / aptitude. |
| fruits.json | `spiralfruit.rare` | true | flag | false, true | Whether this fruit is restricted to rewards rather than ordinary sources. |
| offline.json | `enabled` | true | flag | false, true | Enable exact offline progression. |
| offline.json | `ticksPerRealSecond` | 1 | ticks | integer [0, 100000000] | offline: ticks Per Real Second. |
| offline.json | `offlineRateMultiplier` | 0.25 | ratio | [0, 1] | offline: offline Rate Multiplier. |
| offline.json | `maxCatchUpTicks` | 18000 | ticks | integer [0, 100000000] | offline: max Catch Up Ticks. |
| offline.json | `minAwaySeconds` | 5 | seconds | [0, 86400] | offline: min Away Seconds. |
| offline.json | `stallThresholdSeconds` | 5 | seconds | [0, 86400] | offline: stall Threshold Seconds. |
| offline.json | `sliceBudgetMs` | 8 | milliseconds | [1e-12, 3600000] | offline: slice Budget Ms. |
| offline.json | `minTicksPerSlice` | 1 | ticks | integer [1, 100000000] | offline: min Ticks Per Slice. |
| offline.json | `maxTicksPerSlice` | 32 | ticks | integer [1, 100000000] | offline: max Ticks Per Slice. |
| offline.json | `autosaveIntervalSeconds` | 15 | seconds | [1e-12, 86400] | offline: autosave Interval Seconds. |
| offline.json | `summary.notableLimit` | 12 | count | integer [0, 10000000] | offline: summary / notable Limit. |
| offline.json | `summary.skillMilestones[0]` | 10 | coefficient | [0, 10000000] | offline: summary / skill Milestones[0]. |
| offline.json | `summary.skillMilestones[1]` | 25 | coefficient | [0, 10000000] | offline: summary / skill Milestones[1]. |
| offline.json | `summary.skillMilestones[2]` | 45 | coefficient | [0, 10000000] | offline: summary / skill Milestones[2]. |
| offline.json | `summary.skillMilestones[3]` | 70 | coefficient | [0, 10000000] | offline: summary / skill Milestones[3]. |
| offline.json | `summary.priorities.rescue` | 100 | coefficient | [0, 10000000] | offline: summary / priorities / rescue. |
| offline.json | `summary.priorities.death` | 90 | coefficient | [0, 10000000] | offline: summary / priorities / death. |
| offline.json | `summary.priorities.rebirth` | 85 | coefficient | [0, 10000000] | offline: summary / priorities / rebirth. |
| offline.json | `summary.priorities.eggLaid` | 80 | coefficient | [0, 10000000] | offline: summary / priorities / egg Laid. |
| offline.json | `summary.priorities.hatch` | 75 | coefficient | [0, 10000000] | offline: summary / priorities / hatch. |
| offline.json | `summary.priorities.competitionResult` | 95 | coefficient | [0, 10000000] | offline: summary / priorities / competition Result. |
| offline.json | `summary.priorities.prizeAwarded` | 65 | coefficient | [0, 10000000] | offline: summary / priorities / prize Awarded. |
| offline.json | `summary.priorities.mateBondFormed` | 60 | coefficient | [-10000000, 10000000] | offline: summary / priorities / mate Bond Formed. |
| offline.json | `summary.priorities.bodyPart` | 55 | coefficient | [0, 10000000] | offline: summary / priorities / body Part. |
| offline.json | `summary.priorities.skillMilestone` | 50 | coefficient | [0, 10000000] | offline: summary / priorities / skill Milestone. |
| offline.json | `summary.priorities.friendship` | 45 | coefficient | [0, 10000000] | offline: summary / priorities / friendship. |
| offline.json | `summary.priorities.rivalry` | 40 | coefficient | [0, 10000000] | offline: summary / priorities / rivalry. |
| offline.json | `summary.priorities.competitionCancelled` | 35 | coefficient | [0, 10000000] | offline: summary / priorities / competition Cancelled. |
| offline.json | `summary.priorities.spawn` | 30 | coefficient | [0, 10000000] | offline: summary / priorities / spawn. |
| offline.json | `archive.maintenanceTicks` | 1200 | ticks | integer [1, 100000000] | offline: archive / maintenance Ticks. |
| offline.json | `archive.minimumAgeTicks` | 1000000 | ticks | integer [0, 100000000] | offline: archive / minimum Age Ticks. |
| offline.json | `archive.stubGenerationHorizon` | 8 | coefficient | [0, 10000000] | offline: archive / stub Generation Horizon. |
| offline.json | `archive.dropGenerationHorizon` | 16 | coefficient | [0, 10000000] | offline: archive / drop Generation Horizon. |
| offline.json | `archive.maximumFullRecords` | 4096 | count | integer [0, 10000000] | offline: archive / maximum Full Records. |
| offline.json | `archive.maximumStubs` | 2048 | count | integer [0, 10000000] | offline: archive / maximum Stubs. |
| offline.json | `archive.saveByteBudget` | 4194304 | bytes | integer [1, 1073741824] | offline: archive / save Byte Budget. |
| offline.json | `bench.seed` | 271828 | uint32 seed | integer [0, 4294967295] | offline: bench / seed. |
| offline.json | `bench.warmupTicks` | 1000 | ticks | integer [0, 100000000] | offline: bench / warmup Ticks. |
| offline.json | `bench.measuredTicks` | 10000 | ticks | integer [1, 100000000] | offline: bench / measured Ticks. |
| offline.json | `bench.populations[0]` | 1 | coefficient | [0, 10000000] | offline: bench / populations[0]. |
| offline.json | `bench.populations[1]` | 10 | coefficient | [0, 10000000] | offline: bench / populations[1]. |
| offline.json | `bench.populations[2]` | 30 | coefficient | [0, 10000000] | offline: bench / populations[2]. |
| offline.json | `bench.targetCatchUpSeconds` | 20 | seconds | [0, 86400] | offline: bench / target Catch Up Seconds. |
| health.json | `full.ticks` | 500000 | ticks | integer [1, 100000000] | health: full / ticks. |
| health.json | `full.seeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | World seed included in the full balance profile. |
| health.json | `full.seeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | World seed included in the full balance profile. |
| health.json | `full.seeds[2]` | 161803 | uint32 seed | integer [0, 4294967295] | World seed included in the full balance profile. |
| health.json | `full.seeds[3]` | 57721 | uint32 seed | integer [0, 4294967295] | World seed included in the full balance profile. |
| health.json | `full.seeds[4]` | 141421 | uint32 seed | integer [0, 4294967295] | World seed included in the full balance profile. |
| health.json | `full.sampleEveryTicks` | 1000 | ticks | integer [1, 100000000] | health: full / sample Every Ticks. |
| health.json | `full.bands.population.mean[0]` | 12 | creatures | [0, 30] | full population.mean: lower acceptance bound. |
| health.json | `full.bands.population.mean[1]` | 24 | creatures | [0, 30] | full population.mean: upper acceptance bound. |
| health.json | `full.bands.population.minimum[0]` | 1 | creatures | [0, 30] | full population.minimum: lower acceptance bound. |
| health.json | `full.bands.population.minimum[1]` | 30 | creatures | [0, 30] | full population.minimum: upper acceptance bound. |
| health.json | `full.bands.population.maximum[0]` | 12 | creatures | [0, 30] | full population.maximum: lower acceptance bound. |
| health.json | `full.bands.population.maximum[1]` | 30 | creatures | [0, 30] | full population.maximum: upper acceptance bound. |
| health.json | `full.bands.population.rescues[0]` | 0 | count | [0, 10000000] | full population.rescues: lower acceptance bound. |
| health.json | `full.bands.population.rescues[1]` | 0 | count | [0, 10000000] | full population.rescues: upper acceptance bound. |
| health.json | `full.bands.population.starvationDeaths[0]` | 0 | count | [0, 10000000] | full population.starvationDeaths: lower acceptance bound. |
| health.json | `full.bands.population.starvationDeaths[1]` | 0 | count | [0, 10000000] | full population.starvationDeaths: upper acceptance bound. |
| health.json | `full.bands.population.exhaustionDeaths[0]` | 0 | count | [0, 10000000] | full population.exhaustionDeaths: lower acceptance bound. |
| health.json | `full.bands.population.exhaustionDeaths[1]` | 0 | count | [0, 10000000] | full population.exhaustionDeaths: upper acceptance bound. |
| health.json | `full.bands.life.meanLifespan[0]` | 58200 | ticks | [0, 100000000] | full life.meanLifespan: lower acceptance bound. |
| health.json | `full.bands.life.meanLifespan[1]` | 58800 | ticks | [0, 100000000] | full life.meanLifespan: upper acceptance bound. |
| health.json | `full.bands.life.generationsPer100k[0]` | 0.2 | generations per 100,000 ticks | [0, 10000000] | full life.generationsPer100k: lower acceptance bound. |
| health.json | `full.bands.life.generationsPer100k[1]` | 20 | generations per 100,000 ticks | [0, 10000000] | full life.generationsPer100k: upper acceptance bound. |
| health.json | `full.bands.genetics.minimumDiversity[0]` | 0.4 | fraction | [0, 1] | full genetics.minimumDiversity: lower acceptance bound. |
| health.json | `full.bands.genetics.minimumDiversity[1]` | 1 | fraction | [0, 1] | full genetics.minimumDiversity: upper acceptance bound. |
| health.json | `full.bands.genetics.minimumAlleles[0]` | 2 | distinct quantitative allele values per locus | [0, 256] | full genetics.minimumAlleles: lower acceptance bound. |
| health.json | `full.bands.genetics.minimumAlleles[1]` | 60 | distinct quantitative allele values per locus | [0, 256] | full genetics.minimumAlleles: upper acceptance bound. |
| health.json | `full.bands.genetics.aptitudeDrift[0]` | 0 | fraction | [0, 1] | full genetics.aptitudeDrift: lower acceptance bound. |
| health.json | `full.bands.genetics.aptitudeDrift[1]` | 0.3 | fraction | [0, 1] | full genetics.aptitudeDrift: upper acceptance bound. |
| health.json | `full.bands.skills.meanCapFraction[0]` | 0.05 | fraction | [0, 1] | full skills.meanCapFraction: lower acceptance bound. |
| health.json | `full.bands.skills.meanCapFraction[1]` | 0.9 | fraction | [0, 1] | full skills.meanCapFraction: upper acceptance bound. |
| health.json | `full.bands.skills.maxedShare[0]` | 0 | fraction | [0, 1] | full skills.maxedShare: lower acceptance bound. |
| health.json | `full.bands.skills.maxedShare[1]` | 0.8 | fraction | [0, 1] | full skills.maxedShare: upper acceptance bound. |
| health.json | `full.bands.skills.dominantShare[0]` | 0 | fraction | [0, 1] | full skills.dominantShare: lower acceptance bound. |
| health.json | `full.bands.skills.dominantShare[1]` | 0.7 | fraction | [0, 1] | full skills.dominantShare: upper acceptance bound. |
| health.json | `full.bands.skills.partsPerAdult[0]` | 2 | earned attachments per adult | [0, 10000000] | full skills.partsPerAdult: lower acceptance bound. |
| health.json | `full.bands.skills.partsPerAdult[1]` | 12 | earned attachments per adult | [0, 10000000] | full skills.partsPerAdult: upper acceptance bound. |
| health.json | `full.bands.behavior.selfCare[0]` | 0.05 | fraction | [0, 1] | full behavior.selfCare: lower acceptance bound. |
| health.json | `full.bands.behavior.selfCare[1]` | 0.85 | fraction | [0, 1] | full behavior.selfCare: upper acceptance bound. |
| health.json | `full.bands.behavior.rest[0]` | 0.01 | fraction | [0, 1] | full behavior.rest: lower acceptance bound. |
| health.json | `full.bands.behavior.rest[1]` | 0.8 | fraction | [0, 1] | full behavior.rest: upper acceptance bound. |
| health.json | `full.bands.behavior.training[0]` | 0.005 | fraction | [0, 1] | full behavior.training: lower acceptance bound. |
| health.json | `full.bands.behavior.training[1]` | 0.9 | fraction | [0, 1] | full behavior.training: upper acceptance bound. |
| health.json | `full.bands.behavior.social[0]` | 0.0001 | fraction | [0, 1] | full behavior.social: lower acceptance bound. |
| health.json | `full.bands.behavior.social[1]` | 0.8 | fraction | [0, 1] | full behavior.social: upper acceptance bound. |
| health.json | `full.bands.behavior.travel[0]` | 0 | fraction | [0, 1] | full behavior.travel: lower acceptance bound. |
| health.json | `full.bands.behavior.travel[1]` | 0.8 | fraction | [0, 1] | full behavior.travel: upper acceptance bound. |
| health.json | `full.bands.social.positiveShare[0]` | 0.05 | fraction | [0, 1] | full social.positiveShare: lower acceptance bound. |
| health.json | `full.bands.social.positiveShare[1]` | 0.995 | fraction | [0, 1] | full social.positiveShare: upper acceptance bound. |
| health.json | `full.bands.social.meanDegree[0]` | 1 | relationships per creature | [0, 29] | full social.meanDegree: lower acceptance bound. |
| health.json | `full.bands.social.meanDegree[1]` | 16 | relationships per creature | [0, 29] | full social.meanDegree: upper acceptance bound. |
| health.json | `full.bands.social.maximumDegree[0]` | 1 | relationships per creature | [0, 29] | full social.maximumDegree: lower acceptance bound. |
| health.json | `full.bands.social.maximumDegree[1]` | 16 | relationships per creature | [0, 29] | full social.maximumDegree: upper acceptance bound. |
| health.json | `full.bands.social.friendships[0]` | 1 | count | [0, 10000000] | full social.friendships: lower acceptance bound. |
| health.json | `full.bands.social.friendships[1]` | 10000000 | count | [0, 10000000] | full social.friendships: upper acceptance bound. |
| health.json | `full.bands.social.rivalries[0]` | 1 | count | [0, 10000000] | full social.rivalries: lower acceptance bound. |
| health.json | `full.bands.social.rivalries[1]` | 10000000 | count | [0, 10000000] | full social.rivalries: upper acceptance bound. |
| health.json | `full.bands.social.bondedMatingShare[0]` | 0 | fraction | [0, 1] | full social.bondedMatingShare: lower acceptance bound. |
| health.json | `full.bands.social.bondedMatingShare[1]` | 1 | fraction | [0, 1] | full social.bondedMatingShare: upper acceptance bound. |
| health.json | `full.bands.competitions.fillRate[0]` | 0.65 | fraction | [0, 1] | full competitions.fillRate: lower acceptance bound. |
| health.json | `full.bands.competitions.fillRate[1]` | 1 | fraction | [0, 1] | full competitions.fillRate: upper acceptance bound. |
| health.json | `full.bands.competitions.cancellationRate[0]` | 0 | fraction | [0, 1] | full competitions.cancellationRate: lower acceptance bound. |
| health.json | `full.bands.competitions.cancellationRate[1]` | 0.35 | fraction | [0, 1] | full competitions.cancellationRate: upper acceptance bound. |
| health.json | `full.bands.competitions.winConcentration[0]` | 0 | fraction | [0, 1] | full competitions.winConcentration: lower acceptance bound. |
| health.json | `full.bands.competitions.winConcentration[1]` | 0.35 | fraction | [0, 1] | full competitions.winConcentration: upper acceptance bound. |
| health.json | `full.bands.prizes.inventoryMinimum[0]` | 0 | inventory tokens per stack | [0, 999] | full prizes.inventoryMinimum: lower acceptance bound. |
| health.json | `full.bands.prizes.inventoryMinimum[1]` | 999 | inventory tokens per stack | [0, 999] | full prizes.inventoryMinimum: upper acceptance bound. |
| health.json | `full.bands.prizes.inventoryMaximum[0]` | 0 | inventory tokens per stack | [0, 999] | full prizes.inventoryMaximum: lower acceptance bound. |
| health.json | `full.bands.prizes.inventoryMaximum[1]` | 999 | inventory tokens per stack | [0, 999] | full prizes.inventoryMaximum: upper acceptance bound. |
| health.json | `full.bands.prizes.rareEatenPer100k[0]` | 1 | rare-fruit meals per 100,000 ticks | [0, 10000000] | full prizes.rareEatenPer100k: lower acceptance bound. |
| health.json | `full.bands.prizes.rareEatenPer100k[1]` | 1000 | rare-fruit meals per 100,000 ticks | [0, 10000000] | full prizes.rareEatenPer100k: upper acceptance bound. |
| health.json | `full.bands.events.perHour[0]` | 2 | player events per simulated hour | [0, 10000000] | full events.perHour: lower acceptance bound. |
| health.json | `full.bands.events.perHour[1]` | 90 | player events per simulated hour | [0, 10000000] | full events.perHour: upper acceptance bound. |
| health.json | `quick.ticks` | 20000 | ticks | integer [1, 100000000] | health: quick / ticks. |
| health.json | `quick.seeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | World seed included in the quick balance profile. |
| health.json | `quick.seeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | World seed included in the quick balance profile. |
| health.json | `quick.sampleEveryTicks` | 200 | ticks | integer [1, 100000000] | health: quick / sample Every Ticks. |
| health.json | `quick.bands.population.mean[0]` | 12 | creatures | [0, 30] | quick population.mean: lower acceptance bound. |
| health.json | `quick.bands.population.mean[1]` | 30 | creatures | [0, 30] | quick population.mean: upper acceptance bound. |
| health.json | `quick.bands.population.minimum[0]` | 1 | creatures | [0, 30] | quick population.minimum: lower acceptance bound. |
| health.json | `quick.bands.population.minimum[1]` | 30 | creatures | [0, 30] | quick population.minimum: upper acceptance bound. |
| health.json | `quick.bands.population.maximum[0]` | 12 | creatures | [0, 30] | quick population.maximum: lower acceptance bound. |
| health.json | `quick.bands.population.maximum[1]` | 30 | creatures | [0, 30] | quick population.maximum: upper acceptance bound. |
| health.json | `quick.bands.population.rescues[0]` | 0 | count | [0, 10000000] | quick population.rescues: lower acceptance bound. |
| health.json | `quick.bands.population.rescues[1]` | 0 | count | [0, 10000000] | quick population.rescues: upper acceptance bound. |
| health.json | `quick.bands.population.starvationDeaths[0]` | 0 | count | [0, 10000000] | quick population.starvationDeaths: lower acceptance bound. |
| health.json | `quick.bands.population.starvationDeaths[1]` | 0 | count | [0, 10000000] | quick population.starvationDeaths: upper acceptance bound. |
| health.json | `quick.bands.population.exhaustionDeaths[0]` | 0 | count | [0, 10000000] | quick population.exhaustionDeaths: lower acceptance bound. |
| health.json | `quick.bands.population.exhaustionDeaths[1]` | 0 | count | [0, 10000000] | quick population.exhaustionDeaths: upper acceptance bound. |
| health.json | `quick.bands.life.meanLifespan[0]` | 0 | ticks | [0, 100000000] | quick life.meanLifespan: lower acceptance bound. |
| health.json | `quick.bands.life.meanLifespan[1]` | 58800 | ticks | [0, 100000000] | quick life.meanLifespan: upper acceptance bound. |
| health.json | `quick.bands.life.generationsPer100k[0]` | 0 | generations per 100,000 ticks | [0, 10000000] | quick life.generationsPer100k: lower acceptance bound. |
| health.json | `quick.bands.life.generationsPer100k[1]` | 20 | generations per 100,000 ticks | [0, 10000000] | quick life.generationsPer100k: upper acceptance bound. |
| health.json | `quick.bands.genetics.minimumDiversity[0]` | 0.4 | fraction | [0, 1] | quick genetics.minimumDiversity: lower acceptance bound. |
| health.json | `quick.bands.genetics.minimumDiversity[1]` | 1 | fraction | [0, 1] | quick genetics.minimumDiversity: upper acceptance bound. |
| health.json | `quick.bands.genetics.minimumAlleles[0]` | 2 | distinct quantitative allele values per locus | [0, 256] | quick genetics.minimumAlleles: lower acceptance bound. |
| health.json | `quick.bands.genetics.minimumAlleles[1]` | 60 | distinct quantitative allele values per locus | [0, 256] | quick genetics.minimumAlleles: upper acceptance bound. |
| health.json | `quick.bands.genetics.aptitudeDrift[0]` | 0 | fraction | [0, 1] | quick genetics.aptitudeDrift: lower acceptance bound. |
| health.json | `quick.bands.genetics.aptitudeDrift[1]` | 0.3 | fraction | [0, 1] | quick genetics.aptitudeDrift: upper acceptance bound. |
| health.json | `quick.bands.skills.meanCapFraction[0]` | 0.05 | fraction | [0, 1] | quick skills.meanCapFraction: lower acceptance bound. |
| health.json | `quick.bands.skills.meanCapFraction[1]` | 0.9 | fraction | [0, 1] | quick skills.meanCapFraction: upper acceptance bound. |
| health.json | `quick.bands.skills.maxedShare[0]` | 0 | fraction | [0, 1] | quick skills.maxedShare: lower acceptance bound. |
| health.json | `quick.bands.skills.maxedShare[1]` | 0.8 | fraction | [0, 1] | quick skills.maxedShare: upper acceptance bound. |
| health.json | `quick.bands.skills.dominantShare[0]` | 0 | fraction | [0, 1] | quick skills.dominantShare: lower acceptance bound. |
| health.json | `quick.bands.skills.dominantShare[1]` | 0.7 | fraction | [0, 1] | quick skills.dominantShare: upper acceptance bound. |
| health.json | `quick.bands.skills.partsPerAdult[0]` | 2 | earned attachments per adult | [0, 10000000] | quick skills.partsPerAdult: lower acceptance bound. |
| health.json | `quick.bands.skills.partsPerAdult[1]` | 12 | earned attachments per adult | [0, 10000000] | quick skills.partsPerAdult: upper acceptance bound. |
| health.json | `quick.bands.behavior.selfCare[0]` | 0.05 | fraction | [0, 1] | quick behavior.selfCare: lower acceptance bound. |
| health.json | `quick.bands.behavior.selfCare[1]` | 0.85 | fraction | [0, 1] | quick behavior.selfCare: upper acceptance bound. |
| health.json | `quick.bands.behavior.rest[0]` | 0.01 | fraction | [0, 1] | quick behavior.rest: lower acceptance bound. |
| health.json | `quick.bands.behavior.rest[1]` | 0.8 | fraction | [0, 1] | quick behavior.rest: upper acceptance bound. |
| health.json | `quick.bands.behavior.training[0]` | 0.005 | fraction | [0, 1] | quick behavior.training: lower acceptance bound. |
| health.json | `quick.bands.behavior.training[1]` | 0.9 | fraction | [0, 1] | quick behavior.training: upper acceptance bound. |
| health.json | `quick.bands.behavior.social[0]` | 0.0001 | fraction | [0, 1] | quick behavior.social: lower acceptance bound. |
| health.json | `quick.bands.behavior.social[1]` | 0.8 | fraction | [0, 1] | quick behavior.social: upper acceptance bound. |
| health.json | `quick.bands.behavior.travel[0]` | 0 | fraction | [0, 1] | quick behavior.travel: lower acceptance bound. |
| health.json | `quick.bands.behavior.travel[1]` | 0.8 | fraction | [0, 1] | quick behavior.travel: upper acceptance bound. |
| health.json | `quick.bands.social.positiveShare[0]` | 0.05 | fraction | [0, 1] | quick social.positiveShare: lower acceptance bound. |
| health.json | `quick.bands.social.positiveShare[1]` | 0.995 | fraction | [0, 1] | quick social.positiveShare: upper acceptance bound. |
| health.json | `quick.bands.social.meanDegree[0]` | 1 | relationships per creature | [0, 29] | quick social.meanDegree: lower acceptance bound. |
| health.json | `quick.bands.social.meanDegree[1]` | 16 | relationships per creature | [0, 29] | quick social.meanDegree: upper acceptance bound. |
| health.json | `quick.bands.social.maximumDegree[0]` | 1 | relationships per creature | [0, 29] | quick social.maximumDegree: lower acceptance bound. |
| health.json | `quick.bands.social.maximumDegree[1]` | 16 | relationships per creature | [0, 29] | quick social.maximumDegree: upper acceptance bound. |
| health.json | `quick.bands.social.friendships[0]` | 1 | count | [0, 10000000] | quick social.friendships: lower acceptance bound. |
| health.json | `quick.bands.social.friendships[1]` | 10000000 | count | [0, 10000000] | quick social.friendships: upper acceptance bound. |
| health.json | `quick.bands.social.rivalries[0]` | 0 | count | [0, 10000000] | quick social.rivalries: lower acceptance bound. |
| health.json | `quick.bands.social.rivalries[1]` | 10000000 | count | [0, 10000000] | quick social.rivalries: upper acceptance bound. |
| health.json | `quick.bands.social.bondedMatingShare[0]` | 0 | fraction | [0, 1] | quick social.bondedMatingShare: lower acceptance bound. |
| health.json | `quick.bands.social.bondedMatingShare[1]` | 1 | fraction | [0, 1] | quick social.bondedMatingShare: upper acceptance bound. |
| health.json | `quick.bands.competitions.fillRate[0]` | 0.65 | fraction | [0, 1] | quick competitions.fillRate: lower acceptance bound. |
| health.json | `quick.bands.competitions.fillRate[1]` | 1 | fraction | [0, 1] | quick competitions.fillRate: upper acceptance bound. |
| health.json | `quick.bands.competitions.cancellationRate[0]` | 0 | fraction | [0, 1] | quick competitions.cancellationRate: lower acceptance bound. |
| health.json | `quick.bands.competitions.cancellationRate[1]` | 0.35 | fraction | [0, 1] | quick competitions.cancellationRate: upper acceptance bound. |
| health.json | `quick.bands.competitions.winConcentration[0]` | 0 | fraction | [0, 1] | quick competitions.winConcentration: lower acceptance bound. |
| health.json | `quick.bands.competitions.winConcentration[1]` | 1 | fraction | [0, 1] | quick competitions.winConcentration: upper acceptance bound. |
| health.json | `quick.bands.prizes.inventoryMinimum[0]` | 0 | inventory tokens per stack | [0, 999] | quick prizes.inventoryMinimum: lower acceptance bound. |
| health.json | `quick.bands.prizes.inventoryMinimum[1]` | 999 | inventory tokens per stack | [0, 999] | quick prizes.inventoryMinimum: upper acceptance bound. |
| health.json | `quick.bands.prizes.inventoryMaximum[0]` | 0 | inventory tokens per stack | [0, 999] | quick prizes.inventoryMaximum: lower acceptance bound. |
| health.json | `quick.bands.prizes.inventoryMaximum[1]` | 999 | inventory tokens per stack | [0, 999] | quick prizes.inventoryMaximum: upper acceptance bound. |
| health.json | `quick.bands.prizes.rareEatenPer100k[0]` | 1 | rare-fruit meals per 100,000 ticks | [0, 10000000] | quick prizes.rareEatenPer100k: lower acceptance bound. |
| health.json | `quick.bands.prizes.rareEatenPer100k[1]` | 1000 | rare-fruit meals per 100,000 ticks | [0, 10000000] | quick prizes.rareEatenPer100k: upper acceptance bound. |
| health.json | `quick.bands.events.perHour[0]` | 2 | player events per simulated hour | [0, 10000000] | quick events.perHour: lower acceptance bound. |
| health.json | `quick.bands.events.perHour[1]` | 90 | player events per simulated hour | [0, 10000000] | quick events.perHour: upper acceptance bound. |
| health.json | `soak.ticks` | 5000000 | ticks | integer [1, 100000000] | health: soak / ticks. |
| health.json | `soak.seeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | World seed included in the full soak profile. |
| health.json | `soak.seeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | World seed included in the full soak profile. |
| health.json | `soak.seeds[2]` | 161803 | uint32 seed | integer [0, 4294967295] | World seed included in the full soak profile. |
| health.json | `soak.seeds[3]` | 57721 | uint32 seed | integer [0, 4294967295] | World seed included in the full soak profile. |
| health.json | `soak.seeds[4]` | 141421 | uint32 seed | integer [0, 4294967295] | World seed included in the full soak profile. |
| health.json | `soak.validateEveryTicks` | 10000 | ticks | integer [1, 100000000] | health: soak / validate Every Ticks. |
| health.json | `soak.roundTripChance` | 0.00002 | probability / update fraction | [0, 1] | health: soak / round Trip Chance. |
| health.json | `soak.catchUpChance` | 0.00002 | probability / update fraction | [0, 1] | health: soak / catch Up Chance. |
| health.json | `soak.maximumChunkTicks` | 1000 | ticks | integer [0, 100000000] | health: soak / maximum Chunk Ticks. |
| health.json | `soak.shortTicks` | 3000 | ticks | integer [1, 100000000] | health: soak / short Ticks. |
| health.json | `soak.shortSeeds[0]` | 271828 | uint32 seed | integer [0, 4294967295] | World seed included in the short soak profile. |
| health.json | `soak.shortSeeds[1]` | 314159 | uint32 seed | integer [0, 4294967295] | World seed included in the short soak profile. |
| robustness.json | `backups` | 2 | count | integer [0, 10000000] | robustness: backups. |
| robustness.json | `importMaximumBytes` | 52428800 | bytes | integer [1, 1073741824] | robustness: import Maximum Bytes. |
| robustness.json | `storageQuotaBytes` | 5242880 | bytes | integer [1, 1073741824] | robustness: storage Quota Bytes. |
| robustness.json | `indexedDbThreshold` | 0.5 | ratio | [0, 1] | robustness: indexed Db Threshold. |
| robustness.json | `leaseMs` | 10000 | milliseconds | [1e-12, 3600000] | robustness: lease Ms. |
| robustness.json | `heartbeatMs` | 3000 | milliseconds | [1e-12, 3600000] | robustness: heartbeat Ms. |
| robustness.json | `commandHistoryLimit` | 20 | count | integer [0, 10000000] | robustness: command History Limit. |
| robustness.json | `devValidate` | false | flag | false, true | Periodically validate simulation state in development builds. |
| robustness.json | `validateEveryTicks` | 1000 | ticks | integer [1, 100000000] | robustness: validate Every Ticks. |
| robustness.json | `helloWaitMs` | 1000 | milliseconds | integer [0, 10000] | Delay for a current owner to answer the startup handshake. |
| robustness.json | `measuredCheckpointUtf8Bytes` | 2006423 | UTF-8 bytes | integer [1, 52428800] | Recorded 10a save size used to select a storage backend; update from a measured study. |
| presentation.json | `daylight.maximumCycleSpeed` | 10 | speed multiplier | [1, 10] | Above this speed, use constant average day/night shading to prevent flashing. |
| presentation.json | `daylight.transitionSeconds` | 0.4 | real seconds | [0.1, 5] | Real-time smoothing of map lighting when the speed or day phase changes. |
| presentation.json | `daylight.twilightFraction` | 0.08 | fraction | [0.01, 0.2] | Length of dawn and dusk transitions as a fraction of a day. |
| presentation.json | `eventWindowTicks` | 1200 | ticks | integer [1e-12, 100000000] | presentation: event Window Ticks. |
| presentation.json | `eventRateCap` | 30 | coefficient | [1e-12, 10000000] | presentation: event Rate Cap. |
| presentation.json | `feedLimit` | 24 | count | integer [0, 10000000] | presentation: feed Limit. |
| presentation.json | `ariaLiveIntervalMs` | 5000 | milliseconds | [0, 3600000] | presentation: aria Live Interval Ms. |
| presentation.json | `debugRefreshHz` | 2 | refreshes/second | [0.1, 120] | presentation: debug Refresh Hz. |
| presentation.json | `playerRefreshHz` | 5 | refreshes/second | [0.1, 120] | presentation: player Refresh Hz. |
| presentation.json | `textSizes[0]` | 14 | coefficient | [0, 10000000] | presentation: text Sizes[0]. |
| presentation.json | `textSizes[1]` | 16 | coefficient | [0, 10000000] | presentation: text Sizes[1]. |
| presentation.json | `textSizes[2]` | 18 | coefficient | [0, 10000000] | presentation: text Sizes[2]. |
| presentation.json | `textSizes[3]` | 20 | coefficient | [0, 10000000] | presentation: text Sizes[3]. |
| presentation.json | `defaultTextSize` | 16 | coefficient | [0, 10000000] | presentation: default Text Size. |
| presentation.json | `defaultSpeed` | 1 | coefficient | [0, 10000000] | presentation: default Speed. |
| presentation.json | `bundleByteBudget` | 2400000 | bytes | integer [1, 1073741824] | presentation: bundle Byte Budget. |
| presentation.json | `mapCamera.minimumZoom` | 1 | scale | integer [1, 1] | Fit-map scale |
| presentation.json | `mapCamera.maximumZoom` | 8 | scale | [1, 32] | Maximum map magnification |
| presentation.json | `mapCamera.wheelSensitivity` | 0.002 | per pixel | [0.0001, 0.02] | Exponential zoom response per wheel pixel |
| presentation.json | `mapCamera.wheelLinePixels` | 16 | CSS pixels | [1, 100] | Wheel line-mode normalization |
| presentation.json | `mapCamera.maximumWheelDelta` | 600 | CSS pixels | [1, 2000] | Maximum normalized wheel delta per event |
| presentation.json | `mapCamera.buttonZoomFactor` | 1.5 | scale | [1.01, 4] | Magnification factor for zoom buttons and keys |
| presentation.json | `mapCamera.dragThresholdPixels` | 4 | CSS pixels | [1, 30] | Pointer travel before a click becomes a pan |
| presentation.json | `mapCamera.keyboardPanPixels` | 60 | CSS pixels | [1, 500] | Pan distance per arrow-key press |
| presentation.json | `foregroundBudgetMs` | 8 | milliseconds | [1, 50] | Foreground task budget, checked between complete simulation ticks |
| presentation.json | `rateSampleMs` | 1000 | milliseconds | integer [100, 10000] | Minimum sampling interval for the achieved tick-rate display |
| presentation.json | `maximumAnimationSpeed` | 3 | multiplier | [1, 10] | Maximum pose animation multiplier independent of travel speed |
| presentation.json | `maximumAnimationDeltaSeconds` | 0.1 | seconds | [0.01, 1] | Maximum real frame interval applied to pose animation |
| names.json | `distinctFraction` | 0.96 | distinct names/sample | [0, 1] | names: distinct Fraction. |
| names.json | `sampleSize` | 1000 | coefficient | [0, 10000000] | names: sample Size. |
| actions.json | `eat.workTicks` | 8 | ticks | integer [1, 100000000] | actions: eat / work Ticks. |
| actions.json | `eat.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: eat / effects / hunger. |
| actions.json | `eat.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: eat / effects / fatigue. |
| actions.json | `eat.effects.boredom` | 0 | need points per completed action | [-100, 100] | actions: eat / effects / boredom. |
| actions.json | `eat.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: eat / effects / loneliness. |
| actions.json | `eat.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: eat / effects / stress. |
| actions.json | `graze.workTicks` | 45 | ticks | integer [1, 100000000] | actions: graze / work Ticks. |
| actions.json | `graze.effects.hunger` | -18 | need points per completed action | [-100, 100] | actions: graze / effects / hunger. |
| actions.json | `graze.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: graze / effects / fatigue. |
| actions.json | `graze.effects.boredom` | -2 | need points per completed action | [-100, 100] | actions: graze / effects / boredom. |
| actions.json | `graze.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: graze / effects / loneliness. |
| actions.json | `graze.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: graze / effects / stress. |
| actions.json | `sleep.workTicks` | 120 | ticks | integer [1, 100000000] | actions: sleep / work Ticks. |
| actions.json | `sleep.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: sleep / effects / hunger. |
| actions.json | `sleep.effects.fatigue` | -36 | need points per completed action | [-100, 100] | actions: sleep / effects / fatigue. |
| actions.json | `sleep.effects.boredom` | 0 | need points per completed action | [-100, 100] | actions: sleep / effects / boredom. |
| actions.json | `sleep.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: sleep / effects / loneliness. |
| actions.json | `sleep.effects.stress` | -6 | need points per completed action | [-100, 100] | actions: sleep / effects / stress. |
| actions.json | `wander.workTicks` | 30 | ticks | integer [1, 100000000] | actions: wander / work Ticks. |
| actions.json | `wander.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: wander / effects / hunger. |
| actions.json | `wander.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: wander / effects / fatigue. |
| actions.json | `wander.effects.boredom` | -8 | need points per completed action | [-100, 100] | actions: wander / effects / boredom. |
| actions.json | `wander.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: wander / effects / loneliness. |
| actions.json | `wander.effects.stress` | -2 | need points per completed action | [-100, 100] | actions: wander / effects / stress. |
| actions.json | `idle.workTicks` | 10 | ticks | integer [1, 100000000] | actions: idle / work Ticks. |
| actions.json | `idle.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: idle / effects / hunger. |
| actions.json | `idle.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: idle / effects / fatigue. |
| actions.json | `idle.effects.boredom` | 0 | need points per completed action | [-100, 100] | actions: idle / effects / boredom. |
| actions.json | `idle.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: idle / effects / loneliness. |
| actions.json | `idle.effects.stress` | -1 | need points per completed action | [-100, 100] | actions: idle / effects / stress. |
| actions.json | `train_run.workTicks` | 40 | ticks | integer [1, 100000000] | actions: train_run / work Ticks. |
| actions.json | `train_run.effects.hunger` | 1 | need points per completed action | [-100, 100] | actions: train_run / effects / hunger. |
| actions.json | `train_run.effects.fatigue` | 4 | need points per completed action | [-100, 100] | actions: train_run / effects / fatigue. |
| actions.json | `train_run.effects.boredom` | -12 | need points per completed action | [-100, 100] | actions: train_run / effects / boredom. |
| actions.json | `train_run.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: train_run / effects / loneliness. |
| actions.json | `train_run.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: train_run / effects / stress. |
| actions.json | `train_swim.workTicks` | 40 | ticks | integer [1, 100000000] | actions: train_swim / work Ticks. |
| actions.json | `train_swim.effects.hunger` | 1 | need points per completed action | [-100, 100] | actions: train_swim / effects / hunger. |
| actions.json | `train_swim.effects.fatigue` | 4 | need points per completed action | [-100, 100] | actions: train_swim / effects / fatigue. |
| actions.json | `train_swim.effects.boredom` | -12 | need points per completed action | [-100, 100] | actions: train_swim / effects / boredom. |
| actions.json | `train_swim.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: train_swim / effects / loneliness. |
| actions.json | `train_swim.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: train_swim / effects / stress. |
| actions.json | `train_fly.workTicks` | 40 | ticks | integer [1, 100000000] | actions: train_fly / work Ticks. |
| actions.json | `train_fly.effects.hunger` | 1 | need points per completed action | [-100, 100] | actions: train_fly / effects / hunger. |
| actions.json | `train_fly.effects.fatigue` | 4 | need points per completed action | [-100, 100] | actions: train_fly / effects / fatigue. |
| actions.json | `train_fly.effects.boredom` | -12 | need points per completed action | [-100, 100] | actions: train_fly / effects / boredom. |
| actions.json | `train_fly.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: train_fly / effects / loneliness. |
| actions.json | `train_fly.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: train_fly / effects / stress. |
| actions.json | `train_strength.workTicks` | 40 | ticks | integer [1, 100000000] | actions: train_strength / work Ticks. |
| actions.json | `train_strength.effects.hunger` | 1 | need points per completed action | [-100, 100] | actions: train_strength / effects / hunger. |
| actions.json | `train_strength.effects.fatigue` | 4 | need points per completed action | [-100, 100] | actions: train_strength / effects / fatigue. |
| actions.json | `train_strength.effects.boredom` | -12 | need points per completed action | [-100, 100] | actions: train_strength / effects / boredom. |
| actions.json | `train_strength.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: train_strength / effects / loneliness. |
| actions.json | `train_strength.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: train_strength / effects / stress. |
| actions.json | `train_stamina.workTicks` | 60 | ticks | integer [1, 100000000] | actions: train_stamina / work Ticks. |
| actions.json | `train_stamina.effects.hunger` | 1.5 | need points per completed action | [-100, 100] | actions: train_stamina / effects / hunger. |
| actions.json | `train_stamina.effects.fatigue` | 6 | need points per completed action | [-100, 100] | actions: train_stamina / effects / fatigue. |
| actions.json | `train_stamina.effects.boredom` | -18 | need points per completed action | [-100, 100] | actions: train_stamina / effects / boredom. |
| actions.json | `train_stamina.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: train_stamina / effects / loneliness. |
| actions.json | `train_stamina.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: train_stamina / effects / stress. |
| actions.json | `court.workTicks` | 40 | ticks | integer [1, 100000000] | actions: court / work Ticks. |
| actions.json | `court.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: court / effects / hunger. |
| actions.json | `court.effects.fatigue` | 2 | need points per completed action | [-100, 100] | actions: court / effects / fatigue. |
| actions.json | `court.effects.boredom` | 0 | need points per completed action | [-100, 100] | actions: court / effects / boredom. |
| actions.json | `court.effects.loneliness` | -15 | need points per completed action | [-100, 100] | actions: court / effects / loneliness. |
| actions.json | `court.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: court / effects / stress. |
| actions.json | `play.workTicks` | 20 | ticks | integer [1, 100000000] | actions: play / work Ticks. |
| actions.json | `play.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: play / effects / hunger. |
| actions.json | `play.effects.fatigue` | 2 | need points per completed action | [-100, 100] | actions: play / effects / fatigue. |
| actions.json | `play.effects.boredom` | -20 | need points per completed action | [-100, 100] | actions: play / effects / boredom. |
| actions.json | `play.effects.loneliness` | -18 | need points per completed action | [-100, 100] | actions: play / effects / loneliness. |
| actions.json | `play.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: play / effects / stress. |
| actions.json | `comfort.workTicks` | 20 | ticks | integer [1, 100000000] | actions: comfort / work Ticks. |
| actions.json | `comfort.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: comfort / effects / hunger. |
| actions.json | `comfort.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: comfort / effects / fatigue. |
| actions.json | `comfort.effects.boredom` | 0 | need points per completed action | [-100, 100] | actions: comfort / effects / boredom. |
| actions.json | `comfort.effects.loneliness` | -8 | need points per completed action | [-100, 100] | actions: comfort / effects / loneliness. |
| actions.json | `comfort.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: comfort / effects / stress. |
| actions.json | `contest.workTicks` | 40 | ticks | integer [1, 100000000] | actions: contest / work Ticks. |
| actions.json | `contest.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: contest / effects / hunger. |
| actions.json | `contest.effects.fatigue` | 5 | need points per completed action | [-100, 100] | actions: contest / effects / fatigue. |
| actions.json | `contest.effects.boredom` | -18 | need points per completed action | [-100, 100] | actions: contest / effects / boredom. |
| actions.json | `contest.effects.loneliness` | -10 | need points per completed action | [-100, 100] | actions: contest / effects / loneliness. |
| actions.json | `contest.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: contest / effects / stress. |
| actions.json | `avoid.workTicks` | 20 | ticks | integer [1, 100000000] | actions: avoid / work Ticks. |
| actions.json | `avoid.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: avoid / effects / hunger. |
| actions.json | `avoid.effects.fatigue` | 0 | need points per completed action | [-100, 100] | actions: avoid / effects / fatigue. |
| actions.json | `avoid.effects.boredom` | -2 | need points per completed action | [-100, 100] | actions: avoid / effects / boredom. |
| actions.json | `avoid.effects.loneliness` | 0 | need points per completed action | [-100, 100] | actions: avoid / effects / loneliness. |
| actions.json | `avoid.effects.stress` | -4 | need points per completed action | [-100, 100] | actions: avoid / effects / stress. |
| actions.json | `enterCompetition.workTicks` | 1 | ticks | integer [1, 100000000] | actions: enter Competition / work Ticks. |
| actions.json | `enterCompetition.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: enter Competition / effects / hunger. |
| actions.json | `enterCompetition.effects.fatigue` | 6 | need points per completed action | [-100, 100] | actions: enter Competition / effects / fatigue. |
| actions.json | `enterCompetition.effects.boredom` | -15 | need points per completed action | [-100, 100] | actions: enter Competition / effects / boredom. |
| actions.json | `enterCompetition.effects.loneliness` | -15 | need points per completed action | [-100, 100] | actions: enter Competition / effects / loneliness. |
| actions.json | `enterCompetition.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: enter Competition / effects / stress. |
| actions.json | `attendCompetition.workTicks` | 1 | ticks | integer [1, 100000000] | actions: attend Competition / work Ticks. |
| actions.json | `attendCompetition.effects.hunger` | 0 | need points per completed action | [-100, 100] | actions: attend Competition / effects / hunger. |
| actions.json | `attendCompetition.effects.fatigue` | 6 | need points per completed action | [-100, 100] | actions: attend Competition / effects / fatigue. |
| actions.json | `attendCompetition.effects.boredom` | -15 | need points per completed action | [-100, 100] | actions: attend Competition / effects / boredom. |
| actions.json | `attendCompetition.effects.loneliness` | -15 | need points per completed action | [-100, 100] | actions: attend Competition / effects / loneliness. |
| actions.json | `attendCompetition.effects.stress` | 0 | need points per completed action | [-100, 100] | actions: attend Competition / effects / stress. |
| actions.json | `gather.workTicks` | 6 | ticks | integer [0, 1000000] | actions / gather / workTicks |
| actions.json | `gather.effects.hunger` | 0 | points | integer [0, 1000000] | actions / gather / effects / hunger |
| actions.json | `gather.effects.fatigue` | 1 | points | integer [0, 1000000] | actions / gather / effects / fatigue |
| actions.json | `gather.effects.boredom` | -4 | points | integer [-100, 1000000] | actions / gather / effects / boredom |
| actions.json | `gather.effects.loneliness` | 0 | points | integer [0, 1000000] | actions / gather / effects / loneliness |
| actions.json | `gather.effects.stress` | 0 | points | integer [0, 1000000] | actions / gather / effects / stress |
| sources.json | `defaults[0].x` | 10 | geometry units | [-256, 256] | sources: defaults[0] / x. |
| sources.json | `defaults[0].y` | 30 | geometry units | [-256, 256] | sources: defaults[0] / y. |
| sources.json | `defaults[1].x` | 12 | geometry units | [-256, 256] | sources: defaults[1] / x. |
| sources.json | `defaults[1].y` | 30 | geometry units | [-256, 256] | sources: defaults[1] / y. |
| sources.json | `defaults[2].x` | 14 | geometry units | [-256, 256] | sources: defaults[2] / x. |
| sources.json | `defaults[2].y` | 30 | geometry units | [-256, 256] | sources: defaults[2] / y. |
| sources.json | `defaults[3].x` | 16 | geometry units | [-256, 256] | sources: defaults[3] / x. |
| sources.json | `defaults[3].y` | 30 | geometry units | [-256, 256] | sources: defaults[3] / y. |
| sources.json | `defaults[4].x` | 18 | geometry units | [-256, 256] | sources: defaults[4] / x. |
| sources.json | `defaults[4].y` | 30 | geometry units | [-256, 256] | sources: defaults[4] / y. |
| sources.json | `defaults[5].x` | 20 | geometry units | [-256, 256] | sources: defaults[5] / x. |
| sources.json | `defaults[5].y` | 30 | geometry units | [-256, 256] | sources: defaults[5] / y. |
| sources.json | `defaults[6].x` | 10 | geometry units | [-256, 256] | sources: defaults[6] / x. |
| sources.json | `defaults[6].y` | 34 | geometry units | [-256, 256] | sources: defaults[6] / y. |
| sources.json | `defaults[7].x` | 14 | geometry units | [-256, 256] | sources: defaults[7] / x. |
| sources.json | `defaults[7].y` | 34 | geometry units | [-256, 256] | sources: defaults[7] / y. |
| sources.json | `defaults[8].x` | 18 | geometry units | [-256, 256] | sources: defaults[8] / x. |
| sources.json | `defaults[8].y` | 34 | geometry units | [-256, 256] | sources: defaults[8] / y. |
| sources.json | `defaults[9].x` | 22 | geometry units | [-256, 256] | sources: defaults[9] / x. |
| sources.json | `defaults[9].y` | 34 | geometry units | [-256, 256] | sources: defaults[9] / y. |
| training-spots.json | `capacity` | 2 | count | integer [0, 10000000] | training-spots: capacity. |
| training-spots.json | `defaults[0].x` | 26 | geometry units | [-256, 256] | training-spots: defaults[0] / x. |
| training-spots.json | `defaults[0].y` | 24 | geometry units | [-256, 256] | training-spots: defaults[0] / y. |
| training-spots.json | `defaults[0].width` | 1 | coefficient | [0, 10000000] | training-spots: defaults[0] / width. |
| training-spots.json | `defaults[0].height` | 1 | coefficient | [0, 10000000] | training-spots: defaults[0] / height. |
| training-spots.json | `defaults[1].x` | 27 | geometry units | [-256, 256] | training-spots: defaults[1] / x. |
| training-spots.json | `defaults[1].y` | 28 | geometry units | [-256, 256] | training-spots: defaults[1] / y. |
| training-spots.json | `defaults[1].width` | 1 | coefficient | [0, 10000000] | training-spots: defaults[1] / width. |
| training-spots.json | `defaults[1].height` | 1 | coefficient | [0, 10000000] | training-spots: defaults[1] / height. |
| training-spots.json | `defaults[2].x` | 22 | geometry units | [-256, 256] | training-spots: defaults[2] / x. |
| training-spots.json | `defaults[2].y` | 24 | geometry units | [-256, 256] | training-spots: defaults[2] / y. |
| training-spots.json | `defaults[2].width` | 1 | coefficient | [0, 10000000] | training-spots: defaults[2] / width. |
| training-spots.json | `defaults[2].height` | 1 | coefficient | [0, 10000000] | training-spots: defaults[2] / height. |
| training-spots.json | `defaults[3].x` | 24 | geometry units | [-256, 256] | training-spots: defaults[3] / x. |
| training-spots.json | `defaults[3].y` | 28 | geometry units | [-256, 256] | training-spots: defaults[3] / y. |
| training-spots.json | `defaults[3].width` | 1 | coefficient | [0, 10000000] | training-spots: defaults[3] / width. |
| training-spots.json | `defaults[3].height` | 1 | coefficient | [0, 10000000] | training-spots: defaults[3] / height. |
| training-spots.json | `shallowPractice[0].x` | 26 | geometry units | [-256, 256] | training-spots: shallow Practice[0] / x. |
| training-spots.json | `shallowPractice[0].y` | 26 | geometry units | [-256, 256] | training-spots: shallow Practice[0] / y. |
| training-spots.json | `shallowPractice[1].x` | 27 | geometry units | [-256, 256] | training-spots: shallow Practice[1] / x. |
| training-spots.json | `shallowPractice[1].y` | 26 | geometry units | [-256, 256] | training-spots: shallow Practice[1] / y. |
| items.json | `nest.width` | 2 | coefficient | [0, 10000000] | items: nest / width. |
| items.json | `nest.height` | 2 | coefficient | [0, 10000000] | items: nest / height. |
| items.json | `bed.width` | 1 | coefficient | [0, 10000000] | items: bed / width. |
| items.json | `bed.height` | 1 | coefficient | [0, 10000000] | items: bed / height. |
| items.json | `track.width` | 1 | coefficient | [0, 10000000] | items: track / width. |
| items.json | `track.height` | 1 | coefficient | [0, 10000000] | items: track / height. |
| items.json | `wind_perch.width` | 1 | coefficient | [0, 10000000] | items: wind_perch / width. |
| items.json | `wind_perch.height` | 1 | coefficient | [0, 10000000] | items: wind_perch / height. |
| items.json | `push_stone.width` | 1 | coefficient | [0, 10000000] | items: push_stone / width. |
| items.json | `push_stone.height` | 1 | coefficient | [0, 10000000] | items: push_stone / height. |
| items.json | `trail_marker.width` | 1 | coefficient | [0, 10000000] | items: trail_marker / width. |
| items.json | `trail_marker.height` | 1 | coefficient | [0, 10000000] | items: trail_marker / height. |
| items.json | `toy.width` | 1 | coefficient | [0, 10000000] | items: toy / width. |
| items.json | `toy.height` | 1 | coefficient | [0, 10000000] | items: toy / height. |
| items.json | `competition_pad.width` | 3 | coefficient | [0, 10000000] | items: competition_pad / width. |
| items.json | `competition_pad.height` | 2 | coefficient | [0, 10000000] | items: competition_pad / height. |
| items.json | `lantern.width` | 1 | coefficient | [0, 10000000] | items: lantern / width. |
| items.json | `lantern.height` | 1 | coefficient | [0, 10000000] | items: lantern / height. |
| empty-inventory.json | `fruit.sunapple` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / sunapple. |
| empty-inventory.json | `fruit.dewberry` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / dewberry. |
| empty-inventory.json | `fruit.cloudplum` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / cloudplum. |
| empty-inventory.json | `fruit.vinefig` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / vinefig. |
| empty-inventory.json | `fruit.stonepear` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / stonepear. |
| empty-inventory.json | `fruit.ambermelon` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / ambermelon. |
| empty-inventory.json | `fruit.moonpeach` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / moonpeach. |
| empty-inventory.json | `fruit.sparkcherry` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / sparkcherry. |
| empty-inventory.json | `fruit.prismpear` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / prismpear. |
| empty-inventory.json | `fruit.spiralfruit` | 0 | tokens | integer [0, 999] | empty-inventory: fruit / spiralfruit. |
| empty-inventory.json | `seeds.sunapple` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / sunapple. |
| empty-inventory.json | `seeds.dewberry` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / dewberry. |
| empty-inventory.json | `seeds.cloudplum` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / cloudplum. |
| empty-inventory.json | `seeds.vinefig` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / vinefig. |
| empty-inventory.json | `seeds.stonepear` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / stonepear. |
| empty-inventory.json | `seeds.ambermelon` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / ambermelon. |
| empty-inventory.json | `seeds.moonpeach` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / moonpeach. |
| empty-inventory.json | `seeds.sparkcherry` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / sparkcherry. |
| empty-inventory.json | `seeds.prismpear` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / prismpear. |
| empty-inventory.json | `seeds.spiralfruit` | 0 | tokens | integer [0, 999] | empty-inventory: seeds / spiralfruit. |
| empty-inventory.json | `items.nest` | 0 | tokens | integer [0, 999] | empty-inventory: items / nest. |
| empty-inventory.json | `items.bed` | 0 | tokens | integer [0, 999] | empty-inventory: items / bed. |
| empty-inventory.json | `items.track` | 0 | tokens | integer [0, 999] | empty-inventory: items / track. |
| empty-inventory.json | `items.wind_perch` | 0 | tokens | integer [0, 999] | empty-inventory: items / wind_perch. |
| empty-inventory.json | `items.push_stone` | 0 | tokens | integer [0, 999] | empty-inventory: items / push_stone. |
| empty-inventory.json | `items.trail_marker` | 0 | tokens | integer [0, 999] | empty-inventory: items / trail_marker. |
| empty-inventory.json | `items.toy` | 0 | tokens | integer [0, 999] | empty-inventory: items / toy. |
| empty-inventory.json | `items.competition_pad` | 0 | tokens | integer [0, 999] | empty-inventory: items / competition_pad. |
| empty-inventory.json | `items.lantern` | 0 | tokens | integer [0, 999] | empty-inventory: items / lantern. |
| empty-inventory.json | `cosmetics.ribbon` | 0 | tokens | integer [0, 999] | empty-inventory: cosmetics / ribbon. |
| empty-inventory.json | `cosmetics.leaf_crown` | 0 | tokens | integer [0, 999] | empty-inventory: cosmetics / leaf_crown. |
| empty-inventory.json | `cosmetics.star_pin` | 0 | tokens | integer [0, 999] | empty-inventory: cosmetics / star_pin. |
| genes.json | `[0].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [0] / allele Range[0]. |
| genes.json | `[0].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [0] / allele Range[1]. |
| genes.json | `[0].founderRange[0]` | 64 | allele byte | integer [0, 255] | genes: [0] / founder Range[0]. |
| genes.json | `[0].founderRange[1]` | 192 | allele byte | integer [0, 255] | genes: [0] / founder Range[1]. |
| genes.json | `[0].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [0] / trait Range[0]. |
| genes.json | `[0].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [0] / trait Range[1]. |
| genes.json | `[1].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [1] / allele Range[0]. |
| genes.json | `[1].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [1] / allele Range[1]. |
| genes.json | `[1].founderRange[0]` | 64 | allele byte | integer [0, 255] | genes: [1] / founder Range[0]. |
| genes.json | `[1].founderRange[1]` | 192 | allele byte | integer [0, 255] | genes: [1] / founder Range[1]. |
| genes.json | `[1].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [1] / trait Range[0]. |
| genes.json | `[1].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [1] / trait Range[1]. |
| genes.json | `[2].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [2] / allele Range[0]. |
| genes.json | `[2].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [2] / allele Range[1]. |
| genes.json | `[2].founderRange[0]` | 64 | allele byte | integer [0, 255] | genes: [2] / founder Range[0]. |
| genes.json | `[2].founderRange[1]` | 192 | allele byte | integer [0, 255] | genes: [2] / founder Range[1]. |
| genes.json | `[2].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [2] / trait Range[0]. |
| genes.json | `[2].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [2] / trait Range[1]. |
| genes.json | `[3].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [3] / allele Range[0]. |
| genes.json | `[3].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [3] / allele Range[1]. |
| genes.json | `[3].founderRange[0]` | 64 | allele byte | integer [0, 255] | genes: [3] / founder Range[0]. |
| genes.json | `[3].founderRange[1]` | 192 | allele byte | integer [0, 255] | genes: [3] / founder Range[1]. |
| genes.json | `[3].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [3] / trait Range[0]. |
| genes.json | `[3].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [3] / trait Range[1]. |
| genes.json | `[4].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [4] / allele Range[0]. |
| genes.json | `[4].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [4] / allele Range[1]. |
| genes.json | `[4].founderRange[0]` | 64 | allele byte | integer [0, 255] | genes: [4] / founder Range[0]. |
| genes.json | `[4].founderRange[1]` | 192 | allele byte | integer [0, 255] | genes: [4] / founder Range[1]. |
| genes.json | `[4].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [4] / trait Range[0]. |
| genes.json | `[4].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [4] / trait Range[1]. |
| genes.json | `[5].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [5] / allele Range[0]. |
| genes.json | `[5].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [5] / allele Range[1]. |
| genes.json | `[5].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [5] / founder Range[0]. |
| genes.json | `[5].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [5] / founder Range[1]. |
| genes.json | `[5].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [5] / trait Range[0]. |
| genes.json | `[5].traitRange[1]` | 360 | expressed trait units | [0, 360] | genes: [5] / trait Range[1]. |
| genes.json | `[6].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [6] / allele Range[0]. |
| genes.json | `[6].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [6] / allele Range[1]. |
| genes.json | `[6].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [6] / founder Range[0]. |
| genes.json | `[6].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [6] / founder Range[1]. |
| genes.json | `[6].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [6] / trait Range[0]. |
| genes.json | `[6].traitRange[1]` | 360 | expressed trait units | [0, 360] | genes: [6] / trait Range[1]. |
| genes.json | `[7].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [7] / allele Range[0]. |
| genes.json | `[7].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [7] / allele Range[1]. |
| genes.json | `[7].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [7] / founder Range[0]. |
| genes.json | `[7].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [7] / founder Range[1]. |
| genes.json | `[7].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [7] / trait Range[0]. |
| genes.json | `[7].traitRange[1]` | 360 | expressed trait units | [0, 360] | genes: [7] / trait Range[1]. |
| genes.json | `[8].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [8] / allele Range[0]. |
| genes.json | `[8].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [8] / allele Range[1]. |
| genes.json | `[8].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [8] / founder Range[0]. |
| genes.json | `[8].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [8] / founder Range[1]. |
| genes.json | `[8].traitRange[0]` | 45 | expressed trait units | [0, 360] | genes: [8] / trait Range[0]. |
| genes.json | `[8].traitRange[1]` | 85 | expressed trait units | [0, 360] | genes: [8] / trait Range[1]. |
| genes.json | `[9].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [9] / allele Range[0]. |
| genes.json | `[9].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [9] / allele Range[1]. |
| genes.json | `[9].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [9] / founder Range[0]. |
| genes.json | `[9].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [9] / founder Range[1]. |
| genes.json | `[9].traitRange[0]` | 38 | expressed trait units | [0, 360] | genes: [9] / trait Range[0]. |
| genes.json | `[9].traitRange[1]` | 66 | expressed trait units | [0, 360] | genes: [9] / trait Range[1]. |
| genes.json | `[10].options[0].dominance` | 1 | points | integer [0, 1000000] | genes[10] / options[0] / dominance |
| genes.json | `[10].options[0].founderWeight` | 0.4 | points | [0, 1000000] | genes[10] / options[0] / founderWeight |
| genes.json | `[10].options[1].dominance` | 0 | points | integer [0, 1000000] | genes[10] / options[1] / dominance |
| genes.json | `[10].options[1].founderWeight` | 0.25 | points | [0, 1000000] | genes[10] / options[1] / founderWeight |
| genes.json | `[10].options[2].dominance` | 0 | points | integer [0, 1000000] | genes[10] / options[2] / dominance |
| genes.json | `[10].options[2].founderWeight` | 0.25 | points | [0, 1000000] | genes[10] / options[2] / founderWeight |
| genes.json | `[10].options[3].dominance` | 0 | points | integer [0, 1000000] | genes[10] / options[3] / dominance |
| genes.json | `[10].options[3].founderWeight` | 0.1 | points | [0, 1000000] | genes[10] / options[3] / founderWeight |
| genes.json | `[11].alleleRange[0]` | 0 | points | integer [0, 1000000] | genes[11] / alleleRange[0] |
| genes.json | `[11].alleleRange[1]` | 255 | points | integer [0, 1000000] | genes[11] / alleleRange[1] |
| genes.json | `[11].founderRange[0]` | 0 | points | integer [0, 1000000] | genes[11] / founderRange[0] |
| genes.json | `[11].founderRange[1]` | 255 | points | integer [0, 1000000] | genes[11] / founderRange[1] |
| genes.json | `[11].traitRange[0]` | 0.65 | points | [0, 1000000] | genes[11] / traitRange[0] |
| genes.json | `[11].traitRange[1]` | 1.65 | points | [0, 1000000] | genes[11] / traitRange[1] |
| genes.json | `[12].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [12] / allele Range[0]. |
| genes.json | `[12].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [12] / allele Range[1]. |
| genes.json | `[12].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [12] / founder Range[0]. |
| genes.json | `[12].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [12] / founder Range[1]. |
| genes.json | `[12].traitRange[0]` | 0.7 | expressed trait units | [0, 360] | genes: [12] / trait Range[0]. |
| genes.json | `[12].traitRange[1]` | 1.5 | expressed trait units | [0, 360] | genes: [12] / trait Range[1]. |
| genes.json | `[13].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [13] / allele Range[0]. |
| genes.json | `[13].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [13] / allele Range[1]. |
| genes.json | `[13].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [13] / founder Range[0]. |
| genes.json | `[13].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [13] / founder Range[1]. |
| genes.json | `[13].traitRange[0]` | 0.6 | expressed trait units | [0, 360] | genes: [13] / trait Range[0]. |
| genes.json | `[13].traitRange[1]` | 1.7 | expressed trait units | [0, 360] | genes: [13] / trait Range[1]. |
| genes.json | `[14].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [14] / allele Range[0]. |
| genes.json | `[14].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [14] / allele Range[1]. |
| genes.json | `[14].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [14] / founder Range[0]. |
| genes.json | `[14].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [14] / founder Range[1]. |
| genes.json | `[14].traitRange[0]` | 0.6 | expressed trait units | [0, 360] | genes: [14] / trait Range[0]. |
| genes.json | `[14].traitRange[1]` | 1.7 | expressed trait units | [0, 360] | genes: [14] / trait Range[1]. |
| genes.json | `[15].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [15] / allele Range[0]. |
| genes.json | `[15].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [15] / allele Range[1]. |
| genes.json | `[15].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [15] / founder Range[0]. |
| genes.json | `[15].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [15] / founder Range[1]. |
| genes.json | `[15].traitRange[0]` | 0.5 | expressed trait units | [0, 360] | genes: [15] / trait Range[0]. |
| genes.json | `[15].traitRange[1]` | 1.8 | expressed trait units | [0, 360] | genes: [15] / trait Range[1]. |
| genes.json | `[16].options[0].dominance` | 1 | points | integer [0, 1000000] | genes[16] / options[0] / dominance |
| genes.json | `[16].options[0].founderWeight` | 0.5 | points | [0, 1000000] | genes[16] / options[0] / founderWeight |
| genes.json | `[16].options[1].dominance` | 0 | points | integer [0, 1000000] | genes[16] / options[1] / dominance |
| genes.json | `[16].options[1].founderWeight` | 0.35 | points | [0, 1000000] | genes[16] / options[1] / founderWeight |
| genes.json | `[16].options[2].dominance` | 0 | points | integer [0, 1000000] | genes[16] / options[2] / dominance |
| genes.json | `[16].options[2].founderWeight` | 0.15 | points | [0, 1000000] | genes[16] / options[2] / founderWeight |
| genes.json | `[17].alleleRange[0]` | 0 | points | integer [0, 1000000] | genes[17] / alleleRange[0] |
| genes.json | `[17].alleleRange[1]` | 255 | points | integer [0, 1000000] | genes[17] / alleleRange[1] |
| genes.json | `[17].founderRange[0]` | 0 | points | integer [0, 1000000] | genes[17] / founderRange[0] |
| genes.json | `[17].founderRange[1]` | 255 | points | integer [0, 1000000] | genes[17] / founderRange[1] |
| genes.json | `[17].traitRange[0]` | 0 | points | integer [0, 1000000] | genes[17] / traitRange[0] |
| genes.json | `[17].traitRange[1]` | 1 | points | integer [0, 1000000] | genes[17] / traitRange[1] |
| genes.json | `[18].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [18] / allele Range[0]. |
| genes.json | `[18].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [18] / allele Range[1]. |
| genes.json | `[18].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [18] / founder Range[0]. |
| genes.json | `[18].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [18] / founder Range[1]. |
| genes.json | `[18].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [18] / trait Range[0]. |
| genes.json | `[18].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [18] / trait Range[1]. |
| genes.json | `[19].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [19] / allele Range[0]. |
| genes.json | `[19].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [19] / allele Range[1]. |
| genes.json | `[19].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [19] / founder Range[0]. |
| genes.json | `[19].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [19] / founder Range[1]. |
| genes.json | `[19].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [19] / trait Range[0]. |
| genes.json | `[19].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [19] / trait Range[1]. |
| genes.json | `[20].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [20] / allele Range[0]. |
| genes.json | `[20].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [20] / allele Range[1]. |
| genes.json | `[20].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [20] / founder Range[0]. |
| genes.json | `[20].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [20] / founder Range[1]. |
| genes.json | `[20].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [20] / trait Range[0]. |
| genes.json | `[20].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [20] / trait Range[1]. |
| genes.json | `[21].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [21] / allele Range[0]. |
| genes.json | `[21].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [21] / allele Range[1]. |
| genes.json | `[21].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [21] / founder Range[0]. |
| genes.json | `[21].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [21] / founder Range[1]. |
| genes.json | `[21].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [21] / trait Range[0]. |
| genes.json | `[21].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [21] / trait Range[1]. |
| genes.json | `[22].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [22] / allele Range[0]. |
| genes.json | `[22].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [22] / allele Range[1]. |
| genes.json | `[22].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [22] / founder Range[0]. |
| genes.json | `[22].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [22] / founder Range[1]. |
| genes.json | `[22].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [22] / trait Range[0]. |
| genes.json | `[22].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [22] / trait Range[1]. |
| genes.json | `[23].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [23] / allele Range[0]. |
| genes.json | `[23].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [23] / allele Range[1]. |
| genes.json | `[23].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [23] / founder Range[0]. |
| genes.json | `[23].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [23] / founder Range[1]. |
| genes.json | `[23].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [23] / trait Range[0]. |
| genes.json | `[23].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [23] / trait Range[1]. |
| genes.json | `[24].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [24] / allele Range[0]. |
| genes.json | `[24].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [24] / allele Range[1]. |
| genes.json | `[24].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [24] / founder Range[0]. |
| genes.json | `[24].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [24] / founder Range[1]. |
| genes.json | `[24].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [24] / trait Range[0]. |
| genes.json | `[24].traitRange[1]` | 1 | expressed trait units | [0, 360] | genes: [24] / trait Range[1]. |
| genes.json | `[25].alleleRange[0]` | 0 | allele byte | integer [0, 255] | genes: [25] / allele Range[0]. |
| genes.json | `[25].alleleRange[1]` | 255 | allele byte | integer [0, 255] | genes: [25] / allele Range[1]. |
| genes.json | `[25].founderRange[0]` | 0 | allele byte | integer [0, 255] | genes: [25] / founder Range[0]. |
| genes.json | `[25].founderRange[1]` | 255 | allele byte | integer [0, 255] | genes: [25] / founder Range[1]. |
| genes.json | `[25].traitRange[0]` | 0 | expressed trait units | [0, 360] | genes: [25] / trait Range[0]. |
| genes.json | `[25].traitRange[1]` | 360 | expressed trait units | [0, 360] | genes: [25] / trait Range[1]. |
| genes.json | `[26].alleleRange[0]` | 0 | points | integer [0, 1000000] | genes[26] / alleleRange[0] |
| genes.json | `[26].alleleRange[1]` | 255 | points | integer [0, 1000000] | genes[26] / alleleRange[1] |
| genes.json | `[26].founderRange[0]` | 0 | points | integer [0, 1000000] | genes[26] / founderRange[0] |
| genes.json | `[26].founderRange[1]` | 255 | points | integer [0, 1000000] | genes[26] / founderRange[1] |
| genes.json | `[26].traitRange[0]` | 0 | points | integer [0, 1000000] | genes[26] / traitRange[0] |
| genes.json | `[26].traitRange[1]` | 360 | points | integer [0, 1000000] | genes[26] / traitRange[1] |
| appearance.json | `frame.size` | 64 | rig pixels | [1, 1024] | appearance: frame / size. |
| appearance.json | `frame.bodyCenter.x` | 32 | rig pixels | [-256, 256] | appearance: frame / body Center / x. |
| appearance.json | `frame.bodyCenter.y` | 36 | rig pixels | [-256, 256] | appearance: frame / body Center / y. |
| appearance.json | `frame.maximumRadius` | 56 | rig pixels | [1, 1024] | appearance: frame / maximum Radius. |
| appearance.json | `frame.worldUnitsPerPixel` | 0.085 | tiles/rig pixel | [1e-12, 1] | appearance: frame / world Units Per Pixel. |
| appearance.json | `frame.hitRadiusTiles` | 0.95 | tiles | [-10000000, 10000000] | appearance: frame / hit Radius Tiles. |
| appearance.json | `frame.thoughtOffsetTiles` | 5.1 | tiles | [-1024, 1024] | appearance: frame / thought Offset Tiles. |
| appearance.json | `frame.nameOffsetTiles` | 3.4 | tiles | [-1024, 1024] | appearance: frame / name Offset Tiles. |
| appearance.json | `slots[0].anchor.x` | 0.5 | normalized body coordinate | [0, 1] | appearance: slots[0] / anchor / x. |
| appearance.json | `slots[0].anchor.y` | 0.875 | normalized body coordinate | [0, 1] | appearance: slots[0] / anchor / y. |
| appearance.json | `slots[0].attachTo.yOnly` | true | flag | false, true | Boolean switch for appearance: slots[0].attachTo.yOnly. |
| appearance.json | `slots[1].anchor.x` | 0.390625 | normalized body coordinate | [0, 1] | appearance: slots[1] / anchor / x. |
| appearance.json | `slots[1].anchor.y` | 0.4375 | normalized body coordinate | [0, 1] | appearance: slots[1] / anchor / y. |
| appearance.json | `slots[2].anchor.x` | 0.34375 | normalized body coordinate | [0, 1] | appearance: slots[2] / anchor / x. |
| appearance.json | `slots[2].anchor.y` | 0.609375 | normalized body coordinate | [0, 1] | appearance: slots[2] / anchor / y. |
| appearance.json | `slots[3].anchor.x` | 0.34375 | normalized body coordinate | [0, 1] | appearance: slots[3] / anchor / x. |
| appearance.json | `slots[3].anchor.y` | 0.609375 | normalized body coordinate | [0, 1] | appearance: slots[3] / anchor / y. |
| appearance.json | `slots[4].anchor.x` | 0.375 | normalized body coordinate | [0, 1] | appearance: slots[4] / anchor / x. |
| appearance.json | `slots[4].anchor.y` | 0.609375 | normalized body coordinate | [0, 1] | appearance: slots[4] / anchor / y. |
| appearance.json | `slots[5].anchor.x` | 0.390625 | normalized body coordinate | [0, 1] | appearance: slots[5] / anchor / x. |
| appearance.json | `slots[5].anchor.y` | 0.703125 | normalized body coordinate | [0, 1] | appearance: slots[5] / anchor / y. |
| appearance.json | `slots[6].anchor.x` | 0.390625 | normalized body coordinate | [0, 1] | appearance: slots[6] / anchor / x. |
| appearance.json | `slots[6].anchor.y` | 0.59375 | normalized body coordinate | [0, 1] | appearance: slots[6] / anchor / y. |
| appearance.json | `slots[7].anchor.x` | 0.5 | normalized body coordinate | [0, 1] | appearance: slots[7] / anchor / x. |
| appearance.json | `slots[7].anchor.y` | 0.5625 | normalized body coordinate | [0, 1] | appearance: slots[7] / anchor / y. |
| appearance.json | `slots[8].anchor.x` | 0.5 | normalized body coordinate | [0, 1] | appearance: slots[8] / anchor / x. |
| appearance.json | `slots[8].anchor.y` | 0.5 | normalized body coordinate | [0, 1] | appearance: slots[8] / anchor / y. |
| appearance.json | `slots[9].anchor.x` | 0.609375 | normalized body coordinate | [0, 1] | appearance: slots[9] / anchor / x. |
| appearance.json | `slots[9].anchor.y` | 0.703125 | normalized body coordinate | [0, 1] | appearance: slots[9] / anchor / y. |
| appearance.json | `slots[10].anchor.x` | 0.578125 | normalized body coordinate | [0, 1] | appearance: slots[10] / anchor / x. |
| appearance.json | `slots[10].anchor.y` | 0.40625 | normalized body coordinate | [0, 1] | appearance: slots[10] / anchor / y. |
| appearance.json | `slots[11].anchor.x` | 0.578125 | normalized body coordinate | [0, 1] | appearance: slots[11] / anchor / x. |
| appearance.json | `slots[11].anchor.y` | 0.40625 | normalized body coordinate | [0, 1] | appearance: slots[11] / anchor / y. |
| appearance.json | `slots[12].anchor.x` | 0.625 | normalized body coordinate | [0, 1] | appearance: slots[12] / anchor / x. |
| appearance.json | `slots[12].anchor.y` | 0.59375 | normalized body coordinate | [0, 1] | appearance: slots[12] / anchor / y. |
| appearance.json | `slots[13].anchor.x` | 0.578125 | normalized body coordinate | [0, 1] | appearance: slots[13] / anchor / x. |
| appearance.json | `slots[13].anchor.y` | 0.625 | normalized body coordinate | [0, 1] | appearance: slots[13] / anchor / y. |
| appearance.json | `slots[14].anchor.x` | 0.484375 | normalized body coordinate | [0, 1] | appearance: slots[14] / anchor / x. |
| appearance.json | `slots[14].anchor.y` | 0.453125 | normalized body coordinate | [0, 1] | appearance: slots[14] / anchor / y. |
| appearance.json | `slots[15].anchor.x` | 0.578125 | normalized body coordinate | [0, 1] | appearance: slots[15] / anchor / x. |
| appearance.json | `slots[15].anchor.y` | 0.40625 | normalized body coordinate | [0, 1] | appearance: slots[15] / anchor / y. |
| appearance.json | `slots[16].anchor.x` | 0.46875 | normalized body coordinate | [0, 1] | appearance: slots[16] / anchor / x. |
| appearance.json | `slots[16].anchor.y` | 0.390625 | normalized body coordinate | [0, 1] | appearance: slots[16] / anchor / y. |
| appearance.json | `slots[17].anchor.x` | 0.5 | normalized body coordinate | [0, 1] | appearance: slots[17] / anchor / x. |
| appearance.json | `slots[17].anchor.y` | 0.5625 | normalized body coordinate | [0, 1] | appearance: slots[17] / anchor / y. |
| appearance.json | `slots[18].anchor.x` | 0.578125 | normalized body coordinate | [0, 1] | appearance: slots[18] / anchor / x. |
| appearance.json | `slots[18].anchor.y` | 0.40625 | normalized body coordinate | [0, 1] | appearance: slots[18] / anchor / y. |
| appearance.json | `parts[0].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[0] / tiers[0] / tier. |
| appearance.json | `parts[0].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[0] / tiers[0] / level Threshold. |
| appearance.json | `parts[0].tiers[0].recipe[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[0] / tiers[0] / recipe[0] / radius / x. |
| appearance.json | `parts[0].tiers[0].recipe[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[0] / tiers[0] / recipe[0] / radius / y. |
| appearance.json | `parts[0].tiers[0].recipe[0].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[0] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[0].tiers[0].recipe[0].scale.x` | 16 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[0] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[0].tiers[0].recipe[0].scale.y` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[0] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[0].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[0] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[0].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[0] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[0].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[0] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[0].tiers[0].recipe[0].opacity` | 0.16 | coefficient | [-10000000, 10000000] | appearance: parts[0] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[0].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[0] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[1].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[1] / tiers[0] / tier. |
| appearance.json | `parts[1].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[1] / tiers[0] / level Threshold. |
| appearance.json | `parts[1].tiers[0].recipe[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[1] / tiers[0] / recipe[0] / radius / x. |
| appearance.json | `parts[1].tiers[0].recipe[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[1] / tiers[0] / recipe[0] / radius / y. |
| appearance.json | `parts[1].tiers[0].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[1] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[1].tiers[0].recipe[0].scale.x` | 11 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[1].tiers[0].recipe[0].scale.y` | 13 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[1].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[1].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[1].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[1].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[1] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[1].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[1] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[1].tiers[0].recipe[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[1] / tiers[0] / recipe[1] / radius / x. |
| appearance.json | `parts[1].tiers[0].recipe[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[1] / tiers[0] / recipe[1] / radius / y. |
| appearance.json | `parts[1].tiers[0].recipe[1].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[1] / tiers[0] / recipe[1] / stroke Width. |
| appearance.json | `parts[1].tiers[0].recipe[1].scale.x` | 6.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[1] / scale / x. |
| appearance.json | `parts[1].tiers[0].recipe[1].scale.y` | 8.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[1] / scale / y. |
| appearance.json | `parts[1].tiers[0].recipe[1].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[1] / rotation. |
| appearance.json | `parts[1].tiers[0].recipe[1].offset.x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[1] / offset / x. |
| appearance.json | `parts[1].tiers[0].recipe[1].offset.y` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[1] / tiers[0] / recipe[1] / offset / y. |
| appearance.json | `parts[1].tiers[0].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[1] / tiers[0] / recipe[1] / opacity. |
| appearance.json | `parts[1].tiers[0].recipe[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[1] / tiers[0] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[2].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[2] / tiers[0] / tier. |
| appearance.json | `parts[2].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[2] / tiers[0] / level Threshold. |
| appearance.json | `parts[2].tiers[0].recipe[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[2] / tiers[0] / recipe[0] / radius / x. |
| appearance.json | `parts[2].tiers[0].recipe[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[2] / tiers[0] / recipe[0] / radius / y. |
| appearance.json | `parts[2].tiers[0].recipe[0].strokeWidth` | 0.075 | coefficient | [-10000000, 10000000] | appearance: parts[2] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[2].tiers[0].recipe[0].scale.x` | 9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[2].tiers[0].recipe[0].scale.y` | 8.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[2].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[2].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[2].tiers[0].recipe[0].offset.y` | -4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[2].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[2] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[2].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[2] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[2].tiers[0].recipe[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[2] / tiers[0] / recipe[1] / radius / x. |
| appearance.json | `parts[2].tiers[0].recipe[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[2] / tiers[0] / recipe[1] / radius / y. |
| appearance.json | `parts[2].tiers[0].recipe[1].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[2] / tiers[0] / recipe[1] / stroke Width. |
| appearance.json | `parts[2].tiers[0].recipe[1].scale.x` | 4.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[1] / scale / x. |
| appearance.json | `parts[2].tiers[0].recipe[1].scale.y` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[1] / scale / y. |
| appearance.json | `parts[2].tiers[0].recipe[1].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[1] / rotation. |
| appearance.json | `parts[2].tiers[0].recipe[1].offset.x` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[1] / offset / x. |
| appearance.json | `parts[2].tiers[0].recipe[1].offset.y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[2] / tiers[0] / recipe[1] / offset / y. |
| appearance.json | `parts[2].tiers[0].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[2] / tiers[0] / recipe[1] / opacity. |
| appearance.json | `parts[2].tiers[0].recipe[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[2] / tiers[0] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[3] / tiers[0] / tier. |
| appearance.json | `parts[3].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[3] / tiers[0] / level Threshold. |
| appearance.json | `parts[3].tiers[0].recipe[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / recipe[0] / radius / x. |
| appearance.json | `parts[3].tiers[0].recipe[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / recipe[0] / radius / y. |
| appearance.json | `parts[3].tiers[0].recipe[0].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[3].tiers[0].recipe[0].scale.x` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[3].tiers[0].recipe[0].scale.y` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[3].tiers[0].recipe[0].rotation` | -0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[3].tiers[0].recipe[0].offset.x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[3].tiers[0].recipe[0].offset.y` | -10.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[3].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[3].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].recipe[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / recipe[1] / radius / x. |
| appearance.json | `parts[3].tiers[0].recipe[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / recipe[1] / radius / y. |
| appearance.json | `parts[3].tiers[0].recipe[1].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / recipe[1] / stroke Width. |
| appearance.json | `parts[3].tiers[0].recipe[1].scale.x` | 2.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[1] / scale / x. |
| appearance.json | `parts[3].tiers[0].recipe[1].scale.y` | 3.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[1] / scale / y. |
| appearance.json | `parts[3].tiers[0].recipe[1].rotation` | 0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[1] / rotation. |
| appearance.json | `parts[3].tiers[0].recipe[1].offset.x` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[1] / offset / x. |
| appearance.json | `parts[3].tiers[0].recipe[1].offset.y` | -10.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / recipe[1] / offset / y. |
| appearance.json | `parts[3].tiers[0].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / recipe[1] / opacity. |
| appearance.json | `parts[3].tiers[0].recipe[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.round[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / variants / round[0] / radius / x. |
| appearance.json | `parts[3].tiers[0].variants.round[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / variants / round[0] / radius / y. |
| appearance.json | `parts[3].tiers[0].variants.round[0].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / round[0] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.round[0].scale.x` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[0] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.round[0].scale.y` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[0] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.round[0].rotation` | -0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[0] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.round[0].offset.x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[0] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.round[0].offset.y` | -10.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[0] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.round[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / round[0] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.round[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / variants / round[0] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.round[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / variants / round[1] / radius / x. |
| appearance.json | `parts[3].tiers[0].variants.round[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[3] / tiers[0] / variants / round[1] / radius / y. |
| appearance.json | `parts[3].tiers[0].variants.round[1].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / round[1] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.round[1].scale.x` | 2.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[1] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.round[1].scale.y` | 3.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[1] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.round[1].rotation` | 0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[1] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.round[1].offset.x` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[1] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.round[1].offset.y` | -10.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / round[1] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.round[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / round[1] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.round[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / variants / round[1] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].strokeWidth` | 0.13 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].scale.x` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].scale.y` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].rotation` | -0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].offset.x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].offset.y` | -10.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].opacity` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].saturationMultiplier` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[3].tiers[0].variants.pointed[0].smoothing. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[0] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[0].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[0] / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[1].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[1] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[1].y` | -1.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[1] / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[2].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[2] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[0].points[2].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[0] / points[2] / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].strokeWidth` | 0.13 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].scale.x` | 2.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].scale.y` | 3.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].rotation` | 0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].offset.x` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].offset.y` | -10.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].opacity` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].saturationMultiplier` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[3].tiers[0].variants.pointed[1].smoothing. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[0] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[0].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[0] / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[1].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[1] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[1].y` | -1.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[1] / y. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[2].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[2] / x. |
| appearance.json | `parts[3].tiers[0].variants.pointed[1].points[2].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / pointed[1] / points[2] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / folded[0] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].scale.x` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].scale.y` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].rotation` | -0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].offset.x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].offset.y` | -10.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / folded[0] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / variants / folded[0] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[3].tiers[0].variants.folded[0].smoothing. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[0] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[0].y` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[0] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[1].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[1] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[1].y` | -1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[1] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[2].x` | 0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[2] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[2].y` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[2] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[3].x` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[3] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[0].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[0] / points[3] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].strokeWidth` | 0.13 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / folded[1] / stroke Width. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].scale.x` | 2.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / scale / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].scale.y` | 3.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / scale / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].rotation` | 0.3 | radians | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / rotation. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].offset.x` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / offset / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].offset.y` | -10.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / offset / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[3] / tiers[0] / variants / folded[1] / opacity. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[3] / tiers[0] / variants / folded[1] / saturation Multiplier. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[3].tiers[0].variants.folded[1].smoothing. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[0] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[0].y` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[0] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[1].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[1] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[1].y` | -1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[1] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[2].x` | 0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[2] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[2].y` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[2] / y. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[3].x` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[3] / x. |
| appearance.json | `parts[3].tiers[0].variants.folded[1].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[3] / tiers[0] / variants / folded[1] / points[3] / y. |
| appearance.json | `parts[4].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[4] / tiers[0] / tier. |
| appearance.json | `parts[4].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[4] / tiers[0] / level Threshold. |
| appearance.json | `parts[4].tiers[0].recipe[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[0] / radius / x. |
| appearance.json | `parts[4].tiers[0].recipe[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[0] / radius / y. |
| appearance.json | `parts[4].tiers[0].recipe[0].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[4].tiers[0].recipe[0].scale.x` | 0.9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[4].tiers[0].recipe[0].scale.y` | 1.25 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[4].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[4].tiers[0].recipe[0].offset.x` | 2.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[4].tiers[0].recipe[0].offset.y` | -4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[4].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[4].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[4] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[4].tiers[0].recipe[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[1] / radius / x. |
| appearance.json | `parts[4].tiers[0].recipe[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[1] / radius / y. |
| appearance.json | `parts[4].tiers[0].recipe[1].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[1] / stroke Width. |
| appearance.json | `parts[4].tiers[0].recipe[1].scale.x` | 0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[1] / scale / x. |
| appearance.json | `parts[4].tiers[0].recipe[1].scale.y` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[1] / scale / y. |
| appearance.json | `parts[4].tiers[0].recipe[1].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[1] / rotation. |
| appearance.json | `parts[4].tiers[0].recipe[1].offset.x` | -2.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[1] / offset / x. |
| appearance.json | `parts[4].tiers[0].recipe[1].offset.y` | -4.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[1] / offset / y. |
| appearance.json | `parts[4].tiers[0].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[1] / opacity. |
| appearance.json | `parts[4].tiers[0].recipe[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[4] / tiers[0] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[4].tiers[0].recipe[2].radius.x` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[2] / radius / x. |
| appearance.json | `parts[4].tiers[0].recipe[2].radius.y` | 1 | geometry units | [-256, 256] | appearance: parts[4] / tiers[0] / recipe[2] / radius / y. |
| appearance.json | `parts[4].tiers[0].recipe[2].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[2] / stroke Width. |
| appearance.json | `parts[4].tiers[0].recipe[2].scale.x` | 1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[2] / scale / x. |
| appearance.json | `parts[4].tiers[0].recipe[2].scale.y` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[2] / scale / y. |
| appearance.json | `parts[4].tiers[0].recipe[2].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[2] / rotation. |
| appearance.json | `parts[4].tiers[0].recipe[2].offset.x` | 6.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[2] / offset / x. |
| appearance.json | `parts[4].tiers[0].recipe[2].offset.y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[2] / offset / y. |
| appearance.json | `parts[4].tiers[0].recipe[2].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[2] / opacity. |
| appearance.json | `parts[4].tiers[0].recipe[2].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[4] / tiers[0] / recipe[2] / saturation Multiplier. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[0] / x. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[0] / y. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[1].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[1] / x. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[1].y` | 0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[1] / y. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[2].x` | 1.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[2] / x. |
| appearance.json | `parts[4].tiers[0].recipe[3].points[2].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / points[2] / y. |
| appearance.json | `parts[4].tiers[0].recipe[3].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[4].tiers[0].recipe[3].smoothing. |
| appearance.json | `parts[4].tiers[0].recipe[3].strokeWidth` | 0.6 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[3] / stroke Width. |
| appearance.json | `parts[4].tiers[0].recipe[3].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / scale / x. |
| appearance.json | `parts[4].tiers[0].recipe[3].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / scale / y. |
| appearance.json | `parts[4].tiers[0].recipe[3].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / rotation. |
| appearance.json | `parts[4].tiers[0].recipe[3].offset.x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / offset / x. |
| appearance.json | `parts[4].tiers[0].recipe[3].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[4] / tiers[0] / recipe[3] / offset / y. |
| appearance.json | `parts[4].tiers[0].recipe[3].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[4] / tiers[0] / recipe[3] / opacity. |
| appearance.json | `parts[4].tiers[0].recipe[3].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[4] / tiers[0] / recipe[3] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[5] / tiers[0] / tier. |
| appearance.json | `parts[5].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[5] / tiers[0] / level Threshold. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[0].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[1].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[4].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[5].x` | -0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[5] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[5].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[5] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[6].x` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[6] / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].points[6].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / points[6] / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[5].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[5].tiers[0].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[5].tiers[0].recipe[0].scale.x` | 3.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].scale.y` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[5].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[5].tiers[0].recipe[0].offset.y` | 8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[5].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[5].tiers[0].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[5] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[0].attachments.ground.x` | 0 | geometry units | [-256, 256] | appearance: parts[5] / tiers[0] / attachments / ground / x. |
| appearance.json | `parts[5].tiers[0].attachments.ground.y` | 10.8 | geometry units | [-256, 256] | appearance: parts[5] / tiers[0] / attachments / ground / y. |
| appearance.json | `parts[5].tiers[1].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[5] / tiers[1] / tier. |
| appearance.json | `parts[5].tiers[1].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[5] / tiers[1] / level Threshold. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[4].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[4] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[4] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[5].x` | -0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[5] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[5].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[5] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[6].x` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[6] / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].points[6].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / points[6] / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[5].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[5].tiers[1].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[5].tiers[1].recipe[0].scale.x` | 3.5500000000000003 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].scale.y` | 3.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].rotation` | -0.07 | radians | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[5].tiers[1].recipe[0].offset.x` | 0.35 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[5].tiers[1].recipe[0].offset.y` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[5].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[5].tiers[1].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[5] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[1].attachments.ground.x` | 0 | geometry units | [-256, 256] | appearance: parts[5] / tiers[1] / attachments / ground / x. |
| appearance.json | `parts[5].tiers[1].attachments.ground.y` | 11.05 | geometry units | [-256, 256] | appearance: parts[5] / tiers[1] / attachments / ground / y. |
| appearance.json | `parts[5].tiers[2].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[5] / tiers[2] / tier. |
| appearance.json | `parts[5].tiers[2].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[5] / tiers[2] / level Threshold. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[4].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[4] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[4] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[5].x` | -0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[5] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[5].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[5] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[6].x` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[6] / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].points[6].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / points[6] / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[5].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[5].tiers[2].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[5].tiers[2].recipe[0].scale.x` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].scale.y` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].rotation` | -0.14 | radians | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[5].tiers[2].recipe[0].offset.x` | 0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[5].tiers[2].recipe[0].offset.y` | 6.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[5].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[5].tiers[2].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[5] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[2].attachments.ground.x` | 0 | geometry units | [-256, 256] | appearance: parts[5] / tiers[2] / attachments / ground / x. |
| appearance.json | `parts[5].tiers[2].attachments.ground.y` | 11.3 | geometry units | [-256, 256] | appearance: parts[5] / tiers[2] / attachments / ground / y. |
| appearance.json | `parts[5].tiers[3].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[5] / tiers[3] / tier. |
| appearance.json | `parts[5].tiers[3].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[5] / tiers[3] / level Threshold. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[0] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[0] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[1] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[1] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[2] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[2] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[3] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[3] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[4].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[4] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[4] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[5].x` | -0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[5] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[5].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[5] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[6].x` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[6] / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].points[6].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / points[6] / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[5].tiers[3].recipe[0].smoothing. |
| appearance.json | `parts[5].tiers[3].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[5].tiers[3].recipe[0].scale.x` | 4.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].scale.y` | 5.35 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].rotation` | -0.21000000000000002 | radians | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[5].tiers[3].recipe[0].offset.x` | 1.0499999999999998 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[5].tiers[3].recipe[0].offset.y` | 6.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[5].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[5].tiers[3].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[5] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[3].attachments.ground.x` | 0 | geometry units | [-256, 256] | appearance: parts[5] / tiers[3] / attachments / ground / x. |
| appearance.json | `parts[5].tiers[3].attachments.ground.y` | 11.55 | geometry units | [-256, 256] | appearance: parts[5] / tiers[3] / attachments / ground / y. |
| appearance.json | `parts[5].tiers[4].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[5] / tiers[4] / tier. |
| appearance.json | `parts[5].tiers[4].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[5] / tiers[4] / level Threshold. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[0] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[0] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[1] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[1] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[2] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[2] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[3] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[3] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[4].x` | 0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[4] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[4] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[5].x` | -0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[5] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[5].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[5] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[6].x` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[6] / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].points[6].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / points[6] / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[5].tiers[4].recipe[0].smoothing. |
| appearance.json | `parts[5].tiers[4].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[4] / recipe[0] / stroke Width. |
| appearance.json | `parts[5].tiers[4].recipe[0].scale.x` | 4.9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / scale / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].scale.y` | 6.199999999999999 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / scale / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].rotation` | -0.28 | radians | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / rotation. |
| appearance.json | `parts[5].tiers[4].recipe[0].offset.x` | 1.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / offset / x. |
| appearance.json | `parts[5].tiers[4].recipe[0].offset.y` | 5.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[5] / tiers[4] / recipe[0] / offset / y. |
| appearance.json | `parts[5].tiers[4].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[5] / tiers[4] / recipe[0] / opacity. |
| appearance.json | `parts[5].tiers[4].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[5] / tiers[4] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[5].tiers[4].attachments.ground.x` | 0 | geometry units | [-256, 256] | appearance: parts[5] / tiers[4] / attachments / ground / x. |
| appearance.json | `parts[5].tiers[4].attachments.ground.y` | 11.799999999999999 | geometry units | [-256, 256] | appearance: parts[5] / tiers[4] / attachments / ground / y. |
| appearance.json | `parts[6].tiers[0].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[6] / tiers[0] / tier. |
| appearance.json | `parts[6].tiers[0].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[6] / tiers[0] / level Threshold. |
| appearance.json | `parts[6].tiers[0].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[0] / x |
| appearance.json | `parts[6].tiers[0].recipe[0].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[0] / y |
| appearance.json | `parts[6].tiers[0].recipe[0].points[1].x` | -0.85 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[1] / x |
| appearance.json | `parts[6].tiers[0].recipe[0].points[1].y` | -0.45 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[1] / y |
| appearance.json | `parts[6].tiers[0].recipe[0].points[2].x` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[2] / x |
| appearance.json | `parts[6].tiers[0].recipe[0].points[2].y` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[2] / y |
| appearance.json | `parts[6].tiers[0].recipe[0].points[3].x` | -0.35 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[3] / x |
| appearance.json | `parts[6].tiers[0].recipe[0].points[3].y` | -0.8 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[3] / y |
| appearance.json | `parts[6].tiers[0].recipe[0].points[4].x` | 0.08 | points | [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[4] / x |
| appearance.json | `parts[6].tiers[0].recipe[0].points[4].y` | -0.25 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[0] / points[4] / y |
| appearance.json | `parts[6].tiers[0].recipe[0].smoothing` | true | switch | false, true | appearance.parts[6].tiers[0].recipe[0].smoothing |
| appearance.json | `parts[6].tiers[0].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[6].tiers[0].recipe[0].scale.x` | 8.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[6].tiers[0].recipe[0].scale.y` | 9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[6].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[6].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[6].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[6].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[6].tiers[0].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[0].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / points[0] / x |
| appearance.json | `parts[6].tiers[0].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / points[0] / y |
| appearance.json | `parts[6].tiers[0].recipe[1].points[1].x` | -0.38 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / points[1] / x |
| appearance.json | `parts[6].tiers[0].recipe[1].points[1].y` | -0.65 | points | [-100, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / points[1] / y |
| appearance.json | `parts[6].tiers[0].recipe[1].smoothing` | true | switch | false, true | appearance.parts[6].tiers[0].recipe[1].smoothing |
| appearance.json | `parts[6].tiers[0].recipe[1].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / strokeWidth |
| appearance.json | `parts[6].tiers[0].recipe[1].scale.x` | 8.3 | points | [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / scale / x |
| appearance.json | `parts[6].tiers[0].recipe[1].scale.y` | 9 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / scale / y |
| appearance.json | `parts[6].tiers[0].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / rotation |
| appearance.json | `parts[6].tiers[0].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / offset / x |
| appearance.json | `parts[6].tiers[0].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / offset / y |
| appearance.json | `parts[6].tiers[0].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / opacity |
| appearance.json | `parts[6].tiers[0].recipe[1].saturationMultiplier` | 0.85 | points | [0, 1000000] | appearance / parts[6] / tiers[0] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[6].tiers[1].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[6] / tiers[1] / tier. |
| appearance.json | `parts[6].tiers[1].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[6] / tiers[1] / level Threshold. |
| appearance.json | `parts[6].tiers[1].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[0] / x |
| appearance.json | `parts[6].tiers[1].recipe[0].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[0] / y |
| appearance.json | `parts[6].tiers[1].recipe[0].points[1].x` | -0.85 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[1] / x |
| appearance.json | `parts[6].tiers[1].recipe[0].points[1].y` | -0.45 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[1] / y |
| appearance.json | `parts[6].tiers[1].recipe[0].points[2].x` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[2] / x |
| appearance.json | `parts[6].tiers[1].recipe[0].points[2].y` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[2] / y |
| appearance.json | `parts[6].tiers[1].recipe[0].points[3].x` | -0.35 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[3] / x |
| appearance.json | `parts[6].tiers[1].recipe[0].points[3].y` | -0.8 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[3] / y |
| appearance.json | `parts[6].tiers[1].recipe[0].points[4].x` | 0.08 | points | [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[4] / x |
| appearance.json | `parts[6].tiers[1].recipe[0].points[4].y` | -0.25 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[0] / points[4] / y |
| appearance.json | `parts[6].tiers[1].recipe[0].smoothing` | true | switch | false, true | appearance.parts[6].tiers[1].recipe[0].smoothing |
| appearance.json | `parts[6].tiers[1].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[6].tiers[1].recipe[0].scale.x` | 11.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[6].tiers[1].recipe[0].scale.y` | 13 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[6].tiers[1].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[6].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[6].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[6].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[6].tiers[1].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[1].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / points[0] / x |
| appearance.json | `parts[6].tiers[1].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / points[0] / y |
| appearance.json | `parts[6].tiers[1].recipe[1].points[1].x` | -0.38 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / points[1] / x |
| appearance.json | `parts[6].tiers[1].recipe[1].points[1].y` | -0.65 | points | [-100, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / points[1] / y |
| appearance.json | `parts[6].tiers[1].recipe[1].smoothing` | true | switch | false, true | appearance.parts[6].tiers[1].recipe[1].smoothing |
| appearance.json | `parts[6].tiers[1].recipe[1].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / strokeWidth |
| appearance.json | `parts[6].tiers[1].recipe[1].scale.x` | 11.6 | points | [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / scale / x |
| appearance.json | `parts[6].tiers[1].recipe[1].scale.y` | 13 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / scale / y |
| appearance.json | `parts[6].tiers[1].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / rotation |
| appearance.json | `parts[6].tiers[1].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / offset / x |
| appearance.json | `parts[6].tiers[1].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / offset / y |
| appearance.json | `parts[6].tiers[1].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / opacity |
| appearance.json | `parts[6].tiers[1].recipe[1].saturationMultiplier` | 0.85 | points | [0, 1000000] | appearance / parts[6] / tiers[1] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[6].tiers[2].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[6] / tiers[2] / tier. |
| appearance.json | `parts[6].tiers[2].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[6] / tiers[2] / level Threshold. |
| appearance.json | `parts[6].tiers[2].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[0] / x |
| appearance.json | `parts[6].tiers[2].recipe[0].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[0] / y |
| appearance.json | `parts[6].tiers[2].recipe[0].points[1].x` | -0.85 | points | [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[1] / x |
| appearance.json | `parts[6].tiers[2].recipe[0].points[1].y` | -0.45 | points | [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[1] / y |
| appearance.json | `parts[6].tiers[2].recipe[0].points[2].x` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[2] / x |
| appearance.json | `parts[6].tiers[2].recipe[0].points[2].y` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[2] / y |
| appearance.json | `parts[6].tiers[2].recipe[0].points[3].x` | -0.35 | points | [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[3] / x |
| appearance.json | `parts[6].tiers[2].recipe[0].points[3].y` | -0.8 | points | [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[3] / y |
| appearance.json | `parts[6].tiers[2].recipe[0].points[4].x` | 0.08 | points | [0, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[4] / x |
| appearance.json | `parts[6].tiers[2].recipe[0].points[4].y` | -0.25 | points | [-100, 1000000] | appearance / parts[6] / tiers[2] / recipe[0] / points[4] / y |
| appearance.json | `parts[6].tiers[2].recipe[0].smoothing` | true | switch | false, true | appearance.parts[6].tiers[2].recipe[0].smoothing |
| appearance.json | `parts[6].tiers[2].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[6].tiers[2].recipe[0].scale.x` | 14.899999999999999 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[6].tiers[2].recipe[0].scale.y` | 17 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[6].tiers[2].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[6].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[6].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[6].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[6].tiers[2].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[2].recipe[1].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / points[0] / x. |
| appearance.json | `parts[6].tiers[2].recipe[1].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / points[0] / y. |
| appearance.json | `parts[6].tiers[2].recipe[1].points[1].x` | -0.38 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / points[1] / x. |
| appearance.json | `parts[6].tiers[2].recipe[1].points[1].y` | -0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / points[1] / y. |
| appearance.json | `parts[6].tiers[2].recipe[1].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[6].tiers[2].recipe[1].smoothing. |
| appearance.json | `parts[6].tiers[2].recipe[1].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[2] / recipe[1] / stroke Width. |
| appearance.json | `parts[6].tiers[2].recipe[1].scale.x` | 14.899999999999999 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / scale / x. |
| appearance.json | `parts[6].tiers[2].recipe[1].scale.y` | 17 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / scale / y. |
| appearance.json | `parts[6].tiers[2].recipe[1].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / rotation. |
| appearance.json | `parts[6].tiers[2].recipe[1].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / offset / x. |
| appearance.json | `parts[6].tiers[2].recipe[1].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[2] / recipe[1] / offset / y. |
| appearance.json | `parts[6].tiers[2].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[2] / recipe[1] / opacity. |
| appearance.json | `parts[6].tiers[2].recipe[1].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[2] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[3].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[6] / tiers[3] / tier. |
| appearance.json | `parts[6].tiers[3].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[6] / tiers[3] / level Threshold. |
| appearance.json | `parts[6].tiers[3].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[0] / x |
| appearance.json | `parts[6].tiers[3].recipe[0].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[0] / y |
| appearance.json | `parts[6].tiers[3].recipe[0].points[1].x` | -0.85 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[1] / x |
| appearance.json | `parts[6].tiers[3].recipe[0].points[1].y` | -0.45 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[1] / y |
| appearance.json | `parts[6].tiers[3].recipe[0].points[2].x` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[2] / x |
| appearance.json | `parts[6].tiers[3].recipe[0].points[2].y` | -1 | points | integer [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[2] / y |
| appearance.json | `parts[6].tiers[3].recipe[0].points[3].x` | -0.35 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[3] / x |
| appearance.json | `parts[6].tiers[3].recipe[0].points[3].y` | -0.8 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[3] / y |
| appearance.json | `parts[6].tiers[3].recipe[0].points[4].x` | 0.08 | points | [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[4] / x |
| appearance.json | `parts[6].tiers[3].recipe[0].points[4].y` | -0.25 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[0] / points[4] / y |
| appearance.json | `parts[6].tiers[3].recipe[0].smoothing` | true | switch | false, true | appearance.parts[6].tiers[3].recipe[0].smoothing |
| appearance.json | `parts[6].tiers[3].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[6].tiers[3].recipe[0].scale.x` | 18.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[6].tiers[3].recipe[0].scale.y` | 21 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[6].tiers[3].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[6].tiers[3].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[6].tiers[3].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[6].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[6].tiers[3].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[0] / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[0] / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[1].x` | -0.85 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[1] / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[1].y` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[1] / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[2].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[2] / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[2] / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[3].x` | -0.35 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[3] / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[3].y` | -0.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / points[3] / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].points[4].x` | 0.08 | points | [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[1] / points[4] / x |
| appearance.json | `parts[6].tiers[3].recipe[1].points[4].y` | -0.25 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[1] / points[4] / y |
| appearance.json | `parts[6].tiers[3].recipe[1].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[6].tiers[3].recipe[1].smoothing. |
| appearance.json | `parts[6].tiers[3].recipe[1].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[3] / recipe[1] / stroke Width. |
| appearance.json | `parts[6].tiers[3].recipe[1].scale.x` | 10.92 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / scale / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].scale.y` | 16.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / scale / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / rotation. |
| appearance.json | `parts[6].tiers[3].recipe[1].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / offset / x. |
| appearance.json | `parts[6].tiers[3].recipe[1].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[6] / tiers[3] / recipe[1] / offset / y. |
| appearance.json | `parts[6].tiers[3].recipe[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[6] / tiers[3] / recipe[1] / opacity. |
| appearance.json | `parts[6].tiers[3].recipe[1].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[6] / tiers[3] / recipe[1] / saturation Multiplier. |
| appearance.json | `parts[6].tiers[3].recipe[2].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / points[0] / x |
| appearance.json | `parts[6].tiers[3].recipe[2].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / points[0] / y |
| appearance.json | `parts[6].tiers[3].recipe[2].points[1].x` | -0.38 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / points[1] / x |
| appearance.json | `parts[6].tiers[3].recipe[2].points[1].y` | -0.65 | points | [-100, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / points[1] / y |
| appearance.json | `parts[6].tiers[3].recipe[2].smoothing` | true | switch | false, true | appearance.parts[6].tiers[3].recipe[2].smoothing |
| appearance.json | `parts[6].tiers[3].recipe[2].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / strokeWidth |
| appearance.json | `parts[6].tiers[3].recipe[2].scale.x` | 18.2 | points | [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / scale / x |
| appearance.json | `parts[6].tiers[3].recipe[2].scale.y` | 21 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / scale / y |
| appearance.json | `parts[6].tiers[3].recipe[2].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / rotation |
| appearance.json | `parts[6].tiers[3].recipe[2].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / offset / x |
| appearance.json | `parts[6].tiers[3].recipe[2].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / offset / y |
| appearance.json | `parts[6].tiers[3].recipe[2].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / opacity |
| appearance.json | `parts[6].tiers[3].recipe[2].saturationMultiplier` | 0.85 | points | [0, 1000000] | appearance / parts[6] / tiers[3] / recipe[2] / saturationMultiplier |
| appearance.json | `parts[7].tiers[0].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[7] / tiers[0] / tier. |
| appearance.json | `parts[7].tiers[0].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[7] / tiers[0] / level Threshold. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[0].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[1].y` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[2].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[3].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[7].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[7].tiers[0].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[7].tiers[0].recipe[0].scale.x` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].scale.y` | 4.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].rotation` | -0.15 | radians | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[7].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[7].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[7].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[7].tiers[0].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[7] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[7].tiers[1].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[7] / tiers[1] / tier. |
| appearance.json | `parts[7].tiers[1].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[7] / tiers[1] / level Threshold. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[0].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[1].y` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[2].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[3].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[7].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[7].tiers[1].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[7].tiers[1].recipe[0].scale.x` | 5.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].scale.y` | 5.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].rotation` | -0.15 | radians | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[7].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[7].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[7].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[7].tiers[1].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[7] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[7].tiers[2].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[7] / tiers[2] / tier. |
| appearance.json | `parts[7].tiers[2].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[7] / tiers[2] / level Threshold. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[0].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[1].y` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[2].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[3].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[7].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[7].tiers[2].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[7].tiers[2].recipe[0].scale.x` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].scale.y` | 6.300000000000001 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].rotation` | -0.15 | radians | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[7].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[7].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[7].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[7].tiers[2].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[7] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[7].tiers[3].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[7] / tiers[3] / tier. |
| appearance.json | `parts[7].tiers[3].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[7] / tiers[3] / level Threshold. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[0] / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[0].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[0] / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[1] / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[1].y` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[1] / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[2].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[2] / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[2] / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[3].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[3] / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].points[3].y` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / points[3] / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[7].tiers[3].recipe[0].smoothing. |
| appearance.json | `parts[7].tiers[3].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[7].tiers[3].recipe[0].scale.x` | 9.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].scale.y` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].rotation` | -0.15 | radians | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[7].tiers[3].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[7].tiers[3].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[7] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[7].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[7] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[7].tiers[3].recipe[0].saturationMultiplier` | 0.85 | ratio | [0, 1] | appearance: parts[7] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[8].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[8] / tiers[0] / tier. |
| appearance.json | `parts[8].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[8] / tiers[0] / level Threshold. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[0].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[1].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].points[4].x` | 0.8 | points | [0, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[4] / x |
| appearance.json | `parts[8].tiers[0].recipe[0].points[4].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[4] / y |
| appearance.json | `parts[8].tiers[0].recipe[0].points[5].x` | -0.7 | points | [-100, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[5] / x |
| appearance.json | `parts[8].tiers[0].recipe[0].points[5].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[5] / y |
| appearance.json | `parts[8].tiers[0].recipe[0].points[6].x` | -0.8 | points | [-100, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[6] / x |
| appearance.json | `parts[8].tiers[0].recipe[0].points[6].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[0] / recipe[0] / points[6] / y |
| appearance.json | `parts[8].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[8].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[8].tiers[0].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[8].tiers[0].recipe[0].scale.x` | 3.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].scale.y` | 2.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[8].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[8].tiers[0].recipe[0].offset.y` | 8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[8].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[8].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[8] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[8].tiers[0].attachments.ground.x` | 0 | points | integer [0, 1000000] | appearance / parts[8] / tiers[0] / attachments / ground / x |
| appearance.json | `parts[8].tiers[0].attachments.ground.y` | 10.8 | points | [0, 1000000] | appearance / parts[8] / tiers[0] / attachments / ground / y |
| appearance.json | `parts[8].tiers[1].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[8] / tiers[1] / tier. |
| appearance.json | `parts[8].tiers[1].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[8] / tiers[1] / level Threshold. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].points[4].x` | 0.8 | points | [0, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[4] / x |
| appearance.json | `parts[8].tiers[1].recipe[0].points[4].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[4] / y |
| appearance.json | `parts[8].tiers[1].recipe[0].points[5].x` | -0.7 | points | [-100, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[5] / x |
| appearance.json | `parts[8].tiers[1].recipe[0].points[5].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[5] / y |
| appearance.json | `parts[8].tiers[1].recipe[0].points[6].x` | -0.8 | points | [-100, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[6] / x |
| appearance.json | `parts[8].tiers[1].recipe[0].points[6].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[1] / recipe[0] / points[6] / y |
| appearance.json | `parts[8].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[8].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[8].tiers[1].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[8].tiers[1].recipe[0].scale.x` | 3.5500000000000003 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].scale.y` | 3.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].rotation` | -0.07 | radians | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[8].tiers[1].recipe[0].offset.x` | 0.35 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[8].tiers[1].recipe[0].offset.y` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[8].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[8].tiers[1].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[8] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[8].tiers[1].attachments.ground.x` | 0 | points | integer [0, 1000000] | appearance / parts[8] / tiers[1] / attachments / ground / x |
| appearance.json | `parts[8].tiers[1].attachments.ground.y` | 11.05 | points | [0, 1000000] | appearance / parts[8] / tiers[1] / attachments / ground / y |
| appearance.json | `parts[8].tiers[2].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[8] / tiers[2] / tier. |
| appearance.json | `parts[8].tiers[2].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[8] / tiers[2] / level Threshold. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].points[4].x` | 0.8 | points | [0, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[4] / x |
| appearance.json | `parts[8].tiers[2].recipe[0].points[4].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[4] / y |
| appearance.json | `parts[8].tiers[2].recipe[0].points[5].x` | -0.7 | points | [-100, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[5] / x |
| appearance.json | `parts[8].tiers[2].recipe[0].points[5].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[5] / y |
| appearance.json | `parts[8].tiers[2].recipe[0].points[6].x` | -0.8 | points | [-100, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[6] / x |
| appearance.json | `parts[8].tiers[2].recipe[0].points[6].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[2] / recipe[0] / points[6] / y |
| appearance.json | `parts[8].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[8].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[8].tiers[2].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[8].tiers[2].recipe[0].scale.x` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].scale.y` | 4.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].rotation` | -0.14 | radians | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[8].tiers[2].recipe[0].offset.x` | 0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[8].tiers[2].recipe[0].offset.y` | 6.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[8].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[8].tiers[2].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[8] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[8].tiers[2].attachments.ground.x` | 0 | points | integer [0, 1000000] | appearance / parts[8] / tiers[2] / attachments / ground / x |
| appearance.json | `parts[8].tiers[2].attachments.ground.y` | 11.3 | points | [0, 1000000] | appearance / parts[8] / tiers[2] / attachments / ground / y |
| appearance.json | `parts[8].tiers[3].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[8] / tiers[3] / tier. |
| appearance.json | `parts[8].tiers[3].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[8] / tiers[3] / level Threshold. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[0].x` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[0] / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[0].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[0] / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[1].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[1] / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[1].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[1] / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[2].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[2] / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[2].y` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[2] / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[3].x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[3] / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[3].y` | 0.75 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / points[3] / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].points[4].x` | 0.8 | points | [0, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[4] / x |
| appearance.json | `parts[8].tiers[3].recipe[0].points[4].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[4] / y |
| appearance.json | `parts[8].tiers[3].recipe[0].points[5].x` | -0.7 | points | [-100, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[5] / x |
| appearance.json | `parts[8].tiers[3].recipe[0].points[5].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[5] / y |
| appearance.json | `parts[8].tiers[3].recipe[0].points[6].x` | -0.8 | points | [-100, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[6] / x |
| appearance.json | `parts[8].tiers[3].recipe[0].points[6].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[3] / recipe[0] / points[6] / y |
| appearance.json | `parts[8].tiers[3].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[8].tiers[3].recipe[0].smoothing. |
| appearance.json | `parts[8].tiers[3].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[8].tiers[3].recipe[0].scale.x` | 4.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].scale.y` | 5.35 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].rotation` | -0.21000000000000002 | radians | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[8].tiers[3].recipe[0].offset.x` | 1.0499999999999998 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[8].tiers[3].recipe[0].offset.y` | 6.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[8] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[8].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[8] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[8].tiers[3].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[8] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[8].tiers[3].attachments.ground.x` | 0 | points | integer [0, 1000000] | appearance / parts[8] / tiers[3] / attachments / ground / x |
| appearance.json | `parts[8].tiers[3].attachments.ground.y` | 11.55 | points | [0, 1000000] | appearance / parts[8] / tiers[3] / attachments / ground / y |
| appearance.json | `parts[8].tiers[4].tier` | 4 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / tier |
| appearance.json | `parts[8].tiers[4].levelThreshold` | 70 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / levelThreshold |
| appearance.json | `parts[8].tiers[4].recipe[0].points[0].x` | -0.45 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[0] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[0].y` | -2.2 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[0] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[1].x` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[1] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[1].y` | -2.2 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[1] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[2].x` | 0.65 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[2] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[2].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[2] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[3].x` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[3] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[3].y` | 0.75 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[3] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[4].x` | 0.8 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[4] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[4].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[4] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[5].x` | -0.7 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[5] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[5].y` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[5] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].points[6].x` | -0.8 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[6] / x |
| appearance.json | `parts[8].tiers[4].recipe[0].points[6].y` | 0.45 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / points[6] / y |
| appearance.json | `parts[8].tiers[4].recipe[0].smoothing` | true | switch | false, true | appearance.parts[8].tiers[4].recipe[0].smoothing |
| appearance.json | `parts[8].tiers[4].recipe[0].strokeWidth` | 0.12 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / strokeWidth |
| appearance.json | `parts[8].tiers[4].recipe[0].scale.x` | 4.9 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / scale / x |
| appearance.json | `parts[8].tiers[4].recipe[0].scale.y` | 6.199999999999999 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / scale / y |
| appearance.json | `parts[8].tiers[4].recipe[0].rotation` | -0.28 | points | [-100, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / rotation |
| appearance.json | `parts[8].tiers[4].recipe[0].offset.x` | 1.4 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / offset / x |
| appearance.json | `parts[8].tiers[4].recipe[0].offset.y` | 5.6 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / offset / y |
| appearance.json | `parts[8].tiers[4].recipe[0].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / opacity |
| appearance.json | `parts[8].tiers[4].recipe[0].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / recipe[0] / saturationMultiplier |
| appearance.json | `parts[8].tiers[4].attachments.ground.x` | 0 | points | integer [0, 1000000] | appearance / parts[8] / tiers[4] / attachments / ground / x |
| appearance.json | `parts[8].tiers[4].attachments.ground.y` | 11.799999999999999 | points | [0, 1000000] | appearance / parts[8] / tiers[4] / attachments / ground / y |
| appearance.json | `parts[9].tiers[0].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[9] / tiers[0] / tier. |
| appearance.json | `parts[9].tiers[0].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[9] / tiers[0] / level Threshold. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[1].x` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[1].y` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[2].x` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[3].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[3].y` | -0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[4].x` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].points[4].y` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[9].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[9].tiers[0].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[9].tiers[0].recipe[0].scale.x` | 8.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].scale.y` | 9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[9].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[9].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[9].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[9].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[9] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[9].tiers[0].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / points[0] / x |
| appearance.json | `parts[9].tiers[0].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / points[0] / y |
| appearance.json | `parts[9].tiers[0].recipe[1].points[1].x` | 0.07 | points | [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / points[1] / x |
| appearance.json | `parts[9].tiers[0].recipe[1].points[1].y` | -0.7 | points | [-100, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / points[1] / y |
| appearance.json | `parts[9].tiers[0].recipe[1].smoothing` | true | switch | false, true | appearance.parts[9].tiers[0].recipe[1].smoothing |
| appearance.json | `parts[9].tiers[0].recipe[1].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / strokeWidth |
| appearance.json | `parts[9].tiers[0].recipe[1].scale.x` | 8.3 | points | [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / scale / x |
| appearance.json | `parts[9].tiers[0].recipe[1].scale.y` | 9 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / scale / y |
| appearance.json | `parts[9].tiers[0].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / rotation |
| appearance.json | `parts[9].tiers[0].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / offset / x |
| appearance.json | `parts[9].tiers[0].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / offset / y |
| appearance.json | `parts[9].tiers[0].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / opacity |
| appearance.json | `parts[9].tiers[0].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[0] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[9].tiers[1].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[9] / tiers[1] / tier. |
| appearance.json | `parts[9].tiers[1].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[9] / tiers[1] / level Threshold. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[1].x` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[1].y` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[2].x` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[3].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[3].y` | -0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[4].x` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[4] / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].points[4].y` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / points[4] / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[9].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[9].tiers[1].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[9].tiers[1].recipe[0].scale.x` | 11.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].scale.y` | 13 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[9].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[9].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[9].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[9].tiers[1].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[9] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[9].tiers[1].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / points[0] / x |
| appearance.json | `parts[9].tiers[1].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / points[0] / y |
| appearance.json | `parts[9].tiers[1].recipe[1].points[1].x` | 0.07 | points | [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / points[1] / x |
| appearance.json | `parts[9].tiers[1].recipe[1].points[1].y` | -0.7 | points | [-100, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / points[1] / y |
| appearance.json | `parts[9].tiers[1].recipe[1].smoothing` | true | switch | false, true | appearance.parts[9].tiers[1].recipe[1].smoothing |
| appearance.json | `parts[9].tiers[1].recipe[1].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / strokeWidth |
| appearance.json | `parts[9].tiers[1].recipe[1].scale.x` | 11.6 | points | [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / scale / x |
| appearance.json | `parts[9].tiers[1].recipe[1].scale.y` | 13 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / scale / y |
| appearance.json | `parts[9].tiers[1].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / rotation |
| appearance.json | `parts[9].tiers[1].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / offset / x |
| appearance.json | `parts[9].tiers[1].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / offset / y |
| appearance.json | `parts[9].tiers[1].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / opacity |
| appearance.json | `parts[9].tiers[1].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[1] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[9].tiers[2].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[9] / tiers[2] / tier. |
| appearance.json | `parts[9].tiers[2].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[9] / tiers[2] / level Threshold. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[1].x` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[1].y` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[2].x` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[3].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[3].y` | -0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[4].x` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[4] / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].points[4].y` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / points[4] / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[9].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[9].tiers[2].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[9].tiers[2].recipe[0].scale.x` | 14.899999999999999 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].scale.y` | 17 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[9].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[9].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[9].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[9].tiers[2].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[9] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[9].tiers[2].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / points[0] / x |
| appearance.json | `parts[9].tiers[2].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / points[0] / y |
| appearance.json | `parts[9].tiers[2].recipe[1].points[1].x` | 0.07 | points | [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / points[1] / x |
| appearance.json | `parts[9].tiers[2].recipe[1].points[1].y` | -0.7 | points | [-100, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / points[1] / y |
| appearance.json | `parts[9].tiers[2].recipe[1].smoothing` | true | switch | false, true | appearance.parts[9].tiers[2].recipe[1].smoothing |
| appearance.json | `parts[9].tiers[2].recipe[1].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / strokeWidth |
| appearance.json | `parts[9].tiers[2].recipe[1].scale.x` | 14.899999999999999 | points | [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / scale / x |
| appearance.json | `parts[9].tiers[2].recipe[1].scale.y` | 17 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / scale / y |
| appearance.json | `parts[9].tiers[2].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / rotation |
| appearance.json | `parts[9].tiers[2].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / offset / x |
| appearance.json | `parts[9].tiers[2].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / offset / y |
| appearance.json | `parts[9].tiers[2].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / opacity |
| appearance.json | `parts[9].tiers[2].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[2] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[9].tiers[3].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[9] / tiers[3] / tier. |
| appearance.json | `parts[9].tiers[3].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[9] / tiers[3] / level Threshold. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[0] / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[0] / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[1].x` | -0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[1] / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[1].y` | -0.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[1] / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[2].x` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[2] / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[2] / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[3].x` | 0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[3] / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[3].y` | -0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[3] / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[4].x` | 0.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[4] / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].points[4].y` | -0.15 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / points[4] / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[9].tiers[3].recipe[0].smoothing. |
| appearance.json | `parts[9].tiers[3].recipe[0].strokeWidth` | 0.045 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[9].tiers[3].recipe[0].scale.x` | 18.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].scale.y` | 21 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[9].tiers[3].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[9].tiers[3].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[9] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[9].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[9] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[9].tiers[3].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[9] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[9].tiers[3].recipe[1].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[0] / x |
| appearance.json | `parts[9].tiers[3].recipe[1].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[0] / y |
| appearance.json | `parts[9].tiers[3].recipe[1].points[1].x` | -0.4 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[1] / x |
| appearance.json | `parts[9].tiers[3].recipe[1].points[1].y` | -0.5 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[1] / y |
| appearance.json | `parts[9].tiers[3].recipe[1].points[2].x` | -0.15 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[2] / x |
| appearance.json | `parts[9].tiers[3].recipe[1].points[2].y` | -1 | points | integer [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[2] / y |
| appearance.json | `parts[9].tiers[3].recipe[1].points[3].x` | 0.45 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[3] / x |
| appearance.json | `parts[9].tiers[3].recipe[1].points[3].y` | -0.65 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[3] / y |
| appearance.json | `parts[9].tiers[3].recipe[1].points[4].x` | 0.4 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[4] / x |
| appearance.json | `parts[9].tiers[3].recipe[1].points[4].y` | -0.15 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / points[4] / y |
| appearance.json | `parts[9].tiers[3].recipe[1].smoothing` | true | switch | false, true | appearance.parts[9].tiers[3].recipe[1].smoothing |
| appearance.json | `parts[9].tiers[3].recipe[1].strokeWidth` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / strokeWidth |
| appearance.json | `parts[9].tiers[3].recipe[1].scale.x` | 10.92 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / scale / x |
| appearance.json | `parts[9].tiers[3].recipe[1].scale.y` | 16.8 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / scale / y |
| appearance.json | `parts[9].tiers[3].recipe[1].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / rotation |
| appearance.json | `parts[9].tiers[3].recipe[1].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / offset / x |
| appearance.json | `parts[9].tiers[3].recipe[1].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / offset / y |
| appearance.json | `parts[9].tiers[3].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / opacity |
| appearance.json | `parts[9].tiers[3].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[9].tiers[3].recipe[2].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / points[0] / x |
| appearance.json | `parts[9].tiers[3].recipe[2].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / points[0] / y |
| appearance.json | `parts[9].tiers[3].recipe[2].points[1].x` | 0.07 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / points[1] / x |
| appearance.json | `parts[9].tiers[3].recipe[2].points[1].y` | -0.7 | points | [-100, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / points[1] / y |
| appearance.json | `parts[9].tiers[3].recipe[2].smoothing` | true | switch | false, true | appearance.parts[9].tiers[3].recipe[2].smoothing |
| appearance.json | `parts[9].tiers[3].recipe[2].strokeWidth` | 0.045 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / strokeWidth |
| appearance.json | `parts[9].tiers[3].recipe[2].scale.x` | 18.2 | points | [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / scale / x |
| appearance.json | `parts[9].tiers[3].recipe[2].scale.y` | 21 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / scale / y |
| appearance.json | `parts[9].tiers[3].recipe[2].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / rotation |
| appearance.json | `parts[9].tiers[3].recipe[2].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / offset / x |
| appearance.json | `parts[9].tiers[3].recipe[2].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / offset / y |
| appearance.json | `parts[9].tiers[3].recipe[2].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / opacity |
| appearance.json | `parts[9].tiers[3].recipe[2].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[9] / tiers[3] / recipe[2] / saturationMultiplier |
| appearance.json | `parts[10].tiers[0].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[10] / tiers[0] / tier. |
| appearance.json | `parts[10].tiers[0].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[10] / tiers[0] / level Threshold. |
| appearance.json | `parts[10].tiers[0].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[0] / x |
| appearance.json | `parts[10].tiers[0].recipe[0].points[0].y` | -0.3 | points | [-100, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[0] / y |
| appearance.json | `parts[10].tiers[0].recipe[0].points[1].x` | 0.9 | points | [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[1] / x |
| appearance.json | `parts[10].tiers[0].recipe[0].points[1].y` | -0.6 | points | [-100, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[1] / y |
| appearance.json | `parts[10].tiers[0].recipe[0].points[2].x` | 1 | points | integer [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[2] / x |
| appearance.json | `parts[10].tiers[0].recipe[0].points[2].y` | 0.5 | points | [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[2] / y |
| appearance.json | `parts[10].tiers[0].recipe[0].points[3].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[3] / x |
| appearance.json | `parts[10].tiers[0].recipe[0].points[3].y` | 0.4 | points | [0, 1000000] | appearance / parts[10] / tiers[0] / recipe[0] / points[3] / y |
| appearance.json | `parts[10].tiers[0].recipe[0].smoothing` | true | switch | false, true | appearance.parts[10].tiers[0].recipe[0].smoothing |
| appearance.json | `parts[10].tiers[0].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[10].tiers[0].recipe[0].scale.x` | 3.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[10].tiers[0].recipe[0].scale.y` | 4.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[10].tiers[0].recipe[0].rotation` | 0.2 | radians | [-1024, 1024] | appearance: parts[10] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[10].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[10].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[10].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[10].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[10] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[10].tiers[1].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[10] / tiers[1] / tier. |
| appearance.json | `parts[10].tiers[1].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[10] / tiers[1] / level Threshold. |
| appearance.json | `parts[10].tiers[1].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[0] / x |
| appearance.json | `parts[10].tiers[1].recipe[0].points[0].y` | -0.3 | points | [-100, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[0] / y |
| appearance.json | `parts[10].tiers[1].recipe[0].points[1].x` | 0.9 | points | [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[1] / x |
| appearance.json | `parts[10].tiers[1].recipe[0].points[1].y` | -0.6 | points | [-100, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[1] / y |
| appearance.json | `parts[10].tiers[1].recipe[0].points[2].x` | 1 | points | integer [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[2] / x |
| appearance.json | `parts[10].tiers[1].recipe[0].points[2].y` | 0.5 | points | [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[2] / y |
| appearance.json | `parts[10].tiers[1].recipe[0].points[3].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[3] / x |
| appearance.json | `parts[10].tiers[1].recipe[0].points[3].y` | 0.4 | points | [0, 1000000] | appearance / parts[10] / tiers[1] / recipe[0] / points[3] / y |
| appearance.json | `parts[10].tiers[1].recipe[0].smoothing` | true | switch | false, true | appearance.parts[10].tiers[1].recipe[0].smoothing |
| appearance.json | `parts[10].tiers[1].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[10].tiers[1].recipe[0].scale.x` | 5.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[10].tiers[1].recipe[0].scale.y` | 5.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[10].tiers[1].recipe[0].rotation` | 0.2 | radians | [-1024, 1024] | appearance: parts[10] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[10].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[10].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[10].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[10].tiers[1].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[10] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[10].tiers[2].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[10] / tiers[2] / tier. |
| appearance.json | `parts[10].tiers[2].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[10] / tiers[2] / level Threshold. |
| appearance.json | `parts[10].tiers[2].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[0] / x |
| appearance.json | `parts[10].tiers[2].recipe[0].points[0].y` | -0.3 | points | [-100, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[0] / y |
| appearance.json | `parts[10].tiers[2].recipe[0].points[1].x` | 0.9 | points | [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[1] / x |
| appearance.json | `parts[10].tiers[2].recipe[0].points[1].y` | -0.6 | points | [-100, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[1] / y |
| appearance.json | `parts[10].tiers[2].recipe[0].points[2].x` | 1 | points | integer [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[2] / x |
| appearance.json | `parts[10].tiers[2].recipe[0].points[2].y` | 0.5 | points | [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[2] / y |
| appearance.json | `parts[10].tiers[2].recipe[0].points[3].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[3] / x |
| appearance.json | `parts[10].tiers[2].recipe[0].points[3].y` | 0.4 | points | [0, 1000000] | appearance / parts[10] / tiers[2] / recipe[0] / points[3] / y |
| appearance.json | `parts[10].tiers[2].recipe[0].smoothing` | true | switch | false, true | appearance.parts[10].tiers[2].recipe[0].smoothing |
| appearance.json | `parts[10].tiers[2].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[10].tiers[2].recipe[0].scale.x` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[10].tiers[2].recipe[0].scale.y` | 6.300000000000001 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[10].tiers[2].recipe[0].rotation` | 0.2 | radians | [-1024, 1024] | appearance: parts[10] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[10].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[10].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[10].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[10].tiers[2].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[10] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[10].tiers[3].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[10] / tiers[3] / tier. |
| appearance.json | `parts[10].tiers[3].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[10] / tiers[3] / level Threshold. |
| appearance.json | `parts[10].tiers[3].recipe[0].points[0].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[0] / x |
| appearance.json | `parts[10].tiers[3].recipe[0].points[0].y` | -0.3 | points | [-100, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[0] / y |
| appearance.json | `parts[10].tiers[3].recipe[0].points[1].x` | 0.9 | points | [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[1] / x |
| appearance.json | `parts[10].tiers[3].recipe[0].points[1].y` | -0.6 | points | [-100, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[1] / y |
| appearance.json | `parts[10].tiers[3].recipe[0].points[2].x` | 1 | points | integer [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[2] / x |
| appearance.json | `parts[10].tiers[3].recipe[0].points[2].y` | 0.5 | points | [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[2] / y |
| appearance.json | `parts[10].tiers[3].recipe[0].points[3].x` | 0 | points | integer [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[3] / x |
| appearance.json | `parts[10].tiers[3].recipe[0].points[3].y` | 0.4 | points | [0, 1000000] | appearance / parts[10] / tiers[3] / recipe[0] / points[3] / y |
| appearance.json | `parts[10].tiers[3].recipe[0].smoothing` | true | switch | false, true | appearance.parts[10].tiers[3].recipe[0].smoothing |
| appearance.json | `parts[10].tiers[3].recipe[0].strokeWidth` | 0.065 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[10].tiers[3].recipe[0].scale.x` | 9.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[10].tiers[3].recipe[0].scale.y` | 7.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[10].tiers[3].recipe[0].rotation` | 0.2 | radians | [-1024, 1024] | appearance: parts[10] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[10].tiers[3].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[10].tiers[3].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[10] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[10].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[10] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[10].tiers[3].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[10] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[11].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[11] / tiers[0] / tier. |
| appearance.json | `parts[11].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[11] / tiers[0] / level Threshold. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[0].x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[0].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[1].x` | -8.9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[1].y` | -2.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[2].x` | -11 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[2].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[3].x` | -11 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[3].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[4].x` | -8.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[4].y` | 1.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].points[5].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[0] / recipe[0] / points[5] / x |
| appearance.json | `parts[11].tiers[0].recipe[0].points[5].y` | 3 | points | integer [0, 1000000] | appearance / parts[11] / tiers[0] / recipe[0] / points[5] / y |
| appearance.json | `parts[11].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[11].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[11].tiers[0].recipe[0].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[11].tiers[0].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[11].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[11].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[11].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[11].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[11] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[11].tiers[0].attachments.tip.x` | -11 | points | [-100, 1000000] | appearance / parts[11] / tiers[0] / attachments / tip / x |
| appearance.json | `parts[11].tiers[0].attachments.tip.y` | -2 | points | [-100, 1000000] | appearance / parts[11] / tiers[0] / attachments / tip / y |
| appearance.json | `parts[11].tiers[1].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[11] / tiers[1] / tier. |
| appearance.json | `parts[11].tiers[1].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[11] / tiers[1] / level Threshold. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[0].x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[0].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[1].x` | -10.915 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[1].y` | -2.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[2].x` | -14.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[2].y` | -4.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[3].x` | -14.1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[3].y` | -2.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[4].x` | -10.004999999999999 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[4] / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[4].y` | 1.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / points[4] / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].points[5].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[1] / recipe[0] / points[5] / x |
| appearance.json | `parts[11].tiers[1].recipe[0].points[5].y` | 3 | points | integer [0, 1000000] | appearance / parts[11] / tiers[1] / recipe[0] / points[5] / y |
| appearance.json | `parts[11].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[11].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[11].tiers[1].recipe[0].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[11].tiers[1].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[11].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[11].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[11].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[11].tiers[1].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[11] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[11].tiers[1].attachments.tip.x` | -14.1 | points | [-100, 1000000] | appearance / parts[11] / tiers[1] / attachments / tip / x |
| appearance.json | `parts[11].tiers[1].attachments.tip.y` | -3.2 | points | [-100, 1000000] | appearance / parts[11] / tiers[1] / attachments / tip / y |
| appearance.json | `parts[11].tiers[2].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[11] / tiers[2] / tier. |
| appearance.json | `parts[11].tiers[2].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[11] / tiers[2] / level Threshold. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[0].x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[0].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[1].x` | -12.93 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[1].y` | -2.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[2].x` | -17.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[2].y` | -5.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[3].x` | -17.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[3].y` | -3.4000000000000004 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[4].x` | -11.71 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[4] / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[4].y` | 1.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / points[4] / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].points[5].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[2] / recipe[0] / points[5] / x |
| appearance.json | `parts[11].tiers[2].recipe[0].points[5].y` | 3 | points | integer [0, 1000000] | appearance / parts[11] / tiers[2] / recipe[0] / points[5] / y |
| appearance.json | `parts[11].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[11].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[11].tiers[2].recipe[0].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[11].tiers[2].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[11].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[11].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[11].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[11].tiers[2].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[11] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[11].tiers[2].attachments.tip.x` | -17.2 | points | [-100, 1000000] | appearance / parts[11] / tiers[2] / attachments / tip / x |
| appearance.json | `parts[11].tiers[2].attachments.tip.y` | -4.4 | points | [-100, 1000000] | appearance / parts[11] / tiers[2] / attachments / tip / y |
| appearance.json | `parts[11].tiers[3].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[11] / tiers[3] / tier. |
| appearance.json | `parts[11].tiers[3].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[11] / tiers[3] / level Threshold. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[0].x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[0] / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[0].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[0] / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[1].x` | -14.945 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[1] / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[1].y` | -2.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[1] / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[2].x` | -20.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[2] / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[2].y` | -6.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[2] / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[3].x` | -20.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[3] / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[3].y` | -4.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[3] / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[4].x` | -13.415000000000001 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[4] / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[4].y` | 1.8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / points[4] / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].points[5].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[3] / recipe[0] / points[5] / x |
| appearance.json | `parts[11].tiers[3].recipe[0].points[5].y` | 3 | points | integer [0, 1000000] | appearance / parts[11] / tiers[3] / recipe[0] / points[5] / y |
| appearance.json | `parts[11].tiers[3].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[11].tiers[3].recipe[0].smoothing. |
| appearance.json | `parts[11].tiers[3].recipe[0].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[3] / recipe[0] / stroke Width. |
| appearance.json | `parts[11].tiers[3].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / scale / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / scale / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / rotation. |
| appearance.json | `parts[11].tiers[3].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / offset / x. |
| appearance.json | `parts[11].tiers[3].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[11] / tiers[3] / recipe[0] / offset / y. |
| appearance.json | `parts[11].tiers[3].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[11] / tiers[3] / recipe[0] / opacity. |
| appearance.json | `parts[11].tiers[3].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[11] / tiers[3] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[11].tiers[3].attachments.tip.x` | -20.3 | points | [-100, 1000000] | appearance / parts[11] / tiers[3] / attachments / tip / x |
| appearance.json | `parts[11].tiers[3].attachments.tip.y` | -5.6 | points | [-100, 1000000] | appearance / parts[11] / tiers[3] / attachments / tip / y |
| appearance.json | `parts[11].tiers[4].tier` | 4 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / tier |
| appearance.json | `parts[11].tiers[4].levelThreshold` | 70 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / levelThreshold |
| appearance.json | `parts[11].tiers[4].recipe[0].points[0].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[0] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[0].y` | -2 | points | integer [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[0] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].points[1].x` | -16.96 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[1] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[1].y` | -2.5 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[1] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].points[2].x` | -23.4 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[2] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[2].y` | -7.8 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[2] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].points[3].x` | -23.4 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[3] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[3].y` | -5.8 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[3] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].points[4].x` | -15.12 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[4] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[4].y` | 1.8 | points | [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[4] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].points[5].x` | 2 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[5] / x |
| appearance.json | `parts[11].tiers[4].recipe[0].points[5].y` | 3 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / points[5] / y |
| appearance.json | `parts[11].tiers[4].recipe[0].smoothing` | true | switch | false, true | appearance.parts[11].tiers[4].recipe[0].smoothing |
| appearance.json | `parts[11].tiers[4].recipe[0].strokeWidth` | 0.7 | points | [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / strokeWidth |
| appearance.json | `parts[11].tiers[4].recipe[0].scale.x` | 1 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / scale / x |
| appearance.json | `parts[11].tiers[4].recipe[0].scale.y` | 1 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / scale / y |
| appearance.json | `parts[11].tiers[4].recipe[0].rotation` | 0 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / rotation |
| appearance.json | `parts[11].tiers[4].recipe[0].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / offset / x |
| appearance.json | `parts[11].tiers[4].recipe[0].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / offset / y |
| appearance.json | `parts[11].tiers[4].recipe[0].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / opacity |
| appearance.json | `parts[11].tiers[4].recipe[0].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[11] / tiers[4] / recipe[0] / saturationMultiplier |
| appearance.json | `parts[11].tiers[4].attachments.tip.x` | -23.4 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / attachments / tip / x |
| appearance.json | `parts[11].tiers[4].attachments.tip.y` | -6.8 | points | [-100, 1000000] | appearance / parts[11] / tiers[4] / attachments / tip / y |
| appearance.json | `parts[12].tiers[0].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[12] / tiers[0] / tier. |
| appearance.json | `parts[12].tiers[0].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[12] / tiers[0] / level Threshold. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[0].x` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[0].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[1].x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[1].y` | -6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[2].x` | -8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[3].x` | -5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].points[3].y` | 5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[12].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[12].tiers[0].recipe[0].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: parts[12] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[12].tiers[0].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[12].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[12].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[12] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[12].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[12] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[12].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[12] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[13].tiers[0].tier` | 2 | visual tier | integer [0, 4] | appearance: parts[13] / tiers[0] / tier. |
| appearance.json | `parts[13].tiers[0].levelThreshold` | 25 | skill levels | integer [0, 100] | appearance: parts[13] / tiers[0] / level Threshold. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[0].y` | 0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[1].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[2].x` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[3].x` | -0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[3].y` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[4].x` | 0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[4].y` | -1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[5].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[5] / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[5].y` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / points[5] / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].points[6].x` | 1 | points | integer [0, 1000000] | appearance / parts[13] / tiers[0] / recipe[0] / points[6] / x |
| appearance.json | `parts[13].tiers[0].recipe[0].points[6].y` | 0.4 | points | [0, 1000000] | appearance / parts[13] / tiers[0] / recipe[0] / points[6] / y |
| appearance.json | `parts[13].tiers[0].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[13].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[13].tiers[0].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[13].tiers[0].recipe[0].scale.x` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].scale.y` | 2.5 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[13].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[13].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[13].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[13].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[13] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[13].tiers[1].tier` | 3 | visual tier | integer [0, 4] | appearance: parts[13] / tiers[1] / tier. |
| appearance.json | `parts[13].tiers[1].levelThreshold` | 45 | skill levels | integer [0, 100] | appearance: parts[13] / tiers[1] / level Threshold. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[0] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[0].y` | 0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[0] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[1] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[1].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[1] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[2].x` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[2] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[2] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[3].x` | -0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[3] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[3].y` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[3] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[4].x` | 0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[4] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[4].y` | -1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[4] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[5].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[5] / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[5].y` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / points[5] / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].points[6].x` | 1 | points | integer [0, 1000000] | appearance / parts[13] / tiers[1] / recipe[0] / points[6] / x |
| appearance.json | `parts[13].tiers[1].recipe[0].points[6].y` | 0.4 | points | [0, 1000000] | appearance / parts[13] / tiers[1] / recipe[0] / points[6] / y |
| appearance.json | `parts[13].tiers[1].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[13].tiers[1].recipe[0].smoothing. |
| appearance.json | `parts[13].tiers[1].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[1] / recipe[0] / stroke Width. |
| appearance.json | `parts[13].tiers[1].recipe[0].scale.x` | 4.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / scale / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].scale.y` | 3.9 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / scale / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / rotation. |
| appearance.json | `parts[13].tiers[1].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / offset / x. |
| appearance.json | `parts[13].tiers[1].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[1] / recipe[0] / offset / y. |
| appearance.json | `parts[13].tiers[1].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[1] / recipe[0] / opacity. |
| appearance.json | `parts[13].tiers[1].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[13] / tiers[1] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[13].tiers[2].tier` | 4 | visual tier | integer [0, 4] | appearance: parts[13] / tiers[2] / tier. |
| appearance.json | `parts[13].tiers[2].levelThreshold` | 70 | skill levels | integer [0, 100] | appearance: parts[13] / tiers[2] / level Threshold. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[0].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[0] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[0].y` | 0.7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[0] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[1].x` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[1] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[1].y` | -0.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[1] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[2].x` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[2] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[2].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[2] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[3].x` | -0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[3] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[3].y` | -0.45 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[3] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[4].x` | 0.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[4] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[4].y` | -1.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[4] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[5].x` | 0.65 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[5] / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[5].y` | -0.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / points[5] / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].points[6].x` | 1 | points | integer [0, 1000000] | appearance / parts[13] / tiers[2] / recipe[0] / points[6] / x |
| appearance.json | `parts[13].tiers[2].recipe[0].points[6].y` | 0.4 | points | [0, 1000000] | appearance / parts[13] / tiers[2] / recipe[0] / points[6] / y |
| appearance.json | `parts[13].tiers[2].recipe[0].smoothing` | true | flag | false, true | Boolean switch for appearance: parts[13].tiers[2].recipe[0].smoothing. |
| appearance.json | `parts[13].tiers[2].recipe[0].strokeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[2] / recipe[0] / stroke Width. |
| appearance.json | `parts[13].tiers[2].recipe[0].scale.x` | 5.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / scale / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].scale.y` | 5.3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / scale / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / rotation. |
| appearance.json | `parts[13].tiers[2].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / offset / x. |
| appearance.json | `parts[13].tiers[2].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[13] / tiers[2] / recipe[0] / offset / y. |
| appearance.json | `parts[13].tiers[2].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[13] / tiers[2] / recipe[0] / opacity. |
| appearance.json | `parts[13].tiers[2].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[13] / tiers[2] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[14].tiers[0].tier` | 1 | visual tier | integer [0, 4] | appearance: parts[14] / tiers[0] / tier. |
| appearance.json | `parts[14].tiers[0].levelThreshold` | 10 | skill levels | integer [0, 100] | appearance: parts[14] / tiers[0] / level Threshold. |
| appearance.json | `parts[14].tiers[0].recipe[0].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[0] / radius / x |
| appearance.json | `parts[14].tiers[0].recipe[0].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[0] / radius / y |
| appearance.json | `parts[14].tiers[0].recipe[0].strokeWidth` | 0.08 | coefficient | [-10000000, 10000000] | appearance: parts[14] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[14].tiers[0].recipe[0].scale.x` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[14] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[14].tiers[0].recipe[0].scale.y` | 3.9000000000000004 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[14] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[14].tiers[0].recipe[0].rotation` | -0.16 | radians | [-1024, 1024] | appearance: parts[14] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[14].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[14] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[14].tiers[0].recipe[0].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[14] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[14].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[14] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[14].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[14] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[14].tiers[0].recipe[1].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / radius / x |
| appearance.json | `parts[14].tiers[0].recipe[1].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / radius / y |
| appearance.json | `parts[14].tiers[0].recipe[1].strokeWidth` | 0.12 | points | [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / strokeWidth |
| appearance.json | `parts[14].tiers[0].recipe[1].scale.x` | 2.7 | points | [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / scale / x |
| appearance.json | `parts[14].tiers[0].recipe[1].scale.y` | 3.9 | points | [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / scale / y |
| appearance.json | `parts[14].tiers[0].recipe[1].rotation` | -0.3 | points | [-100, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / rotation |
| appearance.json | `parts[14].tiers[0].recipe[1].offset.x` | 8 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / offset / x |
| appearance.json | `parts[14].tiers[0].recipe[1].offset.y` | 6 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / offset / y |
| appearance.json | `parts[14].tiers[0].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / opacity |
| appearance.json | `parts[14].tiers[0].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[0] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[14].tiers[1].tier` | 2 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / tier |
| appearance.json | `parts[14].tiers[1].levelThreshold` | 25 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / levelThreshold |
| appearance.json | `parts[14].tiers[1].recipe[0].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / radius / x |
| appearance.json | `parts[14].tiers[1].recipe[0].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / radius / y |
| appearance.json | `parts[14].tiers[1].recipe[0].strokeWidth` | 0.08 | points | [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / strokeWidth |
| appearance.json | `parts[14].tiers[1].recipe[0].scale.x` | 7 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / scale / x |
| appearance.json | `parts[14].tiers[1].recipe[0].scale.y` | 4.6 | points | [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / scale / y |
| appearance.json | `parts[14].tiers[1].recipe[0].rotation` | -0.16 | points | [-100, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / rotation |
| appearance.json | `parts[14].tiers[1].recipe[0].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / offset / x |
| appearance.json | `parts[14].tiers[1].recipe[0].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / offset / y |
| appearance.json | `parts[14].tiers[1].recipe[0].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / opacity |
| appearance.json | `parts[14].tiers[1].recipe[0].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[0] / saturationMultiplier |
| appearance.json | `parts[14].tiers[1].recipe[1].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / radius / x |
| appearance.json | `parts[14].tiers[1].recipe[1].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / radius / y |
| appearance.json | `parts[14].tiers[1].recipe[1].strokeWidth` | 0.12 | points | [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / strokeWidth |
| appearance.json | `parts[14].tiers[1].recipe[1].scale.x` | 3.4 | points | [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / scale / x |
| appearance.json | `parts[14].tiers[1].recipe[1].scale.y` | 4.8 | points | [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / scale / y |
| appearance.json | `parts[14].tiers[1].recipe[1].rotation` | -0.3 | points | [-100, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / rotation |
| appearance.json | `parts[14].tiers[1].recipe[1].offset.x` | 8 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / offset / x |
| appearance.json | `parts[14].tiers[1].recipe[1].offset.y` | 6 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / offset / y |
| appearance.json | `parts[14].tiers[1].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / opacity |
| appearance.json | `parts[14].tiers[1].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[1] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[14].tiers[2].tier` | 3 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / tier |
| appearance.json | `parts[14].tiers[2].levelThreshold` | 45 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / levelThreshold |
| appearance.json | `parts[14].tiers[2].recipe[0].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / radius / x |
| appearance.json | `parts[14].tiers[2].recipe[0].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / radius / y |
| appearance.json | `parts[14].tiers[2].recipe[0].strokeWidth` | 0.08 | points | [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / strokeWidth |
| appearance.json | `parts[14].tiers[2].recipe[0].scale.x` | 8 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / scale / x |
| appearance.json | `parts[14].tiers[2].recipe[0].scale.y` | 5.3 | points | [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / scale / y |
| appearance.json | `parts[14].tiers[2].recipe[0].rotation` | -0.16 | points | [-100, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / rotation |
| appearance.json | `parts[14].tiers[2].recipe[0].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / offset / x |
| appearance.json | `parts[14].tiers[2].recipe[0].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / offset / y |
| appearance.json | `parts[14].tiers[2].recipe[0].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / opacity |
| appearance.json | `parts[14].tiers[2].recipe[0].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[0] / saturationMultiplier |
| appearance.json | `parts[14].tiers[2].recipe[1].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / radius / x |
| appearance.json | `parts[14].tiers[2].recipe[1].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / radius / y |
| appearance.json | `parts[14].tiers[2].recipe[1].strokeWidth` | 0.12 | points | [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / strokeWidth |
| appearance.json | `parts[14].tiers[2].recipe[1].scale.x` | 4.1 | points | [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / scale / x |
| appearance.json | `parts[14].tiers[2].recipe[1].scale.y` | 5.7 | points | [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / scale / y |
| appearance.json | `parts[14].tiers[2].recipe[1].rotation` | -0.3 | points | [-100, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / rotation |
| appearance.json | `parts[14].tiers[2].recipe[1].offset.x` | 8 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / offset / x |
| appearance.json | `parts[14].tiers[2].recipe[1].offset.y` | 6 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / offset / y |
| appearance.json | `parts[14].tiers[2].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / opacity |
| appearance.json | `parts[14].tiers[2].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[2] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[14].tiers[3].tier` | 4 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / tier |
| appearance.json | `parts[14].tiers[3].levelThreshold` | 70 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / levelThreshold |
| appearance.json | `parts[14].tiers[3].recipe[0].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / radius / x |
| appearance.json | `parts[14].tiers[3].recipe[0].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / radius / y |
| appearance.json | `parts[14].tiers[3].recipe[0].strokeWidth` | 0.08 | points | [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / strokeWidth |
| appearance.json | `parts[14].tiers[3].recipe[0].scale.x` | 9 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / scale / x |
| appearance.json | `parts[14].tiers[3].recipe[0].scale.y` | 6 | points | [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / scale / y |
| appearance.json | `parts[14].tiers[3].recipe[0].rotation` | -0.16 | points | [-100, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / rotation |
| appearance.json | `parts[14].tiers[3].recipe[0].offset.x` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / offset / x |
| appearance.json | `parts[14].tiers[3].recipe[0].offset.y` | 0 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / offset / y |
| appearance.json | `parts[14].tiers[3].recipe[0].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / opacity |
| appearance.json | `parts[14].tiers[3].recipe[0].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[0] / saturationMultiplier |
| appearance.json | `parts[14].tiers[3].recipe[1].radius.x` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / radius / x |
| appearance.json | `parts[14].tiers[3].recipe[1].radius.y` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / radius / y |
| appearance.json | `parts[14].tiers[3].recipe[1].strokeWidth` | 0.12 | points | [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / strokeWidth |
| appearance.json | `parts[14].tiers[3].recipe[1].scale.x` | 4.8 | points | [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / scale / x |
| appearance.json | `parts[14].tiers[3].recipe[1].scale.y` | 6.6 | points | [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / scale / y |
| appearance.json | `parts[14].tiers[3].recipe[1].rotation` | -0.3 | points | [-100, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / rotation |
| appearance.json | `parts[14].tiers[3].recipe[1].offset.x` | 8 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / offset / x |
| appearance.json | `parts[14].tiers[3].recipe[1].offset.y` | 6 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / offset / y |
| appearance.json | `parts[14].tiers[3].recipe[1].opacity` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / opacity |
| appearance.json | `parts[14].tiers[3].recipe[1].saturationMultiplier` | 1 | points | integer [0, 1000000] | appearance / parts[14] / tiers[3] / recipe[1] / saturationMultiplier |
| appearance.json | `parts[15].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[15] / tiers[0] / tier. |
| appearance.json | `parts[15].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[15] / tiers[0] / level Threshold. |
| appearance.json | `parts[15].tiers[0].recipe[0].strokeWidth` | 0.6 | coefficient | [-10000000, 10000000] | appearance: parts[15] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[15].tiers[0].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[15].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].offset.y` | -8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[15] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[15].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[15] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[0].x` | -7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[0].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[1].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[1].y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[2].x` | 7 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[2].y` | -3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[3].x` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[3].y` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[4].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[5].x` | -6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[5] / x. |
| appearance.json | `parts[15].tiers[0].recipe[0].points[5].y` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[15] / tiers[0] / recipe[0] / points[5] / y. |
| appearance.json | `parts[15].tiers[0].recipe[0].smoothing` | false | flag | false, true | Boolean switch for appearance: parts[15].tiers[0].recipe[0].smoothing. |
| appearance.json | `parts[16].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[16] / tiers[0] / tier. |
| appearance.json | `parts[16].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[16] / tiers[0] / level Threshold. |
| appearance.json | `parts[16].tiers[0].recipe[0].strokeWidth` | 0.6 | coefficient | [-10000000, 10000000] | appearance: parts[16] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[16].tiers[0].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[16] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[16].tiers[0].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[16] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[16].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[16] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[16].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[16] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[16].tiers[0].recipe[0].offset.y` | -8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[16] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[16].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[16] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[16].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[16] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[16].tiers[0].recipe[0].points[0].x` | -10 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[0] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[0].y` | 0 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[0] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[1].x` | -9 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[1] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[1].y` | -5 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[1] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[2].x` | -4 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[2] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[2].y` | -2 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[2] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[3].x` | 0 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[3] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[3].y` | -7 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[3] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[4].x` | 4 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[4] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[4].y` | -2 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[4] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[5].x` | 9 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[5] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[5].y` | -5 | points | integer [-100, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[5] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].points[6].x` | 10 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[6] / x |
| appearance.json | `parts[16].tiers[0].recipe[0].points[6].y` | 0 | points | integer [0, 1000000] | appearance / parts[16] / tiers[0] / recipe[0] / points[6] / y |
| appearance.json | `parts[16].tiers[0].recipe[0].smoothing` | false | switch | false, true | appearance.parts[16].tiers[0].recipe[0].smoothing |
| appearance.json | `parts[17].tiers[0].tier` | 0 | visual tier | integer [0, 4] | appearance: parts[17] / tiers[0] / tier. |
| appearance.json | `parts[17].tiers[0].levelThreshold` | 0 | skill levels | integer [0, 100] | appearance: parts[17] / tiers[0] / level Threshold. |
| appearance.json | `parts[17].tiers[0].recipe[0].strokeWidth` | 0.6 | coefficient | [-10000000, 10000000] | appearance: parts[17] / tiers[0] / recipe[0] / stroke Width. |
| appearance.json | `parts[17].tiers[0].recipe[0].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / scale / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / scale / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].rotation` | 0 | radians | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / rotation. |
| appearance.json | `parts[17].tiers[0].recipe[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / offset / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].offset.y` | -8 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / offset / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: parts[17] / tiers[0] / recipe[0] / opacity. |
| appearance.json | `parts[17].tiers[0].recipe[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: parts[17] / tiers[0] / recipe[0] / saturation Multiplier. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[0].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[0] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[0].y` | -6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[0] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[1].x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[1] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[1].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[1] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[2].x` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[2] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[2].y` | -2 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[2] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[3].x` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[3] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[3].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[3] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[4].x` | 4 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[4] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[4].y` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[4] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[5].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[5] / x. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[5].y` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: parts[17] / tiers[0] / recipe[0] / points[5] / y. |
| appearance.json | `parts[17].tiers[0].recipe[0].points[6].x` | -4 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[6] / x |
| appearance.json | `parts[17].tiers[0].recipe[0].points[6].y` | 6 | points | integer [0, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[6] / y |
| appearance.json | `parts[17].tiers[0].recipe[0].points[7].x` | -3 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[7] / x |
| appearance.json | `parts[17].tiers[0].recipe[0].points[7].y` | 1 | points | integer [0, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[7] / y |
| appearance.json | `parts[17].tiers[0].recipe[0].points[8].x` | -6 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[8] / x |
| appearance.json | `parts[17].tiers[0].recipe[0].points[8].y` | -2 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[8] / y |
| appearance.json | `parts[17].tiers[0].recipe[0].points[9].x` | -2 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[9] / x |
| appearance.json | `parts[17].tiers[0].recipe[0].points[9].y` | -2 | points | integer [-100, 1000000] | appearance / parts[17] / tiers[0] / recipe[0] / points[9] / y |
| appearance.json | `parts[17].tiers[0].recipe[0].smoothing` | false | flag | false, true | Boolean switch for appearance: parts[17].tiers[0].recipe[0].smoothing. |
| appearance.json | `dormant.egg[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: dormant / egg[0] / radius / x. |
| appearance.json | `dormant.egg[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: dormant / egg[0] / radius / y. |
| appearance.json | `dormant.egg[0].strokeWidth` | 0.09 | coefficient | [-10000000, 10000000] | appearance: dormant / egg[0] / stroke Width. |
| appearance.json | `dormant.egg[0].scale.x` | 7.6 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[0] / scale / x. |
| appearance.json | `dormant.egg[0].scale.y` | 11.2 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[0] / scale / y. |
| appearance.json | `dormant.egg[0].rotation` | 0 | radians | [-1024, 1024] | appearance: dormant / egg[0] / rotation. |
| appearance.json | `dormant.egg[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[0] / offset / x. |
| appearance.json | `dormant.egg[0].offset.y` | -4 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[0] / offset / y. |
| appearance.json | `dormant.egg[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: dormant / egg[0] / opacity. |
| appearance.json | `dormant.egg[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: dormant / egg[0] / saturation Multiplier. |
| appearance.json | `dormant.egg[1].radius.x` | 1 | geometry units | [-256, 256] | appearance: dormant / egg[1] / radius / x. |
| appearance.json | `dormant.egg[1].radius.y` | 1 | geometry units | [-256, 256] | appearance: dormant / egg[1] / radius / y. |
| appearance.json | `dormant.egg[1].strokeWidth` | 0 | coefficient | [-10000000, 10000000] | appearance: dormant / egg[1] / stroke Width. |
| appearance.json | `dormant.egg[1].scale.x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[1] / scale / x. |
| appearance.json | `dormant.egg[1].scale.y` | 3 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[1] / scale / y. |
| appearance.json | `dormant.egg[1].rotation` | -0.4 | radians | [-1024, 1024] | appearance: dormant / egg[1] / rotation. |
| appearance.json | `dormant.egg[1].offset.x` | 2 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[1] / offset / x. |
| appearance.json | `dormant.egg[1].offset.y` | -4 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / egg[1] / offset / y. |
| appearance.json | `dormant.egg[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: dormant / egg[1] / opacity. |
| appearance.json | `dormant.egg[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: dormant / egg[1] / saturation Multiplier. |
| appearance.json | `dormant.cocoon[0].radius.x` | 1 | geometry units | [-256, 256] | appearance: dormant / cocoon[0] / radius / x. |
| appearance.json | `dormant.cocoon[0].radius.y` | 1 | geometry units | [-256, 256] | appearance: dormant / cocoon[0] / radius / y. |
| appearance.json | `dormant.cocoon[0].strokeWidth` | 0.09 | coefficient | [-10000000, 10000000] | appearance: dormant / cocoon[0] / stroke Width. |
| appearance.json | `dormant.cocoon[0].scale.x` | 8.4 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[0] / scale / x. |
| appearance.json | `dormant.cocoon[0].scale.y` | 11 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[0] / scale / y. |
| appearance.json | `dormant.cocoon[0].rotation` | 0 | radians | [-1024, 1024] | appearance: dormant / cocoon[0] / rotation. |
| appearance.json | `dormant.cocoon[0].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[0] / offset / x. |
| appearance.json | `dormant.cocoon[0].offset.y` | -4 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[0] / offset / y. |
| appearance.json | `dormant.cocoon[0].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: dormant / cocoon[0] / opacity. |
| appearance.json | `dormant.cocoon[0].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: dormant / cocoon[0] / saturation Multiplier. |
| appearance.json | `dormant.cocoon[1].points[0].x` | -6 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[0] / x. |
| appearance.json | `dormant.cocoon[1].points[0].y` | -7 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[0] / y. |
| appearance.json | `dormant.cocoon[1].points[1].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[1] / x. |
| appearance.json | `dormant.cocoon[1].points[1].y` | -9 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[1] / y. |
| appearance.json | `dormant.cocoon[1].points[2].x` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[2] / x. |
| appearance.json | `dormant.cocoon[1].points[2].y` | -7 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[2] / y. |
| appearance.json | `dormant.cocoon[1].points[3].x` | -6 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[3] / x. |
| appearance.json | `dormant.cocoon[1].points[3].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[3] / y. |
| appearance.json | `dormant.cocoon[1].points[4].x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[4] / x. |
| appearance.json | `dormant.cocoon[1].points[4].y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[4] / y. |
| appearance.json | `dormant.cocoon[1].points[5].x` | 6 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[5] / x. |
| appearance.json | `dormant.cocoon[1].points[5].y` | -1 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / points[5] / y. |
| appearance.json | `dormant.cocoon[1].smoothing` | true | flag | false, true | Boolean switch for appearance: dormant.cocoon[1].smoothing. |
| appearance.json | `dormant.cocoon[1].strokeWidth` | 0.7 | coefficient | [-10000000, 10000000] | appearance: dormant / cocoon[1] / stroke Width. |
| appearance.json | `dormant.cocoon[1].scale.x` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / scale / x. |
| appearance.json | `dormant.cocoon[1].scale.y` | 1 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / scale / y. |
| appearance.json | `dormant.cocoon[1].rotation` | 0 | radians | [-1024, 1024] | appearance: dormant / cocoon[1] / rotation. |
| appearance.json | `dormant.cocoon[1].offset.x` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / offset / x. |
| appearance.json | `dormant.cocoon[1].offset.y` | 0 | rig units (radians for rotation) | [-1024, 1024] | appearance: dormant / cocoon[1] / offset / y. |
| appearance.json | `dormant.cocoon[1].opacity` | 1 | coefficient | [-10000000, 10000000] | appearance: dormant / cocoon[1] / opacity. |
| appearance.json | `dormant.cocoon[1].saturationMultiplier` | 1 | ratio | [0, 1] | appearance: dormant / cocoon[1] / saturation Multiplier. |
| appearance.json | `gallery.seed` | 7001 | uint32 seed | integer [0, 4294967295] | appearance: gallery / seed. |
| appearance.json | `gallery.randomCount` | 20 | count | integer [0, 10000000] | appearance: gallery / random Count. |
| appearance.json | `gallery.cellPixels` | 168 | rig pixels | [-10000000, 10000000] | appearance: gallery / cell Pixels. |
| appearance.json | `gallery.gridGap` | 12 | rig pixels | [-10000000, 10000000] | appearance: gallery / grid Gap. |
| appearance.json | `gallery.offspring` | 6 | coefficient | [-10000000, 10000000] | appearance: gallery / offspring. |
| appearance.json | `gallery.progression[0]` | 0 | coefficient | [-10000000, 10000000] | appearance: gallery / progression[0]. |
| appearance.json | `gallery.progression[1]` | 10 | coefficient | [-10000000, 10000000] | appearance: gallery / progression[1]. |
| appearance.json | `gallery.progression[2]` | 25 | coefficient | [-10000000, 10000000] | appearance: gallery / progression[2]. |
| appearance.json | `gallery.progression[3]` | 45 | coefficient | [-10000000, 10000000] | appearance: gallery / progression[3]. |
| appearance.json | `gallery.progression[4]` | 70 | coefficient | [-10000000, 10000000] | appearance: gallery / progression[4]. |
| appearance.json | `gallery.distinctFraction` | 0.95 | ratio | [0, 1] | appearance: gallery / distinct Fraction. |
| appearance.json | `gallery.rangeCases[0].patch.saturation` | 45 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[0] / patch / saturation. |
| appearance.json | `gallery.rangeCases[0].patch.lightness` | 66 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[0] / patch / lightness. |
| appearance.json | `gallery.rangeCases[0].patch.baseHue` | 60 | color channel / degrees | [-10000000, 10000000] | appearance: gallery / range Cases[0] / patch / base Hue. |
| appearance.json | `gallery.rangeCases[0].patch.accentHue` | 280 | color channel / degrees | [-10000000, 10000000] | appearance: gallery / range Cases[0] / patch / accent Hue. |
| appearance.json | `gallery.rangeCases[1].patch.saturation` | 85 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[1] / patch / saturation. |
| appearance.json | `gallery.rangeCases[1].patch.lightness` | 38 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[1] / patch / lightness. |
| appearance.json | `gallery.rangeCases[1].patch.baseHue` | 250 | color channel / degrees | [-10000000, 10000000] | appearance: gallery / range Cases[1] / patch / base Hue. |
| appearance.json | `gallery.rangeCases[1].patch.accentHue` | 40 | color channel / degrees | [-10000000, 10000000] | appearance: gallery / range Cases[1] / patch / accent Hue. |
| appearance.json | `gallery.rangeCases[2].patch.width` | 1.65 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[2] / patch / width. |
| appearance.json | `gallery.rangeCases[2].patch.height` | 0.7 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[2] / patch / height. |
| appearance.json | `gallery.rangeCases[2].patch.head` | 0.7 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[2] / patch / head. |
| appearance.json | `gallery.rangeCases[2].patch.limb` | 0.6 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[2] / patch / limb. |
| appearance.json | `gallery.rangeCases[2].patch.tail` | 1.8 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[2] / patch / tail. |
| appearance.json | `gallery.rangeCases[3].patch.width` | 0.65 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[3] / patch / width. |
| appearance.json | `gallery.rangeCases[3].patch.height` | 1.5 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[3] / patch / height. |
| appearance.json | `gallery.rangeCases[3].patch.head` | 1.5 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[3] / patch / head. |
| appearance.json | `gallery.rangeCases[3].patch.limb` | 1.7 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[3] / patch / limb. |
| appearance.json | `gallery.rangeCases[3].patch.tail` | 0.5 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[3] / patch / tail. |
| appearance.json | `gallery.rangeCases[4].patch.head` | 0.7 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[4] / patch / head. |
| appearance.json | `gallery.rangeCases[4].patch.limb` | 0.6 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[4] / patch / limb. |
| appearance.json | `gallery.rangeCases[4].patch.tail` | 0.5 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[4] / patch / tail. |
| appearance.json | `gallery.rangeCases[5].patch.head` | 1.5 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[5] / patch / head. |
| appearance.json | `gallery.rangeCases[5].patch.limb` | 1.7 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[5] / patch / limb. |
| appearance.json | `gallery.rangeCases[5].patch.tail` | 1.8 | coefficient | [-10000000, 10000000] | appearance: gallery / range Cases[5] / patch / tail. |
| appearance.json | `cues.levelUpRadiusTiles` | 1.6 | tiles | [-10000000, 10000000] | appearance: cues / level Up Radius Tiles. |
| appearance.json | `cues.levelUpLineWidthTiles` | 0.14 | tiles | [-10000000, 10000000] | appearance: cues / level Up Line Width Tiles. |
| appearance.json | `selection.strokeWidthTiles` | 0.065 | tiles | [-10000000, 10000000] | appearance: selection / stroke Width Tiles. |
| appearance.json | `selection.dashTiles[0]` | 0.18 | coefficient | [-10000000, 10000000] | appearance: selection / dash Tiles[0]. |
| appearance.json | `selection.dashTiles[1]` | 0.16 | coefficient | [-10000000, 10000000] | appearance: selection / dash Tiles[1]. |
| appearance.json | `selection.offsetYTiles` | 0.35 | tiles | [-1024, 1024] | appearance: selection / offset YTiles. |
| appearance.json | `selection.radiusTiles.x` | 1.4 | geometry units | [-256, 256] | appearance: selection / radius Tiles / x. |
| appearance.json | `selection.radiusTiles.y` | 0.7 | geometry units | [-256, 256] | appearance: selection / radius Tiles / y. |
| appearance.json | `palette.saturationBounds[0]` | 0 | coefficient | [-10000000, 10000000] | appearance: palette / saturation Bounds[0]. |
| appearance.json | `palette.saturationBounds[1]` | 88 | coefficient | [-10000000, 10000000] | appearance: palette / saturation Bounds[1]. |
| appearance.json | `palette.lightnessBounds[0]` | 16 | coefficient | [-10000000, 10000000] | appearance: palette / lightness Bounds[0]. |
| appearance.json | `palette.lightnessBounds[1]` | 86 | coefficient | [-10000000, 10000000] | appearance: palette / lightness Bounds[1]. |
| appearance.json | `palette.roles.primary.saturation[0]` | 45 | coefficient | [-10000000, 10000000] | appearance: palette / roles / primary / saturation[0]. |
| appearance.json | `palette.roles.primary.saturation[1]` | 85 | coefficient | [-10000000, 10000000] | appearance: palette / roles / primary / saturation[1]. |
| appearance.json | `palette.roles.primary.lightness[0]` | 38 | coefficient | [-10000000, 10000000] | appearance: palette / roles / primary / lightness[0]. |
| appearance.json | `palette.roles.primary.lightness[1]` | 66 | coefficient | [-10000000, 10000000] | appearance: palette / roles / primary / lightness[1]. |
| appearance.json | `palette.roles.primary.alpha` | 1 | ratio | [0, 1] | appearance: palette / roles / primary / alpha. |
| appearance.json | `palette.roles.secondary.saturation[0]` | 30 | coefficient | [-10000000, 10000000] | appearance: palette / roles / secondary / saturation[0]. |
| appearance.json | `palette.roles.secondary.saturation[1]` | 65 | coefficient | [-10000000, 10000000] | appearance: palette / roles / secondary / saturation[1]. |
| appearance.json | `palette.roles.secondary.lightness[0]` | 65 | coefficient | [-10000000, 10000000] | appearance: palette / roles / secondary / lightness[0]. |
| appearance.json | `palette.roles.secondary.lightness[1]` | 82 | coefficient | [-10000000, 10000000] | appearance: palette / roles / secondary / lightness[1]. |
| appearance.json | `palette.roles.secondary.alpha` | 1 | ratio | [0, 1] | appearance: palette / roles / secondary / alpha. |
| appearance.json | `palette.roles.accent.saturation[0]` | 45 | coefficient | [-10000000, 10000000] | appearance: palette / roles / accent / saturation[0]. |
| appearance.json | `palette.roles.accent.saturation[1]` | 85 | coefficient | [-10000000, 10000000] | appearance: palette / roles / accent / saturation[1]. |
| appearance.json | `palette.roles.accent.lightness[0]` | 38 | coefficient | [-10000000, 10000000] | appearance: palette / roles / accent / lightness[0]. |
| appearance.json | `palette.roles.accent.lightness[1]` | 62 | coefficient | [-10000000, 10000000] | appearance: palette / roles / accent / lightness[1]. |
| appearance.json | `palette.roles.accent.alpha` | 1 | ratio | [0, 1] | appearance: palette / roles / accent / alpha. |
| appearance.json | `palette.roles.shade.saturation[0]` | 12 | coefficient | [-10000000, 10000000] | appearance: palette / roles / shade / saturation[0]. |
| appearance.json | `palette.roles.shade.saturation[1]` | 30 | coefficient | [-10000000, 10000000] | appearance: palette / roles / shade / saturation[1]. |
| appearance.json | `palette.roles.shade.lightness[0]` | 16 | coefficient | [-10000000, 10000000] | appearance: palette / roles / shade / lightness[0]. |
| appearance.json | `palette.roles.shade.lightness[1]` | 24 | coefficient | [-10000000, 10000000] | appearance: palette / roles / shade / lightness[1]. |
| appearance.json | `palette.roles.shade.alpha` | 1 | ratio | [0, 1] | appearance: palette / roles / shade / alpha. |
| appearance.json | `palette.roles.eye.saturation[0]` | 45 | coefficient | [-10000000, 10000000] | appearance: palette / roles / eye / saturation[0]. |
| appearance.json | `palette.roles.eye.saturation[1]` | 85 | coefficient | [-10000000, 10000000] | appearance: palette / roles / eye / saturation[1]. |
| appearance.json | `palette.roles.eye.lightness[0]` | 22 | coefficient | [-10000000, 10000000] | appearance: palette / roles / eye / lightness[0]. |
| appearance.json | `palette.roles.eye.lightness[1]` | 34 | coefficient | [-10000000, 10000000] | appearance: palette / roles / eye / lightness[1]. |
| appearance.json | `palette.roles.eye.alpha` | 1 | ratio | [0, 1] | appearance: palette / roles / eye / alpha. |
| appearance.json | `proportions.width[0]` | 0.65 | coefficient | [-10000000, 10000000] | appearance: proportions / width[0]. |
| appearance.json | `proportions.width[1]` | 1.65 | coefficient | [-10000000, 10000000] | appearance: proportions / width[1]. |
| appearance.json | `proportions.height[0]` | 0.7 | coefficient | [-10000000, 10000000] | appearance: proportions / height[0]. |
| appearance.json | `proportions.height[1]` | 1.5 | coefficient | [-10000000, 10000000] | appearance: proportions / height[1]. |
| appearance.json | `proportions.head[0]` | 0.7 | coefficient | [-10000000, 10000000] | appearance: proportions / head[0]. |
| appearance.json | `proportions.head[1]` | 1.5 | coefficient | [-10000000, 10000000] | appearance: proportions / head[1]. |
| appearance.json | `proportions.limb[0]` | 0.6 | coefficient | [-10000000, 10000000] | appearance: proportions / limb[0]. |
| appearance.json | `proportions.limb[1]` | 1.7 | coefficient | [-10000000, 10000000] | appearance: proportions / limb[1]. |
| appearance.json | `proportions.tail[0]` | 0.5 | coefficient | [-10000000, 10000000] | appearance: proportions / tail[0]. |
| appearance.json | `proportions.tail[1]` | 1.8 | coefficient | [-10000000, 10000000] | appearance: proportions / tail[1]. |
| appearance.json | `pattern.fallbackSeed` | 7 | uint32 seed | integer [0, 4294967295] | appearance: pattern / fallback Seed. |
| appearance.json | `pattern.spots` | 9 | coefficient | [-10000000, 10000000] | appearance: pattern / spots. |
| appearance.json | `pattern.stripes` | 6 | coefficient | [-10000000, 10000000] | appearance: pattern / stripes. |
| appearance.json | `pattern.marbled` | 4 | coefficient | [-10000000, 10000000] | appearance: pattern / marbled. |
| appearance.json | `pattern.minRadius` | 0.07 | coefficient | [-10000000, 10000000] | appearance: pattern / min Radius. |
| appearance.json | `pattern.maxRadius` | 0.16 | coefficient | [-10000000, 10000000] | appearance: pattern / max Radius. |
| appearance.json | `pattern.stripeWidth` | 0.12 | coefficient | [-10000000, 10000000] | appearance: pattern / stripe Width. |
| appearance.json | `pattern.opacity` | 0.65 | coefficient | [-10000000, 10000000] | appearance: pattern / opacity. |
| appearance.json | `pattern.margin` | 1.25 | coefficient | [-10000000, 10000000] | appearance: pattern / margin. |
| appearance.json | `pattern.tilt` | 0.3 | coefficient | [-10000000, 10000000] | appearance: pattern / tilt. |
| appearance.json | `pattern.amplitude` | 0.22 | coefficient | [-10000000, 10000000] | appearance: pattern / amplitude. |
| appearance.json | `pattern.points` | 7 | rig units (radians for rotation) | [-1024, 1024] | appearance: pattern / points. |
| appearance.json | `modifiers.maximum` | 1 | coefficient | [-10000000, 10000000] | appearance: modifiers / maximum. |
| appearance.json | `modifiers.maximumPerType` | 1 | coefficient | [-10000000, 10000000] | appearance: modifiers / maximum Per Type. |
| appearance.json | `modifiers.strengthPerFruit` | 0.025 | coefficient | [-10000000, 10000000] | appearance: modifiers / strength Per Fruit. |
| appearance.json | `modifiers.maximumStrength` | 0.18 | coefficient | [-10000000, 10000000] | appearance: modifiers / maximum Strength. |
| appearance.json | `modifiers.blendWeight` | 0.2 | ratio | [0, 1] | appearance: modifiers / blend Weight. |
| appearance.json | `modifiers.halfLifeDays` | 1 | habitat days | [0, 10000] | appearance: modifiers / half Life Days. |
| appearance.json | `modifiers.expiryDays` | 8 | habitat days | [0, 10000] | appearance: modifiers / expiry Days. |
| appearance.json | `modifiers.minimumStrength` | 0.0001 | coefficient | [-10000000, 10000000] | appearance: modifiers / minimum Strength. |
| appearance.json | `animation.breathing` | 0.02 | coefficient | [-10000000, 10000000] | appearance: animation / breathing. |
| appearance.json | `animation.breathingSeconds` | 3 | seconds | [0, 86400] | appearance: animation / breathing Seconds. |
| appearance.json | `animation.bobPixels` | 0.5 | coefficient | [-10000000, 10000000] | appearance: animation / bob Pixels. |
| appearance.json | `animation.swayRadians` | 0.035 | coefficient | [-10000000, 10000000] | appearance: animation / sway Radians. |
| appearance.json | `animation.tiltRadians` | 0.025 | coefficient | [-10000000, 10000000] | appearance: animation / tilt Radians. |
| appearance.json | `animation.blinkSeconds` | 0.12 | seconds | [0, 86400] | appearance: animation / blink Seconds. |
| appearance.json | `animation.blinkIntervalSeconds` | 5 | seconds | [0, 86400] | appearance: animation / blink Interval Seconds. |
| appearance.json | `animation.closedEyeScale` | 0.12 | rig units (radians for rotation) | [-1024, 1024] | appearance: animation / closed Eye Scale. |
| appearance.json | `animation.tiredScale` | 0.96 | rig units (radians for rotation) | [-1024, 1024] | appearance: animation / tired Scale. |
| appearance.json | `animation.moodThreshold` | 0.4 | ratio | [0, 1] | appearance: animation / mood Threshold. |
| appearance.json | `animation.boundsMargin` | 6 | coefficient | [-10000000, 10000000] | appearance: animation / bounds Margin. |
| appearance.json | `cache.maximum` | 256 | coefficient | [-10000000, 10000000] | appearance: cache / maximum. |
| appearance.json | `cache.scaleQuantum` | 0.125 | rig units (radians for rotation) | [-1024, 1024] | appearance: cache / scale Quantum. |
| appearance.json | `cache.rasterPixelBudget` | 16777216 | pixels | integer [1048576, 67108864] | Maximum total pixels retained by the SVG image LRU; eviction preserves artwork resolution. |
| appearance.json | `bench.creatures` | 30 | coefficient | [-10000000, 10000000] | appearance: bench / creatures. |
| appearance.json | `bench.iterations` | 300 | coefficient | [-10000000, 10000000] | appearance: bench / iterations. |
| appearance.json | `bench.warmup` | 3 | coefficient | [-10000000, 10000000] | appearance: bench / warmup. |
| dynasty.json | `movement.normal.walk` | 1.2 | points | [0, 1000000] | dynasty / movement / normal / walk |
| dynasty.json | `movement.normal.swim` | 0.9 | points | [0, 1000000] | dynasty / movement / normal / swim |
| dynasty.json | `movement.normal.fly` | 1.1 | points | [0, 1000000] | dynasty / movement / normal / fly |
| dynasty.json | `movement.bonusPerLevel` | 0.025 | points | [0, 1000000] | dynasty / movement / bonusPerLevel |
| dynasty.json | `movement.baseEnergy` | 30 | points | integer [0, 1000000] | dynasty / movement / baseEnergy |
| dynasty.json | `movement.energyPerStamina` | 2 | points | integer [0, 1000000] | dynasty / movement / energyPerStamina |
| dynasty.json | `movement.drainPerSecond` | 1 | points | integer [0, 1000000] | dynasty / movement / drainPerSecond |
| dynasty.json | `movement.recoveryPerSecond` | 2 | points | integer [0, 1000000] | dynasty / movement / recoveryPerSecond |
| dynasty.json | `movement.restartEnergyFraction` | 0.75 | points | [0, 1000000] | dynasty / movement / restartEnergyFraction |
| dynasty.json | `movement.minimumFlight` | 1 | points | integer [0, 1000000] | dynasty / movement / minimumFlight |
| dynasty.json | `plants.maximum` | 20 | points | integer [0, 1000000] | dynasty / plants / maximum |
| dynasty.json | `plants.initial` | 15 | points | integer [0, 1000000] | dynasty / plants / initial |
| dynasty.json | `plants.spawnEveryTicks` | 10 | ticks | integer [0, 1000000] | dynasty / plants / spawnEveryTicks |
| dynasty.json | `plants.spacing` | 4 | points | integer [0, 1000000] | dynasty / plants / spacing |
| dynasty.json | `plants.waterShare` | 0.3 | points | [0, 1000000] | dynasty / plants / waterShare |
| dynasty.json | `plants.berryXp` | 30 | points | integer [0, 1000000] | dynasty / plants / berryXp |
| dynasty.json | `plants.carryCapacity` | 6 | points | integer [0, 1000000] | dynasty / plants / carryCapacity |
| dynasty.json | `plants.spawnAttempts` | 60 | points | integer [0, 1000000] | dynasty / plants / spawnAttempts |
| dynasty.json | `plants.gatherInterest` | 0.4 | points | [0, 1000000] | dynasty / plants / gatherInterest |
| dynasty.json | `plants.saveCompatibilityMaximum` | 40 | plants | integer [40, 10000] | Legacy plant count accepted on load before next-tick thinning |
| dynasty.json | `relationships.friendThreshold` | 33.333333333333336 | points | [0, 1000000] | dynasty / relationships / friendThreshold |
| dynasty.json | `relationships.foeThreshold` | -33.333333333333336 | points | [-100, 1000000] | dynasty / relationships / foeThreshold |
| dynasty.json | `relationships.mateLimit` | 3 | points | integer [0, 1000000] | dynasty / relationships / mateLimit |
| dynasty.json | `relationships.mateGain` | 50 | points | integer [0, 1000000] | dynasty / relationships / mateGain |
| dynasty.json | `relationships.mateMinimumScore` | 35 | points | integer [0, 1000000] | dynasty / relationships / mateMinimumScore |
| dynasty.json | `relationships.breakupScore` | 0 | points | integer [0, 1000000] | dynasty / relationships / breakupScore |
| dynasty.json | `relationships.socialIntervalTicks` | 120 | ticks | integer [0, 1000000] | dynasty / relationships / socialIntervalTicks |
| dynasty.json | `relationships.proximity` | 2 | points | integer [0, 1000000] | dynasty / relationships / proximity |
| dynasty.json | `relationships.shareHunger` | 35 | points | integer [0, 1000000] | dynasty / relationships / shareHunger |
| dynasty.json | `relationships.stealChance` | 0.4 | points | [0, 1000000] | dynasty / relationships / stealChance |
| dynasty.json | `relationships.fightChance` | 0.65 | points | [0, 1000000] | dynasty / relationships / fightChance |
| dynasty.json | `relationships.fightPenalty` | 0.4 | points | [0, 1000000] | dynasty / relationships / fightPenalty |
| dynasty.json | `relationships.fightPenaltyDays` | 2 | days | integer [0, 1000000] | dynasty / relationships / fightPenaltyDays |
| dynasty.json | `relationships.lonelyNoFriendsPerMinute` | 1 | points | integer [0, 1000000] | dynasty / relationships / lonelyNoFriendsPerMinute |
| dynasty.json | `relationships.lonelyPerFoePerMinute` | 0.25 | points | [0, 1000000] | dynasty / relationships / lonelyPerFoePerMinute |
| dynasty.json | `relationships.breedingLonelinessWeight` | 0.35 | points | [0, 1000000] | dynasty / relationships / breedingLonelinessWeight |
| dynasty.json | `relationships.shareBond` | 3 | points | integer [0, 1000000] | dynasty / relationships / shareBond |
| dynasty.json | `relationships.stealBond` | -8 | points | integer [-100, 1000000] | dynasty / relationships / stealBond |
| dynasty.json | `relationships.fightBond` | -10 | points | integer [-100, 1000000] | dynasty / relationships / fightBond |
| dynasty.json | `relationships.mateStartingBond` | 75 | points | [51, 100] | Bond strength granted when a new mate bond forms |
| dynasty.json | `relationships.mateReinforcement` | 8 | points | [0, 50] | Mate-bond gain from friendly contact between existing mates |
| dynasty.json | `competitions.derbyDays` | 15 | days | integer [0, 1000000] | dynasty / competitions / derbyDays |
| dynasty.json | `competitions.cupDays` | 30 | days | integer [0, 1000000] | dynasty / competitions / cupDays |
| dynasty.json | `competitions.berryPrize` | 5 | points | integer [0, 1000000] | dynasty / competitions / berryPrize |
| dynasty.json | `competitions.championAttraction` | 0.2 | points | [0, 1000000] | dynasty / competitions / championAttraction |
| dynasty.json | `competitions.historyLimit` | 100 | points | integer [0, 1000000] | dynasty / competitions / historyLimit |
| dynasty.json | `art.developmentStart` | 1 | points | integer [0, 1000000] | dynasty / art / developmentStart |
| dynasty.json | `art.developmentMaximum` | 100 | points | integer [0, 1000000] | dynasty / art / developmentMaximum |
| dynasty.json | `art.sizeTiles` | 5 | points | integer [0, 1000000] | dynasty / art / sizeTiles |
| dynasty.json | `art.walkCycleTicks` | 2 | ticks | integer [0, 1000000] | dynasty / art / walkCycleTicks |
| dynasty.json | `art.flapCycleTicks` | 1.2 | ticks | [0, 1000000] | dynasty / art / flapCycleTicks |
| dynasty.json | `art.footAngle` | 6 | points | integer [0, 1000000] | dynasty / art / footAngle |
| dynasty.json | `art.wingAngle` | 12 | points | integer [0, 1000000] | dynasty / art / wingAngle |
| dynasty.json | `art.saturation` | 60 | points | integer [0, 1000000] | dynasty / art / saturation |
| dynasty.json | `art.baseLightness` | 42 | points | integer [0, 1000000] | dynasty / art / baseLightness |
| dynasty.json | `art.highlightLightness` | 62 | points | integer [0, 1000000] | dynasty / art / highlightLightness |

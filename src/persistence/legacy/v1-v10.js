const full = { "ticks": 5e5, "seeds": [271828, 314159, 161803, 57721, 141421], "sampleEveryTicks": 1e3, "bands": { "population.mean": [12, 24], "population.minimum": [1, 30], "population.maximum": [12, 30], "population.rescues": [0, 0], "population.starvationDeaths": [0, 0], "population.exhaustionDeaths": [0, 0], "life.meanLifespan": [58200, 58800], "life.generationsPer100k": [0.2, 20], "genetics.minimumDiversity": [0.4, 1], "genetics.minimumAlleles": [2, 60], "genetics.aptitudeDrift": [0, 0.3], "skills.meanCapFraction": [0.05, 0.9], "skills.maxedShare": [0, 0.8], "skills.dominantShare": [0, 0.7], "skills.partsPerAdult": [2, 12], "behavior.selfCare": [0.05, 0.85], "behavior.rest": [0.01, 0.8], "behavior.training": [5e-3, 0.9], "behavior.social": [1e-4, 0.8], "behavior.travel": [0, 0.8], "social.positiveShare": [0.05, 0.995], "social.meanDegree": [1, 16], "social.maximumDegree": [1, 16], "social.friendships": [1, 1e7], "social.rivalries": [1, 1e7], "social.bondedMatingShare": [0, 1], "competitions.fillRate": [0.65, 1], "competitions.cancellationRate": [0, 0.35], "competitions.winConcentration": [0, 0.35], "prizes.inventoryMinimum": [0, 999], "prizes.inventoryMaximum": [0, 999], "prizes.rareEatenPer100k": [1, 1e3], "events.perHour": [2, 90] } };
const quick = { "ticks": 2e4, "seeds": [271828, 314159], "sampleEveryTicks": 200, "bands": { "population.mean": [12, 30], "population.minimum": [1, 30], "population.maximum": [12, 30], "population.rescues": [0, 0], "population.starvationDeaths": [0, 0], "population.exhaustionDeaths": [0, 0], "life.meanLifespan": [0, 58800], "life.generationsPer100k": [0, 20], "genetics.minimumDiversity": [0.4, 1], "genetics.minimumAlleles": [2, 60], "genetics.aptitudeDrift": [0, 0.3], "skills.meanCapFraction": [0.05, 0.9], "skills.maxedShare": [0, 0.8], "skills.dominantShare": [0, 0.7], "skills.partsPerAdult": [2, 12], "behavior.selfCare": [0.05, 0.85], "behavior.rest": [0.01, 0.8], "behavior.training": [5e-3, 0.9], "behavior.social": [1e-4, 0.8], "behavior.travel": [0, 0.8], "social.positiveShare": [0.05, 0.995], "social.meanDegree": [1, 16], "social.maximumDegree": [1, 16], "social.friendships": [1, 1e7], "social.rivalries": [0, 1e7], "social.bondedMatingShare": [0, 1], "competitions.fillRate": [0.65, 1], "competitions.cancellationRate": [0, 0.35], "competitions.winConcentration": [0, 1], "prizes.inventoryMinimum": [0, 999], "prizes.inventoryMaximum": [0, 999], "prizes.rareEatenPer100k": [1, 1e3], "events.perHour": [2, 90] } };
const soak = { "ticks": 5e6, "seeds": [271828, 314159, 161803, 57721, 141421], "validateEveryTicks": 1e4, "roundTripChance": 2e-5, "catchUpChance": 2e-5, "maximumChunkTicks": 1e3, "shortTicks": 3e3, "shortSeeds": [271828, 314159] };
const health = {
  full,
  quick,
  soak
};
const playerEventKinds = ["spawn", "hatch", "stage", "death", "rebirth", "eggLaid", "rescue", "friendship", "rivalry", "mateBondFormed", "mateBondBroken", "competitionResult", "prizeAwarded"];
const eventWindowTicks = 1200;
const eventRateCap = 30;
const feedLimit = 24;
const ariaLiveIntervalMs = 5e3;
const debugRefreshHz = 2;
const playerRefreshHz = 5;
const textSizes = [14, 16, 18, 20];
const defaultTextSize = 16;
const defaultSpeed = 1;
const bundleByteBudget = 18e5;
const presentation = {
  playerEventKinds,
  eventWindowTicks,
  eventRateCap,
  feedLimit,
  ariaLiveIntervalMs,
  debugRefreshHz,
  playerRefreshHz,
  textSizes,
  defaultTextSize,
  defaultSpeed,
  bundleByteBudget
};
const starts = ["Ba", "Be", "Bi", "Bo", "Bu", "Ca", "Ce", "Ci", "Co", "Cu", "Da", "De", "Di", "Do", "Du", "Fa", "Fe", "Fi", "Fo", "Fu", "Ga", "Ge", "Gi", "Go", "Gu", "Ha", "He", "Hi", "Ho", "Hu", "Ja", "Je"];
const middles = ["la", "le", "li", "lo", "lu", "ma", "me", "mi", "mo", "mu", "na", "ne", "ni", "no", "nu", "ra", "re", "ri", "ro", "ru", "sa", "se", "si", "so", "su", "ta", "te", "ti", "to", "tu", "va", "ve"];
const ends = ["bel", "bin", "boo", "bud", "dew", "dot", "fern", "fin", "gem", "kin", "leaf", "lin", "loo", "lum", "mar", "moss", "nap", "nel", "nim", "oak", "paw", "pip", "pod", "pop", "ray", "ren", "roo", "seed", "sun", "tin", "twig", "wyn"];
const distinctFraction = 0.96;
const sampleSize = 1e3;
const names = {
  starts,
  middles,
  ends,
  distinctFraction,
  sampleSize
};
const backups = 2;
const importMaximumBytes = 52428800;
const storageQuotaBytes = 5242880;
const indexedDbThreshold = 0.5;
const leaseMs = 1e4;
const heartbeatMs = 3e3;
const commandHistoryLimit = 20;
const devValidate = false;
const validateEveryTicks = 1e3;
const helloWaitMs = 1e3;
const measuredCheckpointUtf8Bytes = 2006423;
const robustness = {
  backups,
  importMaximumBytes,
  storageQuotaBytes,
  indexedDbThreshold,
  leaseMs,
  heartbeatMs,
  commandHistoryLimit,
  devValidate,
  validateEveryTicks,
  helloWaitMs,
  measuredCheckpointUtf8Bytes
};
const fruit$1 = { "sunapple": 0, "dewberry": 0, "cloudplum": 0, "vinefig": 0, "stonepear": 0, "ambermelon": 0, "moonpeach": 0, "sparkcherry": 0, "prismpear": 0, "spiralfruit": 0 };
const seeds = { "sunapple": 0, "dewberry": 0, "cloudplum": 0, "vinefig": 0, "stonepear": 0, "ambermelon": 0, "moonpeach": 0, "sparkcherry": 0, "prismpear": 0, "spiralfruit": 0 };
const items$1 = { "nest": 0, "bed": 0, "track": 0, "wind_perch": 0, "climbing_frame": 0, "push_stone": 0, "trail_marker": 0, "toy": 0, "competition_pad": 0, "lantern": 0 };
const cosmetics = { "ribbon": 0, "leaf_crown": 0, "star_pin": 0 };
const emptyInventory = {
  fruit: fruit$1,
  seeds,
  items: items$1,
  cosmetics
};
const rulesVersion = "0.10.0";
const clock = { "tickSeconds": 1, "dayTicks": 1200, "foregroundSpeeds": [0, 1, 10, 100, 1e3], "maxTicksPerFrame": 100 };
const needs = { "perMinute": { "hunger": 12, "fatigue": 1.2, "boredom": 9, "loneliness": 1.6, "stress": -0.8 }, "newborn": { "hunger": 25, "fatigue": 15, "boredom": 10, "loneliness": 10, "stress": 0 }, "urgentThreshold": 85, "eatMinimumHunger": 15, "sleepExitFatigue": 15, "sleepLonelinessMultiplier": 0.5, "nightFatigueMultiplier": 1.25, "curiosityBoredomBase": 0.75, "curiosityBoredomWeight": 0.5, "sociabilityLonelinessBase": 0.25, "sociabilityLonelinessWeight": 0.75 };
const mood = { "needWeights": { "hunger": 0.3, "fatigue": 0.3, "boredom": 0.15, "loneliness": 0.15, "stress": 0.1 }, "responseTicks": 60, "valenceDecayTicks": 120, "labelThreshold": 0.25, "initial": 0.5 };
const ai = { "decisionIntervalTicks": 5, "minimumWorkCommitTicks": 8, "switchMargin": 0.12, "temperature": 0.08, "candidateCounts": { "food": 4, "perSkill": 2 }, "pathAttempts": 3, "wanderRadiusTiles": 3, "defaultPersonalityFit": 0.5, "utility": { "needs": 2, "personality": 0.18, "preference": 0.12, "growth": 0.12, "social": 0.1, "travelPenalty": 0.15, "fatiguePenalty": 0.2, "repeatPenalty": 0.08 }, "reliefScales": { "hunger": 30, "fatigue": 36, "boredom": 20, "loneliness": 18, "stress": 12 }, "travelScaleSeconds": 30, "fatiguePenaltyScale": 20 };
const personality = { "driftLimit": 0.3, "returnTimeDays": 20, "positiveEventStep": 5e-3, "rewardCooldownTicks": 60 };
const world = { "widthTiles": 64, "heightTiles": 48, "tilePixels": 32, "walkBaseSpeed": 0.8, "terrainCosts": { "grass": 1, "soil": 1.2, "shallowWalking": 1.8, "rock": 2 }, "pond": { "x": 44, "y": 20, "outer": { "x": 10, "y": 8 }, "inner": { "x": 7, "y": 5 } }, "rock": { "min": { "x": 10, "y": 8 }, "max": { "x": 17, "y": 13 } }, "soil": { "min": { "x": 8, "y": 29 }, "max": { "x": 22, "y": 36 } }, "nightStart": 0.7, "nightOverlayAlpha": 0.22 };
const initial = { "seed": 271828, "name": "Pip", "position": { "x": 26.5, "y": 22.5 }, "fruit": [{ "kind": "sunapple", "position": { "x": 24.5, "y": 23.5 } }, { "kind": "dewberry", "position": { "x": 29.5, "y": 22.5 } }, { "kind": "cloudplum", "position": { "x": 26.5, "y": 25.5 } }, { "kind": "vinefig", "position": { "x": 23.5, "y": 20.5 } }] };
const food = { "looseSpoilDays": 2, "historyLength": 5, "learningRate": 0.2, "genePreferenceWeight": 0.6, "learnedPreferenceWeight": 0.4, "repeatPreferencePenalty": 0.25, "rewardTasteWeight": 0.65, "rewardHungerWeight": 0.25, "rewardStressWeight": 0.1, "rewardStressScale": 14, "rewardLowHungerThreshold": 25, "rewardLowHungerPenalty": 0.3, "rewardRepeatPenalty": 0.2, "valenceWeight": 0.15, "positiveStressRelief": 4, "valenceBounds": [-0.5, 0.5], "favoriteThreshold": 0.35, "dislikeThreshold": -0.25, "labelMinimumMeals": 3, "reactionTicks": 12, "debugCreatureNames": ["Pip", "Moss", "Clover", "Fern", "Willow", "Bramble", "Juniper", "Sage"] };
const persistence = { "key": "creature-habitat.milestones-1-2", "autosaveRealSeconds": 15, "snapshotMaximumRealHz": 10 };
const skills$1 = { "capBase": 40, "capRange": 60, "baseXpPerSecond": 1, "aptitudeBase": 0.6, "aptitudeWeight": 0.8, "capTaper": 0.75, "moodBase": 0.75, "moodWeight": 0.25, "dedicatedQuality": 1, "improvisedQuality": 0.75, "dailyFullRateTicks": 240, "dailyReducedMultiplier": 0.5, "stressExclusionThreshold": 90, "learningRate": 0.2, "levelReward": 0.1, "rewardWellbeingWeight": 2, "levelUpMessageTicks": 12 };
const genetics = { "crossoverChance": 0.65, "quantitativeMutation": 8e-3, "categoricalMutation": 4e-3, "dominanceMutation": 2e-3, "mutationStep": [1, 24], "dominantWeight": 0.75, "circularEpsilon": 1e-9 };
const balance = {
  rulesVersion,
  clock,
  needs,
  mood,
  ai,
  personality,
  world,
  initial,
  food,
  persistence,
  skills: skills$1,
  genetics
};
const enabled$1 = true;
const ticksPerRealSecond = 1;
const offlineRateMultiplier = 0.25;
const maxCatchUpTicks = 18e3;
const minAwaySeconds = 5;
const excessTime = "discard";
const stallThresholdSeconds = 5;
const sliceBudgetMs = 8;
const minTicksPerSlice = 1;
const maxTicksPerSlice = 32;
const autosaveIntervalSeconds = 15;
const summary = { "notableLimit": 12, "skillMilestones": [10, 25, 45, 70], "priorities": { "rescue": 100, "death": 90, "rebirth": 85, "eggLaid": 80, "hatch": 75, "competitionResult": 95, "prizeAwarded": 65, "mateBondFormed": 60, "bodyPart": 55, "skillMilestone": 50, "friendship": 45, "rivalry": 40, "competitionCancelled": 35, "spawn": 30 } };
const archive = { "maintenanceTicks": 1200, "minimumAgeTicks": 1e6, "stubGenerationHorizon": 8, "dropGenerationHorizon": 16, "maximumFullRecords": 4096, "maximumStubs": 2048, "saveByteBudget": 4194304 };
const bench$1 = { "seed": 271828, "warmupTicks": 1e3, "measuredTicks": 1e4, "populations": [1, 10, 30], "targetCatchUpSeconds": 20 };
const offline = {
  enabled: enabled$1,
  ticksPerRealSecond,
  offlineRateMultiplier,
  maxCatchUpTicks,
  minAwaySeconds,
  excessTime,
  stallThresholdSeconds,
  sliceBudgetMs,
  minTicksPerSlice,
  maxTicksPerSlice,
  autosaveIntervalSeconds,
  summary,
  archive,
  bench: bench$1
};
const eat = { "workTicks": 8, "effects": { "hunger": 0, "fatigue": 0, "boredom": 0, "loneliness": 0, "stress": 0 } };
const graze = { "workTicks": 45, "effects": { "hunger": -18, "fatigue": 0, "boredom": -2, "loneliness": 0, "stress": 0 } };
const sleep = { "workTicks": 120, "effects": { "hunger": 0, "fatigue": -36, "boredom": 0, "loneliness": 0, "stress": -6 } };
const wander = { "workTicks": 30, "effects": { "hunger": 0, "fatigue": 0, "boredom": -8, "loneliness": 0, "stress": -2 } };
const idle = { "workTicks": 10, "effects": { "hunger": 0, "fatigue": 0, "boredom": 0, "loneliness": 0, "stress": -1 } };
const train_run = { "workTicks": 40, "effects": { "hunger": 1, "fatigue": 4, "boredom": -12, "loneliness": 0, "stress": 0 } };
const train_swim = { "workTicks": 40, "effects": { "hunger": 1, "fatigue": 4, "boredom": -12, "loneliness": 0, "stress": 0 } };
const train_fly = { "workTicks": 40, "effects": { "hunger": 1, "fatigue": 4, "boredom": -12, "loneliness": 0, "stress": 0 } };
const train_climb = { "workTicks": 40, "effects": { "hunger": 1, "fatigue": 4, "boredom": -12, "loneliness": 0, "stress": 0 } };
const train_strength = { "workTicks": 40, "effects": { "hunger": 1, "fatigue": 4, "boredom": -12, "loneliness": 0, "stress": 0 } };
const train_stamina = { "workTicks": 60, "effects": { "hunger": 1.5, "fatigue": 6, "boredom": -18, "loneliness": 0, "stress": 0 } };
const court = { "workTicks": 40, "effects": { "hunger": 0, "fatigue": 2, "boredom": 0, "loneliness": -15, "stress": 0 } };
const play = { "workTicks": 30, "effects": { "hunger": 0, "fatigue": 2, "boredom": -20, "loneliness": -18, "stress": 0 } };
const comfort = { "workTicks": 20, "effects": { "hunger": 0, "fatigue": 0, "boredom": 0, "loneliness": -8, "stress": 0 } };
const contest$1 = { "workTicks": 40, "effects": { "hunger": 0, "fatigue": 5, "boredom": -18, "loneliness": -10, "stress": 0 } };
const avoid = { "workTicks": 20, "effects": { "hunger": 0, "fatigue": 0, "boredom": -2, "loneliness": 0, "stress": -4 } };
const enterCompetition = { "workTicks": 1, "effects": { "hunger": 0, "fatigue": 6, "boredom": -15, "loneliness": -15, "stress": 0 } };
const attendCompetition = { "workTicks": 1, "effects": { "hunger": 0, "fatigue": 6, "boredom": -15, "loneliness": -15, "stress": 0 } };
const actions = {
  eat,
  graze,
  sleep,
  wander,
  idle,
  train_run,
  train_swim,
  train_fly,
  train_climb,
  train_strength,
  train_stamina,
  court,
  play,
  comfort,
  contest: contest$1,
  avoid,
  enterCompetition,
  attendCompetition
};
const sunapple = { "name": "Sunapple", "color": "#F2AA4C", "effects": { "hunger": -30, "fatigue": 0, "boredom": -4, "loneliness": 0, "stress": -2 }, "taste": { "sweet": 0.9, "tart": 0.3, "earthy": 0.1 }, "growthTicks": 180, "capacity": 6, "skillBonuses": { "run": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#F2AA4C", "exposure": { "palette": 0.02, "body": 0, "aptitude": 0.02 } }, "rare": false };
const dewberry = { "name": "Dewberry", "color": "#70B9E5", "effects": { "hunger": -26, "fatigue": -4, "boredom": -4, "loneliness": 0, "stress": -3 }, "taste": { "sweet": 0.6, "tart": 0.7, "earthy": 0.1 }, "growthTicks": 150, "capacity": 6, "skillBonuses": { "swim": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#70B9E5", "exposure": { "palette": 0.04, "body": 0, "aptitude": 0 } }, "rare": false };
const cloudplum = { "name": "Cloudplum", "color": "#C5B1E8", "effects": { "hunger": -24, "fatigue": 0, "boredom": -4, "loneliness": 0, "stress": -4 }, "taste": { "sweet": 0.7, "tart": 0.4, "earthy": 0.2 }, "growthTicks": 180, "capacity": 6, "skillBonuses": { "fly": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#C5B1E8", "exposure": { "palette": 0.02, "body": 0, "aptitude": 0.03 } }, "rare": false };
const vinefig = { "name": "Vinefig", "color": "#89A873", "effects": { "hunger": -32, "fatigue": 2, "boredom": -4, "loneliness": 0, "stress": -2 }, "taste": { "sweet": 0.5, "tart": 0.2, "earthy": 0.8 }, "growthTicks": 180, "capacity": 6, "skillBonuses": { "climb": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#89A873", "exposure": { "palette": 0, "body": 0.04, "aptitude": 0 } }, "rare": false };
const stonepear = { "name": "Stonepear", "color": "#C6AD87", "effects": { "hunger": -38, "fatigue": 4, "boredom": -4, "loneliness": 0, "stress": -1 }, "taste": { "sweet": 0.3, "tart": 0.2, "earthy": 0.9 }, "growthTicks": 240, "capacity": 6, "skillBonuses": { "strength": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#C6AD87", "exposure": { "palette": 0, "body": 0.04, "aptitude": 0.01 } }, "rare": false };
const ambermelon = { "name": "Ambermelon", "color": "#EDCA64", "effects": { "hunger": -40, "fatigue": -8, "boredom": -4, "loneliness": 0, "stress": -3 }, "taste": { "sweet": 0.8, "tart": 0.2, "earthy": 0.3 }, "growthTicks": 240, "capacity": 6, "skillBonuses": { "stamina": 0.25 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#EDCA64", "exposure": { "palette": 0.02, "body": 0.02, "aptitude": 0 } }, "rare": false };
const moonpeach = { "name": "Moonpeach", "color": "#EAB3C5", "effects": { "hunger": -26, "fatigue": 8, "boredom": -4, "loneliness": 0, "stress": -14 }, "taste": { "sweet": 0.8, "tart": 0.1, "earthy": 0.4 }, "growthTicks": 210, "capacity": 6, "skillBonuses": { "stamina": 0.1 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#EAB3C5", "exposure": { "palette": 0.03, "body": 0, "aptitude": 0 } }, "rare": false };
const sparkcherry = { "name": "Sparkcherry", "color": "#EB795B", "effects": { "hunger": -20, "fatigue": -12, "boredom": -4, "loneliness": 0, "stress": 4 }, "taste": { "sweet": 0.4, "tart": 1, "earthy": 0.1 }, "growthTicks": 150, "capacity": 6, "skillBonuses": { "run": 0.15, "climb": 0.15 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#EB795B", "exposure": { "palette": 0, "body": 0.02, "aptitude": 0.03 } }, "rare": false };
const prismpear = { "name": "Prism Pear", "color": "#8DD5C9", "effects": { "hunger": -30, "fatigue": 0, "boredom": -4, "loneliness": 0, "stress": -6 }, "taste": { "sweet": 0.7, "tart": 0.6, "earthy": 0.3 }, "growthTicks": 600, "capacity": 3, "skillBonuses": { "fly": 0.2, "swim": 0.2 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#8DD5C9", "exposure": { "palette": 0.16, "body": 0, "aptitude": 0 } }, "rare": true };
const spiralfruit = { "name": "Spiral Fruit", "color": "#D49BCB", "effects": { "hunger": -34, "fatigue": 2, "boredom": -4, "loneliness": 0, "stress": -6 }, "taste": { "sweet": 0.5, "tart": 0.4, "earthy": 0.9 }, "growthTicks": 600, "capacity": 3, "skillBonuses": { "strength": 0.2, "climb": 0.2 }, "skillBonusDurationTicks": 600, "appearance": { "tintRgb": "#D49BCB", "exposure": { "palette": 0, "body": 0.16, "aptitude": 0 } }, "rare": true };
const fruit = {
  sunapple,
  dewberry,
  cloudplum,
  vinefig,
  stonepear,
  ambermelon,
  moonpeach,
  sparkcherry,
  prismpear,
  spiralfruit
};
const defaults$1 = [{ "kind": "sunapple", "x": 10, "y": 30 }, { "kind": "dewberry", "x": 12, "y": 30 }, { "kind": "cloudplum", "x": 14, "y": 30 }, { "kind": "vinefig", "x": 16, "y": 30 }, { "kind": "stonepear", "x": 18, "y": 30 }, { "kind": "ambermelon", "x": 20, "y": 30 }, { "kind": "moonpeach", "x": 10, "y": 34 }, { "kind": "sparkcherry", "x": 14, "y": 34 }, { "kind": "sunapple", "x": 18, "y": 34 }, { "kind": "vinefig", "x": 22, "y": 34 }];
const sources = {
  defaults: defaults$1
};
const run = { "id": "run", "name": "Running", "trainingActivity": "train_run", "activityName": "Running laps", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const swim = { "id": "swim", "name": "Swimming", "trainingActivity": "train_swim", "activityName": "Practicing swimming", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const fly = { "id": "fly", "name": "Flight", "trainingActivity": "train_fly", "activityName": "Hopping and flapping", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const climb = { "id": "climb", "name": "Climbing", "trainingActivity": "train_climb", "activityName": "Practicing climbing", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const strength = { "id": "strength", "name": "Strength", "trainingActivity": "train_strength", "activityName": "Pushing stones", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const stamina = { "id": "stamina", "name": "Stamina", "trainingActivity": "train_stamina", "activityName": "Training endurance", "xpLinear": 8, "xpQuadratic": 2, "levelCap": 100 };
const skills = {
  run,
  swim,
  fly,
  climb,
  strength,
  stamina
};
const capacity$1 = 2;
const defaults = [{ "skill": "run", "x": 26, "y": 24, "width": 1, "height": 1 }, { "skill": "fly", "x": 27, "y": 28, "width": 1, "height": 1 }, { "skill": "climb", "x": 22, "y": 27, "width": 2, "height": 1 }, { "skill": "strength", "x": 22, "y": 24, "width": 1, "height": 1 }, { "skill": "stamina", "x": 24, "y": 28, "width": 1, "height": 1 }];
const shallowPractice = [{ "x": 26, "y": 26 }, { "x": 27, "y": 26 }];
const training = {
  capacity: capacity$1,
  defaults,
  shallowPractice
};
const genes = [
  {
    id: "run",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "run",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "swim",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "swim",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "fly",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "fly",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "climb",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "climb",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "strength",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "strength",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "stamina",
    chromosome: "aptitude",
    dominanceType: "partial",
    traitGroup: "aptitudes",
    trait: "stamina",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      64,
      192
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "baseHue",
    chromosome: "palette",
    dominanceType: "circular",
    traitGroup: "palette",
    trait: "baseHue",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      360
    ]
  },
  {
    id: "accentHue",
    chromosome: "palette",
    dominanceType: "circular",
    traitGroup: "palette",
    trait: "accentHue",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      360
    ]
  },
  {
    id: "eyeHue",
    chromosome: "palette",
    dominanceType: "circular",
    traitGroup: "palette",
    trait: "eyeHue",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      360
    ]
  },
  {
    id: "saturation",
    chromosome: "palette",
    dominanceType: "partial",
    traitGroup: "palette",
    trait: "saturation",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      45,
      85
    ]
  },
  {
    id: "lightness",
    chromosome: "palette",
    dominanceType: "partial",
    traitGroup: "palette",
    trait: "lightness",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      38,
      66
    ]
  },
  {
    id: "pattern",
    chromosome: "palette",
    dominanceType: "categorical",
    traitGroup: "palette",
    trait: "pattern",
    options: [
      {
        value: "solid",
        dominance: 1,
        founderWeight: 0.4
      },
      {
        value: "spots",
        dominance: 0,
        founderWeight: 0.25
      },
      {
        value: "stripes",
        dominance: 0,
        founderWeight: 0.25
      },
      {
        value: "marbled",
        dominance: 0,
        founderWeight: 0.1
      }
    ]
  },
  {
    id: "width",
    chromosome: "shape",
    dominanceType: "partial",
    traitGroup: "body",
    trait: "width",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0.65,
      1.65
    ]
  },
  {
    id: "height",
    chromosome: "shape",
    dominanceType: "partial",
    traitGroup: "body",
    trait: "height",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0.7,
      1.5
    ]
  },
  {
    id: "head",
    chromosome: "shape",
    dominanceType: "partial",
    traitGroup: "body",
    trait: "head",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0.6,
      1.7
    ]
  },
  {
    id: "limb",
    chromosome: "shape",
    dominanceType: "partial",
    traitGroup: "body",
    trait: "limb",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0.6,
      1.7
    ]
  },
  {
    id: "tail",
    chromosome: "shape",
    dominanceType: "partial",
    traitGroup: "body",
    trait: "tail",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0.5,
      1.8
    ]
  },
  {
    id: "ears",
    chromosome: "shape",
    dominanceType: "categorical",
    traitGroup: "body",
    trait: "ears",
    options: [
      {
        value: "round",
        dominance: 1,
        founderWeight: 0.5
      },
      {
        value: "pointed",
        dominance: 0,
        founderWeight: 0.35
      },
      {
        value: "folded",
        dominance: 0,
        founderWeight: 0.15
      }
    ]
  },
  {
    id: "sociability",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "personality",
    trait: "sociability",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "curiosity",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "personality",
    trait: "curiosity",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "competitiveness",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "personality",
    trait: "competitiveness",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "boldness",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "personality",
    trait: "boldness",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "gentleness",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "personality",
    trait: "gentleness",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "sweet",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "tasteBias",
    trait: "sweet",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "tart",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "tasteBias",
    trait: "tart",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  },
  {
    id: "earthy",
    chromosome: "temperament",
    dominanceType: "partial",
    traitGroup: "tasteBias",
    trait: "earthy",
    alleleRange: [
      0,
      255
    ],
    founderRange: [
      0,
      255
    ],
    traitRange: [
      0,
      1
    ]
  }
];
const stages = { "egg": { "durationTicks": 600, "mobile": false, "scale": 1, "saturationMultiplier": 1, "needMultiplier": 0, "xpMultiplier": 0, "skillCap": 0, "performanceMultiplier": 1 }, "baby": { "durationTicks": 2400, "mobile": true, "scale": 0.55, "saturationMultiplier": 1, "needMultiplier": 1.2, "xpMultiplier": 0.6, "skillCap": 15, "performanceMultiplier": 1 }, "juvenile": { "durationTicks": 4800, "mobile": true, "scale": 0.78, "saturationMultiplier": 1, "needMultiplier": 1.1, "xpMultiplier": 1.25, "skillCap": 45, "performanceMultiplier": 1 }, "adult": { "durationTicks": 43200, "mobile": true, "scale": 1, "saturationMultiplier": 1, "needMultiplier": 1, "xpMultiplier": 1, "skillCap": 100, "performanceMultiplier": 1 }, "elder": { "durationTicks": 7200, "mobile": true, "scale": 0.95, "saturationMultiplier": 0.45, "needMultiplier": 0.9, "xpMultiplier": 0.5, "skillCap": 100, "performanceMultiplier": 0.85 }, "cocoon": { "durationTicks": 1200, "mobile": false, "scale": 1, "saturationMultiplier": 0.6, "needMultiplier": 0, "xpMultiplier": 0, "skillCap": 0, "performanceMultiplier": 1 } };
const firstLife = ["egg", "baby", "juvenile", "adult", "elder"];
const rebornLife = ["cocoon", "baby", "juvenile", "adult", "elder"];
const capacity = 30;
const deathFadeRealSeconds = 0.6;
const rebirth = { "welfareMinimum": 0.7, "friendMinimum": 2, "friendBond": 40, "maximum": 2, "chance": 0.6, "memoryRetention": 0.5, "rivalryRetention": 0.25, "friendValence": -0.2, "friendStress": 8 };
const eventLogLimit = 1e3;
const visibleEventLimit = 12;
const debugAgeTicks = 1e3;
const debugAgeBatchTicks = 100;
const lifecycle = {
  stages,
  firstLife,
  rebornLife,
  capacity,
  deathFadeRealSeconds,
  rebirth,
  eventLogLimit,
  visibleEventLimit,
  debugAgeTicks,
  debugAgeBatchTicks
};
const enabled = true;
const extinctionRescue = true;
const founderCount = 12;
const initialAdults = 8;
const rescueCount = 6;
const minimumCompatibility = 0.3;
const compatibilityWeights = { "bond": 0.55, "traits": 0.2, "taste": 0.15, "diversity": 0.1 };
const needMaximum = 55;
const stressMaximum = 50;
const minimumMood = 0.1;
const adultRemainingTicks = 41;
const maximumClutches = 5;
const cooldownDays = 3;
const attemptIntervalTicks = 60;
const attemptChance = 0.5;
const encouragementUtility = 0.15;
const encouragementMultiplier = 1.5;
const courtshipInterest = 0.7;
const recipientMinimumUtility = 0.25;
const courtshipWorkTicks = 40;
const travelTimeoutTicks$1 = 60;
const radiusTiles$1 = 12;
const candidateCount = 8;
const densityFullUntil = 18;
const foodCapacityFloor = 12;
const referenceSources = 14;
const nest$1 = { "x": 28, "y": 24 };
const reportTicks = 1e6;
const reportSeeds = [271828, 314159, 161803];
const reportIntervalTicks = 5e4;
const diversityFloor = 0.4;
const minimumBond = 10;
const mateBondWeight = 0.1;
const rivalryPenalty = 0.1;
const mateTemperature = 0.6;
const breeding = {
  enabled,
  extinctionRescue,
  founderCount,
  initialAdults,
  rescueCount,
  minimumCompatibility,
  compatibilityWeights,
  needMaximum,
  stressMaximum,
  minimumMood,
  adultRemainingTicks,
  maximumClutches,
  cooldownDays,
  attemptIntervalTicks,
  attemptChance,
  encouragementUtility,
  encouragementMultiplier,
  courtshipInterest,
  recipientMinimumUtility,
  courtshipWorkTicks,
  travelTimeoutTicks: travelTimeoutTicks$1,
  radiusTiles: radiusTiles$1,
  candidateCount,
  densityFullUntil,
  foodCapacityFloor,
  referenceSources,
  nest: nest$1,
  reportTicks,
  reportSeeds,
  reportIntervalTicks,
  diversityFloor,
  minimumBond,
  mateBondWeight,
  rivalryPenalty,
  mateTemperature
};
const frame = { "size": 64, "bodyCenter": { "x": 32, "y": 36 }, "maximumRadius": 56, "worldUnitsPerPixel": 0.085, "hitRadiusTiles": 0.95, "thoughtOffsetTiles": 5.1, "nameOffsetTiles": 3.4 };
const slots = [{ "id": "shadow", "anchor": { "x": 0.5, "y": 0.875 }, "layer": "shadow", "proportion": "body", "motion": "static", "attachTo": { "partId": "run-front-leg", "point": "ground", "yOnly": true } }, { "id": "rearWing", "anchor": { "x": 0.390625, "y": 0.4375 }, "layer": "rearWing", "proportion": "body", "motion": "body" }, { "id": "tailShaft", "anchor": { "x": 0.34375, "y": 0.609375 }, "layer": "tailShaft", "proportion": "tail", "motion": "tail" }, { "id": "tailFin", "anchor": { "x": 0.34375, "y": 0.609375 }, "layer": "tailFin", "attachTo": { "partId": "stamina-tail", "point": "tip" }, "proportion": "tail", "motion": "tail" }, { "id": "rearFin", "anchor": { "x": 0.375, "y": 0.609375 }, "layer": "rearFin", "proportion": "body", "motion": "body" }, { "id": "rearLeg", "anchor": { "x": 0.390625, "y": 0.703125 }, "layer": "rearLeg", "proportion": "limb", "motion": "body" }, { "id": "rearHand", "anchor": { "x": 0.390625, "y": 0.59375 }, "layer": "rearHand", "proportion": "limb", "motion": "body" }, { "id": "body", "anchor": { "x": 0.5, "y": 0.5625 }, "layer": "body", "proportion": "body", "motion": "body" }, { "id": "shoulder", "anchor": { "x": 0.5, "y": 0.5 }, "layer": "shoulder", "proportion": "limb", "motion": "body" }, { "id": "frontLeg", "anchor": { "x": 0.609375, "y": 0.703125 }, "layer": "frontLeg", "proportion": "limb", "motion": "body" }, { "id": "head", "anchor": { "x": 0.578125, "y": 0.40625 }, "layer": "head", "proportion": "head", "motion": "body" }, { "id": "ears", "anchor": { "x": 0.578125, "y": 0.40625 }, "layer": "ears", "proportion": "head", "motion": "body" }, { "id": "frontHand", "anchor": { "x": 0.625, "y": 0.59375 }, "layer": "frontHand", "proportion": "limb", "motion": "body" }, { "id": "frontFin", "anchor": { "x": 0.578125, "y": 0.625 }, "layer": "frontFin", "proportion": "body", "motion": "body" }, { "id": "frontWing", "anchor": { "x": 0.484375, "y": 0.453125 }, "layer": "frontWing", "proportion": "body", "motion": "body" }, { "id": "face", "anchor": { "x": 0.578125, "y": 0.40625 }, "layer": "face", "proportion": "head", "motion": "body" }, { "id": "dorsalTuft", "anchor": { "x": 0.46875, "y": 0.390625 }, "layer": "dorsalTuft", "proportion": "body", "motion": "body" }, { "id": "bodyPattern", "anchor": { "x": 0.5, "y": 0.5625 }, "layer": "bodyPattern", "proportion": "body", "motion": "body" }, { "id": "cosmetic", "anchor": { "x": 0.578125, "y": 0.40625 }, "layer": "cosmetic", "proportion": "head", "motion": "body" }];
const parts = /* @__PURE__ */ JSON.parse('[{"id":"base-shadow","slot":"shadow","skill":null,"tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"shade","strokeRole":null,"strokeWidth":0,"scale":{"x":16,"y":3},"rotation":0,"offset":{"x":0,"y":0},"opacity":0.16,"saturationMultiplier":1}]}]},{"id":"base-body","slot":"body","skill":null,"tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":11,"y":13},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":null,"strokeWidth":0,"scale":{"x":6.8,"y":8.5},"rotation":0,"offset":{"x":2,"y":2},"opacity":1,"saturationMultiplier":1}]}]},{"id":"base-head","slot":"head","skill":null,"tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.075,"scale":{"x":9,"y":8.5},"rotation":0,"offset":{"x":0,"y":-4},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":null,"strokeWidth":0,"scale":{"x":4.2,"y":2.8},"rotation":0,"offset":{"x":3,"y":-1},"opacity":1,"saturationMultiplier":1}]}]},{"id":"base-ears","slot":"ears","skill":null,"tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.8,"y":3.8},"rotation":-0.3,"offset":{"x":-5,"y":-10.6},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.6,"y":3.3},"rotation":0.3,"offset":{"x":4.5,"y":-10.7},"opacity":1,"saturationMultiplier":1}],"variants":{"round":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.8,"y":3.8},"rotation":-0.3,"offset":{"x":-5,"y":-10.6},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.6,"y":3.3},"rotation":0.3,"offset":{"x":4.5,"y":-10.7},"opacity":1,"saturationMultiplier":1}],"pointed":[{"primitive":"polygon","fillRole":"primary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.8,"y":3.8},"rotation":-0.3,"offset":{"x":-5,"y":-10.6},"opacity":1,"saturationMultiplier":1,"smoothing":true,"points":[{"x":-1,"y":1},{"x":0,"y":-1.5},{"x":1,"y":1}]},{"primitive":"polygon","fillRole":"secondary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.6,"y":3.3},"rotation":0.3,"offset":{"x":4.5,"y":-10.7},"opacity":1,"saturationMultiplier":1,"smoothing":true,"points":[{"x":-1,"y":1},{"x":0,"y":-1.5},{"x":1,"y":1}]}],"folded":[{"primitive":"polygon","fillRole":"primary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.8,"y":3.8},"rotation":-0.3,"offset":{"x":-5,"y":-10.6},"opacity":1,"saturationMultiplier":1,"smoothing":true,"points":[{"x":-1,"y":-0.8},{"x":1,"y":-1.2},{"x":0.5,"y":0.8},{"x":-0.5,"y":0.4}]},{"primitive":"polygon","fillRole":"secondary","strokeRole":"shade","strokeWidth":0.13,"scale":{"x":2.6,"y":3.3},"rotation":0.3,"offset":{"x":4.5,"y":-10.7},"opacity":1,"saturationMultiplier":1,"smoothing":true,"points":[{"x":-1,"y":-0.8},{"x":1,"y":-1.2},{"x":0.5,"y":0.8},{"x":-0.5,"y":0.4}]}]}}]},{"id":"base-face","slot":"face","skill":null,"tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"eye","strokeRole":null,"strokeWidth":0,"scale":{"x":0.9,"y":1.25},"rotation":0,"offset":{"x":2.7,"y":-4.5},"opacity":1,"saturationMultiplier":1,"motion":"eye"},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"eye","strokeRole":null,"strokeWidth":0,"scale":{"x":0.6,"y":0.8},"rotation":0,"offset":{"x":-2.7,"y":-4.7},"opacity":1,"saturationMultiplier":1,"motion":"eye"},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"shade","strokeRole":null,"strokeWidth":0,"scale":{"x":1.2,"y":0.8},"rotation":0,"offset":{"x":6.3,"y":-2},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":0,"y":0},{"x":0.8,"y":0.5},{"x":1.6,"y":0}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.6,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":2,"y":0},"opacity":1,"saturationMultiplier":1}]}]},{"id":"run-rear-leg","slot":"rearLeg","skill":"run","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-3},{"x":0.45,"y":-3},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3.1,"y":2.8},"rotation":0,"offset":{"x":0,"y":8},"opacity":1,"saturationMultiplier":0.85}],"attachments":{"ground":{"x":0,"y":10.8}}},{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3.5500000000000003,"y":3.65},"rotation":-0.07,"offset":{"x":0.35,"y":7.4},"opacity":1,"saturationMultiplier":0.85}],"attachments":{"ground":{"x":0,"y":11.05}}},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4,"y":4.5},"rotation":-0.14,"offset":{"x":0.7,"y":6.8},"opacity":1,"saturationMultiplier":0.85}],"attachments":{"ground":{"x":0,"y":11.3}}},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.45,"y":5.35},"rotation":-0.21000000000000002,"offset":{"x":1.0499999999999998,"y":6.2},"opacity":1,"saturationMultiplier":0.85}],"attachments":{"ground":{"x":0,"y":11.55}}},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.9,"y":6.199999999999999},"rotation":-0.28,"offset":{"x":1.4,"y":5.6},"opacity":1,"saturationMultiplier":0.85}],"attachments":{"ground":{"x":0,"y":11.799999999999999}}}]},{"id":"climb-rear-hand","slot":"rearHand","skill":"climb","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":2.1,"y":2.5},"rotation":-0.25,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":2.6,"y":2.95},"rotation":-0.25,"offset":{"x":0,"y":0.3},"opacity":1,"saturationMultiplier":0.85}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":3.1,"y":3.4},"rotation":-0.25,"offset":{"x":0,"y":0.6},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":2.6,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":0.85}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":3.6,"y":3.85},"rotation":-0.25,"offset":{"x":0,"y":0.8999999999999999},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":2.9,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":0.85}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":4.1,"y":4.3},"rotation":-0.25,"offset":{"x":0,"y":1.2},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":3.2,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":0.85}]}]},{"id":"fly-rear-wing","slot":"rearWing","skill":"fly","tiers":[{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.85,"y":-0.45},{"x":-1,"y":-1},{"x":-0.35,"y":-0.8},{"x":0.08,"y":-0.25}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":8.3,"y":9},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":0,"y":0},{"x":-0.38,"y":-0.65}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":8.3,"y":9},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.85,"y":-0.45},{"x":-1,"y":-1},{"x":-0.35,"y":-0.8},{"x":0.08,"y":-0.25}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":11.6,"y":13},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":0,"y":0},{"x":-0.38,"y":-0.65}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":11.6,"y":13},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.85,"y":-0.45},{"x":-1,"y":-1},{"x":-0.35,"y":-0.8},{"x":0.08,"y":-0.25}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":14.899999999999999,"y":17},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":0,"y":0},{"x":-0.38,"y":-0.65}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":14.899999999999999,"y":17},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.85,"y":-0.45},{"x":-1,"y":-1},{"x":-0.35,"y":-0.8},{"x":0.08,"y":-0.25}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":18.2,"y":21},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85},{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.85,"y":-0.45},{"x":-1,"y":-1},{"x":-0.35,"y":-0.8},{"x":0.08,"y":-0.25}],"smoothing":true,"fillRole":"secondary","strokeRole":null,"strokeWidth":0,"scale":{"x":10.92,"y":16.8},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85},{"primitive":"path","points":[{"x":0,"y":0},{"x":-0.38,"y":-0.65}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":18.2,"y":21},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]}]},{"id":"swim-rear-fin","slot":"rearFin","skill":"swim","tiers":[{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":-1,"y":-0.4},{"x":-1,"y":0.45},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":3.8,"y":4.1},"rotation":-0.15,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":-1,"y":-0.4},{"x":-1,"y":0.45},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":5.6,"y":5.2},"rotation":-0.15,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":-1,"y":-0.4},{"x":-1,"y":0.45},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":7.4,"y":6.300000000000001},"rotation":-0.15,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":-1,"y":-0.4},{"x":-1,"y":0.45},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":9.2,"y":7.4},"rotation":-0.15,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":0.85}]}]},{"id":"run-front-leg","slot":"frontLeg","skill":"run","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-3},{"x":0.45,"y":-3},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3.1,"y":2.8},"rotation":0,"offset":{"x":0,"y":8},"opacity":1,"saturationMultiplier":1}],"attachments":{"ground":{"x":0,"y":10.8}}},{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3.5500000000000003,"y":3.65},"rotation":-0.07,"offset":{"x":0.35,"y":7.4},"opacity":1,"saturationMultiplier":1}],"attachments":{"ground":{"x":0,"y":11.05}}},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4,"y":4.5},"rotation":-0.14,"offset":{"x":0.7,"y":6.8},"opacity":1,"saturationMultiplier":1}],"attachments":{"ground":{"x":0,"y":11.3}}},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.45,"y":5.35},"rotation":-0.21000000000000002,"offset":{"x":1.0499999999999998,"y":6.2},"opacity":1,"saturationMultiplier":1}],"attachments":{"ground":{"x":0,"y":11.55}}},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":-0.45,"y":-2.2},{"x":0.45,"y":-2.2},{"x":0.65,"y":0.45},{"x":1,"y":0.75},{"x":0.8,"y":1},{"x":-0.7,"y":1},{"x":-0.8,"y":0.45}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.9,"y":6.199999999999999},"rotation":-0.28,"offset":{"x":1.4,"y":5.6},"opacity":1,"saturationMultiplier":1}],"attachments":{"ground":{"x":0,"y":11.799999999999999}}}]},{"id":"climb-front-hand","slot":"frontHand","skill":"climb","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":2.1,"y":2.5},"rotation":-0.25,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":2.6,"y":2.95},"rotation":-0.25,"offset":{"x":0,"y":0.3},"opacity":1,"saturationMultiplier":1}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":3.1,"y":3.4},"rotation":-0.25,"offset":{"x":0,"y":0.6},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":2.6,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":1}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":3.6,"y":3.85},"rotation":-0.25,"offset":{"x":0,"y":0.8999999999999999},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":2.9,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":1}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"accent","strokeRole":"shade","strokeWidth":0.14,"scale":{"x":4.1,"y":4.3},"rotation":-0.25,"offset":{"x":0,"y":1.2},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":-1,"y":-0.2},{"x":-0.8,"y":0.5},{"x":0,"y":0.7},{"x":0.8,"y":0.3}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.18,"scale":{"x":3.2,"y":1.8},"rotation":0,"offset":{"x":0.1,"y":1},"opacity":1,"saturationMultiplier":1}]}]},{"id":"fly-front-wing","slot":"frontWing","skill":"fly","tiers":[{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.4,"y":-0.5},{"x":-0.15,"y":-1},{"x":0.45,"y":-0.65},{"x":0.4,"y":-0.15}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":8.3,"y":9},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":0,"y":0},{"x":0.07,"y":-0.7}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":8.3,"y":9},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.4,"y":-0.5},{"x":-0.15,"y":-1},{"x":0.45,"y":-0.65},{"x":0.4,"y":-0.15}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":11.6,"y":13},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":0,"y":0},{"x":0.07,"y":-0.7}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":11.6,"y":13},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.4,"y":-0.5},{"x":-0.15,"y":-1},{"x":0.45,"y":-0.65},{"x":0.4,"y":-0.15}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":14.899999999999999,"y":17},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":0,"y":0},{"x":0.07,"y":-0.7}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":14.899999999999999,"y":17},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.4,"y":-0.5},{"x":-0.15,"y":-1},{"x":0.45,"y":-0.65},{"x":0.4,"y":-0.15}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.045,"scale":{"x":18.2,"y":21},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"polygon","points":[{"x":0,"y":0},{"x":-0.4,"y":-0.5},{"x":-0.15,"y":-1},{"x":0.45,"y":-0.65},{"x":0.4,"y":-0.15}],"smoothing":true,"fillRole":"secondary","strokeRole":null,"strokeWidth":0,"scale":{"x":10.92,"y":16.8},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"path","points":[{"x":0,"y":0},{"x":0.07,"y":-0.7}],"smoothing":true,"fillRole":null,"strokeRole":"shade","strokeWidth":0.045,"scale":{"x":18.2,"y":21},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]}]},{"id":"swim-front-fin","slot":"frontFin","skill":"swim","tiers":[{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":0.9,"y":-0.6},{"x":1,"y":0.5},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":3.8,"y":4.1},"rotation":0.2,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":0.9,"y":-0.6},{"x":1,"y":0.5},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":5.6,"y":5.2},"rotation":0.2,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":0.9,"y":-0.6},{"x":1,"y":0.5},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":7.4,"y":6.300000000000001},"rotation":0.2,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":0,"y":-0.3},{"x":0.9,"y":-0.6},{"x":1,"y":0.5},{"x":0,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.065,"scale":{"x":9.2,"y":7.4},"rotation":0.2,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]}]},{"id":"stamina-tail","slot":"tailShaft","skill":"stamina","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"primitive":"polygon","points":[{"x":2,"y":-2},{"x":-8.9,"y":-2.5},{"x":-11,"y":-3},{"x":-11,"y":-1},{"x":-8.3,"y":1.8},{"x":2,"y":3}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}],"attachments":{"tip":{"x":-11,"y":-2}}},{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"polygon","points":[{"x":2,"y":-2},{"x":-10.915,"y":-2.5},{"x":-14.1,"y":-4.2},{"x":-14.1,"y":-2.2},{"x":-10.004999999999999,"y":1.8},{"x":2,"y":3}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}],"attachments":{"tip":{"x":-14.1,"y":-3.2}}},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":2,"y":-2},{"x":-12.93,"y":-2.5},{"x":-17.2,"y":-5.4},{"x":-17.2,"y":-3.4000000000000004},{"x":-11.71,"y":1.8},{"x":2,"y":3}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}],"attachments":{"tip":{"x":-17.2,"y":-4.4}}},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":2,"y":-2},{"x":-14.945,"y":-2.5},{"x":-20.3,"y":-6.6},{"x":-20.3,"y":-4.6},{"x":-13.415000000000001,"y":1.8},{"x":2,"y":3}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}],"attachments":{"tip":{"x":-20.3,"y":-5.6}}},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":2,"y":-2},{"x":-16.96,"y":-2.5},{"x":-23.4,"y":-7.8},{"x":-23.4,"y":-5.8},{"x":-15.12,"y":1.8},{"x":2,"y":3}],"smoothing":true,"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}],"attachments":{"tip":{"x":-23.4,"y":-6.8}}}]},{"id":"swim-tail-fan","slot":"tailFin","skill":"swim","tiers":[{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":4,"y":0},{"x":-5,"y":-6},{"x":-8,"y":-1},{"x":-5,"y":5}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.7,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]}]},{"id":"stamina-crest","slot":"dorsalTuft","skill":"stamina","tiers":[{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"polygon","points":[{"x":-1,"y":0.7},{"x":-1,"y":-0.3},{"x":-0.6,"y":-1},{"x":-0.2,"y":-0.45},{"x":0.2,"y":-1.2},{"x":0.65,"y":-0.6},{"x":1,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3,"y":2.5},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"polygon","points":[{"x":-1,"y":0.7},{"x":-1,"y":-0.3},{"x":-0.6,"y":-1},{"x":-0.2,"y":-0.45},{"x":0.2,"y":-1.2},{"x":0.65,"y":-0.6},{"x":1,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.3,"y":3.9},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"polygon","points":[{"x":-1,"y":0.7},{"x":-1,"y":-0.3},{"x":-0.6,"y":-1},{"x":-0.2,"y":-0.45},{"x":0.2,"y":-1.2},{"x":0.65,"y":-0.6},{"x":1,"y":0.4}],"smoothing":true,"fillRole":"accent","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":5.6,"y":5.3},"rotation":0,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1}]}]},{"id":"strength-shoulders","slot":"shoulder","skill":"strength","tiers":[{"tier":1,"levelThreshold":10,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.08,"scale":{"x":6,"y":3.9000000000000004},"rotation":-0.16,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":2.7,"y":3.9},"rotation":-0.3,"offset":{"x":8,"y":6},"opacity":1,"saturationMultiplier":1}]},{"tier":2,"levelThreshold":25,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.08,"scale":{"x":7,"y":4.6},"rotation":-0.16,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":3.4,"y":4.8},"rotation":-0.3,"offset":{"x":8,"y":6},"opacity":1,"saturationMultiplier":1}]},{"tier":3,"levelThreshold":45,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.08,"scale":{"x":8,"y":5.3},"rotation":-0.16,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.1,"y":5.7},"rotation":-0.3,"offset":{"x":8,"y":6},"opacity":1,"saturationMultiplier":1}]},{"tier":4,"levelThreshold":70,"recipe":[{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"primary","strokeRole":"shade","strokeWidth":0.08,"scale":{"x":9,"y":6},"rotation":-0.16,"offset":{"x":0,"y":0},"opacity":1,"saturationMultiplier":1},{"primitive":"ellipse","radius":{"x":1,"y":1},"fillRole":"secondary","strokeRole":"shade","strokeWidth":0.12,"scale":{"x":4.8,"y":6.6},"rotation":-0.3,"offset":{"x":8,"y":6},"opacity":1,"saturationMultiplier":1}]}]},{"id":"cosmetic-ribbon","slot":"cosmetic","skill":null,"cosmetic":"ribbon","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"fillRole":"accent","strokeRole":"shade","strokeWidth":0.6,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":-8},"opacity":1,"saturationMultiplier":1,"primitive":"polygon","points":[{"x":-7,"y":-3},{"x":0,"y":0},{"x":7,"y":-3},{"x":6,"y":4},{"x":0,"y":1},{"x":-6,"y":4}],"smoothing":false}]}]},{"id":"cosmetic-leaf_crown","slot":"cosmetic","skill":null,"cosmetic":"leaf_crown","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"fillRole":"accent","strokeRole":"shade","strokeWidth":0.6,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":-8},"opacity":1,"saturationMultiplier":1,"primitive":"polygon","points":[{"x":-10,"y":0},{"x":-9,"y":-5},{"x":-4,"y":-2},{"x":0,"y":-7},{"x":4,"y":-2},{"x":9,"y":-5},{"x":10,"y":0}],"smoothing":false}]}]},{"id":"cosmetic-star_pin","slot":"cosmetic","skill":null,"cosmetic":"star_pin","tiers":[{"tier":0,"levelThreshold":0,"recipe":[{"fillRole":"accent","strokeRole":"shade","strokeWidth":0.6,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":-8},"opacity":1,"saturationMultiplier":1,"primitive":"polygon","points":[{"x":0,"y":-6},{"x":2,"y":-2},{"x":6,"y":-2},{"x":3,"y":1},{"x":4,"y":6},{"x":0,"y":3},{"x":-4,"y":6},{"x":-3,"y":1},{"x":-6,"y":-2},{"x":-2,"y":-2}],"smoothing":false}]}]}]');
const layerOrder = ["shadow", "rearWing", "tailShaft", "tailFin", "rearFin", "rearLeg", "rearHand", "body", "bodyPattern", "shoulder", "frontLeg", "head", "ears", "frontHand", "frontFin", "frontWing", "face", "dorsalTuft", "cosmetic", "thought"];
const conflictRule = "highest-tier-skill-order";
const skillOrder = ["run", "swim", "fly", "climb", "strength", "stamina"];
const dormant = { "egg": [{ "primitive": "ellipse", "radius": { "x": 1, "y": 1 }, "fillRole": "primary", "strokeRole": "shade", "strokeWidth": 0.09, "scale": { "x": 7.6, "y": 11.2 }, "rotation": 0, "offset": { "x": 0, "y": -4 }, "opacity": 1, "saturationMultiplier": 1 }, { "primitive": "ellipse", "radius": { "x": 1, "y": 1 }, "fillRole": "accent", "strokeRole": null, "strokeWidth": 0, "scale": { "x": 2, "y": 3 }, "rotation": -0.4, "offset": { "x": 2, "y": -4 }, "opacity": 1, "saturationMultiplier": 1 }], "cocoon": [{ "primitive": "ellipse", "radius": { "x": 1, "y": 1 }, "fillRole": "secondary", "strokeRole": "shade", "strokeWidth": 0.09, "scale": { "x": 8.4, "y": 11 }, "rotation": 0, "offset": { "x": 0, "y": -4 }, "opacity": 1, "saturationMultiplier": 1 }, { "primitive": "path", "points": [{ "x": -6, "y": -7 }, { "x": 0, "y": -9 }, { "x": 6, "y": -7 }, { "x": -6, "y": -1 }, { "x": 0, "y": 1 }, { "x": 6, "y": -1 }], "smoothing": true, "fillRole": null, "strokeRole": "shade", "strokeWidth": 0.7, "scale": { "x": 1, "y": 1 }, "rotation": 0, "offset": { "x": 0, "y": 0 }, "opacity": 1, "saturationMultiplier": 1 }] };
const gallery = { "seed": 7001, "randomCount": 20, "cellPixels": 168, "background": "#f5f4eb", "gridGap": 12, "offspring": 6, "progression": [0, 10, 25, 45, 70], "distinctFraction": 0.95, "rangeCases": [{ "id": "light", "patch": { "saturation": 45, "lightness": 66, "baseHue": 60, "accentHue": 280 } }, { "id": "dark", "patch": { "saturation": 85, "lightness": 38, "baseHue": 250, "accentHue": 40 } }, { "id": "wide", "patch": { "width": 1.65, "height": 0.7, "head": 0.7, "limb": 0.6, "tail": 1.8 } }, { "id": "tall", "patch": { "width": 0.65, "height": 1.5, "head": 1.5, "limb": 1.7, "tail": 0.5 } }, { "id": "small-parts", "patch": { "head": 0.7, "limb": 0.6, "tail": 0.5 } }, { "id": "large-parts", "patch": { "head": 1.5, "limb": 1.7, "tail": 1.8 } }, { "id": "pattern-solid", "patch": { "pattern": "solid" } }, { "id": "pattern-spots", "patch": { "pattern": "spots" } }, { "id": "pattern-stripes", "patch": { "pattern": "stripes" } }, { "id": "pattern-marbled", "patch": { "pattern": "marbled" } }, { "id": "ears-round", "patch": { "ears": "round" } }, { "id": "ears-pointed", "patch": { "ears": "pointed" } }, { "id": "ears-folded", "patch": { "ears": "folded" } }] };
const cues = { "levelUpColor": "#ffe4a0", "levelUpRadiusTiles": 1.6, "levelUpLineWidthTiles": 0.14 };
const selection = { "color": "#5c7a54", "strokeWidthTiles": 0.065, "dashTiles": [0.18, 0.16], "offsetYTiles": 0.35, "radiusTiles": { "x": 1.4, "y": 0.7 } };
const palette = { "saturationBounds": [0, 88], "lightnessBounds": [16, 86], "roles": { "primary": { "hueGene": "baseHue", "saturation": [45, 85], "lightness": [38, 66], "alpha": 1 }, "secondary": { "hueGene": "baseHue", "saturation": [30, 65], "lightness": [65, 82], "alpha": 1 }, "accent": { "hueGene": "accentHue", "saturation": [45, 85], "lightness": [38, 62], "alpha": 1 }, "shade": { "hueGene": "baseHue", "saturation": [12, 30], "lightness": [16, 24], "alpha": 1 }, "eye": { "hueGene": "eyeHue", "saturation": [45, 85], "lightness": [22, 34], "alpha": 1 } } };
const proportions = { "width": [0.65, 1.65], "height": [0.7, 1.5], "head": [0.7, 1.5], "limb": [0.6, 1.7], "tail": [0.5, 1.8] };
const pattern = { "fallbackSeed": 7, "spots": 9, "stripes": 6, "marbled": 4, "minRadius": 0.07, "maxRadius": 0.16, "stripeWidth": 0.12, "opacity": 0.65, "margin": 1.25, "tilt": 0.3, "amplitude": 0.22, "points": 7 };
const modifiers = { "maximum": 1, "maximumPerType": 1, "strengthPerFruit": 0.025, "maximumStrength": 0.18, "blendWeight": 0.2, "halfLifeDays": 1, "expiryDays": 8, "minimumStrength": 1e-4 };
const animation = { "breathing": 0.02, "breathingSeconds": 3, "bobPixels": 0.5, "swayRadians": 0.035, "tiltRadians": 0.025, "blinkSeconds": 0.12, "blinkIntervalSeconds": 5, "closedEyeScale": 0.12, "tiredScale": 0.96, "moodThreshold": 0.4, "boundsMargin": 6 };
const cache$1 = { "maximum": 256, "scaleQuantum": 0.125 };
const bench = { "creatures": 30, "iterations": 300, "warmup": 3 };
const appearance = {
  frame,
  slots,
  parts,
  layerOrder,
  conflictRule,
  skillOrder,
  dormant,
  gallery,
  cues,
  selection,
  palette,
  proportions,
  pattern,
  modifiers,
  animation,
  cache: cache$1,
  bench
};
const friendBond = 40;
const closeFriendBond = 70;
const dislikedBond = -30;
const rivalThreshold = 40;
const mateBondThreshold = 50;
const bondBounds = [-100, 100];
const maximumRelationships = 240;
const relationshipsPerCreature = 16;
const historyLimit$1 = 3;
const decayGraceDays = 1;
const bondDecayDays = 30;
const rivalryDecayDays = 10;
const maintenanceTicks = 60;
const pruneStrength = 0.5;
const pruneFamiliarity = 0.06;
const initialFounderBond = 15;
const newbornParentBond = 25;
const newbornParentFamiliarity = 0.5;
const newbornSiblingBond = 10;
const radiusTiles = 12;
const gridTiles = 6;
const targetLimit = 4;
const scanLimit = 16;
const targetIntervalTicks = 30;
const targetLonelinessWeight = 0.25;
const targetDistanceScale = 24;
const inviteMinimumUtility = 0.15;
const inviteCurrentUtilityMargin = 0.05;
const proximityTiles = 2;
const travelTimeoutTicks = 60;
const comfortGentleness = 0.5;
const comfortStressMinimum = 20;
const comfortRecipientEffects = { "hunger": 0, "fatigue": 0, "boredom": 0, "loneliness": -12, "stress": -12 };
const rudePlayBaseChance = 0.12;
const rudePlayTraitChance = 0.18;
const positiveScaleBase = 0.75;
const positiveSociabilityWeight = 0.25;
const affinityScaleBase = 0.75;
const affinityScaleWeight = 0.25;
const outcomes = { "friendlyPlay": { "bond": 6, "rivalry": -0.5, "familiarity": 0.05, "mateBond": 0, "valence": [0.08, 0.08], "stress": [0, 0] }, "rudePlay": { "bond": -8, "rivalry": 6, "familiarity": 0, "mateBond": 0, "valence": [0, -0.12], "stress": [0, 8] }, "comfort": { "bond": 4, "rivalry": -1, "familiarity": 0.03, "mateBond": 0, "valence": [0, 0.1], "stress": [0, 0] }, "court": { "bond": 8, "rivalry": -2, "familiarity": 0.1, "mateBond": 25, "valence": [0, 0], "stress": [0, 0] }, "pair": { "bond": 4, "rivalry": -1, "familiarity": 0.03, "mateBond": 0, "valence": [0, 0], "stress": [0, 0] }, "avoid": { "bond": 0, "rivalry": 0, "familiarity": 0, "mateBond": 0, "valence": [0, 0], "stress": [0, 0] } };
const contest = { "rivalry": 4, "lowRivalry": 4, "competitivenessMinimum": 0.5, "bond": 2, "familiarity": 0.05, "winnerValence": 0.1, "otherValence": 0.02, "cooldownTicks": 120, "skillOffset": 5, "conditionBase": 0.55, "conditionWeight": 0.45, "primaryWeight": 0.85, "staminaWeight": 0.15, "noiseAmplitude": 0.08, "tieEpsilon": 1e-9, "aptitudeBands": [0.4, 0.6], "rivalLossBond": -6, "friendLossBond": 0 };
const rivalry = { "skillGap": 12, "utilityBoost": 0.1, "xpBoost": 0.1, "dailyExtraXpCap": 12 };
const mateAffinityWeight = 0.2;
const contestAffinityWeights = [0.5, 0.5];
const rudeGentlenessStep = -5e-3;
const rudeRecipientBoldnessStep = -3e-3;
const avoidRadiusTiles = 4;
const avoidDistanceTiles = 3;
const mourning = { "enabled": true, "durationTicks": 240 };
const overlays = { "visibility": 20, "maximumLineWidth": 5, "friendly": "#587c69", "hostile": "#b97552", "selected": "#c3974b", "effectTicks": 12 };
const pacing = { "earlyAdultTicks": 10800, "positiveShare": [0.05, 0.995], "minimumFriendships": 1, "minimumRivalries": 1, "seeds": [271828, 314159, 161803], "ticks": 3e5 };
const learningFriendly = 0.2;
const learningRude = -0.4;
const report$2 = { "affinityBins": [-100, -50, -30, 0, 40, 70, 100] };
const targetBondWeight = 0.15;
const social = {
  friendBond,
  closeFriendBond,
  dislikedBond,
  rivalThreshold,
  mateBondThreshold,
  bondBounds,
  maximumRelationships,
  relationshipsPerCreature,
  historyLimit: historyLimit$1,
  decayGraceDays,
  bondDecayDays,
  rivalryDecayDays,
  maintenanceTicks,
  pruneStrength,
  pruneFamiliarity,
  initialFounderBond,
  newbornParentBond,
  newbornParentFamiliarity,
  newbornSiblingBond,
  radiusTiles,
  gridTiles,
  targetLimit,
  scanLimit,
  targetIntervalTicks,
  targetLonelinessWeight,
  targetDistanceScale,
  inviteMinimumUtility,
  inviteCurrentUtilityMargin,
  proximityTiles,
  travelTimeoutTicks,
  comfortGentleness,
  comfortStressMinimum,
  comfortRecipientEffects,
  rudePlayBaseChance,
  rudePlayTraitChance,
  positiveScaleBase,
  positiveSociabilityWeight,
  affinityScaleBase,
  affinityScaleWeight,
  outcomes,
  contest,
  rivalry,
  mateAffinityWeight,
  contestAffinityWeights,
  rudeGentlenessStep,
  rudeRecipientBoldnessStep,
  avoidRadiusTiles,
  avoidDistanceTiles,
  mourning,
  overlays,
  pacing,
  learningFriendly,
  learningRude,
  report: report$2,
  targetBondWeight
};
const formats = [{ "id": "dash", "name": "Skill dash", "rounds": 1, "aggregation": "single", "skills": ["run", "swim", "fly", "climb", "strength", "stamina"] }, { "id": "circuit", "name": "Three-leg circuit", "rounds": 3, "aggregation": "harmonic", "skills": ["run", "swim", "fly", "climb", "strength", "stamina"] }, { "id": "power", "name": "Power trial", "rounds": 3, "aggregation": "mean", "skills": ["strength", "stamina"] }];
const entry = { "allowedStages": ["juvenile", "adult", "elder"], "levels": {}, "maximumEntrants": 8, "needMaximum": 60, "stressMaximum": 60, "minimumMood": -0.25, "relatedEntrantsAllowed": true };
const minimumEntrants = 2;
const maximumEntrants = 8;
const maximumConcurrent = 1;
const entryWindowTicks = 60;
const defaultStartDelay = 90;
const minimumStartDelay = 1;
const maximumStartDelay = 12e3;
const durationTicks = 90;
const skillCooldownTicks = 1200;
const historyLimit = 200;
const elderRemainingMinimumTicks = 120;
const requiredLevels = { "swim": 10, "fly": 25 };
const venue = { "position": { "x": 24, "y": 19 }, "width": 3, "height": 2, "places": [{ "x": 24.5, "y": 18.5 }, { "x": 25.5, "y": 18.5 }, { "x": 26.5, "y": 18.5 }, { "x": 27.5, "y": 19.5 }, { "x": 27.5, "y": 20.5 }, { "x": 26.5, "y": 21.5 }, { "x": 25.5, "y": 21.5 }, { "x": 24.5, "y": 21.5 }], "arrivalTolerance": 1e-3, "color": "#735da8", "resultTicks": 120 };
const workEffects = { "hunger": 0, "fatigue": 6, "boredom": -15, "loneliness": -15, "stress": 0 };
const stakesMultiplier = 1;
const podiumPlaces = 3;
const autoCompetitions = false;
const autoCadenceTicks = 7500;
const autoSkills = ["run", "climb", "strength", "stamina"];
const autoFormats = ["dash", "circuit", "power"];
const brain = { "interest": 0.4, "skillWeight": 0.5, "aptitudeWeight": 0.5, "moodWeight": 0.5, "rivalryWeight": 1, "readinessReserve": 5 };
const report$1 = { "levelBands": [10, 25, 45, 70], "aptitudeBands": [0.4, 0.6], "minimumFillRate": 0.65, "maximumDropShare": 0.5, "seeds": [271828, 314159, 161803], "stabilityTicks": 5e5 };
const competitions = {
  formats,
  entry,
  minimumEntrants,
  maximumEntrants,
  maximumConcurrent,
  entryWindowTicks,
  defaultStartDelay,
  minimumStartDelay,
  maximumStartDelay,
  durationTicks,
  skillCooldownTicks,
  historyLimit,
  elderRemainingMinimumTicks,
  requiredLevels,
  venue,
  workEffects,
  stakesMultiplier,
  podiumPlaces,
  autoCompetitions,
  autoCadenceTicks,
  autoSkills,
  autoFormats,
  brain,
  report: report$1
};
const maximumRankedPrizes = 3;
const maximumFruitPerPrize = 3;
const stackCapacity = 999;
const looseCapacity = 80;
const deliveryWindowTicks = 300;
const trophyLimit = 200;
const xpPeriodTicks = 1200;
const xpPerPeriodCap = 120;
const confidenceBonus = 0.03;
const confidenceDays = 1;
const rankValence = [0.2, 0.1, 0.1];
const otherValence = 0.03;
const starter = { "fruit": { "sunapple": 0, "dewberry": 0, "cloudplum": 0, "vinefig": 0, "stonepear": 0, "ambermelon": 0, "moonpeach": 0, "sparkcherry": 0, "prismpear": 4, "spiralfruit": 4 }, "seeds": { "sunapple": 2, "dewberry": 2, "cloudplum": 2, "vinefig": 2, "stonepear": 2, "ambermelon": 2, "moonpeach": 2, "sparkcherry": 2, "prismpear": 1, "spiralfruit": 1 }, "items": { "nest": 0, "bed": 0, "track": 0, "wind_perch": 0, "climbing_frame": 0, "push_stone": 0, "trail_marker": 0, "toy": 0, "competition_pad": 0, "lantern": 0 }, "cosmetics": { "ribbon": 3, "leaf_crown": 0, "star_pin": 0 } };
const cache = { "fruit": ["prismpear", "spiralfruit"], "fruitQuantity": 2, "seedQuantity": 1, "cosmetics": ["ribbon", "leaf_crown", "star_pin"], "cosmeticQuantity": 1 };
const autoPrizes = false;
const auto = [{ "placements": [{ "rank": 1, "kind": "fruit", "id": "prismpear", "quantity": 1 }, { "rank": 2, "kind": "fruit", "id": "spiralfruit", "quantity": 1 }, { "rank": 3, "kind": "cosmetic", "id": "ribbon", "quantity": 1 }] }, { "placements": [{ "rank": 1, "kind": "cosmetic", "id": "leaf_crown", "quantity": 1 }, { "rank": 2, "kind": "fruit", "id": "prismpear", "quantity": 1 }, { "rank": 3, "kind": "seed", "id": "spiralfruit", "quantity": 1 }] }, { "placements": [{ "rank": 1, "kind": "cosmetic", "id": "star_pin", "quantity": 1 }, { "rank": 2, "kind": "fruit", "id": "spiralfruit", "quantity": 1 }, { "rank": 3, "kind": "seed", "id": "prismpear", "quantity": 1 }] }];
const report = { "maximumWinShare": 0.35 };
const rareSourceReplacement = { "prismpear": "sunapple", "spiralfruit": "vinefig" };
const prizes = {
  maximumRankedPrizes,
  maximumFruitPerPrize,
  stackCapacity,
  looseCapacity,
  deliveryWindowTicks,
  trophyLimit,
  xpPeriodTicks,
  xpPerPeriodCap,
  confidenceBonus,
  confidenceDays,
  rankValence,
  otherValence,
  starter,
  cache,
  autoPrizes,
  auto,
  report,
  rareSourceReplacement
};
const nest = { "name": "Extra nest", "width": 2, "height": 2, "skill": null, "effect": "courtship" };
const bed = { "name": "Bed", "width": 1, "height": 1, "skill": null, "effect": "sleep" };
const track = { "name": "Track marker", "width": 1, "height": 1, "skill": "run", "effect": "training" };
const wind_perch = { "name": "Wind perch", "width": 1, "height": 1, "skill": "fly", "effect": "training" };
const climbing_frame = { "name": "Climbing frame", "width": 2, "height": 1, "skill": "climb", "effect": "training" };
const push_stone = { "name": "Push stone", "width": 1, "height": 1, "skill": "strength", "effect": "training" };
const trail_marker = { "name": "Trail marker", "width": 1, "height": 1, "skill": "stamina", "effect": "training" };
const toy = { "name": "Toy", "width": 1, "height": 1, "skill": null, "effect": "play" };
const competition_pad = { "name": "Competition pad", "width": 3, "height": 2, "skill": null, "effect": "competition" };
const lantern = { "name": "Cosmetic lantern", "width": 1, "height": 1, "skill": null, "effect": "visual" };
const items = {
  nest,
  bed,
  track,
  wind_perch,
  climbing_frame,
  push_stone,
  trail_marker,
  toy,
  competition_pad,
  lantern
};
const needKeys = ["hunger", "fatigue", "boredom", "loneliness", "stress"];
const actionKinds = ["enterCompetition", "attendCompetition", "court", "play", "comfort", "contest", "avoid", "eat", "graze", "sleep", "wander", "idle", "train_run", "train_swim", "train_fly", "train_climb", "train_strength", "train_stamina"];
const skillKeys = ["run", "swim", "fly", "climb", "strength", "stamina"];
const fruitKinds = ["sunapple", "dewberry", "cloudplum", "vinefig", "stonepear", "ambermelon", "moonpeach", "sparkcherry", "prismpear", "spiralfruit"];
const tasteKeys = ["sweet", "tart", "earthy"];
const lifeStages = ["egg", "baby", "juvenile", "adult", "elder", "cocoon"];
function enumValue(value, allowed) {
  const match = allowed.find((entry2) => entry2 === value);
  if (match === void 0) throw new Error(`Unknown config enum: ${value}`);
  return match;
}
function freeze(value) {
  if (value !== null && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
const speedEnum = [0, 1, 10, 100, 1e3];
const config = freeze({
  ...balance,
  health,
  presentation,
  names,
  robustness,
  offline,
  actions,
  fruit,
  breeding,
  prizes,
  items,
  competitions,
  social,
  appearance,
  genes,
  lifecycle: {
    ...lifecycle,
    firstLife: lifecycle.firstLife.map((s) => enumValue(s, lifeStages)),
    rebornLife: lifecycle.rebornLife.map((s) => enumValue(s, lifeStages))
  },
  genetics: { ...balance.genetics, mutationStep: [balance.genetics.mutationStep[0], balance.genetics.mutationStep[1]] },
  skillCatalog: Object.fromEntries(skillKeys.map((key2) => [key2, {
    ...skills[key2],
    id: key2,
    trainingActivity: enumValue(skills[key2].trainingActivity, actionKinds)
  }])),
  training: { ...training, defaults: training.defaults.map((entry2) => ({ ...entry2, skill: enumValue(entry2.skill, skillKeys) })) },
  food: { ...balance.food, valenceBounds: [balance.food.valenceBounds[0], balance.food.valenceBounds[1]] },
  sources: { defaults: sources.defaults.map((entry2) => ({ ...entry2, kind: enumValue(entry2.kind, fruitKinds) })) },
  clock: { ...balance.clock, foregroundSpeeds: balance.clock.foregroundSpeeds.map((value) => enumValue(value, speedEnum)) },
  initial: { ...balance.initial, fruit: balance.initial.fruit.map((entry2) => ({ ...entry2, kind: enumValue(entry2.kind, fruitKinds) })) }
});
const chromosomes = [...new Set(config.genes.map((locus) => locus.chromosome))];
const loci = config.genes.map((definition) => ({
  definition,
  index: config.genes.filter((l) => l.chromosome === definition.chromosome).indexOf(definition)
}));
function locusFor(group, trait) {
  const locus = loci.find((l) => l.definition.traitGroup === group && l.definition.trait === trait);
  if (!locus) throw new Error(`Unknown genetic trait ${group}.${trait}.`);
  return locus;
}
function locusAlleles(genome, locus) {
  const chromosome = genome[locus.definition.chromosome];
  return [chromosome.haplotypes[0][locus.index], chromosome.haplotypes[1][locus.index]];
}
function chromosomeLoci(chromosome) {
  return config.genes.filter((l) => l.chromosome === chromosome);
}
function expressLocus(a, b, locus) {
  if (locus.dominanceType === "categorical") {
    if (a.d !== b.d) return a.d > b.d ? a.v : b.v;
    const first = locus.options.find((o) => o.value === a.v || o.value === b.v);
    return first.value;
  }
  if (typeof a.v !== "number" || typeof b.v !== "number") throw new Error("Quantitative locus needs numeric alleles.");
  const dominant = config.genetics.dominantWeight;
  const weight = a.d === b.d ? 1 / 2 : a.d > b.d ? dominant : 1 - dominant;
  const [min, max] = locus.alleleRange, [outMin, outMax] = locus.traitRange;
  if (locus.dominanceType === "circular") {
    const period = max - min + 1;
    const angleA = (a.v - min) / period * 2 * Math.PI, angleB = (b.v - min) / period * 2 * Math.PI;
    const x = weight * Math.cos(angleA) + (1 - weight) * Math.cos(angleB);
    const y = weight * Math.sin(angleA) + (1 - weight) * Math.sin(angleB);
    const fraction = Math.hypot(x, y) < config.genetics.circularEpsilon ? Math.min(a.v, b.v) / period : (Math.atan2(y, x) / (2 * Math.PI) % 1 + 1) % 1;
    return outMin + fraction * (outMax - outMin);
  }
  const q = (weight * (a.v - min) + (1 - weight) * (b.v - min)) / (max - min);
  return outMin + q * (outMax - outMin);
}
function expressTrait(genome, group, trait) {
  const locus = locusFor(group, trait), [a, b] = locusAlleles(genome, locus);
  return expressLocus(a, b, locus.definition);
}
function derivePhenotype(genome) {
  const result = { aptitudes: {}, tasteBias: {}, fruitTaste: {}, personality: {}, palette: {}, body: {} };
  for (const locus of loci) {
    const [a, b] = locusAlleles(genome, locus);
    result[locus.definition.traitGroup][locus.definition.trait] = expressLocus(a, b, locus.definition);
  }
  const taste = result.tasteBias;
  const sum = tasteKeys.reduce((n, key2) => n + taste[key2], 0);
  result.fruitTaste = Object.fromEntries(fruitKinds.map((kind) => [
    kind,
    2 * tasteKeys.reduce((n, key2) => n + (sum > 0 ? taste[key2] / sum : 1 / tasteKeys.length) * config.fruit[kind].taste[key2], 0) - 1
  ]));
  return result;
}
function skillAptitude(c, skill) {
  return expressTrait(c.genome, "aptitudes", skill);
}
function zeroPersonalityDrift() {
  return Object.fromEntries(config.genes.filter((g) => g.traitGroup === "personality").map((g) => [g.trait, 0]));
}
function setTraitValue(input, group, trait, value) {
  const { definition: d, index } = locusFor(group, trait);
  if (d.dominanceType !== "partial" || !Number.isFinite(value) || value < d.traitRange[0] || value > d.traitRange[1])
    throw new Error("Trait edit requires an in-range quantitative value.");
  const [min, max] = d.alleleRange, [outMin, outMax] = d.traitRange;
  const total = Math.round((value - outMin) / (outMax - outMin) * (max - min) * 2);
  return { ...input, [d.chromosome]: { haplotypes: input[d.chromosome].haplotypes.map((h, i) => h.map((a, j) => j === index ? { v: min + (i === 0 ? Math.floor(total / 2) : Math.ceil(total / 2)), d: 1 } : { ...a })) } };
}
function trainingSkill(kind) {
  return skillKeys.find((skill) => config.skillCatalog[skill].trainingActivity === kind) ?? null;
}
function skillCap(creature, skill) {
  return Math.min(
    config.skillCatalog[skill].levelCap,
    config.lifecycle.stages[creature.stage].skillCap,
    Math.floor(config.skills.capBase + config.skills.capRange * skillAptitude(creature, skill))
  );
}
function xpAtLevel(level, skill) {
  const { xpLinear, xpQuadratic } = config.skillCatalog[skill];
  return xpLinear * level + xpQuadratic * level * level;
}
function skillLevel(creature, skill) {
  const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[skill];
  return Math.min(skillCap(creature, skill), Math.floor((-a + Math.sqrt(a * a + 4 * b * creature.xp[skill])) / (2 * b)));
}
function emptySkillExperience() {
  return {
    practiceTicks: zeroSkills(),
    trainingTicks: zeroSkills(),
    activityPreferences: Object.fromEntries(skillKeys.map((s) => [s, { learnedMean: 0, samples: 0 }])),
    skillBonuses: {},
    lastLevelUp: null
  };
}
function zeroSkills() {
  return Object.fromEntries(skillKeys.map((skill) => [skill, 0]));
}
const sinks = /* @__PURE__ */ new WeakMap();
function emitJournal(before, after, event2) {
  const sink = sinks.get(before);
  if (sink) {
    sink.push(JSON.parse(JSON.stringify(event2)));
    sinks.set(after, sink);
  }
}
function newLineage(c, tick, parentIds = null) {
  return {
    awards: JSON.parse(JSON.stringify(c.awards)),
    id: c.id,
    organismId: c.organismId,
    displayName: c.displayName,
    parentIds,
    birthTick: tick,
    deathTick: null,
    finalStage: null,
    ageAtDeath: null,
    topSkill: null,
    endReason: null,
    origin: "founder",
    generation: 0,
    birthAptitudes: derivePhenotype(c.genome).aptitudes,
    mutations: []
  };
}
function recordLifeEvent(state, event2) {
  const id = `e_${String(state.counters.event).padStart(8, "0")}`;
  state.counters.event += 1;
  const emitted = { ...event2, id, tick: state.clock.tick };
  const previous = state.events;
  state.events = [...previous, emitted].slice(-config.lifecycle.eventLogLimit);
  emitJournal(previous, state.events, emitted);
}
const prizeGroup = (kind) => ({ fruit: "fruit", seed: "seeds", item: "items", cosmetic: "cosmetics" })[kind];
const prizeKey = (p) => `${p.kind}:${p.id}`;
function emptyAwards() {
  return { owned: [], equipped: null, trophies: [], wins: 0, bestPerformance: {}, confidenceUntilTick: 0, xpPeriod: 0, xpThisPeriod: 0, totalXp: 0 };
}
function starterInventory() {
  return JSON.parse(JSON.stringify(config.prizes.starter));
}
function initialPrizeLedger() {
  const supplied = {};
  for (const [group, counts] of Object.entries(config.prizes.starter)) for (const [id, n] of Object.entries(counts)) supplied[`${{ fruit: "fruit", seeds: "seed", items: "item", cosmetics: "cosmetic" }[group]}:${id}`] = n;
  return { supplied, eaten: {}, overflow: {}, escrowed: 0, delivered: 0, refunded: 0, returned: 0, rareFruitEaten: 0 };
}
function prizeBalances(s) {
  const balances = {};
  const add = (key2, n) => balances[key2] = (balances[key2] ?? 0) + n;
  for (const [group, values] of Object.entries(s.inventory)) for (const [id, n] of Object.entries(values)) add(`${{ fruit: "fruit", seeds: "seed", items: "item", cosmetics: "cosmetic" }[group]}:${id}`, n);
  for (const e of s.competitions) if (e.escrowState === "held") for (const p of e.prize.placements) add(prizeKey(p), p.quantity);
  for (const f of s.world.looseFruit) if (f.prize) add(`fruit:${f.kind}`, 1);
  const owned = /* @__PURE__ */ new Map();
  for (const c of [...s.lineage, ...s.creatures]) {
    let set = owned.get(c.organismId);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      owned.set(c.organismId, set);
    }
    for (const id of c.awards.owned) set.add(id);
  }
  for (const set of owned.values()) for (const id of set) add(`cosmetic:${id}`, 1);
  for (const [id, n] of Object.entries(s.archive?.cosmetics ?? {})) add(`cosmetic:${id}`, n);
  for (const [key2, n] of Object.entries(s.prizeLedger.eaten)) add(key2, n);
  return balances;
}
function prizeReason(prize) {
  if (prize === null || prize === void 0) return null;
  if (typeof prize !== "object" || Array.isArray(prize) || Object.keys(prize).join() !== "placements") return "Invalid prize table.";
  const rows = prize.placements;
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > config.prizes.maximumRankedPrizes) return "Choose one to three ranked prizes.";
  const ranks = /* @__PURE__ */ new Set();
  let previous = 0;
  for (const p of rows) {
    if (!p || typeof p !== "object" || Object.keys(p).sort().join() !== "id,kind,quantity,rank") return "Invalid prize fields.";
    if (!Number.isInteger(p.rank) || p.rank < 1 || p.rank > config.prizes.maximumRankedPrizes || ranks.has(p.rank) || p.rank <= previous) return "Use unique ascending prize placements from first to third.";
    ranks.add(p.rank);
    previous = p.rank;
    const valid = p.kind === "fruit" ? fruitKinds.includes(p.id) && config.fruit[p.id].rare : p.kind === "seed" ? fruitKinds.includes(p.id) : p.kind === "item" ? Object.hasOwn(config.items, p.id) : p.kind === "cosmetic" ? Object.hasOwn(config.prizes.starter.cosmetics, p.id) : false;
    if (!valid) return "Unknown prize type or id (fruit must be rare).";
    if (!Number.isInteger(p.quantity) || p.quantity < 1 || p.quantity > (p.kind === "fruit" ? config.prizes.maximumFruitPerPrize : 1)) return "Fruit prizes allow 1–3; other prizes require quantity 1.";
  }
  return null;
}
function requireValue(condition, message) {
  if (!condition) throw new Error(`Invalid save: ${message}.`);
}
function integer(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;
}
function finite(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
function object$1(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function exactKeys(value, keys2) {
  return object$1(value) && Object.keys(value).length === keys2.length && keys2.every((key2) => Object.hasOwn(value, key2));
}
function allFinite(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(allFinite);
  if (object$1(value)) return Object.values(value).every(allFinite);
  return true;
}
function validateAwards(a, s) {
  requireValue(exactKeys(a, ["owned", "equipped", "trophies", "wins", "bestPerformance", "confidenceUntilTick", "xpPeriod", "xpThisPeriod", "totalXp"]) && Array.isArray(a.owned) && new Set(a.owned).size === a.owned.length && a.owned.every((id) => Object.hasOwn(config.prizes.starter.cosmetics, id)) && (a.equipped === null || a.owned.includes(a.equipped)), "cosmetic ownership");
  requireValue(integer(a.wins) && integer(a.confidenceUntilTick, 0, s.clock.tick + config.prizes.confidenceDays * config.clock.dayTicks) && integer(a.xpPeriod, 0, Math.floor(s.clock.tick / config.prizes.xpPeriodTicks)) && finite(a.xpThisPeriod, 0, config.prizes.xpPerPeriodCap) && finite(a.totalXp, a.xpThisPeriod, Number.MAX_SAFE_INTEGER), "bounded competition effects");
  requireValue(object$1(a.bestPerformance) && Object.entries(a.bestPerformance).every(([k, v]) => skillKeys.includes(k) && finite(v, 0, Number.MAX_SAFE_INTEGER)), "best performance");
  requireValue(Array.isArray(a.trophies) && a.trophies.length <= config.prizes.trophyLimit && new Set(a.trophies.map((t) => t.competitionId)).size === a.trophies.length, "trophy shelf");
  for (const t of a.trophies) requireValue(exactKeys(t, ["competitionId", "skills", "placement", "tick"]) && /^cpt_[0-9]{8}$/.test(t.competitionId) && integer(Number(t.competitionId.slice(4)), 1, s.counters.competition - 1) && Array.isArray(t.skills) && t.skills.length >= 1 && t.skills.every((k) => skillKeys.includes(k)) && integer(t.placement, 1, config.competitions.maximumEntrants) && integer(t.tick, 0, s.clock.tick), "trophy record");
}
function validatePrizes(s) {
  const l = s.prizeLedger;
  requireValue(exactKeys(l, ["supplied", "eaten", "overflow", "escrowed", "delivered", "refunded", "returned", "rareFruitEaten"]), "prize ledger fields");
  const known = new Set(Object.entries(s.inventory).flatMap(([g, values]) => Object.keys(values).map((id) => `${{ fruit: "fruit", seeds: "seed", items: "item", cosmetics: "cosmetic" }[g]}:${id}`)));
  for (const values of [l.supplied, l.eaten, l.overflow]) requireValue(object$1(values) && Object.entries(values).every(([k, v]) => known.has(k) && integer(v)), "prize supply counters");
  for (const k of ["escrowed", "delivered", "refunded", "returned", "rareFruitEaten"]) requireValue(integer(l[k]), "prize transfer counts");
  for (const group of Object.values(s.inventory)) requireValue(Object.values(group).every((n) => integer(n, 0, config.prizes.stackCapacity)), "inventory stack caps");
  requireValue(s.world.lastCacheDay === Math.floor(s.clock.tick / config.clock.dayTicks), "daily supply deadline");
  for (const c of s.creatures) {
    validateAwards(c.awards, s);
    requireValue(c.awards.wins === c.competition.stats.wins, "win ledger");
  }
  for (const c of s.lineage) validateAwards(c.awards, s);
  for (const f of s.world.looseFruit) if (f.prize) requireValue(config.fruit[f.kind].rare && exactKeys(f.prize, ["competitionId", "ownerId", "exclusiveUntilTick"]) && /^cpt_[0-9]{8}$/.test(f.prize.competitionId) && integer(Number(f.prize.competitionId.slice(4)), 1, s.counters.competition - 1) && integer(f.prize.exclusiveUntilTick, f.droppedTick, f.droppedTick + config.prizes.deliveryWindowTicks) && (f.prize.ownerId === null || s.creatures.some((c) => c.id === f.prize.ownerId) && s.clock.tick < f.prize.exclusiveUntilTick), "prize fruit handoff");
  requireValue(s.world.plants.every((p) => !config.fruit[p.kind].rare), "rare fruit has no habitat source");
  for (const e of [...s.competitions, ...s.competitionHistory]) {
    requireValue(!prizeReason(e.prize) && typeof e.awarded === "boolean" && Array.isArray(e.deliveries), "prize event fields");
    requireValue(e.awarded === (e.status === "resolved") && e.escrowState === (e.prize ? e.status === "resolved" ? "released" : e.status === "cancelled" ? "refunded" : "held" : "none"), "prize settlement status");
    requireValue(e.deliveries.length === (e.awarded ? e.prize?.placements.length ?? 0 : 0), "prize delivery count");
    for (const [i, d] of e.deliveries.entries()) {
      const p = e.prize.placements[i], { rank, ...prize } = p;
      requireValue(exactKeys(d, ["rank", "creatureId", "prize", "destination", "reason"]) && d.rank === rank && JSON.stringify(d.prize) === JSON.stringify(prize) && ["fruit", "cosmetic", "donated", "inventory"].includes(d.destination) && (d.reason === null || typeof d.reason === "string") && d.creatureId === (e.results.placements.find((p2) => p2.rank === rank)?.id ?? null), "prize delivery record");
      if (d.destination === "cosmetic") requireValue(p.kind === "cosmetic", "cosmetic delivery type");
      if (d.destination === "fruit") requireValue(p.kind === "fruit", "fruit delivery type");
      if (d.destination === "donated") requireValue(p.kind === "item" || p.kind === "seed", "donated delivery type");
      requireValue(Number.isSafeInteger(s.inventory[prizeGroup(p.kind)][p.id]), "known prize stack");
    }
  }
  const balances = prizeBalances(s);
  for (const key2 of known) requireValue((balances[key2] ?? 0) === (l.supplied[key2] ?? 0), `prize conservation ${key2}`);
  requireValue(l.rareFruitEaten === Object.values(l.eaten).reduce((n, v) => n + v, 0), "rare meals total");
}
function lifePath(lifeIndex = 0) {
  return lifeIndex === 0 ? config.lifecycle.firstLife : config.lifecycle.rebornLife;
}
function stageStartAge(stage, lifeIndex = 0) {
  let age = 0;
  for (const candidate of lifePath(lifeIndex)) {
    if (candidate === stage) return age;
    age += config.lifecycle.stages[candidate].durationTicks;
  }
  throw new Error(`${stage} is not a stage in this life.`);
}
function lifespan(lifeIndex = 0) {
  return lifePath(lifeIndex).reduce((sum, stage) => sum + config.lifecycle.stages[stage].durationTicks, 0);
}
function stageAtAge(age, lifeIndex = 0) {
  if (!Number.isSafeInteger(age) || age < 0) throw new Error("Age must be nonnegative whole ticks.");
  let end = 0;
  for (const stage of lifePath(lifeIndex)) {
    end += config.lifecycle.stages[stage].durationTicks;
    if (age < end) return stage;
  }
  return null;
}
function isArchivedAncestor(id) {
  return /^archived:[oc]_[0-9]{8}:g[0-9]+$/.test(id);
}
function archivedGeneration(id) {
  return Number(id.split(":g")[1]);
}
function permittedKinship(state, a, b) {
  if (a === b) return false;
  const nodes = new Map(state.organisms.map((o) => [o.id, o]));
  function ancestors(id, depth = Infinity, found = /* @__PURE__ */ new Set()) {
    if (isArchivedAncestor(id)) return found;
    const node = nodes.get(id);
    if (!node) throw new Error("Missing ancestor data.");
    if (depth <= 0) return found;
    for (const parent of node.parents) if (depth < Infinity || !found.has(parent)) {
      found.add(parent);
      ancestors(parent, depth - 1, found);
    }
    return found;
  }
  if (ancestors(a).has(b) || ancestors(b).has(a)) return false;
  const shallowA = ancestors(a, 2), shallowB = ancestors(b, 2);
  return ![...shallowA].some((id) => shallowB.has(id));
}
function rulesReason(r, settings = config) {
  const s = settings.competitions;
  if (!r || !Array.isArray(r.allowedStages) || !r.allowedStages.length || new Set(r.allowedStages).size !== r.allowedStages.length || r.allowedStages.some((stage) => !lifeStages.includes(stage) || !s.entry.allowedStages.includes(stage))) return "Invalid allowed stages.";
  if (Object.keys(r).length !== Object.keys(s.entry).length || Object.keys(r).some((key2) => !Object.hasOwn(s.entry, key2))) return "Invalid entry rules.";
  if (!Number.isInteger(r.maximumEntrants) || r.maximumEntrants < s.minimumEntrants || r.maximumEntrants > s.maximumEntrants) return "Invalid entrant limit.";
  if (!Number.isFinite(r.needMaximum) || r.needMaximum < 0 || r.needMaximum > s.entry.needMaximum) return "Invalid needs threshold.";
  if (!Number.isFinite(r.stressMaximum) || r.stressMaximum < 0 || r.stressMaximum > s.entry.stressMaximum) return "Invalid stress threshold.";
  if (!Number.isFinite(r.minimumMood) || r.minimumMood < s.entry.minimumMood || r.minimumMood > 1) return "Invalid mood threshold.";
  if (typeof r.relatedEntrantsAllowed !== "boolean" || !r.levels || typeof r.levels !== "object" || Array.isArray(r.levels)) return "Invalid entry rules.";
  for (const [skill, range] of Object.entries(r.levels)) if (!skillKeys.includes(skill) || !range || !Number.isInteger(range.minimum) || !Number.isInteger(range.maximum) || range.minimum < 0 || range.maximum > settings.skillCatalog[skill].levelCap || range.minimum > range.maximum || Object.keys(range).some((key2) => key2 !== "minimum" && key2 !== "maximum")) return "Invalid skill band.";
  return null;
}
function normalizeSeed(seed) {
  if (!Number.isFinite(seed)) throw new Error("Seed must be finite.");
  return Math.trunc(seed) >>> 0 || 1;
}
function nextUint(state) {
  let x = state >>> 0;
  if (x === 0) throw new Error("A saved RNG state must be a nonzero uint32.");
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}
function uniform(state) {
  const next = nextUint(state);
  return { state: next, value: next / 4294967296 };
}
function resolveContest(participants, skill, rng, settings) {
  if (participants.length < 2 || new Set(participants.map((p) => p.id)).size !== participants.length) throw new Error("A contest needs distinct participants.");
  const s = settings.social.contest, startRng = rng;
  const ranking = [...participants].sort((a, b) => a.id.localeCompare(b.id)).map((p) => {
    const condition = (s.conditionBase + s.conditionWeight * p.wellbeing) * p.stagePerformance * (1 + (p.confidence ?? 0));
    const effective = (s.skillOffset + p.level) * condition, stamina2 = (s.skillOffset + p.staminaLevel) * condition;
    const base = skill === "stamina" ? effective : s.primaryWeight * effective + s.staminaWeight * stamina2;
    const first = uniform(rng), second = uniform(first.state);
    rng = second.state;
    return { ...p, rank: 0, base, score: base * (1 + s.noiseAmplitude * (first.value + second.value - 1)) };
  }).sort((a, b) => (Math.abs(b.score - a.score) >= s.tieEpsilon ? b.score - a.score : 0) || (Math.abs(b.base - a.base) >= s.tieEpsilon ? b.base - a.base : 0) || a.id.localeCompare(b.id));
  ranking.forEach((p, i) => {
    p.rank = i + 1;
  });
  const margin = Math.max(0, ranking[0].score - ranking[1].score), winnerId = margin < s.tieEpsilon ? null : ranking[0].id;
  return { skill, ranking, winnerId, margin, startRng, rng, effects: ranking.map((p) => ({ id: p.id, valence: p.id === winnerId ? s.winnerValence : s.otherValence })) };
}
function resolveCompetition(event2, entrants, rng, settings) {
  const format = settings.competitions.formats.find((f) => f.id === event2.format);
  if (!format || entrants.length < settings.competitions.minimumEntrants || entrants.length > event2.entryRules.maximumEntrants || new Set(entrants.map((p) => p.id)).size !== entrants.length) throw new Error("Invalid competition entrants or format.");
  const startRng = rng, rounds = [];
  for (let i = 0; i < format.rounds; i++) {
    const skill = event2.format === "circuit" ? event2.skills[i] : event2.skill;
    const result = resolveContest(entrants.map((c) => ({ id: c.id, level: c.levels[skill], staminaLevel: c.levels.stamina, wellbeing: c.wellbeing, stagePerformance: c.stagePerformance, aptitude: c.aptitudes[skill], ...c.confidence === void 0 ? {} : { confidence: c.confidence } })), skill, rng, settings);
    rounds.push(result);
    rng = result.rng;
  }
  const aggregate = (values) => format.aggregation === "harmonic" ? values.length / values.reduce((n, s) => n + 1 / s, 0) : values.reduce((n, s) => n + s, 0) / values.length;
  const placements = entrants.map((c) => ({
    id: c.id,
    rank: 0,
    score: aggregate(rounds.map((r) => r.ranking.find((row) => row.id === c.id).score)),
    base: aggregate(rounds.map((r) => r.ranking.find((row) => row.id === c.id).base)),
    level: event2.skills.reduce((n, k) => n + c.levels[k], 0) / event2.skills.length,
    aptitude: event2.skills.reduce((n, k) => n + c.aptitudes[k], 0) / event2.skills.length
  })).sort((a, b) => (Math.abs(b.score - a.score) >= settings.social.contest.tieEpsilon ? b.score - a.score : 0) || (Math.abs(b.base - a.base) >= settings.social.contest.tieEpsilon ? b.base - a.base : 0) || a.id.localeCompare(b.id));
  placements.forEach((p, i) => p.rank = i + 1);
  return { placements, rounds, startRng, rng, effects: placements.map((c) => ({ id: c.id, valence: rounds.reduce((n, r) => n + r.effects.find((e) => e.id === c.id).valence, 0) / rounds.length })) };
}
function encodeTerrain(terrain) {
  const runs = [];
  for (const code of terrain) {
    const last = runs.at(-1);
    if (last?.[0] === code) last[1] += 1;
    else runs.push([code, 1]);
  }
  return runs;
}
function decodeTerrain(runs) {
  return runs.flatMap(([code, count]) => Array(count).fill(code));
}
function tileIndex(point, width) {
  return Math.floor(point.y) * width + Math.floor(point.x);
}
function tileCenter(index, width) {
  return { x: index % width + 0.5, y: Math.floor(index / width) + 0.5 };
}
function terrainCost(code) {
  const costs = config.world.terrainCosts;
  switch (code) {
    case 0:
      return costs.grass;
    case 1:
      return costs.soil;
    case 2:
      return costs.shallowWalking;
    case 4:
      return costs.rock;
    default:
      return Infinity;
  }
}
function isSafeLand(code) {
  return code === 0 || code === 1 || code === 4;
}
function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
const navigationCache = /* @__PURE__ */ new WeakMap();
function navigationTerrain(world2) {
  const signature = `${world2.width}:` + world2.plants.map((p) => `${p.x},${p.y}`).join(";") + "/" + world2.items.map((i) => `${i.x},${i.y},${i.width},${i.height}`).join(";");
  const cached = navigationCache.get(world2.terrainRle);
  if (cached?.signature === signature) return cached.terrain;
  const terrain = decodeTerrain(world2.terrainRle);
  for (const plant of world2.plants) terrain[plant.y * world2.width + plant.x] = 5;
  for (const item of world2.items) for (let y = item.y; y < item.y + item.height; y++)
    for (let x = item.x; x < item.x + item.width; x++) terrain[y * world2.width + x] = 5;
  navigationCache.set(world2.terrainRle, { signature, terrain });
  return terrain;
}
function plantApproaches(plant, terrain, width, height) {
  return [{ x: plant.x, y: plant.y - 1 }, { x: plant.x - 1, y: plant.y }, { x: plant.x + 1, y: plant.y }, { x: plant.x, y: plant.y + 1 }].filter((p) => p.x >= 0 && p.y >= 0 && p.x < width && p.y < height && Number.isFinite(terrainCost(terrain[p.y * width + p.x]))).map((p) => ({ x: p.x + 0.5, y: p.y + 0.5 }));
}
function withDefaultSources(state) {
  const terrain = [...navigationTerrain(state.world)];
  const width = state.world.width;
  const reserved = new Set(state.world.looseFruit.map((f) => tileIndex(f, width)));
  for (const c of state.creatures) {
    reserved.add(tileIndex(c.position, width));
    if (c.currentAction) {
      reserved.add(tileIndex(c.currentAction.target, width));
      c.currentAction.path.forEach((p) => reserved.add(tileIndex(p, width)));
    }
  }
  const plants = [];
  for (const [offset, definition] of config.sources.defaults.entries()) {
    const locations = terrain.flatMap((code, index) => (code === 0 || code === 1) && !reserved.has(index) ? [index] : []).sort((a, b) => (a % width - definition.x) ** 2 + (Math.floor(a / width) - definition.y) ** 2 - ((b % width - definition.x) ** 2 + (Math.floor(b / width) - definition.y) ** 2) || a - b);
    const location = locations.find((index) => plantApproaches({
      ...definition,
      x: index % width,
      y: Math.floor(index / width)
    }, terrain, width, state.world.height).length > 0);
    if (location === void 0) throw new Error("No safe location for the default fruit sources.");
    terrain[location] = 5;
    reserved.add(location);
    plants.push({
      id: `p_${String(state.counters.plant + offset).padStart(8, "0")}`,
      kind: definition.kind,
      x: location % width,
      y: Math.floor(location / width),
      matureAtTick: state.clock.tick,
      ripe: config.fruit[definition.kind].capacity,
      growthProgress: 0
    });
  }
  return {
    ...state,
    counters: { ...state.counters, plant: state.counters.plant + plants.length },
    world: { ...state.world, plants, terrainRevision: state.world.terrainRevision + 1 }
  };
}
function otherClaims(state, creature) {
  return state.creatures.filter((c) => c.id !== creature.id).flatMap((c) => c.currentAction?.kind === "eat" ? [c.currentAction] : []);
}
function validFoodClaim(state, creature, action) {
  const claims = otherClaims(state, creature);
  if (action.targetPlantId) {
    const plant = state.world.plants.find((p) => p.id === action.targetPlantId);
    return !!plant && action.targetFruitId === null && plant.matureAtTick <= state.clock.tick && plant.ripe > claims.filter((a) => a.targetPlantId === plant.id).length && distance(action.target, { x: plant.x + 0.5, y: plant.y + 0.5 }) === 1 && !claims.some((a) => a.targetPlantId && distance(a.target, action.target) === 0);
  }
  return state.world.looseFruit.some((f) => f.id === action.targetFruitId && (!f.prize?.ownerId || f.prize.ownerId === creature.id) && distance(f, action.target) === 0) && !claims.some((a) => a.targetFruitId === action.targetFruitId);
}
function validateRules(r) {
  requireValue(exactKeys(r, ["allowedStages", "levels", "maximumEntrants", "needMaximum", "stressMaximum", "minimumMood", "relatedEntrantsAllowed"]) && !rulesReason(r), "competition rules");
  for (const range of Object.values(r.levels)) requireValue(range && exactKeys(range, ["minimum", "maximum"]), "competition skill rule");
}
function filtered(result, ids) {
  const present = new Set(ids);
  result.placements = result.placements.filter((p) => present.has(p.id)).map((p, i) => ({ ...p, rank: i + 1 }));
  result.effects = result.effects.filter((p) => present.has(p.id));
  for (const round of result.rounds) {
    round.ranking = round.ranking.filter((p) => present.has(p.id)).map((p, i) => ({ ...p, rank: i + 1 }));
    round.effects = round.effects.filter((p) => present.has(p.id));
    if (round.winnerId && !present.has(round.winnerId)) round.winnerId = null;
    round.margin = round.ranking.length >= 2 ? Math.max(0, round.ranking[0].score - round.ranking[1].score) : 0;
  }
  return result;
}
function validateCompetitions(s) {
  const settings = config.competitions, tick = s.clock.tick, records = new Map(s.lineage.map((l) => [l.id, l])), living = new Map(s.creatures.map((c) => [c.id, c]));
  requireValue(Array.isArray(s.competitions) && s.competitions.length <= settings.maximumConcurrent && Array.isArray(s.competitionHistory) && s.competitionHistory.length <= settings.historyLimit, "competition lists");
  const terrain = navigationTerrain(s.world), locks = /* @__PURE__ */ new Set([...s.sessions.flatMap((e) => e.participants), ...s.social.sessions.flatMap((e) => e.participants)]);
  const ids = /* @__PURE__ */ new Set();
  let previousFinished = -1;
  for (const [history, list] of [[false, s.competitions], [true, s.competitionHistory]]) for (const e of list) {
    requireValue(exactKeys(e, ["id", "skill", "skills", "format", "entryRules", "status", "createdTick", "entryOpenTick", "startTick", "endTick", "finishedTick", "entrantIds", "startedIds", "attendance", "snapshots", "results", "drops", "cancellationReason", "createdBy", "prize", ...s.schemaVersion >= 10 ? ["escrowState", "awarded", "deliveries"] : []]), "competition fields");
    requireValue(typeof e.id === "string" && /^cpt_[0-9]{8}$/.test(e.id) && integer(Number(e.id.slice(4)), 1, s.counters.competition - 1) && !ids.has(e.id), "competition ID");
    ids.add(e.id);
    const format = settings.formats.find((f) => f.id === e.format);
    requireValue(format && skillKeys.includes(e.skill) && format.skills.includes(e.skill) && Array.isArray(e.skills) && e.skills[0] === e.skill && e.skills.length === (e.format === "circuit" ? format.rounds : 1) && new Set(e.skills).size === e.skills.length && e.skills.every((k) => format.skills.includes(k)), "competition format skills");
    validateRules(e.entryRules);
    requireValue(["player", "debug", "auto"].includes(e.createdBy) && (s.schemaVersion >= 10 ? !prizeReason(e.prize) : e.prize === null), "competition reserved data");
    requireValue(integer(e.createdTick, 0, tick) && integer(e.entryOpenTick, e.createdTick + 1) && integer(e.startTick, e.entryOpenTick + 1) && e.endTick === e.startTick + settings.durationTicks, "competition clocks");
    requireValue(history ? ["resolved", "cancelled"].includes(e.status) && integer(e.finishedTick, previousFinished, tick) : ["scheduled", "entryOpen", "running"].includes(e.status) && e.finishedTick === null, "competition status");
    if (history) previousFinished = e.finishedTick;
    if (e.status === "scheduled") requireValue(tick < e.entryOpenTick, "scheduled boundary");
    if (e.status === "entryOpen") requireValue(tick >= e.entryOpenTick && tick < e.startTick, "entry boundary");
    if (e.status === "running") requireValue(tick >= e.startTick && tick < e.endTick, "running boundary");
    if (e.status === "resolved") requireValue(e.finishedTick === e.endTick, "resolved boundary");
    requireValue(Array.isArray(e.entrantIds) && e.entrantIds.length <= e.entryRules.maximumEntrants && new Set(e.entrantIds).size === e.entrantIds.length && e.entrantIds.every((id) => records.has(id)), "entrant IDs");
    requireValue(Array.isArray(e.startedIds) && e.startedIds.length <= e.entryRules.maximumEntrants && new Set(e.startedIds).size === e.startedIds.length && e.startedIds.every((id) => records.has(id)), "starter IDs");
    requireValue(Array.isArray(e.drops) && new Set(e.drops.map((d) => d.id)).size === e.drops.length && e.drops.every((d) => exactKeys(d, ["id", "tick", "reason"]) && records.has(d.id) && !e.entrantIds.includes(d.id) && integer(d.tick, e.createdTick, tick) && typeof d.reason === "string" && d.reason.length > 0), "competition drops");
    requireValue(e.drops.length + e.entrantIds.length <= s.settings.capacity, "competition entry budget");
    requireValue(e.status === "cancelled" ? typeof e.cancellationReason === "string" && e.cancellationReason.length > 0 : e.cancellationReason === null, "competition cancellation");
    requireValue(Array.isArray(e.attendance) && (history ? e.attendance.length === 0 : e.attendance.length === e.entrantIds.length), "competition attendance");
    const places = /* @__PURE__ */ new Set();
    for (const a of e.attendance) {
      const c = living.get(a.id);
      requireValue(c && exactKeys(a, ["id", "entryPosition", "target", "path"]) && e.entrantIds.includes(a.id) && c.currentAction === null && !locks.has(a.id), "competition lock");
      locks.add(a.id);
      const point = (p) => exactKeys(p, ["x", "y"]) && finite(p.x, 0, s.world.width - Number.EPSILON) && finite(p.y, 0, s.world.height - Number.EPSILON) && Number.isFinite(terrainCost(terrain[tileIndex(p, s.world.width)]));
      requireValue(point(a.entryPosition) && settings.venue.places.some((p) => p.x === a.target.x && p.y === a.target.y) && !places.has(`${a.target.x}:${a.target.y}`) && Array.isArray(a.path) && a.path.length <= s.world.width * s.world.height, "competition venue");
      places.add(`${a.target.x}:${a.target.y}`);
      let previous = c.position;
      for (const p of a.path) {
        requireValue(point(p) && Number.isInteger(p.x - 0.5) && Number.isInteger(p.y - 0.5) && (p.x === previous.x || p.y === previous.y) && Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y) <= 1, "competition path");
        previous = p;
      }
      requireValue(previous.x === a.target.x && previous.y === a.target.y && (e.status !== "running" || a.path.length === 0), "competition destination");
    }
    if (!history) requireValue(e.entrantIds.every((id) => living.has(id)), "live entrants");
    requireValue(Array.isArray(e.snapshots) && e.snapshots.length === e.startedIds.length, "competition snapshots");
    for (const p of e.snapshots) requireValue(exactKeys(p, ["id", "organismId", "levels", "aptitudes", "wellbeing", "stagePerformance", ...p.confidence !== void 0 ? ["confidence"] : []]) && e.startedIds.includes(p.id) && records.get(p.id)?.organismId === p.organismId && exactKeys(p.levels, skillKeys) && Object.values(p.levels).every((n) => integer(n, 0, 100)) && exactKeys(p.aptitudes, skillKeys) && Object.values(p.aptitudes).every((n) => finite(n, 0, 1)) && finite(p.wellbeing, 0, 1) && (p.confidence === void 0 || p.confidence === 0 || p.confidence === config.prizes.confidenceBonus) && Object.values(config.lifecycle.stages).some((stage) => stage.mobile && p.stagePerformance === stage.performanceMultiplier), "competition snapshot");
    requireValue(new Set(e.snapshots.map((p) => p.id)).size === e.snapshots.length, "unique competition snapshots");
    if (e.status === "running" || e.status === "resolved") {
      requireValue(e.entrantIds.length >= settings.minimumEntrants && e.startedIds.length >= settings.minimumEntrants && e.results && integer(e.results.startRng, 1, 4294967295), "committed results");
      const expected = filtered(resolveCompetition(e, e.snapshots, e.results.startRng, config), e.entrantIds);
      requireValue(JSON.stringify(e.results) === JSON.stringify(expected), "competition committed score mismatch");
    } else requireValue(e.results === null && (e.status === "cancelled" || e.snapshots.length === 0), "unexpected competition result");
  }
  for (const c of s.creatures) {
    const m = c.competition;
    requireValue(exactKeys(m, ["nextEntryTick", "stats"]) && integer(m.nextEntryTick) && exactKeys(m.stats, ["entered", "wins", "podiums", "bestPlacement"]) && integer(m.stats.entered) && integer(m.stats.wins, 0, m.stats.podiums) && integer(m.stats.podiums, 0, m.stats.entered) && object$1(m.stats.bestPlacement), "competition memory");
    requireValue(Object.entries(m.stats.bestPlacement).every(([k, n]) => skillKeys.includes(k) && integer(n, 1, settings.maximumEntrants)), "competition best placement");
    if (!config.lifecycle.stages[c.stage].mobile) requireValue(m.stats.entered === 0 && m.stats.wins === 0 && m.stats.podiums === 0 && Object.keys(m.stats.bestPlacement).length === 0, "dormant competition stats");
  }
  const state = s.competitionState;
  requireValue(exactKeys(state, ["skillCooldowns", "nextAutoTick", "statistics"]) && integer(state.nextAutoTick) && exactKeys(state.statistics, ["held", "cancelled", "cancellationReasons", "entrants", "dropped", "accepted", "entryBands", "aptitudeBands", "levelBands", "placementCorrelation"]), "competition scheduler state");
  requireValue(object$1(state.skillCooldowns) && Object.entries(state.skillCooldowns).every(([k, v]) => skillKeys.includes(k) && integer(v, 0, tick + settings.skillCooldownTicks)), "competition skill cooldowns");
  const stats = state.statistics;
  for (const k of ["held", "cancelled", "entrants", "dropped", "accepted"]) requireValue(integer(stats[k]), "competition counters");
  requireValue(stats.dropped <= stats.accepted && object$1(stats.cancellationReasons) && Object.values(stats.cancellationReasons).every((n) => integer(n)) && Object.values(stats.cancellationReasons).reduce((n, v) => n + v, 0) === stats.cancelled, "competition cancellation counts");
  for (const [rows, bounds, entry2] of [[stats.entryBands, settings.report.levelBands, true], [stats.aptitudeBands, settings.report.aptitudeBands, false], [stats.levelBands, settings.report.levelBands, false]]) {
    requireValue(Array.isArray(rows) && rows.length === bounds.length + 1, "competition report bands");
    for (const row of rows) requireValue(exactKeys(row, entry2 ? ["considered", "entered"] : ["entries", "wins"]) && Object.values(row).every((n) => integer(n)), "competition band counters");
  }
  requireValue(exactKeys(stats.placementCorrelation, ["count", "levels", "levelsSquared", "placements", "placementsSquared", "levelPlacements"]) && Object.values(stats.placementCorrelation).every((n) => finite(n, 0, Number.MAX_SAFE_INTEGER)), "competition report correlation");
}
function validateCompetitionCommand(command) {
  requireValue(object$1(command), "competition command");
  const c = command;
  if (c.kind === "cancelCompetition") {
    requireValue(exactKeys(c, ["kind", "id", ...Object.hasOwn(c, "debug") ? ["debug"] : []]) && (c.debug === void 0 || typeof c.debug === "boolean") && typeof c.id === "string" && /^cpt_[0-9]{8}$/.test(c.id), "cancel command");
    return;
  }
  requireValue(exactKeys(c, ["kind", "skill", "format", "entryRules", "startDelay", ...Object.hasOwn(c, "skills") ? ["skills"] : [], ...Object.hasOwn(c, "prize") ? ["prize"] : []]) && skillKeys.includes(c.skill) && config.competitions.formats.some((f) => f.id === c.format) && integer(c.startDelay, config.competitions.minimumStartDelay, config.competitions.maximumStartDelay), "create command");
  requireValue(!prizeReason(c.prize), "command prize");
  validateRules(c.entryRules);
  if (c.skills !== void 0) requireValue(Array.isArray(c.skills) && c.skills.every((k) => skillKeys.includes(k)), "command skills");
}
function spotCells(spot, width) {
  return Array.from({ length: spot.width * spot.height }, (_, i) => (spot.y + Math.floor(i / spot.width)) * width + spot.x + i % spot.width);
}
const approachGeometry = /* @__PURE__ */ new WeakMap();
function trainingApproaches(spot, terrain, width, height) {
  const key2 = `${spot.x}:${spot.y}:${spot.width}:${spot.height}:${width}:${height}`;
  let geometry = approachGeometry.get(spot);
  if (geometry?.key !== key2) {
    const cells = new Set(spotCells(spot, width)), approaches = /* @__PURE__ */ new Set();
    for (const index of cells) {
      const x = index % width, y = Math.floor(index / width);
      for (const p of [{ x, y: y - 1 }, { x: x - 1, y }, { x: x + 1, y }, { x, y: y + 1 }]) {
        const i = p.y * width + p.x;
        if (p.x >= 0 && p.y >= 0 && p.x < width && p.y < height && !cells.has(i)) approaches.add(i);
      }
    }
    geometry = { key: key2, indices: [...approaches].sort((a, b) => a - b) };
    approachGeometry.set(spot, geometry);
  }
  return geometry.indices.filter((i) => isSafeLand(terrain[i])).map((i) => tileCenter(i, width));
}
function withDefaultTraining(state) {
  const terrain = [...navigationTerrain(state.world)], width = state.world.width;
  const reserved = new Set(state.world.looseFruit.map((f) => tileIndex(f, width)));
  for (const c of state.creatures) {
    reserved.add(tileIndex(c.position, width));
    if (c.currentAction) [c.currentAction.target, ...c.currentAction.path].forEach((p) => reserved.add(tileIndex(p, width)));
  }
  const base = decodeTerrain(state.world.terrainRle);
  for (const definition of config.training.shallowPractice) {
    const options = terrain.flatMap((code, i2) => code === 0 && !reserved.has(i2) ? [i2] : []).sort((a, b) => (a % width - definition.x) ** 2 + (Math.floor(a / width) - definition.y) ** 2 - (b % width - definition.x) ** 2 - (Math.floor(b / width) - definition.y) ** 2 || a - b);
    const i = options.find((i2) => shoreline(tileCenter(i2, width), terrain, width, state.world.height));
    if (i === void 0) throw new Error("No safe location for shallow practice.");
    base[i] = 2;
    terrain[i] = 2;
    reserved.add(i);
  }
  const items2 = [];
  for (const [offset, definition] of config.training.defaults.entries()) {
    const options = terrain.flatMap((code, index) => isSafeLand(code) ? [index] : []).sort((a, b) => (a % width - definition.x) ** 2 + (Math.floor(a / width) - definition.y) ** 2 - (b % width - definition.x) ** 2 - (Math.floor(b / width) - definition.y) ** 2 || a - b);
    let chosen;
    for (const index of options) {
      const spot = { ...definition, x: index % width, y: Math.floor(index / width), id: `i_${String(state.counters.item + offset).padStart(8, "0")}` };
      if (spot.x + spot.width > width || spot.y + spot.height > state.world.height) continue;
      const cells = spotCells(spot, width);
      if (!cells.every((i) => isSafeLand(terrain[i]) && !reserved.has(i))) continue;
      if (!trainingApproaches(spot, terrain, width, state.world.height).length) continue;
      chosen = spot;
      cells.forEach((i) => {
        terrain[i] = 5;
        reserved.add(i);
      });
      break;
    }
    if (!chosen) throw new Error("No safe location for a training spot.");
    items2.push(chosen);
  }
  return {
    ...state,
    counters: { ...state.counters, item: state.counters.item + items2.length },
    world: { ...state.world, items: items2, terrainRle: encodeTerrain(base), terrainRevision: state.world.terrainRevision + 1 }
  };
}
function otherTraining(state, creature) {
  const claims = [];
  for (const c of state.creatures) if (c.id !== creature.id && c.currentAction?.targetItemId) claims.push(c.currentAction);
  for (const s of state.social?.sessions ?? []) if (s.kind === "contest" && s.skill && s.targetItemId) {
    for (const [i, id] of s.participants.entries()) if (id !== creature.id)
      claims.push({ kind: config.skillCatalog[s.skill].trainingActivity, target: s.targets[i], targetItemId: s.targetItemId, targetFruitId: null, path: [], workTicks: s.workTicks });
  }
  return claims;
}
function validTraining(state, creature, action, terrain) {
  const skill = trainingSkill(action.kind);
  if (!skill) return false;
  if (action.targetItemId) {
    const item = state.world.items.find((i) => i.id === action.targetItemId);
    const claims = otherTraining(state, creature);
    return !!item && item.skill === skill && claims.filter((a) => a.targetItemId === item.id).length < config.training.capacity && !claims.some((a) => distance(a.target, action.target) === 0) && trainingApproaches(item, terrain, state.world.width, state.world.height).some((p) => distance(p, action.target) === 0);
  }
  const code = terrain[tileIndex(action.target, state.world.width)];
  if (skill === "swim") return code === 2 && shoreline(action.target, terrain, state.world.width, state.world.height);
  if (skill === "climb") return code === 4;
  return isSafeLand(code);
}
function shoreline(p, terrain, width, height) {
  const x = Math.floor(p.x), y = Math.floor(p.y);
  return [{ x, y: y - 1 }, { x: x - 1, y }, { x: x + 1, y }, { x, y: y + 1 }].some((p2) => p2.x >= 0 && p2.y >= 0 && p2.x < width && p2.y < height && isSafeLand(terrain[p2.y * width + p2.x]));
}
function object(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function keys(v, names2) {
  return object(v) && Object.keys(v).length === names2.length && names2.every((k) => Object.hasOwn(v, k));
}
function requireGenome(ok) {
  if (!ok) throw new Error("Invalid genome: loci, allele values or dominance ranks.");
}
function validateGenome(data) {
  requireGenome(keys(data, chromosomes));
  for (const chromosome of chromosomes) {
    const c = data[chromosome], definitions = chromosomeLoci(chromosome);
    requireGenome(keys(c, ["haplotypes"]) && Array.isArray(c.haplotypes) && c.haplotypes.length === 2);
    for (const h of c.haplotypes) {
      requireGenome(Array.isArray(h) && h.length === definitions.length);
      for (const [i, a] of h.entries()) {
        requireGenome(keys(a, ["v", "d"]) && (a.d === 0 || a.d === 1));
        const d = definitions[i];
        if (d.dominanceType === "categorical") requireGenome(d.options?.some((o) => o.value === a.v && o.dominance === a.d));
        else requireGenome(typeof a.v === "number" && Number.isInteger(a.v) && d.alleleRange && a.v >= d.alleleRange[0] && a.v <= d.alleleRange[1]);
      }
    }
  }
}
function emptySocialMemory() {
  return {
    nextTargetTick: 0,
    targets: [],
    contestCooldowns: {},
    rivalBoosts: {},
    rivalExtraXpToday: Object.fromEntries(skillKeys.map((k) => [k, 0])),
    rewardTicks: {},
    preferences: { play: { learnedMean: 0, samples: 0 }, comfort: { learnedMean: 0, samples: 0 }, contest: { learnedMean: 0, samples: 0 } },
    mourning: null,
    lastInteraction: null
  };
}
function emptySocialState() {
  return { sessions: [], nextMaintenanceTick: 0, statistics: {
    interactions: 0,
    friendlyPlays: 0,
    rudePlays: 0,
    contests: 0,
    friendships: 0,
    rivalries: 0,
    mateBondsFormed: 0,
    mateBondsBroken: 0,
    matings: 0,
    bondedMatings: 0,
    friendMatings: 0,
    aptitudeWins: Array.from({ length: config.social.contest.aptitudeBands.length + 1 }, () => ({ entries: 0, wins: 0 })),
    correlation: { count: 0, levels: 0, levelsSquared: 0, wins: 0, levelWins: 0 }
  } };
}
function validateSocial(s) {
  const t = s.clock.tick, cfg = config.social, byId = new Map(s.creatures.map((c) => [c.id, c])), active = new Set(s.creatures.map((c) => c.organismId)), known = new Set(s.organisms.map((o) => o.id));
  requireValue(exactKeys(s.social, ["sessions", "nextMaintenanceTick", "statistics"]) && integer(s.social.nextMaintenanceTick, 0, t + cfg.maintenanceTicks), "social root");
  const stats = s.social.statistics, shape = emptySocialState().statistics;
  requireValue(exactKeys(stats, Object.keys(shape)), "social statistics");
  for (const key2 of Object.keys(shape)) if (key2 !== "aptitudeWins" && key2 !== "correlation") requireValue(integer(stats[key2]), "social count");
  requireValue(Array.isArray(stats.aptitudeWins) && stats.aptitudeWins.length === cfg.contest.aptitudeBands.length + 1 && stats.aptitudeWins.every((b) => exactKeys(b, ["entries", "wins"]) && integer(b.entries) && integer(b.wins, 0, b.entries)), "contest aptitude counts");
  requireValue(exactKeys(stats.correlation, Object.keys(shape.correlation)) && Object.values(stats.correlation).every((n) => finite(n, 0, Number.MAX_SAFE_INTEGER)) && integer(stats.correlation.count) && integer(stats.correlation.wins, 0, stats.correlation.count), "contest correlation");
  const degree = /* @__PURE__ */ new Map();
  requireValue(s.relationships.length <= cfg.maximumRelationships, "relationship global cap");
  const kinds = ["play", "comfort", "contest", "court", "pair", "avoid", "debug"];
  for (const r of s.relationships) {
    requireValue(active.has(r.a) && active.has(r.b), "living relationship endpoints");
    for (const id of [r.a, r.b]) {
      degree.set(id, (degree.get(id) ?? 0) + 1);
      requireValue(degree.get(id) <= cfg.relationshipsPerCreature, "relationship degree cap");
    }
    requireValue(Array.isArray(r.history) && r.history.length <= cfg.historyLimit, "relationship history");
    let previous = 0;
    for (const h of r.history) {
      requireValue(exactKeys(h, ["kind", "outcome", "tick"]) && kinds.includes(h.kind) && ["friendly", "rude", "neutral"].includes(h.outcome) && integer(h.tick, previous, t), "interaction history");
      previous = h.tick;
    }
  }
  for (const c of s.creatures) {
    const m = c.social;
    requireValue(exactKeys(m, ["nextTargetTick", "targets", "contestCooldowns", "rivalBoosts", "rivalExtraXpToday", "rewardTicks", "preferences", "mourning", "lastInteraction"]) && integer(m.nextTargetTick, 0, t + cfg.targetIntervalTicks) && Array.isArray(m.targets) && m.targets.length <= cfg.targetLimit && new Set(m.targets).size === m.targets.length && m.targets.every((id) => active.has(id) && id !== c.organismId), "social memory");
    requireValue(object$1(m.contestCooldowns) && Object.entries(m.contestCooldowns).every(([id, until]) => active.has(id) && id !== c.organismId && integer(until, 0, t + cfg.contest.cooldownTicks)), "contest cooldowns");
    requireValue(object$1(m.rivalBoosts) && Object.entries(m.rivalBoosts).every(([skill, b]) => skillKeys.includes(skill) && exactKeys(b, ["amount", "expiresTick"]) && finite(b.amount, 0, cfg.rivalry.xpBoost) && integer(b.expiresTick, 0, t + cfg.targetIntervalTicks)), "rival practice boost");
    requireValue(exactKeys(m.rivalExtraXpToday, skillKeys) && Object.values(m.rivalExtraXpToday).every((n) => finite(n, 0, cfg.rivalry.dailyExtraXpCap + Number.EPSILON * 100)), "daily rival XP cap");
    requireValue(object$1(m.rewardTicks) && Object.entries(m.rewardTicks).every(([kind, tick]) => ["friendlyPlay", "rudePlay", "comfort", "contest"].includes(kind) && integer(tick, 0, t)), "social drift cooldowns");
    requireValue(exactKeys(m.preferences, ["play", "comfort", "contest"]) && Object.values(m.preferences).every((v) => exactKeys(v, ["learnedMean", "samples"]) && finite(v.learnedMean, -1, 1) && integer(v.samples)), "social learning");
    requireValue(m.mourning === null || exactKeys(m.mourning, ["organismId", "untilTick"]) && known.has(m.mourning.organismId) && integer(m.mourning.untilTick, t + 1, t + cfg.mourning.durationTicks), "mourning");
    requireValue(m.lastInteraction === null || exactKeys(m.lastInteraction, ["kind", "outcome", "tick", "partner"]) && kinds.includes(m.lastInteraction.kind) && known.has(m.lastInteraction.partner) && integer(m.lastInteraction.tick, 0, t) && ["friendly", "rude", "neutral"].includes(m.lastInteraction.outcome), "last interaction");
  }
  requireValue(Array.isArray(s.social.sessions) && s.social.sessions.length <= Math.floor(s.creatures.length / 2), "social session count");
  const locked = new Set(s.sessions.flatMap((s2) => s2.participants)), ids = new Set(s.sessions.map((s2) => s2.id)), terrain = navigationTerrain(s.world);
  const walkable = (p) => exactKeys(p, ["x", "y"]) && finite(p.x, 0, s.world.width - Number.EPSILON) && finite(p.y, 0, s.world.height - Number.EPSILON) && Number.isFinite(terrainCost(terrain[tileIndex(p, s.world.width)]));
  for (const session of s.social.sessions) {
    requireValue(exactKeys(session, ["id", "kind", "participants", "startedTick", "workStartedTick", "workTicks", "targets", "paths", "targetItemId", "skill", "result", "workStarts"]) && /^s_[0-9]{8}$/.test(session.id) && integer(Number(session.id.slice(2)), 1, s.counters.session - 1) && !ids.has(session.id) && ["play", "comfort", "contest"].includes(session.kind) && integer(session.startedTick, 0, t) && integer(session.workTicks, 0, config.actions[session.kind].workTicks - 1) && (session.workStartedTick === null ? session.workTicks === 0 : integer(session.workStartedTick, session.startedTick, t)) && Array.isArray(session.participants) && session.participants.length === 2 && new Set(session.participants).size === 2 && Array.isArray(session.targets) && session.targets.length === 2 && Array.isArray(session.paths) && session.paths.length === 2, "social session");
    ids.add(session.id);
    const pair = session.participants.map((id) => byId.get(id));
    requireValue(pair.every((c) => c?.needs && config.lifecycle.stages[c.stage].mobile && c.currentAction === null && !locked.has(c.id)), "social participants");
    for (const [i, c] of pair.entries()) {
      locked.add(c.id);
      let previous = c.position;
      requireValue(walkable(session.targets[i]) && Array.isArray(session.paths[i]), "social target");
      for (const p of session.paths[i]) {
        requireValue(walkable(p) && Number.isInteger(p.x - 0.5) && Number.isInteger(p.y - 0.5) && (p.x === previous.x || p.y === previous.y) && Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y) <= 1, "social cardinal path");
        previous = p;
      }
      requireValue(previous.x === session.targets[i].x && previous.y === session.targets[i].y, "social destination");
      if (session.kind === "contest") requireValue(session.skill && skillKeys.includes(session.skill) && validTraining(s, c, {
        kind: config.skillCatalog[session.skill].trainingActivity,
        target: session.targets[i],
        ...session.targetItemId ? { targetItemId: session.targetItemId } : {}
      }, terrain), "contest practice site");
    }
    requireValue(session.kind === "contest" || session.skill === null && session.targetItemId === null && session.result === null, "noncontest fields");
    if (session.workStartedTick === null) requireValue(session.workStarts === null && session.result === null, "unstarted social work");
    else {
      requireValue(Array.isArray(session.workStarts) && session.workStarts.length === 2 && session.workStarts.every((w) => exactKeys(w, ["wellbeing", "level"]) && finite(w.wellbeing, 0, 1) && integer(w.level, 0, 100)) && session.paths.every((p) => !p.length), "social work snapshots");
      if (session.kind === "contest") {
        const result = session.result;
        requireValue(result && exactKeys(result, ["skill", "ranking", "winnerId", "margin", "startRng", "rng", "effects"]) && result.skill === session.skill && Array.isArray(result.ranking) && result.ranking.length === 2 && integer(result.startRng, 1, 4294967295) && integer(result.rng, 1, 4294967295), "committed contest");
        for (const row of result.ranking) requireValue(exactKeys(row, ["id", "level", "staminaLevel", "wellbeing", "stagePerformance", "aptitude", "rank", "base", "score"]) && session.participants.includes(row.id) && integer(row.level, 0, 100) && integer(row.staminaLevel, 0, 100) && finite(row.wellbeing, 0, 1) && finite(row.stagePerformance, 0, 1) && finite(row.aptitude, 0, 1), "contest snapshot");
        const expected = resolveContest(result.ranking, result.skill, result.startRng, config);
        requireValue(expected.winnerId === result.winnerId && expected.margin === result.margin && expected.rng === result.rng && expected.ranking.every((r, i) => r.id === result.ranking[i].id && r.score === result.ranking[i].score && r.base === result.ranking[i].base && r.rank === result.ranking[i].rank) && Array.isArray(result.effects) && result.effects.length === 2 && expected.effects.every((r, i) => exactKeys(result.effects[i], ["id", "valence"]) && r.id === result.effects[i].id && r.valence === result.effects[i].valence), "contest score integrity");
      }
    }
  }
}
function validateAppearanceModifiers(c, tick) {
  const limits = config.appearance.modifiers;
  requireValue(Array.isArray(c.appearanceModifiers) && c.appearanceModifiers.length <= limits.maximum, "appearance modifier count");
  requireValue(config.lifecycle.stages[c.stage].mobile || c.appearanceModifiers.length === 0, "dormant appearance modifiers");
  for (const m of c.appearanceModifiers) {
    requireValue(exactKeys(m, ["type", "magnitude", "rgb", "sourceFruit", "expiresTick"]) && m.type === "dietTint" && finite(m.magnitude, limits.minimumStrength, limits.maximumStrength) && Array.isArray(m.rgb) && m.rgb.length === 3 && m.rgb.every((n) => finite(n, 0, 1)) && fruitKinds.includes(m.sourceFruit) && integer(m.expiresTick, tick + 1, tick + limits.expiryDays * config.clock.dayTicks) && c.appearanceModifiers.filter((other) => other.type === m.type).length <= limits.maximumPerType, "appearance modifier");
  }
}
function validationLineage(state) {
  if (!state.archive) return state.lineage;
  const archive2 = state.archive;
  requireValue(exactKeys(archive2, ["stubs", "cosmetics", "removedLives", "removedOrganisms"]) && integer(archive2.removedLives) && integer(archive2.removedOrganisms) && Array.isArray(archive2.stubs) && archive2.stubs.length <= config.offline.archive.maximumStubs, "archive bounds");
  requireValue(Object.entries(archive2.cosmetics).every(([id, n]) => Object.hasOwn(config.prizes.starter.cosmetics, id) && integer(n)), "archived cosmetics");
  const nodes = new Map(state.organisms.map((o) => [o.id, o]));
  return [...state.lineage, ...archive2.stubs.map((stub) => {
    requireValue(exactKeys(stub, ["id", "organismId", "parentIds", "birthTick", "deathTick", "topSkill", "generation"]) && integer(stub.deathTick, stub.birthTick, state.clock.tick) && integer(stub.generation), "lineage stub");
    const organism = nodes.get(stub.organismId), life = organism?.lives.find((l) => l.creatureId === stub.id);
    requireValue(life && life.endedTick !== null, "archived life");
    return {
      ...stub,
      awards: emptyAwards(),
      displayName: life.displayName,
      finalStage: "elder",
      ageAtDeath: lifespan(life.lifeIndex),
      endReason: life.lifeIndex < organism.lives.length - 1 ? "rebirth" : "oldAge",
      origin: stub.parentIds ? "birth" : "founder",
      birthAptitudes: Object.fromEntries(skillKeys.map((k) => [k, 0])),
      mutations: []
    };
  })];
}
function validParentMarker(id, state) {
  return !!state.archive && isArchivedAncestor(id);
}
const caches = /* @__PURE__ */ new WeakMap();
function parents(state) {
  let cached = caches.get(state.organisms);
  if (!cached) {
    cached = new Map(state.organisms.map((o) => [o.id, [...o.parents]]));
    caches.set(state.organisms, cached);
  }
  return cached;
}
function familyTie(state, a, b) {
  const p = parents(state), A = p.get(a) ?? [], B = p.get(b) ?? [];
  if (A.includes(b)) return "parent";
  if (B.includes(a)) return "child";
  return a !== b && A.some((id) => B.includes(id)) ? "sibling" : "none";
}
const indexes = /* @__PURE__ */ new WeakMap();
const key = (a, b) => a < b ? `${a}:${b}` : `${b}:${a}`;
function stored(state, a, b) {
  let index = indexes.get(state.relationships);
  if (!index || index.length !== state.relationships.length) {
    index = { length: state.relationships.length, pairs: new Map(state.relationships.map((r) => [key(r.a, r.b), r])) };
    indexes.set(state.relationships, index);
  }
  return index.pairs.get(key(a, b));
}
function decayRelationship(r, tick) {
  const s = config.social, elapsed = Math.max(0, tick - Math.max(r.lastDecayTick, r.lastContactTick + s.decayGraceDays * config.clock.dayTicks));
  return {
    ...r,
    history: [...r.history],
    bond: r.bond * Math.exp(-elapsed / (s.bondDecayDays * config.clock.dayTicks)),
    mateBond: r.mateBond * Math.exp(-elapsed / (s.bondDecayDays * config.clock.dayTicks)),
    rivalry: r.rivalry * Math.exp(-elapsed / (s.rivalryDecayDays * config.clock.dayTicks)),
    lastDecayTick: tick
  };
}
const relationshipStrength = (r) => Math.abs(r.bond) + r.rivalry + r.mateBond + r.familiarity;
function event(state, kind, r) {
  const a = state.creatures.find((c) => c.organismId === r.a), b = state.creatures.find((c) => c.organismId === r.b);
  const A = a ?? state.lineage.slice().reverse().find((l) => l.organismId === r.a), B = b ?? state.lineage.slice().reverse().find((l) => l.organismId === r.b);
  if (A && B) recordLifeEvent(state, { kind, creatureId: A.id, relatedCreatureId: B.id, from: a?.stage ?? "elder", to: a?.stage ?? "elder" });
}
function endMateBond(state, r) {
  if (r.mateBond >= config.social.mateBondThreshold) {
    state.social.statistics.mateBondsBroken++;
    event(state, "mateBondBroken", r);
  }
}
function transitions(state, old, r) {
  const s = config.social, stats = state.social.statistics;
  if (old.bond < s.friendBond && r.bond >= s.friendBond) {
    stats.friendships++;
    event(state, "friendship", r);
  }
  if (old.rivalry < s.rivalThreshold && r.rivalry >= s.rivalThreshold) {
    stats.rivalries++;
    event(state, "rivalry", r);
  }
  if (old.mateBond < s.mateBondThreshold && r.mateBond >= s.mateBondThreshold) {
    stats.mateBondsFormed++;
    event(state, "mateBondFormed", r);
  }
  if (old.mateBond >= s.mateBondThreshold && r.mateBond < s.mateBondThreshold) {
    stats.mateBondsBroken++;
    event(state, "mateBondBroken", r);
  }
}
function enforceRelationshipCaps(state) {
  const limits = config.social;
  const counts = /* @__PURE__ */ new Map();
  for (const r of state.relationships) for (const id of [r.a, r.b]) counts.set(id, (counts.get(id) ?? 0) + 1);
  const sorted = [...state.relationships].sort((a, b) => relationshipStrength(a) - relationshipStrength(b) || key(a.a, a.b).localeCompare(key(b.a, b.b)));
  const remove = /* @__PURE__ */ new Set();
  let size = sorted.length;
  for (const r of sorted) if (size > limits.maximumRelationships || (counts.get(r.a) ?? 0) > limits.relationshipsPerCreature || (counts.get(r.b) ?? 0) > limits.relationshipsPerCreature) {
    remove.add(r);
    size--;
    counts.set(r.a, counts.get(r.a) - 1);
    counts.set(r.b, counts.get(r.b) - 1);
  }
  if (remove.size) {
    for (const r of remove) endMateBond(state, r);
    state.relationships = state.relationships.filter((r) => !remove.has(r));
  }
}
function ensureRelationship(state, a, b) {
  const existing = stored(state, a, b);
  if (existing) {
    const next = decayRelationship(existing, state.clock.tick);
    transitions(state, existing, next);
    state.relationships = state.relationships.map((r2) => r2 === existing ? next : r2);
    return next;
  }
  const A = state.lineage.find((l) => l.organismId === a), B = state.lineage.find((l) => l.organismId === b);
  const founder = A?.birthTick === 0 && B?.birthTick === 0 && A.origin === "founder" && B.origin === "founder";
  const r = {
    a: a < b ? a : b,
    b: a < b ? b : a,
    bond: founder ? config.social.initialFounderBond : 0,
    rivalry: 0,
    mateBond: 0,
    familiarity: 0,
    lastContactTick: state.clock.tick,
    lastDecayTick: state.clock.tick,
    history: []
  };
  state.relationships = [...state.relationships, r];
  return r;
}
function initializeFamily(state, id) {
  for (const a of state.creatures.filter((c) => true)) for (const b of state.creatures) {
    if (a.id === b.id || !a.needs || stored(state, a.organismId, b.organismId)) continue;
    const tie = familyTie(state, a.organismId, b.organismId);
    if (tie === "none") continue;
    const r = ensureRelationship(state, a.organismId, b.organismId);
    r.bond = tie === "sibling" ? config.social.newbornSiblingBond : config.social.newbornParentBond;
    r.familiarity = tie === "sibling" ? 0 : config.social.newbornParentFamiliarity;
  }
  enforceRelationshipCaps(state);
}
function sociallyBusy(state, id) {
  return state.competitions.some((e) => e.entrantIds.includes(id)) || state.sessions.some((s) => s.participants.includes(id)) || (state.social?.sessions ?? []).some((s) => s.participants.includes(id));
}
function hasPair(pairs, a, b) {
  return pairs.some((p) => p.includes(a) && p.includes(b));
}
function policyReason(state, a, b) {
  const r = state.breedingRules;
  if (a.id === b.id) return "Same creature";
  if (r.blockedIndividuals.includes(a.organismId) || r.blockedIndividuals.includes(b.organismId)) return "Individual blocked";
  if (hasPair(r.blockedPairs, a.organismId, b.organismId)) return "Pair blocked";
  if (r.exclusivePairs.some((p) => p.includes(a.organismId) && !p.includes(b.organismId) || p.includes(b.organismId) && !p.includes(a.organismId))) return "Exclusively paired elsewhere";
  if (!permittedKinship(state, a.organismId, b.organismId)) return "Disallowed relative";
  return null;
}
function breedingReason(state, c, phase = "entry", ignoreSession = false) {
  const b = config.breeding;
  if (!state.settings.autoBreed) return "Autonomous breeding disabled";
  if (c.stage !== "adult" || !c.needs) return "Adults only";
  if (phase !== "completion" && stageStartAge("elder", c.lifeIndex) - c.age < b.adultRemainingTicks) return "Too close to elderhood";
  if (c.breeding.cooldownUntil > state.clock.tick) return "Breeding cooldown";
  if (c.breeding.clutches >= b.maximumClutches) return "Lifetime clutch limit";
  if (state.breedingRules.blockedIndividuals.includes(c.organismId)) return "Individual blocked";
  const maximum = phase === "completion" ? config.needs.urgentThreshold : b.needMaximum;
  if (c.needs.hunger >= maximum) return "Hungry";
  if (c.needs.fatigue >= maximum) return "Tired";
  if (c.needs.stress >= b.stressMaximum) return "Stressed";
  if (phase !== "completion" && c.mood < b.minimumMood) return "Mood too low";
  if (!ignoreSession && sociallyBusy(state, c.id)) return "In shared session";
  return null;
}
function validateBreeding(s) {
  const ids = new Set(s.organisms.map((o) => o.id)), lives = new Map(validationLineage(s).map((l) => [l.id, l]));
  const rules = s.breedingRules;
  for (const list of [rules.blockedIndividuals, rules.encouragedIndividuals]) requireValue(Array.isArray(list) && list.every((id, i) => ids.has(id) && (i === 0 || list[i - 1] < id)), "individual breeding policy");
  for (const list of [rules.blockedPairs, rules.encouragedPairs, rules.exclusivePairs]) {
    requireValue(Array.isArray(list), "pair policy");
    let prev = "";
    for (const p of list) {
      requireValue(Array.isArray(p) && p.length === 2 && p[0] < p[1] && p.every((id) => ids.has(id)) && p.join(":") > prev, "canonical pair policy");
      prev = p.join(":");
    }
  }
  requireValue(new Set(rules.exclusivePairs.flat()).size === rules.exclusivePairs.length * 2, "disjoint exclusive pairs");
  for (const c of s.creatures) requireValue(exactKeys(c.breeding, ["cooldownUntil", "clutches", "nextAttemptTick"]) && integer(c.breeding.cooldownUntil) && integer(c.breeding.nextAttemptTick) && integer(c.breeding.clutches, 0, config.breeding.maximumClutches), "breeding state");
  for (const l of s.lineage) {
    requireValue(["founder", "birth", "rescue", "legacy"].includes(l.origin) && integer(l.generation) && exactKeys(l.birthAptitudes, skillKeys) && Object.values(l.birthAptitudes).every((q) => finite(q, 0, 1)) && Array.isArray(l.mutations), "birth summary");
    if (l.origin === "birth") requireValue(l.parentIds?.length === 2, "two parents");
    if (!l.parentIds) requireValue(l.generation === 0, "founder generation");
    else requireValue(l.generation === 1 + Math.max(...l.parentIds.map((id) => validParentMarker(id, s) ? archivedGeneration(id) : lives.get(id).generation)), "child generation");
    for (const m of l.mutations) requireValue(config.genes.some((g) => g.chromosome === m.chromosome && g.id === m.locus) && (m.haplotype === 0 || m.haplotype === 1) && exactKeys(m.before, ["v", "d"]) && exactKeys(m.after, ["v", "d"]), "mutation record");
  }
  for (const event2 of s.events) if (event2.command) {
    const c = event2.command;
    if (s.schemaVersion >= 9 && (c.kind === "createCompetition" || c.kind === "cancelCompetition")) {
      validateCompetitionCommand(c);
      continue;
    }
    if (s.schemaVersion >= 10 && c.kind === "equipCosmetic") {
      requireValue(exactKeys(c, ["kind", "id", "cosmetic"]) && ids.has(c.id) && (c.cosmetic === null || Object.hasOwn(config.prizes.starter.cosmetics, c.cosmetic)), "cosmetic command");
      continue;
    }
    const individual = c.kind === "blockCreature" || c.kind === "encourageCreature";
    const pair = c.kind === "pair" || c.kind === "blockPair" || c.kind === "encouragePair" || c.kind === "forceBreed" || c.kind === "setAffinity";
    requireValue(exactKeys(c, ["kind", ...pair ? ["a", "b"] : individual ? ["id"] : [], ...c.kind === "forceBreed" ? [] : c.kind === "setAffinity" ? ["value"] : ["enabled"]]) && (pair || individual || c.kind === "extinctionRescue") && (c.kind === "forceBreed" || (c.kind === "setAffinity" ? finite(c.value, -100, 100) : typeof c.enabled === "boolean")) && (!("id" in c) || ids.has(c.id)) && (!("a" in c) || ids.has(c.a) && ids.has(c.b) && c.a !== c.b), "journal command");
  }
  const terrain = navigationTerrain(s.world), locked = /* @__PURE__ */ new Set();
  const walkable = (p) => finite(p.x, 0, s.world.width - Number.EPSILON) && finite(p.y, 0, s.world.height - Number.EPSILON) && Number.isFinite(terrainCost(terrain[tileIndex(p, s.world.width)]));
  requireValue(Array.isArray(s.sessions) && s.sessions.length <= 1 && s.creatures.length + s.sessions.length <= s.settings.capacity, "courtship slots");
  for (const session of s.sessions) {
    requireValue(exactKeys(session, ["id", "participants", "startedTick", "workStartedTick", "workTicks", "nest", "targets", "paths"]) && /^s_[0-9]{8}$/.test(session.id) && integer(Number(session.id.slice(2)), 1, s.counters.session - 1) && Array.isArray(session.participants) && session.participants.length === 2 && Array.isArray(session.targets) && session.targets.length === 2 && Array.isArray(session.paths) && session.paths.length === 2 && integer(session.startedTick, 0, s.clock.tick) && integer(session.workTicks, 0, config.breeding.courtshipWorkTicks - 1) && (session.workStartedTick === null ? session.workTicks === 0 : integer(session.workStartedTick, session.startedTick, s.clock.tick)) && session.nest.x === config.breeding.nest.x && session.nest.y === config.breeding.nest.y, "courtship record");
    const parents2 = session.participants.map((id) => s.creatures.find((c) => c.id === id));
    requireValue(parents2.every((c) => c && c.stage === "adult" && c.currentAction === null && !locked.has(c.id)) && parents2[0].id !== parents2[1].id && permittedKinship(s, parents2[0].organismId, parents2[1].organismId), "courtship participants");
    requireValue(!policyReason(s, parents2[0], parents2[1]) && parents2.every((c) => !breedingReason(s, c, "completion", true)), "courtship eligibility/policies");
    for (let i = 0; i < 2; i++) {
      const c = parents2[i];
      locked.add(c.id);
      let previous = c.position;
      requireValue(walkable(session.targets[i]) && Array.isArray(session.paths[i]), "courtship target");
      for (const p of session.paths[i]) {
        requireValue(walkable(p) && Number.isInteger(p.x - 0.5) && Number.isInteger(p.y - 0.5) && (p.x === previous.x || p.y === previous.y) && Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y) <= 1, "courtship path");
        previous = p;
      }
      requireValue(previous.x === session.targets[i].x && previous.y === session.targets[i].y, "courtship destination");
    }
  }
}
function validateLifecycle(state, breeding2 = true, social2 = true) {
  const s = state, tick = s.clock.tick;
  requireValue(Array.isArray(s.lineage) && s.lineage.every(object$1) && new Set(s.lineage.map((l) => l.id)).size === s.lineage.length, "lineage list/IDs");
  const lineage = validationLineage(s);
  const records = new Map(lineage.map((l) => [l.id, l]));
  requireValue(records.size === lineage.length, "unique archived lives");
  const organisms = new Map(s.organisms.map((o) => [o.id, o]));
  const active = new Map(s.creatures.map((c) => [c.id, c]));
  const id = (v, prefix) => typeof v === "string" && new RegExp(`^${prefix}_[0-9]{8}$`).test(v) && Number(v.slice(2)) > 0;
  for (const o of s.organisms) {
    requireValue(exactKeys(o, ["id", "parents", "appearanceSeed", "lives"]) && id(o.id, "o") && Number(o.id.slice(2)) < s.counters.organism && integer(o.appearanceSeed, 1, 4294967295) && Array.isArray(o.parents) && o.parents.length <= (breeding2 ? 2 : 1) && new Set(o.parents).size === o.parents.length && (!breeding2 || o.parents.length < 2 || o.parents[0] < o.parents[1]) && o.parents.every((p) => (organisms.has(p) || validParentMarker(p, s)) && p !== o.id && (validParentMarker(p, s) || Number(p.slice(2)) < Number(o.id.slice(2)))) && Array.isArray(o.lives) && o.lives.length > 0 && o.lives.length <= config.lifecycle.rebirth.maximum + 1, "organism legacy");
    let previousEnd = 0;
    for (const [index, life] of o.lives.entries()) {
      const record = records.get(life.creatureId);
      requireValue(
        exactKeys(life, ["creatureId", "lifeIndex", "displayName", "startedTick", "endedTick"]) && record && life.lifeIndex === index && record.organismId === o.id && record.displayName === life.displayName && integer(life.startedTick, previousEnd, tick) && life.startedTick === record.birthTick && life.endedTick === record.deathTick,
        "life/lineage reference"
      );
      if (life.endedTick === null) requireValue(index === o.lives.length - 1 && active.get(life.creatureId)?.organismId === o.id, "open life");
      else requireValue(integer(life.endedTick, life.startedTick, tick) && !active.has(life.creatureId), "closed life");
      previousEnd = life.endedTick ?? tick;
    }
  }
  for (const l of lineage) {
    const o = organisms.get(l.organismId), life = o?.lives.find((life2) => life2.creatureId === l.id);
    requireValue(exactKeys(l, ["id", "organismId", "displayName", "parentIds", "birthTick", "deathTick", "finalStage", "ageAtDeath", "topSkill", "endReason", ...breeding2 ? ["origin", "generation", "birthAptitudes", "mutations"] : [], ...s.schemaVersion >= 10 ? ["awards"] : []]) && id(l.id, "c") && Number(l.id.slice(2)) < s.counters.creature && life && typeof l.displayName === "string" && [...l.displayName].length <= 40 && integer(l.birthTick, 0, tick), "lineage record");
    requireValue(l.parentIds === null ? o.parents.length === 0 : Array.isArray(l.parentIds) && l.parentIds.length === o.parents.length && l.parentIds.length > 0 && l.parentIds.every((parentId) => {
      if (validParentMarker(parentId, s)) return true;
      const p = records.get(parentId);
      return !!p && p.id !== l.id && Number(p.id.slice(2)) < Number(l.id.slice(2)) && p.birthTick <= l.birthTick && o.parents.includes(p.organismId);
    }), "lineage parent");
    if (l.deathTick === null) {
      requireValue(active.has(l.id) && l.finalStage === null && l.ageAtDeath === null && l.topSkill === null && l.endReason === null, "living lineage");
    } else {
      requireValue(!active.has(l.id) && integer(l.deathTick, l.birthTick, tick) && l.finalStage === "elder" && l.ageAtDeath === lifespan(life.lifeIndex) && (l.endReason === "oldAge" || l.endReason === "rebirth"), "closed lineage");
      const top = l.topSkill;
      requireValue(top && exactKeys(top, ["skill", "level", "xp", "aptitude"]) && skillKeys.includes(top.skill) && finite(top.aptitude, 0, 1) && integer(top.level, 0, config.skillCatalog[top.skill].levelCap), "final top skill");
      const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[top.skill];
      const cap = Math.floor(config.skills.capBase + config.skills.capRange * top.aptitude);
      requireValue(finite(top.xp, 0, xpAtLevel(cap, top.skill)) && top.level === Math.min(
        cap,
        Math.floor((-a + Math.sqrt(a * a + 4 * b * top.xp)) / (2 * b))
      ), "final XP/level");
    }
  }
  for (const c of s.creatures) {
    const record = records.get(c.id);
    requireValue(record && record.organismId === c.organismId && record.deathTick === null && integer(c.age) && stageAtAge(c.age, c.lifeIndex) === c.stage && c.age - stageStartAge(c.stage, c.lifeIndex) === tick - c.stageStartedTick && exactKeys(c.welfare, ["total", "ticks"]) && integer(c.welfare.ticks, 0, tick - record.birthTick) && finite(c.welfare.total, 0, c.welfare.ticks), "age/stage/welfare");
    if (!config.lifecycle.stages[c.stage].mobile) requireValue(c.needs === null && c.currentAction === null && Object.values(c.xp).every((x) => x === 0) && Object.values(c.trainingTicks).every((x) => x === 0) && Object.keys(c.skillBonuses).length === 0 && c.welfare.ticks === 0, "dormant life");
  }
  requireValue(Array.isArray(s.relationships) && s.relationships.every(object$1), "rebirth bond records");
  const pairs = /* @__PURE__ */ new Set();
  for (const r of s.relationships) {
    const pair = `${r.a}:${r.b}`;
    requireValue(exactKeys(r, ["a", "b", "bond", "mateBond", "rivalry", "familiarity", "lastContactTick", "lastDecayTick", ...social2 ? ["history"] : []]) && organisms.has(r.a) && organisms.has(r.b) && r.a < r.b && !pairs.has(pair) && finite(r.bond, -100, 100) && finite(r.mateBond, 0, 100) && finite(r.rivalry, 0, 100) && finite(r.familiarity, 0, 1) && integer(r.lastContactTick, 0, tick) && integer(r.lastDecayTick, 0, tick), "rebirth bond");
    pairs.add(pair);
  }
  requireValue(Array.isArray(s.events) && s.events.length <= config.lifecycle.eventLogLimit && s.events.every(object$1), "life event log");
  let previousTick = 0, previousId = 0;
  for (const e of s.events) {
    requireValue(exactKeys(e, ["id", "tick", "creatureId", "kind", "from", "to", "relatedCreatureId", ...Object.hasOwn(e, "command") ? ["command"] : [], ...social2 && Object.hasOwn(e, "socialResult") ? ["socialResult"] : [], ...s.schemaVersion >= 9 && Object.hasOwn(e, "competitionEvent") ? ["competitionEvent"] : []]) && id(e.id, "e") && integer(Number(e.id.slice(2)), previousId + 1, s.counters.event - 1) && integer(e.tick, previousTick, tick) && records.has(e.creatureId) && (breeding2 ? ["spawn", "hatch", "stage", "death", "rebirth", "debugStage", "courtship", "mating", "eggLaid", "intervention", "forceBreed", "rescue", "courtshipAborted", ...social2 ? ["friendship", "rivalry", "contest", "mateBondFormed", "mateBondBroken", "mourning", "debugAffinity", ...s.schemaVersion >= 9 ? ["competitionCreated", "competitionOpened", "competitionEntered", "competitionStarted", "competitionResult", "competitionCancelled", "competitionDropped", ...s.schemaVersion >= 10 ? ["prizeEscrowed", "prizeRefunded", "prizeAwarded", "prizeReturned", "trophyEarned", "prizeFruitEaten", "dailyCache", "inventoryOverflow"] : []] : []] : []] : ["spawn", "hatch", "stage", "death", "rebirth", "replacement", "debugStage"]).includes(e.kind) && (e.from === null || lifeStages.includes(e.from)) && (e.to === "dead" || lifeStages.includes(e.to)) && (e.relatedCreatureId === null || records.has(e.relatedCreatureId)), "life event");
    if (e.competitionEvent) requireValue(s.schemaVersion >= 9 && (e.kind.startsWith("competition") || s.schemaVersion >= 10) && exactKeys(e.competitionEvent, ["id", "reason"]) && /^cpt_[0-9]{8}$/.test(e.competitionEvent.id) && (e.competitionEvent.reason === null || typeof e.competitionEvent.reason === "string"), "competition event");
    if (e.kind === "death") requireValue(e.from === "elder" && e.to === "dead" && records.get(e.creatureId).deathTick === e.tick, "death event");
    if (e.kind === "hatch") requireValue((e.from === "egg" || e.from === "cocoon") && e.to === "baby", "hatch event");
    if (e.socialResult) requireValue(e.kind === "contest" && exactKeys(e.socialResult, ["skill", "winnerId", "margin"]) && (e.socialResult.skill === null || skillKeys.includes(e.socialResult.skill)) && (e.socialResult.winnerId === null || records.has(e.socialResult.winnerId)) && finite(e.socialResult.margin, 0, Number.MAX_SAFE_INTEGER), "contest event");
    previousTick = e.tick;
    previousId = Number(e.id.slice(2));
  }
}
function validateFoodExperience(c, tick, started, lifecycle2) {
  requireValue(exactKeys(c.foodPreferences, fruitKinds), "food preference table");
  let meals = 0;
  for (const kind of fruitKinds) {
    const memory = c.foodPreferences[kind];
    requireValue(exactKeys(memory, ["learnedMean", "samples"]) && finite(memory.learnedMean, -1, 1) && integer(memory.samples), "food memory");
    meals += memory.samples;
  }
  requireValue(Array.isArray(c.lastFiveFoods) && (lifecycle2 && c.lifeIndex > 0 ? c.lastFiveFoods.length <= Math.min(meals, config.food.historyLength) : c.lastFiveFoods.length === Math.min(meals, config.food.historyLength)) && c.lastFiveFoods.every((kind) => fruitKinds.includes(kind)), "food history");
  for (const kind of fruitKinds) requireValue(c.lastFiveFoods.filter((f) => f === kind).length <= c.foodPreferences[kind].samples, "food history counts");
  if (meals === 0 || lifecycle2 && c.lifeIndex > 0 && c.lastFiveFoods.length === 0) requireValue(c.lastMeal === null, "unexpected last meal");
  else {
    const meal = c.lastMeal;
    requireValue(meal && exactKeys(meal, ["fruit", "tick", "preference", "reward"]) && fruitKinds.includes(meal.fruit) && c.foodPreferences[meal.fruit].samples > 0 && meal.fruit === c.lastFiveFoods.at(-1) && integer(meal.tick, started, tick) && finite(meal.preference, -1, 1) && finite(meal.reward, -1, 1), "last meal");
  }
}
function validateSave(data) {
  validateStructure(data, 10);
}
function validateLegacySave(data) {
  validateStructure(data, 1);
}
function validateMilestone3Save(data) {
  validateStructure(data, 2);
}
function validateMilestone4Save(data) {
  validateStructure(data, 3);
}
function validateMilestone5aSave(data) {
  validateStructure(data, 4);
}
function validateMilestone5bSave(data) {
  validateStructure(data, 5);
}
function validateMilestone7aSave(data) {
  validateStructure(data, 6);
}
function validateMilestone7bSave(data) {
  validateStructure(data, 7);
}
function validateMilestone8Save(data) {
  validateStructure(data, 8);
}
function historicalCap(c, skill) {
  return Math.min(config.skillCatalog[skill].levelCap, Math.floor(config.skills.capBase + config.skills.capRange * c.innateAptitude[skill]));
}
function savedLevel(c, skill, genetic) {
  if (genetic) return skillLevel(c, skill);
  const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[skill];
  return Math.min(historicalCap(c, skill), Math.floor((-a + Math.sqrt(a * a + 4 * b * c.xp[skill])) / (2 * b)));
}
function validGenome(value) {
  try {
    validateGenome(value);
    return true;
  } catch {
    return false;
  }
}
function validateSkills(c, tick, genetic, started) {
  const old = c;
  if (!genetic) requireValue(exactKeys(old.innateAptitude, skillKeys) && Object.values(old.innateAptitude).every((n) => finite(n, 0, 1)), "historical aptitudes");
  requireValue(exactKeys(c.practiceTicks, skillKeys) && exactKeys(c.trainingTicks, skillKeys) && exactKeys(c.activityPreferences, skillKeys) && object$1(c.skillBonuses), "skill memory fields");
  for (const skill of skillKeys) {
    requireValue(integer(c.trainingTicks[skill], 0, tick) && integer(c.practiceTicks[skill], 0, tick % config.clock.dayTicks) && c.practiceTicks[skill] <= c.trainingTicks[skill], "practice/training counters");
    requireValue(finite(c.xp[skill], 0, xpAtLevel(genetic ? skillCap(c, skill) : historicalCap(old, skill), skill)), "skill XP/cap");
    const memory = c.activityPreferences[skill];
    requireValue(exactKeys(memory, ["learnedMean", "samples"]) && finite(memory.learnedMean, -1, 1) && integer(memory.samples), "activity memory");
  }
  requireValue(Object.keys(c.skillBonuses).every((s) => skillKeys.includes(s)), "bonus skill");
  for (const bonus of Object.values(c.skillBonuses)) requireValue(bonus && exactKeys(bonus, ["amount", "expiresTick"]) && finite(bonus.amount, 0, 1) && integer(bonus.expiresTick, tick + 1), "skill bonus");
  const up = c.lastLevelUp;
  requireValue(up === null || exactKeys(up, ["skill", "level", "tick"]) && skillKeys.includes(up.skill) && integer(up.level, 1, savedLevel(c, up.skill, genetic)) && integer(up.tick, started, tick), "last level-up");
}
function validateStructure(data, version) {
  const legacy = version === 1, skills2 = version >= 3, genetic = version >= 4, lifecycle2 = version >= 5, breeding2 = version >= 6;
  requireValue(exactKeys(data, ["schemaVersion", "rulesVersion", "saveId", "revision", "clock", "rng", "counters", "settings", "breedingRules", "world", "creatures", "organisms", "relationships", "sessions", "competitions", "inventory", "events", "discoveries", ...lifecycle2 ? ["lineage"] : [], ...version >= 8 ? ["social"] : [], ...version >= 9 ? ["competitionHistory", "competitionState"] : [], ...version >= 10 ? ["prizeLedger", ...Object.hasOwn(data, "archive") ? ["archive"] : []] : []]), "root fields");
  const s = data;
  requireValue(allFinite(s), "nonfinite number");
  requireValue(Number(s.schemaVersion) === version && s.rulesVersion === (legacy ? "0.2.0" : version === 10 ? config.rulesVersion : version === 9 ? "0.9.0" : version === 8 ? "0.8.0" : version === 7 ? "0.7.0" : breeding2 ? "0.6.0" : lifecycle2 ? "0.5.1" : genetic ? "0.5.0" : skills2 ? "0.4.0" : "0.3.0"), "unsupported schema or rules version");
  requireValue(typeof s.saveId === "string" && /^world_[1-9]\d*$/.test(s.saveId) && integer(Number(s.saveId.slice(6)), 1, 4294967295), "seed identity");
  requireValue(integer(s.revision), "revision");
  requireValue(exactKeys(s.clock, ["tick", "wallAnchorMs", "speed", "offlineEnabled", "fractionalSeconds", "catchup"]), "clock fields");
  requireValue(integer(s.clock.tick) && finite(s.clock.wallAnchorMs, 0, Number.MAX_SAFE_INTEGER) && finite(s.clock.fractionalSeconds, 0, Number.MAX_SAFE_INTEGER) && (lifecycle2 ? config.clock.foregroundSpeeds : [0, 1, 10, 100]).includes(s.clock.speed) && s.clock.offlineEnabled === false && s.clock.catchup === null, "clock");
  requireValue(exactKeys(s.rng, ["world", "genetics", "competition"]) && Object.values(s.rng).every((n) => integer(n, 1, 4294967295)), "RNG streams");
  requireValue(exactKeys(s.counters, ["creature", "organism", "item", "plant", "fruit", "session", "competition", "event"]) && Object.values(s.counters).every((n) => integer(n, 1)), "ID counters");
  const retiredSetting = ["auto", "Replace", "OnDeath"].join("");
  requireValue(exactKeys(s.settings, ["autoBreed", "autoImmigration", "capacity", ...version >= 9 ? ["autoCompetitions"] : [], ...version >= 10 ? ["autoPrizes"] : [], ...breeding2 ? ["extinctionRescue"] : lifecycle2 ? [retiredSetting] : []]) && s.settings.capacity === (breeding2 ? config.lifecycle.capacity : lifecycle2 ? 8 : 30) && (breeding2 ? typeof s.settings.extinctionRescue === "boolean" && typeof s.settings.autoBreed === "boolean" : s.settings.autoBreed === false && (!lifecycle2 || typeof s.settings[retiredSetting] === "boolean")) && (version < 9 || typeof s.settings.autoCompetitions === "boolean") && (version < 10 || typeof s.settings.autoPrizes === "boolean") && s.settings.autoImmigration === false, "milestone settings");
  requireValue(exactKeys(s.breedingRules, ["blockedPairs", "encouragedPairs", "exclusivePairs", ...breeding2 ? ["blockedIndividuals", "encouragedIndividuals"] : []]), "breeding rule fields");
  for (const list of [...version < 9 ? [s.competitions] : [], s.discoveries, ...!breeding2 ? [...Object.values(s.breedingRules), s.sessions] : [], ...!lifecycle2 ? [s.relationships, s.events] : []]) {
    requireValue(Array.isArray(list) && list.length === 0, "unsupported later-milestone records");
  }
  requireValue(exactKeys(s.world, ["width", "height", "terrainRle", "terrainRevision", "items", "plants", "looseFruit", "nextImmigrationTick", "lastCacheDay"]), "world fields");
  const w = s.world;
  requireValue(w.width === config.world.widthTiles && w.height === config.world.heightTiles, "map dimensions");
  requireValue(Array.isArray(w.terrainRle) && w.terrainRle.length > 0 && w.terrainRle.length <= w.width * w.height, "terrain runs");
  let tiles = 0;
  for (const run2 of w.terrainRle) {
    requireValue(Array.isArray(run2) && run2.length === 2 && integer(run2[0], 0, 5) && integer(run2[1], 1, w.width * w.height), "terrain run");
    tiles += run2[1];
  }
  requireValue(tiles === w.width * w.height, "terrain run total");
  requireValue(integer(w.terrainRevision) && integer(w.nextImmigrationTick) && integer(w.lastCacheDay), "world clocks");
  requireValue(Array.isArray(w.items) && w.items.length <= (skills2 ? config.training.defaults.length : 0) && Array.isArray(w.plants) && w.plants.length <= (legacy ? 0 : config.sources.defaults.length), "unsupported items/plant count");
  const baseTerrain = decodeTerrain(w.terrainRle);
  const plantIds = /* @__PURE__ */ new Set();
  const plantTiles = /* @__PURE__ */ new Set();
  for (const p of w.plants) {
    requireValue(exactKeys(p, ["id", "kind", "x", "y", "matureAtTick", "ripe", "growthProgress"]) && typeof p.id === "string" && /^p_[0-9]{8}$/.test(p.id) && Number(p.id.slice(2)) > 0 && Number(p.id.slice(2)) < s.counters.plant && !plantIds.has(p.id) && fruitKinds.includes(p.kind) && integer(p.x, 0, w.width - 1) && integer(p.y, 0, w.height - 1) && [0, 1].includes(baseTerrain[p.y * w.width + p.x]) && !plantTiles.has(p.y * w.width + p.x) && integer(p.matureAtTick, 0, s.clock.tick) && integer(p.ripe, 0, config.fruit[p.kind].capacity) && finite(p.growthProgress, 0, config.fruit[p.kind].growthTicks) && p.growthProgress < config.fruit[p.kind].growthTicks && (p.ripe < config.fruit[p.kind].capacity || p.growthProgress === 0), "fruit source");
    plantIds.add(p.id);
    plantTiles.add(p.y * w.width + p.x);
  }
  const itemIds = /* @__PURE__ */ new Set();
  for (const item of w.items) {
    requireValue(exactKeys(item, ["id", "skill", "x", "y", "width", "height"]) && typeof item.id === "string" && /^i_[0-9]{8}$/.test(item.id) && Number(item.id.slice(2)) > 0 && Number(item.id.slice(2)) < s.counters.item && !itemIds.has(item.id) && skillKeys.includes(item.skill) && config.training.defaults.some((d) => d.skill === item.skill && d.width === item.width && d.height === item.height) && integer(item.x, 0, w.width - item.width) && integer(item.y, 0, w.height - item.height), "training item");
    const cells = spotCells(item, w.width);
    requireValue(cells.every((i) => isSafeLand(baseTerrain[i]) && !plantTiles.has(i)), "training footprint");
    cells.forEach((i) => plantTiles.add(i));
    itemIds.add(item.id);
  }
  const terrain = navigationTerrain(w);
  for (const p of w.plants) requireValue(plantApproaches(p, terrain, w.width, w.height).length > 0, "source approach");
  for (const item of w.items) requireValue(trainingApproaches(item, terrain, w.width, w.height).length > 0, "training approach");
  const point = (p) => exactKeys(p, ["x", "y"]) && finite(p.x, 0, w.width) && p.x < w.width && finite(p.y, 0, w.height) && p.y < w.height;
  const walkable = (p) => point(p) && Number.isFinite(terrainCost(terrain[tileIndex(p, w.width)]));
  const id = (value, prefix) => typeof value === "string" && new RegExp(`^${prefix}_[0-9]{8}$`).test(value) && Number(value.slice(2)) > 0;
  requireValue(Array.isArray(w.looseFruit) && w.looseFruit.length <= (version >= 10 ? config.prizes.looseCapacity : config.initial.fruit.length), "fruit list");
  const fruitIds = /* @__PURE__ */ new Set();
  for (const f of w.looseFruit) {
    requireValue(exactKeys(f, ["id", "kind", "x", "y", "droppedTick", ...version >= 10 && f.prize ? ["prize"] : []]) && id(f.id, "f") && !fruitIds.has(f.id) && (legacy ? ["sunapple", "dewberry", "cloudplum", "vinefig"].includes(f.kind) : fruitKinds.includes(f.kind)) && finite(f.x, 0, w.width) && f.x < w.width && finite(f.y, 0, w.height) && f.y < w.height && integer(f.droppedTick, 0, s.clock.tick) && Number(f.id.slice(2)) < s.counters.fruit, "fruit record");
    fruitIds.add(f.id);
  }
  requireValue(Array.isArray(s.creatures) && s.creatures.length <= (legacy ? 1 : breeding2 ? config.lifecycle.capacity : lifecycle2 ? 8 : 3) && Array.isArray(s.organisms) && (lifecycle2 ? s.organisms.length >= s.creatures.length : s.organisms.length === s.creatures.length) && [...s.creatures, ...s.organisms].every(object$1) && (!lifecycle2 || Array.isArray(s.lineage)), "creature scope");
  requireValue(new Set(s.creatures.map((c) => c.id)).size === s.creatures.length && new Set(s.organisms.map((o) => o.id)).size === s.organisms.length && new Set(s.creatures.map((c) => c.organismId)).size === s.creatures.length, "unique creature/organism IDs");
  for (const c of s.creatures) {
    requireValue(exactKeys(c, [
      "id",
      "organismId",
      "lifeIndex",
      "displayName",
      "stage",
      "stageStartedTick",
      "position",
      "needs",
      "mood",
      "recentValence",
      "xp",
      "rng",
      "currentAction",
      "lastCompletedAction",
      "nextDecisionTick",
      ...legacy ? [] : ["foodPreferences", "lastFiveFoods", "lastMeal"],
      ...!legacy && !genetic ? ["innateBias"] : [],
      ...skills2 && !genetic ? ["innateAptitude"] : [],
      ...skills2 ? ["practiceTicks", "trainingTicks", "activityPreferences", "skillBonuses", "lastLevelUp"] : [],
      ...genetic ? ["genome", "personalityDrift", "lastPersonalityRewardTick"] : [],
      ...lifecycle2 ? ["age", "welfare"] : [],
      ...breeding2 ? ["breeding"] : [],
      ...version >= 7 ? ["appearanceModifiers"] : [],
      ...version >= 8 ? ["social"] : [],
      ...version >= 9 ? ["competition"] : [],
      ...version >= 10 ? ["awards"] : []
    ]), "creature fields");
    requireValue(id(c.id, "c") && Number(c.id.slice(2)) < s.counters.creature && id(c.organismId, "o") && (lifecycle2 ? integer(c.lifeIndex, 0, config.lifecycle.rebirth.maximum) && lifeStages.includes(c.stage) : c.lifeIndex === 0 && c.stage === "adult") && integer(c.stageStartedTick, 0, s.clock.tick) && typeof c.displayName === "string" && [...c.displayName].length <= 40 && walkable(c.position), "creature identity/position");
    requireValue((lifecycle2 && !config.lifecycle.stages[c.stage].mobile ? c.needs === null : c.needs && exactKeys(c.needs, needKeys) && Object.values(c.needs).every((n) => finite(n, 0, 100))) && finite(c.mood, -1, 1) && finite(c.recentValence, -0.5, 0.5), "needs/mood");
    requireValue(exactKeys(c.xp, skillKeys) && (skills2 || Object.values(c.xp).every((n) => n === 0)), "skill XP fields");
    const started = lifecycle2 ? s.lineage.find((l) => l.id === c.id)?.birthTick ?? 0 : c.stageStartedTick;
    if (genetic) {
      requireValue(validGenome(c.genome), "creature genome");
      const traits = config.genes.filter((g) => g.traitGroup === "personality").map((g) => g.trait);
      requireValue(exactKeys(c.personalityDrift, traits) && Object.values(c.personalityDrift).every((n) => finite(n, -config.personality.driftLimit, config.personality.driftLimit)) && (c.lastPersonalityRewardTick === null || integer(c.lastPersonalityRewardTick, started, s.clock.tick)), "personality memory");
    }
    if (skills2) validateSkills(c, s.clock.tick, genetic, started);
    if (version >= 7) validateAppearanceModifiers(c, s.clock.tick);
    requireValue(integer(c.rng, 1, 4294967295) && integer(c.nextDecisionTick) && (c.lastCompletedAction === null || actionKinds.includes(c.lastCompletedAction) && (skills2 || !trainingSkill(c.lastCompletedAction)) && (version >= 9 || !["enterCompetition", "attendCompetition"].includes(c.lastCompletedAction)) && (version >= 8 || !["play", "comfort", "contest", "avoid"].includes(c.lastCompletedAction))), "creature decision state");
    if (!legacy) validateFoodExperience(c, s.clock.tick, started, lifecycle2);
    if (!legacy && !genetic) {
      const old = c;
      requireValue(exactKeys(old.innateBias, tasteKeys) && Object.values(old.innateBias).every((n) => finite(n, 0, 1)), "historical taste bias");
    }
    if (c.currentAction !== null) {
      const a = c.currentAction;
      requireValue(object$1(a), "action object");
      const optionalPlant = !legacy && Object.hasOwn(a, "targetPlantId");
      const optionalItem = skills2 && Object.hasOwn(a, "targetItemId");
      const workStart = skills2 && Object.hasOwn(a, "workStart");
      const partner = version >= 8 && Object.hasOwn(a, "targetCreatureId");
      requireValue(exactKeys(a, [
        "kind",
        "target",
        "targetFruitId",
        "path",
        "workTicks",
        ...optionalPlant ? ["targetPlantId"] : [],
        ...optionalItem ? ["targetItemId"] : [],
        ...workStart ? ["workStart"] : [],
        ...partner ? ["targetCreatureId"] : []
      ]) && actionKinds.includes(a.kind) && !["enterCompetition", "attendCompetition", "court", "play", "comfort", "contest"].includes(a.kind) && (version >= 8 || a.kind !== "avoid") && (skills2 || !trainingSkill(a.kind)) && walkable(a.target) && integer(a.workTicks, 0, config.actions[a.kind].workTicks - 1) && Array.isArray(a.path) && a.path.length <= w.width * w.height, "action state");
      let previous = c.position;
      for (const p of a.path) {
        requireValue(walkable(p) && Number.isInteger(p.x - 0.5) && Number.isInteger(p.y - 0.5) && (p.x === previous.x || p.y === previous.y) && Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y) <= 1, "cardinal action path");
        previous = p;
      }
      requireValue(a.path.length > 0 || a.target.x === c.position.x && a.target.y === c.position.y, "work location");
      if (a.path.length > 0) requireValue(previous.x === a.target.x && previous.y === a.target.y, "path destination");
      if (a.kind === "eat") {
        requireValue(!optionalPlant || typeof a.targetPlantId === "string" && plantIds.has(a.targetPlantId) && Number.isInteger(a.target.x - 0.5) && Number.isInteger(a.target.y - 0.5), "source claim");
        requireValue(validFoodClaim(s, c, a), "food claim");
      } else requireValue(a.targetFruitId === null && !optionalPlant, "unexpected food claim");
      requireValue(a.kind === "avoid" ? partner && s.creatures.some((c2) => c2.id === a.targetCreatureId) : !partner, "social action target");
      if (a.kind === "graze") requireValue(terrain[tileIndex(a.target, w.width)] === 0, "grazing terrain");
      if (a.kind === "sleep" || a.kind === "idle") requireValue(isSafeLand(terrain[tileIndex(a.target, w.width)]), "rest terrain");
      const skill = trainingSkill(a.kind);
      if (skill) {
        requireValue(validTraining(s, c, a, terrain), "training claim/terrain");
        requireValue(a.workTicks === 0 ? !workStart : workStart, "training work start");
        if (workStart) requireValue(a.workStart && exactKeys(a.workStart, ["wellbeing", "level"]) && finite(a.workStart.wellbeing, 0, 1) && integer(a.workStart.level, 0, savedLevel(c, skill, genetic)), "training reward checkpoint");
      } else requireValue(!optionalItem && !workStart, "unexpected training state");
    }
    const o = s.organisms.find((o2) => o2.id === c.organismId);
    requireValue(o && exactKeys(o, ["id", "parents", "appearanceSeed", "lives", ...!genetic ? ["genome"] : []]) && Number(o.id.slice(2)) < s.counters.organism && Array.isArray(o.parents) && (lifecycle2 || o.parents.length === 0) && integer(o.appearanceSeed, 1, 4294967295), "organism reference");
    requireValue(Array.isArray(o.lives) && (lifecycle2 || o.lives.length === 1), "life record");
    const life = o.lives.find((l) => l.creatureId === c.id);
    requireValue(life && exactKeys(life, ["creatureId", "lifeIndex", "displayName", "startedTick", "endedTick"]) && life.creatureId === c.id && life.lifeIndex === c.lifeIndex && life.displayName === c.displayName && integer(life.startedTick, 0, s.clock.tick) && life.endedTick === null, "open life reference");
    if (!genetic) requireValue(validGenome(o.genome), "historical genome");
  }
  if (lifecycle2) validateLifecycle(s, breeding2, version >= 8);
  if (breeding2) validateBreeding(s);
  if (version >= 8) validateSocial(s);
  if (version >= 9) validateCompetitions(s);
  requireValue(exactKeys(s.inventory, ["fruit", "seeds", "items", "cosmetics"]) && Object.entries(emptyInventory).every(([key2, fixture]) => {
    const group = s.inventory[key2];
    return exactKeys(group, Object.keys(fixture)) && Object.values(group).every((n) => version >= 10 ? integer(n) : n === 0);
  }), "inventory");
  if (version >= 10) validatePrizes(s);
}
function validateMilestone9aSave(data) {
  validateStructure(data, 9);
}
function emptyCompetitionMemory() {
  return { nextEntryTick: 0, stats: { entered: 0, wins: 0, podiums: 0, bestPlacement: {} } };
}
function emptyCompetitionState() {
  const bands = (n) => Array.from({ length: n + 1 }, () => ({ entries: 0, wins: 0 }));
  return { skillCooldowns: {}, nextAutoTick: config.competitions.autoCadenceTicks, statistics: {
    held: 0,
    cancelled: 0,
    cancellationReasons: {},
    entrants: 0,
    dropped: 0,
    accepted: 0,
    entryBands: Array.from({ length: config.competitions.report.levelBands.length + 1 }, () => ({ considered: 0, entered: 0 })),
    aptitudeBands: bands(config.competitions.report.aptitudeBands.length),
    levelBands: bands(config.competitions.report.levelBands.length),
    placementCorrelation: { count: 0, levels: 0, levelsSquared: 0, placements: 0, placementsSquared: 0, levelPlacements: 0 }
  } };
}
Math.pow(0.5, config.clock.tickSeconds / (config.clock.dayTicks * config.appearance.modifiers.halfLifeDays));
function defaultFoodExperience() {
  return {
    foodPreferences: Object.fromEntries(fruitKinds.map((kind) => [kind, { learnedMean: 0, samples: 0 }])),
    lastFiveFoods: [],
    lastMeal: null
  };
}
function randomGenome(rng) {
  const genome = {};
  const draw = () => {
    const result = uniform(rng);
    rng = result.state;
    return result.value;
  };
  for (const key2 of chromosomes) {
    const definitions = chromosomeLoci(key2);
    const haplotype = () => definitions.map((locus) => {
      if (locus.dominanceType === "categorical") {
        let sample = draw();
        const option = locus.options.find((o) => {
          sample -= o.founderWeight;
          return sample < 0;
        }) ?? locus.options.at(-1);
        return { v: option.value, d: option.dominance };
      }
      const [min, max] = locus.founderRange;
      return { v: min + Math.floor(draw() * (max - min + 1)), d: draw() < 1 / 2 ? 0 : 1 };
    });
    const chromosome = { haplotypes: [haplotype(), haplotype()] };
    genome[key2] = chromosome;
  }
  return { genome, rng };
}
function genomeSeed(seed, id) {
  let rng = normalizeSeed(seed);
  for (const char of id) rng = normalizeSeed(Math.imul(rng ^ char.charCodeAt(0), 16777619));
  return normalizeSeed(Math.imul(rng ^ rng >>> 16, 2246822507));
}
function addLifecycle(data) {
  const creatures = data.creatures.map((c) => ({
    ...c,
    age: stageStartAge("adult"),
    appearanceModifiers: [],
    awards: emptyAwards(),
    social: emptySocialMemory(),
    competition: emptyCompetitionMemory(),
    breeding: { cooldownUntil: 0, clutches: 0, nextAttemptTick: 0 },
    stageStartedTick: data.clock.tick,
    welfare: { total: 0, ticks: 0 }
  }));
  return {
    ...data,
    schemaVersion: 10,
    rulesVersion: config.rulesVersion,
    creatures,
    social: emptySocialState(),
    relationships: [],
    competitionHistory: [],
    competitionState: emptyCompetitionState(),
    settings: { autoBreed: true, autoImmigration: false, capacity: config.lifecycle.capacity, extinctionRescue: config.breeding.extinctionRescue, autoCompetitions: false, autoPrizes: false },
    breedingRules: { blockedPairs: [], encouragedPairs: [], exclusivePairs: [], blockedIndividuals: [], encouragedIndividuals: [] },
    sessions: [],
    lineage: creatures.map((c) => newLineage(c, data.organisms.find((o) => o.id === c.organismId).lives[0].startedTick))
  };
}
function upgrade(data) {
  const creatures = data.creatures.map((old) => {
    const { innateBias: oldTaste, innateAptitude: oldAptitude, ...rest } = old;
    const c = {
      ...defaultFoodExperience(),
      ...emptySkillExperience(),
      ...rest,
      appearanceModifiers: [],
      awards: emptyAwards(),
      social: emptySocialMemory(),
      competition: emptyCompetitionMemory(),
      genome: randomGenome(genomeSeed(Number(data.saveId.slice(6)), old.id)).genome,
      age: stageStartAge("adult"),
      breeding: { cooldownUntil: 0, clutches: 0, nextAttemptTick: 0 },
      stageStartedTick: data.clock.tick,
      welfare: { total: 0, ticks: 0 },
      personalityDrift: zeroPersonalityDrift(),
      lastPersonalityRewardTick: null
    };
    for (const skill of skillKeys) {
      const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[skill];
      const required = Math.ceil((-a + Math.sqrt(a * a + 4 * b * c.xp[skill])) / (2 * b));
      if (skillCap(c, skill) < required) {
        const [min, max] = locusFor("aptitudes", skill).definition.alleleRange;
        const q = Math.ceil((required - config.skills.capBase) / config.skills.capRange * (max - min)) / (max - min);
        c.genome = setTraitValue(c.genome, "aptitudes", skill, Math.max(0, Math.min(1, q)));
      }
    }
    return c;
  });
  const migrated = {
    ...data,
    schemaVersion: 10,
    rulesVersion: config.rulesVersion,
    creatures,
    social: emptySocialState(),
    relationships: [],
    competitionHistory: [],
    competitionState: emptyCompetitionState(),
    settings: { autoBreed: true, autoImmigration: false, capacity: config.lifecycle.capacity, extinctionRescue: config.breeding.extinctionRescue, autoCompetitions: false, autoPrizes: false },
    breedingRules: { blockedPairs: [], encouragedPairs: [], exclusivePairs: [], blockedIndividuals: [], encouragedIndividuals: [] },
    sessions: [],
    lineage: creatures.map((c) => newLineage(c, data.organisms.find((o) => o.id === c.organismId).lives[0].startedTick)),
    organisms: data.organisms.map(({ genome, ...organism }) => {
      return organism;
    })
  };
  const current = upgradePrizes(migrated);
  const sources2 = data.schemaVersion === 1 ? withDefaultSources(current) : current;
  return data.schemaVersion < 3 ? withDefaultTraining(sources2) : sources2;
}
function addBreeding(data) {
  const creatures = data.creatures.map((c) => ({ ...c, appearanceModifiers: [], awards: emptyAwards(), social: emptySocialMemory(), competition: emptyCompetitionMemory(), breeding: { cooldownUntil: 0, clutches: 0, nextAttemptTick: 0 } }));
  const lineage = [];
  for (const old of data.lineage) {
    const living = creatures.find((c) => c.organismId === old.organismId);
    const parents2 = old.parentIds?.map((id) => lineage.find((l) => l.id === id));
    lineage.push({
      ...old,
      awards: emptyAwards(),
      origin: old.parentIds ? "legacy" : "founder",
      generation: parents2?.length ? 1 + Math.max(...parents2.map((p) => p.generation)) : 0,
      birthAptitudes: living ? derivePhenotype(living.genome).aptitudes : Object.fromEntries(skillKeys.map((k) => [k, 0])),
      mutations: []
    });
  }
  return {
    ...data,
    schemaVersion: 10,
    rulesVersion: config.rulesVersion,
    creatures,
    lineage,
    social: emptySocialState(),
    relationships: [],
    competitionHistory: [],
    competitionState: emptyCompetitionState(),
    settings: { autoBreed: true, autoImmigration: false, capacity: config.lifecycle.capacity, extinctionRescue: config.breeding.extinctionRescue, autoCompetitions: false, autoPrizes: false },
    breedingRules: { ...data.breedingRules, blockedIndividuals: [], encouragedIndividuals: [] },
    sessions: [],
    events: data.events.map((e) => ({ ...e, kind: e.kind === "replacement" ? "spawn" : e.kind }))
  };
}
function migrateSave(data) {
  if (!data || typeof data !== "object" || !("schemaVersion" in data)) return data;
  if (data.schemaVersion === 10 && "rulesVersion" in data && data.rulesVersion === "0.9.1") return { ...data, rulesVersion: config.rulesVersion };
  if (data.schemaVersion === 1) {
    validateLegacySave(data);
    return finish(upgrade(data));
  }
  if (data.schemaVersion === 2) {
    validateMilestone3Save(data);
    return finish(upgrade(data));
  }
  if (data.schemaVersion === 3) {
    validateMilestone4Save(data);
    return finish(upgrade(data));
  }
  if (data.schemaVersion === 5) {
    validateMilestone5bSave(data);
    return finish(addBreeding(data));
  }
  if (data.schemaVersion === 4) {
    validateMilestone5aSave(data);
    return finish(addLifecycle(data));
  }
  if (data.schemaVersion === 6) {
    validateMilestone7aSave(data);
    const old = data;
    return finish({
      ...old,
      schemaVersion: 10,
      rulesVersion: config.rulesVersion,
      settings: { ...old.settings, autoCompetitions: false, autoPrizes: false },
      social: emptySocialState(),
      relationships: [],
      competitionHistory: [],
      competitionState: emptyCompetitionState(),
      creatures: old.creatures.map((c) => ({ ...c, appearanceModifiers: [], awards: emptyAwards(), social: emptySocialMemory(), competition: emptyCompetitionMemory() }))
    });
  }
  if (data.schemaVersion === 7) {
    validateMilestone7bSave(data);
    const old = data;
    return finish({
      ...old,
      schemaVersion: 10,
      rulesVersion: config.rulesVersion,
      settings: { ...old.settings, autoCompetitions: false, autoPrizes: false },
      social: emptySocialState(),
      relationships: [],
      competitionHistory: [],
      competitionState: emptyCompetitionState(),
      creatures: old.creatures.map((c) => ({ ...c, awards: emptyAwards(), social: emptySocialMemory(), competition: emptyCompetitionMemory() }))
    });
  }
  if (data.schemaVersion === 8) {
    validateMilestone8Save(data);
    const old = data;
    return upgradePrizes({
      ...old,
      schemaVersion: 10,
      rulesVersion: config.rulesVersion,
      competitionHistory: [],
      competitionState: emptyCompetitionState(),
      settings: { ...old.settings, autoCompetitions: false, autoPrizes: false },
      creatures: old.creatures.map((c) => ({ ...c, awards: emptyAwards(), competition: emptyCompetitionMemory() }))
    });
  }
  if (data.schemaVersion === 9) {
    validateMilestone9aSave(data);
    return upgradePrizes(data);
  }
  return data;
}
function finish(data) {
  const state = upgradePrizes(data);
  state.settings = { ...state.settings, autoCompetitions: false, autoPrizes: false };
  initializeFamily(state);
  return state;
}
function upgradePrizes(data) {
  const s = JSON.parse(JSON.stringify(data));
  s.schemaVersion = 10;
  s.rulesVersion = config.rulesVersion;
  s.inventory = starterInventory();
  s.prizeLedger = initialPrizeLedger();
  s.settings.autoPrizes = false;
  s.world.lastCacheDay = Math.floor(s.clock.tick / config.clock.dayTicks);
  for (const c of s.creatures) c.awards = { ...emptyAwards(), wins: c.competition.stats.wins };
  for (const l of s.lineage) l.awards = emptyAwards();
  for (const e of [...s.competitions, ...s.competitionHistory]) {
    e.prize = null;
    e.awarded = e.status === "resolved";
    e.escrowState = "none";
    e.deliveries = [];
  }
  for (const plant of s.world.plants) {
    const replacement = config.prizes.rareSourceReplacement[plant.kind];
    if (replacement) {
      plant.kind = replacement;
      plant.growthProgress = 0;
    }
  }
  return s;
}
function encodeSave(state) {
  validateSave(state);
  return JSON.stringify(state);
}
function decodeSave(json) {
  const data = migrateSave(JSON.parse(json));
  validateSave(data);
  return data;
}
export {
  decodeSave,
  encodeSave
};

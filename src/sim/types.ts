/** Canonical plain-data contracts. See docs/DECISIONS.md for the missing companion schema. */
export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
export type Need = 'hunger' | 'fatigue' | 'boredom' | 'loneliness' | 'stress';
export type Needs = Record<Need, number>;
export type Skill = 'run' | 'swim' | 'fly' | 'strength' | 'stamina';
export type LifeStage = 'egg' | 'baby' | 'juvenile' | 'adult' | 'elder' | 'cocoon';
export interface StageDefinition {
  durationTicks: number; mobile: boolean; scale: number; saturationMultiplier: number;
  needMultiplier: number; xpMultiplier: number; skillCap: number; performanceMultiplier: number;
}
export interface Welfare { total: number; ticks: number }
export interface TopSkill { skill: Skill; level: number; xp: number; aptitude: number }
export interface LineageRecord {
  awards: CreatureAwards;
  id: string; organismId: string; displayName: string; parentIds: string[] | null;
  birthTick: number; deathTick: number | null; finalStage: LifeStage | null;
  ageAtDeath: number | null; topSkill: TopSkill | null; endReason: 'oldAge' | 'rebirth' | null;
  origin: 'founder' | 'birth' | 'rescue' | 'legacy'; generation: number; birthAptitudes: Record<Skill, number>; mutations: MutationRecord[];
}
export interface LifeEvent {
  id: string; tick: number; creatureId: string;
  kind: 'spawn' | 'hatch' | 'stage' | 'death' | 'rebirth' | 'debugStage' | 'courtship' | 'mating' | 'eggLaid' | 'intervention' | 'forceBreed' | 'rescue' | 'courtshipAborted'
    | 'friendship' | 'rivalry' | 'contest' | 'share' | 'steal' | 'fight' | 'mateBondFormed' | 'mateBondBroken' | 'mourning' | 'debugAffinity'
    | 'competitionCreated' | 'competitionOpened' | 'competitionEntered' | 'competitionStarted' | 'competitionResult' | 'competitionCancelled' | 'competitionDropped'
    | 'prizeEscrowed' | 'prizeRefunded' | 'prizeAwarded' | 'prizeReturned' | 'trophyEarned' | 'prizeFruitEaten' | 'dailyCache' | 'inventoryOverflow';
  from: LifeStage | null; to: LifeStage | 'dead'; relatedCreatureId: string | null;
  competitionEvent?: { id: string; reason: string | null };
  command?: PlayerCommand;
  socialResult?: { skill: Skill | null; winnerId: string | null; margin: number };
}
export interface SpawnOptions { stage?: 'adult' | 'egg'; parentIds?: [string, string]; near?: Point; origin?: LineageRecord['origin']; mutations?: MutationRecord[] }
export type OrganismPair = [string, string];
export interface BreedingState { cooldownUntil: number; clutches: number; nextAttemptTick: number }
export interface Courtship {
  id: string; participants: [string, string]; startedTick: number; workStartedTick: number | null;
  workTicks: number; /** Legacy field name: the local land position where eggs are laid. */ nest: Point; targets: [Point, Point]; paths: [Point[], Point[]];
}
export type PlayerCommand =
  | { kind: 'pair' | 'encouragePair' | 'blockPair'; a: string; b: string; enabled: boolean }
  | { kind: 'blockCreature' | 'encourageCreature'; id: string; enabled: boolean }
  | { kind: 'forceBreed'; a: string; b: string }
  | { kind: 'setAffinity'; a: string; b: string; value: number }
  | { kind: 'extinctionRescue'; enabled: boolean }
  | { kind: 'createCompetition'; skill: Skill; format: CompetitionFormat; entryRules: CompetitionEntryRules; startDelay: number; skills?: Skill[]; prize?: PrizeSpec | null }
  | { kind: 'cancelCompetition'; id: string; debug?: boolean }
  | { kind: 'equipCosmetic'; id: string; cosmetic: CosmeticId | null };
export interface MateCompatibility {
  creatureId: string; traitSimilarity: number; tasteSimilarity: number; geneticDifference: number;
  bond: number; mateBond: number; family: FamilyTie; score: number; encouraged: boolean; reason: string | null;
}

/** Formal event contracts. Scores are committed once, separately from presentation time. */
export type CompetitionFormat = 'dash' | 'circuit' | 'power';
export type CompetitionStatus = 'scheduled' | 'entryOpen' | 'running' | 'resolved' | 'cancelled';
export type CosmeticId = 'ribbon' | 'leaf_crown' | 'star_pin';
export type ItemKind = 'nest' | 'bed' | 'track' | 'wind_perch' | 'push_stone' | 'trail_marker' | 'toy' | 'competition_pad' | 'lantern';
export type Prize = { kind: 'fruit' | 'seed'; id: FruitKind; quantity: number }
  | { kind: 'item'; id: ItemKind; quantity: number } | { kind: 'cosmetic'; id: CosmeticId; quantity: number };
/** One inventory-backed prize per unique placement, ordered by rank. */
export interface PrizeSpec { placements: ({ rank: number } & Prize)[] }
export interface PrizeDelivery { rank: number; creatureId: string | null; prize: Prize; destination: 'fruit' | 'cosmetic' | 'donated' | 'inventory'; reason: string | null }
export interface Trophy { competitionId: string; skills: Skill[]; placement: number; tick: number }
export interface CreatureAwards { owned: CosmeticId[]; equipped: CosmeticId | null; trophies: Trophy[]; wins: number; bestPerformance: Partial<Record<Skill, number>>; confidenceUntilTick: number; xpPeriod: number; xpThisPeriod: number; totalXp: number }
export interface PrizeLedger {
  supplied: Record<string, number>; eaten: Record<string, number>; overflow: Record<string, number>;
  escrowed: number; delivered: number; refunded: number; returned: number; rareFruitEaten: number;
}
export interface PrizesConfig {
  maximumRankedPrizes: number; maximumFruitPerPrize: number; stackCapacity: number; looseCapacity: number;
  deliveryWindowTicks: number; trophyLimit: number; xpPeriodTicks: number; xpPerPeriodCap: number;
  confidenceBonus: number; confidenceDays: number; rankValence: number[]; otherValence: number;
  starter: SaveState['inventory']; cache: { fruit: FruitKind[]; fruitQuantity: number; seedQuantity: number; cosmetics: CosmeticId[]; cosmeticQuantity: number };
  autoPrizes: boolean; auto: PrizeSpec[]; report: { maximumWinShare: number };
  rareSourceReplacement: Partial<Record<FruitKind, FruitKind>>;
}
export interface ItemDefinition { name: string; width: number; height: number; skill: Skill | null; effect: 'training' | 'sleep' | 'play' | 'courtship' | 'competition' | 'visual' }
export interface CompetitionEntryRules {
  allowedStages: LifeStage[]; levels: Partial<Record<Skill, { minimum: number; maximum: number }>>;
  maximumEntrants: number; needMaximum: number; stressMaximum: number; minimumMood: number; relatedEntrantsAllowed: boolean;
}
export interface CompetitionStats { entered: number; wins: number; podiums: number; bestPlacement: Partial<Record<Skill, number>> }
export interface CompetitionMemory { nextEntryTick: number; stats: CompetitionStats }
export interface CompetitionAttendance { id: string; entryPosition: Point; target: Point; path: Point[] }
export interface CompetitionSnapshot {
  id: string; organismId: string; levels: Record<Skill, number>; aptitudes: Record<Skill, number>;
  wellbeing: number; stagePerformance: number; confidence?: number;
}
export interface CompetitionPlacement { id: string; rank: number; score: number; base: number; level: number; aptitude: number }
export interface CompetitionResult {
  placements: CompetitionPlacement[]; rounds: ContestResult[];
  effects: { id: string; valence: number }[]; startRng: number; rng: number;
}
export interface Competition {
  id: string; skill: Skill; skills: Skill[]; format: CompetitionFormat; entryRules: CompetitionEntryRules;
  status: CompetitionStatus; createdTick: number; entryOpenTick: number; startTick: number; endTick: number;
  finishedTick: number | null; entrantIds: string[]; startedIds: string[]; attendance: CompetitionAttendance[];
  snapshots: CompetitionSnapshot[]; results: CompetitionResult | null;
  drops: { id: string; tick: number; reason: string }[]; cancellationReason: string | null;
  createdBy: 'player' | 'debug' | 'auto';
  prize: PrizeSpec | null;
  escrowState: 'none' | 'held' | 'released' | 'refunded'; awarded: boolean; deliveries: PrizeDelivery[];
}
export interface CompetitionStatistics {
  held: number; cancelled: number; cancellationReasons: Record<string, number>; entrants: number; dropped: number; accepted: number;
  entryBands: { considered: number; entered: number }[];
  aptitudeBands: { entries: number; wins: number }[]; levelBands: { entries: number; wins: number }[];
  placementCorrelation: { count: number; levels: number; levelsSquared: number; placements: number; placementsSquared: number; levelPlacements: number };
}
export interface CompetitionState { skillCooldowns: Partial<Record<Skill, number>>; nextAutoTick: number; statistics: CompetitionStatistics }
export interface CompetitionConfig {
  formats: { id: CompetitionFormat; name: string; rounds: number; aggregation: 'single' | 'harmonic' | 'mean'; skills: Skill[] }[];
  entry: CompetitionEntryRules; minimumEntrants: number; maximumEntrants: number; maximumConcurrent: number;
  entryWindowTicks: number; defaultStartDelay: number; minimumStartDelay: number; maximumStartDelay: number;
  durationTicks: number; skillCooldownTicks: number; historyLimit: number; elderRemainingMinimumTicks: number;
  requiredLevels: Partial<Record<Skill, number>>;
  venue: { position: Point; width: number; height: number; places: Point[]; arrivalTolerance: number; color: string; resultTicks: number };
  workEffects: Needs; stakesMultiplier: number; podiumPlaces: number;
  autoCompetitions: boolean; autoCadenceTicks: number; autoSkills: Skill[]; autoFormats: CompetitionFormat[];
  brain: { readinessReserve: number; interest: number; skillWeight: number; aptitudeWeight: number; moodWeight: number; rivalryWeight: number };
  report: { levelBands: number[]; aptitudeBands: number[]; minimumFillRate: number; maximumDropShare: number; seeds: number[]; stabilityTicks: number };
}

/** Symmetric sparse edges keyed by canonical permanent organism IDs. Family is derived. */
export interface Relationship {
  a: string; b: string; bond: number; mateBond: number;
  lastContactTick: number; lastDecayTick: number;
  history: InteractionRecord[];
}
export type FamilyTie = 'parent' | 'child' | 'sibling' | 'none';
export type SocialKind = 'play' | 'comfort' | 'contest';
export type InteractionKind = SocialKind | 'court' | 'pair' | 'avoid' | 'debug' | 'share' | 'steal' | 'fight';
export type SocialRewardKind = 'friendlyPlay' | 'rudePlay' | 'comfort' | 'contest';
export interface InteractionRecord { kind: InteractionKind; outcome: 'friendly' | 'rude' | 'neutral'; tick: number }
export interface InteractionResult {
  bond: number; mateBond: number;
  valence: [number, number]; stress: [number, number]; outcome: InteractionRecord['outcome']; rng: number;
}
export interface ContestEntrant { id: string; level: number; staminaLevel: number; wellbeing: number; stagePerformance: number; aptitude: number; confidence?: number }
export interface ContestStanding extends ContestEntrant { rank: number; base: number; score: number }
export interface ContestResult { skill: Skill; ranking: ContestStanding[]; winnerId: string | null; margin: number; startRng: number; rng: number; effects: { id: string; valence: number }[] }
export interface SocialMemory {
  nextTargetTick: number; targets: string[]; contestCooldowns: Record<string, number>;
  rivalBoosts: Partial<Record<Skill, SkillBonus>>; rivalExtraXpToday: Record<Skill, number>;
  rewardTicks: Partial<Record<SocialRewardKind, number>>; preferences: Record<SocialKind, FoodMemory>;
  mourning: { organismId: string; untilTick: number } | null;
  lastInteraction: (InteractionRecord & { partner: string }) | null;
}
export interface SocialSession {
  id: string; kind: SocialKind; participants: [string, string]; startedTick: number; workStartedTick: number | null;
  workTicks: number; targets: [Point, Point]; paths: [Point[], Point[]]; targetItemId: string | null; skill: Skill | null;
  result: ContestResult | null; workStarts: [{ wellbeing: number; level: number }, { wellbeing: number; level: number }] | null;
}
export interface SocialStatistics {
  interactions: number; friendlyPlays: number; rudePlays: number; contests: number; friendships: number; rivalries: number;
  mateBondsFormed: number; mateBondsBroken: number; matings: number; bondedMatings: number; friendMatings: number;
  aptitudeWins: { entries: number; wins: number }[];
  correlation: { count: number; levels: number; levelsSquared: number; wins: number; levelWins: number };
}
export interface SocialState { sessions: SocialSession[]; nextMaintenanceTick: number; statistics: SocialStatistics }
export interface SocialConfig {
  friendBond: number; closeFriendBond: number; dislikedBond: number; mateBondThreshold: number;
  bondBounds: [number, number]; maximumRelationships: number; relationshipsPerCreature: number; historyLimit: number;
  decayGraceDays: number; bondDecayDays: number; mateDecayGraceDays: number; mateDecayDays: number; rivalryDecayDays: number; maintenanceTicks: number;
  pruneStrength: number; initialFounderBond: number; newbornParentBond: number; newbornSiblingBond: number;
  radiusTiles: number; gridTiles: number; targetLimit: number; scanLimit: number; targetIntervalTicks: number;
  targetBondWeight: number; targetMateWeight: number; mateSeekingInterest: number; mateProgressInterest: number; targetLonelinessWeight: number; targetDistanceScale: number; inviteMinimumUtility: number; inviteCurrentUtilityMargin: number;
  proximityTiles: number; travelTimeoutTicks: number; comfortGentleness: number; comfortStressMinimum: number; comfortRecipientEffects: Needs;
  rudePlayBaseChance: number; rudePlayTraitChance: number; positiveScaleBase: number; positiveSociabilityWeight: number; affinityScaleBase: number; affinityScaleWeight: number;
  outcomes: Record<'friendlyPlay' | 'rudePlay' | 'comfort' | 'court' | 'pair' | 'avoid', Omit<InteractionResult, 'rng' | 'outcome'>>;
  contest: { rivalry: number; lowRivalry: number; competitivenessMinimum: number; bond: number; winnerValence: number; otherValence: number;
    cooldownTicks: number; skillOffset: number; conditionBase: number; conditionWeight: number; primaryWeight: number; staminaWeight: number; noiseAmplitude: number; tieEpsilon: number; aptitudeBands: number[]; rivalLossBond: number; friendLossBond: number };
  rivalry: { skillGap: number; utilityBoost: number; xpBoost: number; dailyExtraXpCap: number };
  mateAffinityWeight: number; contestAffinityWeights: [number, number]; rudeGentlenessStep: number; rudeRecipientBoldnessStep: number;
  learningFriendly: number; learningRude: number;
  avoidRadiusTiles: number; avoidDistanceTiles: number; mourning: { enabled: boolean; durationTicks: number };
  overlays: { visibility: number; maximumLineWidth: number; friendly: string; hostile: string; selected: string; effectTicks: number };
  pacing: { earlyAdultTicks: number; positiveShare: [number, number]; minimumFriendships: number; minimumRivalries: number; seeds: number[]; ticks: number };
  report: { affinityBins: number[] };
}
export type FruitKind = 'sunapple' | 'dewberry' | 'cloudplum' | 'vinefig' | 'stonepear' | 'ambermelon' | 'moonpeach' | 'sparkcherry' | 'prismpear' | 'spiralfruit';
export type Taste = Record<'sweet' | 'tart' | 'earthy', number>;
export type PersonalityTrait = 'sociability' | 'curiosity' | 'competitiveness' | 'boldness' | 'gentleness';
export type Pattern = 'solid' | 'spots' | 'stripes' | 'marbled';
export type Ears = 'round' | 'pointed' | 'folded';
export type ChromosomeKey = 'aptitude' | 'palette' | 'shape' | 'temperament';
export type TraitGroup = 'aptitudes' | 'tasteBias' | 'personality' | 'palette' | 'body';
export interface LocusDefinition {
  id: string; chromosome: ChromosomeKey; dominanceType: 'partial' | 'circular' | 'categorical';
  traitGroup: TraitGroup; trait: string;
  alleleRange?: [number, number]; founderRange?: [number, number]; traitRange?: [number, number];
  options?: { value: Pattern | Ears; dominance: 0 | 1; founderWeight: number }[];
}
export interface Phenotype {
  aptitudes: Record<Skill, number>; tasteBias: Taste; fruitTaste: Record<FruitKind, number>; personality: Record<PersonalityTrait, number>;
  /** Expressed inherited channels; learned part tiers are derived separately. */
  palette: { baseHue: number; accentHue: number; eyeHue: number; feetHue: number; tailHue: number; saturation: number; lightness: number; pattern: Pattern };
  body: { width: number; height: number; head: number; limb: number; tail: number; ears: Ears };
}
export interface GenomeResult { genome: Genome; rng: number }
export interface MutationRecord { chromosome: ChromosomeKey; locus: string; haplotype: 0 | 1; before: Allele; after: Allele }
export interface MutationResult extends GenomeResult { mutations: MutationRecord[] }
export interface OffspringPreview extends MutationResult { phenotype: Phenotype; parents: [string, string] }
export interface FoodMemory { learnedMean: number; samples: number }
export interface LastMeal { fruit: FruitKind; tick: number; preference: number; reward: number }
export interface FoodExperience {
  foodPreferences: Record<FruitKind, FoodMemory>;
  lastFiveFoods: FruitKind[];
  lastMeal: LastMeal | null;
}
export interface FoodTarget {
  fruit: FruitKind;
  target: Point;
  targetFruitId: string | null;
  targetPlantId?: string;
}
export type TrainingKind = `train_${Skill}`;
export type ActionKind = 'enterCompetition' | 'attendCompetition' | 'court' | SocialKind | 'avoid' | 'eat' | 'gather' | 'graze' | 'sleep' | 'wander' | 'idle' | TrainingKind;
export interface SkillBonus { amount: number; expiresTick: number }
export interface SkillExperience {
  practiceTicks: Record<Skill, number>;
  trainingTicks: Record<Skill, number>;
  activityPreferences: Record<Skill, FoodMemory>;
  skillBonuses: Partial<Record<Skill, SkillBonus>>;
  lastLevelUp: { skill: Skill; level: number; tick: number } | null;
}
export interface TrainingSpot extends Point {
  id: string; skill: Skill; width: number; height: number;
}
export interface SkillDefinition {
  id: Skill; name: string; trainingActivity: TrainingKind; activityName: string;
  xpLinear: number; xpQuadratic: number; levelCap: number;
}
export type Speed = 0 | 1 | 10 | 100 | 1000;
export type Terrain = 0 | 1 | 2 | 3 | 4 | 5;
export interface Point { x: number; y: number }
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'shade' | 'eye';
export type Proportion = 'width' | 'height' | 'head' | 'limb' | 'tail';
export type AppearanceGene = 'baseHue' | 'accentHue' | 'eyeHue' | 'feetHue' | 'tailHue' | 'saturation' | 'lightness' | Proportion;
export type AppearanceGenePatch = Partial<Record<AppearanceGene, number>> & { pattern?: Pattern; ears?: Ears };
export interface AppearanceModifier { type: 'dietTint'; magnitude: number; rgb: [number, number, number]; sourceFruit: FruitKind; expiresTick: number }
export interface AppearanceColor { hue: number; saturation: number; lightness: number; alpha: number }
export interface RecipeStyle {
  fillRole: ColorRole | null; strokeRole: ColorRole | null; strokeWidth: number;
  scale: Point; rotation: number; offset: Point; opacity: number; saturationMultiplier: number;
  motion?: 'eye';
}
export type DrawRecipe = RecipeStyle & (
  | { primitive: 'ellipse'; radius: Point }
  | { primitive: 'polygon' | 'path'; points: Point[]; smoothing: boolean }
);
export interface PartTier {
  tier: number; levelThreshold: number; recipe: DrawRecipe[];
  attachments?: Record<string, Point>;
  variants?: Partial<Record<Ears, DrawRecipe[]>>;
}
export interface AppearancePart { id: string; slot: string; skill: Skill | null; tiers: PartTier[]; cosmetic?: CosmeticId }
export interface AppearanceSlot {
  id: string; anchor: Point; layer: string;
  attachTo?: { partId: string; point: string; yOnly?: boolean };
  proportion: 'body' | 'head' | 'limb' | 'tail'; motion: 'body' | 'tail' | 'static';
}
export interface AppearanceConfig {
  frame: { size: number; bodyCenter: Point; maximumRadius: number; worldUnitsPerPixel: number; hitRadiusTiles: number; thoughtOffsetTiles: number; nameOffsetTiles: number };
  slots: AppearanceSlot[]; parts: AppearancePart[]; layerOrder: string[];
  conflictRule: 'highest-tier-skill-order'; skillOrder: Skill[];
  palette: { saturationBounds: [number, number]; lightnessBounds: [number, number];
    roles: Record<ColorRole, { hueGene: 'baseHue' | 'accentHue' | 'eyeHue'; saturation: [number, number]; lightness: [number, number]; alpha: number }> };
  proportions: Record<Proportion, [number, number]>;
  pattern: { fallbackSeed: number; spots: number; stripes: number; marbled: number; minRadius: number; maxRadius: number; stripeWidth: number; opacity: number; margin: number; tilt: number; amplitude: number; points: number };
  modifiers: { maximum: number; maximumPerType: number; strengthPerFruit: number; maximumStrength: number; blendWeight: number; halfLifeDays: number; expiryDays: number; minimumStrength: number };
  animation: { breathing: number; breathingSeconds: number; bobPixels: number; swayRadians: number; tiltRadians: number; blinkSeconds: number; blinkIntervalSeconds: number; closedEyeScale: number; tiredScale: number; moodThreshold: number; boundsMargin: number };
  cache: { maximum: number; scaleQuantum: number; rasterPixelBudget: number };
  bench: { creatures: number; iterations: number; warmup: number };
  dormant: { egg: DrawRecipe[]; cocoon: DrawRecipe[] };
  gallery: { seed: number; randomCount: number; cellPixels: number; background: string; gridGap: number; offspring: number; progression: number[]; distinctFraction: number; rangeCases: { id: string; patch: AppearanceGenePatch }[] };
  cues: { levelUpColor: string; levelUpRadiusTiles: number; levelUpLineWidthTiles: number };
  selection: { color: string; strokeWidthTiles: number; dashTiles: number[]; offsetYTiles: number; radiusTiles: Point };
}
export interface VisiblePart { partId: string; slot: string; tier: number; sourceSkill: Skill | null; layerIndex: number }
/** Derived only; never owned by a creature or a save. */
export interface AppearanceSpec {
  parts: VisiblePart[]; stage: LifeStage; bodyScale: number;
  baseColors: Record<ColorRole, AppearanceColor>;
  proportions: Record<Proportion, number>; ears: Ears; pattern: { kind: Pattern; seed: number };
}
export interface RngStreams { world: number; genetics: number; competition: number }
export interface Allele { v: number | Pattern | Ears; d: 0 | 1 }
export interface Chromosome { haplotypes: [Allele[], Allele[]] }
export interface Genome { aptitude: Chromosome; palette: Chromosome; shape: Chromosome; temperament: Chromosome }

export interface Action {
  kind: ActionKind;
  target: Point;
  targetFruitId: string | null;
  /** Present only for a reserved ripe fruit on a plant; target is an adjacent cell. */
  targetPlantId?: string;
  targetItemId?: string;
  targetCreatureId?: string;
  targetCompetitionId?: string;
  /** Captured at first work tick for the exact §5.4 activity reward. */
  workStart?: { wellbeing: number; level: number };
  /** Remaining cardinal waypoints; needed to resume mid-edge without rounding position. */
  path: Point[];
  workTicks: number;
}
export interface Creature extends FoodExperience, SkillExperience {
  dynasty: DerbilState;
  awards: CreatureAwards;
  /** Sole authoritative genome in this milestone, per the explicit 5a request. */
  genome: Genome;
  appearanceModifiers: AppearanceModifier[];
  social: SocialMemory;
  competition: CompetitionMemory;
  breeding: BreedingState;
  personalityDrift: Record<PersonalityTrait, number>;
  lastPersonalityRewardTick: number | null;
  id: string;
  organismId: string;
  lifeIndex: number;
  displayName: string;
  age: number;
  stage: LifeStage;
  stageStartedTick: number;
  welfare: Welfare;
  position: Point;
  /** Dormant eggs/cocoons have no needs and never run the brain. */
  needs: Needs | null;
  mood: number;
  recentValence: number;
  /** Total XP only; integer levels/caps are derived per §6, never separately saved. */
  xp: Record<Skill, number>;
  rng: number;
  currentAction: Action | null;
  lastCompletedAction: ActionKind | null;
  nextDecisionTick: number;
}
export interface Organism {
  id: string;
  parents: string[];
  appearanceSeed: number;
  lives: { creatureId: string; lifeIndex: number; displayName: string; startedTick: number; endedTick: number | null }[];
}
export interface LooseFruit extends Point { id: string; kind: FruitKind; droppedTick: number; prize?: { competitionId: string; ownerId: string | null; exclusiveUntilTick: number } }
export interface FruitSource extends Point {
  id: string;
  kind: FruitKind;
  matureAtTick: number;
  ripe: number;
  /** Bits 0 and 1 identify the two original berries. */
  berries?: [boolean, boolean];
  berryIds?: [string, string];
  growthProgress: number;
}
export interface SaveState {
  dynasty: DynastyState;
  archive?: ArchiveState;
  schemaVersion: 12;
  rulesVersion: string;
  saveId: string;
  revision: number;
  clock: {
    tick: number; wallAnchorMs: number; speed: Speed; offlineEnabled: false;
    fractionalSeconds: number; catchup: null;
  };
  rng: RngStreams;
  counters: Record<'creature' | 'organism' | 'item' | 'plant' | 'fruit' | 'session' | 'competition' | 'event', number>;
  settings: { autoBreed: boolean; autoImmigration: false; capacity: number; extinctionRescue: boolean; autoCompetitions: boolean; autoPrizes: boolean };
  breedingRules: { blockedPairs: OrganismPair[]; encouragedPairs: OrganismPair[]; exclusivePairs: OrganismPair[]; blockedIndividuals: string[]; encouragedIndividuals: string[] };
  world: {
    width: number; height: number; terrainRle: [Terrain, number][]; terrainRevision: number;
    items: TrainingSpot[]; plants: FruitSource[]; looseFruit: LooseFruit[];
    nextImmigrationTick: number; lastCacheDay: number;
  };
  creatures: Creature[];
  organisms: Organism[];
  relationships: Relationship[];
  social: SocialState;
  sessions: Courtship[];
  competitions: Competition[];
  competitionHistory: Competition[];
  competitionState: CompetitionState;
  inventory: { fruit: Record<string, number>; seeds: Record<string, number>; items: Record<string, number>; cosmetics: Record<string, number> };
  prizeLedger: PrizeLedger;
  events: LifeEvent[];
  lineage: LineageRecord[];
  discoveries: never[];
}

/** Read-only historical schemas, used solely to validate and migrate old saves. */
export type Milestone9aSaveState = Omit<SaveState, 'schemaVersion' | 'creatures' | 'competitions' | 'competitionHistory' | 'settings' | 'prizeLedger' | 'lineage'> & {
  schemaVersion: 9; creatures: Omit<Creature,'awards'>[]; lineage: Omit<LineageRecord,'awards'>[];
  competitions: Omit<Competition,'awarded' | 'escrowState' | 'deliveries'>[]; competitionHistory: Omit<Competition,'awarded' | 'escrowState' | 'deliveries'>[];
  settings: Omit<SaveState['settings'],'autoPrizes'>;
};
export type Milestone8SaveState = Omit<Milestone9aSaveState, 'schemaVersion' | 'creatures' | 'competitions' | 'competitionHistory' | 'competitionState' | 'settings'> & {
  schemaVersion: 8; creatures: Omit<Creature, 'competition' | 'awards'>[]; competitions: never[]; settings: Omit<SaveState['settings'], 'autoCompetitions' | 'autoPrizes'>;
};
export type Milestone7bSaveState = Omit<Milestone8SaveState, 'schemaVersion' | 'creatures' | 'social' | 'relationships'> & {
  schemaVersion: 7; creatures: Omit<Creature, 'social' | 'competition' | 'awards'>[]; relationships: Omit<Relationship, 'history'>[];
};
export type Milestone7aSaveState = Omit<Milestone7bSaveState, 'schemaVersion' | 'creatures'> & {
  schemaVersion: 6; creatures: Omit<Creature, 'appearanceModifiers' | 'social' | 'competition' | 'awards'>[];
};
export type Milestone5bSaveState = Omit<Milestone7bSaveState, 'schemaVersion' | 'rulesVersion' | 'creatures' | 'settings' | 'breedingRules' | 'sessions' | 'lineage' | 'events'> & {
  events: (Omit<LifeEvent,'kind' | 'command'> & { kind: 'spawn' | 'hatch' | 'stage' | 'death' | 'rebirth' | 'replacement' | 'debugStage' })[];
  schemaVersion: 5; rulesVersion: '0.5.1'; creatures: Omit<Creature, 'breeding' | 'appearanceModifiers' | 'social' | 'competition' | 'awards'>[];
  settings: Record<string, boolean | number>; breedingRules: { blockedPairs: never[]; encouragedPairs: never[]; exclusivePairs: never[] }; sessions: never[];
  lineage: Omit<LineageRecord, 'origin' | 'generation' | 'birthAptitudes' | 'mutations' | 'awards'>[];
};
export type Milestone5aCreature = Omit<Creature, 'age' | 'welfare' | 'stage' | 'needs' | 'breeding' | 'appearanceModifiers' | 'social' | 'competition' | 'awards'> & { stage: 'adult'; needs: Needs };
export type Milestone5aSaveState = Omit<Milestone7bSaveState, 'schemaVersion' | 'creatures' | 'lineage' | 'settings' | 'relationships' | 'events' | 'breedingRules' | 'sessions'> & {
  schemaVersion: 4; creatures: Milestone5aCreature[];
  breedingRules: { blockedPairs: never[]; encouragedPairs: never[]; exclusivePairs: never[] }; sessions: never[];
  settings: { autoBreed: false; autoImmigration: false; capacity: 30 };
  relationships: never[]; events: never[];
};
export type Milestone4Creature = Omit<Milestone5aCreature, 'genome' | 'personalityDrift' | 'lastPersonalityRewardTick'> & {
  innateBias: Taste; innateAptitude: Record<Skill, number>;
};
export type Milestone4SaveState = Omit<Milestone5aSaveState, 'schemaVersion' | 'creatures' | 'organisms'> & {
  schemaVersion: 3; creatures: Milestone4Creature[];
  organisms: (Organism & { genome: Genome })[];
};
export type Milestone3SaveState = Omit<Milestone4SaveState, 'schemaVersion' | 'creatures' | 'world'> & {
  schemaVersion: 2;
  creatures: Omit<Milestone4Creature, keyof SkillExperience | 'innateAptitude'>[];
  world: Omit<SaveState['world'], 'items'> & { items: never[] };
};
export type LegacySaveState = Omit<Milestone3SaveState, 'schemaVersion' | 'creatures' | 'world'> & {
  schemaVersion: 1;
  creatures: Omit<Milestone4Creature, keyof FoodExperience | keyof SkillExperience | 'innateBias' | 'innateAptitude'>[];
  world: Omit<Milestone3SaveState['world'], 'plants'> & { plants: never[] };
};

export interface Candidate {
  targetCreatureId?: string;
  targetCompetitionId?: string;
  kind: ActionKind;
  target: Point;
  targetFruitId: string | null;
  targetPlantId?: string;
  targetItemId?: string;
  relief: Needs;
  personalityFit: number;
  preference: number;
  growthInterest: number;
  socialAffinity: number;
  encouragement: number;
  courtshipInterest: number;
  estimatedTravelSeconds: number;
  predictedFatigueIncrease: number;
}
export interface UtilityScore { total: number; terms: Record<string, number> }
export interface ActionDefinition { workTicks: number; effects: Needs }
export interface FruitDefinition {
  rare: boolean;
  name: string;
  color: string;
  effects: Needs;
  taste: Taste;
  growthTicks: number;
  capacity: number;
  /** Training-rate percentages; eating grants no immediate XP. */
  skillBonuses: Partial<Record<Skill, number>>;
  skillBonusDurationTicks: number;
  /** Visual diet tint is active; mutation exposures remain outside this appearance milestone. */
  appearance: { tintRgb: string | null; exposure: { palette: number; body: number; aptitude: number } };
}
export interface Config {
  dynasty: DynastyConfig;
  health: HealthConfig;
  presentation: PresentationConfig;
  names: NamesConfig;
  robustness: RobustnessConfig;
  offline: OfflineConfig;
  prizes: PrizesConfig;
  items: Record<ItemKind, ItemDefinition>;
  rulesVersion: string;
  appearance: AppearanceConfig;
  social: SocialConfig;
  competitions: CompetitionConfig;
  clock: { tickSeconds: number; dayTicks: number; foregroundSpeeds: Speed[]; maxTicksPerFrame: number };
  needs: {
    perMinute: Needs; newborn: Needs; urgentThreshold: number; eatMinimumHunger: number;
    sleepExitFatigue: number; sleepLonelinessMultiplier: number; nightFatigueMultiplier: number;
    curiosityBoredomBase: number; curiosityBoredomWeight: number;
    sociabilityLonelinessBase: number; sociabilityLonelinessWeight: number;
  };
  mood: { needWeights: Needs; responseTicks: number; valenceDecayTicks: number; labelThreshold: number; initial: number };
  ai: {
    decisionIntervalTicks: number; minimumWorkCommitTicks: number; switchMargin: number;
    temperature: number; candidateCounts: { food: number; perSkill: number }; pathAttempts: number;
    wanderRadiusTiles: number; defaultPersonalityFit: number;
    utility: { needs: number; personality: number; preference: number; growth: number; social: number; travelPenalty: number; fatiguePenalty: number; repeatPenalty: number };
    reliefScales: Needs; travelScaleSeconds: number; fatiguePenaltyScale: number;
  };
  personality: { driftLimit: number; returnTimeDays: number; positiveEventStep: number; rewardCooldownTicks: number };
  genes: LocusDefinition[];
  genetics: { crossoverChance: number; quantitativeMutation: number; categoricalMutation: number; dominanceMutation: number;
    mutationStep: [number, number]; dominantWeight: number; circularEpsilon: number };
  skills: {
    capBase: number; capRange: number; baseXpPerSecond: number;
    aptitudeBase: number; aptitudeWeight: number; capTaper: number;
    moodBase: number; moodWeight: number;
    dedicatedQuality: number; improvisedQuality: number; dailyFullRateTicks: number;
    dailyReducedMultiplier: number; stressExclusionThreshold: number;
    learningRate: number; levelReward: number; rewardWellbeingWeight: number;
    levelUpMessageTicks: number;
  };
  lifecycle: {
    stages: Record<LifeStage, StageDefinition>; firstLife: LifeStage[]; rebornLife: LifeStage[];
    capacity: number; deathFadeRealSeconds: number;
    rebirth: { welfareMinimum: number; friendMinimum: number; friendBond: number; maximum: number; chance: number;
      memoryRetention: number; rivalryRetention: number; friendValence: number; friendStress: number };
    eventLogLimit: number; visibleEventLimit: number; debugAgeTicks: number;
    debugAgeBatchTicks: number;
  };
  breeding: {
    enabled: boolean; extinctionRescue: boolean; founderCount: number; initialAdults: number; rescueCount: number;
    founderAdultSpreadDays: number; founderJuvenileSpreadFraction: number;
    recovery: { minimumProjectedPopulation: number; minimumYoung: number; minimumBreedingWindowTicks: number; maximumPopulation: number; eggs: number; checkEveryTicks: number; cooldownDays: number };
    minimumCompatibility: number; mateTemperature: number; compatibilityWeights: { bond: number; traits: number; taste: number; diversity: number };
    minimumBond: number; mateBondWeight: number; rivalryPenalty: number;
    needMaximum: number; stressMaximum: number; minimumMood: number; adultRemainingTicks: number;
    clutchEggs: number; maximumClutches: number; cooldownDays: number; attemptIntervalTicks: number; attemptChance: number;
    encouragementUtility: number; encouragementMultiplier: number; courtshipInterest: number; recipientMinimumUtility: number;
    courtshipWorkTicks: number; travelTimeoutTicks: number; radiusTiles: number; candidateCount: number;
    densityFullUntil: number; targetPopulation: number; foodCapacityFloor: number; referenceSources: number; nest: Point;
    reportTicks: number; reportSeeds: number[]; reportIntervalTicks: number; diversityFloor: number;
  };
  skillCatalog: Record<Skill, SkillDefinition>;
  training: { capacity: number; shallowPractice: Point[]; defaults: { skill: Skill; x: number; y: number; width: number; height: number }[] };
  world: {
    widthTiles: number; heightTiles: number; tilePixels: number; walkBaseSpeed: number; navigationCacheEntries: number;
    terrainCosts: { grass: number; soil: number; shallowWalking: number; rock: number };
    pond: { x: number; y: number; outer: Point; inner: Point };
    rock: { min: Point; max: Point }; soil: { min: Point; max: Point };
    nightStart: number; nightOverlayAlpha: number;
  };
  initial: { seed: number; name: string; position: Point; fruit: { kind: FruitKind; position: Point }[] };
  food: {
    looseSpoilDays: number; historyLength: number; learningRate: number;
    genePreferenceWeight: number; learnedPreferenceWeight: number; repeatPreferencePenalty: number;
    rewardTasteWeight: number; rewardHungerWeight: number; rewardStressWeight: number;
    rewardStressScale: number; rewardLowHungerThreshold: number; rewardLowHungerPenalty: number; rewardRepeatPenalty: number;
    valenceWeight: number; positiveStressRelief: number; valenceBounds: [number, number];
    favoriteThreshold: number; dislikeThreshold: number; labelMinimumMeals: number;
    reactionTicks: number;
    debugCreatureNames: string[];
  };
  sources: { defaults: { kind: FruitKind; x: number; y: number }[] };
  persistence: { key: string; autosaveRealSeconds: number; snapshotMaximumRealHz: number };
  actions: Record<ActionKind, ActionDefinition>;
  fruit: Record<FruitKind, FruitDefinition>;
}

/** Host contracts: timestamps are never part of deterministic simulation state. */
export interface OfflineConfig {
  enabled: boolean; ticksPerRealSecond: number; offlineRateMultiplier: number; maxCatchUpTicks: number;
  minAwaySeconds: number; excessTime: 'discard'; stallThresholdSeconds: number;
  sliceBudgetMs: number; minTicksPerSlice: number; maxTicksPerSlice: number; autosaveIntervalSeconds: number;
  summary: { notableLimit: number; skillMilestones: number[]; priorities: Record<string, number> };
  archive: { maintenanceTicks: number; minimumAgeTicks: number; stubGenerationHorizon: number; dropGenerationHorizon: number;
    maximumFullRecords: number; maximumStubs: number; saveByteBudget: number };
  bench: { seed: number; warmupTicks: number; measuredTicks: number; populations: number[]; targetCatchUpSeconds: number };
}
export interface SaveEnvelope {
  schemaVersion: 14; format: 'creature-habitat'; savedAtWallClock: number | null;
  configHash: string; checksum: string; offlineEnabled: boolean; state: SaveState;
}
export interface CatchUpPlan { ticks: number; capped: boolean; skewed: boolean; belowThreshold: boolean }
export interface AdvanceMode { speed: Speed; fractionalSeconds: number; hidden?: boolean; offlineEnabled?: boolean }
export interface AdvancePlan extends CatchUpPlan { realtimeTicks: number; catchUpTicks: number; fractionalSeconds: number }
export interface TransientEvent {
  tick: number; kind: 'skillMilestone' | 'bodyPart'; creatureId: string; name: string; detail: string;
}
export interface TickOutput { events: LifeEvent[]; changes: TransientEvent[] }
export type TickPhase = 'clone' | 'resources' | 'ordinaryWork' | 'courtshipWork' | 'socialWork' | 'competitionWork' | 'sharedMaintenance' | 'courtshipCompletion' | 'socialCompletion' | 'competitionCompletion' | 'mood' | 'lifecycle' | 'completion' | 'decisions' | 'archive';
/** Optional instrumentation only; the host supplies its clock. */
export interface TickObserver { phase(name: TickPhase, operations: number): void }
export interface SummaryAccumulator {
  startTick: number; endTick: number; realAwaySeconds: number; capped: boolean; skipped: boolean;
  births: number; hatchings: number; deaths: Record<LifeStage, number>; rebirths: number; arrivals: number;
  initialGeneration: number; maximumGeneration: number; generationsPassed: number;
  competitionsHeld: number; competitionsCancelled: number; competitionsResolved: number; prizesAwarded: number;
  friendships: number; rivalries: number; mateBonds: number; bodyParts: number; skillMilestones: number; rescueEggs: number;
  notable: { tick: number; kind: string; creatureId: string; name: string; detail: string; priority: number }[];
}
export interface LineageStub {
  id: string; organismId: string; parentIds: string[] | null; birthTick: number; deathTick: number;
  topSkill: TopSkill | null; generation: number;
}
export interface ArchiveState {
  stubs: LineageStub[];
  /** Counts consumed cosmetic tokens in collections removed from detailed archives. */
  cosmetics: Record<string, number>;
  removedLives: number; removedOrganisms: number;
}

/** Validation/measurement contracts add no simulation state. */
export interface StateViolation { path: string; message: string }
export interface HealthProfile { ticks: number; seeds: number[]; sampleEveryTicks: number; bands: Record<string, [number, number]> }
export interface HealthConfig {
  full: HealthProfile; quick: HealthProfile;
  soak: { ticks: number; seeds: number[]; validateEveryTicks: number; roundTripChance: number; catchUpChance: number; maximumChunkTicks: number; shortTicks: number; shortSeeds: number[] };
}
export interface NamesConfig { founderName: string; starts: string[]; middles: string[]; ends: string[]; distinctFraction: number; sampleSize: number }
export interface RobustnessConfig {
  backups: number; importMaximumBytes: number; storageQuotaBytes: number; indexedDbThreshold: number;
  leaseMs: number; heartbeatMs: number; helloWaitMs: number; measuredCheckpointUtf8Bytes: number; commandHistoryLimit: number; devValidate: boolean; validateEveryTicks: number;
}
export interface PresentationConfig {
  daylight: { maximumCycleSpeed: number; transitionSeconds: number; twilightFraction: number };
  foregroundBudgetMs: number; rateSampleMs: number; maximumAnimationSpeed: number; maximumAnimationDeltaSeconds: number;
  mapCamera: { minimumZoom: number; maximumZoom: number; wheelSensitivity: number; wheelLinePixels: number; maximumWheelDelta: number; buttonZoomFactor: number; dragThresholdPixels: number; keyboardPanPixels: number };
  playerEventKinds: string[]; eventWindowTicks: number; eventRateCap: number; feedLimit: number;
  ariaLiveIntervalMs: number; debugRefreshHz: number; playerRefreshHz: number;
  textSizes: number[]; defaultTextSize: number; defaultSpeed: Speed; bundleByteBudget: number;
}

/** Derbil Dynasty fields are plain data and copied with each tick. */
export type MovementMode = 'walk' | 'swim' | 'fly';
export interface CarriedBerry { id: string; kind: FruitKind }
export interface DerbilState {
  energy: number; movementMode: MovementMode; moving: boolean; fast: boolean;
  food: CarriedBerry[]; nextSocialTick: number; runningPenaltyUntil: number;
  reincarnationFruit: number;
}
export interface DynastyEvent {
  id: string; kind: 'derby' | 'cup'; day: number; tick: number;
  winnerId: string | null; ranking: { id: string; score: number }[]; awarded: boolean;
}
export interface DynastyState {
  /** Old calendar/lifespan records through this tick retain their original units. */
  calendarChangedAtTick: number | null;
  nextPlantTick: number; nextDerbyDay: number; nextCupDay: number;
  championOrganismId: string | null; events: DynastyEvent[];
  /** Historical removed fields/contests are retained for audit, never read by gameplay. */
  legacyRecords: unknown[];
}
export interface DynastyConfig {
  stats: Record<Skill, { name: string; color: string; border: string; fruit: FruitKind }>;
  movement: { normal: Record<MovementMode, number>; bonusPerLevel: number; baseEnergy: number; energyPerStamina: number; drainPerSecond: number; recoveryPerSecond: number; restartEnergyFraction: number; minimumFlight: number };
  plants: { maximum: number; initial: number; saveCompatibilityMaximum: number; spawnEveryTicks: number; spacing: number; waterShare: number; berryXp: number; carryCapacity: number; spawnAttempts: number; gatherInterest: number };
  relationships: { friendThreshold: number; foeThreshold: number; foeColor: string; friendColor: string; mateLimit: number; mateGain: number; mateStartingBond: number; mateReinforcement: number; mateMinimumScore: number; breakupScore: number; socialIntervalTicks: number; proximity: number; shareHunger: number; stealChance: number; fightChance: number; fightPenalty: number; fightPenaltyDays: number; repeatedPenalty: 'refresh'; shareBond: number; stealBond: number; fightBond: number; lonelyNoFriendsPerMinute: number; lonelyPerFoePerMinute: number; breedingLonelinessWeight: number };
  competitions: { derbyDays: number; cupDays: number; berryPrize: number; championAttraction: number; historyLimit: number };
  art: { developmentStart: number; developmentMaximum: number; sizeTiles: number; walkCycleTicks: number; flapCycleTicks: number; footAngle: number; wingAngle: number; saturation: number; baseLightness: number; highlightLightness: number };
}

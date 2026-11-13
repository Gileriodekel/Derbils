# Creature Sandbox Project Design Specification

Version 1.0 • 20 October 2026 • Implementation contract for a browser game

Build a quiet, persistent habitat for up to 30 autonomous creatures. The primary product is the simulation: recognizable individuals, inherited differences, learned habits, evolving bodies, and an inspectable family tree. Everything needed for normal survival, social activity, and reproduction must work without player commands. The player shapes opportunities and observes consequences.

This specification defines original systems based on the design ingredients in the brief. Names, characters, artwork, animations, maps, and code must be original. No knowledge of the referenced games is required to implement it.

**Contract language:** MUST means required for version 1.0. MAY means optional. Values below are design defaults, not empirically validated balance. `balance.json` is the central source of tunable scalar values; content catalogs in this document supply fruit, action, and item definitions. `save.schema.json` is the structural save contract. Semantic invariants below are equally mandatory. If implementation convenience conflicts with a rule, preserve the rule and change the implementation.

## 1. Overview and design pillars

| Pillar | Implementation consequence | Observable acceptance criterion |
|---|---|---|
| Lives continue independently | Utility AI handles food, rest, play, training, and courtship | A populated habitat runs for 12 simulated hours without commands and continues producing ordinary life events |
| Inheritance creates continuity | Diploid genomes, linked crossover, bounded mutation, permanent ancestry | A child's alleles can be traced to parents or an explicitly recorded mutation |
| Experience changes the individual | Skills grow; learned tastes and personality drift; parts emerge at skill thresholds | Two creatures with identical genomes can develop visibly different parts |
| Observation explains behavior | Thought labels, action progress, mood, relationship history | Selecting a creature explains its current action in one sentence |
| A gentle sandbox | No win state, combat, starvation death, or mandatory chores | Ignoring the habitat changes its history without creating a failure screen |
| Discoveries outlast individuals | Permanent genealogy and phenotype discovery records | Death removes an active agent without removing its descendants or life record |

**Target experience:** six starting creatures, usually 12–24 after several generations; hard limit 30 active slots. A session can be a two-minute check-in or an hour of gardening, observing, and competitions. Rendering is a top-down 2D scene with a larger portrait assembled from the same parts. Rounded vector parts are the initial art pipeline; a later sprite atlas may replace them without changing simulation rules.

**Units and notation.** A tick is exactly one simulated second. At speed 1, one real second advances one tick. A habitat day is 1,200 ticks, or 20 real minutes at speed 1. `minute` in formulas means 60 simulated seconds; `day` always means a habitat day. World positions are continuous tile coordinates, not pixels. Probabilities are `[0,1]`; needs are deficits `[0,100]`, where a larger value is worse. `clamp(x,a,b)`, `lerp(a,b,t)`, and arithmetic mean have their usual meanings. Round only where explicitly specified. Store continuous values as JavaScript numbers; integer fields are integers.

## 2. Core loop and the player's role

1. Trees replenish fruit; creatures perceive nearby opportunities.
2. A creature chooses an action from its needs, tendencies, preferences, relationships, and reachable resources.
3. Activities change needs, skills, habits, and social relationships.
4. Skill thresholds add visible parts. Genes supply the proportions and palette of those parts.
5. Compatible adults court and produce eggs. Their children receive recombined genomes.
6. Individuals age, sometimes enter a rebirth cocoon, and eventually leave permanent family records.
7. The player discovers appearances, arranges the habitat, and stages optional competitions.

| Player control | Exact effect |
|---|---|
| Offer fruit | Places one owned fruit in the selected creature's pocket if there is room; eating remains an AI choice |
| Place or remove an item | Changes reachable action targets; invalid placement is rejected before state mutation |
| Plant and harvest | Converts a seed to a plant, or a ripe fruit to player inventory |
| Pet | At most once per creature per 60 ticks: stress −8, recent emotional valence +0.10, gentleness drift event +0.005 |
| Encourage an activity | Adds +0.15 utility to that activity for 600 ticks; only one encouraged activity per creature |
| Encourage a pair | Adds +0.15 utility to social actions with that partner and multiplies the courtship attempt probability by 1.5 |
| Pair exclusively | Applies encouragement and restricts each partner's candidate mates to the other; does not force willingness |
| Block a pair or individual breeding | Makes that breeding candidate invalid, including an already running courtship |
| Start a competition | Validates rules and entrants, escrows prizes, commits results, and starts its timed presentation |
| Pause or select 1×, 2×, 4× | Controls foreground simulation speed; animation speed is capped independently |
| Inspect, name, export | Reads state, sets a display name of at most 40 Unicode characters, or exports the complete save |

There is no currency, death penalty, mandatory quest, manual feeding requirement, or resource needed for basic survival. Common item blueprints are free to place within the item limit. Rare plants, prize supplies, and cosmetics supply optional collecting goals.

## 3. Genetics and inheritance model

### 3.1 Genome representation and loci

An organism has four chromosome pairs. Each pair contains two ordered haplotypes of equal length. An allele is `{ "v": 128, "d": 1 }` for a quantitative locus or `{ "v": "spots", "d": 0 }` for a categorical locus. `v` is a value, and `d` is a dominance rank, either 0 or 1. A creature references its organism's genome; never store a second mutable copy on the creature.

| Chromosome | Ordered loci, in crossover order | Type and expressed range |
|---|---|---|
| `aptitude` | run, swim, fly, climb, strength, stamina | Six quantitative bytes; expressed `q ∈ [0,1]` |
| `palette` | baseHue, accentHue, eyeHue, saturation, lightness, pattern | First five quantitative; pattern is solid, spots, stripes, or marbled |
| `shape` | width, height, head, limb, tail, ears | First five quantitative; ears are round, pointed, or folded |
| `temperament` | sociability, curiosity, competitiveness, boldness, gentleness, sweet, tart, earthy | Eight quantitative bytes |

There are **26 diploid loci and 52 alleles per organism**. Aptitude loci set potential, not current skills. The five personality loci set baseline tendencies; taste loci bias food preferences. Shape genes change scale and static ear style, never the presence or tier of a trained part.

### 3.2 Expression and dominance

For non-hue quantitative loci, let `a=vA/255`, `b=vB/255`:

```text
if dA == dB: q = (a + b) / 2
else if dA > dB: q = 0.75*a + 0.25*b
else: q = 0.25*a + 0.75*b
```

This is partial dominance: the less dominant quantitative allele still contributes. For categorical loci, higher `d` wins completely; a recessive categorical value can remain hidden. When ranks tie and values differ, use the first value in the catalog order above. This deliberately simple tie rule is independent of which parent supplied which haplotype.

Categorical ranks are intrinsic: `solid` and `round` have rank 1; all other pattern and ear values have rank 0. Never mutate their rank independently. Thus solid/spots expresses solid; spots/spots expresses spots. Crossing two solid/spots parents produces spots/spots with probability 25% before mutation.

For hue genes, map a byte to `360*v/256` degrees and use the same dominance weights in a circular vector mean. If the vector magnitude is below `1e-9` (opposite equal hues), use the numerically smaller hue. This avoids turning red plus violet into green. Saturation is `45+40*q` percent; lightness is `38+28*q` percent.

### 3.3 Founder generation

Generate every allele independently using the genetics RNG. Aptitude values are uniformly distributed integers 64–192 inclusive; other quantitative values are integers 0–255. Quantitative ranks are 0 or 1 with equal probability. Pattern probabilities are solid 0.40, spots 0.25, stripes 0.25, marbled 0.10. Ear probabilities are round 0.50, pointed 0.35, folded 0.15. Founder parents are an empty array. Founders are unrelated to all existing organisms.

### 3.4 Meiosis and mutation

Each parent supplies one gamete. For each chromosome independently:

1. Choose starting haplotype 0 or 1 with equal probability.
2. With probability 0.65, choose one crossover cut uniformly from gaps `1..length−1`; otherwise no crossover.
3. Copy loci before the cut from the starting haplotype and loci after it from the other. Without a cut, copy the whole starting haplotype.
4. Mutate each copied allele independently using the parent's current exposure, as below.
5. Child haplotype 0 is the first parent's gamete and haplotype 1 is the second parent's. Parent order is canonical organism-ID order.

| Mutation | Baseline probability per copied allele | Mutation operation |
|---|---:|---|
| Quantitative value | 0.008 | Choose sign ± with equal probability and integer magnitude 1–24; hue wraps modulo 256; other values reflect at 0 and 255 |
| Categorical value | 0.004 | Choose uniformly from the other legal values; set its intrinsic rank |
| Quantitative dominance | 0.002 | Flip 0 ↔ 1 independently of the value mutation |

Reflection is `x<0 ? -x : x>255 ? 510-x : x`; the mutation magnitude is small enough that one reflection suffices. A value mutation and a dominance mutation can both occur on the same allele. Record one mutation entry containing the complete before/after allele when either changes.

Each parent has acquired exposure channels `palette`, `body`, and `aptitude`, all `[0,1]`. Effective value-mutation probability is `pBase*(1+2*exposure[channel])`, at most 0.024 for quantitative and 0.012 for categorical loci. Palette chromosome uses palette exposure; shape uses body exposure; aptitude uses aptitude exposure; temperament always uses zero exposure. Dominance mutation stays at 0.002. Mutation direction is unbiased: a diet cannot guarantee an improvement or a specific allele.

Exposures decay exponentially with a time constant of three days. Fruit adds the catalog increments. Working on swimming adds `dt/(6*DAY)` to palette exposure; climbing adds it to body exposure; flying adds it to aptitude exposure. Apply decay before increments and clamp afterward. Training changes **mutation probability at future conception**, not the parent's DNA or the child's initial XP. An offspring starts with zero exposure and zero XP.

### 3.5 Kinship, genotype continuity, and population slots

Family nodes are **organisms**, with zero or two parent organism IDs. Rebirth is another life of the same organism and does not create a new descendant. Relationships and breeding rules use organism IDs, so rebirth cannot evade kinship restrictions.

Reject a mate pair if either organism is any-depth ancestor of the other, or their ancestor sets through two generations intersect. This excludes parent/child, siblings, grandparent/grandchild, aunt/uncle–niece/nephew, and first cousins. Missing ancestor data is a corrupt save, not permission to breed. Second cousins are allowed under this intentionally simplified rule. Do not simulate inbreeding disease in version 1.0.

`occupiedSlots = activeCreatures.length + runningCourtships.length`. Eggs, ordinary creatures, and rebirth cocoons each consume one active slot. Starting courtship reserves exactly one future slot. Completion atomically exchanges the reservation for an egg. Aborting releases it. Rebirth exchanges one active creature for another in the same slot. No command, import, newcomer, or simultaneous completion may exceed 30.

## 4. Lifecycle

Durations are deterministic. Age is time in a stage, not a random mortality hazard. Only reaching the end of elderhood causes death or rebirth.

| Stage | Duration in days / ticks | At 1× | Behavior and mechanical changes |
|---|---:|---:|---|
| Egg | 0.5 / 600 | 10 min | Stationary; no needs, skills, or social actions; genome already committed |
| Baby | 2 / 2,400 | 40 min | Size 0.55; skill cap min(genetic cap,15); XP multiplier 0.60; no breeding or organized competition |
| Juvenile | 4 / 4,800 | 80 min | Size 0.78; skill cap min(genetic cap,45); XP multiplier 1.25; can compete |
| Adult | 36 / 43,200 | 12 h | Size 1.00; full potential; XP multiplier 1.00; breeding eligible |
| Elder | 6 / 7,200 | 2 h | Size 0.95; full learned parts retained; performance multiplier 0.85; XP multiplier 0.50; no breeding |
| Rebirth cocoon | 1 / 1,200 | 20 min | Stationary; no needs or actions; then enters baby stage, skipping egg |
| Dead | Permanent archive | — | No active agent or slot; family and life records remain |

A first complete life lasts 48.5 days, or **16 hours 10 minutes** at 1×. Do not silently shorten this to make tests run: tests advance simulated time directly.

At hatching: needs `{hunger:25,fatigue:15,boredom:10,loneliness:10,stress:0}`, mood 0.5, zero XP and drift, no learned rewards. A newborn gets bond +25 and familiarity 0.5 with each living parent, and bond +10 with living full or half siblings. These are relationship initializations, not breeding exemptions.

### Rebirth and permanent death

During baby through elder stages, integrate `wellbeing*dt` and `dt`. At elderhood's end, eligibility requires lifetime mean wellbeing ≥0.70, at least two living organisms with bond ≥40, and fewer than two previous rebirths. Eligible creatures roll once with probability 0.60 using their saved RNG. Others die permanently. The decision executes once in the lifecycle transition, then is saved as a life ending.

On rebirth: close the old life record; create a new creature ID referencing the same organism and genome; increment reincarnations; enter cocoon at a safe land tile. Reset all XP, needs, diet tint, exposures, confidence, welfare totals, breeding clutch count, and cooldown. Retain the name and cosmetics. Clear the recent-food list, activity encouragement, per-partner contest cooldowns, and exploration visits. Multiply personality drift, learned preference means, ordinary bonds, and mate bonds by 0.5; rivalry by 0.25. Familiarity remains. Learned sample counts remain, but the fixed learning rate does not use them. Start the new welfare total when babyhood begins. Parts return to tier zero until retrained. No genomic mutation occurs during rebirth.

On permanent death: cancel actions, sessions, and reservations; return pocket fruit to player inventory; close the life record with its display name, cosmetics, final levels, and win count; remove the active creature. Living friends with bond ≥40 receive recent valence −0.20 and stress +8 once; this fades through the normal mood/stress rules. There is no cascading mortality from sadness. A small memorial appears in the archive UI, without adding an unbounded world item.

### Breeding eligibility and timing

Both participants must be adults, have at least 41 ticks left in adulthood, hunger and fatigue <55, stress <50, mood ≥0.10, no current competition or shared session, breeding enabled, fewer than five clutches in this life, and a finished three-day breeding cooldown. Both must pass kinship and player-policy checks, with bond ≥30. Courtships check the three-day cooldown at acceptance/work start, then set it only on completion. One successful courtship creates **one** egg; both parents gain one clutch and a three-day cooldown.

When occupied slots exceed 18, multiply attempts by `density = clamp((30-occupiedSlots)/(30-18),0,1)`; otherwise density is 1. At 30, no courtship can start. Capacity can delay reproduction without harming creatures or deleting eggs.

## 5. AI brain

### 5.1 Needs, mood, tendencies, and memory

Each active, non-egg, non-cocoon creature has hunger, fatigue, boredom, loneliness, and stress in `[0,100]`. Passive per-minute rates are hunger +2.0, fatigue +1.2, boredom `+2.0*(0.75+0.5*curiosity)`, loneliness `+1.6*(0.25+0.75*sociability)`, and stress −0.8. Baby hunger/fatigue multiply by 1.2, juvenile by 1.1, adult by 1.0, elder by 0.9. Sleep applies ordinary hunger and half ordinary loneliness; suppress passive fatigue and boredom during sleep. Action effects are additional to the applicable passive rates.

```text
wellbeing = 1 - (0.30*hunger + 0.30*fatigue + 0.15*boredom
                 + 0.15*loneliness + 0.10*stress) / 100
recentValence *= exp(-dt / 120)
moodTarget = clamp(2*wellbeing - 1 + recentValence, -1, 1)
mood += (moodTarget - mood) * (1 - exp(-dt / 60))
```

`recentValence` is clamped to `[-0.5,0.5]` after events. Display mood as content ≥0.25, neutral from −0.25 to 0.25, unhappy ≤−0.25; use exact numbers only in the details panel. Hunger/fatigue ≥85 produces a specific urgent thought regardless of mood label.

Expressed personality is `clamp(geneticBaseline + drift,0,1)`, with drift `[-0.30,0.30]`. Drift exponentially returns toward zero with a 20-day time constant. On completed events, add and clamp: friendly play sociability +0.005; exploration curiosity +0.005; completing a contest competitiveness +0.005; completing a new activity boldness +0.005; receiving petting or comfort gentleness +0.005; rude play gentleness −0.005 and recipient boldness −0.003. A drift reward of a given event kind is limited to once per creature per minute. Short-term treatment can shift behavior, but genes remain an anchor.

### 5.2 Action definitions

Work duration starts after arrival; travel uses passive needs only. Effects listed as totals are applied proportionally per working tick, except food consumption, social outcomes, learning updates, and courtship births, which commit at completion. Training XP accrues only during work. Partial work may yield XP and needs relief but never a partial food item or relationship outcome.

| Action | Work ticks | Target and prerequisites | Total work effects / completion effect |
|---|---:|---|---|
| Eat | 8 | Pocket, loose fruit, or ripe reachable tree; hunger ≥15 | Consume one reserved fruit at completion; apply fruit catalog |
| Graze | 45 | Any grass tile; always available | Hunger −18, boredom −2; no XP or exposure |
| Sleep | 120, extendible | Bed, shelter, or current safe land | Fatigue −36, stress −6; exit early below fatigue 15 after minimum work time |
| Wander | 30 | Reachable tile within radius 8 | Boredom −8, stress −2 |
| Explore | 40 | Least recently visited of four reachable candidate tiles within radius 12 | Boredom −16, stress −2; activity preference update |
| Train run | 40 | Track or ordinary reachable land tile | Boredom −12, fatigue +4, hunger +1; running XP |
| Train swim | 40 | Shallow-water shoreline target | Same training effects; swimming XP |
| Train fly | 40 | Wind perch or open grass | Same; flying XP via hopping and flapping even without wings |
| Train climb | 40 | Climbing frame or low boulder | Same; climbing XP; no pre-existing climbing skill required |
| Train strength | 40 | Push stone or open land | Same; strength XP |
| Train stamina | 60 | Trail marker or open land | Boredom −18, fatigue +6, hunger +1.5; stamina XP |
| Play | 30 | Willing nearby creature; shared session | Each: boredom −20, loneliness −18, fatigue +2; social outcome |
| Comfort | 20 | Willing stressed creature, initiator gentleness ≥0.5 | Recipient stress −12, loneliness −12; initiator loneliness −8; bond +4 |
| Informal contest | 40 | Willing creature; agreed skill and valid training site | Each: boredom −18, loneliness −10, fatigue +5; XP and contest outcome |
| Court | 40 | Eligible pair and reserved nest/slot | Each: loneliness −15, fatigue +2; one egg on successful completion |
| Idle | 10 | Current safe tile | Stress −1; fallback if no higher-scoring valid action |

All sleep can repeat; fixed durations do not require a creature to wake while exhausted. Babies may practice every skill, including shallow-water play and wingless flapping; advanced traversal is separately gated. If an intended target disappears, cancel work, release reservations, and decide again next tick.

### 5.3 Candidate scoring

Every five ticks, offset by creature numeric ID modulo five, re-evaluate if the creature is not locked in a shared session or competition. Candidate generation is bounded: four food targets, four social partners, two targets for each of six training actions, and one each of graze/sleep/wander/explore/idle; at most 25 ordinary candidates. Courtship and comfort replace the corresponding social partner candidate rather than adding unbounded candidates.

For action `a`, define:

```text
needBenefit(a) = SUM_j weight[j] * (need[j]/100)^2
                    * clamp(predictedRelief[a,j] / reliefScale[j], 0, 1)
weights     = {hunger:.30, fatigue:.30, boredom:.15, loneliness:.15, stress:.10}
reliefScale = {hunger:30, fatigue:36, boredom:20, loneliness:18, stress:12}

U(a) = 2.0*needBenefit(a)
       + 0.18*personalityFit(a) + 0.12*preference(a)
       + 0.12*growthInterest(a) + 0.10*socialAffinity(a)
       + encouragement(a) + courtshipInterest(a)
       - 0.15*clamp(estimatedTravelSeconds/30,0,1)
       - 0.20*clamp(predictedFatigueIncrease/20,0,1)
       - 0.08*recentActionRepeat(a)
```

`predictedRelief` is the nonnegative decrease from action work, excluding passive need increase. Eating relief uses its selected fruit. `personalityFit`, `growthInterest`, and `recentActionRepeat` are `[0,1]`; `preference` and `socialAffinity` are `[-1,1]`. Other terms default to zero. Fit is curiosity for explore, sociability for play, gentleness for comfort, competitiveness for contests, boldness for fly/climb, and 0.5 for other actions. Training growth interest is `aptitude*(1-level/cap)`; otherwise zero. For play/comfort/court, social affinity is `clamp(bond/100 + 0.20*mateBond/100,-1,1)`. For informal contests it is `clamp(0.50*bond/100 + 0.50*rivalry/100,-1,1)`, so friendly rivals seek challenges. Recent repeat is 1 when the immediately preceding completed action had the same kind, else 0. Courtship interest is `0.35*compatibility` for a valid courtship only. Activity preference is its learned mean; food preference is defined in section 10.

For eligible actions, use softmax sampling `P(a)=exp((U(a)-maxU)/0.08)/sum(...)` from the creature's RNG. This produces variety without hiding the main need. If hunger or fatigue ≥85, restrict candidates to eat/graze or sleep respectively; when both are urgent, choose the larger normalized deficit, with hunger winning ties. Ignore disliked-food penalties during urgent hunger. Stress ≥90 removes contests and courtship but does not prevent self-care.

Commit to an action for at least eight work ticks unless an urgent need, an invalid target, or a stage transition requires interruption. After that, switch only if the best alternative score exceeds the current action's re-evaluated score by 0.12. At an ordinary completion, immediately choose afresh. A shared session is not interrupted by routine rescoring, but urgent needs or invalid eligibility cancel it for both participants.

### 5.4 Learning and visible intention

An activity's learned reward mean starts at zero. On completion, update `mean = 0.8*mean + 0.2*reward`, clamped to `[-1,1]`. Reward is `clamp(2*(wellbeingAfter-wellbeingBefore)+socialOutcome+0.10*(levelsGained>0),-1,1)`, with socialOutcome +0.20 for friendly play, −0.40 for rude play, and zero otherwise. Store the starting wellbeing when work begins. Sample counts are informational; learning rate stays fixed. Save the last visited tick per exploration macrocell, with a fixed 8×6 macrocell grid.

Render a thought bubble from the chosen action and largest contributing term: “Hungry—going for dewberries,” “Wants company—looking for Pip,” “Practicing flight,” or “Resting.” A details tooltip exposes the five largest utility terms and the chosen target. Never display an inferred thought that contradicts the actual action. Thought bubbles are derived UI state, not random story text.

## 6. Skill system

Skills are `run`, `swim`, `fly`, `climb`, `strength`, and `stamina`. Each stores only nonnegative total XP. Current integer level and cap are derived.

```text
geneticCap = floor(40 + 60*aptitudeQ)              // 40..100
effectiveCap = min(geneticCap, stageCap)          // baby 15, juvenile 45, otherwise 100
xpAtLevel(L) = 8*L + 2*L*L
level = min(effectiveCap, floor((-8 + sqrt(64 + 8*xp))/4))
xpToNext = 10 + 4*level

gainPerSecond = 1.0 * activityQuality * stageLearning
                * (0.60 + 0.80*aptitudeQ)
                * (1 - 0.75*(level/effectiveCap)^2)
                * (0.75 + 0.25*((mood+1)/2))
                * (1 + activeFruitBonus)
                * dailyPracticeMultiplier
```

`activityQuality` is 1.0 at a dedicated item and 0.75 for improvised practice. Training on an appropriate natural shoreline or boulder counts as 1.0. The per-skill daily practice multiplier is 1.0 for its first 240 work ticks that day and 0.50 afterward. Reset six practice counters at day boundary; split a tick if a future tick duration exceeds one second. This spreads activity without eliminating specialists.

Do not award XP if hunger or fatigue ≥85, stress ≥90, or the skill is already capped. Add XP continuously during work and clamp to `xpAtLevel(effectiveCap)`; excess at a stage cap is not banked. There is no skill decay. Stamina is trained explicitly, not passively added to every other activity. Organized and informal contests use the same gain function at quality 0.75 for eligible working time; no additional winner XP is minted.

Reference thresholds: level 10 requires 280 XP; 25 requires 1,450; 45 requires 4,410; 70 requires 10,360; 100 requires 20,800. At aptitude 0.5, cap is 70. A full-condition adult at level zero with no fruit bonus receives 1 XP per dedicated training second; this falls as the skill approaches its cap. Skills affect traversal, competition performance, and appearance; aptitude is never multiplied into competition scores again.

## 7. Modular appearance system

### 7.1 Parts and visual tiers

Tier is 0 below level 10, 1 at 10–24, 2 at 25–44, 3 at 45–69, and 4 at 70–100. Apply the same thresholds independently to all six skills. No “dominant skill” removes another skill's parts: a creature can carry fins, wings, climbing hands, and strong limbs simultaneously.

| Skill and attachment | Tier 0 | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|---|
| Run: legs/feet | Stub feet | Defined ankles | Long legs | Springy legs | Swept sprint legs |
| Swim: side fins and tail fin | No fins | Small fin tabs | Paired fins | Broad fins | Fan fins and tail fan |
| Fly: upper-back wings | No wings | Wing buds | Small wings | Broad wings | Long layered wings |
| Climb: hands/toe pads | Round hands | Small pads | Wide pads | Hooked pads | Large curled pads |
| Strength: shoulder/forearm overlay | None | Rounded shoulders | Forearm mass | Strong shoulder mass | Broad shoulder/arm silhouette |
| Stamina: tail shaft and dorsal tuft | Short tail | Longer tail | Double tuft | Long tail/large tuft | Streaming tail and full crest |

**Traversal gates:** swimming ≥10 permits deep water; flying ≥25 permits flight routing; climbing ≥10 lowers rock movement cost. These gates use skills, never whether a visual sprite happened to load. Wingless flying practice and finless shallow-water practice prevent a progression deadlock.

### 7.2 Geometry, color, and compositing

Use a 64×64 local coordinate frame, facing right. Body center `(32,36)`, head `(37,22)`, rear/front feet `(25,53)/(39,53)`, wing roots `(25,28)/(31,29)`, fin roots `(24,39)/(37,40)`, hand roots `(25,38)/(40,38)`, tail root `(17,39)`. Mirroring flips the assembled creature about x=32, including attachment points. Individual parts use normalized paths centered on their root. The portrait scales the same rig 3×; it does not use a separately authored phenotype.

Gene scale ranges: width 0.65–1.65; height 0.70–1.50; head 0.70–1.50; limb 0.60–1.70; tail 0.50–1.80. Interpolate from the corresponding `q`. Body transform moves attachment anchors; part-local limb and tail scale then apply. Stage scale multiplies the complete rig. Strength shoulder overlay and climbing hand overlay use separate anchors from the run feet; swim tail fan attaches to the stamina tail tip, never replacing its shaft.

Painter order within a creature is fixed: shadow → rear wing → tail shaft → tail fin → rear fin → rear leg → rear hand → body base → clipped body pattern → shoulder overlay → front leg → head → ears → front hand → front fin → front wing → eyes/mouth → dorsal tuft → cosmetic → thought bubble. Rear appendages use 85% of front saturation. World entities sort by ground-foot Y, then ID; flight raises the rig visually but keeps its ground shadow and sorting footprint.

Base hue fills the body; accent hue fills appendages and patterns; eye hue fills irises. Pattern detail is seeded by the permanent organism `appearanceSeed`, never re-randomized per frame or life. A cosmetic cannot conceal the thought bubble. Clamp the full visible rig to a 112×112 bounding box by uniformly scaling only if extreme combined traits exceed it; keep the collision footprint at 0.65 tiles regardless of looks. This preserves strange proportions without breaking navigation.

Fruit tint is acquired, not inherited: blend up to 18% of an accumulated fruit RGB tint into both base and accent colors. Each fruit adds 0.025 tint strength and updates tint RGB as `0.8*old+0.2*fruitRGB`; when starting from zero strength use fruitRGB directly. Strength halves each day. Genes remain unchanged. Rebirth clears tint.

### 7.3 Animation and discovery

Required clips: idle breathing, blink, look, walk, eat, sleep, play bounce, train, swim, glide, court, egg wobble, cocoon pulse, and gentle departure fade. All use local transforms; no animation drives simulation. Idle breathing amplitude is 2% over 3 seconds; blink lasts 120 ms with cosmetic-only deterministic phase. Reduced-motion mode removes bobbing, scaling pulses, and screen shake while retaining state changes.

A discovery signature contains six part tiers, pattern, ears, base-hue bucket `floor(hue/30)`, and width/height buckets `min(3,floor(q*4))`. Log the first appearance of each signature, its first tick, and organism ID. Do not count tiny tint or animation changes as discoveries. The UI shows “new appearance,” not an implied finite completion percentage.

## 8. Social interaction and autonomous breeding

### 8.1 Relationship state and interaction outcomes

Store one symmetric relationship per unordered pair of organism IDs: bond `[-100,100]`, rivalry `[0,100]`, familiarity `[0,1]`, mateBond `[0,100]`, and last contact tick. A missing relationship has all-zero values. Symmetry is a deliberate version 1.0 simplification; each creature can still prefer different actions because its personality and needs differ.

UI labels are derived: friend at bond ≥40; close friend at ≥70; disliked at ≤−30; rival at rivalry ≥40; mate bond at mateBond ≥50. Friend and rival may coexist. Family labels are separately derived from ancestry and never inferred from bond.

| Completed interaction | Bond | Rivalry | Other effects |
|---|---:|---:|---|
| Friendly play | +6 | −2 | Familiarity +0.05; each recent valence +0.08 |
| Rude play | −8 | +6 | Recipient stress +8, recent valence −0.12; initiator gets no positive emotional reward |
| Comfort | +4 | −1 | Familiarity +0.03; recipient recent valence +0.10 |
| Informal contest | +2 | +4 if both competitiveness ≥0.5; otherwise +1 | Winner valence +0.10; other participant +0.02; each gets ordinary contest training XP |
| Completed courtship | +8 | −2 | Mate bond +25, familiarity +0.10; create egg |

At play completion, rude-play probability is `0.02 + 0.18*(1-meanGentleness)*meanCompetitiveness`. Choose initiator/recipient from the saved invitation, not from the winner of an unrelated roll. Rude play is a pout or a toy snatch, with no damage, attacks, or injury. Competitiveness and low sociability do not imply violence.

Familiarity caps at 1. Evaluate relationship decay lazily on interaction, inspection, or active-pair refresh using lastDecayTick; never sweep the entire archive every simulation tick. After one day without contact, each additional second multiplies bond and mateBond by `exp(-dt/(30*DAY))` and rivalry by `exp(-dt/(10*DAY))`. Decay applies toward zero for negative bonds too. Family relationships do not automatically disappear; genealogical links are permanent. Archive-to-archive relationships may be dropped after their life summaries are recorded, but links involving an active organism must remain.

### 8.2 Invitations and shared sessions

A social initiator considers at most four nearby creatures within 12 tiles, ordered by a score of `bond/100 + 0.25*(loneliness/100) - distance/24`, then ID. A recipient is willing if it is not in a session or competition, has no urgent hunger/fatigue, has stress <90, and the offered action utility is at least 0.15 and no more than 0.05 below its current action's utility. Courtship instead requires its utility ≥0.25 plus every breeding rule. Exclusively paired creatures are still free to play with others.

Accepted invitations create one shared session, interrupt both ordinary actions, and reserve an item if needed. Participants travel independently to adjacent target cells. Begin work together only after both arrive and revalidate eligibility. Abort after 60 travel ticks, if a participant becomes invalid, or if a required route fails. Start the duration clock when work starts. The session resolver checks urgent needs before each work tick and cancels both participants when self-care must take priority, even though ordinary decision loops skip locked creatures. Shared effects and completion happen exactly once through the session resolver; individual action handlers must not apply them a second time.

Store the per-partner informal-contest cooldown by partner organism ID on each creature, updating both sides on completion. Informal contests select a skill from the intersection of both creatures' reachable training activities, weighted by `1+theirMeanAptitude` for that skill. Compute each score as `(5+level)*condition*(1+0.08*(u1+u2-1))`, using the session's committed random rolls. `condition` is the competition condition formula in section 9. Higher score wins; exact ties are a draw, awarding neither a winner valence bonus. A per-pair cooldown of 120 ticks prevents the same two creatures continuously challenging each other.

### 8.3 Mate compatibility and proposals

Reproduction is sex-independent: any two different eligible adults may produce an egg. No pregnancy, sex ratio, or gender gating is simulated. Ordinary mate bonds are nonexclusive unless the player chooses an exclusive pair.

```text
traitSimilarity = 1 - mean(abs(A.personality[i] - B.personality[i]))  // five traits
tasteSimilarity = 1 - mean(abs(A.tasteGene[i] - B.tasteGene[i]))     // three tastes
geneticDifference = mean(abs(A.aptitude[i] - B.aptitude[i]))        // six aptitudes
C = clamp(0.55*max(0,bond/100) + 0.20*traitSimilarity
          + 0.15*tasteSimilarity + 0.10*geneticDifference
          + 0.10*(mateBond/100) - 0.10*(rivalry/100), 0, 1)
```

Require `C ≥0.45`. Among valid candidates, choose by softmax of `C + 0.15*(encouraged or exclusively paired)` at temperature 0.08. Once per creature per 60 ticks, on its ordinary decision boundary, offer a courtship candidate with probability `clamp(0.25*C*density*encouragementMultiplier,0,1)`. A failed roll sets the next attempt tick; repeatedly rescoring in the same minute must not reroll. The recipient must independently pass willingness. The offered courtship still competes with self-care in utility selection.

Reserve the egg slot and nest atomically when the invitation is accepted, before the second parent can initiate another proposal. At work start, both must have at least 41 adult ticks remaining. At work completion, revalidate adulthood, breeding enablement, kinship/player policies, absence of urgent needs, and the reserved slot. Do not reapply the 41-tick remaining-adulthood entry requirement at completion; create the child's genome and organism, place one egg at the nest, then remove the session in the same transition. No later hatch-time genetics roll is allowed. If blocked or breeding is disabled during courtship, cancel immediately with no bond penalty. This makes player intervention predictable.

### 8.4 Population recovery

An automatic welcome nest prevents a permanent empty-world state. Every day, at most one unrelated founder egg may arrive if immigration is enabled, a free unreserved slot exists, and either (a) occupied population is below four, or (b) population is below 12 and no non-elder pair is genetically permitted to breed eventually. For condition (b), test kinship and player breeding permissions only, ignoring age, bond, mood, and cooldown. Do not inject a newcomer just because a small community is temporarily too young. Log each arrival. The player can disable immigration independently of autonomous breeding.

## 9. Competitions

### 9.1 Entry and formats

Only player-started organized competitions exist in version 1.0; informal contests remain autonomous. An event uses a competition pad, admits 2–8 distinct living entrants, and runs for 90 ticks. At most one organized event runs at a time. During the event, entrants are unavailable to other actions and do not move around the habitat. Treat the competition scene as an overlay; restore each creature to its stored entry position or nearest safe land afterward.

Entry requires juvenile, adult, or elder stage; hunger/fatigue ≤60; stress ≤60; mood ≥−0.25; no shared session; and at least 120 ticks remaining in elderhood if elder. Swimming events require swim ≥10 and flying events fly ≥25. Other skills have no minimum unless the organizer sets one. Validate all rules again at start, not merely when selecting entrants.

| Format | Organizer choice | Score and presentation |
|---|---|---|
| Skill dash | One of six skills | One performance score, highest wins; run/swim/fly/climb animate as traversal, strength as pushes, stamina as repeated laps |
| Three-leg circuit | Three distinct skills in order | Harmonic mean of three performance scores; three 30-tick visual legs expose weak disciplines |
| Power trial | Strength or stamina | Average of three attempts with separate noise rolls; show a lift/push or endurance sequence |

Rules include allowed stages, minimum and maximum level for each selected skill (defaults 0 and 100), and the default wellbeing gates above. An optional “related entrants allowed” checkbox defaults true; disabling it excludes pairs that would fail the breeding kinship test, simply as a player-selected tournament rule. Race classes never use overall aptitude to exclude entrants unless a future explicit rule adds that feature.

### 9.2 Performance and randomness

At start, snapshot levels, wellbeing, stage, and active confidence, then commit all rolls and scores. Later eating, aging into adulthood, or saving/loading cannot alter that event's result.

```text
condition = 0.55 + 0.45*wellbeing
stagePerformance = 0.85 if elder else 1.0
confidence = 0.03 if confidenceUntilTick > startTick else 0
E(skill) = (5 + level[skill]) * condition * stagePerformance * (1 + confidence)
base(skill) = E(stamina) if skill == stamina
              else 0.85*E(skill) + 0.15*E(stamina)
noise = 1 + 0.08*(U01() + U01() - 1)   // triangular ±8%, mean 1
legScore = base(skill) * noise
dashScore = legScore
circuitScore = 3 / SUM(1/legScore[i])
powerScore = mean(three independently noised base(selectedSkill) values)
```

Sort by descending score, descending unnoised aggregate score, then ascending creature ID. Scores differing by less than `1e-9` are tied for comparison purposes before the next tie-breaker; final ranks are unique. Show near ties as a photo finish. Skill is the main determinant; RNG varies outcomes among similar entrants.

For a dash, visual finish tick is `startTick + round(60 + 30*(1-score/maxScore))`. Results are awarded only at `startTick+90`, after all participants finish. Circuit legs use the same proportional finish mapping within each 30-tick leg; power trials show attempts at ticks 20, 45, and 70. These are presentations of committed scores, not separate physics that could disagree with the ranking.

During all 90 ticks, hunger increases at ordinary rate; fatigue gains an extra 6 total; boredom and loneliness fall by 15 total. Eligible contest XP uses quality 0.75: dash trains its skill for 90 ticks; circuit trains the current skill for 30 ticks each; power trial trains its selected skill for 90 ticks. Need gates still suppress XP when reached. Winners receive no extra inherited potential and no permanent performance multiplier.

### 9.3 Prizes, awards, and cancellation

The organizer supplies 1–3 ranked prizes from player inventory: up to three rare fruit per prize, one plant seed/item token, or one cosmetic token. Inventory is checked and subtracted into event escrow at start. There is no duplication or prize creation when resolving a race. A daily welcome cache supplies two rare fruit (prism pear on even days, spiral fruit on odd days), one rare seed alternating those species, and one cosmetic token cycling ribbon, leaf crown, and star pin by day modulo three; credit each elapsed day once, capped by inventory stack limits. This provides a renewable prize source without a grind requirement.

Fruit prizes go to the winner's pocket up to its eight-fruit total capacity, with overflow to player storage. Seed/item prizes return to player inventory tagged in the event history as donated by that winner. Cosmetic tokens become a cosmetic in that creature's collection; duplicates convert to one matching token returned to inventory. Cosmetics never affect skills or breeding.

First place receives confidence +3% for one day and recent valence +0.20; second and third receive +0.10; remaining entrants receive +0.03. Confidence replaces/refreshes the existing expiry and never stacks. Record wins and best performance in the life record. All entrants get normal activity-learning rewards.

Canceling before start changes no resources. Once started, the result is committed and the event normally finishes, including during offline replay. If corruption recovery or a required item removal forces cancellation, refund all escrow exactly once, clear entrants' event states, and award no prizes or win counts. Item removal through normal UI is disabled while its event runs. An explicit user cancel is allowed only before start. `awarded` and `escrowState` must make completion idempotent.

## 10. Fruit, items, and environment

### 10.1 Fruit catalog

Fruit effects are additive and applied once when eating completes. H/F/S mean hunger, fatigue, and stress change; all needs clamp to `[0,100]`. Every eaten fruit also lowers boredom by 4. Skill percentages are training-rate bonuses for 600 ticks, not XP granted by eating. For each skill, a new bonus replaces an active bonus only if it is at least as strong, and refreshes its expiry; a weaker bonus does nothing. Different skill bonuses coexist.

Taste columns are `(sweet,tart,earthy)` intensities, each `[0,1]`. Exposure columns are increments `(palette,body,aptitude)`. All listed fruit are original placeholder names and may be renamed while preserving IDs.

| ID / display name | H / F / S | Skill training bonus | Taste | Tint RGB hex | Exposure | Growth ticks / plant capacity |
|---|---|---|---|---|---|---|
| `sunapple` / Sunapple | −30 / 0 / −2 | run +25% | (0.9,0.3,0.1) | #F2AA4C | (.02,0,.02) | 180 / 6 |
| `dewberry` / Dewberry | −26 / −4 / −3 | swim +25% | (0.6,0.7,0.1) | #70B9E5 | (.04,0,0) | 150 / 6 |
| `cloudplum` / Cloudplum | −24 / 0 / −4 | fly +25% | (0.7,0.4,0.2) | #C5B1E8 | (.02,0,.03) | 180 / 6 |
| `vinefig` / Vinefig | −32 / +2 / −2 | climb +25% | (0.5,0.2,0.8) | #89A873 | (0,.04,0) | 180 / 6 |
| `stonepear` / Stonepear | −38 / +4 / −1 | strength +25% | (0.3,0.2,0.9) | #C6AD87 | (0,.04,.01) | 240 / 6 |
| `ambermelon` / Ambermelon | −40 / −8 / −3 | stamina +25% | (0.8,0.2,0.3) | #EDCA64 | (.02,.02,0) | 240 / 6 |
| `moonpeach` / Moonpeach | −26 / +8 / −14 | stamina +10% | (0.8,0.1,0.4) | #EAB3C5 | (.03,0,0) | 210 / 6 |
| `sparkcherry` / Sparkcherry | −20 / −12 / +4 | run +15%, climb +15% | (0.4,1.0,0.1) | #EB795B | (0,.02,.03) | 150 / 6 |
| `prismpear` / Prism Pear, rare | −30 / 0 / −6 | fly +20%, swim +20% | (0.7,0.6,0.3) | #8DD5C9 | (.16,0,0) | 600 / 3 |
| `spiralfruit` / Spiral Fruit, rare | −34 / +2 / −6 | strength +20%, climb +20% | (0.5,0.4,0.9) | #D49BCB | (0,.16,0) | 600 / 3 |

The garden runs without watering. New common plants mature in one day; rare plants in two. A mature plant accumulates growth progress continuously and produces one fruit per growth interval up to capacity. When full, reset its progress to zero and stop accumulating; it cannot bank a hidden harvest. Reserved fruit remains counted against capacity until consumed. Unharvested fruit does not spoil. Loose fruit spoils after two days; pockets and player inventory do not. Dropped fruit limit is 80; excess stays in its source inventory. All inventory stacks cap at 999; overflow from passive daily grants is discarded with one aggregated log entry.

### 10.2 Individual food preferences

Normalize the three expressed taste genes to weights summing to 1; if their sum is zero, use one third each. For fruit f:

```text
geneTaste = 2*dot(tasteWeights, f.taste) - 1
repeat = count(f in lastFiveFoods)/5
preference = clamp(0.60*geneTaste + 0.40*learnedMean[f] - 0.25*repeat, -1, 1)
reward = clamp(0.65*geneTaste + 0.25*(hungerBefore/100)
               + 0.10*clamp(-f.stressDelta/14,0,1)
               - 0.30*(hungerBefore<25 ? 1 : 0) - 0.20*repeat, -1,1)
learnedMean[f] = 0.80*learnedMean[f] + 0.20*reward
recentValence += 0.15*preference
stress -= 4*max(0,preference)
```

Compute preference/reward from pre-meal state and history, then apply the fruit, then update learned mean and the five-entry food history. Update sample count even for disliked food. Preference ≥0.35 after three meals is labeled “favorite”; ≤−0.25 after three is “dislikes.” Labels are current learned judgments, not permanent genes. Each food candidate's preference goes into utility; a favorite cannot override urgent hunger recovery or inaccessible terrain.

### 10.3 Habitat and placeable items

The world is a fixed 64×48 tile map, tile art size 32 px, total 2,048×1,536 px. Use grass, soil, shallow water, deep water, rock, and blocked terrain. Theme is a calm woodland clearing with a pond, garden, and wind-exposed rise. Day color and ambient sound change, but there is no weather damage or seasonal crop failure.

For a reproducible default map, start with grass; block the outermost border; fill the ellipse `((x-44)/10)^2+((y-20)/8)^2≤1` with shallow water, and the inner ellipse using radii 7 and 5 with deep water. Place rock rectangle x=10..17, y=8..13, and soil rectangle x=8..22, y=29..36. All endpoints are inclusive tile indices. Keep an unbroken grass route around every feature. No procedural world generation is needed for version 1.0.

| Item / footprint | Capacity | Available action or rule |
|---|---:|---|
| Welcome nest / 2×2 | One courtship; eggs may overlap decoratively | Fixed at (28,24); cannot remove; incoming eggs spawn on adjacent safe land |
| Extra nest / 2×2 | One courtship | Free blueprint; allows simultaneous pairs |
| Bed / 1×1 | One sleeper | Sleep; cosmetic shelter only, same recovery rate as safe land |
| Track marker / 1×1 | Two | Dedicated running practice |
| Wind perch / 1×1 | Two | Dedicated flight practice |
| Climbing frame / 2×1 | Two | Dedicated climbing practice |
| Push stone / 1×1 | Two | Dedicated strength practice |
| Trail marker / 1×1 | Two | Dedicated stamina practice |
| Toy / 1×1 | Two | Play target; no extra bond multiplier |
| Competition pad / 3×2 | Eight entrants | Organized event; one active event globally |
| Fruit plant / 1×1 | One eating/harvest claim per ripe fruit | Catalog species; needs adjacent walkable cell |
| Cosmetic lantern / 1×1 | None | Light and visual ambience, no hidden stat effect |

Limit non-plant items to 64 and plants to 32, including fixed items in their respective limits. Items and plants occupy ground cells, but walking interactions use adjacent cells. They block ordinary paths; reserve separate adjacent approach cells for simultaneous participants. Natural land practice requires no item claim. Build placement must preserve a route from every mobile creature to at least one grass tile, the welcome nest adjacency, and one viable food source or grazing tile. Reject overlaps with terrain water, blocked cells, existing footprints, creatures, eggs, or cocoons. Water editing and creature dragging are out of scope. Removing an unused item returns its token/seed only if it came from a token; free blueprints do not mint tokens. Removing a plant first cancels its eating actions and releases their claims, then returns no seed and transfers ripe fruit to player storage, subject to its cap. Removing a used ordinary training item similarly cancels its actions/sessions before removing the target; a running competition pad is protected.

Movement uses four-neighbor A*. Edge cost equals terrain cost divided by movement speed. Grass/soil cost 1/1.2; shallow water cost 1.8 for walkers; deep water is forbidden without swim ≥10. Swim cost is 1.0 in water. Rock cost is 2.0, reduced to 1.2 at climb ≥10. Flight at fly ≥25 has cost 0.9 on any nonblocked, non-item tile. Select the cheapest available mode per edge. Walk speed is `0.8*(1+0.006*runLevel)` tiles/second; swim is `0.65*(1+0.008*swimLevel)`; fly is `0.9*(1+0.008*flyLevel)`. No diagonal corner cutting, collision physics, drowning, or fall damage. Ordinary transit awards no training XP. Ties use tile index order.

Time of day is `(tick%DAY)/DAY`: dawn 0–0.10, day 0.10–0.60, dusk 0.60–0.70, night 0.70–1.00. At night, multiply ordinary fatigue gain by 1.25, increasing the utility of sleep; crops still grow normally. Sleeping suppresses fatigue gain as already specified. Layer a color overlay with maximum alpha 0.22 so the scene remains readable.

### 10.4 Starting state

Start at day zero, tick zero, with four unrelated adults and two unrelated juveniles. Adults start at level 12 in all skills and one round-robin specialty at 25; juveniles at level 5 in all skills. Set XP from those levels, clamp to genotype/stage caps, and start each stage with its full duration. Generated babies never receive these founder-only training grants. Initial needs match hatching; founder mood is 0.5. Seed initial bonds at 15 between all six, familiarity 0.2. No initial mate bonds.

Place six mature common plants, species sunapple/dewberry/cloudplum/vinefig/stonepear/ambermelon, at (10,30),(12,30),(14,30),(16,30),(18,30),(20,30), each holding six ripe fruit. Place one of every free training item, four beds, one extra nest, two toys, and one competition pad on distinct reachable grass tiles near (26,24), using the first valid cell in increasing squared distance then tile index. Spawn creatures at similarly chosen safe cells near (26,22). Player inventory begins with two seeds of each common fruit, one seed of each rare fruit, four of each rare fruit, and three ribbon tokens. The first daily cache arrives at tick DAY, not immediately at zero.

## 11. UI and UX

**Main layout:** canvas habitat in the center; play/pause, speed, simulated day, population, and save state along the top; a collapsible selected-creature panel on the right; inventory/build/competitions/family/discoveries tabs along the bottom. Use ordinary HTML buttons and forms outside the canvas for keyboard access. At narrow widths, the inspector becomes a bottom sheet and only one management panel opens at a time.

| Surface | Required information and controls |
|---|---|
| Creature inspector | Name, stage and time remaining, mood/needs, actual action and destination, larger portrait, six level/cap bars, current bonuses, personality and drift, favorite/disliked fruit, close relationships, parents/children, breeding toggle |
| Genetics panel | Expressed traits, both alleles per locus, dominance explanation, parent origins, mutation highlights; clearly separates genes, training, and diet tint |
| Family tree | Organism nodes; parents above and children below; siblings grouped; each rebirth as a life tab within one node; dead nodes remain selectable |
| Relationship panel | Friend/rival/mate/family labels, bond values, latest three interactions; encourage, block, and exclusive-pair actions |
| Competition setup | Format, skills, stage and level filters, eligible/invalid entrants with reasons, inventory-backed prizes, preview of conditions and final Start button |
| Competition result | Ranking, scores, confidence, prizes, and a brief reason such as high swimming or low readiness; no unsupported narrative explanation |
| Discoveries | Portrait, signature components, first creature and tick; filters for part tier and lineage |
| Event history | Births, stage changes, rebirth/death, first discoveries, competitions, and immigration; bounded active log of 1,000 events |
| Return summary | Simulated elapsed time, capped/skipped wall time, births, deaths/rebirths, arrivals, new appearances, and competition outcomes; opens paused only if the saved game was paused |

Hovering is optional; every hover detail is also available by click/focus. Use text and icons as well as colors for moods, skills, and fruit. Minimum actionable size 44 CSS px. Keyboard: Space pause/resume, Escape close/cancel, arrows pan, Tab moves through real controls, Enter activates, plus/minus zoom. Prevent shortcuts while typing a name. Zoom range 0.5×–2×. Optional audio starts only after a user gesture and includes mute and independent volume controls. Default audio is off.

Breeding controls show a literal reason when an intended match cannot happen: “Related through grandparents,” “Needs a stronger bond,” “Not an adult,” or “Habitat capacity reserved.” Never silently force a pairing. On permanent death show a restrained notification with a link to the life record. No punishment language or pressure to return immediately.

## 12. Technical architecture and file and module layout

### 12.1 Stack and ownership

Use vanilla TypeScript, native ES modules, Canvas 2D for the habitat, and HTML/CSS for controls. Use the TypeScript compiler as a development dependency; no game engine, frontend framework, physics library, runtime CDN, backend, account, analytics, or external API is required. Compile to static files for ordinary HTTPS hosting. A development static-file server is tooling, not a game backend. Pin build-tool versions when implementing; this design does not depend on a particular newest release.

The simulation runs in a dedicated Web Worker and owns the only mutable world state. Main-thread UI sends typed commands, receives immutable render/inspector snapshots, and animates them with `requestAnimationFrame`. Browser background throttling means animation callbacks cannot be the authoritative game clock. Keep the simulation core usable without a DOM or Worker so it can run headlessly in tests. If Worker construction is unavailable, the same pure core may run on the main thread in short batches with a visible fallback notice.

IndexedDB stores game state and history in transactions; localStorage holds only small UI settings such as volume and last opened tab. Do not put the full family tree in localStorage. Use built-in browser APIs directly behind small project-owned adapters. Cache generated creature drawing paths/bitmaps keyed by phenotype signature plus tint bucket; invalidate on a level tier, stage, genetic, or visible-tint change.

| Path | Responsibility and public boundary |
|---|---|
| `index.html`, `styles.css` | Accessible shell and management panels |
| `src/main.ts` | UI boot, Worker lifecycle, command dispatch |
| `src/worker.ts` | Scheduling, offline replay chunks, save checkpoints, snapshot publication |
| `src/model/types.ts` | Canonical data types matching the JSON schema |
| `src/data/balance.ts` | Imports validated `balance.json`; supplies immutable tuning |
| `src/data/catalogs.ts` | Fruit/action/item/part definitions from this spec |
| `src/core/rng.ts` | Saved deterministic RNG, never `Math.random()` |
| `src/core/ids.ts` | Monotonic counters and stable ordering |
| `src/core/sim.ts` | `step(state, commands)` and event ordering |
| `src/core/commands.ts` | Command validation and atomic mutations |
| `src/genetics/genome.ts` | Founder generation and genome validation |
| `src/genetics/expression.ts` | Quantitative, hue, and categorical expression |
| `src/genetics/inheritance.ts` | Gametes, crossover, exposure-scaled mutation |
| `src/creatures/lifecycle.ts` | Stage transitions, rebirth, archives |
| `src/creatures/needs.ts` | Needs, mood, welfare, and personality drift |
| `src/creatures/skills.ts` | XP, level/caps, bonuses, performance |
| `src/ai/perception.ts` | Spatially bounded target collection |
| `src/ai/utility.ts` | Pure candidate scoring and thought explanations |
| `src/ai/actions.ts` | Ordinary action work and resource claims |
| `src/social/relationships.ts` | Symmetric bond state and interaction outcomes |
| `src/social/sessions.ts` | Two-participant invitations and shared work |
| `src/social/breeding.ts` | Eligibility, player policies, slots, egg creation |
| `src/social/genealogy.ts` | Parent DAG and ancestor/kinship queries |
| `src/world/map.ts`, `navigation.ts` | Terrain, placement validation, A*, traversal modes |
| `src/world/resources.ts` | Plants, food, inventory, daily grants, immigration |
| `src/competitions/events.ts` | Entry, escrow, committed results, one-time awards |
| `src/render/rig.ts`, `parts.ts` | Phenotype-to-geometry mapping and layering |
| `src/render/scene.ts`, `animation.ts` | Canvas camera, terrain, interpolation, cosmetic motion |
| `src/ui/inspector.ts`, `family.ts`, `competition.ts` | Panels, delegated events, validation reasons |
| `src/persistence/db.ts`, `validate.ts`, `migrate.ts` | IndexedDB transactions, import validation, version migrations |
| `src/persistence/offline.ts` | Wall-clock boundary, resumable catch-up jobs |
| `tests/` | Pure system, persistence, replay, and integration tests |
| `public/balance.json`, `public/save.schema.json` | Versioned machine-readable contracts |

Dependencies flow UI → commands → simulation systems → model/data. Rendering may read snapshots but may not mutate needs, RNG, skills, inventory, or relationships. Genetics may not read renderer state. The event journal records committed changes; replay does not depend on prose journal entries.

### 12.2 Determinism and efficient simulation

Use xorshift32 with a nonzero uint32 state. Save separate world, genetics, and competition streams plus one stream per creature. A new creature's stream and its organism appearance seed are drawn once from the world stream. Do not use wall-clock timestamps, frame rate, random sort comparators, or iteration over unordered input objects to make simulation decisions. Process entity arrays sorted by stable numeric ID. Categorical catalogs and neighbors have fixed order. Draw competition/session random values at acceptance and persist them.

```text
nextUint(rng):
    x = rng.state >>> 0
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5
    rng.state = x >>> 0
    return rng.state
U01(rng) = nextUint(rng) / 4294967296      // [0,1)
```

Seed zero maps to 1 on new-world creation; reject zero saved RNG states on import. Exact reproducibility is required in the same rules version and JS engine. Cross-engine floating-point bit identity is not promised; semantic equivalence is sufficient because the design uses `exp`, `sin`, and `cos`.

Use an 8×8-tile spatial hash, bounded candidate lists, and lazy relationship creation; 30 creatures imply at most 435 active unordered pairs. A* runs only when selecting/changing a destination or after a terrain change, not every tick. Cache paths in an LRU of 512 entries keyed by start/goal tile, traversal capability mask, the four movement-relevant skill levels, and terrain revision. Failure caches last 60 ticks and are disposable. Precompute tile neighbors. If a cached route becomes invalid, cancel and replan once; otherwise choose a local safe fallback. Try paths for the top three scored candidates, then sleep/graze/idle locally. Reservations and capacity checks run after route feasibility.

Render interpolated poses at the display's frame rate; simulation runs at one tick per simulated second. Emit state changes at at most 10 snapshots per real second. At 4×, four ticks per real second are sufficient; decorative animation must not need four times the GPU work. Optimize active simulation independently of archive size: family queries use cached ancestor sets, and UI virtualizes large history/tree lists.

Performance acceptance targets, to measure rather than assume: 30 active creatures plus 10,000 archived organisms; foreground `step` p95 under 4 ms; no UI task over 50 ms; worst default catch-up under 10 seconds on a documented ordinary laptop, with progress and cancel-to-export available. If replay exceeds this target, optimize caching and batching before altering simulation rules. Do not approximate away births, death, genotype mutation, or competition outcomes.

### 12.3 Saving, migration, and failure handling

Database `creature-habitat`, version 1, has stores `meta`, `world`, `organisms`, `relationships`, `events`, and `competitions`. `world` holds the active snapshot and compact world arrays; long-lived archive rows are separate. A single readwrite transaction commits the snapshot, revision, clock anchor, and dirty archive/ledger rows. Read all stores for a load through one readonly transaction. Export combines them into the schema's self-contained JSON form.

Autosave every 15 real seconds of foreground play and after births, death/rebirth, competition start/award, import, and major player edits. Save on `visibilitychange` to hidden and `pagehide` as a best effort; do not assume the browser will wait for an asynchronous exit save. A crash can lose at most the unsaved foreground interval under normal successful autosaving. Display “Saved,” “Saving,” or the actual failure. Quota errors must offer JSON export and never claim success. Request persistent storage from the main thread where supported; do not promise that browser storage cannot be cleared.

Keep two completed world revisions plus archive rows needed by them until the next successful commit, enabling rollback from a corrupt latest snapshot. Never delete the last good revision before validating the new one. Schema/rules versions are distinct: schema migration changes structure; rules migration declares any changed balance or semantics. A save cannot silently switch to new balance values without a rules migration recorded in its events.

Import accepts UTF-8 JSON up to 50 MiB. Parse, check the schema and semantic invariants in an isolated temporary state, migrate known older versions, and show population/time summary before replacing the current save. Reject unknown newer versions, invalid references, negative quantities, nonfinite numbers, impossible XP, circular genealogy, or too many active/reserved slots. Keep current state on failure. Render names/log text using text nodes, never imported HTML. An export contains no executable scripts or remote asset URLs. Keep only the newest 200 completed/cancelled competition records plus at most one draft and one running record; preserve lifetime win counts and genealogy when trimming detailed results.

Prevent two tabs from advancing the same world using an origin-scoped exclusive Web Lock where available. Only the owner may mutate or save; other tabs show read-only state and a “Take over after closing the other tab” message. Without Web Locks, use an IndexedDB lease acquired/renewed atomically with a 10-second expiry, heartbeat every 3 seconds, and revision compare-and-swap on every write. A stale writer must stop after a lease or revision failure. Release/checkpoint on hide where possible. IndexedDB revisions remain the final protection against split ownership.

### 12.4 Offline catch-up

The browser executes no simulation after the tab closes. On return, replay elapsed time from the most recent durable checkpoint. Default offline speed is 0.25× and at most 24 wall-clock hours per absence: up to 21,600 simulated ticks, or 18 habitat days. Foreground speed 2×/4× does not multiply this. An explicitly paused save, or disabled offline progression, advances zero ticks. These choices make daily absence meaningful without automatically simulating months.

Compute elapsed wall time as `max(0,nowMs-wallAnchorMs)`. Clamp to 86,400 seconds before multiplying by 0.25. Ignore negative clock changes; report a capped large forward jump without attempting anti-cheat. Carry subsecond simulated remainder in the save. Set the new anchor through the time accounted for, including discarded excess, so reopening cannot repeatedly claim the same absence.

Run the **same one-second simulation steps** as foreground, without rendering and without player commands. Do not invent a separate expected-value reproduction or mortality model. All needs, fruit, social events, aging, immigration, and already-started competitions progress. Process at most 12 ms of work per Worker chunk, then publish progress/yield. Checkpoint every 2,000 replay ticks with the remaining replay job in the same database transaction. If interrupted, resume the existing job before calculating a new elapsed interval. A finished job commits its final state, fractional remainder, and covered wall anchor atomically.

While hidden, stop foreground scheduling after a checkpoint; on visibility restoration, use this same catch-up path from the in-memory checkpoint or latest durable state, whichever is authoritative. Do not also count hidden elapsed time in the foreground `performance.now` accumulator. Reset that accumulator on resume. The UI renders a return summary using aggregate event counters, then resumes the saved foreground speed. Loading/replay calculation time itself need not generate additional gameplay ticks.

## 13. Data schemas in JSON

`save.schema.json` is a complete JSON Schema 2020-12 contract, supplied with this document. It defines the root save, every nested entity, required keys, nullable fields, legal enums, numeric ranges, and array limits. `example-save.json` is a complete, structurally valid empty-world checkpoint for bootstrap/import tests; it is not the six-creature default game. The live export includes the entire organism archive. The following structural map explains where authoritative data lives:

| Root key | Meaning |
|---|---|
| `schemaVersion`, `rulesVersion`, `revision`, `saveId` | Structure/rules identity and atomic save generation |
| `clock`, `rng`, `counters` | Simulation tick, wall anchor, replay job, independent RNG states, monotonic ID counters |
| `settings`, `breedingRules` | Autonomous controls, hard capacity, blocked/encouraged/exclusive organism pairs |
| `world` | Terrain RLE, revision, items, plants, loose fruit, immigration/cache deadlines |
| `creatures` | At most 30 active lives: stage, actions, needs, XP, acquired traits, pockets, bonuses |
| `organisms` | Permanent genomes, parental edges, appearance seeds, mutation traces, and life histories |
| `relationships`, `sessions` | Pair states and accepted interactions with saved phase/progress/rolls |
| `competitions` | Entry rules, prizes/escrow, committed scores, timers, and award status |
| `inventory` | Player fruit, seed, item, and cosmetic token quantities |
| `events`, `discoveries` | Bounded recent journal and permanent first-seen phenotype signatures |

The following is valid JSON Schema for the genome fragment. The full companion schema extends the same explicit conventions to every field in the root map. Chromosome locus semantics are additionally checked against section 3.1.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Genome Fragment Schema",
  "type": "object",
  "properties": {
    "aptitude": {
      "type": "object",
      "properties": {
        "haplotypes": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/allele"
            },
            "minItems": 6,
            "maxItems": 6
          },
          "minItems": 2,
          "maxItems": 2
        }
      },
      "required": [
        "haplotypes"
      ],
      "additionalProperties": false
    },
    "palette": {
      "type": "object",
      "properties": {
        "haplotypes": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/allele"
            },
            "minItems": 6,
            "maxItems": 6
          },
          "minItems": 2,
          "maxItems": 2
        }
      },
      "required": [
        "haplotypes"
      ],
      "additionalProperties": false
    },
    "shape": {
      "type": "object",
      "properties": {
        "haplotypes": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/allele"
            },
            "minItems": 6,
            "maxItems": 6
          },
          "minItems": 2,
          "maxItems": 2
        }
      },
      "required": [
        "haplotypes"
      ],
      "additionalProperties": false
    },
    "temperament": {
      "type": "object",
      "properties": {
        "haplotypes": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/allele"
            },
            "minItems": 8,
            "maxItems": 8
          },
          "minItems": 2,
          "maxItems": 2
        }
      },
      "required": [
        "haplotypes"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "aptitude",
    "palette",
    "shape",
    "temperament"
  ],
  "additionalProperties": false,
  "$defs": {
    "allele": {
      "type": "object",
      "properties": {
        "v": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 0,
              "maximum": 255
            },
            {
              "enum": [
                "solid",
                "spots",
                "stripes",
                "marbled",
                "round",
                "pointed",
                "folded"
              ]
            }
          ]
        },
        "d": {
          "enum": [
            0,
            1
          ]
        }
      },
      "required": [
        "v",
        "d"
      ],
      "additionalProperties": false
    }
  }
}
```

This concrete saved relationship is valid under the companion schema:

```json
{"a":"o_00000001","b":"o_00000002","bond":48,"rivalry":12,"familiarity":0.6,"mateBond":25,"lastContactTick":4200,"lastDecayTick":4200}
```

An active creature stores skill **XP**, for example:

```json
{"run":1450,"swim":280,"fly":0,"climb":4410,"strength":120,"stamina":600}
```

This yields levels 25, 10, 0, 45, 6, and 15 before applicable caps. Parent/child IDs and stage-specific caps are validated against the full save. Here is the complete paused bootstrap checkpoint; its empty population is intentional for tests:

```json
{
  "schemaVersion": 1,
  "rulesVersion": "1.0.0",
  "saveId": "world_example",
  "revision": 1,
  "clock": {
    "tick": 0,
    "wallAnchorMs": 1792454400000,
    "speed": 0,
    "offlineEnabled": true,
    "fractionalSeconds": 0,
    "catchup": null
  },
  "rng": {
    "world": 123456789,
    "genetics": 987654321,
    "competition": 246813579
  },
  "counters": {
    "creature": 1,
    "organism": 1,
    "item": 2,
    "plant": 1,
    "fruit": 1,
    "session": 1,
    "competition": 1,
    "event": 1
  },
  "settings": {
    "autoBreed": true,
    "autoImmigration": true,
    "capacity": 30
  },
  "breedingRules": {
    "blockedPairs": [],
    "encouragedPairs": [],
    "exclusivePairs": []
  },
  "world": {
    "width": 64,
    "height": 48,
    "terrainRle": [
      [
        5,
        65
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        45
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        45
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        45
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        45
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        26
      ],
      [
        2,
        1
      ],
      [
        0,
        18
      ],
      [
        5,
        2
      ],
      [
        0,
        9
      ],
      [
        4,
        8
      ],
      [
        0,
        22
      ],
      [
        2,
        9
      ],
      [
        0,
        14
      ],
      [
        5,
        2
      ],
      [
        0,
        37
      ],
      [
        2,
        13
      ],
      [
        0,
        12
      ],
      [
        5,
        2
      ],
      [
        0,
        36
      ],
      [
        2,
        7
      ],
      [
        3,
        1
      ],
      [
        2,
        7
      ],
      [
        0,
        11
      ],
      [
        5,
        2
      ],
      [
        0,
        35
      ],
      [
        2,
        4
      ],
      [
        3,
        9
      ],
      [
        2,
        4
      ],
      [
        0,
        10
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        4
      ],
      [
        3,
        11
      ],
      [
        2,
        4
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        3
      ],
      [
        3,
        13
      ],
      [
        2,
        3
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        3
      ],
      [
        3,
        13
      ],
      [
        2,
        3
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        33
      ],
      [
        2,
        3
      ],
      [
        3,
        15
      ],
      [
        2,
        3
      ],
      [
        0,
        8
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        3
      ],
      [
        3,
        13
      ],
      [
        2,
        3
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        3
      ],
      [
        3,
        13
      ],
      [
        2,
        3
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        34
      ],
      [
        2,
        4
      ],
      [
        3,
        11
      ],
      [
        2,
        4
      ],
      [
        0,
        9
      ],
      [
        5,
        2
      ],
      [
        0,
        35
      ],
      [
        2,
        4
      ],
      [
        3,
        9
      ],
      [
        2,
        4
      ],
      [
        0,
        10
      ],
      [
        5,
        2
      ],
      [
        0,
        36
      ],
      [
        2,
        7
      ],
      [
        3,
        1
      ],
      [
        2,
        7
      ],
      [
        0,
        11
      ],
      [
        5,
        2
      ],
      [
        0,
        37
      ],
      [
        2,
        13
      ],
      [
        0,
        12
      ],
      [
        5,
        2
      ],
      [
        0,
        39
      ],
      [
        2,
        9
      ],
      [
        0,
        14
      ],
      [
        5,
        2
      ],
      [
        0,
        43
      ],
      [
        2,
        1
      ],
      [
        0,
        18
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        7
      ],
      [
        1,
        15
      ],
      [
        0,
        40
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        2
      ],
      [
        0,
        62
      ],
      [
        5,
        65
      ]
    ],
    "terrainRevision": 0,
    "items": [
      {
        "id": "i_00000001",
        "kind": "welcome_nest",
        "x": 28,
        "y": 24,
        "sourceToken": null
      }
    ],
    "plants": [],
    "looseFruit": [],
    "nextImmigrationTick": 1200,
    "lastCacheDay": 0
  },
  "creatures": [],
  "organisms": [],
  "relationships": [],
  "sessions": [],
  "competitions": [],
  "inventory": {
    "fruit": {
      "sunapple": 0,
      "dewberry": 0,
      "cloudplum": 0,
      "vinefig": 0,
      "stonepear": 0,
      "ambermelon": 0,
      "moonpeach": 0,
      "sparkcherry": 0,
      "prismpear": 0,
      "spiralfruit": 0
    },
    "seeds": {
      "sunapple": 0,
      "dewberry": 0,
      "cloudplum": 0,
      "vinefig": 0,
      "stonepear": 0,
      "ambermelon": 0,
      "moonpeach": 0,
      "sparkcherry": 0,
      "prismpear": 0,
      "spiralfruit": 0
    },
    "items": {
      "nest": 0,
      "bed": 0,
      "track": 0,
      "wind_perch": 0,
      "climbing_frame": 0,
      "push_stone": 0,
      "trail_marker": 0,
      "toy": 0,
      "competition_pad": 0,
      "lantern": 0
    },
    "cosmetics": {
      "ribbon": 0,
      "leaf_crown": 0,
      "star_pin": 0
    }
  },
  "events": [],
  "discoveries": []
}
```

### Semantic invariants beyond JSON Schema

Validate these on import and after every debug-mode step. The structural schema cannot express cross-record references or equations.

1. All IDs are unique in their namespace; all references resolve. Counters exceed every previously issued ID, including archived IDs. Canonical pair arrays sort IDs ascending, contain distinct IDs, and have no duplicates.
2. Every active creature references exactly one organism and one currently open life record. Each organism has at most one active creature; lifeIndex equals its current life index. Genome chromosomes have exactly 6/6/6/8 loci per haplotype with the locus-specific allowed types and categorical dominance ranks.
3. Parent arrays have zero or two distinct existing organism IDs. The full parent graph is acyclic; neither parent can be the child. Rebirth changes life records, never parent edges.
4. Egg/cocoon XP is zero. Stage duration matches the rules version. `stageStartedTick ≤ clock.tick`, and stage progress is strictly below duration after a completed step. An egg/cocoon has no ordinary action, competition, or shared session. XP is at most the current stage/genetic cap cost, with all derived levels recomputed on load.
5. `active count + courtship count ≤ capacity=30`. Each creature participates in at most one session or competition; session participants and competition entrants are unique. Every accepted courtship has one nest claim and one implied slot reservation.
6. An eating action implies exactly one fruit claim. Total claims on a plant never exceed ripe count; no two actions claim the same loose fruit; pocket claims cannot exceed the owner's quantity, and the sum of pocket fruit counts is at most eight. Item claims do not exceed capacity. Resource counts are nonnegative integers.
7. Competing and session creatures have compatible action state. Travel for a shared session uses a `join_session` action; after arrival its action is null, and the session owns work/progress. Session work effects must not also run through ordinary action handlers.
8. Terrain RLE runs are `[terrainCode,count]`, with codes 0 grass, 1 soil, 2 shallow, 3 deep, 4 rock, 5 blocked. Counts sum to `width*height=3072`. Positions and paths are in bounds; items do not overlap and obey terrain/adjacency rules. Walkers cannot remain stranded in deep water after a migration or rebirth; recovery relocates to nearest safe land with an explicit event.
9. Competition `running` means escrow held, committed results present, `awarded=false`, and valid locked entrants. `completed` means escrow released, `awarded=true`, and no locks. Awarded prizes must agree with the event ledger, not be independently reapplied from a UI callback.
10. Exclusive pairs are disjoint; blocked policies override encouragement and exclusive pairing. Relationship values and all accumulated continuous values are finite. Buff expiry, cooldown, and day fields use ticks, never wall-clock milliseconds.
11. The save's balance/rules version must match its derived data. Update the open life record's displayName when a creature is renamed and update its bestLevels/wins/cosmetics when those values change. Cached phenotype/paths/UI thoughts are discarded and reconstructed on load. Do not trust serialized derived levels over XP/genome.

## 14. Simulation tick and pseudocode for key algorithms

### 14.1 Fixed ordering

State at tick `t` describes the instant after all work through that boundary. One step covers `[t,t+1)`. Commands queued for this step validate against state at `t`; interval work then runs; boundary transitions run at `t+1`. “Elapsed ticks” below refer to successful work time, not time traveling.

```text
step(state, commands):
    assert simulation owner lease is valid
    for command in commands sorted by sequence:
        validate then apply atomically, or return a reason with no mutation

    start = state.clock.tick; end = start + 1
    regeneratePlantsAndExpireLooseFruit(state, start, end)
    decayBonusesExposuresTintAndPersonality(state, dt=1)
    for creature in active creatures sorted by ID:
        if mobileLifeStage(creature):
            advancePassiveNeeds(creature, dt=1)
            advanceTravelOrOrdinaryWork(creature, dt=1)
    advanceSharedSessionsOnce(state, dt=1)
    advanceCompetitionWorkOnce(state, dt=1)
    updateMoodAndWelfareForMobileLives(state, dt=1)
    state.clock.tick = end

    cancelSessionsWhoseParticipantsReachIneligibleStagesAt(end)
    processLifecycleBoundariesInIDOrder(state, end)
    resolveStillValidOrdinaryAndSessionCompletions(state, end)
    resolveCompetitionAwardsOnce(state, end)
    if end % DAY == 0:
        resetPracticeCounters()
        grantDailyCacheOnce(day=end/DAY)
        considerOneFounderArrival()
    decayRelationshipsForElapsedUncontactedTime()
    updatePhenotypeDiscoveriesForChangedCreatures()
    for creature in active creatures sorted by ID:
        if decisionDue(creature) and not locked:
            decide(creature)
    updateJournalAndDirtySaveSets()
    assert debug invariants
```

Lifecycle boundaries have priority over same-boundary courtship completion: reaching elderhood cancels the courtship before it can lay an egg. New eggs/newborns do not receive the previous interval's needs or training. Fruit effects commit after that interval's need integration; mood catches up next tick through its smoother. Decay of expired bonuses uses `start` when determining which bonus was active during `[start,end)`, then removes bonuses whose expiry is `≤end`. No interval grants work twice.

### 14.2 Decision and navigation

```text
decide(c):
    if urgentNeed(c):
        cancelCurrentOrdinaryActionOrSharedSession(c)
        candidates = onlyUrgentSelfCareCandidates(c)
    else:
        candidates = boundedCandidates(c)
        if courtshipAttemptDue(c): addOrReplaceMateCandidateAfterOneAttemptRoll(c)
    candidates = filterByStageResourcesPoliciesAndTraversal(candidates)
    scores = candidates.map(a => scoreUtility(c,a))

    if c.currentAction is committed and workTicks < 8: return
    if currentActionStillValid and max(scores) < score(currentAction)+0.12: return

    ranked = sortByScoreThenStableTargetID(scores)
    reachable = checkOrFindPathsForTopThree(ranked)
    if reachable is empty: reachable = localSafeFallbacks(c)
    chosen = softmaxSample(reachable, temperature=.08, rng=c.rng)
    if chosen requires a partner:
        if not recipientWilling(chosen): setPartnerRetryDelay(60); return
        atomically createSessionAndClaimsOrFail()
    else:
        atomically reserveTargetAndStartActionOrFail()
    c.nextDecisionTick = nextIDStaggeredBoundary()
```

At completion, run selection without the current-action switching penalty. A sleeping creature may reselect sleep. If no reachable grass is available after an invalid import/migration, relocate once to the nearest safe grass tile and log recovery; do not repeatedly fail navigation forever.

### 14.3 Gametes and egg creation

```text
makeGamete(parentID, parentGenome, parentExposure, geneticsRng):
    gamete = []; mutations = []
    for chromosome in fixedChromosomeOrder:
        h = randomInt(0,1)
        cut = randomInt(1,len-1) if U01()<.65 else len
        out = []
        for locus in 0..len-1:
            source = h if locus<cut else 1-h
            allele = deepCopy(chromosome.haplotypes[source][locus])
            before = deepCopy(allele)
            p = baseMutationRate(locus)*(1+2*exposureFor(locus))
            if U01()<p: mutateValue(allele, locus)
            if quantitative(locus) and U01()<.002: allele.d = 1-allele.d
            if allele != before: recordMutation(parentID, chromosome, locus, before, allele)
            out.push(allele)
        gamete.push(out)
    return gamete, mutations

completeCourtship(session):
    if not eligibleAtCompletion(session): abortAndRelease(session); return
    assert session owns one reserved slot
    A,B = parents sorted by organismID
    gA,mA = makeGamete(A.organismId,A.genome,A.exposures,rng.genetics)
    gB,mB = makeGamete(B.organismId,B.genome,B.exposures,rng.genetics)
    childOrganism = newOrganism(parents=[A.organismId,B.organismId], genome=zip(gA,gB))
    childOrganism.mutations = mA+mB
    egg = newCreature(stage=egg, organism=childOrganism, xp=allZero)
    atomically:
        remove session reservation; insert childOrganism and egg
        increase both clutch counts; set both cooldowns = now + 3*DAY
        apply courtship relationship outcome; release nest; record birth
```

### 14.4 Completion and prize idempotence

```text
finishCompetition(event):
    if event.status != running or event.awarded: return
    assert now >= event.endTick and event.escrowState == held
    atomically in one simulation mutation:
        for rank in 1..entrantCount:
            applyRankMoodAndConfidence(event.ranking[rank])
            if a prize exists for rank: transferFromEscrowExactlyOnce(prize, winner)
            recordWinAndPerformance()
        release all entrant locks and restore safe positions
        event.awarded = true; event.escrowState = released
        event.status = completed
        append one result event
    requestImmediateTransactionalSave()
```

### 14.5 Resumable offline replay

```text
resumeGame(saved, nowMs):
    validateAndMigrate(saved)
    if saved.clock.catchup != null:
        finishExistingJobWithCheckpoints(saved)  // never recompute its budget
        nowMs = currentWallClockMs()
    elapsedSeconds = max(0, (nowMs - saved.clock.wallAnchorMs)/1000)
    if saved.clock.speed == 0 or not saved.clock.offlineEnabled:
        saved.clock.wallAnchorMs = nowMs
        commit(saved); return saved
    budget = min(elapsedSeconds, 86400)*.25 + saved.clock.fractionalSeconds
    saved.clock.catchup = {
        remainingTicks: floor(budget),
        finalFractionalSeconds: budget-floor(budget),
        throughWallMs: nowMs
    }
    commit(saved)                              // job and starting state together
    finishExistingJobWithCheckpoints(saved)
    resetForegroundMonotonicAccumulator()
    return saved

finishExistingJobWithCheckpoints(state):
    while job.remainingTicks > 0:
        work until 12 real milliseconds have elapsed:
            step(state, [])
            job.remainingTicks -= 1
            if no ticks remain: break
        publish progress; yield to Worker event loop
        if 2000 ticks since checkpoint: commit(state including job)
    state.clock.wallAnchorMs = job.throughWallMs
    state.clock.fractionalSeconds = job.finalFractionalSeconds
    state.clock.catchup = null
    commit(state)                              // completion and anchor atomic
```

Capture `nowMs` after finishing a pre-existing job when computing the subsequent absence; otherwise its elapsed wall time may be underestimated. At the end of loading, set the foreground wall anchor to actual resume time without simulating time spent doing the replay. Fractional time is preserved across ordinary saves; speed changes apply only to subsequent elapsed intervals. At 1×, a foreground accumulator adds `realElapsedSeconds*speed`, stepping while ≥1. If a foreground frame stalls for more than five seconds, treat the gap as a visibility-style catch-up instead of silently dropping ticks or running an unbounded main-thread loop.

## 15. MVP scope and ordered milestones

The complete MVP includes all six skills, ten fruit, six lifecycle stages plus death, four chromosome pairs, and all three competition formats. It excludes combat, predation, sickness, procedural worlds, external accounts, multiplayer, neural networks, fluid physics, terrain editing, finite achievement completion, and elemental/species types. Each milestone must be runnable with the previous milestones and must leave a small deterministic test fixture.

| Order | Independently buildable result | Required verification before continuing |
|---|---|---|
| 1 | Pure state model, RNG, clock, command queue, empty Canvas shell, pause/speed | Same seed and 1,000 steps produce the same state hash; pause advances zero ticks; RNG sequence matches a fixture |
| 2 | Map, safe navigation, one adult, needs, graze/eat/sleep/idle, four initial fruit | Run two simulated days without input; creature eats and rests; inaccessible target fails safely; no negative fruit |
| 3 | Six skills, ten fruit, XP caps, preferences, basic modular rig | Check XP threshold/inverse formula at every integer level; all skill tiers render; wingless/finless practice can unlock traversal |
| 4 | Genome generation, dominance, crossover, mutation, phenotype expression | With mutation disabled, alleles come only from legal parental segments; solid/spots cross approaches 25% recessive over 20,000 seeded children; mutation ranges remain valid |
| 5 | Six autonomous founders, play/comfort/contests, tendencies and relationship UI | Friendly/rude outcomes update once; needs interrupt shared sessions; two creatures cannot simultaneously claim one partner or one fruit |
| 6 | Courtship, policies, eggs, kinship, slot reservations, full lifecycle and rebirth | Start two courtships at 29 occupied slots: only one succeeds; known cousin/ancestor fixtures block; birth, death, rebirth preserve DAG and slots |
| 7 | Inventory, gardening, building, default habitat, discovery log | Placement cannot isolate creatures; reserved fruit cannot be manually harvested; daily cache and immigration each run once per day |
| 8 | Competitions, prizes, entry filters, committed scores, confidence | Strong entrants win more often against otherwise identical weaker ones; scoring mean/noise bounds match formulas; duplicate finish calls cannot duplicate prizes |
| 9 | IndexedDB, import/export, migrations, ownership, offline jobs | Round-trip an in-progress courtship and competition; replay interrupted at each checkpoint equals uninterrupted replay; only one tab saves; corrupt import preserves current world |
| 10 | Family explorer, larger portraits, thought explanations, accessible controls and polish | All required panels work by keyboard; reduced motion works; 12-hour no-input run stays finite and valid; benchmark 30 active/10,000 archived organisms |

Use accelerated **headless simulation time** for tests. Do not require a human to wait through a whole life. Distribution tests use fixed seeds and wide statistical tolerances, not one fragile exact random percentage. A balance test should report hunger/fatigue percentiles, population, births/deaths, stage distribution, skill percentiles, and genotype diversity after 12 and 48 simulated hours. Those measurements guide tuning; never silently replace a formula to hit an assumed target.

Minimum final integration fixtures: a fully occupied world, one remaining slot with two simultaneous proposals, all creatures related, zero active creatures, a newborn with a rare mutation, an elder one tick from departure, a rebirth cocoon, fruit claimed while its plant is removed, a save with a running event, a backward wall-clock change, and an absence longer than the catch-up cap.

## 16. Balancing parameters in one tunable table

The table below is generated from `balance.json`; paths are the exact configuration keys. Numbers appearing elsewhere in this specification restate these defaults for readability. Change the JSON and regenerate this table together. Enum definitions, schema safety limits, attachment coordinates, and content-catalog rows are contracts/data rather than live tuning controls. Any shipped change to these defaults increments `rulesVersion` and defines how old saves migrate.

| Configuration path | Default | Unit or meaning |
|---|---:|---|
| `rulesVersion` | `"1.0.0"` | As defined in the corresponding system |
| `clock.tickSeconds` | `1` | As defined in the corresponding system |
| `clock.dayTicks` | `1200` | Simulation ticks |
| `clock.foregroundSpeeds` | `[0,1,2,4]` | As defined in the corresponding system |
| `clock.offlineRate` | `0.25` | As defined in the corresponding system |
| `clock.offlineWallCapSeconds` | `86400` | As defined in the corresponding system |
| `clock.stallThresholdSeconds` | `5` | As defined in the corresponding system |
| `population.capacity` | `30` | As defined in the corresponding system |
| `population.densityFullUntil` | `18` | As defined in the corresponding system |
| `population.initialAdults` | `4` | As defined in the corresponding system |
| `population.initialJuveniles` | `2` | As defined in the corresponding system |
| `population.immigrationMinimum` | `4` | As defined in the corresponding system |
| `population.immigrationDiversityThreshold` | `12` | As defined in the corresponding system |
| `population.immigrationIntervalDays` | `1` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.egg` | `0.5` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.baby` | `2` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.juvenile` | `4` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.adult` | `36` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.elder` | `6` | Habitat days; 1 day = 1,200 ticks |
| `life.stageDays.cocoon` | `1` | Habitat days; 1 day = 1,200 ticks |
| `life.stageSize.baby` | `0.55` | As defined in the corresponding system |
| `life.stageSize.juvenile` | `0.78` | As defined in the corresponding system |
| `life.stageSize.adult` | `1` | As defined in the corresponding system |
| `life.stageSize.elder` | `0.95` | As defined in the corresponding system |
| `life.stageLearning.baby` | `0.6` | As defined in the corresponding system |
| `life.stageLearning.juvenile` | `1.25` | As defined in the corresponding system |
| `life.stageLearning.adult` | `1` | As defined in the corresponding system |
| `life.stageLearning.elder` | `0.5` | As defined in the corresponding system |
| `life.stageSkillCap.baby` | `15` | Skill level |
| `life.stageSkillCap.juvenile` | `45` | Skill level |
| `life.stageSkillCap.adult` | `100` | Skill level |
| `life.stageSkillCap.elder` | `100` | Skill level |
| `life.rebirthChance` | `0.6` | Probability per specified opportunity |
| `life.rebirthMaximum` | `2` | As defined in the corresponding system |
| `life.rebirthWelfareMinimum` | `0.7` | As defined in the corresponding system |
| `life.rebirthFriendCount` | `2` | As defined in the corresponding system |
| `life.rebirthFriendBond` | `40` | As defined in the corresponding system |
| `life.rebirthMemoryRetention` | `0.5` | As defined in the corresponding system |
| `life.rebirthRivalryRetention` | `0.25` | As defined in the corresponding system |
| `life.elderPerformance` | `0.85` | As defined in the corresponding system |
| `genetics.crossoverChance` | `0.65` | Probability per specified opportunity |
| `genetics.quantitativeMutation` | `0.008` | Probability per specified opportunity |
| `genetics.categoricalMutation` | `0.004` | Probability per specified opportunity |
| `genetics.dominanceMutation` | `0.002` | Probability per specified opportunity |
| `genetics.mutationStep` | `[1,24]` | As defined in the corresponding system |
| `genetics.dominantWeight` | `0.75` | Dimensionless coefficient |
| `genetics.founderAptitudeBytes` | `[64,192]` | As defined in the corresponding system |
| `genetics.patternProbabilities` | `[0.4,0.25,0.25,0.1]` | As defined in the corresponding system |
| `genetics.earProbabilities` | `[0.5,0.35,0.15]` | As defined in the corresponding system |
| `genetics.exposureMultiplier` | `2` | Dimensionless coefficient |
| `genetics.exposureDecayDays` | `3` | Habitat days; 1 day = 1,200 ticks |
| `genetics.trainingExposureDenominatorDays` | `6` | Habitat days; 1 day = 1,200 ticks |
| `needs.perMinute.hunger` | `2` | Need points per simulated minute |
| `needs.perMinute.fatigue` | `1.2` | Need points per simulated minute |
| `needs.perMinute.boredom` | `2` | Need points per simulated minute |
| `needs.perMinute.loneliness` | `1.6` | Need points per simulated minute |
| `needs.perMinute.stress` | `-0.8` | Need points per simulated minute |
| `needs.hungerFatigueStageMultiplier.baby` | `1.2` | Dimensionless coefficient |
| `needs.hungerFatigueStageMultiplier.juvenile` | `1.1` | Dimensionless coefficient |
| `needs.hungerFatigueStageMultiplier.adult` | `1` | Dimensionless coefficient |
| `needs.hungerFatigueStageMultiplier.elder` | `0.9` | Dimensionless coefficient |
| `needs.curiosityBoredomBase` | `0.75` | As defined in the corresponding system |
| `needs.curiosityBoredomWeight` | `0.5` | Dimensionless coefficient |
| `needs.sociabilityLonelinessBase` | `0.25` | As defined in the corresponding system |
| `needs.sociabilityLonelinessWeight` | `0.75` | Dimensionless coefficient |
| `needs.nightFatigueMultiplier` | `1.25` | Dimensionless coefficient |
| `needs.sleepLonelinessMultiplier` | `0.5` | Dimensionless coefficient |
| `needs.urgentThreshold` | `85` | As defined in the corresponding system |
| `needs.stressExclusionThreshold` | `90` | As defined in the corresponding system |
| `needs.sleepExitFatigue` | `15` | As defined in the corresponding system |
| `needs.eatMinimumHunger` | `15` | As defined in the corresponding system |
| `needs.newborn` | `[25,15,10,10,0]` | As defined in the corresponding system |
| `mood.needWeights` | `[0.3,0.3,0.15,0.15,0.1]` | Dimensionless coefficient |
| `mood.responseTicks` | `60` | Simulation ticks |
| `mood.valenceDecayTicks` | `120` | Simulation ticks |
| `mood.valenceBounds` | `[-0.5,0.5]` | As defined in the corresponding system |
| `mood.labelThreshold` | `0.25` | As defined in the corresponding system |
| `personality.driftLimit` | `0.3` | As defined in the corresponding system |
| `personality.returnTimeDays` | `20` | Habitat days; 1 day = 1,200 ticks |
| `personality.positiveEventStep` | `0.005` | As defined in the corresponding system |
| `personality.rudeGentlenessStep` | `-0.005` | As defined in the corresponding system |
| `personality.rudeRecipientBoldnessStep` | `-0.003` | As defined in the corresponding system |
| `personality.rewardCooldownTicks` | `60` | Simulation ticks |
| `ai.decisionIntervalTicks` | `5` | Simulation ticks |
| `ai.minimumWorkCommitTicks` | `8` | Simulation ticks |
| `ai.switchMargin` | `0.12` | As defined in the corresponding system |
| `ai.temperature` | `0.08` | As defined in the corresponding system |
| `ai.candidateCounts.food` | `4` | As defined in the corresponding system |
| `ai.candidateCounts.social` | `4` | As defined in the corresponding system |
| `ai.candidateCounts.perSkill` | `2` | As defined in the corresponding system |
| `ai.candidateCounts.other` | `5` | As defined in the corresponding system |
| `ai.pathAttempts` | `3` | As defined in the corresponding system |
| `ai.utility.needs` | `2` | Utility score coefficient |
| `ai.utility.personality` | `0.18` | Utility score coefficient |
| `ai.utility.preference` | `0.12` | Utility score coefficient |
| `ai.utility.growth` | `0.12` | Utility score coefficient |
| `ai.utility.social` | `0.1` | Utility score coefficient |
| `ai.utility.encourage` | `0.15` | Utility score coefficient |
| `ai.utility.courtship` | `0.35` | Utility score coefficient |
| `ai.utility.travelPenalty` | `0.15` | Utility score coefficient |
| `ai.utility.fatiguePenalty` | `0.2` | Utility score coefficient |
| `ai.utility.repeatPenalty` | `0.08` | Utility score coefficient |
| `ai.reliefScales` | `[30,36,20,18,12]` | As defined in the corresponding system |
| `ai.travelScaleSeconds` | `30` | As defined in the corresponding system |
| `ai.fatiguePenaltyScale` | `20` | As defined in the corresponding system |
| `ai.encourageTicks` | `600` | Simulation ticks |
| `ai.learningRate` | `0.2` | As defined in the corresponding system |
| `ai.socialRadiusTiles` | `12` | As defined in the corresponding system |
| `ai.wanderRadiusTiles` | `8` | As defined in the corresponding system |
| `ai.exploreRadiusTiles` | `12` | As defined in the corresponding system |
| `ai.partnerRetryTicks` | `60` | Simulation ticks |
| `skills.capBase` | `40` | As defined in the corresponding system |
| `skills.capRange` | `60` | As defined in the corresponding system |
| `skills.xpLinear` | `8` | As defined in the corresponding system |
| `skills.xpQuadratic` | `2` | As defined in the corresponding system |
| `skills.baseXpPerSecond` | `1` | As defined in the corresponding system |
| `skills.aptitudeBase` | `0.6` | As defined in the corresponding system |
| `skills.aptitudeWeight` | `0.8` | Dimensionless coefficient |
| `skills.capTaper` | `0.75` | As defined in the corresponding system |
| `skills.moodBase` | `0.75` | As defined in the corresponding system |
| `skills.moodWeight` | `0.25` | Dimensionless coefficient |
| `skills.improvisedQuality` | `0.75` | As defined in the corresponding system |
| `skills.dailyFullRateTicks` | `240` | Simulation ticks |
| `skills.dailyReducedMultiplier` | `0.5` | Dimensionless coefficient |
| `skills.visualThresholds` | `[10,25,45,70]` | As defined in the corresponding system |
| `skills.deepWaterMinimum` | `10` | Skill level |
| `skills.flightMinimum` | `25` | Skill level |
| `skills.rockMinimum` | `10` | Skill level |
| `skills.founderAdultLevel` | `12` | Skill level |
| `skills.founderSpecialtyLevel` | `25` | Skill level |
| `skills.founderJuvenileLevel` | `5` | Skill level |
| `appearance.widthScale` | `[0.65,1.65]` | Geometry multiplier range |
| `appearance.heightScale` | `[0.7,1.5]` | Geometry multiplier range |
| `appearance.headScale` | `[0.7,1.5]` | Geometry multiplier range |
| `appearance.limbScale` | `[0.6,1.7]` | Geometry multiplier range |
| `appearance.tailScale` | `[0.5,1.8]` | Geometry multiplier range |
| `appearance.saturation` | `[45,85]` | As defined in the corresponding system |
| `appearance.lightness` | `[38,66]` | As defined in the corresponding system |
| `appearance.tintMaximum` | `0.18` | As defined in the corresponding system |
| `appearance.tintPerFruit` | `0.025` | As defined in the corresponding system |
| `appearance.tintBlendWeight` | `0.2` | Dimensionless coefficient |
| `appearance.tintHalfLifeDays` | `1` | Habitat days; 1 day = 1,200 ticks |
| `appearance.maximumRigPixels` | `112` | As defined in the corresponding system |
| `appearance.collisionTiles` | `0.65` | As defined in the corresponding system |
| `social.friendBond` | `40` | As defined in the corresponding system |
| `social.closeFriendBond` | `70` | As defined in the corresponding system |
| `social.dislikedBond` | `-30` | As defined in the corresponding system |
| `social.rivalThreshold` | `40` | As defined in the corresponding system |
| `social.mateBondThreshold` | `50` | As defined in the corresponding system |
| `social.rudePlayBaseChance` | `0.02` | Probability per specified opportunity |
| `social.rudePlayTraitChance` | `0.18` | Probability per specified opportunity |
| `social.decayGraceDays` | `1` | Habitat days; 1 day = 1,200 ticks |
| `social.bondDecayDays` | `30` | Habitat days; 1 day = 1,200 ticks |
| `social.rivalryDecayDays` | `10` | Habitat days; 1 day = 1,200 ticks |
| `social.familiarityPlayGain` | `0.05` | As defined in the corresponding system |
| `social.inviteMinimumUtility` | `0.15` | As defined in the corresponding system |
| `social.inviteCurrentUtilityMargin` | `0.05` | As defined in the corresponding system |
| `social.travelTimeoutTicks` | `60` | Simulation ticks |
| `social.informalPairCooldownTicks` | `120` | Simulation ticks |
| `social.newbornParentBond` | `25` | As defined in the corresponding system |
| `social.newbornSiblingBond` | `10` | As defined in the corresponding system |
| `social.initialFounderBond` | `15` | As defined in the corresponding system |
| `social.mateAffinityWeight` | `0.2` | Dimensionless coefficient |
| `social.contestAffinityWeights` | `[0.5,0.5]` | Dimensionless coefficient |
| `breeding.minimumBond` | `30` | As defined in the corresponding system |
| `breeding.minimumCompatibility` | `0.45` | As defined in the corresponding system |
| `breeding.compatibilityWeights` | `[0.55,0.2,0.15,0.1]` | Dimensionless coefficient |
| `breeding.needMaximumExclusive` | `55` | As defined in the corresponding system |
| `breeding.stressMaximumExclusive` | `50` | As defined in the corresponding system |
| `breeding.minimumMood` | `0.1` | As defined in the corresponding system |
| `breeding.adultTimeRemainingTicks` | `41` | Simulation ticks |
| `breeding.maximumClutches` | `5` | As defined in the corresponding system |
| `breeding.cooldownDays` | `3` | Habitat days; 1 day = 1,200 ticks |
| `breeding.attemptIntervalTicks` | `60` | Simulation ticks |
| `breeding.attemptChanceCoefficient` | `0.25` | Probability per specified opportunity |
| `breeding.encouragementMultiplier` | `1.5` | Dimensionless coefficient |
| `breeding.recipientMinimumUtility` | `0.25` | As defined in the corresponding system |
| `breeding.courtshipWorkTicks` | `40` | Simulation ticks |
| `breeding.mateBondCompatibilityWeight` | `0.1` | Dimensionless coefficient |
| `breeding.rivalryCompatibilityPenalty` | `0.1` | As defined in the corresponding system |
| `competition.minimumEntrants` | `2` | As defined in the corresponding system |
| `competition.maximumEntrants` | `8` | As defined in the corresponding system |
| `competition.durationTicks` | `90` | Simulation ticks |
| `competition.elderRemainingMinimumTicks` | `120` | Simulation ticks |
| `competition.needMaximumInclusive` | `60` | As defined in the corresponding system |
| `competition.stressMaximumInclusive` | `60` | As defined in the corresponding system |
| `competition.minimumMood` | `-0.25` | As defined in the corresponding system |
| `competition.conditionBase` | `0.55` | As defined in the corresponding system |
| `competition.conditionWeight` | `0.45` | Dimensionless coefficient |
| `competition.skillOffset` | `5` | As defined in the corresponding system |
| `competition.primarySkillWeight` | `0.85` | Dimensionless coefficient |
| `competition.staminaWeight` | `0.15` | Dimensionless coefficient |
| `competition.noiseAmplitude` | `0.08` | As defined in the corresponding system |
| `competition.confidenceBonus` | `0.03` | As defined in the corresponding system |
| `competition.confidenceDays` | `1` | Habitat days; 1 day = 1,200 ticks |
| `competition.extraFatigue` | `6` | As defined in the corresponding system |
| `competition.boredomRelief` | `15` | As defined in the corresponding system |
| `competition.lonelinessRelief` | `15` | As defined in the corresponding system |
| `competition.maximumFruitPerPrize` | `3` | As defined in the corresponding system |
| `competition.maximumRankedPrizes` | `3` | As defined in the corresponding system |
| `food.bonusDurationTicks` | `600` | Simulation ticks |
| `food.boredomRelief` | `4` | As defined in the corresponding system |
| `food.historyLength` | `5` | As defined in the corresponding system |
| `food.genePreferenceWeight` | `0.6` | Dimensionless coefficient |
| `food.learnedPreferenceWeight` | `0.4` | Dimensionless coefficient |
| `food.repeatPreferencePenalty` | `0.25` | As defined in the corresponding system |
| `food.favoriteThreshold` | `0.35` | As defined in the corresponding system |
| `food.dislikeThreshold` | `-0.25` | As defined in the corresponding system |
| `food.labelMinimumMeals` | `3` | As defined in the corresponding system |
| `food.pocketCapacity` | `8` | As defined in the corresponding system |
| `food.inventoryStackCapacity` | `999` | As defined in the corresponding system |
| `food.looseFruitCapacity` | `80` | As defined in the corresponding system |
| `food.looseSpoilDays` | `2` | Habitat days; 1 day = 1,200 ticks |
| `food.commonMaturityDays` | `1` | Habitat days; 1 day = 1,200 ticks |
| `food.rareMaturityDays` | `2` | Habitat days; 1 day = 1,200 ticks |
| `world.widthTiles` | `64` | As defined in the corresponding system |
| `world.heightTiles` | `48` | As defined in the corresponding system |
| `world.tilePixels` | `32` | As defined in the corresponding system |
| `world.itemMaximum` | `64` | As defined in the corresponding system |
| `world.plantMaximum` | `32` | As defined in the corresponding system |
| `world.walkBaseSpeed` | `0.8` | As defined in the corresponding system |
| `world.runSpeedWeight` | `0.006` | Dimensionless coefficient |
| `world.swimBaseSpeed` | `0.65` | As defined in the corresponding system |
| `world.swimSpeedWeight` | `0.008` | Dimensionless coefficient |
| `world.flyBaseSpeed` | `0.9` | As defined in the corresponding system |
| `world.flySpeedWeight` | `0.008` | Dimensionless coefficient |
| `world.terrainCosts.grass` | `1` | As defined in the corresponding system |
| `world.terrainCosts.soil` | `1.2` | As defined in the corresponding system |
| `world.terrainCosts.shallowWalking` | `1.8` | As defined in the corresponding system |
| `world.terrainCosts.swimming` | `1` | As defined in the corresponding system |
| `world.terrainCosts.rock` | `2` | As defined in the corresponding system |
| `world.terrainCosts.trainedRock` | `1.2` | As defined in the corresponding system |
| `world.terrainCosts.flying` | `0.9` | As defined in the corresponding system |
| `world.nightOverlayAlpha` | `0.22` | As defined in the corresponding system |
| `persistence.autosaveRealSeconds` | `15` | Real seconds |
| `persistence.replayChunkRealMs` | `12` | Real milliseconds |
| `persistence.replayCheckpointTicks` | `2000` | Simulation ticks |
| `persistence.eventLogLimit` | `1000` | As defined in the corresponding system |
| `persistence.completedCompetitionLimit` | `200` | As defined in the corresponding system |
| `persistence.pathCacheEntries` | `512` | As defined in the corresponding system |
| `persistence.pathFailureTicks` | `60` | Simulation ticks |
| `persistence.snapshotMaximumRealHz` | `10` | As defined in the corresponding system |
| `persistence.leaseExpiryRealSeconds` | `10` | Real seconds |
| `persistence.leaseHeartbeatRealSeconds` | `3` | Real seconds |
| `persistence.importMaximumMiB` | `50` | As defined in the corresponding system |
| `ui.zoomRange` | `[0.5,2]` | As defined in the corresponding system |
| `ui.minimumTargetCssPx` | `44` | As defined in the corresponding system |
| `ui.nameMaximumCharacters` | `40` | As defined in the corresponding system |
| `ui.petCooldownTicks` | `60` | Simulation ticks |
| `ui.petStressRelief` | `8` | As defined in the corresponding system |
| `ui.petValenceGain` | `0.1` | As defined in the corresponding system |
| `ui.idleBreathSeconds` | `3` | As defined in the corresponding system |
| `ui.idleBreathScale` | `0.02` | As defined in the corresponding system |
| `ui.blinkRealMs` | `120` | Real milliseconds |

## 17. Open questions and assumptions

The implementation may proceed with these defaults. None is a blocker requiring another design round.

| Question | Assumption used here | Consequence of changing it |
|---|---|---|
| Should ordinary lifetimes be shorter? | 16 h 10 min at 1× for a first life | Retune training rates, breeding cooldowns, offline cap, and rare tier reachability together |
| How much should absence matter? | 0.25× offline, 24 h wall cap, exact replay | A faster rate changes entire generations between visits and raises replay costs |
| Should rebirth be guaranteed? | Eligibility plus one 60% roll, maximum two rebirths | Guaranteed/infinite rebirth would crowd out new lineages without extra population rules |
| Are creatures sexed or gendered? | Reproduction is sex-independent; names/pronouns are cosmetic | Adding reproductive classes requires a new genome and population model |
| How restrictive should family breeding be? | Block ancestors and shared ancestors within two generations | Looser rules increase available pairings; stricter rules need more immigration |
| Should player pairing force reproduction? | No; it limits/encourages candidates while ordinary wellbeing and willingness still apply | Forcing it would remove a major source of autonomous personality |
| Should there be elemental types or multiple species? | None in version 1.0; skill/shape/palette variation provides identity | Add later through explicit loci and interaction rules rather than a superficial label |
| Must the graphics use pixel art? | No; original vector rig first, replaceable with layered sprites | Pixel art requires fixed scale/palette and a much larger compatible part atlas |
| Should archive history be limited? | Keep organism/genome/life/discovery history; bound only the recent event journal | Large lineages eventually require storage/export management; never silently discard ancestors |
| Should poor care kill creatures? | No; needs reduce mood/training/competition readiness; age causes death | Lethal neglect would change tone and make offline simulation much more punitive |
| Is deterministic client state secure against cheating? | No; this is a local sandbox | A competitive leaderboard would require a different trusted architecture |
| Can the default balance be considered final? | No; these are concrete starting values with test targets | Playtesting should adjust the central parameters while preserving behavioral invariants |

### Source basis for browser architecture

The game systems, formulas, names, and numerical balance above are proposed original design choices. The following primary browser/platform documentation supports the implementation approach, rather than the creative rules:

- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): structured client-side persistence and transactions.
- [MDN Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers): running computation away from the main UI thread.
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame): rendering scheduling and background behavior.
- [TypeScript DOM Manipulation](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html): typed native browser interfaces without a UI framework.




- [MDN Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API): coordinating exclusive ownership across same-origin tabs.
- [MDN StorageManager persist](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist): requesting persistence without assuming the browser grants it.

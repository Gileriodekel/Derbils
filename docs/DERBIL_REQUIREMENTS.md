# Derbil Dynasty - implementation prompt

Please update my existing creature simulation game to implement the requirements below. Make the changes in the actual codebase and verify that they work together in gameplay.

## 1. Working approach

Inspect the repository instructions, current architecture, save format, simulation clock, genetics, lifecycle, movement, relationships, competitions, and rendering before editing. Inspect the supplied SVG files and their actual layer/group names.

Give me a brief implementation plan, then continue implementing it in manageable stages. Preserve existing behavior unless these requirements change it. Keep ordinary balancing values in a central configuration so they can be adjusted later. Reuse existing systems where practical.

Make reasonable implementation choices for unspecified details and explain those choices when finished. Ask a focused question only when missing information would materially change the intended gameplay or artwork. Continue independent work if one feature is blocked.

Maintain compatibility with existing saves. Migrate renamed or removed fields without resetting unrelated genetics, relationships, ancestry, ages, or progression. Persist new state and timers correctly. Do not report a feature as complete if it only appears in the UI but does not affect the simulation.

## 2. Naming and stats

The game is called "Derbil Dynasty". A creature is a "Derbil"; the plural is "Derbils". Update visible titles, labels, tooltips, and messages accordingly.

There are exactly five trainable performance stats:

| Stat | Color |
| --- | --- |
| Running | #FE66AB |
| Swimming | #EAB607 |
| Flight | #9F55E1 |
| Strength | #EE4930 |
| Stamina | #437CF5 |

Use these names consistently. "Run" means Running, "Swim" means Swimming, and "Power" means Strength. Power must not become a separate stat.

Remove Climbing from gameplay calculations, progression, genetics where applicable, competitions, and the interface. Existing saves containing it must still load. Migrate legacy names such as Power to their corresponding retained stat.

The five-stat limit applies to trainable performance stats. Loneliness, hunger, current stamina energy, relationship scores, and other necessary simulation conditions can still exist separately.

## 3. Derbil artwork, genetics, and animation

Use my supplied base Derbil SVG as the visual foundation. Preserve its design, linework, proportions, and art style. Locate the actual file rather than assuming its filename.

Feet, body/coat, eyes, and tail have independently inheritable color traits. Within each part, the "BASE" and "HIGHLIGHT" layers must remain in the same color family. For example, a blue base should have a lighter blue highlight. Do not independently randomize highlights into unrelated hues.

Integrate these traits with the existing gene system so colors can be mixed, matched, combined, inherited, and saved. Preserve the existing inheritance approach where possible. Recolor the intended layers without unintentionally recoloring outlines or other parts. Individual Derbils must be able to display different color combinations simultaneously.

Stat progression changes the Derbil's appearance:

| Stat | Physical change | Maximum appearance reference |
| --- | --- | --- |
| Flight | Wings appear and become larger as the stat increases. | derbil_fly.svg |
| Running | Feet become larger as the stat increases. | derbil_run.svg |
| Strength | Buff arms appear and become larger as the stat increases. | derbil_strength.svg |
| Swimming | A fin appears at the end of the tail and becomes larger as the stat increases. | derbil_swim.svg |

The running reference represents maximum Running, correcting the "max flight" typo in my original notes.

These changes must combine independently. A Derbil with several high stats can have wings, large feet, muscular arms, and a tail fin at the same time. Do not make the references mutually exclusive whole-body skins.

Use the existing stat cap and sensible progression thresholds to move from the base appearance toward each maximum reference. Maintain the intended attachment points and inherited colors. Document the progression curve you choose. Temporary movement penalties should not permanently alter genetics or earned physical development.

Animate the feet subtly while walking or running. Animate the wings flapping during flight, including movement onto higher platforms. Match animation to actual movement state and preserve the artwork's style.

## 4. Eggs and cocoons

Use "Egg.svg" as the shared graphic for both eggs and cocoons. Sharing a graphic does not by itself merge their lifecycle behavior.

- "BASE" uses the body/coat base color of the Derbil that will emerge.
- "DOTS" uses that Derbil's tail base color.

Resolve and retain the emerging Derbil's relevant genetic colors early enough that the egg/cocoon accurately predicts its appearance. Do not reroll those colors on hatching, rendering, or loading a save.

## 5. Map and movement

Replace the current map with my supplied map artwork. Its named layers define required traversal modes:

| Layer | Required behavior |
| --- | --- |
| WALK | Walk or run. |
| SWIM | Swim. |
| FLY | Fly across the marked area, including transitions to higher platforms. |

Use the actual layer geometry for navigation. Account for SVG transforms and the map's coordinate system so visible terrain and traversable regions align. Rendering the map alone is insufficient.

Support routes that combine land, water, and flight segments. Derbils must change movement mode at the correct boundaries and land on valid terrain after flight. They must not walk through water, bypass flight barriers on foot, teleport to food, or become stuck at terrain transitions.

Inspect overlapping layers and platform connections before choosing traversal precedence. If the artwork does not make an important connection or overlap clear, identify the specific ambiguity.

Retain existing movement eligibility rules where compatible. Document how low-Flight Derbils handle mandatory flight segments, and ensure inaccessible targets do not cause endless pathfinding or movement attempts.

Higher Running increases land movement speed. Higher Swimming increases water movement speed.

Distinguish the Stamina stat from current stamina energy. Fast movement consumes energy; higher Stamina lets a Derbil sustain fast movement longer. Once exhausted, it continues at its normal speed for the relevant movement mode. Provide recovery using the existing system or a simple documented rule. Keep speeds, energy drain, recovery, and capacity configurable.

## 6. Food spawning, appearance, and competition for food

Spawn fruit bushes at random valid positions throughout the WALK regions. Spawn fruit-bearing kelp at random valid positions throughout the SWIM regions. Distribute food across the map so Derbils travel instead of permanently gathering around one feeding location.

Each bush and each kelp plant begins with exactly two visible, individually consumable berries. When one is eaten, that specific berry disappears and the other remains. When the second is eaten, remove the entire plant. Replenish food through new plant spawns at new valid random positions. Keep spawn rates, population limits, and spacing configurable.

Use the supplied bush, kelp, and berry assets where available. Apply these exact berry colors to the "BASE" and "BORDER" layers:

| Berry improves | BASE | BORDER |
| --- | --- | --- |
| Running | #FE66AB | #C95187 |
| Swimming | #EAB607 | #B99006 |
| Flight | #9F55E1 | #8628D9 |
| Strength | #EE4930 | #BC3A26 |
| Stamina | #437CF5 | #2D64B9 |

Eating a berry increases its corresponding stat. Reuse the existing progression balance where suitable and make the gain configurable. The red "Power berry" in my original notes means the Strength berry.

All Derbils immediately know when and where food appears anywhere on the map. Awareness does not bypass travel: they must physically reach it using the required movement modes before eating it.

Allow multiple Derbils to compete for the same available berry. Choosing a target must not reserve that berry indefinitely or prevent another Derbil from reaching it first. Resolve simultaneous consumption safely so a berry can be eaten only once. When a target disappears, promptly choose another valid action or reachable target.

Food ownership and consumption must also support sharing, stealing, and fight wagers described below. Reuse the existing carrying/ownership system, or add the minimum necessary representation. A berry cannot be both eaten and retained for a later wager.

## 7. Automatic competitions

Schedule competitions using in-game days, not real-world time:

| Competition | Schedule | Winner's prize |
| --- | --- | --- |
| Derbil Derby | Every 15 in-game days, beginning on day 15. | A bundle of berries. |
| Derbil Cup | Every 30 in-game days, beginning on day 30. | A special fruit that guarantees resurrection. |

Use this scheduling default: on days divisible by 30, run the Derby and then the Cup. This preserves both stated intervals. The Cup does not silently replace that day's Derby.

Competitions should start, resolve, and award prizes automatically. Adapt the existing competition and eligibility systems to the five retained stats. If there is no competition format yet, choose and document a simple format consistent with these mechanics. Keep the berry prize quantity configurable.

The winner of the most recently completed competition receives a meaningful attractiveness bonus when prospective mates evaluate them. Update that status after the next competition; it is not a permanent bonus for every past winner and must not override normal breeding eligibility.

Clarification for the special fruit: my wording is "guarantees resurrection". Inspect the game's existing lifecycle terminology and use the established mechanic if the meaning is clear. Do not silently assume resurrection and reincarnation are the same. If the intended outcome or timing remains unclear, ask me before implementing that reward's lifecycle effect and continue the other work. The special fruit is separate from the five normal stat berries.

Use persistent event bookkeeping so saving, loading, or advancing time cannot duplicate a competition or its rewards. Process crossed event boundaries according to the game's existing time-advancement behavior.

## 8. Friends, foes, mates, and loneliness

Replace the separate affinity/rivalry mechanic with one continuous friend/foe spectrum for each relationship:

- Foe endpoint: #F7A598.
- Friend endpoint: #A2DAB6.
- Blend the colors continuously between the endpoints.
- Divide the spectrum into equal thirds: Foe, Neutral, and Friend.
- Show threshold marks at one-third and two-thirds, plus a pointer indicating the current relationship value.
- Show a readable relationship label so the interface does not rely only on color.

Use the same score and thresholds in the simulation and interface. Preserve directed versus mutual relationships according to the existing model, and document how old affinity/rivalry values migrate into the new score.

Remove familiarity from relationship calculations and the interface. Existing saves containing familiarity must still load, but it must no longer influence behavior.

Derbils share food with friends and mates. They attempt to steal food from foes. Foes are much more likely to initiate fights. These must be actual behaviors with food transferred or consumed consistently, not just descriptive messages.

Mate bonds should normally form before an egg is produced. Adult Derbils typically have between one and three mates, and they can break up. Treat one to three as the usual outcome rather than automatically assigning mates or forcing every adult into that range. Support multiple simultaneous mate bonds. Preserve parent/child records when a bond ends.

Derbils with no friends or many foes experience higher loneliness. Increased loneliness reduces breeding likelihood. Keep the loneliness calculation and breeding effect configurable, and expose enough information for the player to understand the effect. Loneliness is a social condition, not a sixth trainable performance stat.

## 9. Fights and food wagers

Derbils can initiate one-on-one fights with foes. Strength determines the winner; use a documented rule for equal Strength.

Fights between foes automatically wager food, and the winner receives the wagered food. Use food the participants actually own. Define and document what happens when a participant has no food to stake; never create duplicate food or negative inventory.

The loser receives a temporary Running penalty lasting two in-game days. Implement this as an expiring modifier, preserving the underlying trained and inherited stat. Save and restore its expiry correctly. Keep the penalty amount and repeated-fight behavior configurable.

## 10. Reincarnation visibility

Show a clearly labeled reincarnation count in each Derbil's details and a compact indicator where practical. The original life has a count of zero; each completed reincarnation increments it once.

Preserve the count across reincarnation and saving/loading. Keep it distinct from age, family generation, and number of children. Do not count ordinary hatching or a resurrection as reincarnation unless the existing lifecycle explicitly makes that event a reincarnation.

## 11. Social web

Revamp the social web into a dynamic graph that clearly shows friendships, foes, mate bonds, and parent/child relationships.

Arrange connected friends and mates into recognizable clusters as relationships change. Show foe links distinctly without treating hostility as a reason to pull nodes into friendship clusters. Show parent-to-child direction clearly and keep kinship separate from current social standing; relatives can also be friends, neutral, or foes.

Include a clear legend and distinguish relationship types through labels, line styles, or arrows as well as color. Selecting a Derbil should make its relationships easy to inspect. Keep the layout readable at the game's normal population size and stable enough to interact with, avoiding constant jumping or severe node overlap.

## 12. Verification and completion

Implement in stages covering shared data and migrations, artwork/genetics, terrain/movement/food, relationships/lifecycle, and competitions/social UI. Verify each stage before relying on it in the next.

Run the repository's relevant checks and perform gameplay verification. Add targeted tests for consequential simulation behavior where appropriate. At minimum, verify:

- Exactly five performance stats appear, with the correct names and colors; Climbing and familiarity no longer affect gameplay.
- Color inheritance keeps highlights in the correct family, independent body-part colors work, and all four physical developments can coexist.
- Eggs and cocoons display the emerging Derbil's correct body and tail colors, including after save/load.
- Routes cross WALK, SWIM, and FLY regions correctly, animations match movement, and stamina changes fast-movement duration.
- Bushes and kelp spawn on valid terrain, show exactly two berries, update from two to one to zero, and cannot grant the same berry twice.
- Friends/mates share, foes steal and fight, wagers transfer correctly, and a fight penalty expires after two game days without permanently reducing Running.
- Mate bonds, breakups, loneliness, ancestry, and reincarnation counts remain consistent through save/load and lifecycle transitions.
- Days 15, 30, 45, and 60 produce the intended events exactly once, prizes are awarded once, and the attractiveness bonus tracks the latest winner.
- The social web updates its clusters and relationship types as the underlying simulation changes.
- Existing saves migrate without losing unrelated progression or records.

When finished, summarize what changed, what you verified, any balancing defaults you chose, and any genuine remaining blockers. Identify missing assets by their exact filename or required role rather than silently substituting artwork and claiming completion.

## Asset inputs

I will supply or place these assets in the project:

- Base Derbil SVG.
- derbil_fly.svg.
- derbil_run.svg.
- derbil_strength.svg.
- derbil_swim.svg.
- Egg.svg.
- New map SVG containing WALK, SWIM, and FLY layers.
- Bush, kelp, and berry artwork, where supplied or already present.

Check which assets actually exist and inspect their layer structure before integrating them. Preserve the supplied artwork when preparing it for the renderer.

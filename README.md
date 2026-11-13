# Derbil Dynasty

A browser habitat for autonomous Derbils. They find food, rest, train five stats, form friendships and mate bonds, raise eggs and grow old. The supplied SVG artwork shows inherited body, feet, eye and tail colors, plus independently growing feet, fins, wings and arms.

## Play without installing anything

[Download the playable preview ZIP](https://github.com/Gileriodekel/creature/raw/refs/heads/playable-preview/Derbil-Dynasty-Preview.zip), extract it, and open **Derbil-Dynasty.html** in Chrome or Edge. If GitHub returns 404, sign in with an account that can access the repository. Use the in-game Export button to keep a portable world backup.

This is the 0.12 preview. Its current feature checks pass; older test expectations and long-term population balance still need work. See [verification](docs/DYNASTY_VERIFICATION.md) for precise limits.

The performance update reuses the supplied vector geometry, renders at the current zoom resolution, and limits retained rendering resources. Those performance improvements remain in the current build. See [performance verification](docs/PERFORMANCE.md) for measurements and long-play checks.

At 1×, a day is **60 seconds** and a full life is **30 days (30 minutes)**. Reincarnation starts another life; founders arrive at varied ages. Every new world includes **Daroboo**. Existing saves migrate their life-stage progress to the new timing; their tick histories remain intact, so the displayed day counter changes.

## Gameplay

Scroll over the map to zoom toward your mouse pointer (up to 8×), then drag to pan. The +/− buttons also zoom; **Fit map** restores the whole habitat. At 100× and 1000×, steady average lighting prevents rapid day/night flashes; simulation days still advance normally. **Hide action bubbles**, directly below the map, keeps the view clear and remembers your preference. With the map focused, +/− zoom, arrow keys pan, and Home fits the map.

Click a Derbil or select it in the roster. Its card shows needs, Running, Swimming, Flight, Strength, Stamina, current movement energy, carried food, family and reincarnation count. Lower need bars are better. Earned stat levels change movement, competition performance and visible body parts; Stamina increases fast-movement endurance.

Bushes and kelp each hold two individually owned berries. Derbils travel over the supplied map to collect or eat them; empty plants disappear and new plants grow elsewhere. Mandatory platform crossings require Flight. Friends and mates share food; foes can steal or fight over real carried berries. Fight losers temporarily lose 40% of effective Running for two game days.

Mate bonds form through positive adult interactions before ordinary breeding. Loneliness reduces breeding likelihood; existing kinship, welfare and population gates remain. Pair/Block lets the player encourage or prevent willing pairs. The social web distinguishes friends, foes, mates and parent-to-child arrows.

Adults now seek eligible partners sooner, with shorter friendly play and faster bond gains. Neutral relationships have no friend/foe line on the web; mate and family lines remain independent. Pairs can court independently anywhere on reachable land and lay up to three eggs per clutch; no nest is needed. Reserved eggs and population limits still apply. Mate bonds have a five-day grace period without contact, and friendly interactions strengthen existing bonds. Mates can seek one another across a wider area. Ordinary breeding slows as population rises and pauses at a target of 24; the hard capacity is still 30. New worlds start with varied founder ages to spread out old-age deaths.

**Rescue eggs for endangered populations**, below the map, now looks ahead to the next generation. It can introduce up to four unrelated eggs before aging or a shortage of eligible mates causes a collapse, with a three-day cooldown. Enough existing youngsters or pending clutches suppress further assistance. Complete extinction still introduces six eggs. Turn rescue off for an unassisted world; close-relative breeding remains prohibited.

The **Derbil Derby runs every 15 game days**, awarding five stat berries. The **Derbil Cup runs every 30 days**, after that day's Derby. Its winner receives a saved guarantee of reincarnation at the next life expiry. The latest competition winner gains a mate-attraction bonus. Existing optional player-created competitions and donated inventory prizes remain available.

Space pauses/resumes; keys 1–4 select 1×/10×/100×/1000×. Escape deselects. Tab/Shift+Tab cycles Derbils when the habitat has focus. Backtick or Debug tools opens the inspectors. Settings include reduced motion, overlays, text size, contrast and starting speed.

Speed changes take effect without working through an old accelerated backlog. The toolbar shows actual ticks/second alongside the selected speed; 1000× is a target limited by your computer and population. Movement is interpolated between ticks, and full Derbil images stay within the map edges.

New worlds start with 15 bushes/kelp combined, growing to a maximum of 20 (half the previous counts). Older worlds with more than 20 plants are thinned when play resumes; carried berries and prizes are kept.

## Saves

Worlds stay in browser storage. Autosave runs every 15 seconds; Export/Import provides portable JSON. Verified checkpoints have a checksum, tuning hash and two backups. Import validates before replacing the live world. Another open tab stays read-only until Take over.

Returning to a running world replays exact ticks at 0.25× elapsed time, capped at 18,000 ticks; paused worlds stay paused. Closing the tab stops computation. Migration preserves retained genetics, ages, relationships, ancestry, progression and RNG. Retired Climbing/familiarity records and the old map are archived; old-map travel and active competitions are safely canceled, with prize escrow refunded. Export your old world before migration if you need to reopen it in the previous game.

## Development

Complete project source is on the [`source` branch](https://github.com/Gileriodekel/Derbils/tree/source). See [BUILDING.md](BUILDING.md) for a short build-and-test guide.

Use Node 22.12+ and npm:

```sh
npm ci
npm run dev
```

Open the address printed by Vite. `npm run build` produces `dist/` for static hosting, including subfolders; `npm run preview` serves that build locally.

| Command | Purpose |
| --- | --- |
| `npm run test:dynasty` | Current five-stat, artwork, terrain, food, social, lifecycle, event and migration checks |
| `npm run test:breeding` | Mate persistence, population limits, founder ages, early rescue and compatibility checks |
| `npm run balance:breeding` | Three 300k-tick breeding studies using the rescue setting; writes `.logs/breeding-study/` |
| `npm run test:smoke` | Production build and Chromium gameplay/save/recovery checks |
| `npm run typecheck` | Browser types and DOM-free simulation types |
| `npm run build:standalone` | Create the self-contained Derbil-Dynasty.html |
| `npm run tuning:doc` | Regenerate tuning documentation |
| `npm run gallery:svg` | Export samples using the supplied Derbil artwork |
| `npm test` | Entire historical suite; currently includes unresolved superseded assertions and long studies |

Playwright uses system Chromium when present; otherwise install it with `npx playwright install chromium`. The earlier 10b balance/soak work is paused, not accepted as evidence for these new rules.

For a saved-world breeding study, use `npm run balance:breeding -- --world path/to/world.json --ticks 180000`. It runs a copy, validates states and compares checkpoint continuation. Add `--unassisted` to disable rescue and measure natural replacement separately. See [breeding balance](docs/BREEDING_BALANCE.md) for observations and limits.

See [architecture](ARCHITECTURE.md), [requirements](docs/DERBIL_REQUIREMENTS.md), [decisions](docs/DECISIONS.md), [tuning](docs/TUNING.md) and [known issues](docs/KNOWN_ISSUES.md). The original [spec](docs/SPEC.md) and historical fixtures remain unchanged.

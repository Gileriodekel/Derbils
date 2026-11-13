# Relationships and one-minute calendar — 0.12

The spectrum has three visibly separate thirds. A relationship at or below −100/3 is a Foe; at or above +100/3 it is a Friend. The web reads the same decayed score. Neutral relationships have no friend/foe edge; mate and parent edges remain independent. Explicit relationship settings retain exact boundary values.

Adults now value meeting eligible potential mates before a mate bond already exists. Friendly play lasts 20 ticks, gains more affinity, and can form a buffered mate bond sooner. Established mates can seek each other across the map. Courtship attempts and work fit the shorter life. Kinship, player restrictions, needs, mate limits and population caps still apply.

At 1×, one tick is one second and a day is 60 ticks. A full first life is 1,800 ticks: egg 30, baby 120, juvenile 240, adult 1,200, elder 210. A reincarnated life begins with a 30-tick cocoon and also lasts 30 days. Founders arrive at staggered ages, so they have less than a full lifetime remaining. Every new world saves Daroboo as its first founder; that name persists in family history and reincarnation.

## Save compatibility

Rules/package 0.12.0; state schema 12; checkpoint envelope 14; config hash `bc7764ad50cfbf33`.

Historical schemas first pass their frozen validator. Migration keeps absolute ticks, RNG, genes, XP, inventory, lineage and historical events. It preserves each living Derbil's stage and fractional progress, converts day-based deadlines and active play/courtship progress, and starts the new daily allowances. It does not replay past caches or competitions. Earlier death ages and competition-day units remain marked by `dynasty.calendarChangedAtTick`.

The displayed day number changes because unchanged absolute ticks now divide by 60. Import/load explains this; old competition results say “previous calendar.” Newly saved worlds round-trip and continue exactly. They require the updated game, so retain original exports.

## Verification

- Both TypeScript dependency graphs and the production build pass.
- 107 focused tests pass; one historical 200,000-tick diagnostic was excluded. The historical all-milestone suite is not claimed green.
- All 11 Chromium tests pass, including actual spectrum pointer positions, both exact classification boundaries, removal of neutral edges, the 59→60 tick/day boundary, names after reload, natural breeding, movement, zoom, rendering resources and save recovery.
- Fixtures for historical schemas 1–11 migrate successfully. Dedicated schema-11 fixtures cover closed lives, reincarnation, remaining cooldowns and in-progress play/courtship. Migrated checkpoints continue identically for 2,000 ticks after a save/load round trip.
- The actual uploaded world and a world at tick 1,241,374 each continue another 6,000 ticks, with validation every 600 ticks and exact checkpoint continuation.
- The final standalone HTML imports/exports the expected migrated uploaded state exactly, advances play, and reloads paused at tick 261,397 with the rescue preference retained. No page errors or external game assets. It was checked over local HTTP; this managed browser does not support manual double-click/file URL QA.

Three new-world studies ran for 12,000 ticks (200 new-calendar days):

| Seed | First mate bond (tick) | Births | Rescue lives | Minimum living | Final living |
| --- | ---: | ---: | ---: | ---: | ---: |
| 271828 | 43 | 33 | 13 | 3 | 9 |
| 314159 | 43 | 27 | 8 | 2 | 8 |
| 161803 | 88 | 35 | 8 | 2 | 8 |

The previous build formed no mate bonds within the first 1,800 ticks for these seeds. The new runs demonstrate faster natural bonding and successful offspring; populations still dip and depend on optional rescue. They do not establish stable unassisted population balance. “Rescue lives” includes reincarnations with that origin, rather than a count of distinct rescue arrivals.

The uploaded world finishes its 6,000-tick continuation with seven living Derbils (minimum six); the older world finishes with six (minimum three). Numeric results: [reports/social-calendar.json](reports/social-calendar.json). Local evidence: `.logs/social-clock/`.

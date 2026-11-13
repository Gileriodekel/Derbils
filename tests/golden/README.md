# Immutable 9b baseline

Captured **before 10a logic changes**, using the production `tick` with ordinary twelve-founder defaults, seeds 271828/314159/161803 and autoCompetitions/autoPrizes enabled. Checkpoints: 1,000, 20,000 and 100,000 ticks. `scripts/generate-golden.mjs` records the original capture procedure; do not regenerate this baseline to approve a performance change.

`hashState` sorts every object key, preserves array order and hashes the complete JSON simulation snapshot with FNV-1a 64 over UTF-16 code units. No fields, RNG streams, events, clocks or schema values are excluded. Outer save-envelope wall time is not simulation state. Compaction's configured detail-retention window exceeds these checkpoints.

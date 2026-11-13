# Milestone 10a

1. Completed first: `sim/hash.ts`, `tests/golden/`, shared `tests/helpers/invariants.ts`; capture untouched 9b with auto events/prizes.
2. Types first: offline/runner/summary/archive contracts; `data/offline.json`; `app/time.ts`, `app/catchup.ts`, `sim/advance.ts`, outer schema-11 checkpoint codec.
3. Transient tick events and pure summary accumulator; catch-up overlay/summary, host visibility/stall/autosave wiring, render cache reset.
4. Profile with `scripts/bench-sim.mjs`, optimize measured costs, verify goldens after each change; config-driven lineage compaction and collection audit.
5. Headless time/replay/runner/summary/migration/boundary tests, goldens, existing suites, two-million-tick size study, browser checks; update architecture/decisions.

# Milestones 1–2 build plan

1. Define `src/sim/types.ts` first; add JSON config, pure RNG/tick/runner, persistence codec, Canvas shell and controls. Run foundation fixtures, pause, determinism, and save tests.
2. Add map/navigation, a fixed adult fixture, four loose fruit, needs/mood, utility scoring and action execution. Run long headless survival, brain, navigation, and mid-action save tests.
3. Finish the read-only renderer and debug inspector; validate `npm test`, `npm run build`, and the actual browser with `npm run dev`. Record interpretations in DECISIONS and orientation in ARCHITECTURE.

No systems from Milestones 3–10 are part of this build.

## Next authorized pass: Milestone 3 fruit/preferences

1. Extend `src/sim/types.ts`; add `fruits.json`, `sources.json` and food tuning.
2. Add `preferences.ts`, `food-sources.ts`, capped `spawn.ts` and schema migration; integrate claims and meal completion without changing the utility formula.
3. Add the preference table, creature selectors, source legend/rendering and meal reactions; run regression, 20,000-tick, migration and browser checks.

Skills, genes, life stages, appearance effects, social systems and later features remain excluded by the new request.

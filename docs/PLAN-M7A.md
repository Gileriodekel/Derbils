# Milestone 7a plan

1. Define appearance recipes/config/spec in `src/sim/types.ts` and numeric scene contracts in `src/render/scene/types.ts`; add `src/data/appearance.json` to typed config.
2. Add pure `src/sim/appearance/` derivation, then `src/render/scene/` geometry, bounds and path construction; test tiers, boundaries, stages, facing, conflicts and persistence.
3. Add shared Canvas executor, string-only SVG exporter, sample presets and `scripts/gallery-svg.mjs`; generate and visually review the SVG gallery.
4. Replace the habitat's creature shapes, reuse the pipeline for the portrait and QA gallery, and add the selected appearance inspector. Preserve selection, thoughts, level-up/courtship cues and departure fades.
5. Run build, Node tests (including previous endurance checks), dev/browser smoke checks; update architecture and decisions. Keep save schema 6 and leave all 7b features inactive.

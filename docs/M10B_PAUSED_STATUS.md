# Paused at the user’s request

The game is now named **Derbil Dynasty** and its inhabitants are **Derbils** (singular **Derbil**). Milestone10b final verification remains **incomplete and paused**. Previously approved preview downloads were published on the separate playable-preview branch; the source workspace now also contains the naming update.

## Play now

`Derbil-Dynasty.zip` in the repository workspace contains `Derbil-Dynasty/Derbil-Dynasty.html` and plain instructions. The previous `Creature.zip` remains an archived earlier preview. Extract and open the HTML in Chrome/Edge. Optional generator: `npm run build:standalone`. The standalone was tested in Chromium as a single HTML over local HTTP: selection, competitions, exact paused save/reload, nonblank canvas, zero console errors and zero external assets. This managed environment blocks file: navigation, so personal-browser double-click remains manual QA. The new Derbil Dynasty build uses the source’s still-provisional gate tuning; it is not a final balance acceptance. The archived Creature ZIP uses the earlier coupled tuning.

## Current source

Milestone10b adds explicit config validation/metadata/TUNING generation; health/balance/soak tooling; strict state validation; checksummed envelope12; IndexedDB/localStorage SaveStore, verified spare/rolling backups/quarantine/import/export; tab ownership and runtime recovery; player/default and debug views, derived names, settings/hints/accessibility/performance polish; browser smoke checks and documentation. No new gameplay system or authoritative simulation fields. Internal schema10; declared rules/package0.10.0.

Current gameplay changes from the original0.9.1 baseline are **provisional**:

| JSON key | Before | Current |
|---|---:|---:|
| breeding.referenceSources | 10 | 14 |
| breeding.foodCapacityFloor | 16 | 12 |
| breeding.candidateCount | 4 | 8 |
| breeding.mateTemperature | .3 | .6 |
| competitions.brain.interest | .28 | .4 |
| breeding.minimumBond | 15 | 10 |
| breeding.minimumCompatibility | .35 | .30 |

Config hash: `9c955db26eac8d7d`. All health bands and earlier assertions/tick counts remain unchanged. Rules migration changes only known0.9.1 metadata to current rules, preserving every other field.

## Evidence and remaining work

- Original9b full-state golden hashes passed before tuning. Historical fixtures1–11 passed load/validate and deterministic10k continuations. Focused39 save/offline/persistence cases passed under declared0.10rules. The15 save-race robustness cases and three Chromium static-host smoke cases passed. Latest typecheck and generated tuning table pass.
- A genuine zero-density mate-ranking performance fix preserves every serialized field at24,000 differential ticks across12runs and preserves proposal RNG draws. Both previously timed-out replay cases pass their original180s budgets, with assertions unchanged.
- Earlier coupled config completed full balance:4/5default seeds and3/4scenarios pass;141421 needed rescue/allele collapse, and fast cadence finished at3creatures. Reject it as final. Full results: `.logs/m10b-balance-coupled.json`; all trials/parameters in BALANCE_LOG.
- Latest gate trial passes all50checks for141421/500k(mean23.392,min population12,rescue0,min alleles6,fill.98485) and fast cadence271828/120k(final23,no rescue). This justifies the provisional source edit, **not acceptance**.
- The full five-seed command on current config is interrupted at the user’s pause checkpoint; no background study workers remain. Partial progress/results are in `.logs/m10b-balance-gates-full.log` and `.logs/m10b-paused-status.json`. No full-cohort pass is claimed. Restart `npm run balance` on resume; balance does not resume partial worlds.
- **No final complete `npm test`, no final full5×5,000,000-tick soak plus repeat.** No10b goldens have been generated. `tests/golden.test.ts` still imports9b and is expected to mismatch provisional tuning. Do not claim the suite currently passes.

## Resume order

1. Read this, ARCHITECTURE, DECISIONS and BALANCE_LOG. Check for existing repository-owned processes before launching duplicates. Do not spawn agents or push/deploy unless requested.
2. Complete `npm run balance` on all5default seeds +4scenarios; tune only JSON, retain bands/old assertions, record every trial. If no config retains the old health guarantees, use the user’s explicit documented-unmet-target exception rather than weaken tests.
3. After accepting tuning, `node scripts/generate-golden.mjs <documented reason>` writes a NEW10b artifact only. Preserve historical9b fixtures/hashes. Switch golden.test import/title to the accepted artifact, preserving all-field comparisons.
4. Run full `npm test`, fix actual failures, then full `npm run soak` (5seeds×5m +independent repeat). Soak has100k tool checkpoints, with a separate repeat namespace; reuse only matching current-config checkpoints. Neither full final study has started. Do not mistake interrupted baseline logs for passes.
5. Regenerate playable HTML/ZIP for final tuning; finalize docs/known issues and all measured outcomes. Document approximately45avg cloud fps; do not claim physical60fps.

This cloud needs `NPM_CONFIG_CACHE=/workspace/.cache/npm` for npm commands; do not override HOME. Chromium is `/usr/bin/chromium`. Dev5173 was verified HTTP200 for root/main; it can remain running for play. Setup draft was saved successfully for environment-settings review/publish; it is not published/applied. Durable extended notes: `.logs/M10B-SESSION-NOTES.md`.

Naming update verification: production build/typechecks and all three existing Chromium smoke cases pass. Additional branding checks pass for the static build and single-file build: exact title, player copy/accessibility naming, header at1280/390/320px, no390px page overflow, exact paused save/reload and zero console errors. Simulation, persistence and all data/config files are byte-identical to before the naming change. No endurance studies were resumed, and no renamed build was published.

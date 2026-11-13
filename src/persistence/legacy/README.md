# Historical save decoder

`v1-v10.js` is the readable, self-contained Vite SSR build of the unchanged 0.10.0 `persistence/save.ts` and its validation/migration dependencies, captured before the Dynasty changes. It validates all original fields and upgrades versions 1–10 using their original catalogs before the new migration runs. It is never ticked or used for current gameplay. This freezes old schemas and positional gene catalogs instead of interpreting historical genomes against changed loci. No runtime dependency was added.

Generated with Vite 7.3.1, `build({configFile:false,build:{ssr:'src/persistence/save.ts',outDir:'src/persistence/legacy',minify:false,rollupOptions:{output:{entryFileNames:'v1-v10.js'}}}})`.

The second tree-shaking pass removes only the frozen configuration's development-time metadata validation and unused configuration hash calculation. Historical save validators and catalogs remain intact; all historical fixture versions are covered by dynasty-data.test.ts. This reduces the decoder from 1.8 MB to 191 KB.

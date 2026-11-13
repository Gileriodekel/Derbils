# Build and test Derbil Dynasty

Requires Node.js 22.12 or newer and npm. Run these commands from the project root:

```sh
npm ci                 # Install the exact locked dependencies
npm run dev            # Start Vite; open the URL it prints
npm run build          # Typecheck and build the static site into dist/
npm run preview        # Serve that production build locally
```

Tests:

```sh
npm run test:dynasty    # Current gameplay, artwork, migration and timing checks
npm run test:breeding   # Breeding and population recovery checks
npm test -- tests/population-replacement.test.ts tests/daylight.test.ts
npm test               # Full historical suite, including long simulations
```

The full historical suite currently has unresolved expectations from older game rules; it is **not all green**. See [verification](docs/DYNASTY_VERIFICATION.md) and [known issues](docs/KNOWN_ISSUES.md). Passing focused tests does not establish unassisted population stability.

For browser tests, run `npx playwright install chromium` (or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed Chromium), then `npm run test:smoke`.

`npm run build:standalone` creates the self-contained `Derbil-Dynasty.html`. Dependencies, generated builds, standalone HTML/ZIP packages, test output and local study logs are excluded from Git. Original SVG assets, runtime data, frozen save-migration modules and test fixtures are included because the project needs them to build and test.

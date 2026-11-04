# Optional performance baseline

Start the local production app separately (`npm run build`, then `npm run start`).
With Node on `PATH`, run:

```sh
node scripts/lighthouse-baseline.mjs
node scripts/lighthouse-baseline.mjs --url http://localhost:3000/products/cell-culture --mode vitals --output artifacts/lighthouse-baseline/cell-culture.json
node scripts/lighthouse-baseline.mjs --help
```

The script uses the existing Playwright installation and an existing Chromium binary. If the Playwright browser is unavailable, `--browser-executable /path/to/chromium` can select an existing browser. It does not install dependencies or browsers, start the app, change configuration, submit forms or deploy anything. An explicit `--url` may target HTTP(S); loading that page can request its normal resources.

`--mode auto` uses Lighthouse only when its package is already installed. The JSON then includes its version, category scores and full Lighthouse result, including configuration. If the package is absent, the script records only Playwright lab approximations: LCP, session-window CLS, FCP, navigation TTFB, load timings and observed long-task duration above 50 ms. It produces no Lighthouse score in that mode. `--mode lighthouse` fails clearly if the package is absent; `--mode vitals` always uses Playwright observations.

These are single headless browser runs, not field Core Web Vitals. The Playwright mode uses a 1365×768 desktop viewport without CPU/network throttling and observes for 3 seconds after load by default (`--settle-ms`). LCP and CLS can change after that window, and frames or later interactions can be missed. No interaction is performed, so INP remains `null`; unsupported/unobserved metrics also remain `null`. `longTaskExcessMs` is not Lighthouse Total Blocking Time. Compare like modes, browser versions, target builds and conditions, and repeat runs to understand variability. Default reports go under ignored `artifacts/lighthouse-baseline/`.

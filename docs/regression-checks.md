# Regression checks

Run commands from the repository root with Node and npm on `PATH` and the existing `node_modules` available. The commands below use the scripts currently declared in `package.json`. Direct `node scripts/...` commands cover checks without an npm alias.

## Local release preflight

After reviewing and staging the intended files, run `npm run verify:local` on macOS or Linux. Use dependencies matching `package-lock.json` and an installed Playwright Chromium; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing Chromium binary. The command uses Git and `tar` already on `PATH`. It does not install anything.

- Tests a Git archive of the exact index tree, leaving the worktree, index and existing `.next` build alone. Unstaged files are not tested. A changed index invalidates the result.
- Builds without local `.env` files or service credentials. Starts an isolated production build only on `127.0.0.1`, with an operating-system-assigned port. Checks the unconfigured RFQ and verification state before running local smoke, buyer-session, payload, responsive and accessibility checks.
- Writes `report.json`, per-check logs and screenshots under a new ignored `artifacts/local-preflight/run-*` directory. A failed or interrupted run is nonzero and lists checks that did not run. On normal exit, failure, Ctrl+C or SIGTERM it stops the owned processes and removes its candidate build.
- A passing report validates its Git tree only. It does not contact the production alias, exercise real submissions or authorize a release. For a production release, compare the deployed commit to the pushed commit with `readiness` and run read-only smoke separately.
- Run `npm run smoke:production-rfq-ui -- <full-release-sha>` after the production alias switches. It checks the same SHA before and after a 390px Chromium visit, verifies closed sourcing forms make no verification requests, and confirms the official widget mounts on `/request-quote`. The browser blocks write requests; this check does not attempt to solve or submit a challenge. Use the Playwright-managed Chromium or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

## Offline verification

These regressions read source files or run code with local fixtures and mocks. They require neither a running Next.js server nor a browser, network access, credentials, or `.next` build output. Queue and round-trip mocks keep their records in memory. Environment values assigned inside test processes apply only to those processes.

`npm test` runs the following regressions in sequence and stops at the first failure.

| Script under `scripts/` | Individual command | Coverage |
| --- | --- | --- |
| `request-types-regression.mjs` | `npm run test:request-types` | Eight canonical request types, historical aliases, RFQ/equivalent URL builders, query encoding and context preservation |
| `taxonomy-builders-regression.mjs` | `npm run test:taxonomy-builders` | Scientific names, stable slugs and aliases, related links, empty seeds and immutable deterministic builders |
| `taxonomy-search-regression.mjs` | `npm run test:taxonomy-search` | Relevance tiers, field weights, normalization, literal punctuation and units, stable result limits and immutable inputs |
| `product-search-regression.mjs` | `npm run test:search-ranking` | Product search ranking, match explanations, result disclosures, pagination markup and RFQ prefills |
| `product-profile-regression.mjs` | `npm run test:product-profiles` | Product-specific specification, documentation and equivalent-review profiles |
| `sourcing-configurations-regression.mjs` | `npm run test:sourcing-configurations` | Exact specification filters, comparison data and product context |
| `sourcing-list-storage-regression.mjs` | `npm run test:sourcing-list-storage` | Storage parsing, normalization and failure recovery |
| `family-page-regression.mjs` | `npm run test:family-pages` | Taxonomy/catalog family rendering, configurations, product links and request context across query scenarios |
| `category-page-regression.mjs` | `npm run test:category-pages` | Taxonomy/catalog category rendering, overlapping paths, child families and request context |
| `structured-data-regression.mjs` | `npm run test:structured-data` | Server-rendered directory states, hierarchical breadcrumbs, public Organization data and safe JSON round trips |
| `rfq-queue-regression.mjs` | `npm run test:rfq-queue` | Mocked Blob lifecycle and internal API, immutable intake/history, legacy records, idempotency, revision conflicts, recovery, pagination and private errors |
| `trust-evidence-regression.mjs` | `npm run test:trust-evidence` | Publication requirements, evidence dates, enterprise-domain email validation and consumer-address source scan |
| `public-trust-intake-regression.mjs` | `npm run test:trust-intake` | Owner intake structure, approval, source, date, email and response-window validation |
| `release-readiness-regression.mjs` | `npm run test:release` | Mocked build SHA selection, RFQ health release identifiers and expected-release validation |
| `accessibility-static-regression.mjs` | `npm run test:a11y-static` | Server-rendered form labels and ARIA references, errors, filter semantics, native disclosures, palette contrast and focus CSS |
| `client-boundary-regression.mjs` | `npm run test:client-boundary` | Runtime dependencies of client entry points, including re-exports and dynamic imports, to keep full catalog/content modules server-side |
| `rfq-roundtrip-phase-regression.mjs` | `npm run test:rfq-roundtrip-phases` | Actual round-trip script in child processes with mocked fetch over IPC, submission consent, read-only verification, owner acknowledgment, immutable records and repeat confirmation |
| `sourcing-need-regression.mjs` | `npm run test:sourcing-need` | Mocked intake, verification, field limits, idempotency and list intent |
| `redesign-observation-regression.mjs` | `npm run test:redesign-observation` | Privacy-safe metrics, aggregation, CLI exports and fixture isolation |

Use the complete local verification sequence for documentation and source changes.

```bash
npm run lint
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm test
npm run build
```

The static accessibility check covers source and rendered markup. Browser interaction, computed layout and assistive-technology acceptance have their own checks below.

## Regressions requiring HTTP or a browser

These checks are outside `npm test`. To run them individually, start a local production server in a separate terminal after the build.

```bash
npm run start -- --hostname 127.0.0.1
```

| Script under `scripts/` | Command | Requirements and effects |
| --- | --- | --- |
| `buyer-session-regression.mjs` | `npm run test:buyer-session -- http://127.0.0.1:3000` | Local-only browser checks for sourcing-list state, storage failures, retry handling and configuration history. Submissions are intercepted. |
| `redesign-acceptance.mjs` | `npm run test:redesign -- http://127.0.0.1:3000` | Responsive layout, image loading, type, motion and mocked RFQ flow in Chromium. |
| `rfq-payload-limit-regression.mjs` | `npm run test:rfq-payload -- http://127.0.0.1:3000` | Sends two oversized POST bodies to a running server and requires HTTP 413 before intake. Covers declared-length and chunked bodies. The default is `http://localhost:3000`, with `RFQ_PAYLOAD_TEST_BASE_URL` as an optional override. |
| `accessibility-regression.mjs` | `npm run test:a11y-checklist -- http://127.0.0.1:3000` | Requires Playwright and an existing Chromium binary. Covers keyboard behavior, axe, reflow, text spacing, mobile controls and context handoffs. Simulated submission/Turnstile failure checks run for local targets. The default is `http://localhost:3000`, with `A11Y_TEST_BASE_URL` as an optional override. |
| `scientific-units-regression.mjs` | `npm run test:units-visual -- http://127.0.0.1:3000` | Requires Playwright and an existing Chromium binary. Checks DOM text, computed casing and accessibility-tree unit text, then writes screenshots under `artifacts/scientific-units/`. The default is `http://localhost:3000`, with `UNIT_TEST_BASE_URL` as an optional override. |
| `rfq-edge-limit-regression.mjs` | `npm run test:rfq-edge-limit -- <target-url>` | Requires an authorized bounded edge probe and `RFQ_EDGE_LIMIT_CONFIRM=1`. Defaults to the production URL. Sends at most 21 honeypot POSTs, may wait for the next minute window and requires provider edge evidence for HTTP 429. Honeypot probes avoid RFQ queue records. A local application limiter response cannot satisfy this check. |

For browser regressions, `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing Chromium binary. Remote navigation retries in the accessibility and unit display checks default to three attempts and can be adjusted with `A11Y_NAV_RETRIES` or `UNIT_NAV_RETRIES`. Local targets use one attempt. Screenshots and manual acceptance details are covered in the accessibility checklist. [Accessibility acceptance](accessibility-acceptance.md)

When the task allows skipping browser or URL-dependent checks, record the skipped script names and their required browser, server or external-service prerequisites in the handoff.

## Related scripts

The following checks use different filenames and also sit outside `npm test`.

| Script under `scripts/` | Command | Requirements and effects |
| --- | --- | --- |
| `route-smoke.mjs` | `npm run smoke` | Uses HTTP against `http://localhost:3000` by default and reads local source files. `SMOKE_BASE_URL` selects another target. Covers routes, metadata, breadcrumbs, static assets and source contracts. Local runs also POST invalid/honeypot RFQs and a sample analytics event. Durable writes are opt-in through `SMOKE_DURABLE_WRITE=1`. A connected analytics provider may receive the local sample event. |
| `deployment-readiness.mjs` | `npm run readiness -- http://127.0.0.1:3000` | Uses HTTP and defaults to the production URL when no argument or `READINESS_BASE_URL` is supplied. Checks core routes, security headers, public trust status and RFQ service readiness, including a private queue probe. `EXPECTED_RELEASE_SHA` requires a full matching SHA. `REQUIRE_TRUST_EVIDENCE=1` requires complete publication of all four approved records. |
| `rfq-durable-roundtrip.mjs` | `npm run test:rfq-roundtrip -- <submission-url> <lookup-url>` | Uses real services and requires the internal API key. The default `submit` phase requires `RFQ_ROUNDTRIP_CONFIRM=1` and creates one QA record. The `verify` phase reads an existing QA record. The `confirm-owner` phase writes and reads back an owner-review event after actual owner acknowledgment. The default lookup URL is production. |
| `lighthouse-baseline.mjs` | `npm run perf:baseline -- --url http://127.0.0.1:3000/products --mode vitals` | Requires a running server, Playwright and an existing Chromium binary, then writes a JSON performance report. `auto` mode uses an already installed Lighthouse package when available and otherwise collects Playwright lab observations. |
| `validate-public-trust-intake.mjs` | `npm run validate:trust-intake -- /absolute/path/to/intake.json` | Offline JSON validation. Reports approval and publication errors for the provided owner intake. The bundled example contains placeholders and requires completion with owner-approved evidence before it can pass. |

The live round-trip script has distinct submission, verification and owner-review phases. Follow its operations guide for inputs and review requirements. [RFQ operations](rfq-operations.md)

The performance guide documents measurement modes and report limits. The trust guide documents the owner intake and its publication mapping. [Performance baseline](lighthouse-baseline.md) · [Public trust owner intake](public-trust-owner-intake.md)

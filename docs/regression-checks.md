# Regression checks

Run commands from the repository root with Node and npm on `PATH` and the existing `node_modules` available. The commands below use the scripts currently declared in `package.json`. Direct `node scripts/...` commands cover checks without an npm alias.

## Offline verification

These 15 regressions read source files or run code with local fixtures and mocks. They require neither a running Next.js server nor a browser, network access, credentials, or `.next` build output. Queue and round-trip mocks keep their records in memory. Environment values assigned inside test processes apply only to those processes.

`npm test` runs the following 12 regressions in sequence and stops at the first failure.

| Script under `scripts/` | Individual command | Coverage |
| --- | --- | --- |
| `request-types-regression.mjs` | `npm run test:request-types` | Eight canonical request types, historical aliases, RFQ/equivalent URL builders, query encoding and context preservation |
| `taxonomy-builders-regression.mjs` | `npm run test:taxonomy-builders` | Scientific names, stable slugs and aliases, related links, empty seeds and immutable deterministic builders |
| `taxonomy-search-regression.mjs` | `npm run test:taxonomy-search` | Relevance tiers, field weights, normalization, literal punctuation and units, stable result limits and immutable inputs |
| `product-search-regression.mjs` | `npm run test:search-ranking` | Product search ranking, match explanations, result disclosures, pagination markup and RFQ prefills |
| `product-profile-regression.mjs` | `npm run test:product-profiles` | Product-specific specification, documentation and equivalent-review profiles |
| `family-page-regression.mjs` | `npm run test:family-pages` | Taxonomy/catalog family rendering, configurations, product links and request context across query scenarios |
| `category-page-regression.mjs` | `npm run test:category-pages` | Taxonomy/catalog category rendering, overlapping paths, child families and request context |
| `structured-data-regression.mjs` | `npm run test:structured-data` | Server-rendered directory states, hierarchical breadcrumbs, public Organization data and safe JSON round trips |
| `rfq-queue-regression.mjs` | `npm run test:rfq-queue` | Mocked Blob lifecycle and internal API, immutable intake/history, legacy records, idempotency, revision conflicts, recovery, pagination and private errors |
| `trust-evidence-regression.mjs` | `npm run test:trust-evidence` | Publication requirements, evidence dates, enterprise-domain email validation and consumer-address source scan |
| `public-trust-intake-regression.mjs` | `npm run test:trust-intake` | Owner intake structure, approval, source, date, email and response-window validation |
| `release-readiness-regression.mjs` | `npm run test:release` | Mocked build SHA selection, RFQ health release identifiers and expected-release validation |

Run the remaining three offline regressions separately.

| Script under `scripts/` | Command | Coverage |
| --- | --- | --- |
| `accessibility-static-regression.mjs` | `node scripts/accessibility-static-regression.mjs` | Server-rendered form labels and ARIA references, errors, filter semantics, native disclosures, palette contrast and focus CSS |
| `client-boundary-regression.mjs` | `node scripts/client-boundary-regression.mjs` | Runtime dependencies of client entry points, including re-exports and dynamic imports, to keep full catalog/content modules server-side |
| `rfq-roundtrip-phase-regression.mjs` | `npm run test:rfq-roundtrip-phases` | Actual round-trip script in child processes with mocked fetch over IPC, submission consent, read-only verification, owner acknowledgment, immutable records and repeat confirmation |

Use the complete local verification sequence for documentation and source changes.

```bash
npm run lint
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm test
node scripts/accessibility-static-regression.mjs
node scripts/client-boundary-regression.mjs
npm run test:rfq-roundtrip-phases
npm run build
```

The static accessibility check covers source and rendered markup. Browser interaction, computed layout and assistive-technology acceptance have their own checks below.

## Regressions requiring HTTP or a browser

These four `*-regression.mjs` scripts are outside the offline set and `npm test`. Start a local production server in a separate terminal after the build when using the local URLs below.

```bash
npm run start -- --hostname 127.0.0.1
```

| Script under `scripts/` | Command | Requirements and effects |
| --- | --- | --- |
| `rfq-payload-limit-regression.mjs` | `npm run test:rfq-payload -- http://127.0.0.1:3000` | Sends two oversized POST bodies to a running server and requires HTTP 413 before intake. Covers declared-length and chunked bodies. The default is `http://localhost:3000`, with `RFQ_PAYLOAD_TEST_BASE_URL` as an optional override. |
| `accessibility-regression.mjs` | `npm run test:a11y-checklist -- http://127.0.0.1:3000` | Requires Playwright and an existing Chromium binary. Covers keyboard behavior, axe, reflow, text spacing, mobile controls and context handoffs. Simulated submission/Turnstile failure checks run for local targets. The default is `http://localhost:3000`, with `A11Y_TEST_BASE_URL` as an optional override. |
| `scientific-units-regression.mjs` | `npm run test:units-visual -- http://127.0.0.1:3000` | Requires Playwright and an existing Chromium binary. Checks DOM text, computed casing and accessibility-tree unit text, then writes screenshots under `artifacts/scientific-units/`. The default is `http://localhost:3000`, with `UNIT_TEST_BASE_URL` as an optional override. |
| `rfq-edge-limit-regression.mjs` | `npm run test:rfq-edge-limit -- <target-url>` | Requires an authorized bounded edge probe and `RFQ_EDGE_LIMIT_CONFIRM=1`. Defaults to the production URL. Sends at most 21 honeypot POSTs, may wait for the next minute window and requires provider edge evidence for HTTP 429. Honeypot probes avoid RFQ queue records. A local application limiter response cannot satisfy this check. |

For the two browser regressions, `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing Chromium binary. Remote navigation retries default to three attempts and can be adjusted with `A11Y_NAV_RETRIES` or `UNIT_NAV_RETRIES`. Local targets use one attempt. Screenshots and manual acceptance details are covered in the accessibility checklist. [Accessibility acceptance](accessibility-acceptance.md)

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

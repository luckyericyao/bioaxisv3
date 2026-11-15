# BioAxis v3

Next.js App Router application for life science consumables discovery and sourcing requests. Product directories, search, specification review and sourcing lists feed a shared RFQ intake backed by a private Blob queue.

## Local development

Run from the repository root with Node and npm on `PATH` and the existing `node_modules` available.

```bash
node --version
npm --version
npm run dev
```

Open `http://localhost:3000`. Public catalog pages use local TypeScript data. RFQ acceptance requires a connected private Blob store. Full RFQ readiness also requires Turnstile and an internal API key. The architecture guide lists the configuration names and their roles. [Architecture overview](docs/architecture.md)

## Architecture

| Area | Entry points and responsibility |
| --- | --- |
| Routes | `src/app` contains public pages, four product hierarchy levels, resource articles and API handlers. |
| Product data | `src/data/productTaxonomy.ts` defines the primary hierarchy. `productItems.ts` derives sourcing profiles. `productCatalog.ts` supplies additional catalog paths through the same routes. |
| Search | `/products?q=...` computes ranked results on the server through `src/data/productSearch.ts` and passes results to the interactive search component. |
| RFQ | Product links and sourcing lists carry context into `SourcingIntakeForm`, then `submitBioAxisRequest` posts to `/api/rfq`. |
| Persistence | `src/lib/server/rfqQueue.ts` stores immutable intake records. `rfqWorkflow.ts` appends revisioned owner-review events. |
| Public trust | `publicTrustProfile.ts` validates publishable owner facts against evidence and review dates. Owner-approved intake has its own validation workflow. |

The detailed guide covers route resolution, breadcrumbs, data ownership, RFQ query aliases, browser storage, API behavior and build release identifiers. [Architecture overview](docs/architecture.md)

## Local verification

To verify the exact tree intended for a commit, stage the reviewed files first, then run:

```bash
npm run verify:local
```

The preflight uses a separate build of the staged tree and an owned loopback preview. It runs lint, build, TypeScript, the offline suite and local HTTP/browser checks without copying `.env` files or inheriting service credentials. It needs existing dependencies and Chromium on macOS or Linux. Check the result and per-check logs in `artifacts/local-preflight/`. It does not stage, commit, push or deploy anything. [Regression checks](docs/regression-checks.md)

For an individual HTTP check, run `npm run build`, start the local build in another terminal and pass its URL explicitly.

```bash
npm run start -- --hostname 127.0.0.1
```

```bash
npm run test:rfq-payload -- http://127.0.0.1:3000
```

Browser checks require an existing Chromium binary. `readiness`, edge-limit and durable round-trip scripts can contact production or connected services. Review their effects and consent flags before running them. [Regression checks](docs/regression-checks.md)

## RFQ intake and operations

The shared intake supports `quote`, `equivalent`, `sample`, `documentation`, `recurring-supply`, `private-label`, `contact` and `product-list-review`.

A normal accepted request returns `mode: durable-queue` and a reference ID after its validated payload is stored. Identical retries reuse the immutable record. Changed content under the same reference returns HTTP 409. Storage failure returns HTTP 503 and preserves the form for retry. Honeypot responses have a separate mode and should be classified separately when testing.

Authenticated internal lookup retrieves the saved request and workflow. Owner review, supplier confirmation and response updates use a separate event history. The operations guide documents transitions, retry rules, internal API inputs and the live QA phases. [RFQ operations](docs/rfq-operations.md)

## Public trust evidence

Publication requires an approved value, publishable evidence and a valid non-future evidence date. Enterprise email and measurable response-window checks apply. Incomplete records display `Not published`.

Use the placeholder intake template to collect approved evidence and validate a completed file locally.

```bash
npm run validate:trust-intake -- /absolute/path/to/intake.json
```

The owner handoff documents the four required records and their publication mapping. [Public trust owner intake](docs/public-trust-owner-intake.md)

## Documentation

- [Architecture overview](docs/architecture.md)
- [Regression scripts and running instructions](docs/regression-checks.md)
- [RFQ operations and owner review](docs/rfq-operations.md)
- [Public trust owner evidence intake](docs/public-trust-owner-intake.md)
- [Accessibility acceptance](docs/accessibility-acceptance.md)
- [Performance measurement](docs/lighthouse-baseline.md)
- [Client rendering and asset notes](docs/performance-notes.md)
- [Implementation maintenance notes](docs/implementation-note.md)
- [Product catalog research references](docs/product-catalog-research-notes.md)

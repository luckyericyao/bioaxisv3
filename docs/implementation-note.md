# Implementation maintenance notes

This repository uses Next.js App Router, TypeScript, React, and Tailwind. Route modules under `src/app` assemble shared page templates, typed local catalog data, and client interaction components. The architecture overview describes the route hierarchy, data ownership, breadcrumbs, and RFQ context flow. [Architecture](architecture.md)

## Current implementation

- Product pages use `/products/[segment]/[subcategory]/[family]/[product]`, with segment, subcategory, and family landing pages at each parent level. Local taxonomy and catalog accessors supply route parameters and the shared breadcrumb hierarchy.
- `/products` computes search results on the server. The client receives results and handles input, pagination, focus, and tracking. `src/lib/productRequestHref.ts` builds request links without importing the full catalog into client code.
- Quote, contact, sample, equivalent, and product-list forms share `SourcingIntakeForm` and submit through `src/lib/submitBioAxisRequest.ts` to `POST /api/rfq`. `POST /api/request-quote` remains a compatibility entry point.
- Successful public intake stores an immutable private Blob record. Authenticated queue lookup and append-only workflow events support operator follow-up. RFQ operations documents the lifecycle, idempotency, QA phases, and required operator actions. [RFQ operations](rfq-operations.md)
- Trust evidence uses explicit public values, sources, and a valid review date. The owner intake validator checks structure and publication approval. Source authenticity and entity attribution require human review. [Owner evidence intake](public-trust-owner-intake.md)

## Local verification

Use the existing dependencies and a Node runtime on `PATH`.

```sh
npm run lint
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm test
node scripts/accessibility-static-regression.mjs
node scripts/client-boundary-regression.mjs
npm run test:rfq-roundtrip-phases
npm run build
```

The complete script inventory explains offline coverage, browser and running-server prerequisites, and opt-in checks that create QA records or consume a rate-limit allowance. [Regression checks](regression-checks.md)

Keep route, breadcrumb, search-query, and RFQ product/source context behavior covered when changing data builders, templates, or shared form code. Historical build sizes are recorded with their comparison commits in the performance notes. [Performance notes](performance-notes.md)

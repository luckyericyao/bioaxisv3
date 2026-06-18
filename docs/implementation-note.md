# Implementation note

Baseline checked on 2026-06-18 before this pass:

- Framework: Next.js App Router with TypeScript and Tailwind.
- Package manager: npm through the bundled Codex Node runtime.
- Commands: `npm run lint`, `npm run build`, `npm run start`.
- Git state: clean `main` tracking `origin/main`.
- Baseline build: passed and generated 427 pages.

Issues found from the requested acceptance routes:

- The current taxonomy used several different top-level slugs from the requested BioAxis taxonomy, including `labware-and-general-consumables`, `cell-culture-and-analysis`, `protein-biology-immunoassays`, and `lab-water-and-equipment` style pages.
- Product route file names used `[category]` instead of the requested `[subcategory]` convention.
- Some required family routes such as `/products/liquid-handling/pipette-tips/filtered-pipette-tips`, `/products/lab-plasticware/tubes/microcentrifuge-tubes`, and `/products/cell-culture/media-and-supplements/serum-free-media` did not match the requested slugs.
- RFQ submission was client-only and did not post to an API route.
- `/equivalent-finder` was not present as a dedicated route.
- Resource articles needed real practical content rather than shallow placeholders.

# Buyer Session Reliability

Date: 2026-11-07. Baseline: `c578491`. Local-only engineering review; no publication or production configuration changes.

## Assessment And Goals

The approved systematic design, ranked taxonomy search, specific-before-general configuration hierarchy and product-to-RFQ handoff remain the right direction. This round preserves that design. Reliability under normal browser restrictions and complete intake data has higher value than another content or visual rewrite.

| Priority | Goal and reason | Acceptance |
| --- | --- | --- |
| P0 | Keep sourcing usable when browser storage fails; the global provider could crash every page | Denied storage, quota errors and malformed saved entries do not cause uncaught browser errors. Valid buyer fields survive. In-memory list reaches RFQ, with a tab-only notice when persistence fails. |
| P0 | Preserve server-confirmed success independently of browser cleanup | Local mock success remains success if removing cached drafts fails; exactly one request is sent. Cleanup attempts an empty-value fallback. The title and reference are both visible in the mobile success state. |
| P1 | Keep filters consistent with navigation; Clear filters left stale product-line state | Clear, Back and Forward restore the scope and volume shown by the URL. Form state remounts per canonical filter key. |
| P0, next phase | Prevent partial sourcing-list intake; item 31 was silently discarded | Existing 30-item limit remains. Item 30 is stored in full; a 31-item request is rejected before queue writes. Frontend sends no request and keeps the original list intact. |
| P0, final phase | Preserve per-item intent; dropdown actions did not reach the normalized record | Non-default actions persist as canonical per-item IDs. Sample/document/equivalent flags reflect the selected action without removing explicit checkbox needs. Default quote records retain the legacy payload shape for unchanged retries. |

## Fresh Reproduction

`scripts/buyer-session-regression.mjs` first ran on the unchanged local production build. Normal handoff passed. Five fault/history scenarios failed:

1. A mixed saved array containing `null` crashed the RFQ summary.
2. Denied browser storage caused a client-side application error.
3. Storage quota errors caused the same global failure.
4. Cleanup failure changed a locally mocked successful response into a false failure message.
5. Clear filters changed the URL but retained `liquid-handling` in the control.

Screenshots and machine output: `artifacts/reliability-2026-11-07/before/`. The storage-denied application error and false-failure RFQ screenshots were opened and inspected. These are simulated local conditions, not claims that every production visitor encountered them.

The next phase added a real route-function test with a locally mocked queue: a 31-item request incorrectly returned 200. The server/client limit guard corrects this without increasing accepted payload size or disabling verification.

## Implementation Boundaries

- Shared storage parsing preserves valid title, quantity, catalog, supplier, notes and review flags. Unsafe or missing product links are not rendered; buyer context is retained. Missing legacy dates are not fabricated.
- Existing saved data is not rewritten merely by mounting the provider. Persistence begins after a buyer edits the list.
- React provider state is the fallback for same-tab client navigation. It is not a database or cross-device persistence claim. Reloading a tab with unavailable storage can lose the unsent in-memory list, and the UI says to keep that tab open.
- Cache cleanup uses guarded operations and still dispatches the existing submission-complete event. Queue authority, idempotency, request IDs, verification, rate and byte limits remain in place.
- Success scrolls the confirmation below the sticky header and preserves keyboard focus on the next-request control. This corrects the clipped title observed in the first repaired mobile screenshot.
- The existing 30-item request limit is shared between frontend and API. No silent partial write is presented as success.
- Non-default per-item request actions are preserved in queue payloads, with canonical IDs and corresponding review flags. Default quote records keep their prior shape for idempotent retries; conflicting content is not silently overwritten. The queue lifecycle and provider system are unchanged.
- No routes, taxonomy items, supplier claims, prices, inventory, identity, legal terms, notification services or production secrets were added.

## Repeatable Checks

- `npm run test:sourcing-list-storage`: offline malformed/legacy data, safe navigation, field preservation, duplicate IDs and denied-storage cleanup checks. Included in `npm test`.
- `npm run test:sourcing-need`: route-function and mocked-queue validation, including 30/31-item boundaries.
- `npm run test:buyer-session -- http://127.0.0.1:3014`: local-only browser fault/history/overflow checks. RFQ submissions and verification configuration are intercepted; no real lead is created.
- Existing lint, production build, full offline tests, route smoke, redesign viewport and accessibility suites remain the final regression gates.

## Final Local Results

- `npm run lint`, direct `tsc --noEmit --incremental false`, `npm run build`, full `npm test` and `npm run smoke`: passed. The build generated 1,027 static pages and kept existing dynamic routes.
- `npm run test:buyer-session`: seven scenarios passed in three consecutive runs. History assertions wait for the matching URL, rendered controls and result count rather than a fixed delay. Mobile confirmation title and reference are visible together.
- `npm run test:redesign`: 60 route/viewport checks passed across 1440, 1366, 390 and 320px. `npm run test:a11y-checklist` passed, including keyboard/focus/retry checks and axe on seven routes.
- `npm audit --omit=dev` reported zero vulnerabilities for the current dependency graph. No dependency versions were changed.
- Final evidence: `artifacts/reliability-2026-11-07/final/`; broader responsive evidence: `artifacts/reliability-2026-11-07/redesign/`. These are ignored local test artifacts. Test servers were stopped.

This round stops at the verified buyer-session and intake fixes. Existing design and catalog scope are unchanged. Owner-approved business evidence and real-user observations remain separate inputs; no public facts or legal text were fabricated. All new work stays in the local worktree, without a commit, push, merge, deployment or production configuration change.

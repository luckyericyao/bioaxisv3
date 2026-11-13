# RFQ Intake Integrity

2026-11-09. Local continuation on `c578491`, preserving the existing worktree. Keep the approved design, catalog hierarchy and sourcing paths. The priority is preventing lost or unverified buyer requests, not another layout pass.

| Priority | Why | Local acceptance |
| --- | --- | --- |
| P0: complete intake and handoff | False success, truncated text and stale drafts can silently change a request | Only confirmed durable receipts clear submitted data. Exact text limits and 30 items are accepted in full; over-limit requests write nothing. Direct RFQ ignores stale session handoffs. Explicit text and structured-list handoffs stay separate. |
| P0: recover a lost receipt | Storage can succeed even when the acknowledgement is lost | Retry with the same details and reference recovers the first record, despite a regenerated context timestamp or referrer. Original bytes remain unchanged. Changed email, source, specs or list details still conflict. |
| P0: verification fails closed and can recover | Incomplete keys previously permitted unverified requests; an unavailable check trapped the buyer | Required but incomplete configuration and provider errors cannot write the queue. A successful check is required to proceed. At 390x844, retry configuration by keyboard without losing inputs; unavailable or malformed config keeps submit disabled. |
| P0: preserve shared sourcing-list edits | Separate tabs could overwrite a buyer's saved quantities or delete an edited row after a delayed receipt | Open tabs see saved updates and apply sequential edits to the latest list. A receipt removes only the exact sent versions. A storage-quota fallback remains tab-only if the shared baseline changes. |
| P1: bound the process limiter | A long-lived process kept expired source keys indefinitely | Preserve 20 requests per minute per tracked key, cap tracked keys at 4,096 with a bounded shared overflow window, reclaim expired keys and report `Retry-After` on 429. |

## Repeatable Local Checks

- `npm run lint`, `tsc --noEmit --incremental false`, `npm run build` and `npm test` are the offline gates. The API regression uses local Blob and verification mocks, with a fixed clock for the limiter.
- On a loopback production build, run `npm run smoke` with `SMOKE_BASE_URL` pointing to the local server and without enabling durable writes. Run `test:buyer-session`, `test:rfq-payload`, `test:redesign` and `test:a11y-checklist` against the same URL. Local receipt and challenge fixtures do not submit real inquiries.
- Before/after browser evidence is under `artifacts/rfq-integrity-2026-11-07/` and `artifacts/rfq-safeguards-2026-11-09/`. These directories are ignored. Existing buyer-session and design notes remain intact.

## Final Local Results

- Lint, TypeScript, build (1,027 static pages), full offline suite and route smoke passed.
- All 17 buyer-session scenarios, 60 responsive checks and the accessibility checklist, including axe on seven routes, passed. Evidence: `artifacts/rfq-safeguards-2026-11-09/complete/`.
- Both declared and streamed oversized bodies returned 413. The compiled local rate test returned 429 with `Retry-After` after 20 honeypot responses. With a synthetic incomplete configuration, the verification config, readiness and submission endpoints returned 503.
- Both local servers were stopped. No real queue writes, commit, push, merge, release or production configuration changes were made during this continuation.

## Boundaries And Next Gate

- Local storage is shared only within the browser and origin. Sequential updates are synchronized; simultaneous writes are not a database transaction. An isolated tab draft is not guaranteed to survive a reload.
- The rate check is a per-process fallback, not evidence about the deployed edge rule. All configuration changes used during checks are synthetic and local to test processes.
- Next highest-value content work is verified trust and sourcing evidence. Require approved entity/contact facts, source-backed and dated supply confirmations, or a supplier document for a catalog reference before representing it as verified. Owner approval and evidence review remain separate from format validation. Use the existing [owner intake](public-trust-owner-intake.md) and [buyer observation checklist](redesign-observation.md); do not populate either registry or legal copy with test data.

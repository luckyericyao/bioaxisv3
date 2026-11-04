# RFQ operations

The public RFQ route stores the accepted request as an immutable private Blob record. An operator polls the private queue, claims each request, records any missing information, and records a response after replying outside this system. Optional analytics capture and failure webhooks support service monitoring.

Shared forms post to `POST /api/rfq`, with `POST /api/request-quote` retained as a compatibility alias. Accepted request types are `quote`, `equivalent`, `sample`, `documentation`, `recurring-supply`, `private-label`, `contact`, and `product-list-review`. The route requires a valid email for durable acceptance and retains normalized product hierarchy, source URLs, search context, and sourcing-list items.

The public route caps the complete JSON payload at 160,000 bytes, including streamed bodies. Internal workflow PATCH payloads are capped at 12,000 bytes. Invalid JSON returns HTTP 400, oversized payloads return HTTP 413, duplicate references with different content return HTTP 409, and storage failures return HTTP 503. Browser retries preserve form context and reuse the current reference until the user explicitly starts a new reference. The form refreshes verification for each attempt.

`GET /api/rfq` returns HTTP 200 when the private queue is reachable and anti-spam and internal lookup are configured, otherwise HTTP 503. Both responses include the compiled `release` identifier and service status labels. The readiness check performs a queue listing. Full route and data flow details are in the architecture overview. [Architecture](architecture.md)

## Workflow states

- `stored` means the request has been durably accepted and awaits an operator.
- `in-review` means an operator is assigned and reviewing the request.
- `needs-info` means the assigned operator has recorded the exact information needed from the buyer.
- `supplier-confirmed` means the operator has recorded the supplier's confirmation and its scope in `supplierConfirmation`.
- `responded` means an operator has recorded a concise response summary after replying outside this system.
- `closed` remains available for completed sourcing follow-up and is terminal.

Every update requires an `assignedOwner`. `needs-info` requires `needsInfo`, `supplier-confirmed` requires `supplierConfirmation`, and `responded` and `closed` require `responseSummary`. Supplier confirmation must describe the actual confirmed details and include an evidence reference where available. Operators must record only facts they have verified. A confirmation event records the operator's evidence and its scope.

| Current state | Allowed next states |
| --- | --- |
| `stored` | `in-review`, `needs-info` |
| `in-review` | `needs-info`, `supplier-confirmed`, `responded`, `closed` |
| `needs-info` | `in-review`, `responded`, `closed` |
| `supplier-confirmed` | `in-review`, `needs-info`, `responded`, `closed` |
| `responded` | `in-review`, `closed` |
| `closed` | None |

A real response can be recorded before supplier confirmation, for example when the operator replies with a clarification request or an unavailable outcome. Record `supplier-confirmed` only after confirmation, and record `responded` only after an actual reply. Operators send any customer or supplier messages outside this API.

## Immutable records and retries

The original `rfq/by-id/<requestId>.json` intake record retains `status: "queued"` and its submitted context for its lifetime. Use `workflow.status` in a detail lookup or `requests[].status` in a queue listing for the current lifecycle state. An intake retry with identical content returns the first record. Reusing the same request ID with different content returns a conflict.

Historical schema-v1 workflow events remain immutable. Derived workflow status maps legacy `queued` to `stored` and `reviewing` to `in-review`. The internal PATCH endpoint accepts `reviewing` as a compatibility alias for `in-review`. The current API exposes canonical statuses for schema-v2 events and preserves schema-v1 event content in `workflow.events`.

Workflow changes are separate private, append-only schema-v2 events in consecutive revision slots under `rfq/workflow/by-id/<requestId>/revisions/`. The derived `revision` starts at zero for a request with only historical events and advances with each schema-v2 event. Schema-v2 events retain revision order even with equal or backwards timestamps. Schema-v1 events sort by `recordedAt`, then `operationId`, and merge into that stream by time. A v1 event precedes the first v2 revision whose timestamp is at least its own, or follows all revisions if its timestamp is later. This also applies to revisions recovered directly from storage after an incomplete listing. Thus a later v1 update during rollback can become the current state, and upgrading again resumes the next v2 revision.

Every new revision receives a timestamp at least one millisecond after all observed event timestamps, or the current time if later. This keeps new writes ordered for timestamp-only readers even when the writer's clock moves backwards. Existing revision order takes precedence where historical v2 timestamps disagree. Cross-version ordering relies on legacy timestamps because v1 writers have no shared revision sequence. Concurrent v1/v2 writes or skewed v1 clocks cannot establish an unambiguous causal order.

Use a new `operationId` for each distinct action. Retrying the exact same normalized action with its original ID returns `replayed: true` and adds no event, including after later workflow updates. Reusing an operation ID with different status, owner, or summary fields returns HTTP 409. The legacy `reviewing` alias and canonical `in-review` are equivalent for retry comparisons.

Concurrent updates from the same revision compete for one immutable slot. A distinct losing action receives HTTP 409. Read the current workflow again, reconsider the intended transition, and retry only if it remains appropriate. A storage error returns HTTP 503. If the first write succeeded before a response was lost, retrying the same operation ID recovers that event.

## Rollback compatibility with a7eb824

Newly written schema-v2 records retain all legacy event fields. Their stored `status` uses the old vocabulary, projecting both `in-review` and `supplier-confirmed` to `reviewing`. `needs-info`, `responded`, and `closed` keep their names. A separate `canonicalStatus` stores the full current status, and `supplierConfirmation` and `revision` remain in the same record. Current readers decode `canonicalStatus` before deriving state or comparing retries. Readers also accept earlier v2 records that stored the canonical name directly in `status`.

The `a7eb824` reader ignores these additional fields and reads `status` directly. It can therefore read newly written records and use its transition table safely. During rollback, a supplier-confirmed request appears as `reviewing`. Use the current event history to recover the supplier evidence after upgrading again. Old writers append operation-keyed v1 events, and the current reader includes their later updates on re-upgrade. Exact retries retain their original operation IDs across that sequence.

For a controlled rollback, follow these steps.

1. Pause operator workflow updates and drain in-flight writers before switching versions. Preserve a private backup of intake and workflow history in the authorized storage environment.
2. With the patched version, inspect requests written by earlier v2 versions. Records whose raw `status` is `in-review` or `supplier-confirmed` remain incompatible with the old transition table. For each affected request, append a new, accurate allowed workflow update through the patched API, with a distinct operation ID and an operator explanation. A reviewed request can move to `needs-info` when information is genuinely missing, or a supplier-confirmed request can return to `in-review` for an actual renewed review. Verify the latest stored record has a legacy-compatible status and a strictly later timestamp before switching. If no accurate transition is available, retain the patched workflow service until the request can be handled safely.
3. Switch to `a7eb824` only after that verification. Its workflow vocabulary and validation apply during rollback. Keep updates on one application version at a time because v1 operation-keyed writes bypass v2 revision contention checks.
4. Before upgrading again, pause and drain the old writers. Read back affected requests through the patched API and verify the latest v1 action, owner, summaries, and history. Resume updates with fresh operation IDs. Retry an uncertain earlier action only with its original ID and identical content.

The patch applies the compatible shape to future writes. Earlier immutable records retain their original bytes, including any incompatible status names. Existing records therefore require the pre-rollback review above. The regression uses an independent snapshot of the old reader's status and transition semantics against an in-memory Blob mock, including mixed histories, re-upgrade, and lost-response retries. Live storage behavior requires separately authorized QA verification.

## Internal API

Use `BIOAXIS_INTERNAL_API_KEY` only in a trusted operator environment. Never place it in a URL, browser code, or a customer message.

List submissions with 20 records by default and at most 50 per page. Each triage summary includes `status`, `assignedOwner`, `needsInfo`, `supplierConfirmation`, `responseSummary`, `updatedAt`, and `revision`. Use the request ID lookup below for full submitted context. Pass the returned cursor to retrieve the next page.

```sh
curl --fail-with-body \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  "https://bioaxisv3.vercel.app/api/rfq/internal?limit=20"
```

The authenticated list returns private, uncached triage data.

Read one request and its current workflow.

```sh
curl --fail-with-body \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  "https://bioaxisv3.vercel.app/api/rfq/internal?requestId=BIOAXIS-REQUEST-ID"
```

Update a request. The placeholders below must be replaced with the actual request ID, approved operator, and a new UUID for this action.

```sh
curl --fail-with-body -X PATCH \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-review","assignedOwner":"Operator name","operationId":"replace-with-a-uuid"}' \
  "https://bioaxisv3.vercel.app/api/rfq/internal?requestId=BIOAXIS-REQUEST-ID"
```

The API key authenticates the operator system but does not provide individual staff identity. `assignedOwner` must be the real operator name or team approved by BioAxis. Use a synthetic test label only in QA records.

After reviewing actual supplier evidence, send a new operation with `status: "supplier-confirmed"`, `assignedOwner`, `operationId`, and `supplierConfirmation`. After replying outside this system, send a new operation with `status: "responded"` and `responseSummary`. Each summary belongs to its event. Consult the event history for earlier confirmations, missing-information notes, and replies.

## Owner and service prerequisites

- Set a real, staffed queue owner and publish an approved business contact and response target.
- Approve a data retention period and deletion procedure. No automatic RFQ deletion schedule is implemented until an owner approves the policy.
- The application limits each client IP to 20 requests per 60-second window within one function instance. Platform WAF configuration must be checked in the target environment. The bounded probe below expects an edge HTTP 429 within at most 21 requests in one region and one minute, and distinguishes it from the application response.
- A live submission test requires `RFQ_ROUNDTRIP_CONFIRM=1` and `BIOAXIS_INTERNAL_API_KEY`. It creates one labelled QA record and reads back the immutable intake and current workflow. Supply a valid `RFQ_ROUNDTRIP_TURNSTILE_TOKEN` when Turnstile is configured on the submission target.

## QA submission and actual owner review

These checks contact a running service and private storage. The `submit` phase writes one QA record, and `confirm-owner` appends a workflow event. Use them for an explicitly authorized target. Pass both base URLs so submission and lookup address the intended service and the same Blob store. The script defaults submission to localhost and lookup to the public deployment when arguments are omitted.

For an authorized local service connected to a private QA store, with the existing credentials loaded securely in the shell, run the following command.

```sh
RFQ_ROUNDTRIP_CONFIRM=1 npm run test:rfq-roundtrip -- http://localhost:3000 http://localhost:3000
```

Keep the printed QA request ID. The real operator must read the request through the internal lookup and explicitly confirm review. Only then record that acknowledgment.

```sh
RFQ_ROUNDTRIP_PHASE=confirm-owner \
RFQ_ROUNDTRIP_REQUEST_ID=BIOAXIS-QA-REPLACE-WITH-THE-SAVED-ID \
RFQ_ROUNDTRIP_OWNER=approved-operator-name \
RFQ_OWNER_REVIEW_CONFIRMED=1 \
npm run test:rfq-roundtrip -- http://localhost:3000 http://localhost:3000
```

This second step updates the existing QA request to `in-review`, reads it back, and checks the original submitted context is unchanged. Repeating the same acknowledged assignment does not create another event. Use the `verify` phase with the saved request ID for read-only follow-up.

```sh
RFQ_ROUNDTRIP_PHASE=verify \
RFQ_ROUNDTRIP_REQUEST_ID=BIOAXIS-QA-REPLACE-WITH-THE-SAVED-ID \
npm run test:rfq-roundtrip -- http://localhost:3000 http://localhost:3000
```

Record `responded` after the operator actually replies outside this system.

`npm run test:rfq-queue`, included in `npm test`, checks the lifecycle, required fields, immutable intake, legacy-compatible stored shapes, rollback and re-upgrade, mixed-schema ordering, retries, and concurrent updates with a local Blob mock. All summaries in this regression are synthetic QA fixtures. `npm run test:rfq-roundtrip-phases` checks explicit QA submission, acknowledged owner review, context preservation, legacy status compatibility, and protection of an advanced workflow against a local fetch mock in an isolated subprocess. These regressions provide local behavioral coverage. Production storage and human review require separate checks.

## Bounded WAF enforcement check

```sh
RFQ_EDGE_LIMIT_CONFIRM=1 npm run test:rfq-edge-limit -- https://bioaxisv3.vercel.app
```

This opt-in probe sends at most 21 requests with the honeypot filled. Honeypot responses bypass the durable queue. It distinguishes the application's JSON rate-limit response from the edge response and reports the observed region. Run it against an authorized target in a quiet window because it temporarily consumes the test IP's submission allowance. Treat a passing result as evidence for that target, region, and observation window.

Routine offline validation uses local mocks. The full script inventory describes browser, URL, and live-write prerequisites. [Regression checks](regression-checks.md)

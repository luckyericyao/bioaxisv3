# RFQ operations

The public RFQ route stores the original request as an immutable private Blob record. It does not send email or Telegram notifications. An operator must poll the private queue, claim each request, record any missing information, and mark a reply only after a human has actually responded.

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

Historical schema-v1 workflow events remain immutable. Derived workflow status maps legacy `queued` to `stored` and `reviewing` to `in-review`. The internal PATCH endpoint accepts `reviewing` as a compatibility alias for `in-review`. New events use canonical names, while `workflow.events` preserves historical event content.

Workflow changes are separate private, append-only schema-v2 events in consecutive revision slots under `rfq/workflow/by-id/<requestId>/revisions/`. The derived `revision` starts at zero for a request with only historical events and advances with each new event. Ordering follows these revisions, so equal timestamps or clock differences cannot reorder new events.

Use a new `operationId` for each distinct action. Retrying the exact same normalized action with its original ID returns `replayed: true` and adds no event, including after later workflow updates. Reusing an operation ID with different status, owner, or summary fields returns HTTP 409. The legacy `reviewing` alias and canonical `in-review` are equivalent for retry comparisons.

Concurrent updates from the same revision compete for one immutable slot. A distinct losing action receives HTTP 409. Read the current workflow again, reconsider the intended transition, and retry only if it remains appropriate. A storage error returns HTTP 503. If the first write succeeded before a response was lost, retrying the same operation ID recovers that event.

## Internal API

Use `BIOAXIS_INTERNAL_API_KEY` only in a trusted operator environment. Never place it in a URL, browser code, or a customer message.

List submissions with 20 records by default and at most 50 per page. Each triage summary includes `status`, `assignedOwner`, `needsInfo`, `supplierConfirmation`, `responseSummary`, `updatedAt`, and `revision`. Use the request ID lookup below for full submitted context. Pass the returned cursor to retrieve the next page.

```sh
curl --fail-with-body \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  "https://bioaxisv3.vercel.app/api/rfq/internal?limit=20"
```

The list is private and uncached. It does not contact customers or change workflow state.

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

## Release prerequisites still requiring owner action

- Set a real, staffed queue owner and publish an approved business contact and response target.
- Approve a data retention period and deletion procedure. No automatic RFQ deletion schedule is implemented until an owner approves the policy.
- Vercel production WAF is configured for `POST /api/rfq` with a fixed window of 20 requests per client IP per 60 seconds, then `429 Too Many Requests`. WAF counters are shared outside the function instance but tracked per region. The application-level in-memory limiter remains per function instance and is only a secondary safeguard. See [Vercel's counter scope](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
- A production submission test requires explicit `RFQ_ROUNDTRIP_CONFIRM=1` and `BIOAXIS_INTERNAL_API_KEY`. It creates one clearly labelled QA record and reads back its initial `stored` workflow. A valid production Turnstile token is also needed when submitting to production.

## QA submission and actual owner review

```sh
RFQ_ROUNDTRIP_CONFIRM=1 npm run test:rfq-roundtrip -- https://bioaxisv3.vercel.app https://bioaxisv3.vercel.app
```

Keep the printed QA request ID. The real operator must read the request through the internal lookup and explicitly confirm review. Only then record that acknowledgment.

```sh
RFQ_ROUNDTRIP_PHASE=confirm-owner \
RFQ_ROUNDTRIP_REQUEST_ID=BIOAXIS-QA-REPLACE-WITH-THE-SAVED-ID \
RFQ_ROUNDTRIP_OWNER=approved-operator-name \
RFQ_OWNER_REVIEW_CONFIRMED=1 \
npm run test:rfq-roundtrip -- https://bioaxisv3.vercel.app https://bioaxisv3.vercel.app
```

This second step updates the existing QA request to `in-review`, reads it back, and checks the original submitted context is unchanged. Repeating the same acknowledged assignment does not create another event. Use `RFQ_ROUNDTRIP_PHASE=verify` with the same request ID for read-only follow-up. An automated workflow update never proves a human reply. Only record `responded` after the operator actually replies.

`npm run test:rfq-queue` checks the lifecycle, required fields, immutable intake, legacy history, retries, and concurrent updates with a local Blob mock. All summaries in this regression are synthetic QA fixtures. `npm run test:rfq-roundtrip-phases` checks explicit QA submission, acknowledged owner review, context preservation, legacy status compatibility, and protection of an advanced workflow against a local fetch mock in an isolated subprocess. These regressions provide local behavioral coverage. Production storage and human review require separate checks.

## Bounded WAF enforcement check

```sh
RFQ_EDGE_LIMIT_CONFIRM=1 npm run test:rfq-edge-limit -- https://bioaxisv3.vercel.app
```

This opt-in probe sends at most 21 requests with the honeypot filled, so it never stores an RFQ. It distinguishes the application's JSON rate-limit response from the Vercel edge response and reports the observed region. Run it in a quiet window because it temporarily consumes the test IP's submission allowance. A dashboard rule alone does not prove runtime enforcement.

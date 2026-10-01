# RFQ operations

The public RFQ route stores the original request as an immutable private Blob record. It does not send email or Telegram notifications. An operator must poll the private queue, claim each request, record any missing information, and mark a reply only after a human has actually responded.

## Workflow states

- `queued`: accepted and stored; no operator has claimed it yet.
- `reviewing`: an operator is assigned and reviewing the request.
- `needs-info`: the assigned operator has recorded the exact information needed from the buyer.
- `responded`: an operator has recorded a concise response summary after replying outside this system.
- `closed`: the operator has completed the sourcing follow-up.

Every update requires an `assignedOwner`. `needs-info` requires `needsInfo`; `responded` and `closed` require `responseSummary`. The customer request is never overwritten; workflow changes are separate private, append-only events. `operationId` makes each update idempotent.

## Internal API

Use `BIOAXIS_INTERNAL_API_KEY` only in a trusted operator environment. Never place it in a URL, browser code, or a customer message.

List submissions (20 by default, at most 50 per page). The result includes only a triage summary; use the request ID lookup below for full submitted context. Pass the returned cursor to retrieve the next page:

```sh
curl --fail-with-body \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  "https://bioaxisv3.vercel.app/api/rfq/internal?limit=20"
```

The list is private and uncached. It does not contact customers or change workflow state.

Read one request and its current workflow:

```sh
curl --fail-with-body \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  "https://bioaxisv3.vercel.app/api/rfq/internal?requestId=BIOAXIS-REQUEST-ID"
```

Update a request. Use a new UUID for each distinct action; reuse the same UUID only when retrying the exact same action:

```sh
curl --fail-with-body -X PATCH \
  -H "Authorization: Bearer $BIOAXIS_INTERNAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"reviewing","assignedOwner":"Operator name","operationId":"replace-with-a-uuid"}' \
  "https://bioaxisv3.vercel.app/api/rfq/internal?requestId=BIOAXIS-REQUEST-ID"
```

The API key authenticates the operator system but does not provide individual staff identity. `assignedOwner` must be the real operator name or team approved by BioAxis; a test label is not a production assignment.

## Release prerequisites still requiring owner action

- Set a real, staffed queue owner and publish an approved business contact and response target.
- Approve a data retention period and deletion procedure. No automatic RFQ deletion schedule is implemented until an owner approves the policy.
- Vercel production WAF is configured for `POST /api/rfq`: fixed window, 20 requests per client IP per 60 seconds, then `429 Too Many Requests`. WAF counters are shared outside the function instance but tracked per region, not globally. The application-level in-memory limiter remains per function instance and is only a secondary safeguard. See [Vercel's counter scope](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
- A production submission test requires explicit `RFQ_ROUNDTRIP_CONFIRM=1` and `BIOAXIS_INTERNAL_API_KEY`. It creates one clearly labelled QA record and reads it back without assigning an owner or changing its queued state. A valid production Turnstile token is also needed when submitting to production.

## QA submission and actual owner review

```sh
RFQ_ROUNDTRIP_CONFIRM=1 npm run test:rfq-roundtrip -- https://bioaxisv3.vercel.app https://bioaxisv3.vercel.app
```

Keep the printed QA request ID. The real operator must read the request through the internal lookup and explicitly confirm review. Only then record that acknowledgment:

```sh
RFQ_ROUNDTRIP_PHASE=confirm-owner \
RFQ_ROUNDTRIP_REQUEST_ID=BIOAXIS-QA-REPLACE-WITH-THE-SAVED-ID \
RFQ_ROUNDTRIP_OWNER=approved-operator-name \
RFQ_OWNER_REVIEW_CONFIRMED=1 \
npm run test:rfq-roundtrip -- https://bioaxisv3.vercel.app https://bioaxisv3.vercel.app
```

This second step updates the existing QA request to `reviewing`, reads it back, and checks the original submitted context is unchanged. Repeating the same acknowledged assignment does not create another event. Use `RFQ_ROUNDTRIP_PHASE=verify` with the same request ID for read-only follow-up. An automated workflow update never proves a human reply; only record `responded` after the operator actually replies.

`npm run test:rfq-roundtrip-phases` checks these safety gates against a local mock: no unauthorized QA write, no owner event without acknowledgment, no customer-request mutation, and no overwrite of an advanced workflow. It is not evidence of production storage or human review.

## Bounded WAF enforcement check

```sh
RFQ_EDGE_LIMIT_CONFIRM=1 npm run test:rfq-edge-limit -- https://bioaxisv3.vercel.app
```

This opt-in probe sends at most 21 requests with the honeypot filled, so it never stores an RFQ. It distinguishes the application's JSON rate-limit response from the Vercel edge response and reports the observed region. Run it in a quiet window; it temporarily consumes the test IP's submission allowance. A dashboard rule alone does not prove runtime enforcement.

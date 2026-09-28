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
- Vercel production WAF is configured for `POST /api/rfq`: fixed window, 20 requests per client IP per 60 seconds, then `429 Too Many Requests`. The application-level in-memory limiter remains per function instance and is only a secondary safeguard.
- A production round-trip test requires explicit `RFQ_ROUNDTRIP_CONFIRM=1`, `BIOAXIS_INTERNAL_API_KEY`, and `RFQ_ROUNDTRIP_OWNER`. It creates one clearly labelled QA record and marks it `reviewing`; it sends no customer email.

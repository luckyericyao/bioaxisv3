# BioAxis v3

BioAxis is a one-stop life science consumables sourcing platform for biotech, pharma, academic labs, and research labs.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
npm run smoke
npm run readiness
```

`npm run readiness` checks the public production deployment by default, including core routes, security headers, Turnstile, the private durable RFQ queue, and internal lookup configuration. Pass a URL (`npm run readiness -- http://localhost:3000`) or set `READINESS_BASE_URL` when checking another deployment. The readiness endpoint reports status labels only and never returns secret values.

## Durable RFQ Delivery

The request quote, contact, sample, equivalent, and product-list review flows post to the server-side `POST /api/rfq` endpoint. The legacy `POST /api/request-quote` endpoint is kept as a compatibility alias.

Supported `requestType` values:

- `quote`
- `equivalent`
- `sample`
- `documentation`
- `recurring-supply`
- `contact`
- `product-list-review`

RFQ success means the validated request was written to a private Vercel Blob store. Email is not the system of record and is not required for acceptance.

Set these environment variables in Vercel:

```bash
BLOB_READ_WRITE_TOKEN=provided_when_the_private_blob_store_is_connected
BIOAXIS_INTERNAL_API_KEY=generate_a_long_random_server_only_value
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
POSTHOG_API_KEY=your_server_only_posthog_project_api_key
POSTHOG_HOST=https://us.i.posthog.com
BIOAXIS_ALERT_WEBHOOK_URL=your_server_only_alert_webhook_url
```

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is the public Cloudflare Turnstile widget key. `TURNSTILE_SITE_KEY` is an optional server-served alias. `TURNSTILE_SECRET_KEY`, `BLOB_READ_WRITE_TOKEN`, and `BIOAXIS_INTERNAL_API_KEY` are server-only. `POST /api/rfq` validates the Turnstile token before writing the request.

### Vercel Blob and Turnstile setup

1. Create a private Vercel Blob store and connect it to production, preview, and development.
2. Generate a long random `BIOAXIS_INTERNAL_API_KEY` and store it as a sensitive server-only variable.
3. Create a Cloudflare Turnstile widget for the production domain.
4. Configure the Turnstile site and secret keys.
5. Redeploy, then require `GET /api/rfq` to return HTTP 200 with `durableQueue: reachable`, `antiSpam: configured`, and `internalLookup: configured`.
6. Submit a test RFQ, retain its reference ID, and retrieve it internally with `GET /api/rfq/internal?requestId=...` plus `Authorization: Bearer <BIOAXIS_INTERNAL_API_KEY>`.
7. Confirm the stored record contains the same request ID and expected test context. Never paste the internal key into tickets, screenshots, logs, or client code.

Product search and RFQ funnel events are posted without customer-entered PII to `POST /api/analytics`. They are visible in Vercel function logs; set `POSTHOG_API_KEY` and `POSTHOG_HOST` to persist them. The same request ID is carried through validation, queue-write, success, and failure events. Set `BIOAXIS_ALERT_WEBHOOK_URL` for optional immediate server-side failure alerts; alert delivery never changes whether the durable write succeeded.

To test durable delivery:

1. Deploy with Blob, internal lookup, and Turnstile variables configured.
2. Submit `/request-quote` with a valid email. Product context, sourcing list items, and optional notes are included when available.
3. Confirm the UI shows the reference ID, then retrieve the same record through the authenticated internal endpoint.

If the queue write fails, the API returns HTTP 503 with the same request ID, the browser preserves all form data, and no success state is shown. Queue and internal lookup credentials are never exposed to browser code.

For a repeatable queue-write plus internal-lookup proof, start a local production preview that is connected to the private Blob store, load the server-only key into the shell without printing it, and explicitly authorize one QA record:

```bash
set -a
. ./.env.local
set +a
RFQ_ROUNDTRIP_CONFIRM=1 npm run test:rfq-roundtrip -- http://localhost:3000 https://bioaxisv3.vercel.app
```

The round-trip script uses a reserved example address, verifies the immutable stored record by the same request ID, and prints status fields only. Routine `npm run smoke` runs without durable writes; set `SMOKE_DURABLE_WRITE=1` only when explicit queue-write coverage is intended.

## Public Trust Evidence

Trust Center identity and service commitments are fail-closed. A fact is shown as `Verified` only when its publishable value, its evidence source, and a valid non-future `NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF` date are all configured. Enterprise contact values must use a non-consumer domain, and response targets must contain a measurable number of hours or days. Leave the owner evidence date blank until a source is actually reviewed. Incomplete records remain hidden behind the explicit `Not published` state, and the separate implementation-review date does not imply owner-profile verification.

- Legal identity: `NEXT_PUBLIC_BIOAXIS_LEGAL_NAME` + `NEXT_PUBLIC_BIOAXIS_LEGAL_EVIDENCE`
- Operating region/address: `NEXT_PUBLIC_BIOAXIS_OPERATING_REGION` + `NEXT_PUBLIC_BIOAXIS_OPERATING_EVIDENCE`
- Enterprise-domain email: `NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL` + `NEXT_PUBLIC_BIOAXIS_CONTACT_EVIDENCE`
- Response target: `NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET` + `NEXT_PUBLIC_BIOAXIS_RESPONSE_EVIDENCE`

Evidence variables are public website content. Use a publishable registration, address/domain-ownership record, or response-policy reference; never place private credentials or internal-only documents in them.

`npm run readiness` reports the published evidence count without taking the RFQ service offline when owner evidence is incomplete. Use `REQUIRE_TRUST_EVIDENCE=1 npm run readiness` as the strict publication gate after all four records have been approved.

Run `npm run test:trust-evidence` to verify fail-closed behavior for missing sources, invalid or future dates, consumer email domains, complete four-record publication, and the absence of hard-coded personal email addresses in production source.

Use `docs/public-trust-owner-intake.md` for the owner handoff. A filled JSON intake can be checked with `npm run validate:trust-intake -- /absolute/path/to/intake.json`; `npm run test:trust-intake` covers approval, source, date, enterprise-email, and response-window rejection cases.

## Smoke Test

Build and start the app, then run:

```bash
npm run smoke
```

Use another base URL if needed:

```bash
SMOKE_BASE_URL=https://bioaxisv3.vercel.app npm run smoke
```

Run the scientific-unit and accessibility release gates against the same build:

```bash
npm run test:units-visual -- https://bioaxisv3.vercel.app
npm run test:a11y-checklist -- https://bioaxisv3.vercel.app
```

The accessibility gate covers the four critical routes documented in `docs/accessibility-acceptance.md`, including axe-core WCAG A/AA contrast and semantics, 200%/400% zoom-equivalent reflow, WCAG text spacing, keyboard behavior, mobile target size, the privacy-to-contact anchored mobile handoff, and locally simulated RFQ failure/success announcements. The route smoke test also requires route-specific canonical, Open Graph, Twitter, and hierarchical BreadcrumbList metadata.

## Routes

- `/` - premium dark landing page with search-led sourcing flow
- `/products` - data-driven product universe search and directory
- `/about` - BioAxis positioning and sourcing-platform boundaries
- `/contact` - durable-queue-backed contact and sourcing request form
- `/supplier-qualification` - supplier qualification, documentation, lot traceability, sample-first evaluation, and equivalent review approach
- `/request-quote` - low-friction RFQ form backed by a private durable queue
- `/equivalent-finder` - equivalent-review intake (not an automatic candidate finder)
- `/samples` - sample evaluation request flow
- `/quality` - documentation, qualification, and switching support

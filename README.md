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
```

## RFQ Email Delivery

The request quote, contact, sample, equivalent, and product-list review flows post to the server-side `POST /api/rfq` endpoint. The legacy `POST /api/request-quote` endpoint is kept as a compatibility alias.

Supported `requestType` values:

- `quote`
- `equivalent`
- `sample`
- `documentation`
- `recurring-supply`
- `contact`
- `product-list-review`

Set these environment variables in Vercel Project Settings -> Environment Variables to send RFQ emails through Resend:

```bash
RESEND_API_KEY=your_resend_api_key
BIOAXIS_RFQ_TO_EMAIL=crazyowenyao@gmail.com
BIOAXIS_RFQ_FROM_EMAIL=rfq@your-verified-domain.example
BIOAXIS_RFQ_REPLY_TO_EMAIL=crazyowenyao@gmail.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

Use a verified Resend sender/domain for `BIOAXIS_RFQ_FROM_EMAIL` in production. During development, if no verified sender is available, leave it blank and the API route uses Resend's safe test sender.

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is the public Cloudflare Turnstile widget key. `TURNSTILE_SITE_KEY` is an optional server-served alias for the same public site key, useful when you want the browser to fetch the key from `/api/turnstile/config` at runtime. `TURNSTILE_SECRET_KEY` is server-only and must never be exposed with a `NEXT_PUBLIC_` prefix. When both a site key and `TURNSTILE_SECRET_KEY` are configured, `POST /api/rfq` validates the Turnstile token before sending email.

### Vercel, Resend, and Turnstile setup

1. Create a Resend account.
2. Create a Resend API key.
3. Verify the production sender domain in Resend before using a branded sender address.
4. Create a Cloudflare Turnstile widget for the production domain.
5. Add `RESEND_API_KEY`, `BIOAXIS_RFQ_TO_EMAIL`, `BIOAXIS_RFQ_FROM_EMAIL`, `BIOAXIS_RFQ_REPLY_TO_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` or `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` in Vercel Project Settings -> Environment Variables.
6. Redeploy the Vercel project so the API route can read the variables.
7. Submit a test RFQ from `/request-quote`.
8. Check the destination inbox and spam folder.
9. If email is not received, check Vercel function logs and Resend delivery logs.

To test email delivery:

1. Deploy with all RFQ email environment variables configured.
2. Submit `/request-quote` with a valid email. Product context, sourcing list items, and optional notes are included when available.
3. Confirm the destination inbox receives the BioAxis request email and the UI shows a request received state.

When `RESEND_API_KEY` or `BIOAXIS_RFQ_TO_EMAIL` is not configured, the API still validates the request and returns a captured success response so local builds, smoke tests, and demos remain functional without crashing. The API never exposes `RESEND_API_KEY` to browser code.

## Smoke Test

Build and start the app, then run:

```bash
npm run smoke
```

Use another base URL if needed:

```bash
SMOKE_BASE_URL=https://bioaxisv3.vercel.app npm run smoke
```

## Routes

- `/` - premium dark landing page with search-led sourcing flow
- `/products` - data-driven product universe search and directory
- `/about` - BioAxis positioning and sourcing-platform boundaries
- `/contact` - backend-backed contact and sourcing request form
- `/supplier-qualification` - supplier qualification, documentation, lot traceability, sample-first evaluation, and equivalent review approach
- `/request-quote` - email-first RFQ form backed by `POST /api/rfq`
- `/equivalent-finder` - equivalent consumables request entry point
- `/samples` - sample evaluation request flow
- `/quality` - documentation, qualification, and switching support

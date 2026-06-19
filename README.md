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
```

Use a verified Resend sender/domain for `BIOAXIS_RFQ_FROM_EMAIL` in production. During development, if no verified sender is available, leave it blank and the API route uses Resend's safe test sender.

### Vercel and Resend setup

1. Create a Resend account.
2. Create a Resend API key.
3. Verify the production sender domain in Resend before using a branded sender address.
4. Add `RESEND_API_KEY`, `BIOAXIS_RFQ_TO_EMAIL`, `BIOAXIS_RFQ_FROM_EMAIL`, and `BIOAXIS_RFQ_REPLY_TO_EMAIL` in Vercel Project Settings -> Environment Variables.
5. Redeploy the Vercel project so the API route can read the variables.
6. Submit a test RFQ from `/request-quote`.
7. Check the destination inbox and spam folder.
8. If email is not received, check Vercel function logs and Resend delivery logs.

To test email delivery:

1. Deploy with all RFQ email environment variables configured.
2. Submit `/request-quote` with a valid name, email, request type, and product detail or message.
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
- `/request-quote` - request quote form backed by `POST /api/rfq`
- `/equivalent-finder` - equivalent consumables request entry point
- `/samples` - sample evaluation request flow
- `/quality` - documentation, qualification, and switching support

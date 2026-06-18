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

The request quote flow posts to `POST /api/request-quote`.

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
BIOAXIS_RFQ_TO_EMAIL=sourcing@example.com
```

After adding or changing the variables, redeploy the project so the API route can read them.

To test email delivery:

1. Deploy with `RESEND_API_KEY` and `BIOAXIS_RFQ_TO_EMAIL` configured.
2. Submit `/request-quote` with a valid name, email, company, request type, and product detail or message.
3. Confirm the destination inbox receives the BioAxis request email and the UI shows a request received state.

When these variables are not configured, the API still validates the request and returns a captured success response so local builds, smoke tests, and demos remain functional without crashing.

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
- `/request-quote` - request quote form backed by `POST /api/request-quote`
- `/equivalent-finder` - equivalent consumables request entry point
- `/samples` - sample evaluation request flow
- `/quality` - documentation, qualification, and switching support

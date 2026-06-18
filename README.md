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

Set these environment variables to send RFQ emails through Resend:

```bash
RESEND_API_KEY=your_resend_api_key
BIOAXIS_RFQ_TO_EMAIL=sourcing@example.com
```

When these variables are not configured, the API still validates the request and returns a development capture response so local builds and demos remain functional.

## Routes

- `/` - premium dark landing page with search-led sourcing flow
- `/products` - data-driven product universe search and directory
- `/request-quote` - request quote form backed by `POST /api/request-quote`
- `/equivalent-finder` - equivalent consumables request entry point
- `/samples` - sample evaluation request flow
- `/quality` - documentation, qualification, and switching support

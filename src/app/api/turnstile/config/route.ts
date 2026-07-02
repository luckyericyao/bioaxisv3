import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function turnstileSiteKey() {
  return (
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    process.env.TURNSTILE_SITE_KEY ||
    process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ||
    ""
  );
}

export async function GET() {
  const siteKey = turnstileSiteKey();

  return NextResponse.json(
    {
      enabled: Boolean(siteKey),
      siteKey
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    }
  );
}

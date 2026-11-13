import { NextResponse } from "next/server";
import { getRfqTurnstileConfig, verificationUnavailableMessage } from "@/lib/server/rfqTurnstileConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getRfqTurnstileConfig();
  const headers = { "Cache-Control": "no-store, max-age=0" };

  if (config.status === "unavailable") {
    return NextResponse.json({ error: verificationUnavailableMessage }, { status: 503, headers });
  }

  return NextResponse.json({ enabled: config.status === "ready", siteKey: config.siteKey ?? "" }, { headers });
}

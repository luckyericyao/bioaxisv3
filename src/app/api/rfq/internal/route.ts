import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { readQueuedRfq } from "@/lib/server/rfqQueue";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const expected = process.env.BIOAXIS_INTERNAL_API_KEY || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";

  if (!expected || !supplied) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const requestId = (request.nextUrl.searchParams.get("requestId") || "").replace(/[^a-zA-Z0-9_-]/g, "");

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required." }, { status: 400 });
  }

  try {
    const record = await readQueuedRfq(requestId);

    if (!record) {
      return NextResponse.json({ error: "Request not found.", requestId }, { status: 404 });
    }

    return NextResponse.json({ ok: true, record }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    console.error("[BioAxis RFQ internal lookup] failed", { requestId, error });
    return NextResponse.json({ error: "Lookup failed.", requestId }, { status: 503 });
  }
}

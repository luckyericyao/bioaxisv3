import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const maxPayloadBytes = 8_000;
const allowedEvents = new Set([
  "search",
  "search_no_result",
  "cta_click",
  "sourcing_list_add",
  "rfq_start",
  "rfq_success",
  "rfq_error",
  "turnstile_failure"
]);

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxPayloadBytes) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    const payload = await request.json();
    const name = clean(payload?.name, 40);

    if (!allowedEvents.has(name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const path = clean(payload?.path, 180) || "/";
    const properties = payload?.properties && typeof payload.properties === "object" ? payload.properties : {};

    console.info(
      "[BioAxis event]",
      JSON.stringify({
        name,
        path,
        properties,
        timestamp: clean(payload?.timestamp, 40)
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

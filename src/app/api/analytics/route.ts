import { NextResponse } from "next/server";
import type { BioAxisEventName } from "@/lib/trackBioAxisEvent";
import { recordBioAxisEvent } from "@/lib/server/recordBioAxisEvent";

export const dynamic = "force-dynamic";

const maxPayloadBytes = 8_000;
const analyticsRateWindowMs = 60_000;
const analyticsRateLimit = 120;
const analyticsRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const allowedEvents = new Set([
  "search",
  "search_no_result",
  "search_submit",
  "search_results_view",
  "search_result_cta",
  "cta_click",
  "sourcing_list_add",
  "rfq_start",
  "rfq_submit",
  "rfq_validation_failed",
  "rfq_success",
  "rfq_error",
  "turnstile_failure",
  "rfq_delivery",
  "rfq_queue_write_succeeded",
  "rfq_queue_write_failed"
]);

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isRateLimited(request: Request) {
  const key = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const now = Date.now();
  const current = analyticsRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    analyticsRateLimitStore.set(key, { count: 1, resetAt: now + analyticsRateWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > analyticsRateLimit;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxPayloadBytes) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  if (isRateLimited(request)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const payload = await request.json();
    const name = clean(payload?.name, 40);

    if (!allowedEvents.has(name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const path = clean(payload?.path, 180) || "/";
    const properties = payload?.properties && typeof payload.properties === "object" ? payload.properties : {};

    const result = await recordBioAxisEvent(name as BioAxisEventName, properties, path);

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

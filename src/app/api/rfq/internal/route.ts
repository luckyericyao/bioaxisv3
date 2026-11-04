import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { listQueuedRfqs, readQueuedRfq } from "@/lib/server/rfqQueue";
import { appendRfqWorkflowEvent, getRfqWorkflow, RfqWorkflowUpdateError } from "@/lib/server/rfqWorkflow";
import { PayloadTooLargeError, readLimitedJsonBody } from "@/lib/server/readLimitedJsonBody";

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

  if (!request.nextUrl.searchParams.has("requestId")) {
    const rawLimit = request.nextUrl.searchParams.get("limit");
    const rawCursor = request.nextUrl.searchParams.get("cursor") || "";
    if (rawLimit && !/^[1-9]\d{0,2}$/.test(rawLimit)) {
      return NextResponse.json({ error: "limit must be an integer from 1 to 50." }, { status: 400 });
    }
    const limit = rawLimit ? Number(rawLimit) : 20;
    if (limit > 50 || rawCursor.length > 2048) {
      return NextResponse.json({ error: "Invalid queue page parameters." }, { status: 400 });
    }

    try {
      const page = await listQueuedRfqs({ limit, cursor: rawCursor || undefined });
      const requests = await Promise.all(page.records.map(async (record) => {
        const payload = record.request && typeof record.request === "object" && !Array.isArray(record.request)
          ? record.request as Record<string, unknown>
          : {};
        const context = payload.productContext && typeof payload.productContext === "object" && !Array.isArray(payload.productContext)
          ? payload.productContext as Record<string, unknown>
          : {};
        const workflow = await getRfqWorkflow(record.referenceId);
        const sourcingListItems = Array.isArray(payload.sourcingListItems) ? payload.sourcingListItems : [];

        return {
          requestId: record.referenceId,
          receivedAt: record.receivedAt,
          status: workflow.status,
          assignedOwner: workflow.assignedOwner,
          needsInfo: workflow.needsInfo,
          supplierConfirmation: workflow.supplierConfirmation,
          responseSummary: workflow.responseSummary,
          updatedAt: workflow.updatedAt,
          revision: workflow.revision,
          email: cleanText(payload.email, 240),
          organization: cleanText(payload.organization || payload.company, 180),
          requestType: cleanText(payload.requestType, 80),
          productName: cleanText(context.productName || payload.productName, 240),
          productSegment: cleanText(context.productSegment || payload.productSegment, 160),
          hasProductList: Boolean(cleanText(payload.productList, 1)),
          sourcingListItemCount: sourcingListItems.length
        };
      }));

      return NextResponse.json({
        ok: true,
        requests,
        nextCursor: page.cursor ?? null,
        hasMore: page.hasMore
      }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
    } catch (error) {
      console.error("[BioAxis RFQ internal queue] failed", error);
      return NextResponse.json({ error: "Queue lookup failed." }, { status: 503 });
    }
  }

  const requestId = (request.nextUrl.searchParams.get("requestId") || "").replace(/[^a-zA-Z0-9_-]/g, "");

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required." }, { status: 400 });
  }

  try {
    const [record, workflow] = await Promise.all([
      readQueuedRfq(requestId),
      getRfqWorkflow(requestId)
    ]);

    if (!record) {
      return NextResponse.json({ error: "Request not found.", requestId }, { status: 404 });
    }

    return NextResponse.json({ ok: true, record, workflow }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    console.error("[BioAxis RFQ internal lookup] failed", { requestId, error });
    return NextResponse.json({ error: "Lookup failed.", requestId }, { status: 503 });
  }
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const requestId = (request.nextUrl.searchParams.get("requestId") || "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required." }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = await readLimitedJsonBody(request, 12_000);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Object required");
    payload = parsed as Record<string, unknown>;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof PayloadTooLargeError ? "Request payload is too large." : "Invalid request payload." },
      { status: error instanceof PayloadTooLargeError ? 413 : 400 }
    );
  }

  const status = cleanText(payload.status, 32);
  const operationId = cleanText(payload.operationId, 100);
  const assignedOwner = cleanText(payload.assignedOwner, 180);
  const needsInfo = cleanText(payload.needsInfo, 1600);
  const responseSummary = cleanText(payload.responseSummary, 1600);
  const supplierConfirmation = cleanText(payload.supplierConfirmation, 1600);

  try {
    const record = await readQueuedRfq(requestId);
    if (!record) {
      return NextResponse.json({ error: "Request not found.", requestId }, { status: 404 });
    }

    const update = await appendRfqWorkflowEvent({
      requestId,
      operationId,
      status,
      assignedOwner,
      needsInfo,
      responseSummary,
      supplierConfirmation
    });

    return NextResponse.json({
      ok: true,
      replayed: update.replayed,
      workflow: await getRfqWorkflow(requestId)
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    if (error instanceof RfqWorkflowUpdateError) {
      return NextResponse.json({ error: error.message, requestId }, {
        status: error.statusCode,
        headers: { "Cache-Control": "private, no-store, max-age=0" }
      });
    }
    console.error("[BioAxis RFQ workflow update] failed", { requestId, error });
    return NextResponse.json({ error: "Workflow update failed.", requestId }, { status: 503 });
  }
}

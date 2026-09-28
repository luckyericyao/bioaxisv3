import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { readQueuedRfq } from "@/lib/server/rfqQueue";
import { appendRfqWorkflowEvent, canTransitionRfqWorkflow, getRfqWorkflow, type RfqActionStatus, type RfqWorkflowStatus } from "@/lib/server/rfqWorkflow";
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

const actionStatuses = new Set<RfqWorkflowStatus>(["reviewing", "needs-info", "responded", "closed"]);

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

  const status = cleanText(payload.status, 32) as RfqWorkflowStatus;
  const operationId = cleanText(payload.operationId, 100);
  const assignedOwner = cleanText(payload.assignedOwner, 180);
  const needsInfo = cleanText(payload.needsInfo, 1600);
  const responseSummary = cleanText(payload.responseSummary, 1600);

  if (!actionStatuses.has(status) || !/^[a-zA-Z0-9_-]{8,100}$/.test(operationId) || !assignedOwner) {
    return NextResponse.json({ error: "A valid status, operationId, and assignedOwner are required." }, { status: 400 });
  }
  if (status === "needs-info" && !needsInfo) {
    return NextResponse.json({ error: "needsInfo is required for this status." }, { status: 400 });
  }
  if ((status === "responded" || status === "closed") && !responseSummary) {
    return NextResponse.json({ error: "responseSummary is required for this status." }, { status: 400 });
  }

  try {
    const record = await readQueuedRfq(requestId);
    if (!record) {
      return NextResponse.json({ error: "Request not found.", requestId }, { status: 404 });
    }

    const current = await getRfqWorkflow(requestId);
    const previousOperation = current.events.find((event) => event.operationId === operationId);
    if (previousOperation) {
      const matches = previousOperation.status === status
        && previousOperation.assignedOwner === assignedOwner
        && previousOperation.needsInfo === needsInfo
        && previousOperation.responseSummary === responseSummary;
      if (!matches) {
        return NextResponse.json({ error: "operationId was already used for a different update." }, { status: 409 });
      }

      return NextResponse.json({
        ok: true,
        replayed: true,
        workflow: current
      }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }

    if (!canTransitionRfqWorkflow(current.status, status)) {
      return NextResponse.json({ error: `Status transition ${current.status} -> ${status} is not allowed.` }, { status: 409 });
    }

    const actionStatus = status as RfqActionStatus;
    const update = await appendRfqWorkflowEvent({
      requestId,
      operationId,
      status: actionStatus,
      assignedOwner,
      needsInfo,
      responseSummary
    });

    return NextResponse.json({
      ok: true,
      replayed: update.replayed,
      workflow: await getRfqWorkflow(requestId)
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    console.error("[BioAxis RFQ workflow update] failed", { requestId, error });
    return NextResponse.json({ error: "Workflow update failed.", requestId }, { status: 503 });
  }
}

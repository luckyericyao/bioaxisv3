import { randomUUID } from "node:crypto";
import { get, list, put } from "@vercel/blob";

export const rfqWorkflowStatuses = ["queued", "reviewing", "needs-info", "responded", "closed"] as const;

export type RfqWorkflowStatus = (typeof rfqWorkflowStatuses)[number];
export type RfqActionStatus = Exclude<RfqWorkflowStatus, "queued">;

export type RfqWorkflowEvent = {
  schemaVersion: 1;
  requestId: string;
  operationId: string;
  status: RfqWorkflowStatus;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
  recordedAt: string;
};

export type RfqWorkflowState = {
  status: RfqWorkflowStatus;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
  updatedAt: string;
  events: RfqWorkflowEvent[];
};

export const allowedRfqWorkflowTransitions: Record<RfqWorkflowStatus, RfqWorkflowStatus[]> = {
  queued: ["reviewing", "needs-info"],
  reviewing: ["needs-info", "responded", "closed"],
  "needs-info": ["reviewing", "responded", "closed"],
  responded: ["reviewing", "closed"],
  closed: []
};

export function canTransitionRfqWorkflow(from: RfqWorkflowStatus, to: RfqWorkflowStatus) {
  return allowedRfqWorkflowTransitions[from].includes(to);
}

const workflowPrefix = "rfq/workflow/by-id";

function safePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function workflowPath(requestId: string, operationId: string) {
  return `${workflowPrefix}/${safePart(requestId)}/${safePart(operationId)}.json`;
}

async function readWorkflowEvent(pathname: string): Promise<RfqWorkflowEvent | null> {
  const result = await get(pathname, { access: "private" });

  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return (await new Response(result.stream).json()) as RfqWorkflowEvent;
}

export async function getRfqWorkflow(requestId: string): Promise<RfqWorkflowState> {
  const prefix = `${workflowPrefix}/${safePart(requestId)}/`;
  let cursor: string | undefined;
  const events: RfqWorkflowEvent[] = [];

  do {
    const page = await list({ prefix, limit: 100, cursor });
    const pageEvents = await Promise.all(page.blobs.map((blob) => readWorkflowEvent(blob.pathname)));
    events.push(...pageEvents.filter((event): event is RfqWorkflowEvent => event !== null));
    cursor = page.cursor;
  } while (cursor);

  events.sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
  const latest = events.at(-1);

  return {
    status: latest?.status ?? "queued",
    assignedOwner: latest?.assignedOwner ?? "",
    needsInfo: latest?.needsInfo ?? "",
    responseSummary: latest?.responseSummary ?? "",
    updatedAt: latest?.recordedAt ?? "",
    events
  };
}

export async function appendRfqWorkflowEvent(input: {
  requestId: string;
  operationId: string;
  status: RfqActionStatus;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
}) {
  const pathname = workflowPath(input.requestId, input.operationId);
  const event: RfqWorkflowEvent = {
    schemaVersion: 1,
    ...input,
    recordedAt: new Date().toISOString()
  };

  try {
    const blob = await put(pathname, JSON.stringify(event), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
      cacheControlMaxAge: 60
    });

    return { event, pathname: blob.pathname, replayed: false };
  } catch (error) {
    const existing = await readWorkflowEvent(pathname).catch(() => null);

    if (
      existing &&
      existing.requestId === event.requestId &&
      existing.operationId === event.operationId &&
      existing.status === event.status &&
      existing.assignedOwner === event.assignedOwner &&
      existing.needsInfo === event.needsInfo &&
      existing.responseSummary === event.responseSummary
    ) {
      return { event: existing, pathname, replayed: true };
    }

    throw error;
  }
}

export function createRfqOperationId() {
  return randomUUID();
}

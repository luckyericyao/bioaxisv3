import { randomUUID } from "node:crypto";
import { get, list, put } from "@vercel/blob";

export const rfqWorkflowStatuses = ["stored", "in-review", "needs-info", "supplier-confirmed", "responded", "closed"] as const;

export type RfqWorkflowStatus = (typeof rfqWorkflowStatuses)[number];
export type RfqActionStatus = Exclude<RfqWorkflowStatus, "stored">;

type RfqWorkflowEventDetails = {
  requestId: string;
  operationId: string;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
  recordedAt: string;
};

export type RfqWorkflowEvent = RfqWorkflowEventDetails & (
  | { schemaVersion: 1; status: RfqWorkflowStatus | "queued" | "reviewing"; supplierConfirmation?: string }
  | { schemaVersion: 2; status: RfqActionStatus; supplierConfirmation: string; revision: number }
);

export type RfqWorkflowState = {
  status: RfqWorkflowStatus;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
  supplierConfirmation: string;
  updatedAt: string;
  revision: number;
  events: RfqWorkflowEvent[];
};

export const allowedRfqWorkflowTransitions: Record<RfqWorkflowStatus, RfqWorkflowStatus[]> = {
  stored: ["in-review", "needs-info"],
  "in-review": ["needs-info", "supplier-confirmed", "responded", "closed"],
  "needs-info": ["in-review", "responded", "closed"],
  "supplier-confirmed": ["in-review", "needs-info", "responded", "closed"],
  responded: ["in-review", "closed"],
  closed: []
};

export function canTransitionRfqWorkflow(from: RfqWorkflowStatus, to: RfqWorkflowStatus) {
  return allowedRfqWorkflowTransitions[from].includes(to);
}

export class RfqWorkflowUpdateError extends Error {
  constructor(message: string, public readonly statusCode: 400 | 409) {
    super(message);
    this.name = "RfqWorkflowUpdateError";
  }
}

const workflowPrefix = "rfq/workflow/by-id";

function safePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function workflowPath(requestId: string, revision: number) {
  return `${workflowPrefix}/${safePart(requestId)}/revisions/${String(revision).padStart(12, "0")}.json`;
}

async function readWorkflowEvent(pathname: string): Promise<RfqWorkflowEvent | null> {
  const result = await get(pathname, { access: "private", useCache: false });

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
    if (pageEvents.some((event) => event === null)) throw new Error("Workflow history is incomplete.");
    events.push(...(pageEvents as RfqWorkflowEvent[]));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  // Existing operation-keyed events remain untouched. Revision slots serialize
  // new updates independently of timestamps and legacy event counts.
  events.sort((left, right) => {
    if (left.schemaVersion === 2 && right.schemaVersion === 2) return left.revision - right.revision;
    if (left.schemaVersion !== right.schemaVersion) return left.schemaVersion - right.schemaVersion;
    return left.recordedAt.localeCompare(right.recordedAt) || left.operationId.localeCompare(right.operationId);
  });
  let revision = 0;
  for (const event of events) {
    if (event.requestId !== requestId) throw new Error("Workflow request ID mismatch.");
    if (event.schemaVersion === 2) {
      revision += 1;
      if (event.revision !== revision) throw new Error("Workflow revision gap.");
    }
  }
  // A listing may predate a just-completed write. Read the next immutable slot
  // from origin so retries and readback also see a tail omitted by that listing.
  let next = await readWorkflowEvent(workflowPath(requestId, revision + 1));
  while (next) {
    revision += 1;
    if (next.schemaVersion !== 2 || next.revision !== revision || next.requestId !== requestId) {
      throw new Error("Invalid workflow revision.");
    }
    events.push(next);
    next = await readWorkflowEvent(workflowPath(requestId, revision + 1));
  }
  const latest = events.at(-1);
  const status = latest?.status ?? "stored";

  return {
    status: status === "queued" ? "stored" : status === "reviewing" ? "in-review" : status,
    assignedOwner: latest?.assignedOwner ?? "",
    needsInfo: latest?.needsInfo ?? "",
    responseSummary: latest?.responseSummary ?? "",
    supplierConfirmation: latest?.supplierConfirmation ?? "",
    updatedAt: latest?.recordedAt ?? "",
    revision,
    events
  };
}

export async function appendRfqWorkflowEvent(input: {
  requestId: string;
  operationId: string;
  status: string;
  assignedOwner: string;
  needsInfo: string;
  responseSummary: string;
  supplierConfirmation?: string;
}) {
  const status = input.status === "reviewing" ? "in-review" : input.status;
  if (!rfqWorkflowStatuses.includes(status as RfqWorkflowStatus) || status === "stored"
    || !/^[a-zA-Z0-9_-]{8,100}$/.test(input.operationId) || !input.assignedOwner.trim()) {
    throw new RfqWorkflowUpdateError("A valid status, operationId, and assignedOwner are required.", 400);
  }
  if (status === "needs-info" && !input.needsInfo.trim()) {
    throw new RfqWorkflowUpdateError("needsInfo is required for this status.", 400);
  }
  if (status === "supplier-confirmed" && !input.supplierConfirmation?.trim()) {
    throw new RfqWorkflowUpdateError("supplierConfirmation is required for this status.", 400);
  }
  if ((status === "responded" || status === "closed") && !input.responseSummary.trim()) {
    throw new RfqWorkflowUpdateError("responseSummary is required for this status.", 400);
  }

  const current = await getRfqWorkflow(input.requestId);
  const event: RfqWorkflowEvent = {
    schemaVersion: 2,
    ...input,
    status: status as RfqActionStatus,
    supplierConfirmation: input.supplierConfirmation ?? "",
    revision: current.revision + 1,
    recordedAt: new Date().toISOString()
  };
  const previousOperation = current.events.find((previous) => previous.operationId === event.operationId);
  if (previousOperation) {
    if (!sameWorkflowAction(previousOperation, event)) {
      throw new RfqWorkflowUpdateError("operationId was already used for a different update.", 409);
    }
    const pathname = previousOperation.schemaVersion === 2
      ? workflowPath(input.requestId, previousOperation.revision)
      : `${workflowPrefix}/${safePart(input.requestId)}/${safePart(input.operationId)}.json`;
    return { event: previousOperation, pathname, replayed: true };
  }
  if (!canTransitionRfqWorkflow(current.status, event.status)) {
    throw new RfqWorkflowUpdateError(`Status transition ${current.status} -> ${event.status} is not allowed.`, 409);
  }

  const pathname = workflowPath(input.requestId, event.revision);

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

    if (existing && sameWorkflowAction(existing, event)) {
      return { event: existing, pathname, replayed: true };
    }
    if (existing) {
      throw new RfqWorkflowUpdateError("Workflow changed concurrently. Read the current workflow before retrying.", 409);
    }

    throw error;
  }
}

function sameWorkflowAction(existing: RfqWorkflowEvent, event: RfqWorkflowEvent) {
  const existingStatus = existing.status === "reviewing" ? "in-review" : existing.status;
  return existing.requestId === event.requestId
    && existing.operationId === event.operationId
    && existingStatus === event.status
    && existing.assignedOwner === event.assignedOwner
    && existing.needsInfo === event.needsInfo
    && existing.responseSummary === event.responseSummary
    && (existing.supplierConfirmation ?? "") === event.supplierConfirmation;
}

export function createRfqOperationId() {
  return randomUUID();
}

import { get, list, put } from "@vercel/blob";
import { isDeepStrictEqual } from "node:util";

const queuePrefix = "rfq/by-id";

export type QueuedRfqRecord = {
  schemaVersion: 1;
  referenceId: string;
  receivedAt: string;
  status: "queued";
  request: unknown;
  trace: {
    source: "/api/rfq";
    deploymentId: string;
    environment: string;
  };
};

export class RfqIdempotencyConflictError extends Error {
  constructor() {
    super("Request reference already exists with different content.");
    this.name = "RfqIdempotencyConflictError";
  }
}

function queuePath(referenceId: string) {
  const safeReferenceId = referenceId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `${queuePrefix}/${safeReferenceId}.json`;
}

export function rfqQueueConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function checkRfqQueueConnection() {
  if (!rfqQueueConfigured()) {
    return false;
  }

  try {
    await list({ prefix: `${queuePrefix}/`, limit: 1 });
    return true;
  } catch (error) {
    console.error("[BioAxis RFQ queue] readiness check failed", error);
    return false;
  }
}

export async function enqueueRfq(referenceId: string, request: unknown) {
  const record: QueuedRfqRecord = {
    schemaVersion: 1,
    referenceId,
    receivedAt: new Date().toISOString(),
    status: "queued",
    request,
    trace: {
      source: "/api/rfq",
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || "local",
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "local"
    }
  };

  const pathname = queuePath(referenceId);

  try {
    const blob = await put(pathname, JSON.stringify(record, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
      cacheControlMaxAge: 60
    });

    return { pathname: blob.pathname, etag: blob.etag, record, replayed: false };
  } catch (error) {
    // A browser may retry after the durable write succeeds but before it sees
    // the response. Keep the first record immutable and make that retry
    // idempotent instead of overwriting customer data.
    const existing = await readQueuedRfq(referenceId).catch(() => null);

    if (existing) {
      if (!isDeepStrictEqual(existing.request, request)) {
        throw new RfqIdempotencyConflictError();
      }

      return { pathname, etag: "existing", record: existing, replayed: true };
    }

    throw error;
  }
}

export async function readQueuedRfq(referenceId: string) {
  const result = await get(queuePath(referenceId), { access: "private" });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }

  return (await new Response(result.stream).json()) as QueuedRfqRecord;
}

export async function listQueuedRfqs(options: { limit?: number; cursor?: string } = {}) {
  const limit = Math.max(1, Math.min(50, Math.floor(options.limit ?? 20)));
  const page = await list({
    prefix: `${queuePrefix}/`,
    limit,
    ...(options.cursor ? { cursor: options.cursor } : {})
  });
  const records = await Promise.all(page.blobs.map(async ({ pathname }) => {
    const referenceId = pathname.slice(`${queuePrefix}/`.length).replace(/\.json$/, "");
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(referenceId)) return null;
    return readQueuedRfq(referenceId);
  }));

  return {
    records: records.filter((record): record is QueuedRfqRecord => record !== null),
    cursor: page.hasMore ? page.cursor : undefined,
    hasMore: page.hasMore
  };
}

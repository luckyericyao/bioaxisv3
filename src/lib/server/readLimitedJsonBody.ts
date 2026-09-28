export class PayloadTooLargeError extends Error {}

export async function readLimitedJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error("Request body is missing.");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new PayloadTooLargeError();
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const bodyText = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return JSON.parse(bodyText);
}

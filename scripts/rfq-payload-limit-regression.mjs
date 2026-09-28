const baseUrl = process.argv[2] ?? process.env.RFQ_PAYLOAD_TEST_BASE_URL ?? "http://localhost:3000";
const tooLargePayload = JSON.stringify({ email: "payload-test@example.test", productList: "x".repeat(161_000) });

async function assertTooLarge(response, label) {
  const body = await response.json().catch(() => ({}));
  if (response.status !== 413 || body?.error !== "Request payload is too large.") {
    throw new Error(`${label}: expected HTTP 413 payload-limit response, got ${response.status}`);
  }
}

const declaredLengthResponse = await fetch(new URL("/api/rfq", baseUrl), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: tooLargePayload,
  signal: AbortSignal.timeout(20_000)
});
await assertTooLarge(declaredLengthResponse, "Content-Length request");

const bodyBytes = new TextEncoder().encode(tooLargePayload);
const chunkedBody = new ReadableStream({
  start(controller) {
    const chunkSize = 16_384;
    for (let offset = 0; offset < bodyBytes.byteLength; offset += chunkSize) {
      controller.enqueue(bodyBytes.slice(offset, offset + chunkSize));
    }
    controller.close();
  }
});

const chunkedResponse = await fetch(new URL("/api/rfq", baseUrl), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: chunkedBody,
  duplex: "half",
  signal: AbortSignal.timeout(20_000)
});
await assertTooLarge(chunkedResponse, "chunked request without Content-Length");

console.log("RFQ payload regression passed: declared and chunked bodies above 160 KB are rejected with HTTP 413.");

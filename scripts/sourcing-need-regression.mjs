import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalLoad = Module._load;
const originalTs = require.extensions[".ts"];
const originalFetch = globalThis.fetch;
const envKeys = ["TURNSTILE_SECRET_KEY", "TURNSTILE_SITE_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "CLOUDFLARE_TURNSTILE_SITE_KEY"];
const savedEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
const writes = [];
let sequence = 0;

require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
}).outputText, filename);
Module._load = function load(name, parent, isMain) {
  if (name === "@/lib/server/rfqQueue") return {
    enqueueRfq: async (id, payload) => { writes.push({ id, payload }); return { pathname: "test-only", etag: "test-only" }; },
    rfqQueueConfigured: () => true, checkRfqQueueConnection: async () => true,
    RfqIdempotencyConflictError: class extends Error {}
  };
  if (name === "@/lib/server/alertBioAxisFailure") return { alertBioAxisFailure: async () => {} };
  if (name === "@/lib/server/recordBioAxisEvent") return { recordBioAxisEvent: async () => {} };
  return originalLoad.call(this, name.startsWith("@/") ? path.resolve("src", `${name.slice(2)}.ts`) : name, parent, isMain);
};
globalThis.fetch = () => { throw new Error("This regression must remain offline"); };
envKeys.forEach((key) => delete process.env[key]);

try {
  const { hasSourcingNeed } = require("../src/lib/sourcingNeed.ts");
  const { POST } = require("../src/app/api/rfq/route.ts");
  const meaningful = [
    { productList: "430641" }, { productList: "Pipette tips, sterile, 200 µL" },
    { productContext: { productFamily: "Filtered Pipette Tips" } },
    { productSegment: "Cell Culture" }, { catalogNumber: "D8537" },
    { message: "Need a backup source for PCR plates" },
    { sourcingListItems: [{ title: "Serum Free Media" }] }
  ];
  const empty = [
    {}, { productList: "  \n " }, { productContext: {} }, { sourcingListItems: [] }, { sourcingListItems: [{}] },
    { productList: "Need availability check for:\nCurrent SKU or catalog reference:\nQuantity and timing:" },
    { productList: "Product list review\nPaste product list or supplier lines:\nQuantity and timing:" },
    { productList: "Supplier | Catalog No. | Product | Qty | Required docs | Timeline" },
    { productContext: { productName: "Availability Check request", productCategory: "Supplier-confirmed consumables availability", productSegment: "Availability Check" } }
  ];
  async function send(payload) {
    return POST(new Request("https://bioaxis.local/api/rfq", {
      method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": `test-${++sequence}` },
      body: JSON.stringify(payload)
    }));
  }
  for (const need of meaningful) {
    assert.equal(hasSourcingNeed(need), true);
    const response = await send({ email: "qa@example.test", ...need });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).mode, "durable-queue");
  }
  for (const need of empty) {
    assert.equal(hasSourcingNeed(need), false);
    const before = writes.length;
    const response = await send({ email: "qa@example.test", ...need });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Add a product/);
    assert.equal(writes.length, before);
  }
  for (const email of ["", "invalid", "a@", "@example.test"]) {
    const response = await send({ email, productList: "PCR plates" });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /email/);
  }
  const before = writes.length;
  const trap = await send({ website: "filled-spam-trap", email: "bot@example.test" });
  assert.equal((await trap.json()).mode, "honeypot");
  assert.equal(writes.length, before);
  process.env.TURNSTILE_SECRET_KEY = "test-only";
  process.env.TURNSTILE_SITE_KEY = "test-only";
  const unverified = await send({ email: "qa@example.test", productList: "PCR plates" });
  assert.equal(unverified.status, 400);
  assert.match((await unverified.json()).error, /verification/);
  assert.equal(writes.length, before);
  console.log(`Sourcing-need regression passed: ${meaningful.length} meaningful needs, ${empty.length} empty/template cases, invalid email, real POST validation, honeypot and fail-closed verification; local queue mock only.`);
} finally {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  globalThis.fetch = originalFetch;
  for (const key of envKeys) { if (savedEnv[key] === undefined) delete process.env[key]; else process.env[key] = savedEnv[key]; }
}

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
const envKeys = ["TURNSTILE_SECRET_KEY", "TURNSTILE_SITE_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "CLOUDFLARE_TURNSTILE_SITE_KEY", "BLOB_READ_WRITE_TOKEN", "VERCEL_ENV"];
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
  const { GET: getVerificationConfig } = require("../src/app/api/turnstile/config/route.ts");
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
  async function send(payload, client = `test-${++sequence}`) {
    return POST(new Request("https://bioaxis.local/api/rfq", {
      method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": client },
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
  const thirtyItems = Array.from({ length: 30 }, (_, index) => ({ title: `QA sourcing item ${index + 1}`, quantity: `${index + 1} racks`, requestedAction: index === 29 ? "Sample" : "Quote" }));
  assert.equal((await send({ email: "qa@example.test", sourcingListItems: thirtyItems })).status, 200);
  assert.equal(writes.at(-1).payload.sourcingListItems.length, 30);
  assert.equal(writes.at(-1).payload.sourcingListItems[29].quantity, "30 racks");
  assert.equal(writes.at(-1).payload.sourcingListItems[29].requestedAction, "sample", "Per-item request intent must survive API normalization");
  assert.equal(writes.at(-1).payload.sourcingListItems[29].sampleNeeded, "Yes");
  assert.equal(Object.hasOwn(writes.at(-1).payload.sourcingListItems[0], "requestedAction"), false, "Default quote payload shape must remain compatible with existing retry records");
  for (const [requestedAction, expected, flag] of [["Equivalent", "equivalent", "equivalentNeeded"], ["Documents", "documentation", "documentationNeeded"], ["Recurring supply", "recurring-supply", null]]) {
    assert.equal((await send({ email: "qa@example.test", sourcingListItems: [{ title: "QA consumable", requestedAction }] })).status, 200);
    assert.equal(writes.at(-1).payload.sourcingListItems[0].requestedAction, expected);
    if (flag) assert.equal(writes.at(-1).payload.sourcingListItems[0][flag], "Yes");
  }
  const beforeOverflow = writes.length;
  const overflowing = await send({ email: "qa@example.test", sourcingListItems: [...thirtyItems, { title: "QA sourcing item 31" }] });
  assert.equal(overflowing.status, 400, "An overflowing list must not be silently truncated");
  assert.match((await overflowing.json()).error, /30/);
  assert.equal(writes.length, beforeOverflow, "An overflowing request must not be partially written");
  const boundary = {
    email: "qa@example.test",
    productList: "A".repeat(11_999) + "Z",
    message: "B".repeat(7_999) + "Y",
    documentationNeeds: "C".repeat(1_199) + "X",
    sourcingListItems: [{ title: "QA plate", quantity: "Q".repeat(120), notes: "N".repeat(1_199) + "W" }]
  };
  assert.equal((await send(boundary)).status, 200);
  for (const field of ["productList", "message", "documentationNeeds"]) {
    assert.equal(writes.at(-1).payload[field], boundary[field], `Accepted ${field} must retain its last character`);
  }
  assert.equal(writes.at(-1).payload.sourcingListItems[0].notes, boundary.sourcingListItems[0].notes);
  for (const [fields, label] of [
    [{ productList: boundary.productList + "!" }, /Product details.*12,000/],
    [{ message: boundary.message + "!" }, /Notes.*8,000/],
    [{ documentationNeeds: boundary.documentationNeeds + "!" }, /Required documents.*1,200/],
    [{ supplier: "S".repeat(221) }, /Current supplier.*220/],
    [{ company: "C".repeat(241) }, /Company.*240/],
    [{ sourcingListItems: [boundary.sourcingListItems[0], { title: "QA tips", quantity: "Q".repeat(121) }] }, /Item 2.*Quantity.*120/],
    [{ sourcingListItems: [{ ...boundary.sourcingListItems[0], notes: boundary.sourcingListItems[0].notes + "!" }] }, /Item 1.*Notes.*1,200/]
  ]) {
    const beforeLimitError = writes.length;
    const response = await send({ ...boundary, ...fields });
    assert.equal(response.status, 400, `Overlong ${Object.keys(fields).join(", ")} must not be silently truncated`);
    assert.match((await response.json()).error, label);
    assert.equal(writes.length, beforeLimitError, "A rejected text field must not result in a queue write");
  }
  const before = writes.length;
  const trap = await send({ website: "filled-spam-trap", email: "bot@example.test" });
  assert.equal((await trap.json()).mode, "honeypot");
  assert.equal(writes.length, before);

  const verificationNeed = { email: "qa@example.test", productList: "PCR plates" };
  const localConfig = await getVerificationConfig();
  assert.equal(localConfig.status, 200);
  assert.equal((await localConfig.json()).enabled, false);
  const secret = "qa-verification-secret-not-public";
  const siteKey = "qa-public-widget-key";
  for (const environment of [
    { TURNSTILE_SITE_KEY: siteKey }, { TURNSTILE_SECRET_KEY: secret },
    { VERCEL_ENV: "production" }, { VERCEL_ENV: "preview" }, { BLOB_READ_WRITE_TOKEN: "qa-queue-token" }
  ]) {
    Object.assign(process.env, environment);
    const unavailable = await send(verificationNeed);
    assert.equal(unavailable.status, 503, `Verification must fail closed with ${Object.keys(environment).join(", ")}`);
    assert.match((await unavailable.json()).error, /verification.*unavailable/i);
    assert.equal(writes.length, before, "Incomplete verification configuration must not write a request");
    const config = await getVerificationConfig();
    assert.equal(config.status, 503);
    assert.match(config.headers.get("cache-control"), /no-store/);
    assert.doesNotMatch(await config.text(), /qa-verification-secret-not-public|qa-queue-token/);
    envKeys.forEach((key) => delete process.env[key]);
  }

  Object.assign(process.env, {
    TURNSTILE_SECRET_KEY: secret, CLOUDFLARE_TURNSTILE_SITE_KEY: siteKey, VERCEL_ENV: "production", BLOB_READ_WRITE_TOKEN: "qa-queue-token"
  });
  const readyConfig = await getVerificationConfig();
  assert.equal(readyConfig.status, 200);
  assert.deepEqual(await readyConfig.json(), { enabled: true, siteKey });
  const unverified = await send(verificationNeed);
  assert.equal(unverified.status, 400);
  assert.match((await unverified.json()).error, /verification/);
  assert.equal(writes.length, before);

  for (const [providerStatus, providerBody, expectedStatus] of [
    [200, { success: false }, 400],
    [200, { success: "true" }, 503],
    [503, { success: true }, 503],
    [0, undefined, 503],
    [200, { success: true }, 200]
  ]) {
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls += 1;
      assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
      assert.equal(options.body.get("secret"), secret);
      assert.equal(options.body.get("response"), "qa-buyer-token");
      assert.ok(options.signal instanceof AbortSignal, "Siteverify must have a timeout");
      if (!providerStatus) throw new Error("Synthetic provider timeout");
      return Response.json(providerBody, { status: providerStatus });
    };
    const result = await send({ ...verificationNeed, turnstileToken: "qa-buyer-token" });
    assert.equal(calls, 1);
    assert.equal(result.status, expectedStatus);
    assert.doesNotMatch(await result.text(), /qa-verification-secret-not-public|qa-queue-token|Synthetic provider timeout/);
    assert.equal(writes.length, before + Number(expectedStatus === 200));
  }

  const readTime = Date.now;
  let rateTestTime = readTime() + 120_000;
  Date.now = () => rateTestTime;
  try {
    const writesBeforeBurst = writes.length;
    const trap = { website: "qa-limiter-only" };
    for (let index = 0; index < 4_096; index += 1) {
      assert.equal((await send(trap, `qa-tracked-${index}`)).status, 200);
    }
    for (let index = 0; index < 20; index += 1) {
      assert.equal((await send(trap, `qa-overflow-${index}`)).status, 200);
    }
    rateTestTime += 12_000;
    const overflow = await send(trap, "qa-overflow-excess");
    assert.equal(overflow.status, 429, "New source keys beyond the cap must share a bounded allowance");
    assert.equal(overflow.headers.get("retry-after"), "48");
    for (let index = 1; index < 20; index += 1) {
      assert.equal((await send(trap, "qa-tracked-0")).status, 200, "An existing bucket keeps its own allowance");
    }
    const tracked = await send(trap, "qa-tracked-0");
    assert.equal(tracked.status, 429);
    assert.equal(tracked.headers.get("retry-after"), "48");
    rateTestTime += 48_000;
    for (let index = 0; index < 20; index += 1) {
      assert.equal((await send(trap, "qa-first-after-expiry")).status, 200);
    }
    assert.equal((await send(trap, "qa-first-after-expiry")).status, 429);
    assert.equal((await send(trap, "qa-second-after-expiry")).status, 200, "Expired buckets must free independent capacity");
    assert.equal(writes.length, writesBeforeBurst, "Limiter regression must not write queue records");
  } finally {
    Date.now = readTime;
  }
  console.log(`Sourcing-need regression passed: ${meaningful.length} meaningful needs, ${empty.length} empty/template cases, invalid email, per-item intent/flags, complete 30-item boundary, rejected overflow without partial writes, real POST validation, verification configuration/provider failures, and bounded local rate windows; local mocks only.`);
} finally {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  globalThis.fetch = originalFetch;
  for (const key of envKeys) { if (savedEnv[key] === undefined) delete process.env[key]; else process.env[key] = savedEnv[key]; }
}

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const Module = require("node:module");
const filename = fileURLToPath(new URL("../src/lib/sourcingListStorage.ts", import.meta.url));
const compiled = new Module(filename);
compiled._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText, filename);
const { beginSourcingListHandoff, parseSourcingList, readBrowserStorage, restoreSourcingListHandoff, retireSourcingListHandoff, writeBrowserStorage, removeBrowserStorage, retainUnsubmittedSourcingItems } = compiled.exports;
const previousWindow = globalThis.window;

try {
  for (const raw of ["{", "null", "7", "{}", '[null, 7, "string", {}]']) {
    assert.deepEqual(parseSourcingList(raw), { items: [], needsReview: true });
  }
  assert.deepEqual(parseSourcingList(null), { items: [], needsReview: false });
  const source = [{ id: "test", title: "Filtered tips", href: "/products/liquid-handling?q=tips", quantity: "12 racks", notes: "Need CoA", sampleNeeded: true }, null];
  const restored = parseSourcingList(JSON.stringify(source));
  assert.equal(restored.needsReview, true);
  assert.equal(restored.items[0].quantity, "12 racks");
  assert.equal(restored.items[0].notes, "Need CoA");
  assert.equal(restored.items[0].sampleNeeded, true);
  assert.equal(restored.items[0].href, source[0].href);
  assert.equal(restored.items[0].addedAt, "", "Do not invent dates for legacy data");
  const sent = restored.items[0];
  const secondSent = { ...sent, id: "second" };
  const editedWhileSending = { ...sent, quantity: "24 racks" };
  const addedWhileSending = { ...sent, id: "new" };
  assert.deepEqual(retainUnsubmittedSourcingItems([editedWhileSending, { ...secondSent }, addedWhileSending], [sent, secondSent]), [editedWhileSending, addedWhileSending]);
  assert.deepEqual(retainUnsubmittedSourcingItems([{ ...sent, addedAt: "new-timestamp" }], [sent]).map((item) => item.addedAt), ["new-timestamp"]);
  for (const href of ["javascript:alert(1)", "https://example.test/products/a", "//example.test/products/a", "/products-fake", "/products\\example.test"]) {
    const item = parseSourcingList(JSON.stringify([{ title: "Keep purchasing context", href }])).items[0];
    assert.equal(item.href, "", "Unsafe or invalid navigation is not restored");
    assert.equal(item.title, "Keep purchasing context", "Do not discard valid purchasing context with an unusable route");
  }
  const duplicate = parseSourcingList(JSON.stringify([{ id: "a", title: "One" }, { id: "a:restored:2", title: "Two" }, { id: "a", title: "Three" }]));
  assert.equal(new Set(duplicate.items.map((item) => item.id)).size, 3);
  assert.equal(duplicate.items.length, 3);
  const legacy = parseSourcingList(JSON.stringify([{ productTitle: "PCR plates", quantity: "2 cases", sampleNeeded: "false" }]));
  assert.equal(legacy.items[0].title, "PCR plates");
  assert.equal(legacy.items[0].sampleNeeded, false);
  const data = new Map();
  globalThis.window = { localStorage: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) } };
  assert.equal(writeBrowserStorage("localStorage", "list", "[]"), true);
  assert.deepEqual(readBrowserStorage("localStorage", "list"), { available: true, value: "[]" });
  window.localStorage.removeItem = () => { throw new Error("Test-only blocked removal"); };
  assert.equal(removeBrowserStorage("localStorage", "list"), true);
  assert.equal(data.get("list"), "", "Fallback cleanup must not resurrect a submitted list");
  const handoffs = new Map();
  window.sessionStorage = { getItem: (key) => handoffs.get(key) ?? null, setItem: (key, value) => handoffs.set(key, value), removeItem: (key) => handoffs.delete(key) };
  const older = beginSourcingListHandoff([sent]);
  const latest = beginSourcingListHandoff([editedWhileSending]);
  assert.notEqual(older, latest);
  assert.equal(restoreSourcingListHandoff(older), null);
  assert.equal(restoreSourcingListHandoff(undefined), null);
  retireSourcingListHandoff(older);
  assert.deepEqual(restoreSourcingListHandoff(latest)?.items, [editedWhileSending]);
  assert.equal(JSON.parse(handoffs.get("bioaxis:sourcing-list-handoff")).id, latest);
  retireSourcingListHandoff(latest);
  assert.equal(restoreSourcingListHandoff(latest), null);
  Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Test-only blocked storage"); } });
  assert.deepEqual(readBrowserStorage("sessionStorage", "list"), { available: false, value: null });
  assert.equal(writeBrowserStorage("sessionStorage", "list", "[]"), false);
  assert.equal(removeBrowserStorage("sessionStorage", "list"), false);
  const memoryOnly = beginSourcingListHandoff([sent]);
  assert.deepEqual(restoreSourcingListHandoff(memoryOnly)?.items, [sent]);
  retireSourcingListHandoff(memoryOnly);
  assert.equal(restoreSourcingListHandoff(memoryOnly), null);
  console.log("Sourcing-list storage regression passed: malformed/legacy/mixed data, preserved buyer fields, safe product paths, unique IDs, selective confirmation cleanup and blocked storage; offline only.");
} finally {
  if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
}

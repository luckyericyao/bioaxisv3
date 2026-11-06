import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  return originalResolve.call(this, request.startsWith("@/") ? path.resolve("src", request.slice(2)) : request, parent, isMain, options);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
}).outputText, filename);

try {
  const { sourcingSpecifications } = require("../src/lib/sourcingSpecifications.ts");
  const { getSourcingConfigurations, filterSourcingConfigurations, sourcingFilterBrief } = require("../src/lib/server/sourcingConfigurations.ts");
  const fields = sourcingSpecifications(["nominal volume: 200 µL", "sterility: sterile or non-sterile", "filter barrier: filtered or aerosol barrier", "packaging: racked, reload, or bulk"]);
  assert.equal(fields.find((field) => field.key === "nominal volume").status, "target");
  assert.equal(fields.find((field) => field.key === "sterility").status, "to-confirm");
  assert.equal(fields.find((field) => field.key === "packaging").status, "to-confirm");
  assert.equal(fields.find((field) => field.key === "filter barrier").value, "Filtered");
  const general = sourcingSpecifications(["material such as polypropylene, polystyrene, or polycarbonate", "sterile or non-sterile format"]);
  assert.equal(general[0].label, "Material");
  assert.ok(general.every((field) => field.status === "to-confirm"));
  assert.equal(sourcingSpecifications({ Packaging: "Packaging reviewed during RFQ" })[0].status, "to-confirm");
  for (const value of ["", "  ", "TBD", "TBC", "unknown", "Not specified", "Not provided", "Pending", "-", "—", "?", "N/A", "To be checked", "See supplier documentation"]) {
    assert.equal(sourcingSpecifications({ Sterility: value })[0].status, "to-confirm", `${JSON.stringify(value)} is not a specific target`);
  }
  const trimmed = sourcingSpecifications({ "  Nominal   volume  ": " 200 µL ", " Sterility ": [" Sterile ", ""] });
  assert.equal(trimmed[0].key, "nominal volume");
  assert.equal(trimmed[0].value, "200 µL");
  assert.equal(trimmed[0].status, "target");
  assert.equal(trimmed[1].value, "Sterile");
  assert.equal(trimmed[1].status, "target");
  assert.equal(sourcingSpecifications({ Sterility: ["Sterile", "Non-sterile"] })[0].status, "to-confirm");
  const fixture = (title, sterility) => ({ title, href: `/test/${title}`, segment: "test", category: "test", segmentTitle: "Test", categoryTitle: "Test", familyTitle: "Test", fields: sourcingSpecifications([`sterility: ${sterility}`]) });
  const rows = [fixture("sterile", "Sterile"), fixture("nonsterile", "Non-sterile"), fixture("unknown", "sterile or non-sterile")];
  assert.deepEqual(filterSourcingConfigurations(rows, { sterility: "Sterile" }).map((row) => row.title), ["sterile"]);
  assert.deepEqual(filterSourcingConfigurations(rows, { sterility: "Non-sterile" }).map((row) => row.title), ["nonsterile"]);
  assert.deepEqual(filterSourcingConfigurations(rows, { sterility: "Sterile", includeUnconfirmed: true }).map((row) => [row.title, row.needsConfirmation]), [["sterile", false], ["unknown", true]]);
  const conflicting = { ...fixture("wrong-volume", "Sterile"), fields: sourcingSpecifications(["volume: 100 µL", "sterility: Sterile", "packaging: TBD"]) };
  assert.deepEqual(filterSourcingConfigurations([conflicting], { volume: "200 µL", packaging: "Racked", includeUnconfirmed: true }), [], "Opting into unconfirmed fields must not override a conflicting target");
  const real = getSourcingConfigurations();
  assert.ok(real.length > 0);
  assert.equal(new Set(real.map((row) => row.href)).size, real.length);
  const selected = filterSourcingConfigurations(real, { volume: "200 uL", barrier: "Filtered" });
  assert.ok(selected.some((row) => /filtered-200ul-pipette-tips$/.test(row.href)));
  assert.ok(selected.every((row) => row.fields.some((field) => field.status === "target" && field.value === "200 µL")));
  const brief = sourcingFilterBrief({ q: "tip reference", volume: "200 µL", sterility: "Sterile" });
  assert.match(brief, /Requested volume: 200 µL/);
  assert.match(brief, /Requested sterility: Sterile/);
  console.log(`Sourcing configuration regression passed: ${real.length} existing specific routes, exact sterile/non-sterile matching, unknown/multi-option exclusion, opt-in confirmation without conflicting targets, normalized fields/units and RFQ filter brief; offline fixtures only.`);
} finally {
  Module._resolveFilename = originalResolve;
}

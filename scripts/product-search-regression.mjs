import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalResolveFilename = Module._resolveFilename;
const failures = [];

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(process.cwd(), "src", request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};

require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;
  module._compile(compiled, filename);
};

const { getProductSearchIndexSize, getProductSearchResults } = require("../src/data/productSearch.ts");
const cases = [
  ["cell", "Cell Culture"],
  ["gene", "Molecular Biology & PCR"],
  ["filtered 200 µL tips", "Filtered 200 µL Pipette Tips"],
  ["serum-free media", "Serum Free"],
  ["PES 0.22 µm syringe filters", "PES 0.22 µm Syringe Filters"],
  ["Hamilton", "Hamilton-compatible Robotic Tips"],
  ["TPE tubing", "TPE Tubing"],
  ["qPCR plates", "qPCR Plates"],
  ["cryogenic vials", "Cryogenic Vials"],
  ["microcentrifuge tubes", "Microcentrifuge Tubes"],
  ["PCR tubes", "PCR Tubes"],
  ["universal pipette tips", "Universal Pipette Tips"],
  ["cell culture dishes", "Cell Culture Dishes"],
  ["serum-free cell culture media", "Serum Free"],
  ["robotic tips", "Robotic Pipette Tips"],
  ["cell banking", "Cell"],
  ["96-well PCR plates", "96-Well PCR Plates"],
  ["384-well PCR plates", "384-Well PCR Plates"],
  ["syringe filters", "Syringe Filters"],
  ["tissue culture flasks", "Tissue Culture Flasks"]
];

for (const [query, expected] of cases) {
  const results = getProductSearchResults(query);
  if (!results.some((result) => result.title.toLowerCase().includes(expected.toLowerCase()))) {
    failures.push(`${query}: expected a result containing ${expected}`);
  }
  console.log(`${query}: ${results.length} result${results.length === 1 ? "" : "s"}`);
}

const cellResults = getProductSearchResults("cell");
if (cellResults[0]?.title !== "Cell Culture") {
  failures.push(`cell: expected Cell Culture first, got ${cellResults[0]?.title ?? "no results"}`);
}
if (cellResults.length > 120) {
  failures.push(`cell: direct-match results remain too broad (${cellResults.length})`);
}
if (cellResults.slice(0, 6).some((result) => result.segmentSlug === "liquid-handling")) {
  failures.push("cell: Liquid Handling appears in the top six ahead of direct cell-culture matches");
}
for (const expected of ["Tissue Culture Flasks", "Cell Culture Dishes", "Multiwell Cell Culture Plates"]) {
  if (!cellResults.slice(0, 6).some((result) => result.title === expected)) {
    failures.push(`cell: ${expected} is missing from the first six direct results`);
  }
}

if (getProductSearchResults("430641").length !== 0) {
  failures.push("430641: unknown catalog reference must not be presented as a taxonomy match");
}

if (getProductSearchIndexSize() !== 429) {
  failures.push(`index size changed unexpectedly: expected 429 sourcing paths, got ${getProductSearchIndexSize()}`);
}

if (failures.length) {
  console.error("Product search regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Product search regression passed (${cases.length} queries; ${cellResults.length} direct cell matches; ${getProductSearchIndexSize()} indexed paths).`);
console.log(`cell first six: ${cellResults.slice(0, 6).map((result) => result.title).join(" | ")}`);

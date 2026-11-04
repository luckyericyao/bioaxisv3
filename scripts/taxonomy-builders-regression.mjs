import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const filename = "src/data/productTaxonomy/builders.ts";
const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const localModule = { exports: {} };
// The builder has no runtime dependencies. Keep network APIs and process out of
// its sandbox, and reject any dependency introduced later rather than loading it.
vm.runInNewContext(compiled, {
  module: localModule,
  exports: localModule.exports,
  require: (name) => assert.fail(`Unexpected builder dependency: ${name}`)
}, { filename });
const { buildSegment } = localModule.exports;

function deepFreeze(value) {
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") deepFreeze(child);
  }
  return Object.freeze(value);
}

// TEST-ONLY seed: exercise display formatting without adding catalog records.
const names = [
  ["1ml-serological-pipettes", "1 mL Serological Pipettes"],
  ["25ml-serological-pipettes", "25 mL Serological Pipettes"],
  ["50ml-serological-pipettes", "50 mL Serological Pipettes"],
  ["40um-cell-strainers", "40 µm Cell Strainers"],
  ["70um-cell-strainers", "70 µm Cell Strainers"],
  ["100um-cell-strainers", "100 µm Cell Strainers"],
  ["96-well-pcr-plates", "96-Well PCR Plates"],
  ["384-well-automation-plates", "384-Well Automation Plates"],
  ["2d-barcoded-tubes", "2D Barcoded Tubes"],
  ["dna-rna-concentrators", "DNA/RNA Concentrators"],
  ["dnase-rnase-free", "DNase/RNase-Free"],
  ["qpcr-plates", "qPCR Plates"],
  ["pcr-and-qpcr", "PCR and qPCR"],
  ["ph-buffers", "pH Buffers"],
  ["pes-and-pvdf-filters", "PES and PVDF Filters"],
  ["sds-and-coa", "SDS and COA"],
  ["tpe-tubing", "TPE Tubing"],
  ["test-only-family", "Test Only Family"]
];
const seed = deepFreeze({
  slug: "test-only-segment",
  name: "TEST-ONLY segment",
  headline: "TEST-ONLY formatting fixture",
  shortDescription: "TEST-ONLY in-memory regression data",
  buyerUseCases: [],
  buyerSpecs: ["TEST-ONLY specification"],
  commonFormats: ["TEST-ONLY format"],
  applications: [],
  documentationNeeds: ["TEST-ONLY document request"],
  relatedSegments: [],
  subcategories: [
    { slug: "test-only-formats", name: "TEST-ONLY formats", families: names.map(([slug]) => slug) },
    { slug: "test-only-empty", name: "TEST-ONLY empty category", families: [] }
  ]
});
const originalSeed = structuredClone(seed);
const built = buildSegment(7, seed);
const category = built.subcategories[0];

assert.equal(built.slug, seed.slug, "Formatting must not change the segment route slug");
assert.equal(built.index, 7);
assert.equal(category.slug, seed.subcategories[0].slug, "Formatting must not change the category route slug");
assert.equal(category.families.length, names.length);
for (const [index, [slug, expectedName]] of names.entries()) {
  const family = category.families[index];
  assert.equal(family.slug, slug, `${slug}: preserve the route slug`);
  assert.equal(family.id, slug, `${slug}: preserve the identifier`);
  assert.equal(family.name, expectedName, `${slug}: scientific units and case`);
  assert.equal(family.title, expectedName, `${slug}: visible title`);
  assert.equal(family.seoTitle, `${expectedName} | TEST-ONLY formats | BioAxis`);
}

assert.equal(built.categories, built.subcategories, "Keep the legacy category alias");
assert.equal(category.productFamilies, category.families, "Keep the legacy family alias");
assert.deepEqual(Array.from(category.relatedCategories, ({ href }) => href), ["/products/test-only-segment/test-only-empty"]);
assert.deepEqual(Array.from(category.relatedSubcategories), ["test-only-empty"]);
assert.deepEqual(Array.from(category.families[0].relatedFamilies), names.slice(1, 5).map(([slug]) => slug), "Related families exclude self, retain order, and stop at four");
assert.equal(built.subcategories[1].families.length, 0, "An empty category must not fabricate a family");
assert.deepEqual(seed, originalSeed, "Building must not mutate the input seed");
assert.equal(JSON.stringify(buildSegment(7, seed)), JSON.stringify(built), "Repeated builds must be deterministic");

const empty = buildSegment(1, { ...seed, subcategories: [] });
assert.equal(empty.subcategories.length, 0, "An empty segment must not fabricate a category");
assert.equal(empty.productFamilies.length, 0);

console.log(`Taxonomy builder regression passed (${names.length} scientific-name cases, route slugs, aliases, related links, empty seeds, and immutable deterministic input; offline).`);

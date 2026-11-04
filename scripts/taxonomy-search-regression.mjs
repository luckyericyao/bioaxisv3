import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const dataDirectory = path.resolve("src/data");
const modules = new Map();
const originalFetch = globalThis.fetch;

// Evaluate real local TypeScript in a private cache, without installing require hooks.
// An unexpected package or non-data dependency fails before it can load or do I/O.
function loadDataModule(filename) {
  const resolved = path.resolve(filename);
  assert.ok(resolved.startsWith(`${dataDirectory}${path.sep}`) && resolved.endsWith(".ts"));
  if (modules.has(resolved)) return modules.get(resolved).exports;
  const localModule = { exports: {} };
  modules.set(resolved, localModule);
  const compiled = ts.transpileModule(readFileSync(resolved, "utf8"), {
    fileName: resolved,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const localRequire = (request) => {
    assert.ok(request.startsWith("./") || request.startsWith("../"), `Unexpected data dependency: ${request}`);
    return loadDataModule(path.resolve(path.dirname(resolved), `${request}.ts`));
  };
  new Function("exports", "module", "require", compiled)(localModule.exports, localModule, localRequire);
  return localModule.exports;
}

function segment(slug, overrides = {}) {
  return {
    slug,
    name: "TEST-ONLY segment",
    headline: "",
    shortDescription: "",
    productFamilies: [],
    buyerUseCases: [],
    buyerSpecs: [],
    applications: [],
    formats: [],
    subcategories: [],
    ...overrides
  };
}

function category(slug, overrides = {}) {
  return {
    slug,
    name: "TEST-ONLY category",
    shortDescription: "",
    longDescription: "",
    buyerSpecs: [],
    commonFormats: [],
    applications: [],
    documentationNeeds: [],
    families: [],
    ...overrides
  };
}

function family(slug, overrides = {}) {
  return {
    slug,
    name: "TEST-ONLY family",
    shortDescription: "",
    longDescription: "",
    buyerSpecs: [],
    commonFormats: [],
    applications: [],
    documentationNeeds: [],
    equivalentMatchingInputs: [],
    ...overrides
  };
}

function freezeDeep(value) {
  Object.freeze(value);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") freezeDeep(child);
  }
  return value;
}

globalThis.fetch = () => { throw new Error("Taxonomy search regression must remain offline"); };
try {
  const { productTaxonomy, getProductSearchResults } = loadDataModule(path.join(dataDirectory, "productTaxonomy.ts"));
  const originalTaxonomy = [...productTaxonomy];
  let checkedScenarios = 0;

  // TEST-ONLY in-memory records: no production catalog or supplier facts are added.
  function withFixtures(fixtures, check) {
    const snapshot = JSON.stringify(fixtures);
    fixtures.forEach(freezeDeep);
    productTaxonomy.splice(0, productTaxonomy.length, ...fixtures);
    try {
      check(getProductSearchResults);
      assert.equal(JSON.stringify(fixtures), snapshot, "Search must not mutate taxonomy inputs");
      checkedScenarios += 1;
    } finally {
      productTaxonomy.splice(0, productTaxonomy.length, ...originalTaxonomy);
    }
  }

  withFixtures([
    segment("substring", { name: "TEST-ONLYneedlex" }),
    segment("boundary", { name: "TEST-ONLY needle" }),
    segment("prefix", { name: "Needle TEST-ONLY" }),
    segment("exact", { name: "Needle" })
  ], (search) => {
    const results = search("needle");
    assert.deepEqual(results.map((item) => item.segmentSlug), ["exact", "prefix", "boundary", "substring"],
      "Exact titles must precede prefix, word-boundary, and substring matches");
    assert.deepEqual(search(" \tNeEdLe\n"), results, "Trim and case normalization must preserve order and content");
    for (const query of ["", " \n\t", "no-test-only-match"]) assert.deepEqual(search(query), []);
    for (const result of results) {
      assert.equal(Object.hasOwn(result, "score"), false, "Internal scores must not enter public results");
      assert.equal(Object.hasOwn(result, "order"), false, "Internal traversal positions must not enter public results");
    }
  });

  withFixtures([
    segment("specification", { buyerSpecs: ["needle"] }),
    segment("description", { shortDescription: "needle" }),
    segment("family-list", { productFamilies: ["needle"] }),
    segment("needle"),
    segment("title", { name: "Needle" })
  ], (search) => {
    assert.deepEqual(search("needle").map((item) => item.segmentSlug),
      ["title", "needle", "family-list", "description", "specification"],
      "Direct segment titles and slugs must outrank family lists, descriptions, and specifications");
  });

  withFixtures([
    segment("spec-parent", { subcategories: [category("specification", { buyerSpecs: ["needle"] })] }),
    segment("description-parent", { subcategories: [category("description", { shortDescription: "needle" })] }),
    segment("path-parent", { name: "Needle", subcategories: [category("inherited-path")] }),
    segment("slug-parent", { subcategories: [category("needle")] }),
    segment("title-parent", { subcategories: [category("title", { name: "Needle" })] })
  ], (search) => {
    const results = search("needle").filter((item) => item.type === "subcategory");
    assert.deepEqual(results.map((item) => item.categorySlug), ["title", "needle", "inherited-path", "description", "specification"],
      "Category titles/slugs must outrank inherited paths, descriptions, and specifications");
    const inherited = results.find((item) => item.categorySlug === "inherited-path");
    assert.equal(inherited.href, "/products/path-parent/inherited-path");
    assert.equal(inherited.segmentTitle, "Needle");
    assert.equal(inherited.categoryTitle, "TEST-ONLY category");
    assert.equal(inherited.subcategoryTitle, inherited.categoryTitle, "Legacy category labels must agree");
  });

  const familyCases = [
    ["application", { applications: ["needle"] }],
    ["specification", { buyerSpecs: ["needle"] }],
    ["description", { shortDescription: "needle" }],
    ["inherited-path", {}],
    ["needle", {}],
    ["title", { name: "Needle" }]
  ];
  withFixtures(familyCases.map(([slug, overrides], index) => segment(`family-parent-${index}`, {
    ...(slug === "inherited-path" ? { name: "Needle" } : {}),
    subcategories: [category("test-category", { families: [family(slug, overrides)] })]
  })), (search) => {
    const results = search("needle").filter((item) => item.type === "family");
    assert.deepEqual(results.map((item) => item.familySlug),
      ["title", "needle", "inherited-path", "description", "specification", "application"],
      "Family title/slug/path relevance must outrank descriptive, specification, and application matches");
    const inherited = results.find((item) => item.familySlug === "inherited-path");
    assert.equal(inherited.href, "/products/family-parent-3/test-category/inherited-path");
    assert.equal(inherited.familyTitle, inherited.title);
    assert.equal(inherited.categorySlug, "test-category");
  });

  for (const literal of ["C++", "[probe]", "A.B", "(kit)", "a*b", "x?y", "x|y", "a^b", "a$b", "x{2}", "a\\b", "200 µL"]) {
    withFixtures([segment("literal", { name: `TEST-ONLY ${literal} reference` })], (search) => {
      assert.deepEqual(search(literal).map((item) => item.segmentSlug), ["literal"],
        `${literal}: search punctuation and units must be treated literally`);
    });
  }

  withFixtures(Array.from({ length: 50 }, (_, index) => segment(`tie-${index}`, { name: "Needle" })), (search) => {
    const expected = Array.from({ length: 42 }, (_, index) => `tie-${index}`);
    const first = search("needle");
    assert.equal(first.length, 42, "Broad searches must retain the public 42-result limit");
    assert.deepEqual(first.map((item) => item.segmentSlug), expected, "Tied results must retain taxonomy traversal order");
    first[0].title = "TEST-ONLY caller mutation";
    assert.deepEqual(search("needle").map((item) => item.segmentSlug), expected, "Repeated searches must retain stable ordering");
    assert.equal(search("needle")[0].title, "Needle", "Result objects must not alias taxonomy inputs or retained results");
  });

  assert.deepEqual(productTaxonomy, originalTaxonomy, "Restore the isolated production taxonomy after every fixture");
  assert.ok(getProductSearchResults("cell").length > 0, "The restored real taxonomy must remain searchable");
  console.log(`Taxonomy search regression passed (${checkedScenarios} offline scenarios: relevance tiers, field weights, context paths, normalization, literal punctuation/units, stable top 42, and immutable inputs).`);
} finally {
  globalThis.fetch = originalFetch;
}

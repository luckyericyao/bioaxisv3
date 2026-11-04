import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { noResultSearchFailures } from "./route-smoke-contracts.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const jsxRuntime = require("react/jsx-runtime");
const { renderToStaticMarkup } = require("react-dom/server");
const originalResolveFilename = Module._resolveFilename;
const originalLoad = Module._load;
const originalFetch = globalThis.fetch;
const origin = "https://bioaxis.local";
const failures = [];
let state = [];
let stateCursor = 0;
let effectCursor = 0;
let effects = [];
let pendingEffects = [];
let dirty = false;
let loadMore;
let formProps;

const searchReact = {
  ...React,
  useMemo: (factory) => factory(),
  useState: (initial) => {
    const index = stateCursor++;
    if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
    return [state[index], (update) => {
      const next = typeof update === "function" ? update(state[index]) : update;
      if (!Object.is(next, state[index])) dirty = true;
      state[index] = next;
    }];
  },
  useEffect: (effect, dependencies) => {
    const index = effectCursor++;
    if (!effects[index] || dependencies.some((value, position) => !Object.is(value, effects[index][position]))) {
      effects[index] = dependencies;
      pendingEffects.push(effect);
    }
  }
};

function captureElement(factory) {
  return (type, props, ...rest) => {
    if (props?.["data-search-load-more"] === "true") loadMore = props.onClick;
    return factory(type, props, ...rest);
  };
}

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(process.cwd(), "src", request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};

Module._load = function load(request, parent, isMain) {
  if (request === "react") return searchReact;
  if (request === "react/jsx-runtime") {
    return { ...jsxRuntime, jsx: captureElement(jsxRuntime.jsx), jsxs: captureElement(jsxRuntime.jsxs) };
  }
  if (request === "next/link") {
    return function Link({ href, children, className }) {
      return React.createElement("a", { href, className }, children);
    };
  }
  if (request === "next/navigation") return { useRouter: () => ({ push: () => {} }) };
  if (request === "@/components/forms/CompactSourcingIntake") return { CompactSourcingIntake: () => null };
  if (request === "@/components/forms/QuoteRequestForm") {
    return { QuoteRequestForm: (props) => { formProps = props; return null; } };
  }
  if (request === "@/lib/trackBioAxisEvent") return { trackBioAxisEvent: () => {} };
  return originalLoad.call(this, request, parent, isMain);
};

for (const extension of [".ts", ".tsx"]) require.extensions[extension] = (module, filename) => {
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;
  module._compile(compiled, filename);
};
globalThis.fetch = () => { throw new Error("Product search regression must remain offline"); };

function decode(value) {
  return value.replace(/&(amp|quot|lt|gt|#x27|#39);/g, (entity) => ({
    "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#x27;": "'", "&#39;": "'"
  })[entity]);
}

function textContent(html) {
  return decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function elementAt(html, index, tag) {
  let depth = 0;
  let opening;
  for (const match of html.slice(index).matchAll(new RegExp(`</?${tag}\\b[^>]*>`, "g"))) {
    const token = match[0];
    if (!opening) opening = token;
    depth += token.startsWith("</") ? -1 : 1;
    if (depth === 0) {
      return { index, opening, html: html.slice(index, index + match.index + token.length), body: html.slice(index + opening.length, index + match.index) };
    }
  }
  assert.fail(`Unclosed ${tag} at ${index}`);
}

function elements(html, tag, attribute = "") {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*${attribute}[^>]*>`, "g"))]
    .map((match) => elementAt(html, match.index, tag));
}

function one(html, tag, attribute) {
  const found = elements(html, tag, attribute);
  assert.equal(found.length, 1, `Expected one ${attribute}`);
  return found[0];
}

function links(html) {
  return elements(html, "a").map((item) => ({
    ...item,
    url: new URL(decode(item.opening.match(/\bhref="([^"]*)"/)[1]), origin),
    label: textContent(item.body)
  }));
}

try {

const { getProductSearchIndexSize, getProductSearchResults, isCatalogReferenceQuery } = require("../src/data/productSearch.ts");
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
if (cellResults[0]?.matchTier !== "title") {
  failures.push(`cell: expected a full title match classification, got ${cellResults[0]?.matchTier ?? "no classification"}`);
}
if (cellResults.length > 60) {
  failures.push(`cell: focused short-query results remain too broad (${cellResults.length})`);
}
if (cellResults.slice(0, 6).some((result) => result.segmentSlug === "liquid-handling")) {
  failures.push("cell: Liquid Handling appears in the top six ahead of direct cell-culture matches");
}
for (const expected of ["Tissue Culture Flasks", "Cell Culture Dishes", "Multiwell Cell Culture Plates"]) {
  if (!cellResults.slice(0, 6).some((result) => result.title === expected)) {
    failures.push(`cell: ${expected} is missing from the first six direct results`);
  }
}

const plateResults = getProductSearchResults("96-well PCR plates");
if (plateResults[0]?.title !== "96-Well PCR Plates" || plateResults[0]?.matchTier !== "title") {
  failures.push(`96-well PCR plates: expected an exact title match first, got ${plateResults[0]?.title ?? "no results"} (${plateResults[0]?.matchTier ?? "unclassified"})`);
}
const pcrTubes = plateResults.find((result) => result.title === "PCR Tubes");
if (pcrTubes && ["title", "path"].includes(pcrTubes.matchTier ?? "")) {
  failures.push("96-well PCR plates: PCR Tubes is incorrectly classified as a full title or path match");
}

if (getProductSearchResults("430641").length !== 0) {
  failures.push("430641: unknown catalog reference must not be presented as a taxonomy match");
}
for (const query of ["AB-430641", "D8537", "0000-1234"]) {
  if (!isCatalogReferenceQuery(query)) {
    failures.push(`${query}: expected identifier-shaped input to be treated as a catalog reference`);
  }
  if (getProductSearchResults(query).length !== 0) {
    failures.push(`${query}: unverified catalog reference must not fall through to broad taxonomy search`);
  }
}
for (const query of ["cell", "96-well PCR plates", "PES 0.22 µm syringe filters", "filtered 200 µL tips"]) {
  if (isCatalogReferenceQuery(query)) {
    failures.push(`${query}: product/specification query was incorrectly classified as a catalog reference`);
  }
}

if (getProductSearchIndexSize() !== 429) {
  failures.push(`index size changed unexpectedly: expected 429 sourcing paths, got ${getProductSearchIndexSize()}`);
}

if (failures.length) {
  assert.fail(`Product search regression failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

const { ProductSearch } = require("../src/components/products/ProductSearch.tsx");
const requestRoute = require("../src/app/request-quote/page.tsx");
const { verifiedCatalogReferences } = require("../src/data/catalogReferences.ts");
const { resourceGuides } = require("../src/data/resources.ts");
const { workflows } = require("../src/data/workflows.ts");
const { getFamilyBySlug } = require("../src/data/productTaxonomy.ts");
assert.equal(verifiedCatalogReferences.length, 0, "Production reference registry must remain empty until records have evidence");

// Verify the real server page prepares only the active query's results. The client
// keeps presentation and expansion state without loading the catalog/search index.
const productsRoute = require("../src/app/products/page.tsx");
function findSearchElement(node) {
  if (!React.isValidElement(node)) return undefined;
  if (node.type === ProductSearch) return node;
  return React.Children.toArray(node.props.children).map(findSearchElement).find(Boolean);
}
for (const [params, expectedQuery] of [
  [{}, ""],
  [{ q: "  cell  " }, "cell"],
  [{ q: ["  PCR tubes  ", "ignored"] }, "PCR tubes"],
  [{ q: "430641" }, "430641"]
]) {
  const tree = await productsRoute.default({ searchParams: Promise.resolve(params) });
  const search = findSearchElement(tree);
  assert.ok(search, "Products page must render the interactive search");
  assert.equal(search.props.initialQuery, expectedQuery, "Server search must preserve q normalization");
  assert.deepEqual(search.props.results, getProductSearchResults(expectedQuery), "Server-prepared results must preserve search ranking and context");
  assert.equal(search.props.indexedPathCount, getProductSearchIndexSize());
  assert.equal(search.props.referenceQuery, isCatalogReferenceQuery(expectedQuery));
  assert.deepEqual(Object.keys(search.props).sort(), ["indexedPathCount", "initialQuery", "referenceQuery", "results"], "Only query-scoped search data may cross the client boundary");
}

function renderSearch(query, reset = true) {
  if (reset) {
    state = [];
    effects = [];
  }
  let html;
  let passes = 0;
  do {
    assert.ok(passes++ < 5, "Search effect/state rendering must settle");
    stateCursor = 0;
    effectCursor = 0;
    pendingEffects = [];
    loadMore = undefined;
    dirty = false;
    html = renderToStaticMarkup(React.createElement(ProductSearch, {
      initialQuery: query,
      results: getProductSearchResults(query),
      indexedPathCount: getProductSearchIndexSize(),
      referenceQuery: isCatalogReferenceQuery(query)
    }));
    pendingEffects.forEach((effect) => effect());
  } while (dirty);
  return html;
}

const cards = (html) => elements(html, "article", 'data-search-result-card="true"');
const matchLabels = {
  taxonomy: "Taxonomy match",
  "sourcing-template": "Sourcing template",
  "catalog-reference": "Verified catalog reference",
  content: "Sourcing content"
};
const seenKinds = new Set();
let checkedRequests = 0;

async function checkCard(card, result, query) {
  assert.ok(card.opening.includes(`data-search-match-kind="${result.matchKind}"`), `${result.title}: card match kind`);
  const label = one(card.html, "span", 'data-search-match-label="true"');
  assert.equal(textContent(label.body), matchLabels[result.matchKind], `${result.title}: match label`);
  assert.doesNotMatch(label.opening, /\b(?:hidden|sr-only)\b/, "Core match label must remain visible on mobile");
  const description = one(card.html, "p", 'data-search-match-description="true"');
  assert.doesNotMatch(description.opening, /\b(?:hidden|sr-only)\b/, "Match explanation must remain visible on mobile");
  const explanation = textContent(description.body);
  assert.ok(explanation.length > 30, `${result.title}: explain the match kind`);
  if (result.matchKind === "sourcing-template") {
    assert.match(explanation, /configuration for review/i);
    assert.match(explanation, /supplier SKU.*availability.*confirmation/i);
    assert.doesNotMatch(explanation, /verified|in stock|certified/i);
  } else if (result.matchKind === "taxonomy") {
    assert.match(explanation, /segment.*category.*family/i);
  } else if (result.matchKind === "catalog-reference") {
    assert.ok(explanation.includes(result.catalogReference), "Verified reference must display the actual registry identifier");
    assert.match(explanation, /document|buyer-provided record/i);
    assert.match(explanation, /availability needs confirmation/i);
  } else {
    assert.match(explanation, /workflow or guide content/i);
  }
  seenKinds.add(result.matchKind);
  const cardLinks = links(card.html);
  const details = cardLinks.find((link) => link.label === "View details");
  assert.ok(details, `${result.title}: details link missing`);
  const contentResult = result.type === "workflow" || result.type === "resource";
  assert.equal(details.url.pathname, new URL(result.href, origin).pathname);
  assert.equal(details.url.searchParams.get("q"), contentResult ? null : query, "Details must retain the original search query");
  assert.equal(details.url.hash, contentResult ? new URL(result.href, origin).hash : "");
  const requests = cardLinks.filter((link) => link.url.pathname === "/request-quote");
  assert.deepEqual(requests.map((link) => link.url.searchParams.get("requestType")).sort(), ["equivalent", "quote"]);
  for (const { url } of requests) {
    const params = url.searchParams;
    assert.equal(params.get("type"), params.get("requestType") === "quote" ? "rfq" : "equivalent");
    assert.equal(params.get("query"), query, "Card RFQ query must remain intact");
    assert.equal(params.get("segment"), result.segmentSlug ?? null);
    assert.equal(params.get("category"), result.categorySlug ?? null);
    assert.equal(params.get("subcategory"), result.categorySlug ?? null, "Legacy category alias must remain");
    assert.equal(params.get("family"), result.familySlug ?? null);
    assert.equal(params.get("product"), result.productSlug ?? null);
    const expectedSource = result.segmentSlug ? `/products?q=${encodeURIComponent(query)}` : result.href;
    assert.equal(params.get("sourcePage"), expectedSource, "Card RFQ must retain search source or content source");
    formProps = undefined;
    renderToStaticMarkup(await requestRoute.default({ searchParams: Promise.resolve(Object.fromEntries(params)) }));
    assert.ok(formProps?.initialValues.productList.includes(query), "Search input must reach the real RFQ form prefill");
    assert.equal(formProps.initialValues.requestType, params.get("requestType"));
    assert.equal(formProps.productContext?.sourcePageUrl, expectedSource);
    const family = result.familySlug && getFamilyBySlug(result.segmentSlug, result.categorySlug, result.familySlug);
    if (family) {
      assert.equal(formProps.productContext.productSegment, family.segment.name);
      assert.equal(formProps.productContext.productCategory, family.subcategory.name);
      assert.equal(formProps.productContext.productFamily, family.family.name);
      assert.equal(formProps.productContext.productName, result.productTitle ?? family.family.name);
    }
    checkedRequests += 1;
  }
}

// Exercise the real load-more callback through state updates, keeping the first six fixed.
let cellHtml = renderSearch("cell");
let strongest = one(cellHtml, "div", 'data-search-strongest-matches="true"');
assert.equal(cards(strongest.html).length, 6, "Default strongest group must contain exactly six results");
assert.deepEqual(cards(strongest.html).map((card) => textContent(one(card.html, "h3", "").body)), cellResults.slice(0, 6).map((result) => result.title));
let related = one(cellHtml, "details", 'data-search-related-matches="true"');
assert.doesNotMatch(related.opening, /\sopen(?:[\s=>])/, "Related results must be collapsed by default");
assert.equal(cards(related.html).length, 12, "Opening related results must initially expose the next twelve");
assert.equal(cards(cellHtml).length, 18);
assert.equal(typeof loadMore, "function", "Load-more button must retain its callback");
loadMore();
cellHtml = renderSearch("cell", false);
assert.equal(cards(cellHtml).length, Math.min(30, cellResults.length), "Load-more must add twelve results");
assert.equal(cards(one(cellHtml, "div", 'data-search-strongest-matches="true"').html).length, 6);
while (loadMore) {
  loadMore();
  cellHtml = renderSearch("cell", false);
}
assert.equal(cards(cellHtml).length, cellResults.length, "Every result must remain reachable by expansion");
assert.equal(elements(cellHtml, "button", 'data-search-load-more="true"').length, 0, "Remove load-more after the final result");
const nextQueryResults = getProductSearchResults("PCR tubes");
assert.ok(nextQueryResults.length > 18, "Reset coverage needs a new query with more than eighteen results");
assert.equal(cards(renderSearch("PCR tubes", false)).length, 18, "A new query must reset the expanded result limit");

for (const query of ["cell", "filtered 200 µL tips + / & #?", workflows[0].title, resourceGuides[0].title]) {
  const results = getProductSearchResults(query);
  assert.ok(results.length > 0, `${query}: expected results for UI coverage`);
  for (const result of results) {
    const expectedKind = result.type === "product" ? "sourcing-template"
      : result.type === "workflow" || result.type === "resource" ? "content" : "taxonomy";
    assert.equal(result.matchKind, expectedKind, `${result.title}: production classification`);
  }
  let html = renderSearch(query);
  while (loadMore) {
    loadMore();
    html = renderSearch(query, false);
  }
  const renderedCards = cards(html);
  assert.equal(renderedCards.length, results.length);
  for (let index = 0; index < results.length; index += 1) await checkCard(renderedCards[index], results[index], query);
}

for (const query of ["430641", "AB-430641", "D8537", "0000-1234", "zzzxqnotfound9999"]) {
  assert.equal(isCatalogReferenceQuery(query), true);
  const html = renderSearch(query);
  assert.deepEqual(noResultSearchFailures(html, "Send this reference", query, origin), []);
  assert.equal(cards(html).length, 0, "Unresolved references must never fabricate a product result");
  assert.match(textContent(html), /Reference not verified/);
  const unresolved = one(html, "section", 'data-search-unresolved-reference="true"');
  assert.match(textContent(unresolved.html), /Unresolved reference/);
  const actions = links(unresolved.html);
  assert.equal(actions.length, 1, "Unresolved reference must retain one primary action");
  assert.equal(actions[0].label, "Send this reference");
  const params = actions[0].url.searchParams;
  assert.equal(actions[0].url.pathname, "/request-quote");
  assert.equal(params.get("query"), query);
  assert.equal(params.get("q"), query);
  assert.equal(params.get("type"), "product-list");
  assert.equal(params.get("requestType"), "product-list-review");
  formProps = undefined;
  renderToStaticMarkup(await requestRoute.default({ searchParams: Promise.resolve(Object.fromEntries(params)) }));
  assert.equal(formProps.initialValues.requestType, "product-list-review");
  assert.ok(formProps.initialValues.productList.includes(query), "Unresolved identifier must reach the RFQ form");
  assert.equal(formProps.productContext.productName, query);
  checkedRequests += 1;
}
for (const query of ["zzzxqnotfound", "zzzxqnotfound999", "zzzxqnotfound999 + / #?"]) {
  assert.equal(isCatalogReferenceQuery(query), false, "Ordinary no-result input must not claim to be a catalog reference");
  const html = renderSearch(query);
  assert.equal(cards(html).length, 0);
  assert.match(textContent(html), /No direct product path match/);
  assert.match(textContent(html), /No product or sourcing path matches this input/);
  assert.doesNotMatch(textContent(html), /Reference not verified|No verified catalog-reference record|Unresolved reference/);
  assert.equal(elements(html, "section", 'data-search-unresolved-reference="true"').length, 0);
  assert.deepEqual(noResultSearchFailures(html, "Send sourcing input", query, origin), []);
  const action = links(html).find((link) => link.url.pathname === "/request-quote");
  formProps = undefined;
  renderToStaticMarkup(await requestRoute.default({ searchParams: Promise.resolve(Object.fromEntries(action.url.searchParams)) }));
  assert.equal(formProps.initialValues.requestType, "product-list-review");
  assert.ok(formProps.initialValues.productList.includes(query), "Ordinary no-result query must reach the RFQ form");
  assert.equal(formProps.productContext.productName, query);
  checkedRequests += 1;

  assert.ok(noResultSearchFailures(html, "Send this reference", query, origin).length > 0, "Smoke must reject the wrong action label");
  assert.ok(noResultSearchFailures(html + action.html, "Send sourcing input", query, origin).length > 0, "Smoke must reject duplicate sourcing actions");
  assert.ok(noResultSearchFailures(html, "Send sourcing input", `${query}-lost`, origin).length > 0, "Smoke must reject lost query context");
}

// TEST-ONLY in-memory record: exercise verified-reference behavior without inventing
// supplier evidence or adding any record to the production registry on disk.
const specific = getProductSearchResults("filtered 200 µL tips").find((result) => result.type === "product");
const fixture = {
  ...specific,
  reference: "TEST-ONLY-904613",
  title: "TEST-ONLY reference rendering fixture",
  description: "TEST-ONLY in-memory branch coverage; not a real supplier or verified catalog record."
};
const originalReferences = [...verifiedCatalogReferences];
try {
  verifiedCatalogReferences.push(fixture);
  for (const query of ["TEST-ONLY-904613", "testonly904613", " test only 904613 "]) {
    const results = getProductSearchResults(query);
    assert.equal(results.length, 1, "Exact normalized reference must not fall through to keyword search");
    const result = results[0];
    assert.equal(result.matchKind, "catalog-reference");
    assert.equal(result.catalogReference, fixture.reference);
    assert.equal(result.queryCoverage, 1);
    assert.deepEqual(result.matchedFields, ["catalog reference"]);
    assert.equal(result.matchTier, undefined, "Verified reference must not claim a taxonomy keyword tier");
    const activeQuery = query.trim();
    const html = renderSearch(query);
    assert.equal(cards(html).length, 1);
    assert.doesNotMatch(textContent(html), /Reference not verified|Unresolved reference/);
    await checkCard(cards(html)[0], result, activeQuery);
  }
  assert.equal(getProductSearchResults("TEST-ONLY-904614").length, 0, "Near reference matches must remain unresolved");
  assert.equal(getProductSearchResults("TEST-ONLY").some((result) => result.matchKind === "catalog-reference"), false, "Partial identifiers must not claim verification");
} finally {
  verifiedCatalogReferences.splice(0, verifiedCatalogReferences.length, ...originalReferences);
}
assert.equal(verifiedCatalogReferences.length, 0, "TEST-ONLY fixture must be removed");
assert.equal(getProductSearchResults(fixture.reference).length, 0, "Test fixture must not survive as verified search data");
assert.equal(getProductSearchIndexSize(), 429, "Fixture must not change the production index");
assert.deepEqual([...seenKinds].sort(), Object.keys(matchLabels).sort(), "Cover every result match kind");

console.log(`Product search regression passed (${cases.length} ranking queries; four match kinds; ${checkedRequests} RFQ prefills; ${getProductSearchIndexSize()} indexed paths).`);
console.log("Offline SSR checked visible match explanations, strongest 6, collapsed related results, load-more +12, query reset, reference/ordinary no-result smoke contracts, and TEST-ONLY verified-reference normalization.");
console.log(`cell first six: ${cellResults.slice(0, 6).map((result) => result.title).join(" | ")}`);
} finally {
  Module._resolveFilename = originalResolveFilename;
  Module._load = originalLoad;
  globalThis.fetch = originalFetch;
}

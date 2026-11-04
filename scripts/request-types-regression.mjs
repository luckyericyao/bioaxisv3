import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalLoad = Module._load;
const originalTsExtension = require.extensions[".ts"];
const originalFetch = globalThis.fetch;
let networkAttempts = 0;

function rejectNetwork() {
  networkAttempts += 1;
  throw new Error("Request-type regression must remain offline");
}

Module._load = function load(request, parent, isMain) {
  if (/^(?:node:)?(?:http|https|http2|net|tls|dgram|dns)$/.test(request) || request === "undici") return rejectNetwork();
  return originalLoad.call(this, request, parent, isMain);
};
require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename
  }).outputText, filename);
};
globalThis.fetch = rejectNetwork;

try {
  const { normalizeRequestType, getRequestTypeById } = require("../src/data/requestTypes.ts");
  const { buildRequestHref, buildEquivalentFinderHref } = require("../src/data/productTaxonomy.ts");

  // Explicit historical inputs protect links shared before the current form UI.
  const aliases = [
    [undefined, "quote"], ["", "quote"], [" \t\n", "quote"], ["not-a-request", "quote"],
    ["rfq", "quote"], ["quote-request", "quote"], ["request-quote", "quote"],
    ["recurring", "recurring-supply"], ["repeat", "recurring-supply"], ["monthly", "recurring-supply"],
    ["product-list", "product-list-review"], ["product list", "product-list-review"],
    ["product list review", "product-list-review"], ["product-list-request", "product-list-review"], ["list", "product-list-review"],
    ["private-label-oem", "private-label"], ["oem", "private-label"], ["oem-style", "private-label"],
    ["equivalent-finding", "equivalent"], ["equivalent-review", "equivalent"], ["alternative", "equivalent"],
    ["docs", "documentation"], ["document", "documentation"], ["documents", "documentation"],
    ["documentation-request", "documentation"], ["sample-request", "sample"],
    ["general", "contact"], ["general-question", "contact"], ["general-sourcing-question", "contact"], ["support", "contact"],
    ["  ReCuRrInG   SuPpLy  ", "recurring-supply"], ["PRODUCT_LIST_REVIEW", "product-list-review"],
    ["PRIVATE_LABEL", "private-label"], ["sample_request", "sample"], ["GENERAL\tSOURCING\nQUESTION", "contact"]
  ];
  for (const [input, expected] of aliases) {
    assert.equal(normalizeRequestType(input), expected, `Normalize ${JSON.stringify(input)}`);
    assert.equal(getRequestTypeById(input).id, expected, `Resolve ${JSON.stringify(input)}`);
  }
  for (const id of ["quote", "product-list-review", "equivalent", "sample", "documentation", "recurring-supply", "private-label", "contact"]) {
    assert.equal(normalizeRequestType(id), id, `${id}: canonical ID is stable`);
    assert.equal(getRequestTypeById(id).id, id, `${id}: resolve canonical ID`);
    assert.equal(normalizeRequestType(normalizeRequestType(id)), id, `${id}: normalization is idempotent`);
  }

  assert.equal(buildRequestHref({}), "/request-quote?type=rfq&requestType=quote");
  assert.equal(buildEquivalentFinderHref({}), "/equivalent-finder?requestType=equivalent");

  // Compare decoded entries instead of incidental URLSearchParams ordering.
  let hrefCases = 0;
  function checkHref(builder, input, expectedPath, expected) {
    const snapshot = { ...input };
    const href = builder(Object.freeze(input));
    const url = new URL(href, "https://test.invalid");
    assert.equal(url.origin, "https://test.invalid", "Builders must return local links");
    assert.equal(url.pathname, expectedPath);
    assert.equal(url.hash, "", "User input must never escape into a URL fragment");
    assert.deepEqual(Object.fromEntries(url.searchParams), expected, `Query/context for ${JSON.stringify(input)}`);
    assert.equal([...url.searchParams.keys()].length, Object.keys(expected).length, "No duplicate query keys");
    assert.deepEqual(input, snapshot, "Building a link must not mutate its context");
    hrefCases += 1;
  }

  for (const [requestType, type] of [
    ["quote", "rfq"], ["product-list-review", "product-list"], ["equivalent", "equivalent"],
    ["sample", "sample"], ["documentation", "documentation"], ["recurring-supply", "recurring-supply"],
    ["private-label", "private-label"], ["contact", "contact"], ["test-only-custom", "test-only-custom"]
  ]) {
    checkHref(buildRequestHref, { requestType }, "/request-quote", { type, requestType });
  }
  checkHref(buildRequestHref, { inquiryType: "sample" }, "/request-quote", { type: "sample", requestType: "sample" });
  checkHref(buildRequestHref, { inquiryType: "sample", requestType: "documentation" }, "/request-quote", {
    type: "documentation", requestType: "documentation"
  });
  checkHref(buildRequestHref, { requestType: "", inquiryType: "sample" }, "/request-quote", { type: "", requestType: "" });

  const contextCases = [
    [{ segment: "liquid-handling" }, { source: "product-page", segment: "liquid-handling", sourcePage: "/products/liquid-handling" }],
    [{ category: "pipette-tips" }, {
      source: "product-page", category: "pipette-tips", subcategory: "pipette-tips", sourcePage: "/products/pipette-tips"
    }],
    [{ segment: "liquid-handling", category: "legacy", subcategory: "pipette-tips" }, {
      source: "product-page", segment: "liquid-handling", category: "pipette-tips", subcategory: "pipette-tips",
      sourcePage: "/products/liquid-handling/pipette-tips"
    }],
    [{ segment: "liquid-handling", category: "legacy", subcategory: "" }, {
      source: "product-page", segment: "liquid-handling", sourcePage: "/products/liquid-handling"
    }],
    [{ family: "filtered-pipette-tips" }, {
      source: "product-page", family: "filtered-pipette-tips", sourcePage: "/products/filtered-pipette-tips"
    }],
    [{ product: "test-only-product" }, { source: "product-page", product: "test-only-product", sourcePage: "/products/test-only-product" }],
    [{ segment: "liquid-handling", category: "pipette-tips", family: "filtered-pipette-tips", product: "test-only-product" }, {
      source: "product-page", segment: "liquid-handling", category: "pipette-tips", subcategory: "pipette-tips",
      family: "filtered-pipette-tips", product: "test-only-product",
      sourcePage: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/test-only-product"
    }],
    [{ segment: "liquid-handling", sourcePage: "/products?q=tips&view=all#results" }, {
      source: "product-page", segment: "liquid-handling", sourcePage: "/products?q=tips&view=all#results"
    }],
    [{ segment: "liquid-handling", sourcePage: "" }, { source: "product-page", segment: "liquid-handling" }],
    [{ sourcePage: "/support?path=test-only", query: "200 µL + 0.22 µm & #? / 中文 = 100%" }, {
      sourcePage: "/support?path=test-only", query: "200 µL + 0.22 µm & #? / 中文 = 100%"
    }],
    [{ segment: "", category: "", family: "", product: "", sourcePage: "", query: "" }, {}],
    [{ segment: undefined, category: undefined, subcategory: undefined, query: undefined }, {}]
  ];
  for (const [input, expected] of contextCases) {
    checkHref(buildRequestHref, { ...input }, "/request-quote", { type: "rfq", requestType: "quote", ...expected });
    checkHref(buildEquivalentFinderHref, { ...input }, "/equivalent-finder", { requestType: "equivalent", ...expected });
  }

  // Reserved characters in each value must survive one URL round trip without
  // creating extra parameters, changing the destination, or dropping RFQ text.
  const encodedContext = {
    segment: "test-only &segment=other", category: "test-only/+category?", family: "test-only#family%20",
    product: "test-only=product 中文 µL", sourcePage: "/products?q=µL + tips&ref=100%#x",
    query: "  µL + µm & #? / 中文 = %20\nsecond line  "
  };
  const encodedExpected = {
    source: "product-page", segment: encodedContext.segment, category: encodedContext.category,
    subcategory: encodedContext.category, family: encodedContext.family, product: encodedContext.product,
    sourcePage: encodedContext.sourcePage, query: encodedContext.query
  };
  checkHref(buildRequestHref, { ...encodedContext }, "/request-quote", { type: "rfq", requestType: "quote", ...encodedExpected });
  checkHref(buildEquivalentFinderHref, { ...encodedContext }, "/equivalent-finder", { requestType: "equivalent", ...encodedExpected });
  checkHref(buildRequestHref, { requestType: "test-only&requestType=quote+#?" }, "/request-quote", {
    type: "test-only&requestType=quote+#?", requestType: "test-only&requestType=quote+#?"
  });

  assert.equal(networkAttempts, 0, "Pure request helpers must not attempt network I/O");
  console.log(`Request-type regression passed (${aliases.length} alias/fallback cases; 8 canonical IDs; ${hrefCases} RFQ/equivalent link cases; offline).`);
} finally {
  Module._load = originalLoad;
  if (originalTsExtension) require.extensions[".ts"] = originalTsExtension;
  else delete require.extensions[".ts"];
  globalThis.fetch = originalFetch;
}

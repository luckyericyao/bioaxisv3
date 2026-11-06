import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const originalResolveFilename = Module._resolveFilename;
const originalLoad = Module._load;
const originalFetch = globalThis.fetch;
const origin = "https://bioaxis.local";
let currentUrl = new URL("/", origin);
let formProps;

// Load the actual routes/components without a Next server, browser, or network.
Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  const resolved = request.startsWith("@/") ? path.resolve("src", request.slice(2)) : request;
  return originalResolveFilename.call(this, resolved, parent, isMain, options);
};
Module._load = function load(request, parent, isMain) {
  if (request === "next/link") {
    return function Link({ href, children, className }) {
      return React.createElement("a", { href, className }, children);
    };
  }
  if (request === "next/navigation") {
    return {
      usePathname: () => currentUrl.pathname,
      useSearchParams: () => currentUrl.searchParams,
      notFound: () => { throw new Error(`Unexpected missing route ${currentUrl.pathname}`); }
    };
  }
  if (request === "@/components/sourcing/AddToSourcingListButton") {
    return { AddToSourcingListButton: () => null };
  }
  if (request === "@/components/forms/QuoteRequestForm") {
    return { QuoteRequestForm: (props) => { formProps = props; return null; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
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
}
globalThis.fetch = () => { throw new Error("Category regression must remain offline"); };

function decode(value) {
  return value.replace(/&(amp|quot|lt|gt|#x27);/g, (entity) => ({
    "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#x27;": "'"
  })[entity]);
}

function textContent(html) {
  return decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

// Match balanced containers, including the nested sections/details in real SSR output.
function elementAt(html, index, tag) {
  let depth = 0;
  let opening;
  for (const match of html.slice(index).matchAll(new RegExp(`</?${tag}\\b[^>]*>`, "g"))) {
    const token = match[0];
    if (!opening) opening = token;
    depth += token.startsWith("</") ? -1 : 1;
    if (depth === 0) {
      const end = index + match.index + token.length;
      return { index, opening, html: html.slice(index, end), body: html.slice(index + opening.length, index + match.index) };
    }
  }
  assert.fail(`Unclosed ${tag} at ${index}`);
}

function elements(html, tag, attribute = "") {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*${attribute}[^>]*>`, "g"))]
    .map((match) => elementAt(html, match.index, tag));
}

function one(html, tag, attribute) {
  const matches = elements(html, tag, attribute);
  assert.equal(matches.length, 1, `${currentUrl.pathname}: expected one ${attribute}`);
  return matches[0];
}

function disclosure(html, title) {
  const matches = elements(html, "details").filter((item) =>
    textContent(elements(item.body, "summary")[0]?.body ?? "").replace(/\s*\+$/, "") === title
  );
  assert.equal(matches.length, 1, `${currentUrl.pathname}: missing disclosure ${title}`);
  assert.doesNotMatch(matches[0].opening, /\sopen(?:[\s=>])/, `${title} must start collapsed`);
  return matches[0];
}

function links(html) {
  return elements(html, "a").map((item) => ({
    ...item,
    url: new URL(decode(item.opening.match(/\bhref="([^"]*)"/)[1]), origin),
    label: textContent(item.body)
  }));
}

function checkBreadcrumbs(html, expected) {
  const nav = one(html, "nav", 'aria-label="Breadcrumb"');
  const full = one(nav.html, "ol", 'data-full-breadcrumb="true"');
  const items = elements(full.body, "li");
  assert.deepEqual(items.map((item) => textContent(item.body).replace(/\s*\/$/, "")), expected.map(([label]) => label));
  assert.deepEqual(links(full.body).map((link) => link.url.pathname), expected.slice(0, -1).map(([, href]) => href));
  assert.equal(links(nav.body)[0].url.pathname, expected.at(-2)[1], "Mobile breadcrumb returns to the immediate parent");
  assert.equal(links(items.at(-1).html).length, 0, "Current breadcrumb must remain unlinked");
}

const query = "filtered 200 µL + PES 0.22 μm / tips & filters #?";
const scenarios = [
  { search: "", query: null },
  { search: `?q=${encodeURIComponent(query)}`, query },
  { search: `?query=${encodeURIComponent(query)}`, query },
  { search: `?q=older&query=${encodeURIComponent(query)}`, query }
];
let requestCount = 0;
let childFamilyCount = 0;

function labelize(value) {
  return value?.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") ?? "";
}

try {
  const taxonomy = require("../src/data/productTaxonomy.ts");
  const items = require("../src/data/productItems.ts");
  const catalog = require("../src/data/productCatalog.ts");
  const { getPriorityProductContent } = require("../src/data/priorityProductContent.ts");
  const categoryRoute = require("../src/app/products/[segment]/[subcategory]/page.tsx");
  const familyRoute = require("../src/app/products/[segment]/[subcategory]/[family]/page.tsx");
  const productRoute = require("../src/app/products/[segment]/[subcategory]/[family]/[product]/page.tsx");
  const requestRoute = require("../src/app/request-quote/page.tsx");
  const routePath = ({ segment, subcategory, family, product }) =>
    `/products/${[segment, subcategory, family, product].filter(Boolean).join("/")}`;
  const paths = categoryRoute.generateStaticParams();
  const expectedPaths = [...taxonomy.getAllSubcategoryPaths(), ...catalog.getAllCatalogCategoryPaths()].map(routePath);
  assert.deepEqual(paths.map(routePath).sort(), [...new Set(expectedPaths)].sort(), "Every category route must remain generated exactly once");
  const familyPaths = new Set(familyRoute.generateStaticParams().map(routePath));
  const productPaths = new Set(productRoute.generateStaticParams().map(routePath));
  let taxonomyCount = 0;
  let catalogCount = 0;
  let overlappingCount = 0;

  async function checkRequests(html, context, scenario, sourcePath) {
    const requests = links(html).filter((link) => link.url.pathname === "/request-quote");
    assert.ok(requests.length > 0, `${sourcePath}: missing RFQ links`);
    const checked = new Set();
    for (const { url } of requests) {
      if (checked.has(url.href)) continue;
      checked.add(url.href);
      const params = url.searchParams;
      const familySlug = params.get("family");
      const productSlug = params.get("product");
      const family = context.families.find((item) => item.slug === familySlug);
      const products = family ? context.taxonomy
        ? items.getProductItemsForFamily(context.segment.slug, context.category.slug, family.slug)
        : family.products : [];
      const product = products.find((item) => item.slug === productSlug);
      assert.equal(params.get("segment"), context.segment.slug, `${sourcePath}: RFQ segment`);
      assert.equal(params.get("category"), context.category.slug, `${sourcePath}: RFQ category`);
      if (familySlug) assert.ok(family, `${sourcePath}: RFQ family must belong to this category`);
      if (productSlug) assert.ok(product, `${sourcePath}: RFQ product must belong to the selected family`);
      assert.equal(params.get("query"), scenario.query, `${sourcePath}: RFQ query`);
      const productPath = routePath({ ...context.params, family: familySlug, product: productSlug });
      const expectedSource = scenario.query ? `${sourcePath}?q=${encodeURIComponent(scenario.query)}` : productPath;
      assert.equal(params.get("sourcePage"), expectedSource, `${sourcePath}: RFQ sourcePage`);
      if (context.taxonomy) {
        assert.equal(params.get("subcategory"), context.category.slug, "Legacy category alias must remain");
        assert.equal(params.get("source"), "product-page");
        assert.equal(params.get("type"), params.get("requestType") === "quote" ? "rfq" : params.get("requestType"));
      } else if (params.has("need")) {
        assert.equal(params.get("need"), { documentation: "documents", "product-list-review": "product-list" }[params.get("requestType")] ?? params.get("requestType"));
      }
      if (product) {
        assert.ok(productPaths.has(productPath), `${productPath}: RFQ product route missing`);
        if (product.supplier && !/optional|input/i.test(product.supplier)) assert.equal(params.get("supplier"), product.supplier);
        if (product.catalogNumber && !/optional|input/i.test(product.catalogNumber)) assert.equal(params.get("catalog"), product.catalogNumber);
      }

      formProps = undefined;
      renderToStaticMarkup(await requestRoute.default({ searchParams: Promise.resolve(Object.fromEntries(params)) }));
      assert.ok(formProps?.productContext, `${sourcePath}: RFQ form context missing`);
      const actual = formProps.productContext;
      assert.equal(actual.requestType, params.get("requestType"));
      assert.equal(formProps.initialValues.requestType, params.get("requestType"));
      // Category-only catalog requests already use slug labels. Keep that existing
      // form contract while family/product requests resolve their catalog records.
      const taxonomySegment = taxonomy.getSegmentBySlug(context.segment.slug);
      assert.equal(actual.productSegment, taxonomySegment?.name ?? (family ? context.segment.name : labelize(context.segment.slug)));
      assert.equal(actual.productCategory, context.taxonomy || family ? context.category.name : labelize(context.category.slug));
      assert.equal(actual.productFamily, family?.name);
      assert.equal(actual.productName, product?.name ?? family?.name ?? scenario.query ?? "");
      assert.equal(actual.productUrl, productPath);
      assert.equal(actual.sourcePageUrl, expectedSource);
      if (scenario.query) assert.ok(formProps.initialValues.productList.includes(scenario.query), "Search prefill must reach the RFQ form");
      requestCount += 1;
    }
  }

  for (const params of paths) {
    const categoryPath = routePath(params);
    const taxonomyMatch = taxonomy.getSubcategoryBySlug(params.segment, params.subcategory);
    const catalogMatch = catalog.getCategoryBySlug(params.segment, params.subcategory);
    const context = taxonomyMatch
      ? { segment: taxonomyMatch.segment, category: taxonomyMatch.subcategory, families: taxonomyMatch.subcategory.productFamilies, taxonomy: true, params }
      : { ...catalogMatch, families: catalogMatch.category.families, taxonomy: false, params };
    if (taxonomyMatch) taxonomyCount += 1;
    else catalogCount += 1;
    if (taxonomyMatch && catalogMatch) overlappingCount += 1;
    const priorityContent = taxonomyMatch ? getPriorityProductContent(params.segment, params.subcategory) : undefined;
    const expectedTitle = taxonomyMatch ? priorityContent?.metaTitle ?? context.category.seoTitle : `${context.category.name} | ${context.segment.name} | BioAxis`;
    const expectedDescription = taxonomyMatch ? priorityContent?.metaDescription ?? context.category.metaDescription : context.category.description;
    const metadata = await categoryRoute.generateMetadata({ params: Promise.resolve(params) });
    assert.equal(metadata.alternates.canonical, categoryPath, `${categoryPath}: canonical`);
    assert.equal(metadata.openGraph.url, categoryPath, `${categoryPath}: Open Graph URL`);
    assert.equal(metadata.title, expectedTitle, `${categoryPath}: metadata title`);
    assert.equal(metadata.description, expectedDescription, `${categoryPath}: metadata description`);

    for (const scenario of scenarios) {
      currentUrl = new URL(`${categoryPath}${scenario.search}`, origin);
      const html = renderToStaticMarkup(await categoryRoute.default({ params: Promise.resolve(params) }));
      checkBreadcrumbs(html, [
        ["Home", "/"], ["Products", "/products"],
        [context.segment.title ?? context.segment.name, `/products/${params.segment}`],
        [context.category.title ?? context.category.name, categoryPath]
      ]);
      assert.equal(textContent(one(html, "h1", "").body), context.category.title ?? context.category.name, `${categoryPath}: taxonomy must retain precedence over catalog`);
      const decision = one(html, "div", 'data-category-decision-summary="true"');
      if (taxonomyMatch) disclosure(decision.html, "Request sourcing support");
      const actions = links(one(decision.html, "div", 'data-sourcing-primary-actions="true"').body);
      assert.equal(actions.length, 3, `${categoryPath}: exactly one primary and two secondary actions`);
      assert.deepEqual(actions.map((link) => link.url.searchParams.get("requestType")).sort(), ["equivalent", "quote", "sample"]);
      assert.deepEqual(actions.map((link) => link.label).sort(), ["Request quote", "Request sample", "Review equivalent"]);
      for (const action of actions) {
        assert.equal(action.url.pathname, "/request-quote");
        assert.equal(action.url.searchParams.get("requestType"), { "Request quote": "quote", "Request sample": "sample", "Review equivalent": "equivalent" }[action.label], "Each category action must match its label");
        assert.equal(action.url.searchParams.has("family"), false, "Category hero must keep category-level context");
        assert.equal(action.url.searchParams.has("product"), false, "Category hero must not select a product");
        assert.match(action.opening, /\bmin-h-11\b/, "Category action must retain its touch target");
        assert.equal(/\sbg-bioaxis-accent(?:\s|")/.test(action.opening), action.url.searchParams.get("requestType") === "quote", "Quote must be the only filled primary action");
      }
      const families = one(html, "section", 'data-category-families="true"');
      const guidance = one(html, "section", 'data-category-guidance="true"');
      assert.ok(decision.index < families.index && families.index < guidance.index, `${categoryPath}: hero then families then guidance`);
      const disclosures = elements(guidance.html, "details");
      assert.ok(disclosures.length >= 2, `${categoryPath}: category guidance must use disclosures`);
      for (const item of disclosures) assert.doesNotMatch(item.opening, /\sopen(?:[\s=>])/, `${categoryPath}: guidance must start collapsed`);
      if (taxonomyMatch) {
        const overview = disclosure(guidance.html, "Category overview");
        assert.ok(textContent(overview.html).includes(context.category.longDescription.replace(/\s+/g, " ").trim()), `${categoryPath}: full overview must remain available`);
        for (const item of context.category.selectionCriteria.slice(0, 8)) {
          assert.ok(textContent(disclosure(guidance.html, "Buyer decision filters").html).includes(item), `${categoryPath}: buyer filter lost`);
        }
        for (const item of context.category.specifications.slice(0, 10)) {
          assert.ok(textContent(disclosure(guidance.html, "Common specifications").html).includes(item), `${categoryPath}: common specification lost`);
        }
        for (const family of context.families) {
          const familyPath = routePath({ ...params, family: family.slug });
          const card = elements(families.html, "article").find((item) => links(item.html).some((link) => link.url.pathname === familyPath));
          assert.ok(card, `${familyPath}: family card missing`);
          const familyActions = links(disclosure(card.html, "Family sourcing actions").html);
          assert.deepEqual(familyActions.map((link) => link.url.searchParams.get("requestType")).sort(), ["documentation", "equivalent", "quote", "sample"], `${familyPath}: family sourcing actions must remain available`);
          for (const action of familyActions) assert.equal(action.url.searchParams.get("family"), family.slug, `${familyPath}: family sourcing action lost selected family`);
        }
      } else {
        const preview = disclosure(guidance.html, "Product list preview");
        assert.ok(preview.html.includes("Sourcing template preview"), `${categoryPath}: product browser preview must remain reachable in disclosure`);
        const productLinks = links(preview.html).filter((link) => productPaths.has(link.url.pathname));
        assert.ok(productLinks.length > 0, `${categoryPath}: preview product links missing`);
        for (const link of productLinks) assert.equal(link.url.searchParams.get("q"), scenario.query, `${categoryPath}: preview-to-product query lost`);
      }

      const familyLinks = links(families.html).filter((link) => familyPaths.has(link.url.pathname));
      assert.deepEqual([...new Set(familyLinks.map((link) => link.url.pathname))].sort(), context.families.map((family) => routePath({ ...params, family: family.slug })).sort(), `${categoryPath}: every child family must remain reachable`);
      for (const link of familyLinks) assert.equal(link.url.searchParams.get("q"), scenario.query, `${categoryPath}: category-to-family query lost`);
      const parentLinks = links(decision.html).filter((link) => link.url.pathname === `/products/${params.segment}`);
      assert.equal(parentLinks.length, 1, `${categoryPath}: parent segment link lost`);
      await checkRequests(html, context, scenario, categoryPath);
    }
    childFamilyCount += context.families.length;
  }

  for (const missingParams of [
    { segment: "unknown-segment", subcategory: paths[0].subcategory },
    { segment: paths[0].segment, subcategory: "unknown-category" }
  ]) {
    currentUrl = new URL(routePath(missingParams), origin);
    await assert.rejects(categoryRoute.default({ params: Promise.resolve(missingParams) }), /Unexpected missing route/, "Unknown category must remain a 404");
  }
  assert.ok(taxonomyCount > 0 && catalogCount > 0 && overlappingCount > 0, "Cover both implementations and overlapping taxonomy/catalog routes");
  console.log(`Category page regression passed (${paths.length} categories: ${taxonomyCount} taxonomy, ${catalogCount} catalog; ${overlappingCount} taxonomy/catalog overlaps; ${childFamilyCount} child families).`);
  console.log(`Checked ${scenarios.length} query scenarios and ${requestCount} RFQ form contexts without network or browser access.`);
} finally {
  Module._resolveFilename = originalResolveFilename;
  Module._load = originalLoad;
  globalThis.fetch = originalFetch;
}

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
globalThis.fetch = () => { throw new Error("Family regression must remain offline"); };

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

function catalogConfigurationKinds(html, familyPath) {
  const configurations = one(html, "section", 'data-family-configurations="true"');
  const general = one(configurations.html, "details", 'data-general-family-templates="true"');
  assert.doesNotMatch(general.opening, /\sopen(?:[\s=>])/, `${familyPath}: general templates must start collapsed`);
  const cards = [
    ...elements(configurations.html, "article", 'data-family-template-kind="[^"]+"'),
    ...elements(configurations.html, "tr", 'data-family-template-kind="[^"]+"')
  ];
  const kinds = new Map();
  for (const card of cards) {
    const productLink = links(card.html).find((link) => link.url.pathname.startsWith(`${familyPath}/`));
    assert.ok(productLink, `${familyPath}: configuration must link to its product`);
    const kind = card.opening.match(/data-family-template-kind="([^"]+)"/)[1];
    assert.ok(kind === "general" || kind === "specific", `${familyPath}: unexpected template kind ${kind}`);
    if (kind === "specific") assert.ok(card.index < general.index, `${familyPath}: specific configuration must come first`);
    else assert.ok(card.index > general.index && card.index < general.index + general.html.length, `${familyPath}: general template must be inside disclosure`);
    const productKind = kind === "general" ? "generic" : "specific";
    if (kinds.has(productLink.url.pathname)) {
      assert.equal(kinds.get(productLink.url.pathname), productKind, `${productLink.url.pathname}: mobile and table groups must agree`);
    }
    kinds.set(productLink.url.pathname, productKind);
  }
  return kinds;
}

function checkBreadcrumbs(html, expected) {
  const nav = one(html, "nav", 'aria-label="Breadcrumb"');
  const items = elements(nav.body, "li");
  assert.deepEqual(items.map((item) => textContent(item.body).replace(/\s*\/$/, "")), expected.map(([label]) => label));
  assert.deepEqual(links(nav.body).map((link) => link.url.pathname), expected.slice(0, -1).map(([, href]) => href));
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
let productCount = 0;

try {
  const taxonomy = require("../src/data/productTaxonomy.ts");
  const items = require("../src/data/productItems.ts");
  const catalog = require("../src/data/productCatalog.ts");
  const familyRoute = require("../src/app/products/[segment]/[subcategory]/[family]/page.tsx");
  const productRoute = require("../src/app/products/[segment]/[subcategory]/[family]/[product]/page.tsx");
  const requestRoute = require("../src/app/request-quote/page.tsx");
  const { CatalogFamilyPage } = require("../src/components/products/catalog/CatalogPageTemplates.tsx");
  const { SourcingRequestLink } = require("../src/components/products/SourcingRequestLink.tsx");
  const paths = familyRoute.generateStaticParams();
  const routePath = ({ segment, subcategory, family, product }) =>
    `/products/${[segment, subcategory, family, product].filter(Boolean).join("/")}`;
  const expectedPaths = [...taxonomy.getAllFamilyPaths(), ...catalog.getAllCatalogFamilyPaths()].map(routePath);
  assert.deepEqual(paths.map(routePath).sort(), [...new Set(expectedPaths)].sort(), "Every family route must remain generated");
  const productPaths = new Set(productRoute.generateStaticParams().map(routePath));
  const expectedProductPaths = [...items.getAllProductItemPaths(), ...catalog.getAllCatalogProductPaths()].map(routePath);
  assert.deepEqual([...productPaths].sort(), [...new Set(expectedProductPaths)].sort(), "Existing product routes must remain generated");
  let taxonomyCount = 0;
  let catalogCount = 0;
  let specificFamilyCount = 0;
  let generalOnlyCount = 0;

  async function checkRequests(html, context, scenario, sourcePath) {
    const requestLinks = links(html).filter((link) => link.url.pathname === "/request-quote");
    assert.ok(requestLinks.length > 0, `${sourcePath}: no RFQ links`);
    const checked = new Set();
    for (const { url } of requestLinks) {
      if (checked.has(url.href)) continue;
      checked.add(url.href);
      const params = url.searchParams;
      const productSlug = params.get("product");
      const product = context.products.find((item) => item.slug === productSlug);
      assert.equal(params.get("segment"), context.segment.slug, `${sourcePath}: RFQ segment`);
      assert.equal(params.get("category"), context.category.slug, `${sourcePath}: RFQ category`);
      assert.equal(params.get("family"), context.family.slug, `${sourcePath}: RFQ family`);
      if (productSlug) assert.ok(product, `${sourcePath}: unknown RFQ product ${productSlug}`);
      if (context.product) assert.equal(productSlug, context.product.slug, `${sourcePath}: RFQ product lost`);
      assert.equal(params.get("query"), scenario.query, `${sourcePath}: RFQ query`);
      const productPath = routePath({ ...context.params, product: productSlug });
      const expectedSource = scenario.query ? `${sourcePath}?q=${encodeURIComponent(scenario.query)}` : productPath;
      assert.equal(params.get("sourcePage"), expectedSource, `${sourcePath}: RFQ sourcePage`);
      if (context.taxonomy) {
        assert.equal(params.get("subcategory"), context.category.slug, "Legacy category alias must remain");
        assert.equal(params.get("source"), "product-page");
        assert.equal(params.get("type"), params.get("requestType") === "quote" ? "rfq" : params.get("requestType"));
      } else {
        const expectedNeed = { documentation: "documents", "product-list-review": "product-list" }[params.get("requestType")] ?? params.get("requestType");
        if (params.has("need")) assert.equal(params.get("need"), expectedNeed);
      }

      formProps = undefined;
      renderToStaticMarkup(await requestRoute.default({ searchParams: Promise.resolve(Object.fromEntries(params)) }));
      assert.ok(formProps?.productContext, `${sourcePath}: RFQ form context missing`);
      const actual = formProps.productContext;
      assert.equal(actual.requestType, params.get("requestType"));
      assert.equal(formProps.initialValues.requestType, params.get("requestType"));
      assert.equal(actual.productSegment, context.segment.name);
      assert.equal(actual.productCategory, context.category.name);
      assert.equal(actual.productFamily, context.family.name);
      assert.equal(actual.productName, product?.name ?? context.family.name);
      assert.equal(actual.productUrl, productPath);
      assert.equal(actual.sourcePageUrl, expectedSource);
      if (scenario.query) assert.ok(formProps.initialValues.productList.includes(scenario.query), "Search prefill must reach the RFQ form");
      requestCount += 1;
    }
  }

  for (const params of paths) {
    const familyPath = routePath(params);
    const match = taxonomy.getFamilyBySlug(params.segment, params.subcategory, params.family);
    const catalogMatch = catalog.getFamilyBySlug(params.segment, params.subcategory, params.family);
    const context = match
      ? { ...match, category: match.subcategory, taxonomy: true, products: items.getProductItemsForFamily(params.segment, params.subcategory, params.family), params }
      : { ...catalogMatch, taxonomy: false, products: catalogMatch.family.products, params };
    if (match) taxonomyCount += 1;
    else catalogCount += 1;
    const generalNames = new Set([
      `${context.family.name} General Configuration`, `Sterile ${context.family.name}`, `Documentation-Ready ${context.family.name}`
    ]);
    const generalProducts = context.products.filter((item) => match ? item.slug.endsWith("-general") : generalNames.has(item.name));
    const specificProducts = context.products.filter((item) => !generalProducts.includes(item));
    if (specificProducts.length) specificFamilyCount += 1;
    else generalOnlyCount += 1;
    assert.ok(context.products.length > 0, `${familyPath}: missing configurations`);
    currentUrl = new URL(familyPath, origin);
    assert.equal((await familyRoute.generateMetadata({ params: Promise.resolve(params) })).alternates.canonical, familyPath);
    const breadcrumbs = [
      ["Home", "/"], ["Products", "/products"],
      [context.segment.title ?? context.segment.name, `/products/${params.segment}`],
      [context.category.title ?? context.category.name, `/products/${params.segment}/${params.subcategory}`],
      [context.family.title ?? context.family.name, familyPath]
    ];

    for (const scenario of scenarios) {
      currentUrl = new URL(`${familyPath}${scenario.search}`, origin);
      const html = renderToStaticMarkup(await familyRoute.default({ params: Promise.resolve(params) }));
      checkBreadcrumbs(html, breadcrumbs);
      const decision = one(html, "div", 'data-family-decision-summary="true"');
      const actions = links(one(decision.html, "div", 'data-sourcing-primary-actions="true"').body);
      assert.equal(actions.length, 3, `${familyPath}: exactly one primary and two secondary actions`);
      assert.deepEqual(actions.map((link) => link.url.searchParams.get("requestType")).sort(), ["equivalent", "quote", "sample"]);
      assert.deepEqual(actions.map((link) => link.label).sort(), ["Request quote", "Request sample", "Review equivalent"]);
      for (const action of actions) {
        assert.equal(action.url.pathname, "/request-quote");
        assert.equal(action.url.searchParams.get("requestType"), { "Request quote": "quote", "Request sample": "sample", "Review equivalent": "equivalent" }[action.label]);
        assert.equal(action.url.searchParams.has("product"), false, "Family hero must keep family-level context");
        assert.match(action.opening, /\bmin-h-11\b/, "Family action must retain its touch target");
        assert.equal(/\sbg-bioaxis-accent(?:\s|")/.test(action.opening), action.url.searchParams.get("requestType") === "quote", "Quote must be the only filled primary action");
      }
      const configurations = one(html, "section", 'data-family-configurations="true"');
      assert.ok(configurations.index > decision.index, `${familyPath}: configurations must follow the hero`);
      const checklist = disclosure(html, "Buyer checklist");
      assert.ok(configurations.index < checklist.index, `${familyPath}: configurations must precede checklist`);
      assert.ok(configurations.index < disclosure(html, "Family overview").index);
      assert.ok(links(disclosure(decision.html, "More sourcing actions").html).some((link) => link.url.searchParams.get("requestType") === "documentation"));
      const general = one(configurations.html, "details", 'data-general-family-templates="true"');
      assert.doesNotMatch(general.opening, /\sopen(?:[\s=>])/, `${familyPath}: general templates must start collapsed`);
      const cards = [
        ...elements(configurations.html, "article", 'data-family-template-kind="[^"]+"'),
        ...elements(configurations.html, "tr", 'data-family-template-kind="[^"]+"')
      ];
      for (const product of context.products) {
        const productPath = routePath({ ...params, product: product.slug });
        assert.ok(productPaths.has(productPath), `${productPath}: product route missing`);
        const kind = specificProducts.includes(product) ? "specific" : "general";
        const productCards = cards.filter((card) => links(card.html).some((link) => link.url.pathname === productPath));
        assert.ok(productCards.length > 0, `${productPath}: configuration must remain reachable`);
        for (const card of productCards) {
          assert.ok(card.opening.includes(`data-family-template-kind="${kind}"`), `${productPath}: wrong configuration group`);
          if (kind === "specific") assert.ok(card.index < general.index, `${productPath}: specific configuration must come first`);
          else assert.ok(card.index > general.index && card.index < general.index + general.html.length, `${productPath}: general template must be inside disclosure`);
          for (const link of links(card.html).filter((item) => item.url.pathname === productPath)) {
            assert.equal(link.url.searchParams.get("q"), scenario.query, `${productPath}: family-to-product query lost`);
          }
          const requests = links(card.html).filter((link) => link.url.pathname === "/request-quote");
          assert.deepEqual(requests.map((link) => link.url.searchParams.get("requestType")).sort(), match ? ["equivalent", "quote"] : ["documentation", "equivalent", "quote"]);
          for (const request of requests) {
            assert.equal(request.url.searchParams.get("product"), product.slug, `${productPath}: configuration RFQ must keep the selected product`);
          }
        }
      }
      await checkRequests(html, context, scenario, familyPath);

      for (const product of context.products) {
        const productParams = { ...params, product: product.slug };
        const productPath = routePath(productParams);
        currentUrl = new URL(`${productPath}${scenario.query ? `?q=${encodeURIComponent(scenario.query)}` : ""}`, origin);
        const productHtml = renderToStaticMarkup(await productRoute.default({ params: Promise.resolve(productParams) }));
        checkBreadcrumbs(productHtml, [...breadcrumbs, [product.name, productPath]]);
        const productActions = links(one(productHtml, "div", 'data-product-primary-actions="true"').body);
        assert.deepEqual(productActions.map((link) => link.url.searchParams.get("requestType")).sort(), ["equivalent", "quote", "sample"]);
        await checkRequests(productHtml, { ...context, product }, scenario, productPath);
        productCount += 1;
      }
    }
  }

  // Keep the old name-based rule only as a compatibility oracle for the original data.
  // Render every catalog family directly, including those shadowed by taxonomy routes.
  const catalogFamilies = catalog.productCatalogSegments.flatMap((segment) => segment.categories.flatMap((category) =>
    category.families.map((family) => ({ segment, category, family }))
  ));
  assert.deepEqual(new Set(catalogFamilies.flatMap(({ family }) => family.products.map((product) => product.configurationKind))), new Set(["generic", "specific"]), "Cover both catalog configuration kinds");
  let catalogClassificationRenders = 0;
  for (const context of catalogFamilies) {
    const { segment, category, family } = context;
    const familyPath = catalog.productCatalogHref(segment.slug, category.slug, family.slug);
    const legacyGenericNames = new Set([
      `${family.name} General Configuration`, `Sterile ${family.name}`, `Documentation-Ready ${family.name}`
    ]);
    const expectedKinds = new Map(family.products.map((product) => [
      `${familyPath}/${product.slug}`, legacyGenericNames.has(product.name) ? "generic" : "specific"
    ]));
    const renamedFamily = { ...family, name: `TEST-ONLY renamed ${family.slug}` };
    const renameProducts = (input) => ({
      ...input,
      products: input.products.map((product, index) => ({
        ...product,
        // Give specific products a legacy generic name to catch the reverse misclassification too.
        name: expectedKinds.get(`${familyPath}/${product.slug}`) === "specific"
          ? `Sterile ${input.name}`
          : `TEST-ONLY renamed configuration ${index + 1}`
      }))
    });
    const versions = [family, renamedFamily, renameProducts(family), renameProducts(renamedFamily)];
    currentUrl = new URL(familyPath, origin);
    for (const [index, version] of versions.entries()) {
      const html = renderToStaticMarkup(React.createElement(CatalogFamilyPage, { ...context, family: version }));
      assert.deepEqual(catalogConfigurationKinds(html, familyPath), expectedKinds, `${familyPath}: classification changed in rename scenario ${index}`);
      catalogClassificationRenders += 1;
    }
    for (const product of family.products) {
      assert.equal(product.configurationKind, expectedKinds.get(`${familyPath}/${product.slug}`), `${familyPath}/${product.slug}: data classification must match the legacy result`);
    }
  }

  currentUrl = new URL(`/products/test?query=${encodeURIComponent(query)}`, origin);
  const externalHref = "https://example.test/request-quote?query=external";
  const externalHtml = renderToStaticMarkup(React.createElement(SourcingRequestLink, { href: externalHref }, "External"));
  assert.equal(links(externalHtml)[0].url.href, externalHref, "External links must stay unchanged");
  const explicitHtml = renderToStaticMarkup(React.createElement(SourcingRequestLink, {
    href: "/products/test/item?q=explicit#specifications", preserveProductQuery: true
  }, "Template"));
  assert.equal(links(explicitHtml)[0].url.searchParams.get("q"), "explicit", "Explicit destination queries must survive");
  assert.equal(links(explicitHtml)[0].url.hash, "#specifications");

  assert.ok(taxonomyCount > 0 && catalogCount > 0 && specificFamilyCount > 0 && generalOnlyCount > 0, "Both route implementations and configuration cases must be covered");
  console.log(`Family page regression passed (${paths.length} families: ${taxonomyCount} taxonomy, ${catalogCount} catalog; ${specificFamilyCount} with specific configurations, ${generalOnlyCount} general-only).`);
  console.log(`Checked ${scenarios.length} query scenarios, ${productCount} product renders, and ${requestCount} RFQ form contexts without network or browser access.`);
  console.log(`Checked legacy classification and family/product renaming across all ${catalogFamilies.length} catalog families (${catalogClassificationRenders} renders).`);
} finally {
  Module._resolveFilename = originalResolveFilename;
  Module._load = originalLoad;
  globalThis.fetch = originalFetch;
}

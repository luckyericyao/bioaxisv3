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
const originalExtensions = Object.fromEntries([".ts", ".tsx", ".css"].map((extension) => [extension, require.extensions[extension]]));
let currentUrl = new URL("https://bioaxis.local/");
let networkAttempts = 0;

// Exercise the real server-rendered routes without Next, a browser, or network I/O.
Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  return originalResolveFilename.call(this, request.startsWith("@/") ? path.resolve("src", request.slice(2)) : request, parent, isMain, options);
};
Module._load = function load(request, parent, isMain) {
  if (request === "next/font/local") return { __esModule: true, default: () => ({ variable: "inter-test-font" }) };
  if (request === "next/link") return function Link({ href, children, ...props }) { return React.createElement("a", { href, ...props }, children); };
  if (request === "next/navigation") return {
    usePathname: () => currentUrl.pathname,
    useSearchParams: () => currentUrl.searchParams,
    useRouter: () => ({ push: () => { throw new Error("Unexpected navigation during SSR"); } }),
    notFound: () => { throw new Error(`Unexpected missing route ${currentUrl.pathname}`); }
  };
  if (request === "@/components/layout/Header") return { Header: () => null };
  if (request === "@/components/layout/Footer") return { Footer: () => null };
  if (request === "@/components/sourcing/SourcingListProvider") return { SourcingListProvider: ({ children }) => children };
  if (request === "@/components/sourcing/AddToSourcingListButton") return { AddToSourcingListButton: () => null };
  if (request === "@/components/forms/CompactSourcingIntake") return { CompactSourcingIntake: () => null };
  return originalLoad.call(this, request, parent, isMain);
};
for (const extension of [".ts", ".tsx"]) require.extensions[extension] = (module, filename) => {
  module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename
  }).outputText, filename);
};
require.extensions[".css"] = () => {};
globalThis.fetch = () => { networkAttempts += 1; throw new Error("Structured-data regression must remain offline"); };

function decode(value) {
  return value.replace(/&(amp|quot|lt|gt|#x27|#39);/g, (entity) => ({
    "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#x27;": "'", "&#39;": "'"
  })[entity]);
}
function textContent(html) {
  // Script/style bodies are not page text; including JSON-LD here would make
  // the directory name assertion pass on its own structured-data payload.
  return decode(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ").trim();
}
function links(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => ({
    url: new URL(decode(match[1]), currentUrl), label: textContent(match[2])
  }));
}
function scripts(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => {
    assert.doesNotMatch(match[1], /</, "JSON-LD must not expose an HTML/script opening token");
    const data = JSON.parse(match[1]);
    assert.equal(data["@context"], "https://schema.org");
    return data;
  });
}
function ofType(data, type) {
  return data.flatMap((entry) => entry["@graph"] ?? [entry]).filter((entry) => entry["@type"] === type);
}
function canonicalUrl(value, siteUrl) {
  assert.equal(typeof value, "string");
  const url = new URL(value);
  assert.equal(url.origin, siteUrl);
  assert.equal(url.protocol, "https:");
  assert.equal(url.search, "", "Directory and breadcrumb URLs must stay canonical");
  assert.equal(url.hash, "");
  assert.equal(url.href, value, "URL must already be absolute and normalized");
  return url;
}
function checkBreadcrumbs(html, data, siteUrl, expected) {
  const navs = [...html.matchAll(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/g)];
  const lists = ofType(data, "BreadcrumbList");
  assert.equal(navs.length, 1, `${currentUrl.pathname}: expected existing breadcrumb navigation`);
  assert.equal(lists.length, 1, `${currentUrl.pathname}: expected exactly one BreadcrumbList`);
  const navItems = [...navs[0][1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((match) => ({
    name: textContent(match[1]).replace(/\s*\/$/, ""), link: links(match[1])[0]?.url
  }));
  assert.equal(lists[0].itemListElement.length, navItems.length);
  assert.ok(navItems.length >= 2);
  lists[0].itemListElement.forEach((item, index) => {
    assert.equal(item["@type"], "ListItem");
    assert.equal(item.position, index + 1);
    assert.equal(item.name, navItems[index].name);
    assert.equal(typeof item.name, "string");
    assert.ok(item.name.trim());
    if (navItems[index].link) {
      assert.equal(canonicalUrl(item.item, siteUrl).pathname, navItems[index].link.pathname);
    } else {
      assert.equal(index, navItems.length - 1, "Only the current breadcrumb can omit a link");
      assert.equal(Object.hasOwn(item, "item"), false, "Preserve the unlinked current breadcrumb");
    }
  });
  if (expected) assert.deepEqual(navItems.map(({ name, link }) => [name, link?.pathname]), expected);
}
function checkDirectory(html, data, siteUrl, expected) {
  const lists = ofType(data, "ItemList");
  assert.equal(lists.length, expected.length ? 1 : 0, `${currentUrl.pathname}: incorrect ItemList count`);
  if (!expected.length) return;
  const list = lists[0];
  const url = canonicalUrl(list.url, siteUrl);
  assert.equal(url.pathname, currentUrl.pathname);
  assert.equal(list["@id"], `${list.url}#itemlist`);
  assert.equal(typeof list.name, "string");
  assert.ok(list.name.trim());
  assert.equal(list.numberOfItems, expected.length);
  assert.equal(list.itemListElement.length, expected.length);
  assert.deepEqual(Object.keys(list).sort(), ["@context", "@type", "@id", "url", "name", "numberOfItems", "itemListElement"].sort());
  const pageLinks = links(html);
  const seen = new Set();
  list.itemListElement.forEach((item, index) => {
    assert.deepEqual(Object.keys(item).sort(), ["@type", "position", "name", "url"].sort());
    assert.equal(item["@type"], "ListItem");
    assert.equal(item.position, index + 1);
    assert.equal(item.name, expected[index].name);
    assert.equal(canonicalUrl(item.url, siteUrl).pathname, expected[index].href);
    assert.equal(seen.has(item.url), false, `Repeated directory entry ${item.url}`);
    seen.add(item.url);
    const anchors = pageLinks.filter(({ url: target }) => target.origin === currentUrl.origin && target.pathname === expected[index].href);
    assert.ok(anchors.length, `JSON-LD entry has no rendered link: ${item.url}`);
    assert.ok(textContent(html).includes(item.name), `JSON-LD entry name is absent from page content: ${item.name}`);
  });
}

try {
  const taxonomy = require("../src/data/productTaxonomy.ts");
  const catalog = require("../src/data/productCatalog.ts");
  const productItems = require("../src/data/productItems.ts");
  const { bioAxisSiteUrl } = require("../src/lib/siteMetadata.ts");
  const { JsonLd, DirectoryItemList } = require("../src/components/seo/StructuredData.tsx");
  const { Breadcrumbs } = require("../src/components/products/Breadcrumbs.tsx");
  const root = require("../src/app/layout.tsx");
  const productsRoute = require("../src/app/products/page.tsx");
  const segmentRoute = require("../src/app/products/[segment]/page.tsx");
  const categoryRoute = require("../src/app/products/[segment]/[subcategory]/page.tsx");
  const familyRoute = require("../src/app/products/[segment]/[subcategory]/[family]/page.tsx");
  const productRoute = require("../src/app/products/[segment]/[subcategory]/[family]/[product]/page.tsx");
  const resourceRoute = require("../src/app/resources/[slug]/page.tsx");
  const { resourceArticles } = require("../src/data/resourceArticles.ts");
  const routePath = ({ segment, subcategory, family, product }) => `/products/${[segment, subcategory, family, product].filter(Boolean).join("/")}`;
  let directoryCount = 0;
  let breadcrumbCount = 0;

  const rootHtml = renderToStaticMarkup(React.createElement(root.default, null, React.createElement("p", null, "Offline fixture")));
  const rootData = scripts(rootHtml);
  assert.equal(rootData.length, 1);
  const organizations = ofType(rootData, "Organization");
  assert.equal(organizations.length, 1);
  assert.deepEqual(organizations[0], {
    "@type": "Organization", "@id": `${bioAxisSiteUrl}/#organization`, name: "BioAxis", url: bioAxisSiteUrl,
    logo: { "@type": "ImageObject", url: `${bioAxisSiteUrl}/icon.png`, width: 512, height: 512 },
    description: "Life science consumables sourcing support for product requests, equivalent review, samples, documentation, RFQ preparation, and recurring supply planning."
  }, "Only the existing public brand fields may be emitted; do not add legal identity, contacts, or evidence claims");
  const websites = ofType(rootData, "WebSite");
  assert.equal(websites.length, 1);
  assert.equal(websites[0].publisher["@id"], organizations[0]["@id"]);
  assert.equal(websites[0].potentialAction.target.urlTemplate, `${bioAxisSiteUrl}/products?q={search_term_string}`);

  for (const q of [undefined, "pipette tips", "__jsonld_no_such_product_731984__"]) {
    currentUrl = new URL(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`, "https://bioaxis.local");
    const html = renderToStaticMarkup(await productsRoute.default({ searchParams: Promise.resolve(q === undefined ? {} : { q }) }));
    const expected = q?.startsWith("__jsonld_") ? [] : taxonomy.productTaxonomy.map((segment) => ({ name: segment.title, href: `/products/${segment.slug}` }));
    assert.equal(html.includes('id="product-categories"'), expected.length > 0);
    checkDirectory(html, scripts(html), bioAxisSiteUrl, expected);
    directoryCount += 1;
  }

  // Walk the union, including supplemental catalog records and overlapping paths.
  // A real route must still prefer taxonomy data when both sources share a path.
  const paramsByDepth = [new Map(), new Map(), new Map()];
  function add(params, depth) { paramsByDepth[depth].set(routePath(params), params); }
  for (const segment of taxonomy.productTaxonomy) {
    add({ segment: segment.slug }, 0);
    for (const category of segment.subcategories) {
      add({ segment: segment.slug, subcategory: category.slug }, 1);
      for (const family of category.productFamilies) add({ segment: segment.slug, subcategory: category.slug, family: family.slug }, 2);
    }
  }
  for (const segment of catalog.productCatalogMenuSegments) {
    add({ segment: segment.slug }, 0);
    for (const category of segment.categories) {
      add({ segment: segment.slug, subcategory: category.slug }, 1);
      for (const family of category.families) add({ segment: segment.slug, subcategory: category.slug, family: family.slug }, 2);
    }
  }
  for (const [depth, route] of [segmentRoute, categoryRoute, familyRoute].entries()) {
    for (const [pathname, params] of paramsByDepth[depth]) {
      currentUrl = new URL(`${pathname}?q=200%20%C2%B5L%20%26%20tips`, "https://bioaxis.local");
      const html = renderToStaticMarkup(await route.default({ params: Promise.resolve(params) }));
      const data = scripts(html);
      let expected;
      let breadcrumb;
      const taxSegment = taxonomy.getTaxonomySegmentBySlug(params.segment);
      const taxCategory = params.subcategory && taxonomy.getSubcategoryBySlug(params.segment, params.subcategory);
      const taxFamily = params.family && taxonomy.getFamilyBySlug(params.segment, params.subcategory, params.family);
      const tax = depth === 0 ? taxSegment : depth === 1 ? taxCategory : taxFamily;
      if (tax) {
        const segment = depth === 0 ? tax : tax.segment;
        breadcrumb = [["Home", "/"], ["Products", "/products"], [segment.title, depth ? `/products/${segment.slug}` : undefined]];
        if (depth === 0) expected = segment.subcategories.map((category) => ({ name: category.title, href: `${pathname}/${category.slug}` }));
        if (depth >= 1) {
          const category = tax.subcategory;
          breadcrumb.push([category.title, depth === 2 ? `/products/${segment.slug}/${category.slug}` : undefined]);
          if (depth === 1) expected = category.productFamilies.map((family) => ({ name: family.title, href: `${pathname}/${family.slug}` }));
          if (depth === 2) {
            breadcrumb.push([tax.family.title, undefined]);
            const items = productItems.getProductItemsForFamily(params.segment, params.subcategory, params.family);
            expected = [...items.filter((item) => item.indexable), ...items.filter((item) => !item.indexable)]
              .map((item) => ({ name: item.name, href: `${pathname}/${item.slug}` }));
          }
        }
      } else {
        const match = depth === 0 ? { segment: catalog.getSegmentBySlug(params.segment) }
          : depth === 1 ? catalog.getCategoryBySlug(params.segment, params.subcategory)
            : catalog.getFamilyBySlug(params.segment, params.subcategory, params.family);
        assert.ok(match?.segment, `${pathname}: missing catalog record`);
        breadcrumb = [["Home", "/"], ["Products", "/products"], [match.segment.name, depth ? `/products/${params.segment}` : undefined]];
        if (depth === 0) expected = match.segment.categories.map((category) => ({ name: category.name, href: `${pathname}/${category.slug}` }));
        if (depth >= 1) {
          breadcrumb.push([match.category.name, depth === 2 ? `/products/${params.segment}/${params.subcategory}` : undefined]);
          if (depth === 1) expected = match.category.families.map((family) => ({ name: family.name, href: `${pathname}/${family.slug}` }));
          if (depth === 2) {
            breadcrumb.push([match.family.name, undefined]);
            const general = new Set([`${match.family.name} General Configuration`, `Sterile ${match.family.name}`, `Documentation-Ready ${match.family.name}`]);
            expected = [...match.family.products.filter((item) => !general.has(item.name)), ...match.family.products.filter((item) => general.has(item.name))]
              .map((item) => ({ name: item.name, href: `${pathname}/${item.slug}` }));
          }
        }
      }
      checkDirectory(html, data, bioAxisSiteUrl, expected);
      checkBreadcrumbs(html, data, bioAxisSiteUrl, breadcrumb);
      directoryCount += 1;
      breadcrumbCount += 1;
    }
  }

  // Product pages retain the existing breadcrumb only, not a fabricated Product/Offer.
  const productParams = productRoute.generateStaticParams();
  const taxonomyProduct = productParams.find((params) => taxonomy.getFamilyBySlug(params.segment, params.subcategory, params.family));
  const catalogProduct = productParams.find((params) => !taxonomy.getFamilyBySlug(params.segment, params.subcategory, params.family));
  assert.ok(taxonomyProduct && catalogProduct, "Cover both product route implementations");
  for (const params of [taxonomyProduct, catalogProduct]) {
    currentUrl = new URL(routePath(params), "https://bioaxis.local");
    const html = renderToStaticMarkup(await productRoute.default({ params: Promise.resolve(params) }));
    const data = scripts(html);
    checkBreadcrumbs(html, data, bioAxisSiteUrl);
    assert.equal(ofType(data, "ItemList").length, 0);
    assert.equal(ofType(data, "Product").length, 0);
    breadcrumbCount += 1;
  }
  for (const article of resourceArticles) {
    currentUrl = new URL(`/resources/${article.slug}`, "https://bioaxis.local");
    const html = renderToStaticMarkup(await resourceRoute.default({ params: Promise.resolve({ slug: article.slug }) }));
    checkBreadcrumbs(html, scripts(html), bioAxisSiteUrl, [["Resources", "/resources"], [article.title, undefined]]);
    breadcrumbCount += 1;
  }

  // Parse actual script elements: escaping must preserve values while preventing HTML breakout.
  const hostile = '</script><script>alert("fixture")</script><img src=x onerror=1> µL μm 中文 \\ " & \u2028\u2029';
  const fixture = { "@context": "https://schema.org", "@type": "Thing", name: hostile };
  const fixtureHtml = renderToStaticMarkup(React.createElement(JsonLd, { data: fixture }));
  assert.deepEqual(scripts(fixtureHtml), [fixture]);
  assert.equal(textContent(fixtureHtml), "", "JSON-LD must not count as visible page text");
  assert.equal([...fixtureHtml.matchAll(/<script\b/g)].length, 1);
  assert.doesNotMatch(fixtureHtml, /<img/);
  const hostileBreadcrumb = renderToStaticMarkup(React.createElement(Breadcrumbs, { items: [{ label: "Products", href: "/products" }, { label: hostile }] }));
  assert.equal(ofType(scripts(hostileBreadcrumb), "BreadcrumbList")[0].itemListElement[1].name, hostile);
  const hostileList = renderToStaticMarkup(React.createElement(DirectoryItemList, { name: hostile, path: "/products", items: [{ name: hostile, href: "/products/cell-culture" }] }));
  const hostileListData = ofType(scripts(hostileList), "ItemList")[0];
  assert.equal(hostileListData.name, hostile);
  assert.equal(hostileListData.itemListElement[0].name, hostile);
  assert.equal(renderToStaticMarkup(React.createElement(DirectoryItemList, { name: "Empty", path: "/products", items: [] })), "");
  assert.equal(networkAttempts, 0);
  console.log(`Structured-data regression passed (${directoryCount} directory states, ${breadcrumbCount} breadcrumbs, public Organization, safe JSON round trips; no network/server/browser).`);
} finally {
  Module._resolveFilename = originalResolveFilename;
  Module._load = originalLoad;
  globalThis.fetch = originalFetch;
  for (const [extension, original] of Object.entries(originalExtensions)) {
    if (original) require.extensions[extension] = original;
    else delete require.extensions[extension];
  }
}

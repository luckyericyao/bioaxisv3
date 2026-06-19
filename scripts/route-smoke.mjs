const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const quickProductItemRoutes = [
  "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
  "/products/cell-culture/media-and-supplements/serum-free-media/serum-free-cell-culture-media",
  "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates/96-well-pcr-plates",
  "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters/pes-022um-syringe-filters",
  "/products/automation-consumables/robotic-pipette-tips/hamilton-robotic-tips/hamilton-compatible-robotic-tips",
  "/products/storage-cryopreservation/cryogenic-vials/sterile-cryovials/sterile-cryogenic-vials"
];

const segmentProductItemRoutes = [
  ...quickProductItemRoutes,
  "/products/lab-plasticware/tubes/microcentrifuge-tubes/microcentrifuge-tubes-general",
  "/products/assays-detection/elisa-immunoassays/elisa-plates/elisa-plates-general",
  "/products/proteins-antibodies-immunology/antibodies/primary-antibodies/primary-antibodies-general",
  "/products/buffers-chemicals-reagents/common-buffers/pbs/pbs-general",
  "/products/small-lab-equipment/benchtop-instruments/mini-centrifuges/mini-centrifuges-general",
  "/products/early-bioprocess-single-use/single-use-bags/media-bags/media-bags-general"
];

const visibleRepresentativeFamilyRoutes = [
  "/products/liquid-handling/pipette-tips/universal-pipette-tips",
  "/products/liquid-handling/pipette-tips/filtered-pipette-tips",
  "/products/liquid-handling/pipette-tips/low-retention-pipette-tips",
  "/products/liquid-handling/pipette-tips/extended-length-pipette-tips",
  "/products/lab-plasticware/tubes/microcentrifuge-tubes",
  "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
  "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters",
  "/products/automation-consumables/robotic-pipette-tips/hamilton-robotic-tips"
];

const familyPageRoutes = [
  ...visibleRepresentativeFamilyRoutes,
  "/products/cell-culture/media-and-supplements/serum-free-media",
  "/products/storage-cryopreservation/cryogenic-vials/sterile-cryovials"
];

const productItemDetailSections = [
  "Details",
  "Common specifications",
  "Applications",
  "Compatibility considerations",
  "Documentation often requested",
  "Equivalent matching inputs",
  "Sample evaluation notes",
  "Quote-ready details",
  "Related product configurations"
];

const requiredHomeChips = ["Products", "Equivalent Finder", "Samples", "Quotes", "Quality", "Documentation"];
const requiredHomeWorkflowPreviews = [
  "Target Discovery",
  "Assay Development",
  "Screening",
  "Lead Optimization",
  "ADME / DMPK",
  "Preclinical Storage",
  "Early CMC",
  "QC / Analytical"
];
const requiredWorkflowStageLabels = [
  "Target Discovery & Biology Validation",
  "Cell Model & Assay Development",
  "Screening & Hit Identification",
  "Lead Optimization & In Vitro Profiling",
  "ADME / DMPK / Bioanalysis",
  "Preclinical Sample Collection & Storage",
  "Process Development & Early CMC",
  "QC, Analytical Testing & Release Support"
];
const requiredWorkflowCtaLabels = [
  "Map this workflow",
  "Build assay consumables list",
  "Source screening formats",
  "Map optimization consumables",
  "Source ADME/DMPK consumables",
  "Plan sample storage",
  "Source early CMC consumables",
  "Build QC supply list"
];
const requestTypeLabels = ["Quote request", "Equivalent request", "Sample request", "Documentation request", "Recurring supply request", "Product list review", "Contact request"];
const equivalentFinderContent = ["Common equivalent requests", "How BioAxis compares fit", "Safer switching path", "BioAxis helps compare compatible options. Final suitability depends on customer validation."];
const requiredPrimaryNavigation = ["Home", "Products", "Workflows", "Equivalent Finder", "Quality", "Samples", "Resources", "Request Quote"];
const requiredFooterNavigation = ["About", "Contact", "Supplier Qualification", "Products", "Request Quote", "Equivalent Finder", "Samples", "Quality", "Resources"];
const legacyNavLabels = ["Equivalents", "Support", "Applications", "Services", "Suppliers"];

const forbiddenVisiblePatterns = [
  { label: "Static taxonomy filters", pattern: /Static taxonomy filters/i },
  { label: "backend catalog data", pattern: /backend catalog data/i },
  { label: "Representative taxonomy rows only", pattern: /Representative taxonomy rows only/i },
  { label: "cart behavior", pattern: /cart behavior/i },
  { label: "fake inventory", pattern: /fake inventory/i },
  { label: "fake SKU", pattern: /fake SKU/i },
  { label: "fake pricing", pattern: /fake pricing/i },
  { label: "* -", pattern: /\*\s*-/ },
  { label: "• -", pattern: /•\s*-/ },
  { label: "  * -", pattern: /\s{2,}\*\s*-/ },
  { label: "Specification Buyer check", pattern: /Specification\s+Buyer check/i },
  { label: "Sourcing support for universal pipette tips within pipette tips", pattern: /Sourcing support for universal pipette tips within pipette tips/i },
  { label: "Sourcing support for low retention pipette tips within pipette tips", pattern: /Sourcing support for low retention pipette tips within pipette tips/i }
];

const routes = [
  "/",
  "/products",
  "/workflows",
  "/equivalent-finder",
  "/quality",
  "/samples",
  "/request-quote",
  "/products/liquid-handling/pipette-tips/filtered-pipette-tips",
  "/products/cell-culture/media-and-supplements/serum-free-media",
  "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
  "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters",
  "/request-quote?family=filtered-pipette-tips&product=filtered-200ul-pipette-tips&requestType=quote&segment=liquid-handling&subcategory=pipette-tips",
  ...familyPageRoutes,
  ...segmentProductItemRoutes
].filter((route, index, allRoutes) => allRoutes.indexOf(route) === index);

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function navBlocks(html) {
  return [...html.matchAll(/<nav\b[^>]*aria-label="(?:Primary|Footer) navigation"[^>]*>[\s\S]*?<\/nav>/g)].map((match) => match[0]);
}

function navBlock(html, label) {
  return html.match(new RegExp(`<nav\\b[^>]*aria-label="${label}"[^>]*>[\\s\\S]*?<\\/nav>`))?.[0] ?? "";
}

function navLabels(block) {
  return [...block.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => textOnly(match[1]));
}

function navHrefs(block) {
  return [...block.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

function hrefsFromHtml(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"));
}

function hrefPath(href) {
  return new URL(href, baseUrl).pathname;
}

function pathDepth(pathname) {
  return pathname.split("/").filter(Boolean).length;
}

function checkForbiddenVisibleStrings(route, pageText) {
  for (const forbidden of forbiddenVisiblePatterns) {
    if (forbidden.pattern.test(pageText)) {
      failures.push(`${route}: forbidden visible string "${forbidden.label}"`);
    }
  }
}

function hasHrefWithParams(html, pathname, params) {
  return hrefsFromHtml(html).some((href) => {
    const url = new URL(href, baseUrl);

    if (url.pathname !== pathname) {
      return false;
    }

    return Object.entries(params).every(([key, value]) => url.searchParams.get(key) === value);
  });
}

const failures = [];
const discoveredNavLinks = new Set();
let productsHtml = "";

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
  if (!response.ok) {
    failures.push(`${route}: HTTP ${response.status}`);
    continue;
  }

  const html = await response.text();
  const pageText = textOnly(html);
  if (route === "/products") {
    productsHtml = html;
  }

  if (/Coming soon/i.test(pageText)) {
    failures.push(`${route}: visible Coming soon copy`);
  }

  if (route === "/products" || route === "/equivalent-finder" || route.startsWith("/products/") || route.startsWith("/request-quote")) {
    checkForbiddenVisibleStrings(route, pageText);
  }

  if (route === "/") {
    requiredHomeChips.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing homepage chip ${label}`);
      }
    });

    if (pageText.includes("Products Suppliers Equivalent Finder Samples Quotes Quality")) {
      failures.push(`${route}: legacy homepage capability chip row`);
    }

    requiredHomeWorkflowPreviews.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing homepage workflow preview ${label}`);
      }
    });

    if (!html.includes('href="/workflows"') || !pageText.includes("Explore Drug R&D Workflows")) {
      failures.push(`${route}: missing homepage workflows CTA`);
    }

    if (!pageText.includes("View all product segments")) {
      failures.push(`${route}: missing all product segments CTA`);
    }
  }

  if (route === "/equivalent-finder") {
    equivalentFinderContent.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing equivalent finder content ${label}`);
      }
    });

    if (!hasHrefWithParams(html, "/request-quote", { requestType: "equivalent" })) {
      failures.push(`${route}: missing equivalent request CTA`);
    }

    if (!hrefsFromHtml(html).some((href) => hrefPath(href) === "/samples")) {
      failures.push(`${route}: missing sample-first CTA`);
    }
  }

  if (route === "/request-quote") {
    requestTypeLabels.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing request type ${label}`);
      }
    });

    if (!pageText.includes("Pasting a product list into Notes is fine")) {
      failures.push(`${route}: missing product list notes guidance`);
    }
  }

  if (route === "/quality" && !hasHrefWithParams(html, "/request-quote", { requestType: "documentation" })) {
    failures.push(`${route}: missing documentation support CTA`);
  }

  if (route === "/samples") {
    if (!hasHrefWithParams(html, "/request-quote", { requestType: "sample" })) {
      failures.push(`${route}: missing sample request CTA`);
    }
    if (!hasHrefWithParams(html, "/equivalent-finder", { requestType: "equivalent" })) {
      failures.push(`${route}: missing equivalent finder CTA`);
    }
  }

  if (route === "/workflows") {
    requiredWorkflowStageLabels.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing workflow stage ${label}`);
      }
    });

    ["Workflow → Product Family Map", "Send us your workflow. We will map the consumables.", "Map my workflow"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing workflow content ${label}`);
      }
    });

    requiredWorkflowCtaLabels.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing workflow CTA ${label}`);
      }
    });

    if (!pageText.includes("Replace current supplier products with equivalents")) {
      failures.push(`${route}: missing equivalents use case`);
    }

    if (!hasHrefWithParams(html, "/request-quote", { requestType: "product-list-review" })) {
      failures.push(`${route}: missing workflow mapping/product list CTA to request quote`);
    }

    if (!hasHrefWithParams(html, "/equivalent-finder", { requestType: "equivalent" })) {
      failures.push(`${route}: missing equivalent finder CTA`);
    }
  }

  const navs = navBlocks(html);
  if (navs.length < 2) {
    failures.push(`${route}: expected primary and footer navigation`);
  }

  for (const nav of navs) {
    const labels = navLabels(nav);
    const hrefs = navHrefs(nav);

    legacyNavLabels.forEach((legacyLabel) => {
      if (labels.includes(legacyLabel)) {
        failures.push(`${route}: legacy ${legacyLabel} nav/footer label`);
      }
    });

    if (hrefs.includes("/equivalents")) {
      failures.push(`${route}: legacy /equivalents nav link`);
    }
    if (!labels.includes("Equivalent Finder")) {
      failures.push(`${route}: missing Equivalent Finder nav label`);
    }

    hrefs.filter((href) => href.startsWith("/")).forEach((href) => discoveredNavLinks.add(href));
  }

  const primaryLabels = navLabels(navBlock(html, "Primary navigation"));
  const footerLabels = navLabels(navBlock(html, "Footer navigation"));
  requiredPrimaryNavigation.forEach((label) => {
    if (!primaryLabels.includes(label)) {
      failures.push(`${route}: missing primary nav label ${label}`);
    }
  });
  requiredFooterNavigation.forEach((label) => {
    if (!footerLabels.includes(label)) {
      failures.push(`${route}: missing footer nav label ${label}`);
    }
  });

  if (familyPageRoutes.includes(route) && !pageText.includes("Product configurations")) {
    failures.push(`${route}: missing Product configurations section`);
  }

  if (segmentProductItemRoutes.includes(route)) {
    for (const section of productItemDetailSections) {
      if (!pageText.includes(section)) {
        failures.push(`${route}: missing product detail section "${section}"`);
      }
    }

    const productSlug = route.split("/").at(-1);
    const routeParts = route.split("/").filter(Boolean);
    const [segmentSlug, subcategorySlug, familySlug] = routeParts.slice(1, 4);
    if (!html.includes(`product=${productSlug}`)) {
      failures.push(`${route}: missing RFQ/equivalent links with product query param`);
    }
    [
      { label: "Request quote", pathname: "/request-quote", params: { requestType: "quote" } },
      { label: "Find equivalent", pathname: "/equivalent-finder", params: { requestType: "equivalent" } },
      { label: "Request sample", pathname: "/request-quote", params: { requestType: "sample" } },
      { label: "Ask for documentation", pathname: "/request-quote", params: { requestType: "documentation" } }
    ].forEach((cta) => {
      if (
        !hasHrefWithParams(html, cta.pathname, {
          ...cta.params,
          segment: segmentSlug,
          subcategory: subcategorySlug,
          family: familySlug,
          product: productSlug
        })
      ) {
        failures.push(`${route}: missing ${cta.label} CTA with full product context`);
      }
    });
  }

  if (route === "/products/liquid-handling/pipette-tips") {
    for (const familyName of [
      "Universal Pipette Tips",
      "Filtered Pipette Tips",
      "Low Retention Pipette Tips",
      "Extended Length Pipette Tips",
      "Sterile Pipette Tips",
      "Reload and Bulk Pipette Tips"
    ]) {
      if (!pageText.includes(familyName)) {
        failures.push(`${route}: missing canonical family name ${familyName}`);
      }
    }
  }

  console.log(`${route}: ok`);
}

for (const quickRoute of quickProductItemRoutes) {
  if (!productsHtml.includes(`href="${quickRoute}"`)) {
    failures.push(`/products: missing quick-search link ${quickRoute}`);
  }
}

for (const familyRoute of visibleRepresentativeFamilyRoutes) {
  if (!productsHtml.includes(`href="${familyRoute}"`)) {
    failures.push(`/products: missing representative family link ${familyRoute}`);
  }
}

const productFamilyLinks = [
  ...new Set(
    [...productsHtml.matchAll(/href="(\/products\/[^"#?]+)"/g)]
      .map((match) => match[1])
      .filter((href) => pathDepth(hrefPath(href)) === 4)
  )
];

if (productFamilyLinks.length === 0) {
  failures.push("/products: no representative family links discovered");
}

for (const href of productFamilyLinks) {
  const response = await fetch(new URL(href, baseUrl), { redirect: "manual" });
  if (!response.ok) {
    failures.push(`/products representative family link ${href}: HTTP ${response.status}`);
    continue;
  }

  const html = await response.text();
  const pageText = textOnly(html);
  checkForbiddenVisibleStrings(href, pageText);
  if (!pageText.includes("Product configurations")) {
    failures.push(`/products representative family link ${href}: missing Product configurations section`);
  }
}

for (const href of discoveredNavLinks) {
  const response = await fetch(new URL(href, baseUrl), { redirect: "manual" });
  if (response.status >= 400) {
    failures.push(`nav link ${href}: HTTP ${response.status}`);
  }
}

const equivalentsResponse = await fetch(new URL("/equivalents", baseUrl), { redirect: "manual" });
const equivalentsLocation = equivalentsResponse.headers.get("location") ?? "";
if (![307, 308].includes(equivalentsResponse.status) || !equivalentsLocation.includes("/equivalent-finder")) {
  failures.push(`/equivalents: expected redirect to /equivalent-finder, got ${equivalentsResponse.status} ${equivalentsLocation}`);
} else {
  console.log(`/equivalents: ${equivalentsResponse.status} -> ${equivalentsLocation}`);
}

if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(baseUrl)) {
  const rfqResponse = await fetch(new URL("/api/request-quote", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Smoke Test",
      email: "smoke@example.com",
      company: "BioAxis QA",
      requestType: "contact",
      message: "Local smoke test for RFQ fallback capture."
    })
  });
  const payload = await rfqResponse.json();

  if (!rfqResponse.ok || payload?.ok !== true) {
    failures.push(`/api/request-quote: expected success, got ${rfqResponse.status}`);
  } else {
    console.log(`/api/request-quote: ${payload.mode ?? "ok"} ${payload.referenceId ?? ""}`.trim());
  }
}

if (failures.length > 0) {
  console.error("\nSmoke test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("\nSmoke test passed.");

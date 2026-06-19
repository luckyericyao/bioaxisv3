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

const representativeFamilyRoutes = [
  "/products/liquid-handling/pipette-tips/filtered-pipette-tips",
  "/products/lab-plasticware/tubes/microcentrifuge-tubes",
  "/products/cell-culture/media-and-supplements/serum-free-media",
  "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
  "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters",
  "/products/automation-consumables/robotic-pipette-tips/hamilton-robotic-tips"
];

const productItemDetailSections = [
  "Details",
  "Common specifications",
  "Applications",
  "Compatibility considerations",
  "Documentation often requested",
  "Equivalent matching inputs",
  "Sample evaluation notes",
  "Related product configurations"
];

const routes = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/supplier-qualification",
  "/equivalent-finder",
  "/request-quote",
  "/quality",
  "/samples",
  "/resources",
  "/products/liquid-handling/pipette-tips",
  "/products/liquid-handling/pipette-tips/filtered-pipette-tips",
  "/products/cell-culture/media-and-supplements",
  "/products/cell-culture/media-and-supplements/serum-free-media",
  "/products/molecular-biology-pcr/pcr-plastics",
  "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
  "/products/sample-prep-filtration/syringe-filters",
  "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters",
  "/products/automation-consumables/robotic-pipette-tips",
  "/products/storage-cryopreservation/cryogenic-vials",
  ...representativeFamilyRoutes,
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

function navLabels(block) {
  return [...block.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => textOnly(match[1]));
}

function navHrefs(block) {
  return [...block.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

function hrefPath(href) {
  return new URL(href, baseUrl).pathname;
}

function pathDepth(pathname) {
  return pathname.split("/").filter(Boolean).length;
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

  const navs = navBlocks(html);
  if (navs.length < 2) {
    failures.push(`${route}: expected primary and footer navigation`);
  }

  for (const nav of navs) {
    const labels = navLabels(nav);
    const hrefs = navHrefs(nav);

    if (labels.includes("Equivalents")) {
      failures.push(`${route}: legacy Equivalents nav label`);
    }
    if (hrefs.includes("/equivalents")) {
      failures.push(`${route}: legacy /equivalents nav link`);
    }
    if (!labels.includes("Equivalent Finder")) {
      failures.push(`${route}: missing Equivalent Finder nav label`);
    }

    hrefs.filter((href) => href.startsWith("/")).forEach((href) => discoveredNavLinks.add(href));
  }

  if (representativeFamilyRoutes.includes(route) && !pageText.includes("Product configurations")) {
    failures.push(`${route}: missing Product configurations section`);
  }

  if (segmentProductItemRoutes.includes(route)) {
    for (const section of productItemDetailSections) {
      if (!pageText.includes(section)) {
        failures.push(`${route}: missing product detail section "${section}"`);
      }
    }

    const productSlug = route.split("/").at(-1);
    if (!html.includes(`product=${productSlug}`)) {
      failures.push(`${route}: missing RFQ/equivalent links with product query param`);
    }
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
  if (!textOnly(html).includes("Product configurations")) {
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

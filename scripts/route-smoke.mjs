import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

const catalogAcceptanceRoutes = [
  "/products/liquid-handling/pipette-tips/universal-pipette-tips/sterile-filtered-universal-pipette-tips",
  "/products/cell-culture/cell-culture-media-buffers",
  "/products/cell-culture/cell-culture-media-buffers/classical-media",
  "/products/cell-culture/cell-culture-media-buffers/classical-media/dmem-high-glucose",
  "/equivalent-finder?catalog=D8537",
  "/request-quote?need=documents&segment=cell-culture"
];

const productItemDetailSections = [
  "Specifications",
  "Applications",
  "Compatibility",
  "Documentation",
  "Equivalent matching",
  "Sample request notes",
  "Quote-ready details",
  "Related sourcing templates"
];

const requiredHomeCtas = ["Structure my sourcing request", "Find equivalent", "Browse product lines", "Request quote"];
const productSearchExpectations = {
  "/products?q=gene": ["Gene"],
  "/products?q=cell": ["Cell Culture"],
  "/products?q=pcr": ["PCR"],
  "/products?q=filter": ["Filter"],
  "/products?q=vial": ["Vial"],
  "/products?q=hamilton": ["Hamilton"],
  "/products?q=filtered%20200%20ul%20tips": ["Filtered", "Pipette Tips"],
  "/products?q=PES%200.22": ["PES", "0.22"],
  "/products?q=qPCR%20plates": ["qPCR", "PCR"],
  "/products?q=sterile%20syringe%20filter": ["Sterile", "Syringe"],
  "/products?q=low%20retention%20tips": ["Low Retention", "Pipette Tips"]
};
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
const requestTypeLabels = ["Quote", "Product list", "Equivalent", "Sample", "Documentation", "Recurring supply", "Private label / OEM", "General sourcing question"];
const equivalentFinderContent = [
  "Find compatible alternatives for your current consumables",
  "Send the current product. BioAxis will structure the equivalent review.",
  "Send equivalent request",
  "Fit assessment, not a name match.",
  "A cleaner way to compare alternatives.",
  "Common equivalent requests",
  "BioAxis supports equivalent review and sourcing comparison",
  "Final suitability depends on supplier documentation, sample testing, and customer-side validation"
];
const requiredPrimaryNavigation = ["Products", "Equivalent Finder", "Private Label / OEM", "Trust Center", "Resources", "Request Quote"];
const requiredFooterNavigation = ["About", "Contact", "Supplier Qualification", "Products", "Request Quote", "Equivalent Finder", "Workflows", "Samples", "Quality", "Trust Center", "Resources"];
const requiredProductSegments = [
  "Liquid Handling",
  "Lab Plasticware",
  "Cell Culture",
  "Molecular Biology & PCR",
  "Sample Prep & Filtration",
  "Storage & Cryopreservation",
  "Automation Consumables",
  "Assays & Detection",
  "Proteins, Antibodies & Immunology",
  "Buffers, Chemicals & Reagents",
  "Small Lab Equipment",
  "Early Bioprocess & Single-Use"
];
const legacyNavLabels = ["Equivalents", "Support", "Applications", "Services", "Suppliers"];

const forbiddenVisiblePatterns = [
  { label: "Tpe Tubing", pattern: /Tpe Tubing/ },
  { label: "visible uL unit", pattern: /(^|[^A-Za-z])uL([^A-Za-z]|$)/ },
  { label: "visible ul unit", pattern: /(^|[^A-Za-z])ul([^A-Za-z]|$)/ },
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
  "/products?q=gene",
  "/products?q=cell",
  "/products?q=serum-free%20media",
  "/products?q=cryovial",
  "/products?q=pcr",
  "/products?q=filter",
  "/products?q=vial",
  "/products?q=hamilton",
  "/products?q=filtered%20200%20ul%20tips",
  "/products?q=PES%200.22",
  "/products?q=qPCR%20plates",
  "/products?q=sterile%20syringe%20filter",
  "/products?q=low%20retention%20tips",
  "/products/liquid-handling",
  "/products/liquid-handling/pipette-tips",
  "/products/cell-culture",
  "/products/cell-culture/media-and-supplements",
  ...catalogAcceptanceRoutes,
  "/workflows",
  "/equivalent-finder",
  "/private-label",
  "/private-label-oem",
  "/trust-center",
  "/quality",
  "/resources",
  "/resources/how-to-prepare-a-consumables-rfq",
  "/samples",
  "/request-quote",
  "/request-quote?requestType=quote",
  "/request-quote?requestType=product-list-review",
  "/request-quote?requestType=equivalent",
  "/request-quote?requestType=sample",
  "/request-quote?requestType=documentation",
  "/request-quote?requestType=recurring-supply",
  "/request-quote?requestType=general-sourcing-question",
  "/request-quote?type=quote",
  "/request-quote?type=product-list",
  "/request-quote?type=equivalent",
  "/request-quote?type=sample",
  "/request-quote?type=documentation",
  "/request-quote?type=rfq",
  "/request-quote?type=recurring",
  "/request-quote?type=unknown",
  "/request-quote?requestType=quote&segment=Cell%20Culture&category=Media%20and%20Supplements&family=Serum%20Free%20Media",
  "/request-quote?requestType=product-list-review&productList=Supplier%20%7C%20Catalog%20No.%20%7C%20Product",
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
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function textContentLike(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function mainBlock(html) {
  return html.match(/<main\b[^>]*>[\s\S]*<\/main>/)?.[0] ?? html;
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
let resourcesHtml = "";

async function readRequiredProjectFile(pathname) {
  try {
    return await readFile(resolve(repoRoot, pathname), "utf8");
  } catch {
    failures.push(`${pathname}: missing required project file`);
    return "";
  }
}

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
  if (!response.ok) {
    failures.push(`${route}: HTTP ${response.status}`);
    continue;
  }

  const html = await response.text();
  const pageText = textOnly(html);
  const mainText = textOnly(mainBlock(html));
  const rawPageText = textContentLike(html);
  if (route === "/products") {
    productsHtml = html;
  }
  if (route === "/resources") {
    resourcesHtml = html;
  }

  if (/Coming soon/i.test(pageText)) {
    failures.push(`${route}: visible Coming soon copy`);
  }

  if (route === "/" || route === "/products" || route.startsWith("/products?") || route === "/resources" || route === "/equivalent-finder" || route.startsWith("/products/") || route.startsWith("/request-quote") || route.startsWith("/resources/")) {
    checkForbiddenVisibleStrings(route, pageText);
  }

  if (route in productSearchExpectations) {
    const expectedTerms = productSearchExpectations[route];

    ["Results for", "Ranked across BioAxis", "Search coverage", "Top matches", "Sourcing next steps", "Clear search", "Browse all product segments"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing search UX label ${label}`);
      }
    });

    expectedTerms.forEach((term) => {
      if (!new RegExp(term, "i").test(pageText)) {
        failures.push(`${route}: missing expected search result term ${term}`);
      }
    });
  }

  if (route === "/products?q=cell") {
    const rankedResultsStart = pageText.indexOf("Top matches");
    const rankedResultsEnd = pageText.indexOf("Browse all product segments");
    const rankedResultsText = rankedResultsStart !== -1 && rankedResultsEnd !== -1
      ? pageText.slice(rankedResultsStart, rankedResultsEnd)
      : pageText;
    const cellCultureIndex = rankedResultsText.search(/Cell Culture/i);
    const liquidHandlingIndex = rankedResultsText.indexOf("Liquid Handling");

    if (cellCultureIndex === -1) {
      failures.push(`${route}: missing Cell Culture result`);
    }

    if (liquidHandlingIndex !== -1 && cellCultureIndex !== -1 && liquidHandlingIndex < cellCultureIndex) {
      failures.push(`${route}: Liquid Handling appears before Cell Culture for cell query`);
    }
  }

  if (route === "/") {
    const homeSectionCount = [...mainBlock(html).matchAll(/<section\b/g)].length;
    if (homeSectionCount !== 5) {
      failures.push(`${route}: expected exactly 5 homepage sections, found ${homeSectionCount}`);
    }

    requiredHomeCtas.forEach((label) => {
      if (!mainText.includes(label)) {
        failures.push(`${route}: missing homepage command CTA ${label}`);
      }
    });

    if (pageText.includes("Products Suppliers Equivalent Finder Samples Quotes Quality")) {
      failures.push(`${route}: legacy homepage capability chip row`);
    }

    const buyerTriggerCards = [...html.matchAll(/data-buyer-trigger-card="true"/g)].length;
    if (buyerTriggerCards !== 4) {
      failures.push(`${route}: expected exactly 4 buyer trigger cards, found ${buyerTriggerCards}`);
    }

    [
      "One-stop life science consumables sourcing",
      "The structured sourcing layer for life science consumables.",
      "BioAxis turns SKUs, catalog references, supplier lines, and product lists into comparable options, required documents, sample paths, and RFQ-ready sourcing briefs.",
      "Have a messy product list? Send it as-is. Only your email is required to start.",
      "Priority sourcing lines",
      "Liquid Handling",
      "Cell Culture",
      "Filtration",
      "Tubes, Plates & Storage",
      "PCR / qPCR",
      "Private Label / OEM",
      "Route every consumables request into the right sourcing path.",
      "From urgent replacement to equivalent review, samples, documentation, RFQ, and recurring supply planning",
      "Out of stock",
      "Need an equivalent",
      "Documents required",
      "Recurring demand",
      "Turn scattered product inputs into a buyer-ready sourcing brief",
      "Ready to structure your sourcing request?",
      "Send the list. BioAxis will structure the sourcing path.",
      "Samples and documents",
      "RFQ-ready brief"
    ].forEach((label) => {
      if (!mainText.includes(label)) {
        failures.push(`${route}: missing progressive homepage content ${label}`);
      }
    });

    if (!html.includes("SKU, catalog number, supplier line, or product list")) {
      failures.push(`${route}: missing hero search placeholder`);
    }

    ["Matched product family", "Equivalent criteria", "RFQ-ready brief", "Samples and documents"].forEach((label) => {
      if (!mainText.includes(label)) {
        failures.push(`${route}: missing concise return card ${label}`);
      }
    });

    ["Universal Pipette Tips", "Filtered Pipette Tips", "Microcentrifuge Tubes"].forEach((label) => {
      if (mainText.includes(label)) {
        failures.push(`${route}: homepage main content exposes product family list ${label}`);
      }
    });

    if (mainText.includes("Featured product segments")) {
      failures.push(`${route}: homepage still uses catalog-style featured product segments`);
    }
  }

  if (route === "/products") {
    requiredProductSegments.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing product navigation segment ${label}`);
      }
    });

    if (html.includes('id="products-mega-menu"')) {
      failures.push(`${route}: closed page should not render desktop Products mega menu content`);
    }

    ["Product navigation", "BioAxis product catalog"].forEach((label) => {
      if (pageText.includes(label)) {
        failures.push(`${route}: closed page renders always-visible catalog panel text ${label}`);
      }
    });

    if (!html.includes('aria-expanded="false"')) {
      failures.push(`${route}: missing closed Products aria-expanded state`);
    }

    ["Example product types", "Find equivalent", "Request quote", "View segment"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing product navigation/discovery content ${label}`);
      }
    });

    ["Show family links", "Universal Pipette Tips", "Filtered Pipette Tips", "Microcentrifuge Tubes"].forEach((label) => {
      if (mainText.includes(label)) {
        failures.push(`${route}: product overview exposes family links by default: ${label}`);
      }
    });

    const compactSegmentCards = [...html.matchAll(/data-product-segment-card="compact"/g)].length;
    if (compactSegmentCards !== 12) {
      failures.push(`${route}: expected 12 compact segment cards, found ${compactSegmentCards}`);
    }

    const commonRequestChips = [...html.matchAll(/data-common-sourcing-request="true"/g)].length;
    if (commonRequestChips !== 36) {
      failures.push(`${route}: expected exactly 36 common request chips across 12 cards, found ${commonRequestChips}`);
    }

    if (
      mainText.includes("Filtered or low-retention tips Automation-compatible formats Recurring tip and reservoir usage") ||
      mainText.includes("Filtered pipette tips Robotic reservoirs Serological pipettes")
    ) {
      failures.push(`${route}: product chip text is concatenated without separators`);
    }

    const familyDisclosurePanels = [...html.matchAll(/data-product-family-disclosure="true"/g)].length;
    if (familyDisclosurePanels !== 0) {
      failures.push(`${route}: product overview should not render family disclosure panels, found ${familyDisclosurePanels}`);
    }

    ["Common buyer specs", "Primary applications"].forEach((label) => {
      if (mainText.includes(label)) {
        failures.push(`${route}: product directory exposes old dense card content ${label}`);
      }
    });
  }

  if (route === "/resources") {
    ["Filtered vs non-filtered pipette tips", "How to prepare a consumables RFQ", "How to source automation-compatible tips", "How to qualify equivalent lab consumables before switching"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing resource guide ${label}`);
      }
    });
  }

  if (route === "/equivalent-finder") {
    equivalentFinderContent.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing equivalent finder content ${label}`);
      }
    });

    if (!hasHrefWithParams(html, "/request-quote", { type: "equivalent", requestType: "equivalent" })) {
      failures.push(`${route}: missing equivalent request CTA`);
    }

    if (!hasHrefWithParams(html, "/request-quote", { type: "sample", requestType: "sample" })) {
      failures.push(`${route}: missing sample-first request CTA`);
    }
  }

  if (route === "/equivalent-finder?catalog=D8537" && !pageText.includes("D8537")) {
    failures.push(`${route}: catalog query did not prefill equivalent intake`);
  }

  if (route.startsWith("/request-quote")) {
    requestTypeLabels.forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing request type ${label}`);
      }
    });

    [
      "Sourcing request",
      "Paste what you have. BioAxis will structure the sourcing request.",
      "Email *",
      "Add details — optional",
      "Request type optional"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing canonical RFQ content ${label}`);
      }
    });

    [
      "Inquiry engine",
      "Type 01 Selected",
      "End of Quote card",
      "Product context / list optional"
    ].forEach((label) => {
      if (pageText.includes(label) || rawPageText.includes(label)) {
        failures.push(`${route}: old RFQ content still rendered: ${label}`);
      }
    });

    if (/Request type 01/i.test(rawPageText) || /End of .* card/i.test(rawPageText) || /Choose Product list/i.test(rawPageText) || /Quote requestEquivalent requestSample request/i.test(rawPageText)) {
      failures.push(`${route}: request type cards are concatenated in raw text layer`);
    }

    const emailIndex = pageText.indexOf("Email *");
    const requestTypeIndex = pageText.indexOf("Request type optional");
    if (emailIndex === -1 || requestTypeIndex === -1 || requestTypeIndex < emailIndex) {
      failures.push(`${route}: request type appears before email intake`);
    }

    const primaryNavLabels = navLabels(navBlock(html, "Primary navigation"));
    if (JSON.stringify(primaryNavLabels) !== JSON.stringify(requiredPrimaryNavigation)) {
      failures.push(`${route}: primary nav is not canonical RFQ nav (${primaryNavLabels.join(", ")})`);
    }

    if (!pageText.includes("Quote") || !pageText.includes("Selected")) {
      failures.push(`${route}: missing selected quote request type card text`);
    }

    [
      "Send a product, catalog number, or list",
      "Paste what you have. BioAxis will structure the sourcing request.",
      "Only your email is required to start. Add details only if useful.",
      "Email *",
      "Current supplier / brand optional",
      "Catalog number / SKU optional",
      "Missing optional procurement details will not block submission.",
      "Send sourcing request"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing low-friction RFQ copy ${label}`);
      }
    });

    const primaryNeedLabels = [
      "Product / SKU / product list / sourcing need",
      "Current product / catalog number / supplier line",
      "Product / SKU / sample need",
      "Message / sourcing question"
    ];
    if (!primaryNeedLabels.some((label) => pageText.includes(label))) {
      failures.push(`${route}: missing primary sourcing need field label`);
    }

    ["Name *", "Organization *", "Shipping region *", "Desired quantity *", "Target delivery date *"].forEach((label) => {
      if (pageText.includes(label)) {
        failures.push(`${route}: optional field still appears visually required: ${label}`);
      }
    });

    [/Product segment\s*\/\s*category\s+\*/i, /Product or equivalent product\s+\*/i, /Required specification/i].forEach((pattern) => {
      if (pattern.test(pageText)) {
        failures.push(`${route}: procurement field still appears required or heavy: ${pattern}`);
      }
    });
  }

  if (route.startsWith("/request-quote?type=product-list") || route.startsWith("/request-quote?requestType=product-list-review")) {
    ["Product list", "Product / SKU / product list"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing product-list RFQ field ${label}`);
      }
    });

    if (!html.includes("Paste a SKU, product list")) {
      failures.push(`${route}: missing product-list textarea placeholder`);
    }
  }

  if ((route.startsWith("/request-quote?type=equivalent") || route.startsWith("/request-quote?requestType=equivalent")) && !pageText.includes("Equivalent")) {
    failures.push(`${route}: equivalent type query did not preselect equivalent request`);
  }

  if ((route.startsWith("/request-quote?type=sample") || route.startsWith("/request-quote?requestType=sample")) && !pageText.includes("Sample")) {
    failures.push(`${route}: sample type query did not preselect sample request`);
  }

  if ((route.startsWith("/request-quote?type=documentation") || route.startsWith("/request-quote?requestType=documentation")) && !pageText.includes("Documentation")) {
    failures.push(`${route}: documentation type query did not preselect documentation request`);
  }

  if (route === "/request-quote?need=documents&segment=cell-culture") {
    ["Documentation", "Request context", "Cell Culture"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing document-need RFQ context ${label}`);
      }
    });
  }

  if ((route.startsWith("/request-quote?type=recurring") || route.startsWith("/request-quote?requestType=recurring-supply")) && !pageText.includes("Recurring supply")) {
    failures.push(`${route}: recurring type query did not preselect recurring supply request`);
  }

  if (route.startsWith("/request-quote?type=unknown") && !pageText.includes("Quote")) {
    failures.push(`${route}: unknown type query did not default to quote request`);
  }

  if (route.startsWith("/request-quote?") && route.includes("product=filtered-200ul-pipette-tips")) {
    [
      "Request context",
      "Filtered 200 µL Pipette Tips",
      "Filtered Pipette Tips",
      "Pipette Tips",
      "Liquid Handling",
      "Source page",
      "BioAxis will include this product context with your request. You can add more details below, but it is not required."
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing product-context summary ${label}`);
      }
    });

    if (!html.includes('data-product-context-summary="true"')) {
      failures.push(`${route}: missing product context summary marker`);
    }
  }

  if (route.startsWith("/request-quote?") && route.includes("family=Serum%20Free%20Media")) {
    ["Request context", "Serum Free Media", "Media and Supplements", "Cell Culture"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing label-based RFQ context ${label}`);
      }
    });

    if (!html.includes('data-product-context-summary="true"')) {
      failures.push(`${route}: missing label-based product context summary marker`);
    }
  }

  if (route === "/private-label") {
    [
      "Private Label / OEM Consumables",
      "Explore private-label, neutral-label, and OEM-style sourcing options",
      "What this is for",
      "Suitable product areas",
      "What BioAxis can help coordinate",
      "What buyers should prepare",
      "Compliance / limitation note",
      "Private-label feasibility depends on product type",
      "Discuss private-label sourcing",
      "Submit a product list",
      "Back to Products",
      "Equivalent Finder"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing private-label page content ${label}`);
      }
    });

    if (!hasHrefWithParams(html, "/request-quote", { requestType: "quote", sourcePage: "private-label" })) {
      failures.push(`${route}: missing private-label RFQ CTA`);
    }

    if (!hasHrefWithParams(html, "/request-quote", { requestType: "quote", sourcePage: "private-label-product-list" })) {
      failures.push(`${route}: missing private-label product-list CTA`);
    }

    if (!hrefsFromHtml(html).some((href) => hrefPath(href) === "/products")) {
      failures.push(`${route}: missing back to products link`);
    }

    if (!hrefsFromHtml(html).some((href) => hrefPath(href) === "/equivalent-finder")) {
      failures.push(`${route}: missing equivalent finder link`);
    }

    [/guaranteed inventory/i, /guaranteed pricing/i, /exclusive factory control/i, /BioAxis directly manufactures/i].forEach((pattern) => {
      if (pattern.test(pageText)) {
        failures.push(`${route}: private-label page overclaims ${pattern}`);
      }
    });
  }

  if (route === "/private-label-oem") {
    [
      "Private-label sourcing for recurring consumables demand",
      "Built for recurring demand conversations.",
      "Priority categories",
      "Pipette tips private-label review",
      "Tubes / plates recurring demand review",
      "Filtration / PCR plastics OEM-style sourcing",
      "Pipette tips",
      "Tubes, plates, and storage",
      "Automation-compatible consumables",
      "Discuss private-label sourcing",
      "Request recurring supply review",
      "BioAxis does not claim factory ownership"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing private-label-oem content ${label}`);
      }
    });

    if (mainText.includes("Pipette tips Tubes, plates, and storage Filtration consumables")) {
      failures.push(`${route}: private-label priority categories are concatenated without separators`);
    }
  }

  if (route === "/trust-center") {
    [
      "Documentation review",
      "Supplier screening",
      "Sample-first evaluation",
      "Equivalent review",
      "Document package BioAxis can help organize",
      "Sterility certificate",
      "Supplier specification sheet",
      "Packaging / format information",
      "Compatibility notes when supplier-provided",
      "What BioAxis helps organize",
      "What remains buyer-side",
      "Recurring supply readiness",
      "What BioAxis does not claim",
      "BioAxis does not claim live inventory for every listed product"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing trust-center content ${label}`);
      }
    });
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
  if (route === "/" && primaryLabels.length !== 6) {
    failures.push(`${route}: expected exactly 6 primary nav labels, found ${primaryLabels.length}`);
  }
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

  if (familyPageRoutes.includes(route) && !pageText.includes("Sourcing configuration templates")) {
    failures.push(`${route}: missing Sourcing configuration templates section`);
  }

  if (route === "/products/liquid-handling") {
    ["Choose a Liquid Handling category", "Pipette Tips", "Serological Pipettes", "Common buyer questions"].forEach((label) => {
      if (!mainText.includes(label)) {
        failures.push(`${route}: missing segment-level category flow content ${label}`);
      }
    });

    if (mainText.includes("Universal Pipette Tips") || mainText.includes("Sourcing options preview")) {
      failures.push(`${route}: segment page exposes family/item-level content too early`);
    }
  }

  if (route === "/products/liquid-handling/pipette-tips") {
    ["Choose a product family", "Buyer decision filters", "Common specs as chips", "Sourcing template preview"].forEach((label) => {
      if (!mainText.includes(label)) {
        failures.push(`${route}: missing category-level family flow content ${label}`);
      }
    });

    ["Sourcing template preview", "Configuration type", "Typical RFQ fields", "Documentation to request", "Equivalent review notes", "Best next action"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing catalog table content ${label}`);
      }
    });
  }

  if (familyPageRoutes.includes(route)) {
    ["Sourcing configuration templates", "Buyer checklist"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing family progressive disclosure content ${label}`);
      }
    });

    [
      ["Typical RFQ fields", "Specification checklist"],
      ["Equivalent review notes", "Equivalent switching considerations"],
      ["Documentation to request", "Documentation checklist"],
      ["Add to list", "Add to sourcing list"]
    ].forEach((options) => {
      if (!options.some((label) => pageText.includes(label))) {
        failures.push(`${route}: missing family progressive disclosure content ${options.join(" or ")}`);
      }
    });
  }

  if (segmentProductItemRoutes.includes(route)) {
    ["Already using another supplier?", "Add to sourcing list", "Buyer inputs", "Typical buyer cases"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing product item sourcing module ${label}`);
      }
    });

    if (!pageText.includes("Request quote for this product")) {
      failures.push(`${route}: missing low-friction product quote CTA label`);
    }

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
    if (!html.includes("source=product-page")) {
      failures.push(`${route}: product request CTAs do not mark product-page source`);
    }
    [
      { label: "Request quote", pathname: "/request-quote", params: { requestType: "quote" } },
      { label: "Find equivalent", pathname: "/request-quote", params: { requestType: "equivalent" } },
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

  if (route === "/products/liquid-handling/pipette-tips/universal-pipette-tips/sterile-filtered-universal-pipette-tips") {
    [
      "Sterile Filtered Universal Pipette Tips",
      "Documentation to request",
      "Typical RFQ fields",
      "Equivalent review notes",
      "Related sourcing configurations",
      "Request documents",
      "Start equivalent review",
      "Add to sourcing list"
    ].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing catalog product detail content ${label}`);
      }
    });
  }

  if (route === "/products/cell-culture/cell-culture-media-buffers/classical-media/dmem-high-glucose") {
    ["DMEM High Glucose", "Documentation to request", "Typical RFQ fields", "Equivalent review notes", "Cell Culture Media & Buffers"].forEach((label) => {
      if (!pageText.includes(label)) {
        failures.push(`${route}: missing DMEM catalog product content ${label}`);
      }
    });
  }

  console.log(`${route}: ok`);
}

const productCategoryLinks = [
  ...new Set(
    [...productsHtml.matchAll(/href="(\/products\/[^"#?]+)"/g)]
      .map((match) => match[1])
      .filter((href) => pathDepth(hrefPath(href)) === 3)
  )
];

const resourceGuideLinks = [
  ...new Set([...resourcesHtml.matchAll(/href="(\/resources\/[^"#?]+)"/g)].map((match) => match[1]))
];

if (productCategoryLinks.length !== 0) {
  failures.push(`/products: overview should not expose category/family links by default, found ${productCategoryLinks.length}`);
}

if (resourceGuideLinks.length !== 12) {
  failures.push(`/resources: expected 12 guide links, found ${resourceGuideLinks.length}`);
}

for (const href of resourceGuideLinks) {
  const response = await fetch(new URL(href, baseUrl), { redirect: "manual" });
  if (!response.ok) {
    failures.push(`/resources guide link ${href}: HTTP ${response.status}`);
    continue;
  }

  const html = await response.text();
  const pageText = textOnly(html);
  checkForbiddenVisibleStrings(href, pageText);
  ["Related products", "Find equivalent", "Request sample", "Prepare RFQ"].forEach((label) => {
    if (!pageText.includes(label)) {
      failures.push(`/resources guide link ${href}: missing guide CTA ${label}`);
    }
  });

  ["Need sourcing help for this category?", "Start RFQ", "Request documents"].forEach((label) => {
    if (!pageText.includes(label)) {
      failures.push(`/resources guide link ${href}: missing conversion CTA ${label}`);
    }
  });

  [
    { pathname: "/request-quote", params: { type: "product-list", requestType: "product-list-review" } },
    { pathname: "/equivalent-finder", params: { sourcePage: "resource-guide" } },
    { pathname: "/request-quote", params: { type: "documentation", requestType: "documentation" } }
  ].forEach((cta) => {
    if (!hasHrefWithParams(html, cta.pathname, cta.params)) {
      failures.push(`/resources guide link ${href}: missing conversion CTA href ${cta.params.type}`);
    }
  });
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

const rfqRouteSource = await readRequiredProjectFile("src/app/api/rfq/route.ts");
const requestQuoteRouteSource = await readRequiredProjectFile("src/app/api/request-quote/route.ts");
const submitHelperSource = await readRequiredProjectFile("src/lib/submitBioAxisRequest.ts");
const quoteFormSource = await readRequiredProjectFile("src/components/forms/QuoteRequestForm.tsx");
const contactFormSource = await readRequiredProjectFile("src/components/forms/ContactForm.tsx");
const simpleFormSource = await readRequiredProjectFile("src/components/forms/SimpleRequestForm.tsx");
const sourcingIntakeFormSource = await readRequiredProjectFile("src/components/forms/SourcingIntakeForm.tsx");
const requestTypeSelectorSource = await readRequiredProjectFile("src/components/forms/RequestTypeSelector.tsx");
const homePageSource = await readRequiredProjectFile("src/app/page.tsx");
const productsPageSource = await readRequiredProjectFile("src/app/products/page.tsx");
const headerSource = await readRequiredProjectFile("src/components/layout/Header.tsx");
const productNavigationSource = await readRequiredProjectFile("src/data/productNavigation.ts");
const productCategoryCardSource = await readRequiredProjectFile("src/components/products/ProductCategoryCard.tsx");
const catalogTemplatesSource = await readRequiredProjectFile("src/components/products/catalog/CatalogPageTemplates.tsx");
const catalogBrowserSource = await readRequiredProjectFile("src/components/products/catalog/CatalogProductBrowser.tsx");
const segmentTemplateSource = await readRequiredProjectFile("src/components/products/SegmentPageTemplate.tsx");
const categoryTemplateSource = await readRequiredProjectFile("src/components/products/CategoryPageTemplate.tsx");
const familyTemplateSource = await readRequiredProjectFile("src/components/products/FamilyPageTemplate.tsx");
const productItemTemplateSource = await readRequiredProjectFile("src/components/products/ProductItemPageTemplate.tsx");
const envExampleSource = await readRequiredProjectFile(".env.example");

if (!rfqRouteSource.includes("export async function POST") || !rfqRouteSource.includes("https://api.resend.com/emails")) {
  failures.push("src/app/api/rfq/route.ts: missing RFQ POST route or Resend delivery call");
}

if (!requestQuoteRouteSource.includes('export { POST } from "../rfq/route"')) {
  failures.push("src/app/api/request-quote/route.ts: legacy route is not aliased to /api/rfq");
}

if (rfqRouteSource.includes("NEXT_PUBLIC_RESEND_API_KEY") || submitHelperSource.includes("RESEND_API_KEY")) {
  failures.push("RFQ implementation: Resend API key appears in browser-facing code or NEXT_PUBLIC key is referenced");
}

if (!submitHelperSource.includes('fetch("/api/rfq"')) {
  failures.push("src/lib/submitBioAxisRequest.ts: expected centralized submit helper to post to /api/rfq");
}

[
  "products-segment-dropdown",
  "mobile-products-navigation",
  "ProductSegmentDropdown",
  "MobileProductsAccordion",
  "aria-expanded",
  "Escape",
  "handlePointerDown",
  "max-h-[70vh]",
  "w-[340px]",
  "z-[90]",
  "bg-white shadow-2xl",
  "Product segments",
  "productNavigationSegments"
].forEach((label) => {
  if (!headerSource.includes(label)) {
    failures.push(`Header: missing product navigation capability ${label}`);
  }
});

[
  "products-mega-menu",
  "ProductMegaMenu",
  "Product navigation",
  "familyPreviewLimit"
].forEach((label) => {
  if (headerSource.includes(label)) {
    failures.push(`Header: product dropdown still exposes dense catalog content ${label}`);
  }
});

["productCatalogMenuSegments.map", "familyLinks", "categories.flatMap"].forEach((label) => {
  if (!productNavigationSource.includes(label)) {
    failures.push(`productNavigation data: missing shared taxonomy-derived field ${label}`);
  }
});

[
  ["Catalog templates", catalogTemplatesSource, ["CatalogSegmentPage", "CatalogCategoryPage", "CatalogFamilyPage", "CatalogProductPage", "Documentation to request", "Equivalent review notes", "Common buyer questions"]],
  ["Catalog product browser", catalogBrowserSource, ["Configuration type", "Typical RFQ fields", "Documentation to request", "Equivalent review notes", "Best next action", "AddToSourcingListButton"]]
].forEach(([label, source, required]) => {
  for (const needle of required) {
    if (!source.includes(needle)) {
      failures.push(`${label}: missing catalog source marker ${needle}`);
    }
  }
});

["data-product-segment-card=\"compact\"", "data-common-sourcing-request=\"true\"", "Example product types", "buildRequestHref", "View segment"].forEach((label) => {
  if (!productCategoryCardSource.includes(label)) {
    failures.push(`ProductCategoryCard: missing hover product discovery behavior ${label}`);
  }
});

["data-product-family-disclosure", "SegmentFamilyDisclosure", "Show family links", "Representative families", "Common buyer specs", "Primary applications"].forEach((legacyPattern) => {
  if (productCategoryCardSource.includes(legacyPattern)) {
    failures.push(`ProductCategoryCard: still contains dense product directory content ${legacyPattern}`);
  }
});

["ProductListIntakeHomeSection", "SourcingProblemsSection", "SourceByWorkflowSection", "PopularStartingPointsSection", "MissionSection", "OnePlatformSection"].forEach((legacySection) => {
  if (homePageSource.includes(legacySection)) {
    failures.push(`Home page: still imports dense homepage section ${legacySection}`);
  }
});

[
  ["Products page", productsPageSource, ["ProductCategoryGrid", "Browse the BioAxis product universe"]],
  ["Segment template", segmentTemplateSource, ["Choose a", "category", "Common sourcing questions"]],
  ["Category template", categoryTemplateSource, ["Choose a product family", "Buyer decision filters", "Common specs as chips"]],
  ["Family template", familyTemplateSource, ["Disclosure", "Buyer checklist", "Specification checklist", "Compliance disclaimer", "ProductConfigurationSection"]],
  ["Product item template", productItemTemplateSource, ["Product item details", "Specifications", "AddToSourcingListButton"]],
  ["Request type selector", requestTypeSelectorSource, ["shortRequestTypeLabel", "shortRequestTypeDescription", "min-h-20"]]
].forEach(([label, source, required]) => {
  for (const needle of required) {
    if (!source.includes(needle)) {
      failures.push(`${label}: missing progressive disclosure source marker ${needle}`);
    }
  }
});

if (!sourcingIntakeFormSource.includes("emailErrorMessage") || !sourcingIntakeFormSource.includes("data-rfq-mode=\"email-plus-context\"")) {
  failures.push("SourcingIntakeForm: expected email-plus-context validation mode");
}

["Add details — optional", "Request type optional", "<details", "RequestTypeSelector"].forEach((label) => {
  if (!sourcingIntakeFormSource.includes(label)) {
    failures.push(`SourcingIntakeForm: missing collapsed optional detail behavior ${label}`);
  }
});

["selectedRequestType.requiredFields", "universalRequired", "productCategory: \"Product segment / category\""].forEach((legacyPattern) => {
  if (sourcingIntakeFormSource.includes(legacyPattern)) {
    failures.push(`SourcingIntakeForm: still contains legacy required-field logic ${legacyPattern}`);
  }
});

["data-product-context-summary=\"true\"", "data-sourcing-list-summary=\"true\"", "sourcingListItems", "productContext", "Pasted input captured"].forEach((label) => {
  if (!sourcingIntakeFormSource.includes(label)) {
    failures.push(`SourcingIntakeForm: missing low-friction context/source wiring ${label}`);
  }
});

if (rfqRouteSource.includes("request.name") && rfqRouteSource.includes("Name is required")) {
  failures.push("src/app/api/rfq/route.ts: still requires name");
}

["hasRequestDetail", "Supported request type is required", "Provide a message, product detail"].forEach((legacyPattern) => {
  if (rfqRouteSource.includes(legacyPattern)) {
    failures.push(`src/app/api/rfq/route.ts: still contains legacy blocking validation ${legacyPattern}`);
  }
});

["Auto-captured product context", "Optional customer notes", "Optional supplier/catalog/quantity/docs/timeline fields", "Sourcing list items"].forEach((label) => {
  if (!rfqRouteSource.includes(label)) {
    failures.push(`src/app/api/rfq/route.ts: missing email section ${label}`);
  }
});

if (!sourcingIntakeFormSource.includes("submitBioAxisRequest") || !sourcingIntakeFormSource.includes('data-api-endpoint="/api/rfq"')) {
  failures.push("SourcingIntakeForm: expected form to submit through submitBioAxisRequest and declare /api/rfq endpoint");
}

if (!sourcingIntakeFormSource.includes("submitting") || !sourcingIntakeFormSource.includes("setError") || !sourcingIntakeFormSource.includes("submitted")) {
  failures.push("SourcingIntakeForm: missing idle/submitting/success/error state wiring");
}

for (const [label, source] of [
  ["QuoteRequestForm", quoteFormSource],
  ["ContactForm", contactFormSource],
  ["SimpleRequestForm", simpleFormSource]
]) {
  if (!source.includes("SourcingIntakeForm")) {
    failures.push(`${label}: expected wrapper to use SourcingIntakeForm`);
  }
}

[
  "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification.",
  "Something went wrong while submitting your request. Please email crazyowenyao@gmail.com directly."
].forEach((message) => {
  if (!submitHelperSource.includes(message)) {
    failures.push(`src/lib/submitBioAxisRequest.ts: missing UI state message "${message}"`);
  }
});

const envLines = envExampleSource
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));
const envMap = new Map(envLines.map((line) => {
  const equalsIndex = line.indexOf("=");
  return equalsIndex === -1 ? [line, ""] : [line.slice(0, equalsIndex), line.slice(equalsIndex + 1)];
}));

[
  "RESEND_API_KEY",
  "BIOAXIS_RFQ_TO_EMAIL",
  "BIOAXIS_RFQ_FROM_EMAIL",
  "BIOAXIS_RFQ_REPLY_TO_EMAIL"
].forEach((name) => {
  if (!envMap.has(name)) {
    failures.push(`.env.example: missing ${name}`);
  }
});

if (envMap.get("RESEND_API_KEY")) {
  failures.push(".env.example: RESEND_API_KEY should be blank");
}

if ([...envMap.keys()].some((name) => name.startsWith("NEXT_PUBLIC_RESEND"))) {
  failures.push(".env.example: must not expose a NEXT_PUBLIC_RESEND key");
}

if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(baseUrl)) {
  const rfqResponse = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "smoke@example.com",
      requestType: "quote",
      productContext: {
        requestType: "quote",
        productName: "Filtered 200 µL Pipette Tips",
        productFamily: "Filtered Pipette Tips",
        productCategory: "Pipette Tips",
        productSegment: "Liquid Handling",
        productUrl: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
        sourcePageUrl: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
        relevantSpecs: ["nominal volume: 200 µL"],
        documentationNotes: ["DNase/RNase-free statement"],
        timestamp: "smoke-test"
      },
      sourcingListItems: [
        {
          title: "Filtered 200 µL Pipette Tips",
          href: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
          segmentTitle: "Liquid Handling",
          categoryTitle: "Pipette Tips",
          familyTitle: "Filtered Pipette Tips",
          productTitle: "Filtered 200 µL Pipette Tips",
          quantity: "1 case",
          currentSupplier: "Current supplier",
          catalogNumber: "ABC-200",
          equivalentNeeded: true,
          sampleNeeded: false,
          documentationNeeded: true,
          sourcePageUrl: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
          addedAt: "smoke-test"
        }
      ]
    })
  });
  const payload = await rfqResponse.json();

  if (!rfqResponse.ok || payload?.ok !== true) {
    failures.push(`/api/rfq: expected success, got ${rfqResponse.status}`);
  } else {
    console.log(`/api/rfq: ${payload.mode ?? "ok"} ${payload.referenceId ?? ""}`.trim());
  }

  const emailOnlyResponse = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "email-only@example.com"
    })
  });
  const emailOnlyPayload = await emailOnlyResponse.json();

  if (!emailOnlyResponse.ok || emailOnlyPayload?.ok !== true) {
    failures.push(`/api/rfq email-only: expected success, got ${emailOnlyResponse.status}`);
  }

  const missingEmailResponse = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requestType: "quote",
      productContext: {
        productName: "Filtered 200 µL Pipette Tips"
      }
    })
  });
  if (missingEmailResponse.status !== 400) {
    failures.push(`/api/rfq missing email: expected HTTP 400, got ${missingEmailResponse.status}`);
  }

  const invalidEmailResponse = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "not-an-email",
      requestType: "quote"
    })
  });
  if (invalidEmailResponse.status !== 400) {
    failures.push(`/api/rfq invalid email: expected HTTP 400, got ${invalidEmailResponse.status}`);
  }

  const honeypotResponse = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "smoke@example.com",
      requestType: "quote",
      website: "filled"
    })
  });
  const honeypotPayload = await honeypotResponse.json();
  if (!honeypotResponse.ok || honeypotPayload?.mode !== "honeypot") {
    failures.push(`/api/rfq honeypot: expected silent honeypot success, got ${honeypotResponse.status}`);
  }

  const legacyResponse = await fetch(new URL("/api/request-quote", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Smoke Test",
      email: "smoke@example.com",
      company: "BioAxis QA",
      requestType: "contact",
      message: "Local smoke test for legacy RFQ compatibility."
    })
  });
  const legacyPayload = await legacyResponse.json();

  if (!legacyResponse.ok || legacyPayload?.ok !== true) {
    failures.push(`/api/request-quote: expected compatibility success, got ${legacyResponse.status}`);
  } else {
    console.log(`/api/request-quote: ${legacyPayload.mode ?? "ok"} ${legacyPayload.referenceId ?? ""}`.trim());
  }
}

if (failures.length > 0) {
  console.error("\nSmoke test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("\nSmoke test passed.");

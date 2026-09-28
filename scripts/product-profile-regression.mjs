import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalResolveFilename = Module._resolveFilename;
const failures = [];

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(process.cwd(), "src", request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};

require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;
  module._compile(compiled, filename);
};

const { getProductItemsForFamily } = require("../src/data/productItems.ts");
const { productCatalogSegments } = require("../src/data/productCatalog.ts");
const cases = [
  {
    label: "PCR plates",
    path: ["molecular-biology-pcr", "pcr-plastics", "96-well-pcr-plates"],
    expected: ["thermal cycler or qPCR system fit", "PCR"],
    forbidden: ["material such as polypropylene"]
  },
  {
    label: "qPCR plates",
    path: ["molecular-biology-pcr", "qpcr-consumables", "qpcr-plates"],
    expected: ["thermal cycler or qPCR system fit", "qPCR"],
    forbidden: ["material such as polypropylene"]
  },
  {
    label: "ELISA plates",
    path: ["assays-detection", "elisa-immunoassays", "elisa-plates"],
    expected: ["signal type", "ELISA"],
    forbidden: ["material such as polypropylene"]
  },
  {
    label: "cell culture plates",
    path: ["cell-culture", "cell-culture-vessels", "multiwell-cell-culture-plates"],
    expected: ["cell type or model", "cell expansion"],
    forbidden: ["material such as polypropylene"]
  },
  {
    label: "lab plasticware tubes",
    path: ["lab-plasticware", "tubes", "microcentrifuge-tubes"],
    expected: ["material such as polypropylene", "sample handling"],
    forbidden: ["thermal cycler or qPCR system fit"]
  }
];

for (const testCase of cases) {
  const [segment, category, family] = testCase.path;
  const general = getProductItemsForFamily(segment, category, family)
    .find((item) => item.slug.endsWith("-general"));

  if (!general) {
    failures.push(`${testCase.label}: generated general configuration is missing`);
    continue;
  }

  const profileText = [
    ...general.details,
    ...general.commonSpecifications,
    ...general.applications
  ].join(" ").toLowerCase();

  for (const expected of testCase.expected) {
    if (!profileText.includes(expected.toLowerCase())) {
      failures.push(`${testCase.label}: expected profile text "${expected}"`);
    }
  }
  for (const forbidden of testCase.forbidden) {
    if (profileText.includes(forbidden.toLowerCase())) {
      failures.push(`${testCase.label}: received unrelated profile text "${forbidden}"`);
    }
  }
  console.log(`${testCase.label}: profile matched`);
}

for (const segment of productCatalogSegments) {
  for (const category of segment.categories) {
    for (const family of category.families) {
      for (const product of family.products) {
        for (const [document, status] of Object.entries(product.documents)) {
          if (status === "available") {
            failures.push(`${product.name}: ${document} is marked available without product-level evidence`);
          }
        }
      }
    }
  }
}

if (failures.length) {
  console.error("Product profile regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Product profile regression passed (${cases.length} sourcing paths).`);

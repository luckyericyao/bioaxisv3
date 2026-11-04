import type { RawSegment } from "./types";

export const buffersChemicalsReagentsSegment: RawSegment = {
  name: "Buffers, Chemicals & Reagents",
  slug: "buffers-chemicals-reagents",
  headline: "Source common buffers, salts, solvents, detergents, biochemical reagents, and ready-to-use workflow reagents.",
  shortDescription: "Buffers, chemicals, and reagents organized by grade, purity, concentration, sterility, storage condition, and documentation availability.",
  buyerUseCases: ["buffer preparation", "protein workflows", "cell culture support", "molecular biology", "analytical workflows"],
  buyerSpecs: ["grade", "purity", "concentration", "sterility", "endotoxin", "molecular biology grade", "cell culture grade", "packaging size", "storage condition", "CoA/SDS availability"],
  commonFormats: ["powder", "solution", "ready-to-use buffer", "solvent bottle", "bulk pack", "custom pack"],
  applications: ["buffer prep", "cell culture", "molecular biology", "protein analysis", "analytical chemistry"],
  documentationNeeds: ["CoA where available", "SDS", "grade and purity information", "storage condition", "lot traceability"],
  relatedSegments: ["molecular-biology-pcr", "proteins-antibodies-immunology", "cell-culture", "sample-prep-filtration"],
  subcategories: [
    { name: "Common Buffers", slug: "common-buffers", families: ["pbs", "tris-buffer", "hepes-buffer", "tbs", "citrate-buffer"] },
    { name: "Salts and Chemicals", slug: "salts-and-chemicals", families: ["sodium-chloride", "potassium-chloride", "magnesium-chloride", "edta"] },
    { name: "Solvents", slug: "solvents", families: ["ethanol", "methanol", "dmso", "acetonitrile", "water-for-lab-use"] },
    { name: "Detergents and Surfactants", slug: "detergents-surfactants", families: ["tween-20", "triton-x-100-alternatives", "sds", "chaps"] },
    { name: "Biochemical Reagents", slug: "biochemical-reagents", families: ["amino-acids", "nucleotides", "enzyme-substrates", "inhibitors"] },
    { name: "Ready-to-Use Reagents", slug: "ready-to-use-reagents", families: ["blocking-buffers", "wash-buffers", "lysis-buffers", "loading-buffers"] }
  ]
};

import type { RawSegment } from "./types";

export const assaysDetectionSegment: RawSegment = {
  name: "Assays & Detection",
  slug: "assays-detection",
  headline: "Source ELISA, cell-based assay, fluorescence, luminescence, plate reader, stain, dye, and Western blot detection products.",
  shortDescription: "Assay and detection consumables organized by signal type, plate color, readout, sensitivity, surface treatment, and sample type.",
  buyerUseCases: ["ELISA", "cell-based assays", "plate reader workflows", "Western blot detection", "staining and labeling"],
  buyerSpecs: ["assay format", "plate color", "surface treatment", "reader compatibility", "signal type", "sensitivity", "sample type", "storage condition"],
  commonFormats: ["assay plate", "kit", "buffer", "substrate", "dye", "membrane"],
  applications: ["immunoassays", "viability testing", "cytotoxicity testing", "fluorescence detection", "chemiluminescent detection"],
  documentationNeeds: ["assay format information", "storage condition", "CoA where available", "sample type guidance", "lot traceability"],
  relatedSegments: ["proteins-antibodies-immunology", "cell-culture", "buffers-chemicals-reagents", "automation-consumables"],
  subcategories: [
    { name: "ELISA and Immunoassays", slug: "elisa-immunoassays", families: ["elisa-plates", "elisa-kits", "blocking-buffers", "wash-buffers"] },
    { name: "Cell-Based Assays", slug: "cell-based-assays", families: ["viability-assays", "cytotoxicity-assays", "apoptosis-assays", "proliferation-assays"] },
    { name: "Fluorescence and Luminescence", slug: "fluorescence-luminescence", families: ["fluorescence-assay-plates", "luminescence-assay-plates", "detection-reagents", "substrate-reagents"] },
    { name: "Plate Reader Consumables", slug: "plate-reader-consumables", families: ["black-assay-plates", "white-assay-plates", "clear-bottom-plates", "low-volume-assay-plates"] },
    { name: "Stains and Dyes", slug: "stains-and-dyes", families: ["dna-stains", "protein-stains", "cell-viability-dyes", "fluorescent-labeling-reagents"] },
    { name: "Western Blot Detection", slug: "western-blot-detection", families: ["western-blot-membranes", "chemiluminescent-substrates", "blocking-reagents", "transfer-buffers"] }
  ]
};

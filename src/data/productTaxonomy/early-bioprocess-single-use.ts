import type { RawSegment } from "./types";

export const earlyBioprocessSingleUseSegment: RawSegment = {
  name: "Early Bioprocess & Single-Use",
  slug: "early-bioprocess-single-use",
  headline: "Source single-use bags, tubing, connectors, filtration assemblies, sampling sets, and process development consumables.",
  shortDescription: "Early bioprocess consumables organized by sterility, tubing material, connector type, closed-system compatibility, and development scale.",
  buyerUseCases: ["process development", "single-use fluid transfer", "sterile sampling", "small-scale filtration", "scale-down models"],
  buyerSpecs: ["sterile", "gamma irradiated", "USP Class VI", "extractables/leachables", "tubing material", "connector type", "closed-system compatibility", "process development scale"],
  commonFormats: ["single-use bag", "tubing", "connector", "filter assembly", "sampling set", "process plate"],
  applications: ["early process development", "buffer and media handling", "sampling", "clarification", "small-scale bioprocess"],
  documentationNeeds: ["sterility statement", "material declaration", "USP Class VI information where available", "extractables/leachables information where relevant", "lot traceability"],
  relatedSegments: ["cell-culture", "sample-prep-filtration", "buffers-chemicals-reagents", "storage-cryopreservation"],
  subcategories: [
    { name: "Single-Use Bags", slug: "single-use-bags", families: ["media-bags", "buffer-bags", "storage-bags", "sampling-bags"] },
    { name: "Tubing and Connectors", slug: "tubing-connectors", families: ["silicone-tubing", "tpe-tubing", "aseptic-connectors", "luer-connectors"] },
    { name: "Filtration Assemblies", slug: "filtration-assemblies", families: ["sterile-filter-assemblies", "capsule-filters", "vent-filters", "depth-filter-units"] },
    { name: "Small-Scale Bioreactor Consumables", slug: "small-scale-bioreactor-consumables", families: ["shake-flask-consumables", "single-use-bioreactor-bags", "sampling-accessories", "feed-bottles"] },
    { name: "Sampling and Transfer", slug: "sampling-transfer", families: ["sterile-sampling-bags", "transfer-sets", "syringe-assemblies", "closed-system-sampling-kits"] },
    { name: "Process Development Consumables", slug: "process-development-consumables", families: ["high-throughput-process-plates", "clarification-consumables", "buffer-prep-consumables", "scale-down-model-consumables"] }
  ]
};

import type { RawSegment } from "./types";

export const samplePrepFiltrationSegment: RawSegment = {
  name: "Sample Prep & Filtration",
  slug: "sample-prep-filtration",
  headline: "Source syringe filters, centrifugal filters, vacuum filtration, membranes, sample cleanup products, and cell strainers.",
  shortDescription: "Sample prep and filtration products organized by membrane material, pore size, chemical compatibility, sterility, and binding profile.",
  buyerUseCases: ["sample clarification", "sterile filtration", "protein concentration", "analytical sample prep", "cell straining"],
  buyerSpecs: ["membrane material", "pore size", "diameter", "sterile/non-sterile", "protein binding", "chemical compatibility", "flow rate", "extractables/leachables where relevant"],
  commonFormats: ["syringe filter", "centrifugal device", "vacuum unit", "membrane disc", "spin column", "cell strainer"],
  applications: ["sample cleanup", "cell culture filtration", "analytical prep", "protein concentration", "cell suspension prep"],
  documentationNeeds: ["membrane material information", "sterility statement", "CoA where available", "chemical compatibility guidance", "extractables/leachables information where relevant"],
  relatedSegments: ["cell-culture", "assays-detection", "proteins-antibodies-immunology", "early-bioprocess-single-use"],
  subcategories: [
    { name: "Syringe Filters", slug: "syringe-filters", families: ["pes-syringe-filters", "pvdf-syringe-filters", "ptfe-syringe-filters", "nylon-syringe-filters", "sterile-syringe-filters"] },
    { name: "Centrifugal Filters", slug: "centrifugal-filters", families: ["protein-concentrators", "dna-rna-concentrators", "centrifugal-ultrafiltration-devices", "spin-columns"] },
    { name: "Bottle-Top and Vacuum Filtration", slug: "bottle-top-vacuum-filtration", families: ["bottle-top-filters", "vacuum-filter-units", "sterile-filtration-units", "receiver-bottles"] },
    { name: "Membranes and Filter Papers", slug: "membranes-filter-papers", families: ["nitrocellulose-membranes", "pvdf-membranes", "glass-fiber-filters", "qualitative-filter-paper"] },
    { name: "Sample Cleanup", slug: "sample-cleanup", families: ["desalting-columns", "cleanup-spin-columns", "protein-precipitation-plates", "spe-plates"] },
    { name: "Cell Strainers", slug: "cell-strainers", families: ["40um-cell-strainers", "70um-cell-strainers", "100um-cell-strainers", "sterile-cell-strainers"] }
  ]
};

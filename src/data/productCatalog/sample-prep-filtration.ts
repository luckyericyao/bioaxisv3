import type { SegmentSeed } from "./types";

export const samplePrepFiltrationSeed: SegmentSeed = {
  index: "05",
  slug: "sample-prep-filtration",
  name: "Sample Prep & Filtration",
  shortDescription: "Syringe filters, centrifugal filters, bottle-top filters, spin columns, cleanup plates, and membranes.",
  heroDescription:
    "Source syringe filters, centrifugal filters, vacuum filtration, membranes, sample cleanup products, and cell strainers by membrane, pore size, sterility, and documentation needs.",
  categories: [
    {
      slug: "syringe-filters",
      name: "Syringe Filters",
      description: "PES, PVDF, PTFE, nylon, and sterile syringe filters for aqueous, solvent, and biological sample prep.",
      tags: ["PES", "PVDF", "PTFE", "0.22 µm", "0.45 µm"],
      families: [
        { slug: "pes-syringe-filters", name: "PES Syringe Filters", typicalSpecs: ["low protein binding", "aqueous samples", "sterile option"] },
        { slug: "pvdf-syringe-filters", name: "PVDF Syringe Filters", typicalSpecs: ["protein compatibility", "0.22 / 0.45 µm", "sample cleanup"] },
        { slug: "ptfe-syringe-filters", name: "PTFE Syringe Filters", typicalSpecs: ["solvent compatibility", "hydrophobic", "analytical prep"] }
      ]
    },
    {
      slug: "centrifugal-filters",
      name: "Centrifugal Filters",
      description: "Protein concentrators, DNA/RNA concentrators, ultrafiltration devices, and spin columns.",
      tags: ["MWCO", "spin column", "protein", "DNA/RNA"],
      families: [
        { slug: "protein-concentrators", name: "Protein Concentrators", typicalSpecs: ["MWCO", "sample volume", "low binding"] },
        { slug: "dna-rna-concentrators", name: "DNA/RNA Concentrators", typicalSpecs: ["nucleic acid cleanup", "column format", "recovery"] },
        { slug: "centrifugal-ultrafiltration-devices", name: "Centrifugal Ultrafiltration Devices", typicalSpecs: ["MWCO", "centrifuge fit", "hold-up volume"] }
      ]
    },
    {
      slug: "bottle-top-filters",
      name: "Bottle-Top Filters",
      description: "Bottle-top and vacuum filter units for larger-volume sterile or clarification workflows.",
      tags: ["vacuum", "sterile", "receiver bottle", "media prep"],
      families: [
        { slug: "bottle-top-filter-units", name: "Bottle-Top Filter Units", typicalSpecs: ["membrane material", "receiver fit", "volume"] },
        { slug: "vacuum-filter-units", name: "Vacuum Filter Units", typicalSpecs: ["sterile option", "membrane", "throughput"] },
        { slug: "sterile-filtration-units", name: "Sterile Filtration Units", typicalSpecs: ["sterile", "media / buffer filtration", "packaging"] }
      ]
    },
    {
      slug: "spin-columns",
      name: "Spin Columns",
      description: "Cleanup, desalting, and workflow-specific spin columns for sample preparation.",
      tags: ["cleanup", "desalting", "binding matrix", "sample prep"],
      families: [
        { slug: "cleanup-spin-columns", name: "Cleanup Spin Columns", typicalSpecs: ["sample type", "binding chemistry", "elution volume"] },
        { slug: "desalting-columns", name: "Desalting Columns", typicalSpecs: ["protein / buffer exchange", "capacity", "recovery"] },
        { slug: "workflow-specific-spin-columns", name: "Workflow-Specific Spin Columns", typicalSpecs: ["protocol fit", "sample input", "documentation"] }
      ]
    },
    {
      slug: "filter-plates",
      name: "Filter Plates",
      description: "Filter plates and cleanup plates for higher-throughput sample preparation workflows.",
      tags: ["96-well", "SPE", "protein precipitation", "automation"],
      families: [
        { slug: "sample-cleanup-plates", name: "Sample Cleanup Plates", typicalSpecs: ["96-well", "matrix compatibility", "automation fit"] },
        { slug: "protein-precipitation-plates", name: "Protein Precipitation Plates", typicalSpecs: ["bioanalysis", "filtration", "collection plate fit"] },
        { slug: "spe-plates", name: "SPE Plates", typicalSpecs: ["sorbent chemistry", "96-well", "method compatibility"] }
      ]
    }
  ]
};

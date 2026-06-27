export type DocumentStatus = "available" | "request_required" | "supplier_dependent";

export type ProductDocuments = {
  sds?: DocumentStatus;
  coa?: DocumentStatus;
  specificationSheet?: DocumentStatus;
  sterilityStatement?: DocumentStatus;
  animalOriginStatement?: DocumentStatus;
  lotLevelDocumentation?: DocumentStatus;
};

export type ProductCatalogItem = {
  id: string;
  slug: string;
  name: string;
  supplier?: string;
  catalogNumber?: string;
  description: string;
  productType: string;
  specs: Record<string, string | string[]>;
  tags: string[];
  documents: ProductDocuments;
  actions: {
    quote: boolean;
    equivalent: boolean;
    sample: boolean;
    documents: boolean;
    recurringSupply: boolean;
  };
};

export type ProductCatalogFamily = {
  id: string;
  slug: string;
  name: string;
  description: string;
  typicalSpecs: string[];
  products: ProductCatalogItem[];
};

export type ProductCatalogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  families: ProductCatalogFamily[];
};

export type ProductCatalogSegment = {
  id: string;
  slug: string;
  index: string;
  name: string;
  shortDescription: string;
  heroDescription: string;
  categories: ProductCatalogCategory[];
};

export type ProductCatalogFilters = {
  productType?: string[];
  supplier?: string[];
  format?: string[];
  sterility?: string[];
  material?: string[];
  volumeSize?: string[];
  application?: string[];
  documentation?: string[];
  packaging?: string[];
  automationCompatible?: string[];
  query?: string;
};

type FamilySeed = {
  slug: string;
  name: string;
  description?: string;
  typicalSpecs?: string[];
  productNames?: ProductNameSeed[];
};

type ProductNameSeed = {
  slug: string;
  name: string;
  specs?: Record<string, string | string[]>;
  tags?: string[];
};

type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  families: FamilySeed[];
};

type SegmentSeed = {
  slug: string;
  index: string;
  name: string;
  shortDescription: string;
  heroDescription: string;
  categories: CategorySeed[];
};

const actions = {
  quote: true,
  equivalent: true,
  sample: true,
  documents: true,
  recurringSupply: true
};

const defaultDocuments: ProductDocuments = {
  sds: "available",
  coa: "request_required",
  specificationSheet: "available",
  sterilityStatement: "supplier_dependent",
  animalOriginStatement: "supplier_dependent",
  lotLevelDocumentation: "request_required"
};

const catalogSeeds: SegmentSeed[] = [
  {
    index: "01",
    slug: "liquid-handling",
    name: "Liquid Handling",
    shortDescription: "Pipette tips, serological pipettes, reservoirs, dispensers, and robotic liquid handling formats.",
    heroDescription:
      "Source pipette tips, serological pipettes, reservoirs, robotic tips, and liquid handling accessories with quote-ready specifications.",
    categories: [
      {
        slug: "pipette-tips",
        name: "Pipette Tips",
        description: "Universal pipette tips, filtered tips, low retention tips, extended length tips, and sterile formats.",
        tags: ["sterile", "filtered", "low-retention", "bulk", "rack"],
        families: [
          {
            slug: "universal-pipette-tips",
            name: "Universal Pipette Tips",
            typicalSpecs: ["universal fit", "sterile / non-sterile", "racked / reload / bulk"],
            productNames: [
              {
                slug: "sterile-filtered-universal-pipette-tips",
                name: "Sterile Filtered Universal Pipette Tips",
                specs: {
                  "Product Type": "Pipette tips",
                  Format: "Racked",
                  Sterility: "Sterile",
                  Compatibility: "Universal / automation-compatible",
                  Packaging: "Rack / refill / bulk",
                  Documentation: "SDS / CoA on request"
                },
                tags: ["sterile", "filtered", "universal", "racked"]
              }
            ]
          },
          { slug: "filtered-pipette-tips", name: "Filtered Pipette Tips", typicalSpecs: ["aerosol barrier", "PCR-clean", "DNase/RNase-free"] },
          { slug: "low-retention-pipette-tips", name: "Low Retention Pipette Tips", typicalSpecs: ["low-binding surface", "viscous samples", "protein / nucleic acid workflows"] },
          { slug: "extended-length-pipette-tips", name: "Extended Length Pipette Tips", typicalSpecs: ["deep vessel access", "extended reach", "manual or robotic use"] },
          { slug: "sterile-pipette-tips", name: "Sterile Pipette Tips", typicalSpecs: ["sterile", "individually racked", "cell culture / molecular workflow"] },
          { slug: "reload-and-bulk-pipette-tips", name: "Reload and Bulk Pipette Tips", typicalSpecs: ["reload stack", "bulk bag", "rack refill planning"] }
        ]
      },
      {
        slug: "serological-pipettes",
        name: "Serological Pipettes",
        description: "Sterile serological pipettes for cell culture transfer, media handling, and liquid dispensing.",
        tags: ["1 mL", "5 mL", "10 mL", "25 mL", "50 mL"],
        families: [
          { slug: "1ml-serological-pipettes", name: "1 mL Serological Pipettes", typicalSpecs: ["sterile", "graduated", "individually wrapped"] },
          { slug: "10ml-serological-pipettes", name: "10 mL Serological Pipettes", typicalSpecs: ["sterile", "polystyrene", "color-coded"] },
          { slug: "25ml-serological-pipettes", name: "25 mL Serological Pipettes", typicalSpecs: ["sterile", "bulk case", "media transfer"] }
        ]
      },
      {
        slug: "pipettes-and-controllers",
        name: "Pipettes and Controllers",
        description: "Manual pipettes, multichannel pipettes, electronic pipettes, and pipette controllers for lab workflows.",
        tags: ["single-channel", "multichannel", "electronic", "controller"],
        families: [
          { slug: "single-channel-pipettes", name: "Single-Channel Pipettes", typicalSpecs: ["adjustable volume", "calibration support", "ergonomic design"] },
          { slug: "multichannel-pipettes", name: "Multichannel Pipettes", typicalSpecs: ["8-channel", "12-channel", "plate workflow"] },
          { slug: "pipette-controllers", name: "Pipette Controllers", typicalSpecs: ["serological pipette fit", "speed control", "bench charging"] }
        ]
      },
      {
        slug: "reagent-reservoirs",
        name: "Reagent Reservoirs",
        description: "Disposable reservoirs for manual and automated liquid handling, including sterile and low-dead-volume formats.",
        tags: ["single-channel", "multi-channel", "sterile", "low-dead-volume"],
        families: [
          { slug: "single-channel-reservoirs", name: "Single-Channel Reservoirs", typicalSpecs: ["standard trough", "manual pipetting", "bulk pack"] },
          { slug: "multi-channel-reservoirs", name: "Multi-Channel Reservoirs", typicalSpecs: ["divided channels", "reagent separation", "plate setup"] },
          { slug: "sterile-reagent-reservoirs", name: "Sterile Reagent Reservoirs", typicalSpecs: ["sterile", "individually wrapped", "cell culture use"] }
        ]
      },
      {
        slug: "automation-liquid-handling-tips",
        name: "Automation Liquid Handling Tips",
        description: "Robotic tips for common automated liquid handling workflows and platform-specific fit review.",
        tags: ["Hamilton", "Tecan", "Beckman", "Agilent", "conductive"],
        families: [
          { slug: "hamilton-compatible-tips", name: "Hamilton-Compatible Tips", typicalSpecs: ["conductive", "filtered", "rack geometry"] },
          { slug: "tecan-compatible-tips", name: "Tecan-Compatible Tips", typicalSpecs: ["conductive", "sterile option", "platform fit"] },
          { slug: "beckman-compatible-tips", name: "Beckman-Compatible Tips", typicalSpecs: ["automation deck fit", "filtered option", "sample testing"] }
        ]
      }
    ]
  },
  {
    index: "02",
    slug: "lab-plasticware",
    name: "Lab Plasticware",
    shortDescription: "Tubes, plates, bottles, racks, sealing films, and everyday plasticware for sample handling.",
    heroDescription:
      "Source tubes, plates, bottles, sealing films, racks, and general labware by material, footprint, sterility, and packaging format.",
    categories: [
      {
        slug: "tubes",
        name: "Tubes",
        description: "Microcentrifuge, conical, screw-cap, snap-cap, and round-bottom tube formats.",
        tags: ["microcentrifuge", "conical", "screw-cap", "snap-cap"],
        families: [
          { slug: "microcentrifuge-tubes", name: "Microcentrifuge Tubes", typicalSpecs: ["0.5 mL / 1.5 mL / 2 mL", "polypropylene", "low-bind option"] },
          { slug: "conical-centrifuge-tubes", name: "Conical Centrifuge Tubes", typicalSpecs: ["15 mL / 50 mL", "sterile option", "centrifuge-rated"] },
          { slug: "screw-cap-tubes", name: "Screw-Cap Tubes", typicalSpecs: ["leak-resistant", "storage", "sample handling"] }
        ]
      },
      {
        slug: "plates",
        name: "Plates",
        description: "Assay, storage, and deep-well plate formats with footprint, well count, and material review.",
        tags: ["96-well", "384-well", "deep-well", "SBS"],
        families: [
          { slug: "96-well-plates", name: "96-Well Plates", typicalSpecs: ["flat / round / V-bottom", "treated option", "plate reader fit"] },
          { slug: "384-well-plates", name: "384-Well Plates", typicalSpecs: ["high-density format", "automation", "low volume"] },
          { slug: "deep-well-plates", name: "Deep-Well Plates", typicalSpecs: ["1 mL / 2 mL", "storage", "sealing mat fit"] }
        ]
      },
      {
        slug: "bottles-and-containers",
        name: "Bottles and Containers",
        description: "Media bottles, reagent bottles, storage bottles, and carboys for lab operations.",
        tags: ["media bottle", "reagent bottle", "carboy", "storage"],
        families: [
          { slug: "media-bottles", name: "Media Bottles", typicalSpecs: ["sterile option", "PET / PC", "cap format"] },
          { slug: "reagent-bottles", name: "Reagent Bottles", typicalSpecs: ["wide-mouth", "chemical compatibility", "pack size"] },
          { slug: "carboys", name: "Carboys", typicalSpecs: ["large volume", "spigot option", "storage"] }
        ]
      },
      {
        slug: "sealing-films-and-mats",
        name: "Sealing Films and Mats",
        description: "Adhesive seals, breathable films, aluminum seals, and silicone mats for plates and storage.",
        tags: ["adhesive", "breathable", "aluminum", "silicone"],
        families: [
          { slug: "adhesive-plate-seals", name: "Adhesive Plate Seals", typicalSpecs: ["PCR / storage", "peelable", "plate fit"] },
          { slug: "breathable-films", name: "Breathable Films", typicalSpecs: ["cell culture", "gas exchange", "sterile handling"] },
          { slug: "silicone-sealing-mats", name: "Silicone Sealing Mats", typicalSpecs: ["reusable option", "deep-well fit", "temperature range"] }
        ]
      },
      {
        slug: "racks-and-holders",
        name: "Racks and Holders",
        description: "Tube racks, freezer boxes, plate stands, and holders for bench and storage workflows.",
        tags: ["tube rack", "freezer box", "plate stand", "holder"],
        families: [
          { slug: "tube-racks", name: "Tube Racks", typicalSpecs: ["tube size", "material", "color coding"] },
          { slug: "freezer-boxes", name: "Freezer Boxes", typicalSpecs: ["2-inch / 3-inch", "grid format", "storage temperature"] },
          { slug: "plate-stands", name: "Plate Stands", typicalSpecs: ["SBS plate", "bench workflow", "stacking"] }
        ]
      }
    ]
  },
  {
    index: "03",
    slug: "cell-culture",
    name: "Cell Culture",
    shortDescription: "Media, buffers, sera, supplements, plastics, inserts, and cryopreservation support.",
    heroDescription:
      "Source culture vessels, media, sera, dissociation products, freezing supplies, coatings, and stem cell culture reagents with documentation-aware sourcing.",
    categories: [
      {
        slug: "cell-culture-media-buffers",
        name: "Cell Culture Media & Buffers",
        description: "Classical media, balanced salt solutions, buffers, serum-free formats, and specialty media.",
        tags: ["liquid", "powder", "with L-glutamine", "without phenol red", "sterile-filtered"],
        families: [
          {
            slug: "classical-media",
            name: "Classical Media",
            description: "DMEM, RPMI-1640, MEM, Ham's F-12, M199, and related basal media formats.",
            typicalSpecs: ["liquid / powder", "with L-glutamine", "without phenol red", "sterile-filtered"],
            productNames: [
              {
                slug: "dmem-high-glucose",
                name: "DMEM High Glucose",
                specs: {
                  "Product Type": "Classical media",
                  Format: "Liquid / powder option",
                  Sterility: "Sterile-filtered where applicable",
                  "Volume / Size": "Bottle / bag / bulk pack review",
                  Application: "Routine mammalian cell culture",
                  Documentation: "SDS / CoA / origin documentation on request"
                },
                tags: ["DMEM", "high glucose", "classical media", "sterile-filtered"]
              }
            ]
          },
          { slug: "balanced-salt-solutions", name: "Balanced Salt Solutions", typicalSpecs: ["DPBS / HBSS", "calcium / magnesium option", "sterile liquid"] },
          { slug: "serum-free-media", name: "Serum-Free Media", typicalSpecs: ["serum-free", "cell-type fit", "sample-first review"] }
        ]
      },
      {
        slug: "cell-culture-supplements",
        name: "Cell Culture Supplements",
        description: "Supplements, antibiotics, growth factors, and culture support reagents.",
        tags: ["L-glutamine", "HEPES", "antibiotic", "growth support"],
        families: [
          { slug: "l-glutamine-supplements", name: "L-Glutamine Supplements", typicalSpecs: ["liquid", "sterile", "media support"] },
          { slug: "antibiotics-antimycotics", name: "Antibiotics and Antimycotics", typicalSpecs: ["penicillin-streptomycin", "amphotericin", "culture support"] },
          { slug: "growth-factor-supplements", name: "Growth Factor Supplements", typicalSpecs: ["cell-type dependent", "storage condition", "documentation review"] }
        ]
      },
      {
        slug: "sera-serum-alternatives",
        name: "Sera & Serum Alternatives",
        description: "FBS, qualified sera, dialyzed sera, and serum replacement products.",
        tags: ["FBS", "dialyzed", "qualified", "serum replacement"],
        families: [
          { slug: "fetal-bovine-serum", name: "Fetal Bovine Serum", typicalSpecs: ["origin", "heat-inactivated option", "lot documentation"] },
          { slug: "dialyzed-serum", name: "Dialyzed Serum", typicalSpecs: ["dialyzed", "cell culture", "lot review"] },
          { slug: "serum-replacement-products", name: "Serum Replacement Products", typicalSpecs: ["defined format", "serum reduction", "sample review"] }
        ]
      },
      {
        slug: "cell-culture-plastics",
        name: "Cell Culture Plastics",
        description: "Flasks, dishes, plates, roller bottles, and cell factory style vessels.",
        tags: ["treated surface", "flask", "dish", "plate", "roller bottle"],
        families: [
          { slug: "tissue-culture-flasks", name: "Tissue Culture Flasks", typicalSpecs: ["treated surface", "vented cap", "sterile"] },
          { slug: "cell-culture-dishes", name: "Cell Culture Dishes", typicalSpecs: ["surface treatment", "diameter", "sterile"] },
          { slug: "multiwell-cell-culture-plates", name: "Multiwell Cell Culture Plates", typicalSpecs: ["6 / 12 / 24 / 96 well", "treated", "sterile"] }
        ]
      },
      {
        slug: "cryopreservation",
        name: "Cryopreservation",
        description: "Cell freezing media, cryovials, controlled-rate containers, and thawing support.",
        tags: ["freezing media", "cryovial", "controlled-rate", "cell banking"],
        families: [
          { slug: "cell-freezing-media", name: "Cell Freezing Media", typicalSpecs: ["serum-free option", "DMSO option", "cell banking"] },
          { slug: "cryogenic-vials", name: "Cryogenic Vials", typicalSpecs: ["sterile", "internal / external thread", "storage fit"] },
          { slug: "controlled-rate-freezing-containers", name: "Controlled-Rate Freezing Containers", typicalSpecs: ["freezing profile", "vial fit", "workflow review"] }
        ]
      }
    ]
  },
  {
    index: "04",
    slug: "molecular-biology-pcr",
    name: "Molecular Biology & PCR",
    shortDescription: "PCR plastics, qPCR consumables, extraction kits, electrophoresis reagents, and nuclease-free buffers.",
    heroDescription:
      "Source PCR tubes, plates, seals, qPCR formats, extraction consumables, and molecular biology reagents by instrument fit and documentation needs.",
    categories: [
      {
        slug: "pcr-plastics",
        name: "PCR Plastics",
        description: "PCR tubes, strips, plates, and optical seals by profile, skirt style, and instrument compatibility.",
        tags: ["PCR-clean", "96-well", "384-well", "optical", "seal fit"],
        families: [
          { slug: "pcr-tubes", name: "PCR Tubes", typicalSpecs: ["0.2 mL", "thin-wall", "PCR-clean"] },
          { slug: "pcr-strips", name: "PCR Strips", typicalSpecs: ["8-strip", "attached cap option", "thermal cycler fit"] },
          { slug: "96-well-pcr-plates", name: "96-Well PCR Plates", typicalSpecs: ["skirted / semi-skirted", "profile height", "seal fit"] }
        ]
      },
      {
        slug: "qpcr-consumables",
        name: "qPCR Consumables",
        description: "Optical qPCR plates, tubes, films, and low-profile plastics for instrument readout.",
        tags: ["optical", "low-profile", "qPCR", "evaporation control"],
        families: [
          { slug: "qpcr-plates", name: "qPCR Plates", typicalSpecs: ["optical", "instrument fit", "low evaporation"] },
          { slug: "qpcr-tubes", name: "qPCR Tubes", typicalSpecs: ["optical caps", "tube strips", "instrument fit"] },
          { slug: "optical-sealing-films", name: "Optical Sealing Films", typicalSpecs: ["adhesive", "optical clarity", "seal performance"] }
        ]
      },
      {
        slug: "nucleic-acid-extraction",
        name: "Nucleic Acid Extraction",
        description: "DNA, RNA, plasmid, and magnetic bead extraction formats for sample prep workflows.",
        tags: ["DNA", "RNA", "plasmid", "magnetic bead"],
        families: [
          { slug: "dna-extraction-kits", name: "DNA Extraction Kits", typicalSpecs: ["sample type", "column / magnetic", "yield review"] },
          { slug: "rna-extraction-kits", name: "RNA Extraction Kits", typicalSpecs: ["RNase control", "sample type", "purity"] },
          { slug: "plasmid-prep-kits", name: "Plasmid Prep Kits", typicalSpecs: ["mini / midi / maxi", "endotoxin option", "sample volume"] }
        ]
      },
      {
        slug: "electrophoresis-gel-analysis",
        name: "Electrophoresis and Gel Analysis",
        description: "Agarose, ladders, stains, and loading dyes for molecular analysis.",
        tags: ["agarose", "DNA ladder", "gel stain", "loading dye"],
        families: [
          { slug: "agarose", name: "Agarose", typicalSpecs: ["molecular biology grade", "gel strength", "pack size"] },
          { slug: "dna-ladders", name: "DNA Ladders", typicalSpecs: ["range", "ready-to-load", "storage"] },
          { slug: "gel-stains", name: "Gel Stains", typicalSpecs: ["safe stain", "sensitivity", "storage"] }
        ]
      },
      {
        slug: "molecular-biology-water-buffers",
        name: "Molecular Biology Water and Buffers",
        description: "Nuclease-free water, TE buffer, PBS, and Tris buffers for molecular workflows.",
        tags: ["nuclease-free", "TE", "PBS", "Tris"],
        families: [
          { slug: "nuclease-free-water", name: "Nuclease-Free Water", typicalSpecs: ["DNase/RNase-free", "sterile option", "pack size"] },
          { slug: "te-buffer", name: "TE Buffer", typicalSpecs: ["pH", "molecular biology grade", "pack size"] },
          { slug: "tris-buffers", name: "Tris Buffers", typicalSpecs: ["pH", "concentration", "CoA/SDS"] }
        ]
      }
    ]
  },
  {
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
  }
];

const supplementalMenuSegments: ProductCatalogSegment[] = [
  menuOnlySegment("06", "storage-cryopreservation", "Storage & Cryopreservation", "Cryovials, freezer boxes, storage tubes, seals, and cold-chain sample storage formats.", ["Cryogenic Vials", "Freezer Boxes", "Storage Tubes", "Plate Seals", "Freezing Media", "Cold Chain Supplies"]),
  menuOnlySegment("07", "assays-detection", "Assay & Detection", "Plate-based assay, detection, ELISA, and reader-compatible consumable formats.", ["ELISA Plates", "Assay Plates", "Detection Reagents", "Plate Seals", "Reader Accessories", "Immunoassay Consumables"]),
  menuOnlySegment("08", "early-bioprocess-single-use", "Bioprocess Consumables", "Single-use bags, tubing, connectors, sampling, and early process-development consumables.", ["Single-Use Bags", "Tubing", "Connectors", "Sampling Supplies", "Filter Assemblies", "Process Bottles"]),
  menuOnlySegment("09", "safety-cleanroom", "Safety & Cleanroom", "Selected PPE, cleanroom-compatible consumables, wipes, and contamination-control sourcing discussions.", ["Cleanroom Wipes", "Gloves", "Sleeves", "Masks", "Sterile Packs", "Contamination Control"]),
  menuOnlySegment("10", "general-lab-supplies", "General Lab Supplies", "Routine bench consumables, small tools, labels, storage accessories, and replenishment lines.", ["Labels", "Bench Tools", "Weighing Supplies", "Storage Accessories", "Racks", "General Consumables"]),
  menuOnlySegment("11", "private-label", "Private Label / OEM", "Private-label, neutral-label, and OEM-style consumable sourcing discussions for selected categories.", ["Pipette Tips", "Tubes and Plates", "Filtration", "PCR Plastics", "Packaging Review", "Documentation"]),
  menuOnlySegment("12", "documents-compliance", "Documents & Compliance", "Documentation-oriented requests for CoA, SDS, sterility, material, and supplier-dependent files.", ["CoA", "SDS", "Sterility Statement", "Material Declaration", "Lot-Level Documents", "Supplier Review"])
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function menuOnlySegment(index: string, slug: string, name: string, shortDescription: string, categories: string[]): ProductCatalogSegment {
  return {
    id: slug,
    slug,
    index,
    name,
    shortDescription,
    heroDescription: shortDescription,
    categories: categories.map((categoryName) => {
      const categorySlug = slugify(categoryName);
      return {
        id: categorySlug,
        slug: categorySlug,
        name: categoryName,
        description: `${categoryName} sourcing context can be reviewed through BioAxis RFQ, equivalent, sample, or documentation workflows.`,
        tags: ["sourcing review", "documentation", "RFQ"],
        families: []
      };
    })
  };
}

function makeCatalogProduct(segment: SegmentSeed, category: CategorySeed, family: FamilySeed, index: number, override?: ProductNameSeed): ProductCatalogItem {
  const baseNames = [
    `${family.name} General Configuration`,
    `Sterile ${family.name}`,
    `Documentation-Ready ${family.name}`
  ];
  const name = override?.name ?? baseNames[index - 1] ?? `${family.name} Configuration ${index}`;
  const slug = override?.slug ?? slugify(name);
  const tags = override?.tags ?? [...category.tags.slice(0, 3), ...(family.typicalSpecs?.slice(0, 2) ?? [])].slice(0, 6);
  const specs = {
    "Product Type": family.name,
    Format: family.typicalSpecs?.[0] ?? category.tags[0] ?? "Format review required",
    Sterility: tags.some((tag) => /sterile/i.test(tag)) ? "Sterile option" : "Sterile / non-sterile review",
    Material: materialFor(segment.slug),
    "Volume / Size": "Size and pack format reviewed during RFQ",
    Application: category.description,
    Packaging: tags.find((tag) => /rack|bulk|bottle|plate|tube|bag/i.test(tag)) ?? "Packaging supplier dependent",
    Documentation: "SDS / CoA / specification sheet reviewed on request",
    "Compatible Platforms": compatibilityFor(segment.slug)
  };

  return {
    id: `${segment.slug}-${category.slug}-${family.slug}-${slug}`,
    slug,
    name,
    supplier: "Supplier dependent",
    catalogNumber: "Catalog number required",
    description:
      override?.specs?.Description?.toString() ??
      `${name} sourcing profile for ${category.name.toLowerCase()} requests, equivalent review, documentation checks, and quote preparation.`,
    productType: family.name,
    specs: { ...specs, ...(override?.specs ?? {}) },
    tags,
    documents: {
      ...defaultDocuments,
      sterilityStatement: tags.some((tag) => /sterile/i.test(tag)) ? "request_required" : "supplier_dependent"
    },
    actions
  };
}

function materialFor(segmentSlug: string) {
  if (segmentSlug === "sample-prep-filtration") return "Membrane / housing supplier dependent";
  if (segmentSlug === "cell-culture") return "Formulation or treated plastic supplier dependent";
  if (segmentSlug === "molecular-biology-pcr") return "PCR-grade polymer or reagent format";
  return "Polypropylene / polystyrene / supplier dependent";
}

function compatibilityFor(segmentSlug: string) {
  if (segmentSlug === "liquid-handling") return "Manual pipette or automation platform fit";
  if (segmentSlug === "molecular-biology-pcr") return "Thermal cycler / qPCR instrument fit";
  if (segmentSlug === "sample-prep-filtration") return "Syringe, centrifuge, vacuum, or plate workflow fit";
  if (segmentSlug === "cell-culture") return "Cell model, culture format, or vessel fit";
  return "Workflow compatibility reviewed during sourcing";
}

function buildFamily(segment: SegmentSeed, category: CategorySeed, family: FamilySeed): ProductCatalogFamily {
  const overrides = family.productNames ?? [];
  const products = [1, 2, 3].map((index) => makeCatalogProduct(segment, category, family, index, overrides[index - 1]));

  if (overrides.length > 3) {
    products.push(...overrides.slice(3).map((override, index) => makeCatalogProduct(segment, category, family, index + 4, override)));
  }

  return {
    id: family.slug,
    slug: family.slug,
    name: family.name,
    description:
      family.description ??
      `${family.name} for ${category.name.toLowerCase()} sourcing, equivalent review, documentation checks, sample requests, and recurring supply planning.`,
    typicalSpecs: family.typicalSpecs ?? category.tags,
    products
  };
}

function buildCategory(segment: SegmentSeed, category: CategorySeed): ProductCatalogCategory {
  return {
    id: category.slug,
    slug: category.slug,
    name: category.name,
    description: category.description,
    tags: category.tags,
    families: category.families.map((family) => buildFamily(segment, category, family))
  };
}

function buildSegment(segment: SegmentSeed): ProductCatalogSegment {
  return {
    id: segment.slug,
    slug: segment.slug,
    index: segment.index,
    name: segment.name,
    shortDescription: segment.shortDescription,
    heroDescription: segment.heroDescription,
    categories: segment.categories.map((category) => buildCategory(segment, category))
  };
}

export const productCatalogSegments: ProductCatalogSegment[] = catalogSeeds.map(buildSegment);
export const productCatalogMenuSegments: ProductCatalogSegment[] = [...productCatalogSegments, ...supplementalMenuSegments];

export function getAllSegments() {
  return productCatalogSegments;
}

export function getSegmentBySlug(slug: string) {
  return productCatalogSegments.find((segment) => segment.slug === slug) ?? supplementalMenuSegments.find((segment) => segment.slug === slug) ?? null;
}

export function getCategoryBySlug(segmentSlug: string, categorySlug: string) {
  const segment = getSegmentBySlug(segmentSlug);
  const category = segment?.categories.find((item) => item.slug === categorySlug) ?? null;
  return segment && category ? { segment, category } : null;
}

export function getFamilyBySlug(segmentSlug: string, categorySlug: string, familySlug: string) {
  const match = getCategoryBySlug(segmentSlug, categorySlug);
  const family = match?.category.families.find((item) => item.slug === familySlug) ?? null;
  return match && family ? { ...match, family } : null;
}

export function getProductBySlug(segmentSlug: string, categorySlug: string, familySlug: string, productSlug: string) {
  const match = getFamilyBySlug(segmentSlug, categorySlug, familySlug);
  const product = match?.family.products.find((item) => item.slug === productSlug) ?? null;
  return match && product ? { ...match, product } : null;
}

export function getAllCatalogCategoryPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.map((category) => ({ segment: segment.slug, subcategory: category.slug }))
  );
}

export function getAllCatalogFamilyPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.map((family) => ({ segment: segment.slug, subcategory: category.slug, family: family.slug }))
    )
  );
}

export function getAllCatalogProductPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.flatMap((family) =>
        family.products.map((product) => ({ segment: segment.slug, subcategory: category.slug, family: family.slug, product: product.slug }))
      )
    )
  );
}

export function getProductsForCategory(segmentSlug: string, categorySlug: string) {
  return getCategoryBySlug(segmentSlug, categorySlug)?.category.families.flatMap((family) => family.products) ?? [];
}

export function getProductsForSegment(segmentSlug: string) {
  return getSegmentBySlug(segmentSlug)?.categories.flatMap((category) => category.families.flatMap((family) => family.products)) ?? [];
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  const products = productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.flatMap((family) => family.products.map((product) => ({ segment, category, family, product })))
    )
  );

  if (!normalized) return products;

  return products.filter(({ segment, category, family, product }) =>
    [segment.name, category.name, family.name, product.name, product.description, product.supplier, product.catalogNumber, product.productType, product.tags.join(" "), Object.values(product.specs).flat().join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

export function filterProducts(products: ProductCatalogItem[], filters: ProductCatalogFilters) {
  const active = Object.entries(filters).filter(([key, value]) => key !== "query" && Array.isArray(value) && value.length > 0) as Array<[keyof ProductCatalogFilters, string[]]>;
  const query = filters.query?.trim().toLowerCase();

  return products.filter((product) => {
    const haystack = [product.name, product.description, product.productType, product.supplier, product.catalogNumber, product.tags.join(" "), Object.values(product.specs).flat().join(" ")]
      .join(" ")
      .toLowerCase();

    if (query && !haystack.includes(query)) return false;

    return active.every(([, values]) => values.some((value) => haystack.includes(value.toLowerCase())));
  });
}

export function productCatalogHref(segmentSlug: string, categorySlug?: string, familySlug?: string, productSlug?: string) {
  return `/${["products", segmentSlug, categorySlug, familySlug, productSlug].filter(Boolean).join("/")}`;
}

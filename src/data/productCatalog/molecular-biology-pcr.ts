import type { SegmentSeed } from "./types";

export const molecularBiologyPcrSeed: SegmentSeed = {
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
};

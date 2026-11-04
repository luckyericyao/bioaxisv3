import type { RawSegment } from "./types";

export const molecularBiologyPcrSegment: RawSegment = {
  name: "Molecular Biology & PCR",
  slug: "molecular-biology-pcr",
  headline: "Source PCR plastics, qPCR consumables, extraction kits, electrophoresis reagents, and nuclease-free water and buffers.",
  shortDescription: "Molecular biology consumables organized by PCR cleanliness, optical clarity, instrument compatibility, and sealing requirements.",
  buyerUseCases: ["PCR", "qPCR", "nucleic acid extraction", "gel analysis", "molecular biology sample prep"],
  buyerSpecs: ["DNase/RNase-free", "PCR-clean", "optical clarity", "skirted/semi-skirted/non-skirted", "ABI/Bio-Rad/Roche compatibility", "low evaporation", "sealing compatibility"],
  commonFormats: ["tube", "strip", "96-well plate", "384-well plate", "optical film", "kit", "buffer"],
  applications: ["PCR", "qPCR", "RT-PCR", "DNA/RNA extraction", "electrophoresis"],
  documentationNeeds: ["DNase/RNase-free statement", "CoA where available", "lot traceability", "storage condition", "instrument compatibility notes"],
  relatedSegments: ["liquid-handling", "buffers-chemicals-reagents", "automation-consumables", "sample-prep-filtration"],
  subcategories: [
    { name: "PCR Plastics", slug: "pcr-plastics", families: ["pcr-tubes", "pcr-strips", "96-well-pcr-plates", "384-well-pcr-plates", "optical-pcr-seals"] },
    { name: "qPCR Consumables", slug: "qpcr-consumables", families: ["qpcr-plates", "qpcr-tubes", "optical-sealing-films", "low-profile-qpcr-plastics"] },
    { name: "PCR and qPCR Reagents", slug: "pcr-qpcr-reagents", families: ["pcr-master-mixes", "qpcr-master-mixes", "reverse-transcription-reagents", "hot-start-polymerases"] },
    { name: "Nucleic Acid Extraction", slug: "nucleic-acid-extraction", families: ["dna-extraction-kits", "rna-extraction-kits", "plasmid-prep-kits", "magnetic-bead-extraction-kits"] },
    { name: "Electrophoresis and Gel Analysis", slug: "electrophoresis-gel-analysis", families: ["agarose", "dna-ladders", "gel-stains", "loading-dyes"] },
    { name: "Molecular Biology Water and Buffers", slug: "molecular-biology-water-buffers", families: ["nuclease-free-water", "te-buffer", "pbs", "tris-buffers"] }
  ]
};

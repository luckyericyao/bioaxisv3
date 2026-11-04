import type { RawSegment } from "./types";

export const automationConsumablesSegment: RawSegment = {
  name: "Automation Consumables",
  slug: "automation-consumables",
  headline: "Source robotic tips, automation plates, reservoirs, seals, barcoded consumables, and liquid-handler-ready reagent kits.",
  shortDescription: "Automation consumables organized by platform compatibility, SBS footprint, conductivity, barcode format, deck layout, and lot consistency.",
  buyerUseCases: ["liquid handler setup", "high-throughput screening", "automated extraction", "automated PCR", "sample tracking"],
  buyerSpecs: ["platform compatibility", "SBS footprint", "conductive/non-conductive", "sterile", "filtered", "automation deck format", "barcode format", "nested tip packaging", "lot consistency"],
  commonFormats: ["robotic tip", "automation plate", "automation reservoir", "pierceable seal", "barcoded tube", "automation-ready kit"],
  applications: ["automated liquid handling", "HTS", "automated extraction", "automation sample prep", "barcoded storage"],
  documentationNeeds: ["platform fit information", "sterility statement", "barcode specification", "CoA where available", "lot traceability"],
  relatedSegments: ["liquid-handling", "lab-plasticware", "molecular-biology-pcr", "storage-cryopreservation"],
  subcategories: [
    { name: "Robotic Pipette Tips", slug: "robotic-pipette-tips", families: ["hamilton-robotic-tips", "tecan-robotic-tips", "beckman-robotic-tips", "opentrons-compatible-tips", "conductive-filtered-tips"] },
    { name: "Automation Plates", slug: "automation-plates", families: ["96-well-automation-plates", "384-well-automation-plates", "deep-well-automation-plates", "pcr-automation-plates"] },
    { name: "Reservoirs for Automation", slug: "automation-reservoirs", families: ["single-well-reservoirs", "divided-reservoirs", "low-dead-volume-reservoirs", "sterile-automation-reservoirs"] },
    { name: "Seals for Automation", slug: "automation-seals", families: ["adhesive-automation-seals", "heat-sealable-films", "pierceable-seals", "optical-automation-seals"] },
    { name: "Barcoded Consumables", slug: "barcoded-consumables", families: ["barcoded-tubes", "barcoded-plates", "2d-coded-storage-tubes", "traceability-labels"] },
    { name: "Automation-Compatible Reagent Kits", slug: "automation-compatible-reagent-kits", families: ["magnetic-bead-extraction-kits", "high-throughput-pcr-kits", "automated-sample-cleanup-kits", "liquid-handler-ready-reagents"] }
  ]
};

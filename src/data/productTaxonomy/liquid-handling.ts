import type { RawSegment } from "./types";

export const liquidHandlingSegment: RawSegment = {
  name: "Liquid Handling",
  slug: "liquid-handling",
  headline: "Source pipette tips, serological pipettes, reservoirs, robotic tips, and liquid handling accessories with quote-ready specifications.",
  shortDescription: "Manual and automated liquid handling consumables organized by volume range, sterility, filter barrier, packaging, and platform compatibility.",
  buyerUseCases: ["manual pipetting", "assay setup", "cell culture transfer", "automation deck setup", "high-throughput screening"],
  buyerSpecs: ["volume range", "sterile/non-sterile", "filtered/non-filtered", "low retention", "DNase/RNase-free", "racked/reload/bulk", "conductive tips", "robotic platform compatibility", "lot consistency"],
  commonFormats: ["racked", "reload", "bulk", "sterile", "filtered", "conductive", "automation compatible"],
  applications: ["molecular biology", "cell culture", "assay setup", "sample prep", "automation decks"],
  documentationNeeds: ["CoA where available", "sterility statement", "DNase/RNase-free statement", "material declaration", "lot traceability"],
  relatedSegments: ["automation-consumables", "molecular-biology-pcr", "cell-culture", "lab-plasticware"],
  subcategories: [
    { name: "Pipette Tips", slug: "pipette-tips", families: ["universal-pipette-tips", "filtered-pipette-tips", "low-retention-pipette-tips", "extended-length-pipette-tips", "sterile-pipette-tips", "reload-and-bulk-pipette-tips"] },
    { name: "Serological Pipettes", slug: "serological-pipettes", families: ["1ml-serological-pipettes", "5ml-serological-pipettes", "10ml-serological-pipettes", "25ml-serological-pipettes", "50ml-serological-pipettes"] },
    { name: "Pipettes and Controllers", slug: "pipettes-and-controllers", families: ["single-channel-pipettes", "multichannel-pipettes", "electronic-pipettes", "pipette-controllers"] },
    { name: "Reagent Reservoirs", slug: "reagent-reservoirs", families: ["single-channel-reservoirs", "multi-channel-reservoirs", "sterile-reagent-reservoirs", "low-dead-volume-reservoirs"] },
    { name: "Bottle-Top and Dispensers", slug: "bottle-top-dispensers", families: ["bottle-top-dispensers", "repeat-dispensers", "positive-displacement-tips"] },
    { name: "Automation Liquid Handling Tips", slug: "automation-liquid-handling-tips", families: ["hamilton-compatible-tips", "tecan-compatible-tips", "beckman-compatible-tips", "conductive-robotic-tips", "filtered-robotic-tips"] }
  ]
};

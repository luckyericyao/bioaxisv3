import type { RawSegment } from "./types";

export const labPlasticwareSegment: RawSegment = {
  name: "Lab Plasticware",
  slug: "lab-plasticware",
  headline: "Source tubes, plates, bottles, sealing films, racks, and general labware by material, footprint, sterility, and packaging format.",
  shortDescription: "Core plasticware and general consumables for daily lab operations, sample handling, assay setup, and storage workflows.",
  buyerUseCases: ["sample handling", "plate-based assays", "freezer organization", "reagent storage", "routine bench workflows"],
  buyerSpecs: ["polypropylene/polystyrene/polycarbonate", "sterile/non-sterile", "autoclavable", "low-bind", "graduations", "centrifuge rating", "SBS footprint", "packaging format"],
  commonFormats: ["tube", "plate", "bottle", "rack", "seal", "holder", "bulk pack"],
  applications: ["general research", "sample storage", "assay preparation", "cell culture support", "molecular biology"],
  documentationNeeds: ["material declaration", "sterility statement where applicable", "lot traceability", "CoA where available", "SDS where applicable"],
  relatedSegments: ["liquid-handling", "storage-cryopreservation", "automation-consumables", "cell-culture"],
  subcategories: [
    { name: "Tubes", slug: "tubes", families: ["microcentrifuge-tubes", "conical-centrifuge-tubes", "snap-cap-tubes", "screw-cap-tubes", "round-bottom-tubes"] },
    { name: "Plates", slug: "plates", families: ["96-well-plates", "384-well-plates", "deep-well-plates", "v-bottom-plates", "u-bottom-plates"] },
    { name: "Bottles and Containers", slug: "bottles-and-containers", families: ["media-bottles", "reagent-bottles", "storage-bottles", "carboys"] },
    { name: "General Labware", slug: "general-labware", families: ["petri-dishes", "weighing-boats", "spatulas-and-scoops", "transfer-pipettes"] },
    { name: "Sealing Films and Mats", slug: "sealing-films-and-mats", families: ["adhesive-plate-seals", "breathable-films", "aluminum-seals", "silicone-sealing-mats"] },
    { name: "Racks and Holders", slug: "racks-and-holders", families: ["tube-racks", "freezer-boxes", "plate-stands", "reservoir-holders"] }
  ]
};

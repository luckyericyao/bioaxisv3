import type { SegmentSeed } from "./types";

export const labPlasticwareSeed: SegmentSeed = {
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
};

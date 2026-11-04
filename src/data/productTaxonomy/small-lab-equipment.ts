import type { RawSegment } from "./types";

export const smallLabEquipmentSegment: RawSegment = {
  name: "Small Lab Equipment",
  slug: "small-lab-equipment",
  headline: "Source benchtop instruments, temperature control tools, mixing equipment, liquid handling equipment, measurement tools, and accessories.",
  shortDescription: "Small lab equipment organized by capacity, footprint, voltage, compatible consumables, warranty, calibration, and maintenance needs.",
  buyerUseCases: ["bench setup", "sample mixing", "temperature control", "liquid handling", "routine measurement"],
  buyerSpecs: ["capacity", "footprint", "voltage", "certification", "compatible consumables", "warranty", "calibration", "maintenance"],
  commonFormats: ["benchtop unit", "block", "adapter", "rack", "replacement part", "measurement tool"],
  applications: ["sample preparation", "incubation", "mixing", "temperature control", "basic measurement"],
  documentationNeeds: ["specification sheet", "warranty information", "calibration information where applicable", "compatible consumables", "operating requirements"],
  relatedSegments: ["liquid-handling", "molecular-biology-pcr", "sample-prep-filtration", "lab-plasticware"],
  subcategories: [
    { name: "Benchtop Instruments", slug: "benchtop-instruments", families: ["mini-centrifuges", "vortex-mixers", "dry-bath-incubators", "heat-blocks"] },
    { name: "Temperature Control", slug: "temperature-control", families: ["water-baths", "dry-baths", "cooling-blocks", "tube-chillers"] },
    { name: "Mixing and Shaking", slug: "mixing-shaking", families: ["orbital-shakers", "plate-shakers", "rotators", "magnetic-stirrers"] },
    { name: "Liquid Handling Equipment", slug: "liquid-handling-equipment", families: ["manual-pipettes", "electronic-pipettes", "bottle-top-dispensers", "pipette-controllers"] },
    { name: "Measurement Tools", slug: "measurement-tools", families: ["ph-meters", "balances", "conductivity-meters", "timers"] },
    { name: "Equipment Accessories", slug: "equipment-accessories", families: ["tube-blocks", "adapters", "racks", "replacement-parts"] }
  ]
};

import type { RawSegment } from "./types";

export const storageCryopreservationSegment: RawSegment = {
  name: "Storage & Cryopreservation",
  slug: "storage-cryopreservation",
  headline: "Source cryovials, freezer boxes, storage tubes, seals, freezing media, and cold chain supplies for traceable sample storage.",
  shortDescription: "Storage and cryopreservation products organized by temperature range, thread style, barcode support, leak resistance, and sample traceability.",
  buyerUseCases: ["cryogenic storage", "freezer organization", "sample archiving", "cell freezing", "cold chain transfer"],
  buyerSpecs: ["temperature range", "vapor-phase liquid nitrogen compatibility", "sterile", "barcoded", "automation-compatible", "external/internal thread", "leak resistance", "sample traceability"],
  commonFormats: ["cryovial", "freezer box", "storage tube", "cap mat", "freezing media", "cold chain accessory"],
  applications: ["sample storage", "cell banking", "freezer inventory", "cryopreservation", "cold shipment"],
  documentationNeeds: ["sterility statement", "material declaration", "temperature range information", "barcode specification", "lot traceability"],
  relatedSegments: ["cell-culture", "lab-plasticware", "automation-consumables", "early-bioprocess-single-use"],
  subcategories: [
    { name: "Cryogenic Vials", slug: "cryogenic-vials", families: ["internal-thread-cryovials", "external-thread-cryovials", "sterile-cryovials", "barcoded-cryovials"] },
    { name: "Freezer Boxes and Racks", slug: "freezer-boxes-racks", families: ["cardboard-freezer-boxes", "polycarbonate-freezer-boxes", "stainless-steel-racks", "cryoboxes"] },
    { name: "Sample Storage Tubes", slug: "sample-storage-tubes", families: ["screw-cap-storage-tubes", "2d-barcoded-tubes", "matrix-style-storage-tubes", "cluster-tubes"] },
    { name: "Seals and Caps", slug: "seals-and-caps", families: ["screw-caps", "septum-caps", "cap-mats", "pierceable-seals"] },
    { name: "Cryopreservation Media", slug: "cryopreservation-media", families: ["dmso-freezing-media", "serum-free-freezing-media", "cell-recovery-media", "controlled-rate-freezing-containers"] },
    { name: "Cold Chain Supplies", slug: "cold-chain-supplies", families: ["insulated-shippers", "gel-packs", "temperature-indicators", "dry-ice-compatible-storage"] }
  ]
};

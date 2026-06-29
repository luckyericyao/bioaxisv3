export type BioAxisVisualAsset = {
  src: string;
  alt: string;
};

const visualBase = "/images/bioaxis-visuals";

export const pageVisuals = {
  homeHero: {
    src: `${visualBase}/pages/home-hero-consumables.webp`,
    alt: "Grouped laboratory consumables including pipette tips, tubes, PCR plate, reservoir, and syringe filter"
  },
  structuredSourcingOutput: {
    src: `${visualBase}/pages/structured-sourcing-output.webp`,
    alt: "Laboratory consumables arranged beside neutral structured sourcing documents"
  },
  equivalentReview: {
    src: `${visualBase}/pages/equivalent-review.webp`,
    alt: "Side-by-side generic laboratory consumables arranged for equivalent review"
  },
  trustDocuments: {
    src: `${visualBase}/pages/trust-documents.webp`,
    alt: "Laboratory consumables beside neutral document sheets for sourcing evidence review"
  },
  privateLabelOem: {
    src: `${visualBase}/pages/private-label-oem.webp`,
    alt: "Neutral unlabeled consumables and packaging grouped for private-label sourcing discussion"
  }
} satisfies Record<string, BioAxisVisualAsset>;

export const segmentVisuals: Record<string, BioAxisVisualAsset> = {
  "liquid-handling": {
    src: `${visualBase}/segments/liquid-handling.webp`,
    alt: "Liquid handling consumables including pipette tip racks and reservoirs"
  },
  "lab-plasticware": {
    src: `${visualBase}/segments/lab-plasticware.webp`,
    alt: "Lab plasticware including tubes, bottles, plates, and clear vessels"
  },
  "cell-culture": {
    src: `${visualBase}/segments/cell-culture.webp`,
    alt: "Cell culture consumables including flasks, dishes, plates, and media bottles"
  },
  "molecular-biology-pcr": {
    src: `${visualBase}/segments/molecular-biology-pcr.webp`,
    alt: "PCR and qPCR consumables including plates, tubes, strips, and optical seals"
  },
  "sample-prep-filtration": {
    src: `${visualBase}/segments/sample-prep-filtration.webp`,
    alt: "Sample preparation and filtration consumables including syringe filters and spin columns"
  },
  "storage-cryopreservation": {
    src: `${visualBase}/segments/storage-cryopreservation.webp`,
    alt: "Storage and cryopreservation consumables including cryovials, tubes, and freezer boxes"
  },
  "automation-consumables": {
    src: `${visualBase}/segments/automation-consumables.webp`,
    alt: "Automation consumables including robotic tip racks, SBS plates, and reservoirs"
  },
  "assays-detection": {
    src: `${visualBase}/segments/assays-detection.webp`,
    alt: "Assay and detection consumables including assay plates, seals, and reagent vials"
  },
  "proteins-antibodies-immunology": {
    src: `${visualBase}/segments/proteins-antibodies-immunology.webp`,
    alt: "Protein, antibody, and immunology consumables including reagent vials, tubes, and plates"
  },
  "buffers-chemicals-reagents": {
    src: `${visualBase}/segments/buffers-chemicals-reagents.webp`,
    alt: "Buffer, chemical, and reagent consumables including neutral reagent bottles and tubes"
  },
  "small-lab-equipment": {
    src: `${visualBase}/segments/small-lab-equipment.webp`,
    alt: "Small lab equipment and accessories including compact benchtop tools and tube racks"
  },
  "early-bioprocess-single-use": {
    src: `${visualBase}/segments/early-bioprocess-single-use.webp`,
    alt: "Early bioprocess and single-use consumables including tubing, connectors, and flexible bags"
  }
};

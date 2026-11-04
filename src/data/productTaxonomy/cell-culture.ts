import type { RawSegment } from "./types";

export const cellCultureSegment: RawSegment = {
  name: "Cell Culture",
  slug: "cell-culture",
  headline: "Source culture vessels, media, sera, dissociation products, freezing supplies, coatings, and stem cell culture reagents.",
  shortDescription: "Cell culture products organized by sterility, cell-type compatibility, formulation, surface treatment, and documentation needs.",
  buyerUseCases: ["2D cell culture", "stem cell culture", "primary cell workflows", "passaging", "cell freezing and recovery"],
  buyerSpecs: ["sterility", "cell-type compatibility", "serum-free/xeno-free/animal-origin-free", "endotoxin", "mycoplasma testing", "lot-to-lot consistency", "enhanced documentation where applicable"],
  commonFormats: ["sterile bottle", "treated vessel", "culture plate", "cryovial", "coating reagent", "ready-to-use solution"],
  applications: ["cell expansion", "media preparation", "passaging", "cryopreservation", "cell attachment"],
  documentationNeeds: ["CoA where available", "sterility statement", "mycoplasma information where available", "endotoxin information", "origin and treatment documentation"],
  relatedSegments: ["storage-cryopreservation", "sample-prep-filtration", "proteins-antibodies-immunology", "early-bioprocess-single-use"],
  subcategories: [
    { name: "Cell Culture Vessels", slug: "cell-culture-vessels", families: ["tissue-culture-flasks", "cell-culture-dishes", "multiwell-cell-culture-plates", "roller-bottles", "cell-factory-style-vessels"] },
    { name: "Media and Supplements", slug: "media-and-supplements", families: ["basal-media", "serum-free-media", "classical-media", "cell-culture-supplements", "antibiotics-and-antimycotics"] },
    { name: "Sera and Replacements", slug: "sera-and-replacements", families: ["fetal-bovine-serum", "qualified-fbs", "dialyzed-fbs", "serum-replacement-products"] },
    { name: "Cell Dissociation and Passaging", slug: "dissociation-and-passaging", families: ["trypsin-edta", "non-enzymatic-dissociation", "cell-scrapers", "passaging-reagents"] },
    { name: "Cell Freezing and Recovery", slug: "freezing-and-recovery", families: ["cell-freezing-media", "cryogenic-vials", "controlled-rate-freezing-containers", "thawing-media"] },
    { name: "Coatings and Matrices", slug: "coatings-and-matrices", families: ["collagen-coatings", "fibronectin-coatings", "laminin-coatings", "extracellular-matrix-products"] },
    { name: "Stem Cell and Primary Cell Culture", slug: "stem-cell-primary-cell-culture", families: ["stem-cell-media", "primary-cell-media", "xeno-free-reagents", "attachment-factors"] }
  ]
};

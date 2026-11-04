import type { RawSegment } from "./types";

export const proteinsAntibodiesImmunologySegment: RawSegment = {
  name: "Proteins, Antibodies & Immunology",
  slug: "proteins-antibodies-immunology",
  headline: "Source antibodies, recombinant proteins, immunology reagents, protein analysis products, magnetic beads, and flow cytometry consumables.",
  shortDescription: "Protein and immunology products organized by target, host species, clonality, conjugation, activity, purity, and validation application.",
  buyerUseCases: ["antibody sourcing", "immunology workflows", "protein analysis", "pull-down assays", "flow cytometry"],
  buyerSpecs: ["host species", "clonality", "conjugation", "validation application", "endotoxin", "carrier-free", "tag", "expression system", "activity", "purity"],
  commonFormats: ["antibody", "protein", "bead", "reagent", "tube", "buffer"],
  applications: ["Western blot", "flow cytometry", "immunofluorescence", "pull-down", "immune cell assays"],
  documentationNeeds: ["target information", "species reactivity", "application information", "CoA where available", "activity or purity information"],
  relatedSegments: ["assays-detection", "buffers-chemicals-reagents", "cell-culture", "sample-prep-filtration"],
  subcategories: [
    { name: "Antibodies", slug: "antibodies", families: ["primary-antibodies", "secondary-antibodies", "flow-cytometry-antibodies", "immunofluorescence-antibodies"] },
    { name: "Recombinant Proteins", slug: "recombinant-proteins", families: ["cytokines", "growth-factors", "enzymes", "tagged-recombinant-proteins"] },
    { name: "Immunology Reagents", slug: "immunology-reagents", families: ["cytokine-reagents", "blocking-sera", "immune-cell-stimulation-reagents", "isotype-controls"] },
    { name: "Protein Analysis", slug: "protein-analysis", families: ["protein-standards", "protein-assay-reagents", "gel-electrophoresis-reagents", "transfer-reagents"] },
    { name: "Magnetic Beads and Pull-Down", slug: "magnetic-beads-pull-down", families: ["protein-a-g-beads", "streptavidin-beads", "nickel-nta-beads", "immunoprecipitation-kits"] },
    { name: "Flow Cytometry Consumables", slug: "flow-cytometry-consumables", families: ["facs-tubes", "cell-strainers", "staining-buffers", "compensation-beads"] }
  ]
};

import type { SegmentSeed } from "./types";

export const cellCultureSeed: SegmentSeed = {
  index: "03",
  slug: "cell-culture",
  name: "Cell Culture",
  shortDescription: "Media, buffers, sera, supplements, plastics, inserts, and cryopreservation support.",
  heroDescription:
    "Source culture vessels, media, sera, dissociation products, freezing supplies, coatings, and stem cell culture reagents with documentation-aware sourcing.",
  categories: [
    {
      slug: "cell-culture-media-buffers",
      name: "Cell Culture Media & Buffers",
      description: "Classical media, balanced salt solutions, buffers, serum-free formats, and specialty media.",
      tags: ["liquid", "powder", "with L-glutamine", "without phenol red", "sterile-filtered"],
      families: [
        {
          slug: "classical-media",
          name: "Classical Media",
          description: "DMEM, RPMI-1640, MEM, Ham's F-12, M199, and related basal media formats.",
          typicalSpecs: ["liquid / powder", "with L-glutamine", "without phenol red", "sterile-filtered"],
          productNames: [
            {
              slug: "dmem-high-glucose",
              name: "DMEM High Glucose",
              specs: {
                "Product Type": "Classical media",
                Format: "Liquid / powder option",
                Sterility: "Sterile-filtered where applicable",
                "Volume / Size": "Bottle / bag / bulk pack review",
                Application: "Routine mammalian cell culture",
                Documentation: "SDS / CoA / origin documentation on request"
              },
              tags: ["DMEM", "high glucose", "classical media", "sterile-filtered"]
            }
          ]
        },
        { slug: "balanced-salt-solutions", name: "Balanced Salt Solutions", typicalSpecs: ["DPBS / HBSS", "calcium / magnesium option", "sterile liquid"] },
        { slug: "serum-free-media", name: "Serum-Free Media", typicalSpecs: ["serum-free", "cell-type fit", "sample-first review"] }
      ]
    },
    {
      slug: "cell-culture-supplements",
      name: "Cell Culture Supplements",
      description: "Supplements, antibiotics, growth factors, and culture support reagents.",
      tags: ["L-glutamine", "HEPES", "antibiotic", "growth support"],
      families: [
        { slug: "l-glutamine-supplements", name: "L-Glutamine Supplements", typicalSpecs: ["liquid", "sterile", "media support"] },
        { slug: "antibiotics-antimycotics", name: "Antibiotics and Antimycotics", typicalSpecs: ["penicillin-streptomycin", "amphotericin", "culture support"] },
        { slug: "growth-factor-supplements", name: "Growth Factor Supplements", typicalSpecs: ["cell-type dependent", "storage condition", "documentation review"] }
      ]
    },
    {
      slug: "sera-serum-alternatives",
      name: "Sera & Serum Alternatives",
      description: "FBS, qualified sera, dialyzed sera, and serum replacement products.",
      tags: ["FBS", "dialyzed", "qualified", "serum replacement"],
      families: [
        { slug: "fetal-bovine-serum", name: "Fetal Bovine Serum", typicalSpecs: ["origin", "heat-inactivated option", "lot documentation"] },
        { slug: "dialyzed-serum", name: "Dialyzed Serum", typicalSpecs: ["dialyzed", "cell culture", "lot review"] },
        { slug: "serum-replacement-products", name: "Serum Replacement Products", typicalSpecs: ["defined format", "serum reduction", "sample review"] }
      ]
    },
    {
      slug: "cell-culture-plastics",
      name: "Cell Culture Plastics",
      description: "Flasks, dishes, plates, roller bottles, and cell factory style vessels.",
      tags: ["treated surface", "flask", "dish", "plate", "roller bottle"],
      families: [
        { slug: "tissue-culture-flasks", name: "Tissue Culture Flasks", typicalSpecs: ["treated surface", "vented cap", "sterile"] },
        { slug: "cell-culture-dishes", name: "Cell Culture Dishes", typicalSpecs: ["surface treatment", "diameter", "sterile"] },
        { slug: "multiwell-cell-culture-plates", name: "Multiwell Cell Culture Plates", typicalSpecs: ["6 / 12 / 24 / 96 well", "treated", "sterile"] }
      ]
    },
    {
      slug: "cryopreservation",
      name: "Cryopreservation",
      description: "Cell freezing media, cryovials, controlled-rate containers, and thawing support.",
      tags: ["freezing media", "cryovial", "controlled-rate", "cell banking"],
      families: [
        { slug: "cell-freezing-media", name: "Cell Freezing Media", typicalSpecs: ["serum-free option", "DMSO option", "cell banking"] },
        { slug: "cryogenic-vials", name: "Cryogenic Vials", typicalSpecs: ["sterile", "internal / external thread", "storage fit"] },
        { slug: "controlled-rate-freezing-containers", name: "Controlled-Rate Freezing Containers", typicalSpecs: ["freezing profile", "vial fit", "workflow review"] }
      ]
    }
  ]
};

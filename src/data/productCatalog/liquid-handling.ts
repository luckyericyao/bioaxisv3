import type { SegmentSeed } from "./types";

export const liquidHandlingSeed: SegmentSeed = {
  index: "01",
  slug: "liquid-handling",
  name: "Liquid Handling",
  shortDescription: "Pipette tips, serological pipettes, reservoirs, dispensers, and robotic liquid handling formats.",
  heroDescription:
    "Source pipette tips, serological pipettes, reservoirs, robotic tips, and liquid handling accessories with quote-ready specifications.",
  categories: [
    {
      slug: "pipette-tips",
      name: "Pipette Tips",
      description: "Universal pipette tips, filtered tips, low retention tips, extended length tips, and sterile formats.",
      tags: ["sterile", "filtered", "low-retention", "bulk", "rack"],
      families: [
        {
          slug: "universal-pipette-tips",
          name: "Universal Pipette Tips",
          typicalSpecs: ["universal fit", "sterile / non-sterile", "racked / reload / bulk"],
          productNames: [
            {
              slug: "sterile-filtered-universal-pipette-tips",
              name: "Sterile Filtered Universal Pipette Tips",
              specs: {
                "Product Type": "Pipette tips",
                Format: "Racked",
                Sterility: "Sterile",
                Compatibility: "Universal / automation-compatible",
                Packaging: "Rack / refill / bulk",
                Documentation: "SDS / CoA on request"
              },
              tags: ["sterile", "filtered", "universal", "racked"]
            }
          ]
        },
        { slug: "filtered-pipette-tips", name: "Filtered Pipette Tips", typicalSpecs: ["aerosol barrier", "PCR-clean", "DNase/RNase-free"] },
        { slug: "low-retention-pipette-tips", name: "Low Retention Pipette Tips", typicalSpecs: ["low-binding surface", "viscous samples", "protein / nucleic acid workflows"] },
        { slug: "extended-length-pipette-tips", name: "Extended Length Pipette Tips", typicalSpecs: ["deep vessel access", "extended reach", "manual or robotic use"] },
        { slug: "sterile-pipette-tips", name: "Sterile Pipette Tips", typicalSpecs: ["sterile", "individually racked", "cell culture / molecular workflow"] },
        { slug: "reload-and-bulk-pipette-tips", name: "Reload and Bulk Pipette Tips", typicalSpecs: ["reload stack", "bulk bag", "rack refill planning"] }
      ]
    },
    {
      slug: "serological-pipettes",
      name: "Serological Pipettes",
      description: "Sterile serological pipettes for cell culture transfer, media handling, and liquid dispensing.",
      tags: ["1 mL", "5 mL", "10 mL", "25 mL", "50 mL"],
      families: [
        { slug: "1ml-serological-pipettes", name: "1 mL Serological Pipettes", typicalSpecs: ["sterile", "graduated", "individually wrapped"] },
        { slug: "10ml-serological-pipettes", name: "10 mL Serological Pipettes", typicalSpecs: ["sterile", "polystyrene", "color-coded"] },
        { slug: "25ml-serological-pipettes", name: "25 mL Serological Pipettes", typicalSpecs: ["sterile", "bulk case", "media transfer"] }
      ]
    },
    {
      slug: "pipettes-and-controllers",
      name: "Pipettes and Controllers",
      description: "Manual pipettes, multichannel pipettes, electronic pipettes, and pipette controllers for lab workflows.",
      tags: ["single-channel", "multichannel", "electronic", "controller"],
      families: [
        { slug: "single-channel-pipettes", name: "Single-Channel Pipettes", typicalSpecs: ["adjustable volume", "calibration support", "ergonomic design"] },
        { slug: "multichannel-pipettes", name: "Multichannel Pipettes", typicalSpecs: ["8-channel", "12-channel", "plate workflow"] },
        { slug: "pipette-controllers", name: "Pipette Controllers", typicalSpecs: ["serological pipette fit", "speed control", "bench charging"] }
      ]
    },
    {
      slug: "reagent-reservoirs",
      name: "Reagent Reservoirs",
      description: "Disposable reservoirs for manual and automated liquid handling, including sterile and low-dead-volume formats.",
      tags: ["single-channel", "multi-channel", "sterile", "low-dead-volume"],
      families: [
        { slug: "single-channel-reservoirs", name: "Single-Channel Reservoirs", typicalSpecs: ["standard trough", "manual pipetting", "bulk pack"] },
        { slug: "multi-channel-reservoirs", name: "Multi-Channel Reservoirs", typicalSpecs: ["divided channels", "reagent separation", "plate setup"] },
        { slug: "sterile-reagent-reservoirs", name: "Sterile Reagent Reservoirs", typicalSpecs: ["sterile", "individually wrapped", "cell culture use"] }
      ]
    },
    {
      slug: "automation-liquid-handling-tips",
      name: "Automation Liquid Handling Tips",
      description: "Robotic tips for common automated liquid handling workflows and platform-specific fit review.",
      tags: ["Hamilton", "Tecan", "Beckman", "Agilent", "conductive"],
      families: [
        { slug: "hamilton-compatible-tips", name: "Hamilton-Compatible Tips", typicalSpecs: ["conductive", "filtered", "rack geometry"] },
        { slug: "tecan-compatible-tips", name: "Tecan-Compatible Tips", typicalSpecs: ["conductive", "sterile option", "platform fit"] },
        { slug: "beckman-compatible-tips", name: "Beckman-Compatible Tips", typicalSpecs: ["automation deck fit", "filtered option", "sample testing"] }
      ]
    }
  ]
};

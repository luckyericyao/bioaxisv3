export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

export const resourceArticles: ResourceArticle[] = [
  {
    slug: "how-to-choose-pipette-tips",
    title: "How to choose pipette tips",
    description:
      "A practical guide to pipette tip selection for manual pipetting, molecular biology, cell culture, assay setup, and automation workflows.",
    sections: [
      {
        heading: "Start with volume range and pipette fit",
        body: [
          "The first filter for pipette tips is the working volume range. Match the tip to the pipette channel and the actual transfer volume, not just the nominal maximum volume. A 10 uL tip, 200 uL tip, 300 uL tip, 1000 uL tip, or extended-length tip can all be correct depending on the transfer geometry, sample depth, and dead-volume tolerance. For multichannel pipettes, also check rack geometry and tip spacing so the tips seat consistently across all channels.",
          "When requesting a quote, include the current pipette brand or model, current tip catalog number if known, volume range, and whether you use single-channel, multichannel, electronic, or robotic platforms. This helps BioAxis narrow the equivalent review to tips that are physically compatible before considering price or pack size."
        ]
      },
      {
        heading: "Filtered vs non-filtered",
        body: [
          "Filtered tips add an aerosol barrier between the sample and pipette shaft. They are common for PCR, qPCR, nucleic acid extraction, infectious sample handling, and workflows where carryover could compromise downstream results. Non-filtered tips can be appropriate for routine buffer transfer, non-sensitive assays, or applications where the lab has already validated contamination controls.",
          "Do not treat filtered and non-filtered tips as interchangeable without checking the workflow. A filtered equivalent should match the required volume range, seating fit, packaging, sterility status, and low-retention requirement. For PCR-clean work, ask for DNase/RNase-free or PCR-clean documentation where available."
        ]
      },
      {
        heading: "Sterile status and clean claims",
        body: [
          "Sterile tips are commonly requested for cell culture, microbiology-adjacent work, sterile sample handling, and sensitive assay setup. Non-sterile tips are often acceptable for routine bench work, reagent preparation, and analytical workflows where sterility is not part of the method. The important point is to specify the requirement clearly instead of assuming all racked tips are sterile.",
          "Common documentation requests include sterility statement, DNase/RNase-free statement, pyrogen or endotoxin information where relevant, material declaration, and lot traceability. BioAxis can help organize these requests, but final suitability depends on the customer's application and validation."
        ]
      },
      {
        heading: "Low retention, extended length, and packaging",
        body: [
          "Low-retention tips can reduce sample loss for viscous liquids, protein solutions, nucleic acids, enzymes, detergents, and low-volume assays. Extended-length tips are useful when reaching into deep plates, tubes, reservoirs, or containers while minimizing shaft contact. If low-retention performance matters, request a sample-first evaluation instead of relying only on the product name.",
          "Packaging affects both workflow speed and procurement cost. Racked tips support clean, ready-to-use operation. Reload systems reduce plastic waste and storage volume. Bulk tips can work for high-volume non-sterile workflows when the lab manages loading and cleanliness. Include racked, reload, or bulk preference in the RFQ."
        ]
      },
      {
        heading: "Automation compatibility",
        body: [
          "Robotic tips require stricter matching than manual tips. The RFQ should include the liquid handler platform, whether conductive tips are required, filter status, rack format, nested packaging, sterile status, and barcode or lot traceability requirements. Small differences in tip length, collar geometry, rack height, or conductivity can affect liquid-level sensing and deck performance.",
          "A good pipette tip request includes volume range, filtered or non-filtered, sterile or non-sterile, low-retention requirement, DNase/RNase-free requirement, racked/reload/bulk packaging, robotic platform compatibility, current catalog number, estimated monthly or annual volume, and whether samples are needed for validation."
        ]
      }
    ]
  },
  {
    slug: "how-to-evaluate-equivalent-consumables",
    title: "How to evaluate equivalent consumables",
    description:
      "A buyer-focused method for comparing alternative lab consumables by fit, material, sterility, documentation, sample testing, and lot consistency.",
    sections: [
      {
        heading: "Define what must be equivalent",
        body: [
          "Equivalent consumables are not evaluated by product title alone. Start with the current supplier, catalog number, product description, and the reason you are considering an alternative. The critical comparison points usually include dimensions, material, volume, surface treatment, color, sterility, packaging, instrument fit, and documentation. For tubes and plates, small changes in geometry can affect centrifuge rotors, plate seals, readers, automation grippers, and freezer racks.",
          "Separate hard requirements from preferences. Hard requirements might include sterile packaging, DNase/RNase-free status, SBS footprint, low-binding surface, vapor-phase liquid nitrogen compatibility, or robotic platform fit. Preferences might include case quantity, rack color, cap style, or packaging format."
        ]
      },
      {
        heading: "Compare material and format",
        body: [
          "Material matters because consumables contact samples, reagents, cells, solvents, or analytical methods. Polypropylene, polystyrene, polycarbonate, PETG, glass, PVDF, PES, PTFE, nylon, nitrocellulose, and silicone all behave differently. For filtration products, membrane chemistry, pore size, diameter, hold-up volume, protein binding, and chemical compatibility should be reviewed together.",
          "Format matters just as much. A 96-well plate may be clear, white, black, deep-well, V-bottom, U-bottom, tissue-culture treated, low-bind, PCR-clean, or automation-compatible. A product that looks close on a web page may fail if the bottom geometry, height, or sealing compatibility differs from the current item."
        ]
      },
      {
        heading: "Check sterility and clean claims",
        body: [
          "Sterility, DNase/RNase-free, endotoxin, pyrogen, animal-origin-free, xeno-free, and low-bind claims should be checked against the application. Cell culture and molecular biology workflows often need more documentation than routine bench handling. If the product touches cells, nucleic acids, proteins, sterile media, or regulated QC workflows, ask for the supporting documents early.",
          "Common documents include CoA, SDS, sterility statement, DNase/RNase-free statement, endotoxin information, material declaration, lot traceability, and storage condition. BioAxis can help request and organize documentation where available, but the customer is responsible for final validation in the intended workflow."
        ]
      },
      {
        heading: "Use samples before switching critical workflows",
        body: [
          "A sample-first evaluation reduces switching risk. Test the equivalent in the actual workflow, not only on the bench. For pipette tips, check seating, leakage, retention, and ergonomics. For automation tips and plates, check deck fit, liquid-level sensing, gripper handling, sealing, and barcode readability. For filters, check recovery, flow rate, binding, extractables/leachables where relevant, and compatibility with the sample matrix.",
          "Document the evaluation criteria before requesting samples. This keeps the test focused and makes it easier to compare alternatives. Include the current product, proposed equivalent, application, sample quantity needed, and acceptance criteria."
        ]
      },
      {
        heading: "Plan for lot consistency and supply",
        body: [
          "Equivalent review should include availability of documentation and lot-to-lot consistency, not just the first sample result. For recurring supply, ask about pack size, case quantity, lead time expectations, lot reservation options where available, and whether future lots can provide the same documentation set.",
          "A strong equivalent request includes the current catalog number, supplier, product description, required dimensions, material, sterility, packaging, documentation needs, estimated usage, delivery timeline, and whether sample testing is required before switching."
        ]
      }
    ]
  },
  {
    slug: "how-to-prepare-a-consumables-rfq",
    title: "How to prepare a consumables RFQ",
    description:
      "A practical RFQ checklist for life science consumables sourcing, equivalent review, documentation support, sample requests, and recurring supply.",
    sections: [
      {
        heading: "Start with the current product context",
        body: [
          "A consumables RFQ moves faster when the requester includes the current supplier, catalog number, product description, and intended application. If the item is a direct reorder, the catalog number may be enough to identify the product family. If the request is for an equivalent, the catalog number should be paired with specifications that cannot change, such as volume range, material, sterility, filter status, low-retention surface, plate footprint, tube geometry, membrane type, or instrument compatibility.",
          "For broad searches, describe the workflow: PCR setup, sterile cell culture, HPLC sample prep, liquid handler automation, cryogenic storage, ELISA, Western blotting, or early bioprocess sampling. Workflow context helps BioAxis organize sourcing options around the product's use rather than matching vague keywords."
        ]
      },
      {
        heading: "Specify quantity and usage rhythm",
        body: [
          "Include immediate quantity, preferred pack size, case quantity, and estimated monthly or annual volume. A request for two packs of filtered tips is handled differently from a recurring supply need for 200 cases per quarter. If the lab expects scaling, include the pilot quantity and the recurring volume separately.",
          "If there is a target delivery date, include it in the first RFQ. Sourcing teams can then separate urgent options from longer-lead equivalent options. For recurring supply, add shipping region, receiving constraints, and whether lot reservation or staggered delivery would help."
        ]
      },
      {
        heading: "List required documents",
        body: [
          "Documentation requirements should be explicit. Common requests include CoA, SDS, sterility statement, DNase/RNase-free statement, endotoxin information, material declaration, origin information, lot traceability, and storage condition. For filters and single-use process consumables, buyers may also ask for membrane or material information and extractables/leachables data where relevant.",
          "Do not wait until after supplier matching to ask for documents. If procurement, QA, or a lab manager needs documentation before approval, include it in the RFQ so unsuitable options are filtered out early."
        ]
      },
      {
        heading: "Add packaging, sterility, and compatibility preferences",
        body: [
          "Packaging preferences can affect cost, storage, and workflow efficiency. For pipette tips, specify racked, reload, or bulk. For plates, note sterile status, color, bottom type, surface treatment, and sealing compatibility. For tubes, include cap style, centrifuge rating, volume, and temperature range. For automation consumables, include liquid handler platform, deck format, rack geometry, barcode needs, and conductive or non-conductive tip requirements.",
          "Sterile and non-sterile should be written clearly. If sterile is optional, say so. If sterile is mandatory, ask for supporting documentation. The same applies to low-bind, low-retention, PCR-clean, DNase/RNase-free, endotoxin, and animal-origin-free requirements."
        ]
      },
      {
        heading: "State sample needs and evaluation plan",
        body: [
          "If switching suppliers could affect cells, assays, automation, sample recovery, or QC review, request samples as part of the RFQ. Include how many samples are needed, which users will evaluate them, and what criteria will be checked. This may include fit, leakage, retention, optical clarity, assay signal, cell attachment, filtration recovery, or compatibility with a liquid handler.",
          "A quote-ready request gives BioAxis enough information to organize supplier conversations: catalog number, supplier, product description, quantity, documentation, packaging preference, timeline, sample needs, shipping region, institution or company, contact email, and notes about critical specifications."
        ]
      }
    ]
  }
];

export function getResourceArticleBySlug(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}

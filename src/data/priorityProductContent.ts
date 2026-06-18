export type ProductSpecChecklistItem = {
  specification: string;
  whyItMatters: string;
  exampleValues: string;
};

export type PriorityProductContent = {
  route: string;
  title: string;
  summary: string;
  specifications: ProductSpecChecklistItem[];
  typicalSpecifications: string[];
  commonFormats: string[];
  compatibilityConsiderations: string[];
  documentationRequested: string[];
  equivalentChecklist: string[];
  sampleChecklist: string[];
  sourcingSupport: string[];
  metaTitle: string;
  metaDescription: string;
};

function key(segment: string, subcategory: string, family?: string) {
  return [segment, subcategory, family].filter(Boolean).join("/");
}

const priorityProductContent: Record<string, PriorityProductContent> = {
  [key("liquid-handling", "pipette-tips")]: {
    route: "/products/liquid-handling/pipette-tips",
    title: "Pipette tips procurement checklist",
    summary:
      "Pipette tip sourcing should start with volume range, pipette fit, sterility, filter barrier, packaging format, documentation, and sample testing requirements before comparing supplier options.",
    specifications: [
      { specification: "Volume range", whyItMatters: "Ensures the tip fits the pipette and the assay transfer volume.", exampleValues: "10 uL, 20 uL, 200 uL, 1000 uL" },
      { specification: "Filtered or non-filtered", whyItMatters: "Reduces aerosol contamination risk in sensitive workflows.", exampleValues: "filtered, non-filtered" },
      { specification: "Sterility", whyItMatters: "Required for cell culture and contamination-sensitive workflows.", exampleValues: "sterile, non-sterile" },
      { specification: "Retention profile", whyItMatters: "Low-retention surfaces can reduce sample loss for viscous liquids, proteins, and nucleic acids.", exampleValues: "standard, low retention" },
      { specification: "Packaging", whyItMatters: "Affects cleanliness, bench workflow, storage space, and cost.", exampleValues: "racked, reload, bulk" },
      { specification: "Cleanliness claims", whyItMatters: "Molecular biology workflows often require nuclease-free or PCR-clean documentation.", exampleValues: "DNase/RNase-free, PCR-clean" }
    ],
    typicalSpecifications: ["manual pipette compatibility", "single-channel or multichannel use", "racked/reload/bulk packaging", "sterile vs non-sterile", "filtered vs non-filtered", "DNase/RNase-free documentation"],
    commonFormats: ["10 uL tips", "20 uL tips", "200 uL tips", "1000 uL tips", "low-retention tips", "sterile filtered racks", "reload inserts", "bulk packs"],
    compatibilityConsiderations: ["Confirm fit on manual pipettes before switching.", "Review multichannel seating consistency across all channels.", "For automation-adjacent workflows, confirm rack geometry and tip pickup behavior.", "Check whether extended length is needed for tubes, reservoirs, or deep-well plates."],
    documentationRequested: ["COA where available", "sterility statement", "DNase/RNase-free statement", "material declaration", "lot traceability"],
    equivalentChecklist: ["Current supplier and catalog number", "Volume range and maximum volume", "Filter barrier requirement", "Low-retention requirement", "Packaging format", "Pipette or automation platform compatibility"],
    sampleChecklist: ["Current tip used as control", "Pipette models to test", "Target transfer volumes", "Sample type or assay context", "Acceptance criteria for fit, retention, and contamination risk"],
    sourcingSupport: ["Organize a quote-ready pipette tip request.", "Compare compatible options by specification rather than product title alone.", "Coordinate sample-first review when switching could affect assay or cell culture work."],
    metaTitle: "Pipette Tips Sourcing | BioAxis",
    metaDescription: "Source pipette tips by volume range, filter barrier, sterility, low retention, packaging, manual pipette compatibility, samples, and documentation."
  },
  [key("liquid-handling", "pipette-tips", "filtered-pipette-tips")]: {
    route: "/products/liquid-handling/pipette-tips/filtered-pipette-tips",
    title: "Filtered pipette tips sourcing checklist",
    summary:
      "Filtered pipette tip review should focus on aerosol barrier fit, sterile and nuclease-free documentation, rack format, volume range, and sample testing for contamination-sensitive workflows.",
    specifications: [
      { specification: "Aerosol barrier", whyItMatters: "Protects pipette shafts and samples in contamination-sensitive transfers.", exampleValues: "filtered, aerosol barrier" },
      { specification: "Workflow sensitivity", whyItMatters: "PCR, qPCR, cell culture, and low-volume assays often require stricter cleanliness review.", exampleValues: "PCR/qPCR, cell culture, sample prep" },
      { specification: "Volume range", whyItMatters: "The filter should not reduce usable volume below the method requirement.", exampleValues: "10 uL, 20 uL, 200 uL, 1000 uL" },
      { specification: "Sterile and nuclease-free status", whyItMatters: "Supports contamination control and molecular biology use.", exampleValues: "sterile, DNase/RNase-free, PCR-clean" },
      { specification: "Rack or reload format", whyItMatters: "Determines fit with bench workflows and storage constraints.", exampleValues: "racked, reload, bulk" }
    ],
    typicalSpecifications: ["aerosol barrier", "sterile", "DNase/RNase-free", "PCR-clean where needed", "low retention if required", "rack and reload alternatives"],
    commonFormats: ["filtered racked tips", "sterile filtered racks", "filtered reload inserts", "low-retention filtered tips", "extended-length filtered tips"],
    compatibilityConsiderations: ["Confirm fit on the current pipette model.", "Check whether rack footprint works with the bench setup.", "Review automation compatibility separately when tips are used on liquid handlers.", "Test sample transfer if filter position or tip geometry changes dead volume."],
    documentationRequested: ["sterility statement", "DNase/RNase-free statement", "PCR-clean information where available", "material declaration", "lot traceability"],
    equivalentChecklist: ["Current filtered tip catalog number", "Pipette model", "Volume range", "Sterility and nuclease-free requirement", "Rack or reload preference", "Sample testing need before switching"],
    sampleChecklist: ["Sensitive workflow to test", "Transfer volume range", "Current control tip", "Acceptance criteria for fit and contamination control", "Documentation required before approval"],
    sourcingSupport: ["Review filtered tip alternatives by barrier, sterility, volume, packaging, and documentation.", "Prepare sample-first evaluation requests for PCR/qPCR, cell culture, and other contamination-sensitive workflows."],
    metaTitle: "Filtered Pipette Tips | BioAxis",
    metaDescription: "Source filtered pipette tips for PCR, qPCR, cell culture, aerosol barrier workflows, sterile and nuclease-free documentation, and sample testing."
  },
  [key("cell-culture", "media-and-supplements")]: {
    route: "/products/cell-culture/media-and-supplements",
    title: "Cell culture media and supplements sourcing checklist",
    summary:
      "Cell culture media sourcing depends on cell type, formulation, supplement requirements, serum-free or xeno-free status, lot consistency, documentation, and sample-first testing before switching.",
    specifications: [
      { specification: "Cell type", whyItMatters: "Media fit is tied to the cell line, primary cell, stem cell, or assay model.", exampleValues: "CHO, HEK, T cells, iPSC, primary cells" },
      { specification: "Formulation status", whyItMatters: "Serum-free, xeno-free, and animal-origin-free needs change supplier and documentation review.", exampleValues: "serum-free, xeno-free, animal-origin-free" },
      { specification: "Supplement requirements", whyItMatters: "Growth factors, glutamine, antibiotics, and sera affect performance and comparability.", exampleValues: "L-glutamine, growth factors, antibiotics" },
      { specification: "Lot consistency", whyItMatters: "Media changes can affect growth, viability, assay signal, and reproducibility.", exampleValues: "lot hold, same-lot request, sample lot testing" },
      { specification: "Documentation", whyItMatters: "Cell culture workflows often require sterility, mycoplasma, endotoxin, and origin information.", exampleValues: "COA, sterility, mycoplasma, endotoxin" }
    ],
    typicalSpecifications: ["cell type", "serum-free/xeno-free/animal-origin-free", "supplement needs", "sterility", "mycoplasma and endotoxin information", "storage temperature", "lot consistency"],
    commonFormats: ["basal media bottles", "serum-free media", "classical media", "supplements", "antibiotics and antimycotics", "ready-to-use solutions"],
    compatibilityConsiderations: ["Compare formulation changes before switching.", "Request samples when growth, viability, assay signal, or differentiation behavior matters.", "Confirm storage and handling conditions.", "Review whether supplements must be sourced together."],
    documentationRequested: ["COA where available", "sterility statement", "mycoplasma information where available", "endotoxin information", "origin and formulation information"],
    equivalentChecklist: ["Current media or supplement name", "Cell type and application", "Required serum-free or xeno-free status", "Supplement dependencies", "Lot consistency requirements", "Sample-first testing plan"],
    sampleChecklist: ["Cells and passage range", "Control product and lot", "Growth or assay metrics", "Testing duration", "Acceptance criteria", "Documentation required before adoption"],
    sourcingSupport: ["Organize media and supplement requests by formulation and workflow.", "Support equivalent review without claiming guaranteed interchangeability.", "Coordinate sample testing context before larger-volume purchasing."],
    metaTitle: "Cell Culture Media and Supplements | BioAxis",
    metaDescription: "Source cell culture media and supplements by cell type, serum-free or xeno-free status, supplements, lot consistency, samples, and documentation."
  },
  [key("cell-culture", "media-and-supplements", "serum-free-media")]: {
    route: "/products/cell-culture/media-and-supplements/serum-free-media",
    title: "Serum-free media sourcing checklist",
    summary:
      "Serum-free media requests should identify cell type, formulation constraints, supplement dependencies, lot consistency, and documentation required before testing or switching.",
    specifications: [
      { specification: "Cell type and application", whyItMatters: "Serum-free media performance is workflow-specific.", exampleValues: "stem cells, primary cells, suspension cells, assay cultures" },
      { specification: "Origin constraints", whyItMatters: "Xeno-free or animal-origin-free status can be required by the workflow.", exampleValues: "serum-free, xeno-free, animal-origin-free" },
      { specification: "Supplement needs", whyItMatters: "Some formulations require defined supplements or growth factors.", exampleValues: "growth factors, cytokines, L-glutamine" },
      { specification: "Lot consistency", whyItMatters: "Lot changes can affect growth, viability, and assay performance.", exampleValues: "lot sample, lot hold, documented lot" },
      { specification: "Cleanliness documentation", whyItMatters: "Cell culture buyers often review sterility, mycoplasma, and endotoxin information.", exampleValues: "sterility, mycoplasma, endotoxin" }
    ],
    typicalSpecifications: ["cell type", "serum-free/xeno-free/animal-origin-free", "supplement requirements", "sterility", "mycoplasma information", "endotoxin information", "lot consistency"],
    commonFormats: ["ready-to-use bottles", "complete serum-free media", "basal serum-free systems", "media plus supplement kits"],
    compatibilityConsiderations: ["Do not switch media based on product title alone.", "Run sample-first testing with the current product as control.", "Confirm whether adaptation is required.", "Track growth rate, viability, morphology, and assay output."],
    documentationRequested: ["COA where available", "sterility statement", "mycoplasma information where available", "endotoxin information", "origin information"],
    equivalentChecklist: ["Current product and supplier", "Cell type", "Required origin status", "Supplement list", "Storage condition", "Acceptance criteria for sample testing"],
    sampleChecklist: ["Control product and lot", "Cells and passage range", "Culture duration", "Viability and growth metrics", "Assay readout if relevant", "Documentation required before scale"],
    sourcingSupport: ["Prepare serum-free media requests with the right cell culture context.", "Compare compatible candidates by formulation, documentation, and sample testing needs.", "Support recurring supply review after sample evaluation."],
    metaTitle: "Serum-Free Media Sourcing | BioAxis",
    metaDescription: "Source serum-free media by cell type, xeno-free or animal-origin-free needs, supplements, lot consistency, documentation, and sample testing."
  },
  [key("molecular-biology-pcr", "pcr-plastics")]: {
    route: "/products/molecular-biology-pcr/pcr-plastics",
    title: "PCR plastics sourcing checklist",
    summary:
      "PCR plastics sourcing should compare plate, strip, tube, and seal formats by instrument fit, profile, skirt, optical clarity, evaporation control, and nuclease-free documentation.",
    specifications: [
      { specification: "Format", whyItMatters: "Tubes, strips, plates, and seals fit different workflows and instruments.", exampleValues: "PCR tubes, 8-strip tubes, 96-well plates, 384-well plates" },
      { specification: "Plate skirt", whyItMatters: "Skirt geometry affects thermal cycler, robotic, and handling compatibility.", exampleValues: "skirted, semi-skirted, non-skirted" },
      { specification: "Profile", whyItMatters: "Low-profile plastics reduce dead space and can improve thermal performance in some methods.", exampleValues: "low profile, standard profile" },
      { specification: "Sealing compatibility", whyItMatters: "Seals affect evaporation control and qPCR optical readout.", exampleValues: "optical film, foil, strip caps" },
      { specification: "Cleanliness", whyItMatters: "PCR workflows commonly require nuclease-free or PCR-clean claims.", exampleValues: "DNase/RNase-free, PCR-clean" }
    ],
    typicalSpecifications: ["skirted/semi-skirted/non-skirted", "low profile vs standard profile", "optical sealing compatibility", "qPCR instrument compatibility", "evaporation control", "DNase/RNase-free/PCR-clean"],
    commonFormats: ["PCR tubes", "PCR strips", "96-well PCR plates", "384-well PCR plates", "optical PCR seals"],
    compatibilityConsiderations: ["Confirm fit with the thermal cycler or qPCR instrument.", "Check sealing method and heated-lid settings.", "Review optical clarity for qPCR.", "For automation, verify plate footprint and handling geometry."],
    documentationRequested: ["DNase/RNase-free statement", "PCR-clean information where available", "COA where available", "lot traceability", "instrument compatibility notes"],
    equivalentChecklist: ["Current plate or tube catalog number", "Instrument model", "Skirt and profile", "Seal type", "Optical requirement", "Cleanliness documentation"],
    sampleChecklist: ["Thermal cycler or qPCR instrument", "Seal to be used", "Evaporation acceptance criteria", "qPCR signal consistency if applicable", "Current product control"],
    sourcingSupport: ["Organize PCR plastics requests by instrument and format.", "Compare equivalent candidates by geometry, seal fit, optical needs, and documentation.", "Coordinate sample testing before switching assay-critical plastics."],
    metaTitle: "PCR Plastics Sourcing | BioAxis",
    metaDescription: "Source PCR tubes, strips, plates, and seals by skirt, profile, qPCR instrument fit, optical sealing, evaporation control, and PCR-clean documentation."
  },
  [key("molecular-biology-pcr", "pcr-plastics", "96-well-pcr-plates")]: {
    route: "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
    title: "96-well PCR plates sourcing checklist",
    summary:
      "96-well PCR plate review should capture skirt style, profile, seal compatibility, instrument compatibility, evaporation control, and PCR-clean documentation before equivalent review.",
    specifications: [
      { specification: "Skirt style", whyItMatters: "Controls plate rigidity, handling, and instrument fit.", exampleValues: "skirted, semi-skirted, non-skirted" },
      { specification: "Profile", whyItMatters: "Profile affects reaction volume, evaporation, and thermal fit.", exampleValues: "low profile, standard profile" },
      { specification: "Sealing compatibility", whyItMatters: "Seal choice affects evaporation and optical readout.", exampleValues: "optical film, foil, cap mat" },
      { specification: "Instrument fit", whyItMatters: "qPCR and thermal cyclers can require specific plate geometries.", exampleValues: "ABI-style, Bio-Rad-style, Roche-style fit review" },
      { specification: "Cleanliness", whyItMatters: "PCR and qPCR workflows often require nuclease-free plastics.", exampleValues: "DNase/RNase-free, PCR-clean" }
    ],
    typicalSpecifications: ["skirted/semi-skirted/non-skirted", "low profile vs standard profile", "optical sealing compatibility", "qPCR instrument compatibility", "evaporation control", "DNase/RNase-free/PCR-clean"],
    commonFormats: ["clear 96-well PCR plates", "white qPCR plates", "skirted plates", "semi-skirted plates", "low-profile plates"],
    compatibilityConsiderations: ["Verify the exact thermal cycler or qPCR model.", "Confirm plate height and seal type.", "Check evaporation control for low-volume reactions.", "Test optical signal if switching qPCR plates."],
    documentationRequested: ["DNase/RNase-free statement", "PCR-clean information where available", "COA where available", "lot traceability", "instrument compatibility notes"],
    equivalentChecklist: ["Current plate catalog number", "Instrument model", "Skirt and profile", "Seal type", "Reaction volume", "Optical requirement"],
    sampleChecklist: ["Run current and candidate plates side by side.", "Track evaporation, amplification consistency, and seal performance.", "Confirm handling fit if automation is used."],
    sourcingSupport: ["Prepare 96-well PCR plate requests with instrument and seal context.", "Review compatible options without claiming guaranteed equivalence.", "Coordinate samples for assay-critical plate switching."],
    metaTitle: "96-Well PCR Plates | BioAxis",
    metaDescription: "Source 96-well PCR plates by skirt, profile, optical seal compatibility, qPCR instrument fit, evaporation control, and PCR-clean documentation."
  },
  [key("sample-prep-filtration", "syringe-filters")]: {
    route: "/products/sample-prep-filtration/syringe-filters",
    title: "Syringe filters sourcing checklist",
    summary:
      "Syringe filter sourcing should compare membrane chemistry, pore size, diameter, sample volume, sterility, protein binding, flow rate, and documentation before selecting options.",
    specifications: [
      { specification: "Membrane material", whyItMatters: "Material drives chemical compatibility, protein binding, and sample recovery.", exampleValues: "PES, PVDF, PTFE, nylon" },
      { specification: "Pore size", whyItMatters: "Controls clarification or sterile filtration target.", exampleValues: "0.22 um, 0.45 um" },
      { specification: "Sterility", whyItMatters: "Cell culture and sterile sample workflows may require sterile units.", exampleValues: "sterile, non-sterile" },
      { specification: "Diameter and volume", whyItMatters: "Filter diameter should match sample volume and hold-up tolerance.", exampleValues: "13 mm, 25 mm, 30 mm" },
      { specification: "Binding profile", whyItMatters: "Low protein binding can protect protein samples and assay recovery.", exampleValues: "low protein binding, low extractables" }
    ],
    typicalSpecifications: ["membrane material", "pore size 0.22 um / 0.45 um", "sterile vs non-sterile", "diameter", "sample volume", "flow rate", "low protein binding"],
    commonFormats: ["PES syringe filters", "PVDF syringe filters", "PTFE syringe filters", "nylon syringe filters", "sterile syringe filters"],
    compatibilityConsiderations: ["Match membrane to aqueous or solvent compatibility.", "Review hold-up volume for limited samples.", "Choose diameter based on sample volume.", "Check housing and luer fit with the syringe setup."],
    documentationRequested: ["membrane material information", "sterility statement", "COA where available", "chemical compatibility guidance", "extractables/leachables information where relevant"],
    equivalentChecklist: ["Current filter material and pore size", "Sample matrix", "Sterile requirement", "Sample volume", "Diameter", "Protein binding concern", "Flow-rate needs"],
    sampleChecklist: ["Test flow rate and recovery.", "Compare sample loss or protein binding.", "Confirm clarity or sterility target.", "Review extractables concerns if the method is sensitive."],
    sourcingSupport: ["Organize filter requests by membrane, pore size, diameter, and workflow.", "Compare equivalent candidates by compatibility and documentation.", "Support sample testing for sensitive sample prep or cell culture filtration."],
    metaTitle: "Syringe Filters Sourcing | BioAxis",
    metaDescription: "Source syringe filters by membrane, 0.22 um or 0.45 um pore size, sterility, diameter, sample volume, flow rate, and documentation."
  },
  [key("sample-prep-filtration", "syringe-filters", "pes-syringe-filters")]: {
    route: "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters",
    title: "PES syringe filters sourcing checklist",
    summary:
      "PES syringe filters are commonly reviewed for aqueous compatibility, low protein binding, 0.22 um or 0.45 um pore size, sterile status, membrane diameter, flow rate, and sample volume.",
    specifications: [
      { specification: "Pore size", whyItMatters: "Separates sterile filtration from clarification-style use.", exampleValues: "0.22 um, 0.45 um" },
      { specification: "Sterile status", whyItMatters: "Cell culture and sterile media workflows may require sterile packaging.", exampleValues: "sterile, non-sterile" },
      { specification: "Protein binding", whyItMatters: "PES is often selected where low protein binding matters.", exampleValues: "low protein binding" },
      { specification: "Aqueous compatibility", whyItMatters: "PES is commonly selected for aqueous samples and media.", exampleValues: "aqueous buffers, media, protein solutions" },
      { specification: "Diameter", whyItMatters: "Diameter affects throughput, hold-up volume, and sample volume range.", exampleValues: "13 mm, 25 mm, 30 mm" }
    ],
    typicalSpecifications: ["pore size 0.22 um / 0.45 um", "sterile vs non-sterile", "low protein binding", "aqueous compatibility", "membrane diameter", "sample volume", "flow rate"],
    commonFormats: ["sterile PES syringe filters", "non-sterile PES syringe filters", "13 mm PES filters", "25 mm PES filters", "0.22 um PES filters", "0.45 um PES filters"],
    compatibilityConsiderations: ["Confirm the sample is compatible with PES.", "Choose pore size by filtration goal.", "Match diameter to sample volume.", "Review hold-up volume for limited or expensive samples."],
    documentationRequested: ["membrane material information", "sterility statement", "COA where available", "chemical compatibility information", "extractables/leachables information where relevant"],
    equivalentChecklist: ["Current filter catalog number", "Pore size", "Diameter", "Sterile requirement", "Sample matrix", "Sample volume", "Binding sensitivity"],
    sampleChecklist: ["Compare flow rate and recovery.", "Check protein loss if relevant.", "Track hold-up volume.", "Review clarity or sterility outcome.", "Confirm documentation before purchasing volume."],
    sourcingSupport: ["Prepare PES filter requests with membrane and sample context.", "Compare compatible options by pore size, diameter, sterility, and documentation.", "Support sample-first testing for sensitive samples."],
    metaTitle: "PES Syringe Filters | BioAxis",
    metaDescription: "Source PES syringe filters by 0.22 um or 0.45 um pore size, sterile status, low protein binding, aqueous compatibility, diameter, and sample volume."
  },
  [key("automation-consumables", "robotic-pipette-tips")]: {
    route: "/products/automation-consumables/robotic-pipette-tips",
    title: "Robotic pipette tips sourcing checklist",
    summary:
      "Robotic pipette tip sourcing must capture platform style, conductive status, filter barrier, rack geometry, nested rack format, deck fit, lot consistency, and sample testing before switching.",
    specifications: [
      { specification: "Platform compatibility", whyItMatters: "Robotic tip geometry must match the liquid handler and deck setup.", exampleValues: "Hamilton-style, Tecan-style, Beckman-style, Opentrons-style" },
      { specification: "Conductive status", whyItMatters: "Liquid-level sensing workflows may require conductive tips.", exampleValues: "conductive, non-conductive" },
      { specification: "Filter barrier", whyItMatters: "Filtered tips reduce aerosol contamination risk in automated transfers.", exampleValues: "filtered, non-filtered" },
      { specification: "Rack and deck format", whyItMatters: "Rack footprint, nesting, and deck position affect automated pickup.", exampleValues: "nested racks, SBS footprint, deck-ready racks" },
      { specification: "Lot consistency", whyItMatters: "Automation methods are sensitive to dimensional variation.", exampleValues: "lot traceability, sample testing, recurring supply review" }
    ],
    typicalSpecifications: ["Hamilton/Tecan/Beckman/Opentrons-style compatibility", "conductive vs non-conductive", "filtered vs non-filtered", "nested racks", "deck format", "lot consistency"],
    commonFormats: ["Hamilton-style robotic tips", "Tecan-style robotic tips", "Beckman-style robotic tips", "Opentrons-compatible tips", "conductive filtered tips"],
    compatibilityConsiderations: ["Confirm platform, head type, and method requirements.", "Test pickup, seal, liquid detection, dispense accuracy, and ejection.", "Review rack footprint and nesting behavior.", "Document any deck adapters or carrier constraints."],
    documentationRequested: ["platform fit information", "sterility statement where relevant", "barcode or rack specification", "COA where available", "lot traceability"],
    equivalentChecklist: ["Current tip and rack catalog number", "Robot platform and model", "Conductive requirement", "Filter requirement", "Rack footprint", "Deck position and adapter context", "Validation plan"],
    sampleChecklist: ["Run pickup/eject testing.", "Check liquid detection if conductive.", "Test dispense behavior across volumes.", "Evaluate rack handling.", "Confirm lot consistency requirements before recurring supply."],
    sourcingSupport: ["Organize robotic tip requests by platform and deck requirement.", "Support compatibility review without claiming exact replacement.", "Coordinate sample testing before a method or supply switch."],
    metaTitle: "Robotic Pipette Tips | BioAxis",
    metaDescription: "Source robotic pipette tips by Hamilton, Tecan, Beckman, or Opentrons-style compatibility, conductive status, filters, racks, deck fit, and validation samples."
  },
  [key("storage-cryopreservation", "cryogenic-vials")]: {
    route: "/products/storage-cryopreservation/cryogenic-vials",
    title: "Cryogenic vials sourcing checklist",
    summary:
      "Cryogenic vial sourcing should compare thread style, sterile status, vapor-phase liquid nitrogen use, barcode options, leak resistance, cell banking requirements, and sample traceability.",
    specifications: [
      { specification: "Thread style", whyItMatters: "Internal and external thread designs affect handling, seal style, and storage workflows.", exampleValues: "internal thread, external thread" },
      { specification: "Storage condition", whyItMatters: "Cryogenic storage requirements differ by freezer and vapor-phase liquid nitrogen workflow.", exampleValues: "vapor-phase liquid nitrogen, ultra-low freezer" },
      { specification: "Sterility", whyItMatters: "Cell banking and sterile sample workflows often require sterile vials.", exampleValues: "sterile, non-sterile" },
      { specification: "Identification", whyItMatters: "Traceability depends on readable labels, caps, and barcode options.", exampleValues: "2D barcode, linear barcode, writing patch" },
      { specification: "Seal performance", whyItMatters: "Leak resistance matters for sample security and cold storage handling.", exampleValues: "O-ring cap, leak-resistant closure" }
    ],
    typicalSpecifications: ["internal vs external thread", "sterile", "vapor phase liquid nitrogen", "barcode options", "leak resistance", "cell banking", "sample traceability"],
    commonFormats: ["internal-thread cryovials", "external-thread cryovials", "sterile cryovials", "barcoded cryovials", "cryobox-compatible vials"],
    compatibilityConsiderations: ["Confirm freezer box, rack, and inventory system fit.", "Review vapor-phase liquid nitrogen use and storage guidance.", "Choose barcode or labeling format based on traceability workflow.", "Test cap handling and leak resistance where sample security is critical."],
    documentationRequested: ["sterility statement", "material declaration", "temperature range information", "barcode specification", "lot traceability"],
    equivalentChecklist: ["Current vial catalog number", "Volume and thread style", "Storage condition", "Sterile requirement", "Barcode need", "Box or rack fit", "Traceability requirement"],
    sampleChecklist: ["Test cap handling and label readability.", "Confirm fit in freezer boxes or racks.", "Review barcode scanning if used.", "Evaluate seal performance before sample banking."],
    sourcingSupport: ["Prepare cryogenic vial requests by storage workflow and traceability need.", "Compare compatible options by thread style, sterility, barcode, and documentation.", "Support sample-first review before recurring sample storage purchasing."],
    metaTitle: "Cryogenic Vials Sourcing | BioAxis",
    metaDescription: "Source cryogenic vials by internal or external thread, sterile status, vapor-phase liquid nitrogen use, barcode options, leak resistance, and sample traceability."
  }
};

export function getPriorityProductContent(segment: string, subcategory: string, family?: string) {
  return priorityProductContent[key(segment, subcategory, family)];
}

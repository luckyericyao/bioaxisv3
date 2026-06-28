import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

const commonRequestsBySegment: Record<string, string[]> = {
  "liquid-handling": ["Filtered or low-retention tips", "Automation-compatible formats", "Recurring tip and reservoir usage"],
  "lab-plasticware": ["Sterile or DNase/RNase-free needs", "Storage and handling packs", "Tube and plate format review"],
  "cell-culture": ["Media and supplement review", "Culture vessel format fit", "Sample-first switching path"],
  "molecular-biology-pcr": ["PCR/qPCR plates and seals", "DNase/RNase-free plastics", "Instrument-compatible formats"],
  "sample-prep-filtration": ["Syringe filter equivalents", "Membrane and pore-size fit", "Sterile filtration documents"],
  "storage-cryopreservation": ["Cryovial and closure needs", "Temperature compatibility", "Recurring storage formats"],
  "automation-consumables": ["Robotic tip compatibility", "Rack and deck fit", "Barcode or SBS format review"],
  "assays-detection": ["Assay plate format", "Reader compatibility", "Detection workflow supplies"],
  "proteins-antibodies-immunology": ["CoA and lot documentation", "Reagent equivalent support", "Immunoassay workflow fit"],
  "buffers-chemicals-reagents": ["CoA/SDS request path", "Buffer and reagent lists", "Recurring lab supply planning"],
  "small-lab-equipment": ["Accessory fit", "Documentation before purchase", "Equipment-linked consumables"],
  "early-bioprocess-single-use": ["Single-use bags and tubing", "Connector and assembly needs", "Early CMC sourcing support"]
};

const descriptionsBySegment: Record<string, string> = {
  "liquid-handling": "Pipette tips, reservoirs, serological pipettes, and automation-compatible liquid handling formats.",
  "lab-plasticware": "Tubes, plates, bottles, reservoirs, and everyday plasticware for research and QA workflows.",
  "cell-culture": "Media, supplements, vessels, plates, flasks, and related consumables for culture workflows.",
  "molecular-biology-pcr": "PCR/qPCR plastics, plates, seals, tubes, and molecular biology workflow consumables.",
  "sample-prep-filtration": "Filtration, centrifugation, prep, and cleanup consumables for sample handling workflows.",
  "storage-cryopreservation": "Cryovials, freezer boxes, storage plates, labels, and cold-chain sample storage formats.",
  "automation-consumables": "Robotic tips, racks, reservoirs, plates, and consumables for automated liquid handling systems.",
  "assays-detection": "Assay plates, detection consumables, ELISA-related plastics, and reader-compatible formats.",
  "proteins-antibodies-immunology": "Reagent, antibody, immunology, and protein workflow inputs requiring documentation review.",
  "buffers-chemicals-reagents": "Recurring reagent, buffer, and chemical supply inputs that require document and specification review.",
  "small-lab-equipment": "Benchtop tools, accessories, and equipment-linked consumables requiring compatibility review.",
  "early-bioprocess-single-use": "Single-use bags, tubing, connectors, assemblies, and early CMC consumable sourcing paths."
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  const commonRequests = commonRequestsBySegment[segment.slug] ?? segment.rfqPrompts.slice(0, 3);
  const description = descriptionsBySegment[segment.slug] ?? segment.shortDescription;

  return (
    <article
      data-product-segment-card="compact"
      className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft focus-within:border-bioaxis-accent/70"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h2>
        <span className="text-sm font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-6 text-bioaxis-muted">{description}</p>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase text-bioaxis-dim">Common sourcing requests</p>
        <ul className="mt-3 grid gap-2" aria-label={`${segment.title} common sourcing requests`}>
          {commonRequests.slice(0, 3).map((request) => (
            <li
              key={request}
              data-common-sourcing-request="true"
              className="flex items-start gap-2 border border-white/[0.12] bg-bioaxis-black px-3 py-2 text-[11px] font-semibold uppercase leading-5 text-bioaxis-steel"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-bioaxis-accent/70" aria-hidden="true" />
              {request}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-2 border-t border-bioaxis-line pt-5 sm:grid-cols-3">
        <Link
          href={`/products/${segment.slug}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View families
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "equivalent" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "quote" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Request quote
        </Link>
      </div>
    </article>
  );
}

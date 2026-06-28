import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

const commonRequestsBySegment: Record<string, string[]> = {
  "liquid-handling": ["Filtered or low-retention tips", "Automation-compatible formats", "Recurring tip and reservoir usage"],
  "lab-plasticware": ["Tubes and plates by format", "Sterile or DNase/RNase-free needs", "Storage and handling packs"],
  "cell-culture": ["Media and supplement review", "Culture vessels and plates", "Sample-first switching path"],
  "molecular-biology-pcr": ["PCR/qPCR plates and seals", "DNase/RNase-free plastics", "Instrument-compatible formats"],
  "sample-prep-filtration": ["Syringe filter equivalents", "Membrane and pore-size fit", "Sterile filtration documentation"],
  "storage-cryopreservation": ["Cryovials and freezer storage", "Temperature and closure requirements", "Recurring sample storage formats"],
  "automation-consumables": ["Robotic tip compatibility", "Rack, barcode, and deck fit", "Automation sample review"],
  "assays-detection": ["Assay plates and seals", "ELISA and detection plastics", "Plate reader compatibility"],
  "proteins-antibodies-immunology": ["Antibody and reagent inputs", "Documentation and CoA needs", "Equivalent review support"],
  "buffers-chemicals-reagents": ["Buffer and reagent lists", "CoA/SDS request path", "Recurring lab supply planning"],
  "small-lab-equipment": ["Benchtop equipment requests", "Accessory and consumable fit", "Documentation before purchase"],
  "early-bioprocess-single-use": ["Single-use bags and tubing", "Connector and assembly needs", "Early CMC sourcing support"]
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  const commonRequests = commonRequestsBySegment[segment.slug] ?? segment.rfqPrompts.slice(0, 3);

  return (
    <article
      data-product-segment-card="compact"
      className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft focus-within:border-bioaxis-accent/70"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h2>
        <span className="text-sm font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-6 text-bioaxis-muted">{segment.shortDescription}</p>

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
          Browse families
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

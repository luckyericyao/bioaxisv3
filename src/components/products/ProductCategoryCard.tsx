import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

const commonRequestsBySegment: Record<string, string[]> = {
  "liquid-handling": ["Filtered pipette tips", "Robotic reservoirs", "Serological pipettes"],
  "lab-plasticware": ["Microcentrifuge tubes", "Deep-well plates", "Reagent bottles"],
  "cell-culture": ["Serum-free media", "Culture flasks", "Multiwell plates"],
  "molecular-biology-pcr": ["PCR plates", "qPCR seals", "PCR tube strips"],
  "sample-prep-filtration": ["Syringe filters", "Spin columns", "Protein concentrators"],
  "storage-cryopreservation": ["Cryovials", "Freezer boxes", "Storage plates"],
  "automation-consumables": ["Robotic tips", "SBS plates", "Barcoded racks"],
  "assays-detection": ["Assay plates", "ELISA plates", "Detection seals"],
  "proteins-antibodies-immunology": ["Primary antibodies", "Protein reagents", "Immunoassay inputs"],
  "buffers-chemicals-reagents": ["PBS buffers", "Tris buffers", "Recurring reagents"],
  "small-lab-equipment": ["Mini centrifuges", "Tube racks", "Equipment accessories"],
  "early-bioprocess-single-use": ["Single-use bags", "TPE tubing", "Connector assemblies"]
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
        <p className="text-[11px] font-bold uppercase text-bioaxis-dim">Example product types</p>
        <ul className="mt-3 grid gap-2" aria-label={`${segment.title} example product types`}>
          {commonRequests.slice(0, 3).map((request) => (
            <li
              key={request}
              data-common-sourcing-request="true"
              className="flex items-start gap-2 border border-white/[0.12] bg-bioaxis-black px-3 py-2 text-[11px] font-semibold uppercase leading-5 text-bioaxis-steel"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-bioaxis-accent/70" aria-hidden="true" />
              {request}
              <span className="sr-only">.</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-2 border-t border-bioaxis-line pt-5 sm:grid-cols-3">
        <Link
          href={`/products/${segment.slug}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View segment
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "quote" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Request quote
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "equivalent" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
      </div>
    </article>
  );
}

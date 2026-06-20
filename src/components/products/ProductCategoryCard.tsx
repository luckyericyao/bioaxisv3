import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  const keywordChips = segment.subcategories.slice(0, 5).map((subcategory) => subcategory.title);

  return (
    <article
      data-product-segment-card="compact"
      className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h2>
        <span className="text-sm font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-bioaxis-muted">{segment.shortDescription}</p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label={`${segment.title} category keywords`}>
        {keywordChips.map((chip) => (
          <span key={chip} className="border border-white/[0.12] bg-bioaxis-black px-2.5 py-1 text-[11px] font-semibold uppercase text-bioaxis-steel">
            {chip}
          </span>
        ))}
      </div>

      <Link
        href={`/products/${segment.slug}`}
        className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
      >
        View segment
      </Link>
    </article>
  );
}

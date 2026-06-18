import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h2>
        <span className="text-sm font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{segment.description}</p>
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Representative families</p>
        <ul className="grid gap-2 text-sm text-bioaxis-steel">
          {segment.subcategories.slice(0, 6).map((subcategory) => (
            <li key={subcategory.slug}>- {subcategory.title}</li>
          ))}
        </ul>
      </div>
      <Link
        href={`/products/${segment.slug}`}
        className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
      >
        View category
      </Link>
    </article>
  );
}


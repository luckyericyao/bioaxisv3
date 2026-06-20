import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildEquivalentFinderHref, buildRequestHref } from "@/data/productTaxonomy";
import { getProductNavigationSegment, type ProductNavigationCategory } from "@/data/productNavigation";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  const navigationSegment = getProductNavigationSegment(segment.slug);
  const keywordChips = segment.subcategories.slice(0, 5).map((subcategory) => subcategory.title);

  return (
    <article
      data-product-segment-card="compact"
      className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft focus-within:border-bioaxis-accent/70"
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

      {navigationSegment ? <SegmentCategoryPreview categories={navigationSegment.categories} segmentHref={`/products/${segment.slug}`} /> : null}

      <div className="mt-6 grid gap-2 border-t border-bioaxis-line pt-5 sm:grid-cols-3">
        <Link
          href={`/products/${segment.slug}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View category
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "quote" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Request quote
        </Link>
        <Link
          href={buildEquivalentFinderHref({ segment: segment.slug })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
      </div>
    </article>
  );
}

function SegmentCategoryPreview({ categories, segmentHref }: { categories: ProductNavigationCategory[]; segmentHref: string }) {
  const visibleCategories = categories.slice(0, 5);

  return (
    <div data-product-category-preview="true" className="mt-5">
      <div className="hidden max-h-0 overflow-hidden border-t border-bioaxis-line pt-0 opacity-0 transition-all duration-300 ease-out md:block md:group-hover:max-h-96 md:group-hover:overflow-y-auto md:group-hover:pt-5 md:group-hover:opacity-100 md:group-focus-within:max-h-96 md:group-focus-within:overflow-y-auto md:group-focus-within:pt-5 md:group-focus-within:opacity-100">
        <CategoryLinkPreview categories={visibleCategories} segmentHref={segmentHref} />
      </div>
      <details className="border-t border-bioaxis-line pt-4 md:hidden">
        <summary className="cursor-pointer text-xs font-bold uppercase text-bioaxis-accent">Show category links</summary>
        <div className="mt-4 max-h-80 overflow-y-auto">
          <CategoryLinkPreview categories={visibleCategories} segmentHref={segmentHref} />
        </div>
      </details>
    </div>
  );
}

function CategoryLinkPreview({ categories, segmentHref }: { categories: ProductNavigationCategory[]; segmentHref: string }) {
  return (
    <div className="rounded-none border border-white/[0.08] bg-bioaxis-black/55 p-3">
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-accent">Explore categories</p>
      <div className="grid gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="flex items-center justify-between border border-white/[0.1] bg-bioaxis-panel px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-bioaxis-steel transition hover:border-bioaxis-accent hover:bg-bioaxis-accent/10 hover:text-bioaxis-accent focus:border-bioaxis-accent focus:text-bioaxis-accent"
          >
            <span>{category.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
        <Link
          href={segmentHref}
          className="mt-1 text-[11px] font-bold uppercase text-bioaxis-accent transition hover:text-bioaxis-text"
        >
          View segment
        </Link>
      </div>
    </div>
  );
}

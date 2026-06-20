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

      {navigationSegment ? <SegmentFamilyDiscovery categories={navigationSegment.categories} /> : null}

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

function SegmentFamilyDiscovery({ categories }: { categories: ProductNavigationCategory[] }) {
  return (
    <div data-product-family-discovery="true" className="mt-5">
      <div className="hidden max-h-0 overflow-hidden border-t border-bioaxis-line pt-0 opacity-0 transition-all duration-300 md:block md:group-hover:max-h-80 md:group-hover:overflow-y-auto md:group-hover:pt-5 md:group-hover:opacity-100 md:group-focus-within:max-h-80 md:group-focus-within:overflow-y-auto md:group-focus-within:pt-5 md:group-focus-within:opacity-100">
        <FamilyLinkGroups categories={categories} />
      </div>
      <details className="border-t border-bioaxis-line pt-4 md:hidden">
        <summary className="cursor-pointer text-xs font-bold uppercase text-bioaxis-accent">Show family links</summary>
        <div className="mt-4 max-h-80 overflow-y-auto">
          <FamilyLinkGroups categories={categories} />
        </div>
      </details>
    </div>
  );
}

function FamilyLinkGroups({ categories }: { categories: ProductNavigationCategory[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-accent">Family links</p>
      <div className="grid gap-3">
        {categories.map((category) => (
          <div key={category.slug}>
            <Link
              href={category.href}
              className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-dim transition hover:text-bioaxis-accent"
            >
              {category.label}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              {category.families.map((family) => (
                <Link
                  key={family.href}
                  href={family.href}
                  className="border border-white/[0.1] bg-bioaxis-black px-2 py-1 text-[11px] leading-5 text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  {family.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

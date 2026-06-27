import Link from "next/link";
import type { ProductSubcategory, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/data/productTaxonomy";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
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

      <SegmentFamilyDisclosure categories={segment.subcategories} segmentHref={`/products/${segment.slug}`} segmentSlug={segment.slug} />

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
          href={buildRequestHref({ segment: segment.slug, requestType: "equivalent" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
      </div>
    </article>
  );
}

function SegmentFamilyDisclosure({
  categories,
  segmentHref,
  segmentSlug
}: {
  categories: ProductSubcategory[];
  segmentHref: string;
  segmentSlug: string;
}) {
  return (
    <details data-product-family-disclosure="true" className="mt-5 border-t border-bioaxis-line pt-4">
      <summary className="cursor-pointer text-xs font-bold uppercase text-bioaxis-accent">Show family links</summary>
      <div className="mt-4 max-h-96 overflow-y-auto rounded-none border border-white/[0.08] bg-bioaxis-black/55 p-3">
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.slug}>
              <Link
                href={`/products/${segmentSlug}/${category.slug}`}
                className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-dim transition hover:text-bioaxis-accent"
              >
                {category.title}
              </Link>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {category.families.slice(0, 8).map((family) => (
                  <Link
                    key={family.slug}
                    href={`/products/${segmentSlug}/${category.slug}/${family.slug}`}
                    className="border border-white/[0.1] bg-bioaxis-panel px-2 py-1 text-[11px] leading-5 text-bioaxis-steel transition hover:border-bioaxis-accent hover:bg-bioaxis-accent/10 hover:text-bioaxis-accent focus:border-bioaxis-accent focus:text-bioaxis-accent"
                  >
                    {family.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href={segmentHref}
            className="text-[11px] font-bold uppercase text-bioaxis-accent transition hover:text-bioaxis-text"
          >
            View segment
          </Link>
        </div>
      </div>
    </details>
  );
}

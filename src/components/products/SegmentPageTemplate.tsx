import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { productTaxonomy } from "@/data/productTaxonomy";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { ExploreByCategoryRail } from "./ExploreByCategoryRail";
import { ProductListingSkeleton } from "./ProductListingSkeleton";
import { RelatedCategoryLinks } from "./RelatedCategoryLinks";
import { SubcategoryPreviewSection } from "./SubcategoryPreviewSection";

type SegmentPageTemplateProps = {
  segment: ProductTaxonomySegment;
};

export function SegmentPageTemplate({ segment }: SegmentPageTemplateProps) {
  const firstSubcategory = segment.subcategories[0];
  const relatedSegments = productTaxonomy.filter((item) => segment.relatedSegments.includes(item.slug)).slice(0, 6);

  return (
    <>
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: segment.title }]} />
      <PageHero eyebrow={`Product category ${String(segment.index).padStart(2, "0")}`} title={segment.title} subtitle={segment.heroDescription}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/request-quote?category=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
            View all sourcing options
          </Link>
          <Link href={`/request-quote?category=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Request quote
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Explore by Category</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Browse {segment.shortTitle} subcategories.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Category rails link to real subcategory pages with featured families, sourcing skeletons, filters, and request CTAs.
          </p>
        </div>
        <ExploreByCategoryRail segmentSlug={segment.slug} subcategories={segment.subcategories} />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:px-10">
        {segment.subcategories.map((subcategory) => (
          <SubcategoryPreviewSection key={subcategory.slug} segmentSlug={segment.slug} subcategory={subcategory} />
        ))}
      </section>

      {firstSubcategory ? (
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
          <ProductListingSkeleton segmentSlug={segment.slug} subcategory={firstSubcategory} />
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <RelatedCategoryLinks
          links={segment.subcategories.slice(0, 6).map((subcategory) => ({
            label: subcategory.title,
            href: `/products/${segment.slug}/${subcategory.slug}`
          }))}
          relatedSegments={relatedSegments}
        />
      </section>

      <CTASection
        title="Need help matching specifications?"
        body="Submit a product name, supplier, catalog number, format, or workflow. BioAxis will help organize sourcing options, equivalent products, samples, and documentation where available."
        primaryLabel="Request sourcing support"
        primaryHref={`/request-quote?category=${segment.slug}`}
        secondaryLabel="Find equivalent"
        secondaryHref={`/equivalents?category=${segment.slug}`}
      />
    </>
  );
}

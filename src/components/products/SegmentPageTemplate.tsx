import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { productTaxonomy } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { ExploreByCategoryRail } from "./ExploreByCategoryRail";
import { ProductListingSkeleton } from "./ProductListingSkeleton";
import { RFQCTA } from "./RFQCTA";
import { RelatedCategoryLinks } from "./RelatedCategoryLinks";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SubcategoryPreviewSection } from "./SubcategoryPreviewSection";

type SegmentPageTemplateProps = {
  segment: ProductTaxonomySegment;
};

export function SegmentPageTemplate({ segment }: SegmentPageTemplateProps) {
  const firstSubcategory = segment.subcategories[0];
  const relatedSegments = productTaxonomy.filter((item) => segment.relatedSegments.includes(item.slug)).slice(0, 6);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: segment.title }]} />
      <PageHero eyebrow={`Product category ${String(segment.index).padStart(2, "0")}`} title={segment.title} subtitle={segment.heroDescription}>
        <SourcingRequestButtonGroup segment={segment.slug} size="md" layout="inline" />
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Explore by Category</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Browse {segment.shortTitle} categories.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Categories open into product families, specification filters, equivalent review paths, sample requests, documentation support, and quote-ready sourcing actions.
          </p>
        </div>
        <ExploreByCategoryRail segmentSlug={segment.slug} subcategories={segment.subcategories} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Featured categories</p>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Common starting points.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {segment.featuredCategories.map((category) => (
            <Link key={category.slug} href={`/products/${segment.slug}/${category.slug}`} className="border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
              <h3 className="text-lg font-bold uppercase text-bioaxis-text">{category.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{category.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:px-10">
        {segment.subcategories.map((subcategory) => (
          <SubcategoryPreviewSection key={subcategory.slug} segmentSlug={segment.slug} subcategory={subcategory} />
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-3 lg:px-10">
        <InfoPanel title="Key applications" items={segment.primaryApplications} />
        <InfoPanel title="Common buyer questions" items={segment.rfqPrompts} />
        <InfoPanel title="Documentation & quality support" items={segment.specifications.slice(0, 5)} />
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

      <RFQCTA
        title="Need help matching specifications?"
        body="Submit a product name, supplier, catalog number, format, or workflow. BioAxis will help organize sourcing options, equivalent products, samples, and documentation where available."
        segment={segment.slug}
      />
    </>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}

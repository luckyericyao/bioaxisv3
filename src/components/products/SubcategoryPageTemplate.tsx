import Link from "next/link";
import type { ProductSubcategory, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { productTaxonomy } from "@/data/productTaxonomy";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { FeaturedFamilyCard } from "./FeaturedFamilyCard";
import { FilterSidebar } from "./FilterSidebar";
import { ProductListingSkeleton } from "./ProductListingSkeleton";
import { RelatedCategoryLinks } from "./RelatedCategoryLinks";

type SubcategoryPageTemplateProps = {
  segment: ProductTaxonomySegment;
  subcategory: ProductSubcategory;
};

export function SubcategoryPageTemplate({ segment, subcategory }: SubcategoryPageTemplateProps) {
  const query = `category=${segment.slug}&subcategory=${subcategory.slug}`;
  const siblingLinks = segment.subcategories
    .filter((item) => item.slug !== subcategory.slug)
    .slice(0, 5)
    .map((item) => ({ label: item.title, href: `/products/${segment.slug}/${item.slug}` }));
  const relatedSegments = productTaxonomy.filter((item) => subcategory.relatedSegments.includes(item.slug)).slice(0, 4);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: segment.title, href: `/products/${segment.slug}` },
          { label: subcategory.title }
        ]}
      />
      <PageHero eyebrow={segment.title} title={subcategory.title} subtitle={subcategory.description}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/request-quote?${query}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
            View sourcing options
          </Link>
          <Link href={`/samples?${query}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Request sample
          </Link>
          <Link href={`/equivalents?${query}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Find equivalent
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Explore by Category</p>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Featured product families.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subcategory.featuredFamilies.map((family) => (
            <Link key={family.slug} href={`#${family.slug}`} className="border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
              <h3 className="text-lg font-bold uppercase text-bioaxis-text">{family.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{family.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        {subcategory.featuredFamilies.map((family) => (
          <FeaturedFamilyCard key={family.slug} family={family} segmentSlug={segment.slug} subcategorySlug={subcategory.slug} />
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <FilterSidebar subcategory={subcategory} />
        <ProductListingSkeleton segmentSlug={segment.slug} subcategory={subcategory} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <RelatedCategoryLinks links={siblingLinks} relatedSegments={relatedSegments} />
      </section>

      <CTASection
        title="Need help matching specifications?"
        body="Submit a product name, supplier, catalog number, format, or workflow. BioAxis will help organize sourcing options, equivalent products, samples, and documentation where available."
        primaryLabel="Request quote"
        primaryHref={`/request-quote?${query}`}
        secondaryLabel="Ask support"
        secondaryHref="/support"
      />
    </>
  );
}

import Link from "next/link";
import type { ProductCategory, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { productTaxonomy } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { DocumentationChecklist } from "./DocumentationChecklist";
import { FilterSidebar } from "./FilterSidebar";
import { ProductFamilyCard } from "./ProductFamilyCard";
import { ProductListingSkeleton } from "./ProductListingSkeleton";
import { RFQCTA } from "./RFQCTA";
import { RelatedCategoryLinks } from "./RelatedCategoryLinks";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SpecificationTable } from "./SpecificationTable";

type CategoryPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
};

export function CategoryPageTemplate({ segment, category }: CategoryPageTemplateProps) {
  const relatedSegments = productTaxonomy.filter((item) => category.relatedSegments.includes(item.slug)).slice(0, 4);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.title, href: `/products/${segment.slug}` },
          { label: category.title }
        ]}
      />
      <PageHero eyebrow={segment.title} title={category.title} subtitle={category.longDescription}>
        <SourcingRequestButtonGroup segment={segment.slug} category={category.slug} size="md" layout="inline" />
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Product families</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Browse family-level sourcing paths.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Each family opens a dedicated page with use cases, formats, selection guidance, specifications, documentation needs, and RFQ context.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {category.productFamilies.map((family) => (
            <ProductFamilyCard key={family.slug} family={family} segmentSlug={segment.slug} categorySlug={category.slug} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <FilterSidebar subcategory={category} />
        <ProductListingSkeleton segmentSlug={segment.slug} subcategory={category} />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <SpecificationTable specifications={category.specifications} criteria={category.selectionCriteria} />
        <InfoCard title="Common formats" items={category.commonFormats} />
        <InfoCard title="Typical applications" items={category.commonApplications} />
        <InfoCard title="Equivalent-switching guidance" items={segment.equivalentPrompts} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <DocumentationChecklist items={category.documentation} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <RelatedCategoryLinks
          links={category.relatedCategories.map((related) => ({
            label: related.label,
            href: related.href
          }))}
          relatedSegments={relatedSegments}
        />
      </section>

      <RFQCTA
        title="Prepare a category sourcing request."
        body="Send BioAxis the product family, current supplier or catalog number, quantity, sterile status, documentation need, and target date. BioAxis will organize quote, equivalent, and sample support without presenting fake inventory or pricing."
        segment={segment.slug}
        category={category.slug}
      />
    </>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <SpecTag key={item}>{item}</SpecTag>
        ))}
      </div>
      {title === "Equivalent-switching guidance" ? (
        <Link
          href="/request-quote?requestType=equivalent"
          className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Start equivalent request
        </Link>
      ) : null}
    </section>
  );
}

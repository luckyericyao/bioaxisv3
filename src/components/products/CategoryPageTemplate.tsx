import Link from "next/link";
import type { ProductCategory, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductFamilyCard } from "./ProductFamilyCard";
import { RFQCTA } from "./RFQCTA";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { DirectoryItemList } from "@/components/seo/StructuredData";

type CategoryPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
};

export function CategoryPageTemplate({ segment, category }: CategoryPageTemplateProps) {
  return (
    <>
      <DirectoryItemList
        name={category.title}
        path={`/products/${segment.slug}/${category.slug}`}
        items={category.productFamilies.map((family) => ({ name: family.title, href: `/products/${segment.slug}/${category.slug}/${family.slug}` }))}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.title, href: `/products/${segment.slug}` },
          { label: category.title }
        ]}
      />
      <PageHero title={category.title} subtitle={category.shortDescription} compact tight align="start">
        <div className="grid gap-3" data-category-decision-summary="true">
          <Link href={`/products?view=configurations&segment=${segment.slug}&category=${category.slug}`} className="action-primary w-fit">Compare configuration targets</Link>
          <details><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-bioaxis-accent">Request sourcing support</summary><SourcingRequestButtonGroup segment={segment.slug} category={category.slug} layout="decision" includeDocumentation /></details>
          <Link href={`/products/${segment.slug}`} className="text-xs font-semibold text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {segment.title}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10" data-category-families="true">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-bioaxis-text">Choose a product family.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            Compare formats and choose the requirements that matter to your workflow.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {category.productFamilies.map((family) => (
            <ProductFamilyCard key={family.slug} family={family} segmentSlug={segment.slug} categorySlug={category.slug} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10" data-category-guidance="true">
        <div className="grid gap-3">
          <details className="group border border-bioaxis-line bg-bioaxis-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-bioaxis-text [&::-webkit-details-marker]:hidden">
              <span>Category overview</span>
              <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="border-t border-bioaxis-line p-5 text-sm leading-6 text-bioaxis-muted">{category.longDescription}</p>
          </details>
          <Disclosure title="Buyer decision filters" items={category.selectionCriteria.slice(0, 8)} />
          <Disclosure title="Common specifications" items={category.specifications.slice(0, 10)} />
        </div>
      </section>

      <RFQCTA
        title="Need help narrowing the options?"
        body="Send a current reference or describe the format and workflow you need."
        segment={segment.slug}
        category={category.slug}
      />
    </>
  );
}

function Disclosure({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="group border border-bioaxis-line bg-bioaxis-panel">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-bioaxis-text [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
      </summary>
      <div className="border-t border-bioaxis-line p-5">
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="flex max-w-full"><SpecTag>{item}</SpecTag></li>
          ))}
        </ul>
      </div>
    </details>
  );
}

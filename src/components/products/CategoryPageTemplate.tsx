import Link from "next/link";
import type { ProductCategory, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductFamilyCard } from "./ProductFamilyCard";
import { RFQCTA } from "./RFQCTA";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";

type CategoryPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
};

export function CategoryPageTemplate({ segment, category }: CategoryPageTemplateProps) {
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
        <div className="grid gap-3">
          <SourcingRequestButtonGroup segment={segment.slug} category={category.slug} size="md" layout="inline" />
          <Link href={`/products/${segment.slug}`} className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {segment.title}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Next step</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Choose a product family.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            Family pages show product item cards, buyer checklists, and request context. Detailed specifications live on product item pages.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {category.productFamilies.map((family) => (
            <ProductFamilyCard key={family.slug} family={family} segmentSlug={segment.slug} categorySlug={category.slug} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <DecisionPanel title="Buyer decision filters" items={category.selectionCriteria.slice(0, 8)} />
        <DecisionPanel title="Common specs as chips" items={category.specifications.slice(0, 10)} />
      </section>

      <RFQCTA
        title="Send this category context."
        body="Choose a family first when you know it, or send this category with your email. BioAxis can follow up for supplier, catalog number, quantity, sample, equivalent, or documentation details."
        segment={segment.slug}
        category={category.slug}
      />
    </>
  );
}

function DecisionPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <SpecTag key={item}>{item}</SpecTag>
        ))}
      </div>
    </section>
  );
}

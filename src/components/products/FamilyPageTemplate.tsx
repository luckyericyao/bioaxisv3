import Link from "next/link";
import type { ProductCategory, ProductFamily, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductConfigurationSection } from "./ProductConfigurationSection";
import { RFQCTA } from "./RFQCTA";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SupplierComparisonModule } from "./SupplierComparisonModule";

type FamilyPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
  family: ProductFamily;
};

export function FamilyPageTemplate({ segment, category, family }: FamilyPageTemplateProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.title, href: `/products/${segment.slug}` },
          { label: category.title, href: `/products/${segment.slug}/${category.slug}` },
          { label: family.title }
        ]}
      />
      <PageHero eyebrow={`${segment.title} / ${category.title}`} title={family.title} subtitle={family.shortDescription}>
        <div className="grid gap-3">
          <SourcingRequestButtonGroup segment={segment.slug} category={category.slug} family={family.slug} size="md" layout="inline" includeDocumentation />
          <Link href={`/products/${segment.slug}/${category.slug}`} className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {category.title}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Family overview</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Where this family fits</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{family.longDescription}</p>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Buyer checklist</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {family.recommendedRFQFields.slice(0, 8).map((field) => (
              <SpecTag key={field}>{field}</SpecTag>
            ))}
          </div>
        </section>
      </section>

      <ProductConfigurationSection segment={segment} category={category} family={family} />

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-3">
          <Disclosure title="Selection guidance" items={family.selectionCriteria} />
          <Disclosure title="Applications" items={family.applications} />
          <Disclosure title="Compatibility and equivalent notes" items={family.equivalentSwitchingConsiderations} />
          <Disclosure title="Documentation" items={family.documentationChecklist} />
          <Disclosure title="Sample and quote inputs" items={family.equivalentMatchingInputs} />
        </div>
      </section>

      <SupplierComparisonModule
        title={family.title}
        href={`/products/${segment.slug}/${category.slug}/${family.slug}`}
        segmentSlug={segment.slug}
        categorySlug={category.slug}
        familySlug={family.slug}
        segmentTitle={segment.title}
        categoryTitle={category.title}
        familyTitle={family.title}
      />

      <RFQCTA
        title="Send this family to BioAxis."
        body="BioAxis will include the segment, category, and family context automatically. Only your email is required; add supplier, catalog number, quantity, sample, or documentation details only if useful."
        segment={segment.slug}
        category={category.slug}
        family={family.slug}
      />
    </>
  );
}

function Disclosure({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="group border border-bioaxis-line bg-bioaxis-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold uppercase text-bioaxis-text">
        <span>{title}</span>
        <span className="text-bioaxis-accent transition group-open:rotate-45">+</span>
      </summary>
      <div className="border-t border-bioaxis-line p-5">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <SpecTag key={item}>{item}</SpecTag>
          ))}
        </div>
      </div>
    </details>
  );
}

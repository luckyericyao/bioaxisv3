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
      <PageHero title={family.title} subtitle={family.shortDescription} compact tight align="start">
        <div className="grid gap-3" data-family-decision-summary="true">
          <SourcingRequestButtonGroup segment={segment.slug} category={category.slug} family={family.slug} layout="decision" includeDocumentation />
          <Link href={`/products/${segment.slug}/${category.slug}`} className="text-xs font-semibold text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {category.title}
          </Link>
        </div>
      </PageHero>

      <ProductConfigurationSection segment={segment} category={category} family={family} />

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-3">
          <details className="group border border-bioaxis-line bg-bioaxis-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-bioaxis-text [&::-webkit-details-marker]:hidden">
              <span>Family overview</span>
              <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="border-t border-bioaxis-line p-5 text-sm leading-6 text-bioaxis-muted">{family.longDescription}</p>
          </details>
          <Disclosure title="Buyer checklist" items={family.recommendedRFQFields} />
          <Disclosure title="How to select" items={family.selectionCriteria} />
          <Disclosure title="Equivalent switching considerations" items={family.equivalentSwitchingConsiderations} />
          <Disclosure title="Documentation checklist" items={family.documentationChecklist} />
          <Disclosure title="Sample / RFQ context" items={family.equivalentMatchingInputs} />
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
        buyerInputs={family.equivalentMatchingInputs.slice(0, 6)}
      />

      <RFQCTA
        title="Send this family to BioAxis."
        body="BioAxis will include the segment, category, and family context automatically. Only your email is required; add supplier, catalog number, quantity, sample, or documentation details only if useful."
        segment={segment.slug}
        category={category.slug}
        family={family.slug}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Compliance disclaimer</p>
          <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
            Product fit, equivalent suitability, documentation, and sample acceptance should be reviewed and validated by the buyer for the intended protocol, instrument, quality system, and application.
          </p>
        </div>
      </section>
    </>
  );
}

function Disclosure({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="group border border-bioaxis-line bg-bioaxis-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-bioaxis-text [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
      </summary>
      <div className="border-t border-bioaxis-line p-5">
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="flex max-w-full"><SpecTag>{cleanListItem(item)}</SpecTag></li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function cleanListItem(item: string) {
  return item.replace(/^\s*(?:[-*•]\s*)+/, "").trim();
}

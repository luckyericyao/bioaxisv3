import Link from "next/link";
import type { ProductCategory, ProductFamily, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/data/productTaxonomy";
import { getPriorityProductContent } from "@/data/priorityProductContent";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { DocumentationChecklist } from "./DocumentationChecklist";
import { ProductConfigurationSection } from "./ProductConfigurationSection";
import { PriorityProductContentSection } from "./PriorityProductContentSection";
import { RFQCTA } from "./RFQCTA";
import { RelatedProducts } from "./RelatedProducts";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SupplierComparisonModule } from "./SupplierComparisonModule";

type FamilyPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
  family: ProductFamily;
};

export function FamilyPageTemplate({ segment, category, family }: FamilyPageTemplateProps) {
  const priorityContent = getPriorityProductContent(segment.slug, category.slug, family.slug);
  const relatedFamilies = category.productFamilies
    .filter((item) => family.relatedFamilies.includes(item.slug))
    .map((item) => ({
      label: item.title,
      href: `/products/${segment.slug}/${category.slug}/${item.slug}`,
      description: relatedFamilyDescription(item.slug, item.title, category.title)
    }));

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
      <PageHero eyebrow={`${segment.title} / ${category.title}`} title={family.title} subtitle={family.longDescription}>
        <SourcingRequestButtonGroup segment={segment.slug} category={category.slug} family={family.slug} size="md" layout="inline" includeDocumentation />
      </PageHero>

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

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <InfoCard title="What this product family is used for" items={family.commonUseCases} />
        <InfoCard title="Common formats" items={family.commonFormats} />
        <InfoCard title="How to select" items={family.selectionCriteria} />
        <InfoCard title="Equivalent switching considerations" items={family.equivalentSwitchingConsiderations} />
      </section>

      {priorityContent ? <PriorityProductContentSection content={priorityContent} /> : null}

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <InfoCard
          title="How BioAxis helps source this"
          items={[
            "Convert product descriptions, current supplier details, and catalog numbers into quote-ready product specifications.",
            "Compare equivalent options by format, material, sterility, packaging, documentation, and application fit.",
            "Coordinate sample-first evaluation when switching could affect cells, assays, automation decks, or QC workflows.",
            "Organize documentation requests including CoA, SDS, sterility statements, material declarations, and lot traceability where available."
          ]}
        />
      </section>

      <ProductConfigurationSection segment={segment} category={category} family={family} />

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <DocumentationChecklist items={family.documentationChecklist} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">RFQ form context</p>
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Prefill your sourcing request.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
            The request link carries segment, category, family, and inquiry type parameters into the quote form. Include these buyer fields so BioAxis can organize quote, equivalent, sample, and documentation support.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {family.recommendedRFQFields.map((field) => (
              <div key={field} className="border border-bioaxis-line bg-bioaxis-black p-4 text-sm text-bioaxis-steel">
                {field}
              </div>
            ))}
          </div>
          <Link
            href={buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, requestType: "quote" })}
            className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Open prefilled RFQ
          </Link>
        </section>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <RelatedProducts links={relatedFamilies} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-5">
          <h2 className="text-xl font-bold uppercase text-bioaxis-text">Compliance disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
            BioAxis helps source appropriate products and documentation; final suitability depends on customer application and validation.
          </p>
        </div>
      </section>

      <RFQCTA
        title="Ready to review this family?"
        body="Submit product, current brand, catalog number, quantity, sterile status, documentation need, target delivery date, institution, email, and notes so BioAxis can organize sourcing support."
        segment={segment.slug}
        category={category.slug}
        family={family.slug}
      />
    </>
  );
}

function relatedFamilyDescription(slug: string, title: string, categoryTitle: string) {
  const descriptions: Record<string, string> = {
    "filtered-pipette-tips": "Aerosol-barrier tips for PCR, qPCR, cell culture, assay setup, and other contamination-sensitive workflows.",
    "universal-pipette-tips": "General-purpose tips for routine manual and multichannel liquid handling, selected by fit, volume range, packaging format, and documentation needs.",
    "low-retention-pipette-tips": "Tips for viscous, low-volume, or recovery-sensitive transfers where surface behavior and liquid retention matter.",
    "extended-length-pipette-tips": "Longer-reach tips for tubes, reservoirs, deep wells, and workflows where standard tips do not reach cleanly.",
    "sterile-pipette-tips": "Sterile tips for cell culture, assay setup, reagent handling, and contamination-sensitive bench workflows.",
    "reload-and-bulk-pipette-tips": "Reload and bulk formats for high-use labs comparing packaging efficiency, rack fit, and recurring supply needs.",
    "microcentrifuge-tubes": "Small-volume tubes for sample prep, spin-downs, storage, and molecular biology workflows.",
    "96-well-pcr-plates": "PCR plates selected by skirt style, profile, seal compatibility, instrument fit, and PCR-clean documentation.",
    "pes-syringe-filters": "PES membrane filters for aqueous samples, media, protein-containing solutions, and sterile filtration review.",
    "hamilton-robotic-tips": "Robotic tips for Hamilton-style methods where deck fit, rack format, conductivity, and validation samples matter."
  };

  return descriptions[slug] ?? `${title} for ${categoryTitle.toLowerCase()} workflows, selected by format, compatibility, documentation needs, and sample evaluation criteria.`;
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
    </section>
  );
}

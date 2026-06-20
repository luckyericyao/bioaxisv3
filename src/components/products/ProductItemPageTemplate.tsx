import Link from "next/link";
import { buildEquivalentFinderHref, buildRequestHref, type ProductCategory, type ProductFamily, type ProductItem, type ProductTaxonomySegment } from "@/data/productTaxonomy";
import { getProductItemHref, getProductItemsForFamily } from "@/data/productItems";
import { AddToSourcingListButton } from "@/components/sourcing/AddToSourcingListButton";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { RFQCTA } from "./RFQCTA";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SupplierComparisonModule } from "./SupplierComparisonModule";

type ProductItemPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
  family: ProductFamily;
  productItem: ProductItem;
};

export function ProductItemPageTemplate({ segment, category, family, productItem }: ProductItemPageTemplateProps) {
  const relatedConfigurations = getProductItemsForFamily(segment.slug, category.slug, family.slug)
    .filter((item) => item.slug !== productItem.slug)
    .slice(0, 6);
  const quoteReadyDetails = [
    "product name or product family",
    "current supplier and catalog number if available",
    "volume, format, material, sterility, or other critical specification",
    "quantity and target timeline",
    "documentation requirements",
    "sample needs and evaluation criteria"
  ];
  const requestLinks = [
    {
      label: "Request quote",
      href: buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug, requestType: "quote" })
    },
    {
      label: "Find equivalent",
      href: buildEquivalentFinderHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug })
    },
    {
      label: "Request sample",
      href: buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug, requestType: "sample" })
    },
    {
      label: "Ask for documentation",
      href: buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug, requestType: "documentation" })
    }
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.title, href: `/products/${segment.slug}` },
          { label: category.title, href: `/products/${segment.slug}/${category.slug}` },
          { label: family.title, href: `/products/${segment.slug}/${category.slug}/${family.slug}` },
          { label: productItem.name }
        ]}
      />
      <PageHero eyebrow={`${segment.title} / ${category.title} / ${family.title}`} title={productItem.name} subtitle={productItem.introduction}>
        <div className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            {productItem.commonSpecifications.slice(0, 5).map((specification) => (
              <SpecTag key={specification}>{cleanListItem(specification)}</SpecTag>
            ))}
          </div>
          <SourcingRequestButtonGroup
            segment={segment.slug}
            category={category.slug}
            family={family.slug}
            product={productItem.slug}
            size="md"
            layout="inline"
            includeDocumentation
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <AddToSourcingListButton
              title={productItem.name}
              href={getProductItemHref(segment.slug, category.slug, family.slug, productItem.slug)}
              segmentSlug={segment.slug}
              categorySlug={category.slug}
              familySlug={family.slug}
              productSlug={productItem.slug}
              segmentTitle={segment.title}
              categoryTitle={category.title}
              familyTitle={family.title}
              productTitle={productItem.name}
            />
            <Link href={`/products/${segment.slug}/${category.slug}/${family.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Back to family
            </Link>
          </div>
        </div>
      </PageHero>

      <SupplierComparisonModule
        title={productItem.name}
        href={getProductItemHref(segment.slug, category.slug, family.slug, productItem.slug)}
        segmentSlug={segment.slug}
        categorySlug={category.slug}
        familySlug={family.slug}
        productSlug={productItem.slug}
        segmentTitle={segment.title}
        categoryTitle={category.title}
        familyTitle={family.title}
        productTitle={productItem.name}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Product item details</p>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Open only the detail you need.</h2>
        </div>
        <div className="grid gap-3">
          <InfoPanel title="Specifications" items={[...productItem.details, ...productItem.commonSpecifications]} />
          <InfoPanel title="Applications" items={productItem.applications} />
          <InfoPanel title="Compatibility" items={productItem.compatibilityConsiderations} />
          <InfoPanel title="Documentation" items={productItem.documentationNeeds} />
          <InfoPanel title="Equivalent matching" items={productItem.equivalentMatchingInputs} />
          <InfoPanel title="Sample request notes" items={productItem.sampleEvaluationNotes} />
          <InfoPanel title="Quote-ready details" items={quoteReadyDetails} links={requestLinks} />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Related product configurations</p>
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Other configurations in this family</h2>
          {relatedConfigurations.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {relatedConfigurations.map((item) => (
                <Link
                  key={item.slug}
                  href={getProductItemHref(segment.slug, category.slug, family.slug, item.slug)}
                  className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent"
                >
                  <span className="text-sm font-bold uppercase text-bioaxis-text">{item.name}</span>
                  <span className="mt-2 block text-sm leading-6 text-bioaxis-muted">{item.shortDescription}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
              This family currently has one product configuration path. BioAxis can still review alternate formats through the request form.
            </p>
          )}
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-black p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Back to catalog context</h2>
          <div className="mt-5 grid gap-3">
            <Link href={`/products/${segment.slug}/${category.slug}/${family.slug}`} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              View {family.title}
            </Link>
            <Link href={`/products/${segment.slug}/${category.slug}`} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              View {category.title}
            </Link>
            <Link href={`/products/${segment.slug}`} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              View {segment.title}
            </Link>
          </div>
        </section>
      </section>

      <RFQCTA
        title="Ready to review this product item?"
        body="Send BioAxis this product context with one click. Only your email is required, and BioAxis can follow up for supplier, catalog number, quantity, sample, documentation, or timeline details."
        segment={segment.slug}
        category={category.slug}
        family={family.slug}
        product={productItem.slug}
      />
    </>
  );
}

function InfoPanel({ title, items, links = [] }: { title: string; items: string[]; links?: { label: string; href: string }[] }) {
  return (
    <details className="group border border-bioaxis-line bg-bioaxis-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold uppercase text-bioaxis-text">
        <span>{title}</span>
        <span className="text-bioaxis-accent transition group-open:rotate-45">+</span>
      </summary>
      <ul className="grid gap-3 border-t border-bioaxis-line p-5">
        {items.map((item) => (
          <li key={item} className="border border-white/[0.1] bg-bioaxis-black px-4 py-3 text-sm leading-6 text-bioaxis-steel">
            {cleanListItem(item)}
          </li>
        ))}
      </ul>
      {links.length > 0 ? (
        <div className="grid gap-2 border-t border-bioaxis-line p-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((request) => (
            <Link
              key={request.label}
              href={request.href}
              className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              {request.label}
            </Link>
          ))}
        </div>
      ) : null}
    </details>
  );
}

function cleanListItem(item: string) {
  return item.replace(/^\s*(?:[-*•]\s*)+/, "").trim();
}

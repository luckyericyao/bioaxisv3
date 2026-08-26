import Link from "next/link";
import { CompactSourcingIntake } from "@/components/forms/CompactSourcingIntake";
import { buildRequestHref, type ProductCategory, type ProductFamily, type ProductItem, type ProductTaxonomySegment } from "@/data/productTaxonomy";
import { getIndexableProductItemsForFamily, getProductItemHref } from "@/data/productItems";
import { AddToSourcingListButton } from "@/components/sourcing/AddToSourcingListButton";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import { Breadcrumbs } from "./Breadcrumbs";
import { SupplierComparisonModule } from "./SupplierComparisonModule";

type ProductItemPageTemplateProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
  family: ProductFamily;
  productItem: ProductItem;
};

export function ProductItemPageTemplate({ segment, category, family, productItem }: ProductItemPageTemplateProps) {
  const relatedConfigurations = getIndexableProductItemsForFamily(segment.slug, category.slug, family.slug)
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
      label: "Request quote from this template",
      href: buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug, requestType: "quote" })
    },
    {
      label: "Review equivalent",
      href: buildRequestHref({ segment: segment.slug, category: category.slug, family: family.slug, product: productItem.slug, requestType: "equivalent" })
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
      <PageHero
        eyebrow={`${segment.title} / ${category.title} / ${family.title}`}
        title={productItem.name}
        subtitle={productItem.shortDescription}
        compact
        tight
        align="start"
      >
        <div className="grid gap-3">
          <p className="border border-amber-500/50 bg-amber-50 px-3 py-2 text-xs font-bold uppercase text-amber-800">
            Sourcing template · not a verified supplier SKU
          </p>
          <div className="flex flex-wrap gap-2">
            {productItem.commonSpecifications.slice(0, 5).map((specification) => (
              <SpecTag key={specification}>{cleanListItem(specification)}</SpecTag>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href={requestLinks[0].href}
              className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-4 text-xs font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
            >
              Request quote
            </Link>
            <Link
              href={requestLinks[2].href}
              className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Request sample
            </Link>
            <Link
              href={requestLinks[1].href}
              className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Review equivalent
            </Link>
          </div>
          <details className="group border border-bioaxis-line bg-bioaxis-black">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-bold uppercase text-bioaxis-steel [&::-webkit-details-marker]:hidden">
              <span>Send product context</span>
              <span className="text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-bioaxis-line p-3">
              <CompactSourcingIntake
                requestType="quote"
                sourcePage={getProductItemHref(segment.slug, category.slug, family.slug, productItem.slug)}
                segment={segment.title}
                category={category.title}
                family={family.title}
                product={productItem.name}
                title="Send this product context."
                productFieldLabel="SKU, catalog number, supplier line, or product list"
                submitLabel="Send sourcing request"
              />
            </div>
          </details>
          <p className="max-w-3xl border-l border-bioaxis-accent/60 pl-3 text-xs leading-5 text-bioaxis-dim">
            This page describes a configurable sourcing target. Supplier, catalog reference, exact specifications, availability, documentation, and final fit are confirmed per request.
          </p>
          <details className="group border border-bioaxis-line bg-bioaxis-black">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-bold uppercase text-bioaxis-steel [&::-webkit-details-marker]:hidden">
              <span>More sourcing actions</span>
              <span className="text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-2 border-t border-bioaxis-line p-3 sm:grid-cols-3">
              <Link
                href={requestLinks[3].href}
                className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-center text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                Ask for documents
              </Link>
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
                className="min-h-10 px-3 text-xs"
              />
              <Link href={`/products/${segment.slug}/${category.slug}/${family.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-center text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                Back to family
              </Link>
            </div>
          </details>
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
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Sourcing template details</p>
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
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Related product paths</p>
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Other configured items in this family</h2>
          {relatedConfigurations.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {relatedConfigurations.map((item) => (
                <Link
                  key={item.slug}
                  href={getProductItemHref(segment.slug, category.slug, family.slug, item.slug)}
                  className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent"
                >
                  <span className="text-sm font-bold text-bioaxis-text">{item.name}</span>
                  <span className="mt-2 block text-sm leading-6 text-bioaxis-muted">{item.shortDescription}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
              This family currently has no additional configured item paths. BioAxis can still review alternate formats through the request form.
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

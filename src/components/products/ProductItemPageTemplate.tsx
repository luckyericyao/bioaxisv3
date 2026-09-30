import Link from "next/link";
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
  const specificationGroups = splitSpecificationGroups(productItem.commonSpecifications);
  const targetSpecifications = specificationGroups.targets.slice(0, 5);
  const optionsToConfirm = specificationGroups.toConfirm.slice(0, 5 - targetSpecifications.length);
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
        title={productItem.name}
        subtitle={productItem.shortDescription}
        compact
        tight
        align="start"
      >
        <div className="grid gap-3" data-product-decision-summary="true">
          <p role="note" className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-bioaxis-accent/70 pl-3 text-xs leading-5 text-bioaxis-muted">
            <span className="font-bold uppercase text-bioaxis-accent">Sourcing template</span>
            <span>Confirm supplier specifications, fit, and availability.</span>
          </p>
          {targetSpecifications.length > 0 ? (
            <div data-product-specification-group="target">
              <p className="mb-2 text-[11px] font-bold uppercase text-bioaxis-dim">Target specifications</p>
              <ul className="flex flex-wrap gap-2">
                {targetSpecifications.map((specification) => (
                  <li key={specification} className="flex max-w-full"><SpecTag>{cleanListItem(specification)}</SpecTag></li>
                ))}
              </ul>
            </div>
          ) : null}
          {optionsToConfirm.length > 0 ? (
            <div data-product-specification-group="options">
              <p className="mb-2 text-[11px] font-bold uppercase text-bioaxis-dim">
                {specificationGroups.targets.length > 0 ? "Options and fit to confirm" : "Fields and options to confirm"}
              </p>
              <ul className="flex flex-wrap gap-2">
                {optionsToConfirm.map((specification) => (
                  <li key={specification} className="flex max-w-full"><SpecTag>{cleanListItem(specification)}</SpecTag></li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" data-product-primary-actions="true">
            <Link
              href={requestLinks[0].href}
              className="col-span-2 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-4 text-xs font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
            >
              Request quote
            </Link>
            <Link
              href={requestLinks[2].href}
              className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Request sample
            </Link>
            <Link
              href={requestLinks[1].href}
              className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Review equivalent
            </Link>
          </div>
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
        buyerInputs={productItem.equivalentMatchingInputs.slice(0, 6)}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Sourcing template details</p>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Open only the detail you need.</h2>
        </div>
        <div className="grid gap-3">
          <InfoPanel title="Sourcing context" items={productItem.details} />
          <InfoPanel title="Configuration fields to confirm" items={productItem.commonSpecifications} />
          <InfoPanel title="Applications" items={productItem.applications} />
          <InfoPanel title="Compatibility checks" items={productItem.compatibilityConsiderations} />
          <InfoPanel title="Documents to request" items={productItem.documentationNeeds} />
          <InfoPanel title="Equivalent review inputs" items={productItem.equivalentMatchingInputs} />
          <InfoPanel title="Sample request notes" items={productItem.sampleEvaluationNotes} />
          <InfoPanel title="Quote-ready details" items={quoteReadyDetails} links={requestLinks} />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-10">
        {relatedConfigurations.length > 0 ? (
          <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Related product paths</p>
            <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Other configured items in this family</h2>
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
          </section>
        ) : null}
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
  if (items.length === 0 && links.length === 0) return null;

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

function splitSpecificationGroups(specifications: string[]) {
  const explicitTargetFields = new Set([
    "nominal volume",
    "format",
    "profile",
    "membrane",
    "pore size",
    "surface",
    "filter barrier",
    "sterility",
    "serum status",
    "base formulation",
    "volume",
    "diameter",
    "mwco",
    "barcode",
    "barcode format",
    "thread style"
  ]);
  const targets: string[] = [];
  const toConfirm: string[] = [];

  specifications.forEach((specification) => {
    const separator = specification.indexOf(":");
    const field = separator < 0 ? "" : specification.slice(0, separator).trim().toLowerCase();
    const value = separator < 0 ? "" : specification.slice(separator + 1).trim();
    const isSpecificTarget = explicitTargetFields.has(field)
      && Boolean(value)
      && !/\b(?:or|option|review|required|relevant|dependent|compatibility)\b/i.test(value)
      && !/\b(?:review|option|fit|compatibility)\b/i.test(field);

    (isSpecificTarget ? targets : toConfirm).push(specification);
  });

  return { targets, toConfirm };
}

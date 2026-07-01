import Link from "next/link";
import { AddToSourcingListButton } from "@/components/sourcing/AddToSourcingListButton";
import { PageHero } from "@/components/ui/PageHero";
import { SpecTag } from "@/components/ui/SpecTag";
import type { DocumentStatus, ProductCatalogCategory, ProductCatalogFamily, ProductCatalogItem, ProductCatalogSegment } from "@/data/productCatalog";
import { productCatalogHref } from "@/data/productCatalog";
import { Breadcrumbs } from "../Breadcrumbs";
import { CatalogProductBrowser, type CatalogProductRow } from "./CatalogProductBrowser";

const statusLabels: Record<DocumentStatus, string> = {
  available: "Available",
  request_required: "Request required",
  supplier_dependent: "Supplier review required"
};

const documentLabels: Array<[keyof ProductCatalogItem["documents"], string]> = [
  ["sds", "SDS"],
  ["coa", "CoA"],
  ["specificationSheet", "Specification sheet"],
  ["sterilityStatement", "Sterility statement"],
  ["animalOriginStatement", "Animal origin statement"],
  ["lotLevelDocumentation", "Lot-level documentation"]
];

const buyerNeeds = [
  "Current supplier out of stock",
  "Need equivalent review",
  "Need sample before switching",
  "Need documentation package",
  "Need recurring supply planning",
  "Need quote from product list"
];

const typicalRfqFields = [
  "Format / volume / size",
  "Sterile or non-sterile",
  "Material",
  "Packaging",
  "Compatibility requirement",
  "Documentation requirement",
  "Quantity / recurring usage",
  "Current supplier SKU, if available"
];

function catalogRequestHref({
  requestType,
  segment,
  category,
  family,
  product,
  need
}: {
  requestType: string;
  segment: ProductCatalogSegment;
  category?: ProductCatalogCategory;
  family?: ProductCatalogFamily;
  product?: ProductCatalogItem;
  need?: string;
}) {
  const href = productCatalogHref(segment.slug, category?.slug, family?.slug, product?.slug);
  const params = new URLSearchParams({
    requestType,
    segment: segment.slug,
    sourcePage: href
  });

  if (category) params.set("category", category.slug);
  if (family) params.set("family", family.slug);
  if (product) params.set("product", product.slug);
  if (product?.supplier && !/optional|input/i.test(product.supplier)) params.set("supplier", product.supplier);
  if (product?.catalogNumber && !/optional|input/i.test(product.catalogNumber)) params.set("catalog", product.catalogNumber);
  if (need) params.set("need", need);

  return `/request-quote?${params.toString()}`;
}

function catalogEquivalentHref(segment: ProductCatalogSegment, category?: ProductCatalogCategory, family?: ProductCatalogFamily, product?: ProductCatalogItem) {
  return catalogRequestHref({ requestType: "equivalent", segment, category, family, product, need: "equivalent" });
}

function rowsForFamily(segment: ProductCatalogSegment, category: ProductCatalogCategory, family: ProductCatalogFamily): CatalogProductRow[] {
  return family.products.map((product) => ({
    href: productCatalogHref(segment.slug, category.slug, family.slug, product.slug),
    segmentSlug: segment.slug,
    categorySlug: category.slug,
    familySlug: family.slug,
    segmentTitle: segment.name,
    categoryTitle: category.name,
    familyTitle: family.name,
    product
  }));
}

function rowsForCategory(segment: ProductCatalogSegment, category: ProductCatalogCategory): CatalogProductRow[] {
  return category.families.flatMap((family) => rowsForFamily(segment, category, family));
}

function ContextActions({
  segment,
  category,
  family,
  product
}: {
  segment: ProductCatalogSegment;
  category?: ProductCatalogCategory;
  family?: ProductCatalogFamily;
  product?: ProductCatalogItem;
}) {
  const href = productCatalogHref(segment.slug, category?.slug, family?.slug, product?.slug);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={catalogRequestHref({ requestType: "quote", segment, category, family, product, need: "quote" })}
        className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
      >
        Request quote
      </Link>
      <Link
        href={catalogEquivalentHref(segment, category, family, product)}
        className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
      >
        Find equivalent
      </Link>
      <Link
        href={catalogRequestHref({ requestType: "sample", segment, category, family, product, need: "sample" })}
        className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
      >
        Request sample
      </Link>
      {product ? (
        <AddToSourcingListButton
          title={product.name}
          href={href}
          segmentSlug={segment.slug}
          categorySlug={category?.slug}
          familySlug={family?.slug}
          productSlug={product.slug}
          segmentTitle={segment.name}
          categoryTitle={category?.name}
          familyTitle={family?.name}
          productTitle={product.name}
        />
      ) : null}
    </div>
  );
}

export function CatalogSegmentPage({ segment }: { segment: ProductCatalogSegment }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: segment.name }]} />
      <PageHero eyebrow={`Product segment ${segment.index}`} title={segment.name} subtitle={segment.heroDescription}>
        <div className="grid gap-4">
          <ContextActions segment={segment} />
          <Link href="/products" className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to products
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-bioaxis-accent">Next layer</p>
            <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">Choose a {segment.name} category.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            Category pages expose product families, buyer filters, product-list previews, and RFQ context without dumping item-level detail here.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {segment.categories.map((category) => (
            <Link
              key={category.slug}
              href={productCatalogHref(segment.slug, category.slug)}
              className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <p className="text-xs font-bold uppercase text-bioaxis-dim">{segment.index} / Category</p>
              <h3 className="mt-3 text-xl font-bold uppercase text-bioaxis-text transition group-hover:text-bioaxis-accent">{category.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.tags.slice(0, 4).map((tag) => (
                  <SpecTag key={tag}>{tag}</SpecTag>
                ))}
              </div>
              <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">View category</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-3 lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Browse by buying need</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {buyerNeeds.map((need) => (
              <Link
                key={need}
                href={catalogRequestHref({ requestType: "quote", segment, need: need.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                className="border border-white/[0.12] bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                {need}
              </Link>
            ))}
          </div>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Segment overview</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">What BioAxis reviews</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{segment.shortDescription}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Specifications", "Equivalent path", "Samples / docs"].map((item) => (
              <div key={item} className="border border-bioaxis-line bg-bioaxis-black p-3 text-xs font-semibold uppercase text-bioaxis-steel">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Common buyer questions</p>
          <div className="mt-5 grid gap-3">
            {[
              "Can BioAxis compare a current supplier or catalog number?",
              "Which documents should be requested before purchasing?",
              "Should samples be reviewed before switching?"
            ].map((question) => (
              <div key={question} className="border border-bioaxis-line bg-bioaxis-black p-3 text-xs font-semibold uppercase leading-5 text-bioaxis-steel">
                {question}
              </div>
            ))}
          </div>
        </section>
      </section>

      <CatalogCTA segment={segment} title={`Send ${segment.name} context to BioAxis.`} />
    </>
  );
}

export function CatalogCategoryPage({ segment, category }: { segment: ProductCatalogSegment; category: ProductCatalogCategory }) {
  const rows = rowsForCategory(segment, category);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.name, href: productCatalogHref(segment.slug) },
          { label: category.name }
        ]}
      />
      <PageHero eyebrow={segment.name} title={category.name} subtitle={category.description}>
        <div className="grid gap-4">
          <ContextActions segment={segment} category={category} />
          <Link href={productCatalogHref(segment.slug)} className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {segment.name}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-bioaxis-accent">Next layer</p>
            <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">Choose a product family.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            Family pages show sourcing configuration templates, buyer checklists, documentation requests, and sourcing-list actions.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {category.families.map((family) => (
            <Link
              key={family.slug}
              href={productCatalogHref(segment.slug, category.slug, family.slug)}
              className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <h3 className="text-lg font-bold uppercase text-bioaxis-text transition group-hover:text-bioaxis-accent">{family.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{family.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {family.typicalSpecs.slice(0, 4).map((spec) => (
                  <SpecTag key={spec}>{spec}</SpecTag>
                ))}
              </div>
              <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">View family</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Buyer decision filters</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Supplier equivalent", "Sterility", "Format", "Material", "Packaging", "Documentation", "Sample need", "Recurring supply"].map((filter) => (
              <SpecTag key={filter}>{filter}</SpecTag>
            ))}
          </div>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Common specs as chips</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {category.tags.slice(0, 10).map((tag) => (
              <SpecTag key={tag}>{tag}</SpecTag>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        {rows.length > 0 ? (
          <CatalogProductBrowser rows={rows} heading="Sourcing template preview" compact />
        ) : (
          <EmptyCatalogPanel title="Sourcing template preview" body="This category is handled through RFQ context first. Send BioAxis the category and required documentation, sample, or equivalent need." />
        )}
      </section>

      <CatalogCTA segment={segment} category={category} title={`Send ${category.name} context to BioAxis.`} />
    </>
  );
}

export function CatalogFamilyPage({
  segment,
  category,
  family
}: {
  segment: ProductCatalogSegment;
  category: ProductCatalogCategory;
  family: ProductCatalogFamily;
}) {
  const rows = rowsForFamily(segment, category, family);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.name, href: productCatalogHref(segment.slug) },
          { label: category.name, href: productCatalogHref(segment.slug, category.slug) },
          { label: family.name }
        ]}
      />
      <PageHero eyebrow={`${segment.name} / ${category.name}`} title={family.name} subtitle={family.description}>
        <div className="grid gap-4">
          <ContextActions segment={segment} category={category} family={family} />
          <Link href={productCatalogHref(segment.slug, category.slug)} className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {category.name}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Buyer checklist</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Clarify these fields before RFQ.</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {family.typicalSpecs.slice(0, 8).map((spec) => (
              <SpecTag key={spec}>{spec}</SpecTag>
            ))}
          </div>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Typical RFQ fields</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">BioAxis can map this family into quote-ready fields.</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            Add current supplier, catalog number, required specs, sample needs, CoA/SDS requirements, and recurring usage when available. Email-only submission still works.
          </p>
        </section>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
          <CatalogProductBrowser rows={rows} heading="Sourcing configuration templates" />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-3">
          <Disclosure title="Typical RFQ fields" items={family.typicalSpecs} />
          <Disclosure title="Documentation to request" items={["CoA/SDS availability depends on product and supplier review", "Sterility, animal-origin, lot-level, or material documents may require request", "BioAxis can collect document requirements for RFQ preparation"]} />
          <Disclosure title="Equivalent review notes" items={["Compare current supplier and catalog number when available", "Review critical dimensions, material, surface, formulation, sterility, and packaging", "Request samples when fit or workflow sensitivity matters"]} />
          <Disclosure title="Sample-first evaluation" items={["Use samples before switching workflow-sensitive consumables", "Review fit, handling, packaging, and documentation with buyer-side criteria", "Keep sample acceptance separate from final purchasing approval"]} />
          <Disclosure title="Recurring supply considerations" items={["Share expected monthly or annual usage when available", "Clarify packaging, documentation, and shipping rhythm", "Use RFQ context to organize repeat sourcing rather than assuming live inventory"]} />
        </div>
      </section>

      <CatalogCTA segment={segment} category={category} family={family} title={`Send ${family.name} context to BioAxis.`} />
    </>
  );
}

export function CatalogProductPage({
  segment,
  category,
  family,
  product
}: {
  segment: ProductCatalogSegment;
  category: ProductCatalogCategory;
  family: ProductCatalogFamily;
  product: ProductCatalogItem;
}) {
  const relatedProducts = family.products.filter((item) => item.slug !== product.slug).slice(0, 6);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: segment.name, href: productCatalogHref(segment.slug) },
          { label: category.name, href: productCatalogHref(segment.slug, category.slug) },
          { label: family.name, href: productCatalogHref(segment.slug, category.slug, family.slug) },
          { label: product.name }
        ]}
      />
      <PageHero eyebrow={`${segment.name} / ${category.name} / ${family.name}`} title={product.name} subtitle={`Sourcing configuration for ${product.description}`}>
        <div className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 6).map((tag) => (
              <SpecTag key={tag}>{tag}</SpecTag>
            ))}
          </div>
          <ContextActions segment={segment} category={category} family={family} product={product} />
          <Link href={productCatalogHref(segment.slug, category.slug, family.slug)} className="text-sm font-semibold uppercase text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to {family.name}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Typical RFQ fields</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Use this page as a sourcing configuration, not a live-stock SKU page.</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {typicalRfqFields.map((field) => (
              <SpecTag key={field}>{field}</SpecTag>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Documentation to request</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Request status, not fake downloads.</h2>
          <div className="mt-5 grid gap-3">
            {documentLabels.map(([key, label]) => {
              const status = product.documents[key];

              if (!status) return null;

              return (
                <div key={key} className="flex items-center justify-between gap-4 border border-bioaxis-line bg-bioaxis-black px-4 py-3">
                  <span className="text-xs font-bold uppercase text-bioaxis-steel">{label}</span>
                  <span className="text-xs font-bold uppercase text-bioaxis-accent">{statusLabels[status]}</span>
                </div>
              );
            })}
          </div>
          <Link
            href={catalogRequestHref({ requestType: "documentation", segment, category, family, product, need: "documents" })}
            className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request documents
          </Link>
        </section>

        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Typical RFQ fields</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Quote-ready sourcing configuration</h2>
          <dl className="mt-5 grid gap-3 md:grid-cols-2">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="border border-bioaxis-line bg-bioaxis-black p-4">
                <dt className="text-[11px] font-bold uppercase text-bioaxis-dim">{key}</dt>
                <dd className="mt-2 text-sm leading-6 text-bioaxis-steel">{Array.isArray(value) ? value.join(", ") : value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Equivalent review notes</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Compare before switching.</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            BioAxis can help compare supplier, catalog number, critical specs, documentation, sample needs, and workflow fit. Buyer-side technical review remains required before substitution.
          </p>
          <Link
            href={catalogEquivalentHref(segment, category, family, product)}
            className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Start equivalent review
          </Link>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Sample-first evaluation</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Review before larger-volume sourcing.</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            BioAxis can help organize sample requests, documentation requirements, packaging preferences, and recurring usage details before preparing RFQ follow-up.
          </p>
          <Link
            href={catalogRequestHref({ requestType: "sample", segment, category, family, product, need: "sample" })}
            className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request sample path
          </Link>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Recurring supply considerations</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Plan repeat use after specs are clear.</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            Share monthly or annual usage, shipping region, preferred packaging, and documentation requirements so BioAxis can organize recurring supply review without implying live inventory.
          </p>
          <Link
            href={catalogRequestHref({ requestType: "recurring-supply", segment, category, family, product, need: "recurring-supply" })}
            className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Review recurring supply
          </Link>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Related sourcing configurations</p>
          <div className="mt-5 grid gap-3">
            {relatedProducts.map((related) => (
              <Link
                key={related.slug}
                href={productCatalogHref(segment.slug, category.slug, family.slug, related.slug)}
                className="border border-bioaxis-line bg-bioaxis-black px-4 py-3 transition hover:border-bioaxis-accent"
              >
                <span className="text-sm font-bold uppercase text-bioaxis-text">{related.name}</span>
                <span className="mt-1 block text-xs leading-5 text-bioaxis-muted">{related.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <CatalogCTA segment={segment} category={category} family={family} product={product} title={`Send ${product.name} to BioAxis.`} />

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Product fit note</p>
          <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
            Product fit, documentation, equivalent suitability, and sample acceptance should be reviewed by the buyer for the intended protocol, instrument, quality system, and market requirements.
          </p>
        </div>
      </section>
    </>
  );
}

function CatalogCTA({
  title,
  segment,
  category,
  family,
  product
}: {
  title: string;
  segment: ProductCatalogSegment;
  category?: ProductCatalogCategory;
  family?: ProductCatalogFamily;
  product?: ProductCatalogItem;
}) {
  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/70">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">RFQ sourcing workflow</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
            BioAxis will include this catalog context automatically. Add supplier, catalog number, quantity, samples, or documentation requirements only if useful.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href={catalogRequestHref({ requestType: "quote", segment, category, family, product, need: "quote" })}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Request quote
          </Link>
          <Link
            href={catalogRequestHref({ requestType: "product-list-review", segment, category, family, product, need: "product-list" })}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request quote with list
          </Link>
        </div>
      </div>
    </section>
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

function EmptyCatalogPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">{title}</p>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{body}</p>
    </section>
  );
}

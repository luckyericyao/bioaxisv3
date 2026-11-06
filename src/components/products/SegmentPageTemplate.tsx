import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { RFQCTA } from "./RFQCTA";
import { DirectoryItemList } from "@/components/seo/StructuredData";

type SegmentPageTemplateProps = {
  segment: ProductTaxonomySegment;
};

export function SegmentPageTemplate({ segment }: SegmentPageTemplateProps) {
  return (
    <>
      <DirectoryItemList
        name={segment.title}
        path={`/products/${segment.slug}`}
        items={segment.subcategories.map((category) => ({ name: category.title, href: `/products/${segment.slug}/${category.slug}` }))}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: segment.title }]} />
      <PageHero eyebrow={`Product segment ${String(segment.index).padStart(2, "0")}`} title={segment.title} subtitle={segment.heroDescription}>
        <div className="grid gap-3">
          <Link href="#segment-categories" className="action-primary w-fit">Browse categories</Link>
          <Link href={`/products?view=configurations&segment=${segment.slug}`} className="inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-accent">Compare configuration targets</Link>
          <Link href="/products" className="text-sm font-semibold  text-bioaxis-steel transition hover:text-bioaxis-accent">
            Back to products
          </Link>
        </div>
      </PageHero>

      <section id="segment-categories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold  text-bioaxis-accent">Next step</p>
            <h2 className="text-3xl font-semibold text-bioaxis-text sm:text-4xl">Choose a {segment.shortTitle} category.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            Compare the product types and key formats for your requirement.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {segment.subcategories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${segment.slug}/${category.slug}`}
              className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <h3 className="text-lg font-semibold  text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {category.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{category.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.commonFormats.slice(0, 3).map((format) => (
                  <span key={format} className="border border-white/[0.12] bg-bioaxis-black px-2 py-1 text-sm text-bioaxis-steel">
                    {format}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex text-xs font-semibold  text-bioaxis-accent">View category</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold  text-bioaxis-accent">Segment overview</p>
          <h2 className="mt-3 text-2xl font-semibold  text-bioaxis-text">What belongs here</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{segment.description}</p>
        </section>
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-sm font-semibold  text-bioaxis-accent">Common sourcing questions</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {segment.rfqPrompts.slice(0, 4).map((prompt) => (
              <div key={prompt} className="border border-bioaxis-line bg-bioaxis-black p-4 text-sm leading-6 text-bioaxis-steel">
                {prompt}
              </div>
            ))}
          </div>
        </section>
      </section>

      <RFQCTA
        title="Have a reference or a requirement?"
        body="Send your current product or key specifications for quote, sample, document or alternative review."
        segment={segment.slug}
      />
    </>
  );
}

import Link from "next/link";
import type { ProductSegment } from "@/data/productSegments";
import { workflows } from "@/data/workflows";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { SpecTag } from "@/components/ui/SpecTag";

type SegmentPageTemplateProps = {
  segment: ProductSegment;
};

function TagPanel({ title, tags }: { title: string; tags: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <SpecTag key={tag}>{tag}</SpecTag>
        ))}
      </div>
    </section>
  );
}

function BulletPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}

export function SegmentPageTemplate({ segment }: SegmentPageTemplateProps) {
  const relatedWorkflowLinks = segment.relatedWorkflows.map((workflowName) => {
    const workflow = workflows.find((item) => item.title === workflowName);

    return {
      label: workflowName,
      href: workflow ? `/workflows#${workflow.slug}` : "/workflows"
    };
  });

  return (
    <>
      <PageHero eyebrow={`Product segment ${String(segment.index).padStart(2, "0")}`} title={segment.title} subtitle={segment.hero}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/request-quote" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
            Request quote
          </Link>
          <Link href={`/equivalents?segment=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Find equivalent
          </Link>
          <Link href={`/samples?segment=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Request sample
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <TagPanel title="Product families" tags={segment.productFamilies} />
        <TagPanel title="Common applications" tags={segment.applications} />
        <TagPanel title="Key specifications" tags={segment.specifications} />
        <TagPanel title="Representative formats" tags={segment.formats} />
        <BulletPanel title="Common sourcing questions" items={segment.sourcingQuestions} />
        <BulletPanel title="Documentation support" items={segment.documentationNeeds} />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Equivalent and sample support</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            {segment.ctaCopy} BioAxis can help organize product families, specifications, equivalent paths, documentation requests, and sample-first evaluation where available.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/equivalents?segment=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
              Find equivalent
            </Link>
            <Link href={`/samples?segment=${segment.slug}`} className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Request sample
            </Link>
          </div>
        </section>
        <RelatedLinks
          title="Related workflows"
          links={relatedWorkflowLinks}
        />
      </div>

      <CTASection
        title={`Source ${segment.title} with BioAxis.`}
        body="Send product names, catalog numbers, required specifications, usage, and timeline. BioAxis helps organize quote options, equivalents, sample requests, and documentation support where applicable."
        primaryLabel="Request quote"
        primaryHref="/request-quote"
        secondaryLabel="View all products"
        secondaryHref="/products"
      />
    </>
  );
}

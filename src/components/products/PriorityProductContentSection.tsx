import type { PriorityProductContent } from "@/data/priorityProductContent";
import { ProductSpecChecklist } from "./ProductSpecChecklist";

type PriorityProductContentSectionProps = {
  content: PriorityProductContent;
};

export function PriorityProductContentSection({ content }: PriorityProductContentSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <div className="mb-8 max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Buyer sourcing guide</p>
        <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{content.summary}</p>
      </div>

      <ProductSpecChecklist items={content.specifications} />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <InfoPanel title="What labs typically specify" items={content.typicalSpecifications} />
        <InfoPanel title="Common formats" items={content.commonFormats} />
        <InfoPanel title="Compatibility considerations" items={content.compatibilityConsiderations} />
        <InfoPanel title="Documentation often requested" items={content.documentationRequested} />
        <InfoPanel title="Equivalent matching checklist" items={content.equivalentChecklist} />
        <InfoPanel title="Sample evaluation checklist" items={content.sampleChecklist} />
      </div>

      <div className="mt-5">
        <InfoPanel title="How BioAxis supports sourcing" items={content.sourcingSupport} />
      </div>
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h3 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h3>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
        {items.map((item) => (
          <li key={item} className="border border-white/[0.1] bg-bioaxis-black px-4 py-3 text-bioaxis-steel">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

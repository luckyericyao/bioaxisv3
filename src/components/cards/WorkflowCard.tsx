import Link from "next/link";
import type { Workflow } from "@/data/workflows";
import { SpecTag } from "@/components/ui/SpecTag";

type WorkflowCardProps = {
  workflow: Workflow;
};

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <article id={workflow.slug} className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{workflow.title}</h2>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{workflow.description}</p>
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Typical products</p>
        <div className="flex flex-wrap gap-2">
          {workflow.typicalProducts.map((product) => (
            <SpecTag key={product}>{product}</SpecTag>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Common questions</p>
        <ul className="grid gap-2 text-sm text-bioaxis-muted">
          {workflow.commonQuestions.map((question) => (
            <li key={question}>- {question}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Related segments</p>
        <p className="text-sm leading-6 text-bioaxis-steel">{workflow.relatedSegments.join(", ")}</p>
      </div>
      <Link href="/request-quote" className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
        {workflow.ctaCopy}
      </Link>
    </article>
  );
}


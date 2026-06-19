import Link from "next/link";
import type { Workflow } from "@/data/workflows";

type WorkflowCardProps = {
  workflow: Workflow;
};

type WorkflowListProps = {
  title: string;
  items: string[];
  compact?: boolean;
};

function WorkflowList({ title, items, compact = false }: WorkflowListProps) {
  return (
    <div className="border border-bioaxis-line bg-bioaxis-black/45 p-4">
      <p className="mb-4 border-b border-bioaxis-line pb-3 text-xs font-semibold uppercase tracking-wide text-bioaxis-accent">
        {title}
      </p>
      <ul className={compact ? "flex flex-wrap gap-2" : "grid gap-2.5"}>
        {items.map((item) => (
          <li
            key={item}
            className={
              compact
                ? "border border-bioaxis-line bg-bioaxis-panel px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel"
                : "border border-bioaxis-line bg-bioaxis-panel/70 px-3 py-2 text-sm leading-6 text-bioaxis-muted"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <article
      id={workflow.slug}
      className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel/90 p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft lg:p-8"
    >
      <div className="flex flex-col gap-5 border-b border-bioaxis-line pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">{workflow.stage}</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-bold uppercase leading-tight text-bioaxis-text sm:text-3xl">
            {workflow.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">{workflow.description}</p>
        </div>
        <Link
          href={workflow.cta.href}
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          {workflow.cta.label}
        </Link>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <WorkflowList title="What you are doing" items={workflow.whatYouAreDoing} />
        <WorkflowList title="Consumables needed" items={workflow.consumablesNeeded} compact />
        <WorkflowList title="Common sourcing questions" items={workflow.commonQuestions} />
        <WorkflowList title="BioAxis can help with" items={workflow.bioAxisHelp} compact />
      </div>
    </article>
  );
}

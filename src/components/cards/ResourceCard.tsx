import Link from "next/link";
import type { ResourceGuide } from "@/data/resources";
import { SpecTag } from "@/components/ui/SpecTag";

type ResourceCardProps = {
  guide: ResourceGuide;
};

export function ResourceCard({ guide }: ResourceCardProps) {
  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold uppercase leading-tight text-bioaxis-text">{guide.title}</h2>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-bioaxis-muted">{guide.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {[...guide.relatedSegments, ...guide.relatedWorkflows].slice(0, 5).map((tag) => (
          <SpecTag key={tag}>{tag}</SpecTag>
        ))}
      </div>
      <Link href={`/resources/${guide.slug}`} className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
        {guide.ctaCopy}
      </Link>
    </article>
  );
}

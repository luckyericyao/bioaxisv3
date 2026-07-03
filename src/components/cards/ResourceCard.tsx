import Link from "next/link";
import type { ResourceGuide } from "@/data/resources";

type ResourceCardProps = {
  guide: ResourceGuide;
};

export function ResourceCard({ guide }: ResourceCardProps) {
  const sourcePage = `/resources/${guide.slug}`;
  const requestHref = `/request-quote?requestType=product-list-review&sourcePage=${encodeURIComponent(sourcePage)}&query=${encodeURIComponent(guide.title)}`;

  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold uppercase leading-tight text-bioaxis-text">{guide.title}</h2>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-bioaxis-muted">{guide.summary}</p>
      <ul className="mt-6 grid gap-2 text-xs font-semibold uppercase leading-5 text-bioaxis-muted sm:grid-cols-2">
        {[...guide.relatedSegments, ...guide.relatedWorkflows].slice(0, 5).map((tag) => (
          <li key={tag} className="border-l border-bioaxis-accent/40 pl-3">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-2">
        <Link href={sourcePage} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          {guide.ctaCopy}
        </Link>
        <Link href={requestHref} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          Use as request starter
        </Link>
      </div>
    </article>
  );
}

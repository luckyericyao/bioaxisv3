import Link from "next/link";
import type { SupportType } from "@/data/supportTypes";

type SupportCardProps = {
  supportType: SupportType;
};

export function SupportCard({ supportType }: SupportCardProps) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h2 className="text-xl font-semibold  text-bioaxis-text">{supportType.title}</h2>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{supportType.description}</p>
      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold  text-bioaxis-dim">What to send</p>
        <ul className="body-copy grid gap-2 text-base text-bioaxis-steel">
          {supportType.whatToSend.map((item) => (
            <li key={item} className="border-l border-bioaxis-accent/40 pl-3">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Link href={supportType.requestHref} className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold  text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
        {supportType.ctaLabel}
      </Link>
    </article>
  );
}

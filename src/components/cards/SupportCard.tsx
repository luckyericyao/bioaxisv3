import Link from "next/link";
import type { SupportType } from "@/data/supportTypes";

type SupportCardProps = {
  supportType: SupportType;
};

export function SupportCard({ supportType }: SupportCardProps) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h2 className="text-xl font-bold uppercase text-bioaxis-text">{supportType.title}</h2>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{supportType.description}</p>
      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">What to send</p>
        <ul className="grid gap-2 text-sm text-bioaxis-steel">
          {supportType.whatToSend.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
      <Link href="/request-quote" className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
        {supportType.relatedRequestType}
      </Link>
    </article>
  );
}


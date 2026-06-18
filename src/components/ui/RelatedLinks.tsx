import Link from "next/link";

type RelatedLink = {
  label: string;
  href: string;
};

type RelatedLinksProps = {
  title?: string;
  links: RelatedLink[];
};

export function RelatedLinks({ title = "Related links", links }: RelatedLinksProps) {
  return (
    <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-5 grid gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-muted transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}


import Link from "next/link";

type RelatedProductsProps = {
  links: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

export function RelatedProducts({ links }: RelatedProductsProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Related products</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent">
            <span className="text-sm font-bold uppercase text-bioaxis-text">{link.label}</span>
            {link.description ? <span className="mt-2 block text-sm leading-6 text-bioaxis-muted">{link.description}</span> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

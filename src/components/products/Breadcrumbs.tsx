import Link from "next/link";
import { bioAxisSiteUrl } from "@/lib/siteMetadata";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, bioAxisSiteUrl).toString() } : {})
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\u003c") }} />
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-bioaxis-dim">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition hover:text-bioaxis-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-bioaxis-steel">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
        </ol>
      </nav>
    </>
  );
}

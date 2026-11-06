import Link from "next/link";
import { JsonLd } from "@/components/seo/StructuredData";
import { createBreadcrumbStructuredData } from "@/lib/structuredData";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={createBreadcrumbStructuredData(items)} />
      <nav aria-label="Breadcrumb" className="page-container pt-4 sm:pt-8">
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

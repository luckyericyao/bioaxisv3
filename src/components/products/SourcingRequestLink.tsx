"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type SourcingRequestLinkProps = { href: string; className?: string; children: ReactNode };

export function SourcingRequestLink(props: SourcingRequestLinkProps) {
  return (
    <Suspense fallback={<Link href={props.href} className={props.className}>{props.children}</Link>}>
      <ContextualRequestLink {...props} />
    </Suspense>
  );
}

function ContextualRequestLink({ href, className, children }: SourcingRequestLinkProps) {
  const currentParams = useSearchParams();
  const pathname = usePathname();
  const query = currentParams.get("query") || currentParams.get("q");
  const target = new URL(href, "https://bioaxis.local");
  let requestHref = href;
  if (query && target.origin === "https://bioaxis.local" && target.pathname === "/request-quote") {
    if (!target.searchParams.has("query")) target.searchParams.set("query", query);
    target.searchParams.set("sourcePage", `${pathname}?q=${encodeURIComponent(query)}`);
    requestHref = `${target.pathname}${target.search}${target.hash}`;
  }

  return <Link href={requestHref} className={className}>{children}</Link>;
}

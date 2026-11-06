"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type SourcingRequestLinkProps = { href: string; className?: string; children: ReactNode; preserveProductQuery?: boolean };

export function SourcingRequestLink(props: SourcingRequestLinkProps) {
  return (
    <Suspense fallback={<Link href={props.href} className={props.className}>{props.children}</Link>}>
      <ContextualRequestLink {...props} />
    </Suspense>
  );
}

function ContextualRequestLink({ href, className, children, preserveProductQuery = false }: SourcingRequestLinkProps) {
  const currentParams = useSearchParams();
  const pathname = usePathname();
  const query = currentParams.get("query") || currentParams.get("q");
  const target = new URL(href, "https://bioaxis.local");
  let requestHref = href;
  if (query && target.origin === "https://bioaxis.local" && target.pathname === "/request-quote") {
    if (!target.searchParams.has("query")) target.searchParams.set("query", query);
    target.searchParams.set("sourcePage", `${pathname}?q=${encodeURIComponent(query)}`);
    requestHref = `${target.pathname}${target.search}${target.hash}`;
  } else if (query && preserveProductQuery && target.origin === "https://bioaxis.local" && target.pathname.startsWith("/products/")) {
    if (!target.searchParams.has("q")) target.searchParams.set("q", query);
    requestHref = `${target.pathname}${target.search}${target.hash}`;
  }

  const productList = currentParams.get("productList");
  if (productList && target.origin === "https://bioaxis.local" && (target.pathname === "/request-quote" || (preserveProductQuery && target.pathname.startsWith("/products/")))) {
    const contextual = new URL(requestHref, "https://bioaxis.local");
    if (!contextual.searchParams.has("productList")) contextual.searchParams.set("productList", productList.slice(0, 12000));
    requestHref = `${contextual.pathname}${contextual.search}${contextual.hash}`;
  }

  return <Link href={requestHref} className={className}>{children}</Link>;
}

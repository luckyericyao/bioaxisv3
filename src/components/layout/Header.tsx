"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/data/brand";
import { navigationItems } from "@/data/navigation";
import { productNavigationSegments } from "@/data/productNavigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [activeProductSegment, setActiveProductSegment] = useState(productNavigationSegments[0]?.slug ?? "");
  const productsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setMobileProductsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!productsOpen) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && productsMenuRef.current?.contains(target)) {
        return;
      }

      setProductsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [productsOpen]);

  function closeMobileMenu() {
    setMenuOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bioaxis-black/[0.88] backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-base font-bold uppercase text-bioaxis-text transition hover:text-bioaxis-accent"
          aria-label="BioAxis home"
          onClick={closeMobileMenu}
        >
          {brand.name.toUpperCase()}
        </Link>

        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>

        <nav id="primary-navigation" aria-label="Primary navigation" className="hidden items-center justify-end gap-1 md:flex lg:gap-2">
          {navigationItems.map((item) =>
            item.label === "Products" ? (
              <div
                key={item.label}
                ref={productsMenuRef}
                className="relative flex min-h-16 items-center"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
                onFocus={() => setProductsOpen(true)}
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget;
                  if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                    setProductsOpen(false);
                  }
                }}
              >
                <Link
                  href={item.href}
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  aria-controls="products-segment-dropdown"
                  className="inline-flex min-h-16 items-center px-2 text-xs font-semibold uppercase text-bioaxis-muted transition hover:text-bioaxis-text lg:px-3"
                >
                  {item.label}
                </Link>
                {productsOpen ? (
                  <ProductSegmentDropdown
                    activeSegmentSlug={activeProductSegment}
                    onActiveSegmentChange={setActiveProductSegment}
                    onNavigate={() => setProductsOpen(false)}
                  />
                ) : null}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.label === "Request Quote"
                    ? "ml-1 border border-bioaxis-accent px-3 py-2 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
                    : "px-2 py-2 text-xs font-semibold uppercase text-bioaxis-muted transition hover:text-bioaxis-text lg:px-3"
                }
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>

      {menuOpen ? (
        <nav aria-label="Mobile navigation" className="border-t border-bioaxis-line bg-bioaxis-black px-5 py-4 md:hidden">
          <div className="grid gap-2">
            {navigationItems.map((item) =>
              item.label === "Products" ? (
                <div key={item.label} className="border border-bioaxis-line">
                  <button
                    type="button"
                    aria-expanded={mobileProductsOpen}
                    aria-controls="mobile-products-navigation"
                    onClick={() => setMobileProductsOpen((current) => !current)}
                    className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold uppercase text-bioaxis-muted"
                  >
                    <span>{item.label}</span>
                    <span className="text-bioaxis-accent">{mobileProductsOpen ? "Close" : "Open"}</span>
                  </button>
                  {mobileProductsOpen ? (
                    <MobileProductsAccordion onNavigate={closeMobileMenu} />
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={
                    item.label === "Request Quote"
                      ? "border border-bioaxis-accent px-4 py-3 text-sm font-semibold uppercase text-bioaxis-accent"
                      : "border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-muted"
                  }
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function ProductSegmentDropdown({
  activeSegmentSlug,
  onActiveSegmentChange,
  onNavigate
}: {
  activeSegmentSlug: string;
  onActiveSegmentChange: (slug: string) => void;
  onNavigate: () => void;
}) {
  const activeSegment = productNavigationSegments.find((segment) => segment.slug === activeSegmentSlug) ?? productNavigationSegments[0];

  return (
    <div
      id="products-segment-dropdown"
      className="fixed left-1/2 top-16 z-[90] hidden w-[min(1100px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden border border-white/[0.16] bg-[#050a09] shadow-2xl shadow-black/70 md:block"
    >
      <div className="grid max-h-[70vh] grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
        <div className="overflow-y-auto border-r border-white/[0.1] p-2">
          {productNavigationSegments.map((segment) => (
            <Link
              key={segment.slug}
              href={segment.href}
              onMouseEnter={() => onActiveSegmentChange(segment.slug)}
              onFocus={() => onActiveSegmentChange(segment.slug)}
              onClick={onNavigate}
              className={[
                "group grid gap-2 border px-3 py-3 transition focus:border-bioaxis-accent focus:bg-white/[0.06] focus:outline-none",
                activeSegment?.slug === segment.slug
                  ? "border-bioaxis-accent/50 bg-white/[0.07]"
                  : "border-transparent hover:border-white/[0.12] hover:bg-white/[0.06]"
              ].join(" ")}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 w-5 text-[11px] font-bold text-bioaxis-dim">{segment.index}</span>
                  <span className="min-w-0 text-sm font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                    {segment.label}
                  </span>
                </span>
                <span className="shrink-0 text-bioaxis-accent transition group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="overflow-y-auto p-5">
          {activeSegment ? (
            <div>
              <p className="text-xs font-bold uppercase text-bioaxis-accent">BioAxis product catalog</p>
              <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">{activeSegment.label}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-bioaxis-muted">{activeSegment.shortDescription}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {activeSegment.categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    href={category.href}
                    onClick={onNavigate}
                    className="group border border-white/[0.1] bg-bioaxis-black px-4 py-3 transition hover:border-bioaxis-accent hover:bg-white/[0.05]"
                  >
                    <span className="block text-sm font-bold uppercase text-bioaxis-text transition group-hover:text-bioaxis-accent">{category.label}</span>
                    {category.families.length > 0 ? (
                      <span className="mt-2 block text-xs leading-5 text-bioaxis-muted">
                        {category.families.slice(0, 3).map((family) => family.label).join(" / ")}
                      </span>
                    ) : (
                      <span className="mt-2 block text-xs leading-5 text-bioaxis-muted">Open sourcing request path</span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={activeSegment.href}
                  onClick={onNavigate}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-4 text-xs font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
                >
                  View Segment →
                </Link>
                <Link
                  href={`/request-quote?type=product-list&requestType=product-list-review&segment=${activeSegment.slug}`}
                  onClick={onNavigate}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Request Quote With List →
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div id="mobile-products-navigation" className="border-t border-bioaxis-line bg-bioaxis-panel/70 p-3">
      <div className="grid gap-2">
        {productNavigationSegments.map((segment) => (
          <details key={segment.slug} className="border border-bioaxis-line bg-bioaxis-black">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-3 py-3">
              <span>
                <span className="block text-sm font-bold uppercase text-bioaxis-text">{segment.index} {segment.label}</span>
                <span className="mt-1 block line-clamp-2 text-xs leading-5 text-bioaxis-muted">{segment.shortDescription}</span>
              </span>
              <span className="text-bioaxis-accent" aria-hidden="true">+</span>
            </summary>
            <div className="grid gap-2 border-t border-bioaxis-line p-3">
              {segment.categories.slice(0, 6).map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  onClick={onNavigate}
                  className="border border-white/[0.1] px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel"
                >
                  {category.label}
                </Link>
              ))}
              <Link href={segment.href} onClick={onNavigate} className="text-xs font-bold uppercase text-bioaxis-accent">
                View Segment →
              </Link>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

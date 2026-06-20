"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/data/brand";
import { navigationItems } from "@/data/navigation";
import { productNavigationSegments } from "@/data/productNavigation";

const productMenuActions = [
  { label: "Find equivalent", href: "/equivalent-finder?requestType=equivalent" },
  { label: "Request quote", href: "/request-quote?requestType=quote" },
  { label: "Request sample", href: "/request-quote?requestType=sample" }
];

const familyPreviewLimit = 4;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
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
                  aria-controls="products-mega-menu"
                  className="inline-flex min-h-16 items-center px-2 text-xs font-semibold uppercase text-bioaxis-muted transition hover:text-bioaxis-text lg:px-3"
                >
                  {item.label}
                </Link>
                {productsOpen ? <ProductMegaMenu onNavigate={() => setProductsOpen(false)} /> : null}
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

function ProductMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="products-mega-menu"
      className="fixed left-1/2 top-16 z-[80] hidden w-[min(1280px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden border border-white/[0.16] bg-[#050a09] shadow-2xl shadow-black/70 md:block"
    >
      <div className="max-h-[calc(100vh-110px)] overflow-y-auto p-5 sm:p-6">
        <div className="mb-4 grid gap-4 border border-bioaxis-line bg-bioaxis-panel p-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-bioaxis-accent">Product navigation</p>
            <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">BioAxis product catalog</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Browse segments, then category headings, then compact product-family links. The panel scrolls internally so the page stays in place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {productMenuActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={onNavigate}
                className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line bg-bioaxis-black px-4 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {productNavigationSegments.map((segment) => (
            <article key={segment.slug} className="border border-bioaxis-line bg-bioaxis-panel p-4 transition hover:border-bioaxis-accent/60">
              <Link
                href={segment.href}
                onClick={onNavigate}
                className="group flex items-start justify-between gap-3 border-b border-bioaxis-line pb-3"
              >
                <span>
                  <span className="text-[11px] font-bold uppercase text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
                  <span className="mt-2 block text-sm font-bold uppercase leading-tight tracking-wide text-bioaxis-text transition group-hover:text-bioaxis-accent">
                    {segment.label}
                  </span>
                </span>
                <span className="text-bioaxis-accent transition group-hover:translate-x-1">→</span>
              </Link>
              <div className="mt-3 grid gap-3">
                {segment.categories.map((category) => (
                  <div key={category.slug}>
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={category.href}
                        onClick={onNavigate}
                        className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent transition hover:text-bioaxis-text"
                      >
                        {category.label}
                      </Link>
                      {category.families.length > familyPreviewLimit ? (
                        <Link
                          href={category.href}
                          onClick={onNavigate}
                          className="text-[10px] font-bold uppercase text-bioaxis-dim transition hover:text-bioaxis-accent"
                        >
                          View all
                        </Link>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {category.families.slice(0, familyPreviewLimit).map((family) => (
                        <Link
                          key={family.href}
                          href={family.href}
                          onClick={onNavigate}
                          className="border border-white/[0.1] bg-bioaxis-black px-2 py-1 text-[11px] leading-5 text-bioaxis-steel transition hover:border-bioaxis-accent hover:bg-bioaxis-accent/10 hover:text-bioaxis-accent focus:border-bioaxis-accent focus:text-bioaxis-accent"
                        >
                          {family.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div id="mobile-products-navigation" className="border-t border-bioaxis-line bg-bioaxis-panel/70 p-3">
      <Link
        href="/products"
        onClick={onNavigate}
        className="mb-3 flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-bold uppercase text-bioaxis-accent"
      >
        View all products
      </Link>
      <div className="grid gap-2">
        {productNavigationSegments.map((segment) => (
          <details key={segment.slug} className="border border-bioaxis-line bg-bioaxis-black">
            <summary className="cursor-pointer px-3 py-3 text-sm font-bold uppercase text-bioaxis-text">
              {segment.label}
            </summary>
            <div className="grid gap-3 border-t border-bioaxis-line p-3">
              <Link
                href={segment.href}
                onClick={onNavigate}
                className="text-xs font-bold uppercase text-bioaxis-accent"
              >
                View {segment.label}
              </Link>
              {segment.categories.map((category) => (
                <details key={category.slug} className="border border-white/[0.1] bg-bioaxis-panel/60">
                  <summary className="cursor-pointer px-3 py-2 text-[11px] font-bold uppercase text-bioaxis-dim">
                    {category.label}
                  </summary>
                  <div className="grid gap-1 border-t border-white/[0.1] p-2">
                    <Link
                      href={category.href}
                      onClick={onNavigate}
                      className="border border-bioaxis-line px-2 py-2 text-xs font-bold uppercase text-bioaxis-accent"
                    >
                      View all {category.label}
                    </Link>
                    {category.families.map((family) => (
                      <Link
                        key={family.href}
                        href={family.href}
                        onClick={onNavigate}
                        className="border border-white/[0.1] px-2 py-2 text-xs text-bioaxis-steel"
                      >
                        {family.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

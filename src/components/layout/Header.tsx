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
                {productsOpen ? <ProductSegmentDropdown onNavigate={() => setProductsOpen(false)} /> : null}
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

function ProductSegmentDropdown({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="products-segment-dropdown"
      className="absolute left-0 top-full z-[90] hidden w-[min(360px,calc(100vw-32px))] overflow-hidden border border-white/[0.16] bg-[#050a09] shadow-2xl shadow-black/70 md:block"
    >
      <div className="max-h-[calc(100vh-110px)] overflow-y-auto p-2">
        <div className="grid gap-1">
          {productNavigationSegments.map((segment) => (
            <Link
              key={segment.slug}
              href={segment.href}
              onClick={onNavigate}
              className="group flex min-h-11 items-center justify-between gap-3 border border-transparent px-3 py-2 text-sm font-semibold uppercase leading-tight text-bioaxis-steel transition hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-bioaxis-text focus:border-bioaxis-accent focus:bg-white/[0.06] focus:text-bioaxis-text focus:outline-none"
            >
              <span className="flex items-center gap-3">
                <span className="w-5 text-[11px] font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
                <span>{segment.label}</span>
              </span>
              <span className="text-bioaxis-accent transition group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
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
          <Link
            key={segment.slug}
            href={segment.href}
            onClick={onNavigate}
            className="flex min-h-11 items-center justify-between border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-sm font-bold uppercase text-bioaxis-text"
          >
            <span>{segment.label}</span>
            <span className="text-bioaxis-accent" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

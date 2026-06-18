"use client";

import Link from "next/link";
import { useState } from "react";
import { brand } from "@/data/brand";
import { navigationItems } from "@/data/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bioaxis-black/[0.88] backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-base font-bold uppercase text-bioaxis-text transition hover:text-bioaxis-accent"
          aria-label="BioAxis home"
          onClick={() => setMenuOpen(false)}
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
          {navigationItems.map((item) => (
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
          ))}
        </nav>
      </div>

      {menuOpen ? (
        <nav aria-label="Mobile navigation" className="border-t border-bioaxis-line bg-bioaxis-black px-5 py-4 md:hidden">
          <div className="grid gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={
                  item.label === "Request Quote"
                    ? "border border-bioaxis-accent px-4 py-3 text-sm font-semibold uppercase text-bioaxis-accent"
                    : "border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-muted"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

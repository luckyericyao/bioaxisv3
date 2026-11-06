"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import type { ProductNavigationSegment } from "@/data/productNavigation";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";

export type HeaderProductSegment = Pick<ProductNavigationSegment, "slug" | "href" | "index" | "label">;
type OpenMenu = "products" | "support" | null;

export function Header({ productNavigationSegments }: { productNavigationSegments: HeaderProductSegment[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<OpenMenu>(null);
  const root = useRef<HTMLElement>(null);
  const productsTrigger = useRef<HTMLAnchorElement>(null);
  const supportTrigger = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLButtonElement>(null);
  const suppressFocus = useRef(false);
  const { items, openDrawer } = useSourcingList();

  const closeAll = useCallback(() => { setOpenMenu(null); setMenuOpen(false); setMobileOpen(null); }, []);
  useEffect(() => { setOpenMenu(null); setMenuOpen(false); setMobileOpen(null); }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) closeAll(); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        suppressFocus.current = true;
        (openMenu === "products" ? productsTrigger.current : supportTrigger.current)?.focus();
        setOpenMenu(null);
        requestAnimationFrame(() => { suppressFocus.current = false; });
      } else if (menuOpen) { closeAll(); mobileMenu.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [openMenu, menuOpen, closeAll]);

  const supportItems = navigationItems.find((item) => item.children)?.children ?? [];
  const productLinks = <><Link href="/products" onClick={closeAll} className="nav-dropdown-link font-medium">Search all products<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    {productNavigationSegments.map((segment) => <Link key={segment.slug} href={segment.href} onClick={closeAll} className="nav-dropdown-link"><span>{segment.label}</span><ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>)}</>;
  const supportLinks = <>{supportItems.map((item) => <Link key={item.href} href={item.href} onClick={closeAll} className="nav-dropdown-link">{item.label}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>)}</>;

  return (
    <header ref={root} className="sticky top-0 z-50 border-b border-bioaxis-line bg-white">
      <div className="page-container flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" aria-label="BioAxis home" className="inline-flex min-h-11 items-center text-2xl font-semibold">BioAxis</Link>
        <button ref={mobileMenu} type="button" aria-label={menuOpen ? "Close menu" : "Menu"} title={menuOpen ? "Close menu" : "Menu"} aria-expanded={menuOpen} aria-controls={menuOpen ? "mobile-primary-navigation" : undefined} onClick={() => { setMenuOpen(!menuOpen); setMobileOpen(null); }} className="flex h-11 w-11 items-center justify-center rounded border border-bioaxis-line lg:hidden">{menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}</button>
        <nav aria-label="Primary navigation" id="primary-navigation" className="hidden h-full items-center gap-6 lg:flex">
          {navigationItems.map((item) => {
            const kind = item.label === "Products" ? "products" : item.children ? "support" : null;
            if (!kind) return <Link key={item.href} href={item.href} onClick={closeAll} className={item.href === "/request-quote" ? "action-primary" : "inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-text"}>{item.label}</Link>;
            const id = kind === "products" ? "products-segment-dropdown" : "sourcing-support-dropdown";
            return <div key={kind} className="relative flex h-full items-center" onMouseEnter={() => setOpenMenu(kind)} onMouseLeave={() => { if (!root.current?.querySelector(`#${id}`)?.contains(document.activeElement)) setOpenMenu(null); }} onFocus={() => { if (!suppressFocus.current) setOpenMenu(kind); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null); }}>
              {kind === "products" ? <Link ref={productsTrigger} href={item.href} aria-expanded={openMenu === kind} aria-controls={openMenu === kind ? id : undefined} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium">{item.label}<ChevronDown aria-hidden="true" size={16} /></Link> :
                <button ref={supportTrigger} type="button" aria-expanded={openMenu === kind} aria-controls={openMenu === kind ? id : undefined} onClick={() => setOpenMenu(kind)} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium">{item.label}<ChevronDown aria-hidden="true" size={16} /></button>}
              {openMenu === kind ? <div id={id} className="absolute left-0 top-full z-50 max-h-[70vh] w-[340px] overflow-y-auto border border-bioaxis-line bg-white p-2 shadow-lg">{kind === "products" ? productLinks : supportLinks}</div> : null}
            </div>;
          })}
        </nav>
      </div>
      {menuOpen ? <nav aria-label="Mobile navigation" id="mobile-primary-navigation" className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-bioaxis-line bg-white px-5 py-4 lg:hidden">
        {navigationItems.map((item) => {
          const kind = item.label === "Products" ? "products" : item.children ? "support" : null;
          if (!kind) return <Link key={item.href} href={item.href} onClick={closeAll} className={item.href === "/request-quote" ? "action-primary mt-3 w-full" : "nav-dropdown-link"}>{item.label}</Link>;
          const id = kind === "products" ? "mobile-products-navigation" : "mobile-support-navigation";
          return <div key={kind}><button type="button" aria-expanded={mobileOpen === kind} aria-controls={mobileOpen === kind ? id : undefined} onClick={() => setMobileOpen(mobileOpen === kind ? null : kind)} className="nav-dropdown-link w-full text-left">{item.label}<ChevronDown aria-hidden="true" className={mobileOpen === kind ? "h-4 w-4 rotate-180" : "h-4 w-4"} /></button>
            {mobileOpen === kind ? <div id={id} className="mb-2 border-l border-bioaxis-line pl-3">{kind === "products" ? productLinks : supportLinks}</div> : null}</div>;
        })}
        {items.length ? <button type="button" className="nav-dropdown-link mt-2 w-full" aria-haspopup="dialog" onClick={() => { closeAll(); openDrawer(mobileMenu.current); }}>Review sourcing list ({items.length})</button> : null}
      </nav> : null}
    </header>
  );
}

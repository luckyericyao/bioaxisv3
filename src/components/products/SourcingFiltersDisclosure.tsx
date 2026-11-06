"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SourcingFiltersDisclosure({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const sync = () => { if (disclosure.current) disclosure.current.open = desktop.matches; };
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);
  return <details ref={disclosure} className="self-start border-t border-bioaxis-line">
    <summary className="min-h-11 cursor-pointer py-3 font-medium text-bioaxis-accent">Filter sourcing targets</summary>
    {children}
  </details>;
}

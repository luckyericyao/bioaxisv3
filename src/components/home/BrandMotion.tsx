"use client";

import { useEffect, useRef } from "react";

export function BrandMotion() {
  const brand = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("bioaxis:brand-intro-seen")) return;
      sessionStorage.setItem("bioaxis:brand-intro-seen", "1");
    } catch {
      return;
    }
    brand.current?.animate([{ opacity: 0.65, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, easing: "ease-out" });
    brand.current?.querySelector("[data-brand-axis]")?.animate([{ transform: "scaleX(0.9)" }, { transform: "scaleX(1)" }], { duration: 500, easing: "ease-out" });
  }, []);
  return <h1 ref={brand} aria-label="BioAxis" className="home-brand" data-home-brand="true">Bio<span data-brand-axis className="inline-block">A</span>xis</h1>;
}

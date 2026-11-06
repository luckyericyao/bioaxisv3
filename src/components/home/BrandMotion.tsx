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
  }, []);
  return <h1 ref={brand} className="home-brand" data-home-brand="true"><span className="hero-line">Explore a new world</span>{" "}<span className="hero-line">of life science</span>{" "}<span className="hero-line">consumables.</span></h1>;
}

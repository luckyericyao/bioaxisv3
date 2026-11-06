"use client";

import { useEffect } from "react";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";

export function HomeMetrics() {
  useEffect(() => {
    if (navigator.webdriver || navigator.doNotTrack === "1") return;
    const interactiveAt = performance.now();
    let firstAction = true;
    trackBioAxisEvent("homepage_view", { device: innerWidth < 1024 ? "mobile" : "desktop" });
    function recordAction(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || !link.closest("main, header")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || (url.pathname === "/" && !url.hash)) return;
      trackBioAxisEvent("cta_click", {
        cta: "homepage_navigation", destination: `${url.pathname}${url.hash}`,
        firstAction, msSinceHomeInteractive: Math.round(performance.now() - interactiveAt)
      });
      firstAction = false;
    }
    document.addEventListener("click", recordAction);
    return () => document.removeEventListener("click", recordAction);
  }, []);
  return null;
}

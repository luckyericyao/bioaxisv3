"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";

type Reporter = Parameters<typeof useReportWebVitals>[0];

const report: Reporter = (metric) => {
  if (navigator.webdriver || navigator.doNotTrack === "1") return;
  if (!["LCP", "INP", "CLS"].includes(metric.name)) return;
  const navigation = performance.getEntriesByType("navigation")[0];
  trackBioAxisEvent("web_vital", {
    metric: metric.name, metricId: metric.id, value: Math.round(metric.value * 1000) / 1000, rating: metric.rating,
    entryPath: navigation ? new URL(navigation.name).pathname : location.pathname,
    device: innerWidth < 1024 ? "mobile" : "desktop"
  });
};

export function PerformanceMetrics() {
  useReportWebVitals(report);
  return null;
}

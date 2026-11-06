import type { Metadata } from "next";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { PrioritySourcingLinesSection } from "@/components/home/PrioritySourcingLinesSection";
import { SourcingSupportSection } from "@/components/home/SourcingSupportSection";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "BioAxis | One-Stop Life Science Consumables Sourcing",
  description:
    "Search and source life science consumables, request equivalent options, compare specifications, request samples, and organize documentation with BioAxis.",
  path: "/"
});

export default function Home() {
  return (
    <>
      <HeroSearchSection />
      <PrioritySourcingLinesSection />
      <SourcingSupportSection />
    </>
  );
}

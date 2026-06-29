import type { Metadata } from "next";
import { BuyerTriggerSection } from "@/components/home/BuyerTriggerSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { PrioritySourcingLinesSection } from "@/components/home/PrioritySourcingLinesSection";
import { WhatBioAxisDoesSection } from "@/components/home/WhatBioAxisDoesSection";

export const metadata: Metadata = {
  title: "BioAxis | One-Stop Life Science Consumables Sourcing",
  description:
    "Search and source life science consumables, request equivalent options, compare specifications, request samples, and organize documentation with BioAxis.",
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  return (
    <>
      <HeroSearchSection />
      <BuyerTriggerSection />
      <PrioritySourcingLinesSection />
      <WhatBioAxisDoesSection />
      <FinalCTASection />
    </>
  );
}

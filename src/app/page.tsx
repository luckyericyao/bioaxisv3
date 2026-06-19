import type { Metadata } from "next";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { MissionSection } from "@/components/home/MissionSection";
import { OnePlatformSection } from "@/components/home/OnePlatformSection";
import {
  HowBioAxisWorksSection,
  PopularStartingPointsSection,
  ProductListIntakeHomeSection,
  SourceByWorkflowSection,
  SourcingProblemsSection
} from "@/components/home/PlatformExpansionSections";
import { ProductDirectorySection } from "@/components/home/ProductDirectorySection";
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
      <WhatBioAxisDoesSection />
      <HowBioAxisWorksSection />
      <ProductListIntakeHomeSection />
      <SourcingProblemsSection />
      <SourceByWorkflowSection />
      <PopularStartingPointsSection />
      <MissionSection />
      <ProductDirectorySection />
      <OnePlatformSection />
      <FinalCTASection />
    </>
  );
}

import { FinalCTASection } from "@/components/home/FinalCTASection";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { MissionSection } from "@/components/home/MissionSection";
import { OnePlatformSection } from "@/components/home/OnePlatformSection";
import {
  DocumentationSupportHomeSection,
  EquivalentSourcingHomeSection,
  HowBioAxisWorksSection,
  HumanSupportHomeSection,
  PopularStartingPointsSection,
  SampleRequestHomeSection,
  SourceByWorkflowSection,
  SourcingProblemsSection
} from "@/components/home/PlatformExpansionSections";
import { ProductDirectorySection } from "@/components/home/ProductDirectorySection";
import { WhatBioAxisDoesSection } from "@/components/home/WhatBioAxisDoesSection";

export default function Home() {
  return (
    <>
      <HeroSearchSection />
      <WhatBioAxisDoesSection />
      <HowBioAxisWorksSection />
      <SourcingProblemsSection />
      <SourceByWorkflowSection />
      <EquivalentSourcingHomeSection />
      <SampleRequestHomeSection />
      <DocumentationSupportHomeSection />
      <HumanSupportHomeSection />
      <PopularStartingPointsSection />
      <MissionSection />
      <ProductDirectorySection />
      <OnePlatformSection />
      <FinalCTASection />
    </>
  );
}

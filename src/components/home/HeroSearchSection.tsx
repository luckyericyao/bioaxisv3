import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { BrandMotion } from "./BrandMotion";
import { HomeMetrics } from "./HomeMetrics";

export function HeroSearchSection() {
  return (
    <section className="home-hero relative isolate overflow-hidden text-white">
      <HomeMetrics />
      <div className="home-hero-photo pointer-events-none -z-10">
        <Image src="/images/systematic/brand-tips.webp" alt="" fill priority sizes="100vw" className="object-cover object-right-bottom" />
      </div>
      <div className="page-container home-hero-content">
        <div className="home-hero-copy">
          <p className="home-label mb-3">BioAxis</p>
          <BrandMotion />
          <p className="home-purpose mt-6">Consumables sourcing, equivalent review, and sample coordination for your lab.</p>
          <div className="home-actions flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <CTAButton href="#sourcing-value" className="home-explore">Explore BioAxis<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></CTAButton>
            <a href="/request-quote" className="inline-flex min-h-12 items-center px-2 text-base font-medium underline underline-offset-4">Request a quote</a>
          </div>
        </div>
      </div>
    </section>
  );
}

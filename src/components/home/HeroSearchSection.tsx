import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { BrandMotion } from "./BrandMotion";
import { HomeMetrics } from "./HomeMetrics";

export function HeroSearchSection() {
  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-bioaxis-line">
      <HomeMetrics />
      <div className="home-hero-photo pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[44%] lg:block">
        <Image src="/images/redesign/hero-consumables.webp" alt="" fill priority sizes="44vw" className="object-cover" />
      </div>
      <div className="page-container py-8 lg:py-16">
        <div className="max-w-[620px]">
          <BrandMotion />
          <p className="home-purpose mt-4 text-bioaxis-muted">Life science consumables, simply sourced.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/products">Browse products<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></CTAButton>
            <CTAButton href="/request-quote" variant="secondary">Request sourcing</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { brand } from "@/data/brand";
import { CTAButton } from "@/components/ui/CTAButton";
import { SearchBox } from "@/components/ui/SearchBox";

export function HeroSearchSection() {
  return (
    <section className="relative overflow-hidden border-b border-bioaxis-line">
      <div className="hero-mask absolute inset-0 -z-10">
        <Image
          src="/images/hero-lab-procurement.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.58]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,3,4,0.35)_0%,rgba(2,3,4,0.7)_58%,#020304_100%)]" />

      <div className="mx-auto flex min-h-[84svh] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-6xl">
          <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">{brand.positioning}</p>
          <h1 className="max-w-6xl text-5xl font-bold uppercase leading-[0.9] text-bioaxis-text sm:text-7xl lg:text-8xl">
            {brand.headline}
          </h1>
          <p className="mt-7 text-2xl font-semibold text-bioaxis-steel sm:text-4xl">{brand.tagline}</p>
          <p className="mt-6 max-w-4xl text-base leading-7 text-bioaxis-muted sm:text-lg">
            BioAxis helps biotech, pharma, academic, and research labs source consumables, compare compatible options, request samples before switching, and organize supplier documentation.
          </p>
        </div>

        <div className="mt-10 max-w-5xl">
          <SearchBox helperText={brand.searchHelper} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/products">Start with Products</CTAButton>
          <CTAButton href="/request-quote" variant="secondary">
            Request Quote
          </CTAButton>
          <CTAButton href="/equivalent-finder" variant="secondary">
            Find Equivalent
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

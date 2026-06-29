import Image from "next/image";
import { brand } from "@/data/brand";
import { CTAButton } from "@/components/ui/CTAButton";
import { SearchBox } from "@/components/ui/SearchBox";
import { pageVisuals } from "@/data/visualAssets";

export function HeroSearchSection() {
  return (
    <section className="relative overflow-hidden border-b border-bioaxis-line">
      <div className="absolute inset-0 -z-10">
        <Image
          src={pageVisuals.homeHero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.72]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,3,4,0.35)_0%,rgba(2,3,4,0.7)_58%,#020304_100%)]" />

      <div className="pointer-events-none absolute bottom-24 right-8 z-0 hidden w-[30vw] max-w-[440px] overflow-hidden border border-white/[0.12] bg-bioaxis-black/70 shadow-2xl shadow-black/60 lg:block">
        <div className="relative aspect-[16/9]">
          <Image
            src={pageVisuals.homeHero.src}
            alt={pageVisuals.homeHero.alt}
            fill
            priority
            sizes="30vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-bioaxis-black/5 to-bioaxis-black/35" aria-hidden="true" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[84svh] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-6xl">
          <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">{brand.positioning}</p>
          <h1 className="max-w-6xl text-5xl font-bold uppercase leading-[0.9] text-bioaxis-text sm:text-7xl lg:text-8xl">
            Paste a catalog number, supplier SKU, or product list.
          </h1>
          <div className="mt-6 max-w-4xl text-base leading-7 text-bioaxis-muted sm:text-lg">
            <p>BioAxis structures equivalent options, sample paths, documentation needs, and quote-ready sourcing next steps for life-science consumables.</p>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <SearchBox
            helperText={brand.searchHelper}
            placeholder="Product name, supplier SKU, catalog number, equivalent target, workflow, or consumable type."
            submitLabel="Start sourcing"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/request-quote?requestType=product-list-review">
            Paste product list
          </CTAButton>
          <CTAButton href="/equivalent-finder" variant="secondary">
            Find equivalent
          </CTAButton>
          <CTAButton href="/products" variant="secondary">
            Browse products
          </CTAButton>
          <CTAButton href="/request-quote?requestType=quote" variant="secondary">
            Request quote
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

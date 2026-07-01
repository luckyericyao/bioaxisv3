import Image from "next/image";
import { brand } from "@/data/brand";
import { CTAButton } from "@/components/ui/CTAButton";
import { SearchBox } from "@/components/ui/SearchBox";
import { pageVisuals } from "@/data/visualAssets";

export function HeroSearchSection() {
  return (
    <section className="relative overflow-hidden border-b border-bioaxis-line bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.22),transparent_28rem),radial-gradient(circle_at_86%_18%,rgba(16,185,129,0.10),transparent_24rem),linear-gradient(135deg,#f8fafc_0%,#eef3f8_100%)]">
      <div className="absolute inset-0 -z-10">
        <Image
          src={pageVisuals.homeHero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.18] grayscale-[15%] saturate-[0.82]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.92)_58%,rgba(238,243,248,0.76)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-7xl min-w-0 flex-col justify-center px-5 py-16 sm:px-8 lg:min-h-[820px] lg:px-10">
        <div className="max-w-6xl min-w-0">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-bioaxis-accent sm:text-sm">
            {brand.positioning}
          </p>
          <h1 className="max-w-full break-words text-4xl font-bold uppercase leading-[0.92] text-bioaxis-text sm:max-w-5xl sm:text-5xl lg:text-6xl">
            {brand.headline}
          </h1>
          <div className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
            <p>
              BioAxis turns SKUs, catalog references, supplier lines, and product lists into
              comparable options, required documents, sample paths, and RFQ-ready sourcing briefs.
            </p>
          </div>
        </div>

        <div className="mt-10 max-w-5xl">
          <SearchBox
            helperText={brand.searchHelper}
            placeholder="SKU, catalog number, supplier line, or product list"
            submitLabel="Structure my sourcing request"
            destination="sourcing"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/equivalent-finder" variant="secondary">
            Find equivalent
          </CTAButton>
          <CTAButton href="/products" variant="secondary">
            Browse product lines
          </CTAButton>
          <CTAButton href="/request-quote?requestType=quote" variant="secondary">
            Request quote
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

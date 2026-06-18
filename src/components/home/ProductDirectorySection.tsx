import { ProductSegmentGrid } from "@/components/products/ProductSegmentGrid";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProductDirectorySection() {
  return (
    <section id="product-directory" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          title="PRODUCTS ACROSS EVERY LIFE SCIENCE WORKFLOW."
          subtitle="Browse the BioAxis product universe across research consumables, reagents, labware, automation formats, sample preparation, and workflow support."
        />
        <CTAButton href="/products" variant="secondary" className="lg:mb-1">
          View Products
        </CTAButton>
      </div>

      <div className="mt-10">
        <ProductSegmentGrid limit={12} />
      </div>
    </section>
  );
}


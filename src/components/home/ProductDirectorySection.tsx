import { ProductSegmentGrid } from "@/components/products/ProductSegmentGrid";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProductDirectorySection() {
  return (
    <section id="product-directory" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          title="Featured product segments for common sourcing requests."
          subtitle="Start with priority BioAxis segments for liquid handling, lab plasticware, cell culture, molecular biology, sample preparation, and automation. The full product universe remains available in the product directory."
        />
        <CTAButton href="/products" variant="secondary" className="lg:mb-1">
          View all product segments
        </CTAButton>
      </div>

      <div className="mt-10">
        <ProductSegmentGrid limit={6} />
      </div>
    </section>
  );
}

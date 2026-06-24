import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";

type RFQCTAProps = {
  title: string;
  body: string;
  segment?: string;
  category?: string;
  family?: string;
  product?: string;
};

export function RFQCTA({ segment, category, family, product }: RFQCTAProps) {
  const resolvedTitle = "Need sourcing help for this product type?";
  const resolvedBody =
    "Send a catalog number, current supplier, product description, or list. BioAxis can help review sourcing options, equivalent paths, sample needs, and documentation requirements.";

  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">RFQ support</p>
          <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">{resolvedTitle}</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">{resolvedBody}</p>
        </div>
        <SourcingRequestButtonGroup segment={segment} category={category} family={family} product={product} size="md" layout="inline" includeSupport />
      </div>
    </section>
  );
}

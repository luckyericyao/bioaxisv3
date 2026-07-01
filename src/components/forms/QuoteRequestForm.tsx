import { SourcingIntakeForm } from "@/components/forms/SourcingIntakeForm";
import { normalizeRequestType } from "@/data/requestTypes";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";

type QuoteRequestInitialValues = {
  requestType?: string;
  productList?: string;
  supplier?: string;
  catalogNumber?: string;
  quantity?: string;
  timeline?: string;
  productCategory?: string;
  requiredDocuments?: string;
  needs?: string[];
};

type QuoteRequestFormProps = {
  initialValues?: QuoteRequestInitialValues;
  productContext?: BioAxisProductContext;
};

export function QuoteRequestForm({ initialValues = {}, productContext }: QuoteRequestFormProps) {
  const requestType = normalizeRequestType(initialValues.requestType);
  const defaultMessage = initialValues.productList ?? "";
  const sourcePage = productContext?.sourcePageUrl ?? productContext?.productUrl ?? "";

  return (
    <SourcingIntakeForm
      requestType={requestType}
      sourcePage={sourcePage}
      segment={productContext?.productSegment}
      category={initialValues.productCategory || productContext?.productCategory}
      family={productContext?.productFamily}
      product={productContext?.productName}
      title="Paste what you have. BioAxis will structure the sourcing request."
      defaultMessage={defaultMessage}
      contextLocked={Boolean(productContext)}
      productContext={productContext}
      submitLabel="Send sourcing request"
    />
  );
}

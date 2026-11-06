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
  handoffNotice?: boolean;
};

export function QuoteRequestForm({ initialValues = {}, productContext, handoffNotice = false }: QuoteRequestFormProps) {
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
      title="What do you need?"
      defaultMessage={defaultMessage}
      initialDetails={{
        currentSupplier: initialValues.supplier ?? "",
        catalogNumber: initialValues.catalogNumber ?? "",
        quantity: initialValues.quantity ?? "",
        timeline: initialValues.timeline ?? "",
        requiredDocuments: initialValues.requiredDocuments ?? ""
      }}
      compact
      contextLocked={Boolean(productContext)}
      productContext={productContext}
      handoffNotice={handoffNotice ? "Your browser could not carry the previous draft automatically. Add it below to continue." : undefined}
      submitLabel="Send sourcing request"
    />
  );
}

import { SourcingIntakeForm } from "@/components/forms/SourcingIntakeForm";

export type SimpleRequestField = {
  id: string;
  label: string;
  required?: boolean;
  kind?: "text" | "email" | "textarea" | "select";
  options?: string[];
};

type SimpleRequestFormProps = {
  title: string;
  fields: SimpleRequestField[];
  submitLabel: string;
  confirmation: string;
  requestType?: string;
};

export function SimpleRequestForm({ title, submitLabel, requestType = "sample" }: SimpleRequestFormProps) {
  return (
    <SourcingIntakeForm
      requestType={requestType}
      title={title}
      productFieldLabel={requestType === "sample" ? "Product / SKU / sample need" : undefined}
      submitLabel={submitLabel}
      optionalChips={
        requestType === "sample"
          ? ["Application / workflow", "Estimated monthly usage", "Shipping region", "Evaluation timeline", "Specifications or notes"]
          : undefined
      }
      compact
    />
  );
}

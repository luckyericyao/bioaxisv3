"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { getRequestTypeById, normalizeRequestType, requestTypes } from "@/data/requestTypes";
import { RequestTypeSelector } from "./RequestTypeSelector";

type QuoteFormState = {
  requestType: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  shippingRegion: string;
  productCategory: string;
  productName: string;
  currentSupplier: string;
  catalogNumber: string;
  requiredSpecification: string;
  quantity: string;
  sterility: string;
  monthlyUsage: string;
  needSample: "yes" | "no";
  needDocumentation: "yes" | "no";
  targetTimeline: string;
  notes: string;
};

const initialState: QuoteFormState = {
  requestType: requestTypes[0].id,
  name: "",
  organization: "",
  email: "",
  phone: "",
  shippingRegion: "",
  productCategory: "",
  productName: "",
  currentSupplier: "",
  catalogNumber: "",
  requiredSpecification: "",
  quantity: "",
  sterility: "",
  monthlyUsage: "",
  needSample: "no",
  needDocumentation: "no",
  targetTimeline: "",
  notes: ""
};

const fieldLabels: Record<keyof QuoteFormState, string> = {
  requestType: "Request type",
  name: "Name",
  organization: "Organization",
  email: "Email",
  phone: "Role / title optional",
  shippingRegion: "Shipping region",
  productCategory: "Product segment / category",
  productName: "Product or equivalent product",
  currentSupplier: "Current brand / supplier",
  catalogNumber: "Current catalog number",
  requiredSpecification: "Required specification",
  quantity: "Desired quantity",
  sterility: "Sterile / non-sterile",
  monthlyUsage: "Monthly or annual usage",
  needSample: "Need sample?",
  needDocumentation: "Documentation required?",
  targetTimeline: "Target delivery date",
  notes: "Notes"
};

const universalRequired: Array<keyof QuoteFormState> = ["name", "organization", "email", "shippingRegion"];
const alwaysVisible: Array<keyof QuoteFormState> = ["name", "organization", "email", "phone", "shippingRegion"];
const fieldOrder: Array<keyof QuoteFormState> = [
  "productCategory",
  "productName",
  "currentSupplier",
  "catalogNumber",
  "requiredSpecification",
  "quantity",
  "sterility",
  "monthlyUsage",
  "needSample",
  "needDocumentation",
  "targetTimeline",
  "notes"
];

type FieldErrors = Partial<Record<keyof QuoteFormState, string>>;

type SubmitState = {
  mode: "email" | "captured";
  message: string;
  referenceId?: string;
};

type QuoteRequestFormProps = {
  initialValues?: Partial<QuoteFormState>;
};

export function QuoteRequestForm({ initialValues = {} }: QuoteRequestFormProps) {
  const startingState = useMemo(
    () => ({
      ...initialState,
      ...initialValues,
      requestType: normalizeRequestType(initialValues.requestType ?? initialState.requestType)
    }),
    [initialValues]
  );
  const [formState, setFormState] = useState<QuoteFormState>(startingState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRequestType = getRequestTypeById(formState.requestType);
  const visibleFields = useMemo(() => {
    const requested = [...selectedRequestType.requiredFields, ...selectedRequestType.optionalFields, "notes"];
    return fieldOrder.filter((field) => requested.includes(field));
  }, [selectedRequestType]);

  function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate() {
    const nextErrors: FieldErrors = {};
    const requiredFields = [...universalRequired, ...selectedRequestType.requiredFields] as Array<keyof QuoteFormState>;

    requiredFields.forEach((field) => {
      if (!String(formState[field]).trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(null);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/request-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          company: formState.organization,
          roleTitle: formState.phone,
          requestType: formState.requestType,
          productCategory: formState.productCategory,
          productName: formState.productName,
          catalogNumber: formState.catalogNumber,
          currentSupplier: formState.currentSupplier,
          quantity: formState.quantity,
          timeline: formState.targetTimeline,
          documentationNeeds: formState.needDocumentation === "yes" ? "Documentation requested" : "",
          sterileStatus: formState.sterility,
          message: [formState.requiredSpecification, formState.monthlyUsage, formState.notes].filter(Boolean).join("\n\n")
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        setSubmitError(payload?.error ?? "Unable to submit the request. Please review the required fields.");
        setSubmitted(null);
        return;
      }

      setSubmitted({
        mode: payload.mode ?? "captured",
        message: payload.message ?? "Your BioAxis sourcing request has been received.",
        referenceId: payload.referenceId
      });
    } catch {
      setSubmitError("Unable to reach the request endpoint. Please try again.");
      setSubmitted(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request received</p>
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">Your sourcing request is ready for BioAxis review.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
          {submitted.message}
        </p>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <div className="mt-6 grid gap-3 text-sm leading-6 text-bioaxis-muted">
          <p>- BioAxis can review the product details, current supplier context, specifications, and documentation needs you sent.</p>
          <p>- If your request involves switching, sample-first evaluation or additional documentation may be useful before a larger purchase.</p>
          <p>- For recurring supply, usage rhythm, shipping region, and packaging requirements help shape the next sourcing step.</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setFormState(startingState);
              setSubmitted(null);
            }}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Start another request
          </button>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Go to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8">
      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Select request type</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          Choose the request that best matches the sourcing support you need. Fields update based on request type.
        </p>
        <p className="mt-3 border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-sm leading-6 text-bioaxis-steel">
          Pasting a product list into Notes is fine. Include supplier names, catalog numbers, quantities, target delivery dates, and documentation needs where available.
        </p>
        <div className="mt-6">
          <RequestTypeSelector
            requestTypes={requestTypes}
            selectedId={formState.requestType}
            onSelect={(id) => {
              updateField("requestType", id);
              setSubmitted(null);
            }}
          />
        </div>
      </section>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Contact and shipping</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {alwaysVisible.map((field) => (
            <Field
              key={field}
              id={field}
              label={fieldLabels[field]}
              value={String(formState[field])}
              type={field === "email" ? "email" : "text"}
              error={errors[field]}
              required={universalRequired.includes(field)}
              onChange={(value) => updateField(field, value)}
            />
          ))}
        </div>
      </section>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{selectedRequestType.label}</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{selectedRequestType.description}</p>
        {selectedRequestType.id === "product-list-review" ? (
          <p className="mt-3 text-sm leading-6 text-bioaxis-accent">
            Paste product names, current suppliers, catalog numbers, quantities, and documentation needs in the Notes field.
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {visibleFields.map((field) =>
            field === "notes" || field === "requiredSpecification" ? (
              <TextArea
                key={field}
                id={field}
                label={fieldLabels[field]}
                value={String(formState[field])}
                error={errors[field]}
                required={selectedRequestType.requiredFields.includes(field)}
                onChange={(value) => updateField(field, value)}
              />
            ) : field === "needSample" || field === "needDocumentation" ? (
              <Select
                key={field}
                id={field}
                label={fieldLabels[field]}
                value={formState[field]}
                onChange={(value) => updateField(field, value as QuoteFormState[typeof field])}
              />
            ) : (
              <Field
                key={field}
                id={field}
                label={fieldLabels[field]}
                value={String(formState[field])}
                error={errors[field]}
                required={selectedRequestType.requiredFields.includes(field)}
                onChange={(value) => updateField(field, value)}
              />
            )
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-bioaxis-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">
            BioAxis reviews quote-ready product details including current supplier, catalog number, quantity, timeline, sterility, documentation, and sample needs.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </div>
        {submitError ? <p className="mt-4 text-sm text-bioaxis-accent">{submitError}</p> : null}
      </section>
    </form>
  );
}

type FieldProps = {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  type?: "email" | "text";
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function Field({ id, label, value, type = "text", error, required = false, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-bioaxis-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaProps = Omit<FieldProps, "type">;

function TextArea({ id, label, value, error, required = false, onChange }: TextAreaProps) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base text-bioaxis-text"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-bioaxis-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange
}: {
  id: "needSample" | "needDocumentation";
  label: string;
  value: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as "yes" | "no")}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
      >
        <option value="no">no</option>
        <option value="yes">yes</option>
      </select>
    </div>
  );
}

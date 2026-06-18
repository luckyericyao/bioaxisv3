"use client";

import { FormEvent, useMemo, useState } from "react";
import { getRequestTypeById, requestTypes } from "@/data/requestTypes";
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
  phone: "Phone optional",
  shippingRegion: "Shipping region",
  productCategory: "Product category",
  productName: "Product name",
  currentSupplier: "Current supplier",
  catalogNumber: "Catalog number",
  requiredSpecification: "Required specification",
  quantity: "Quantity",
  monthlyUsage: "Monthly or annual usage",
  needSample: "Need sample?",
  needDocumentation: "Need documentation?",
  targetTimeline: "Target timeline",
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
  "monthlyUsage",
  "needSample",
  "needDocumentation",
  "targetTimeline",
  "notes"
];

type FieldErrors = Partial<Record<keyof QuoteFormState, string>>;

export function QuoteRequestForm() {
  const [formState, setFormState] = useState<QuoteFormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedRequestType = getRequestTypeById(formState.requestType);
  const visibleFields = useMemo(() => {
    const requested = [...selectedRequestType.requiredFields, ...selectedRequestType.optionalFields, "notes"];
    return fieldOrder.filter((field) => requested.includes(field));
  }, [selectedRequestType]);

  function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request received</p>
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">Thank you for your request.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
          A BioAxis sourcing specialist will review your information and follow up with sourcing options, equivalent products, sample availability, or documentation support where applicable.
        </p>
        <button
          type="button"
          onClick={() => {
            setFormState(initialState);
            setSubmitted(false);
          }}
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          Start another request
        </button>
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
        <div className="mt-6">
          <RequestTypeSelector
            requestTypes={requestTypes}
            selectedId={formState.requestType}
            onSelect={(id) => {
              updateField("requestType", id);
              setSubmitted(false);
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
        {selectedRequestType.id === "product-list" ? (
          <p className="mt-3 text-sm leading-6 text-bioaxis-accent">
            Upload support can be added in a future version. For now, paste your product list in the Notes field.
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
            This form prepares the request details on the client. It does not send data until backend or email integration is added.
          </p>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Submit request
          </button>
        </div>
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


"use client";

import { FormEvent, useState } from "react";
import { requestErrorMessage, requestSuccessMessage, submitBioAxisRequest } from "@/lib/submitBioAxisRequest";

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

type SubmittedState = {
  message: string;
  referenceId?: string;
};

export function SimpleRequestForm({ title, fields, submitLabel, confirmation, requestType = "sample" }: SimpleRequestFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((field) => [field.id, field.options?.[0] ?? ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [website, setWebsite] = useState("");

  function validate() {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !values[field.id]?.trim()) {
        nextErrors[field.id] = `${field.label} is required.`;
      }
    });

    const emailField = fields.find((field) => field.kind === "email");
    if (emailField && values[emailField.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[emailField.id])) {
      nextErrors[emailField.id] = "Enter a valid email address.";
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
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = await submitBioAxisRequest({
        name: values.name,
        email: values.email,
        organization: values.organization,
        company: values.organization,
        requestType,
        productCategory: values.productCategory,
        productName: values.productName || values.productCategory || title,
        currentSupplier: values.currentSupplier,
        quantity: values.estimatedUsage || values.quantity,
        shippingRegion: values.shippingRegion,
        timeline: values.evaluationTimeline || values.timeline,
        documentationNeeds: values.requiredDocuments || values.requiredSpecifications,
        sterileStatus: values.sterility,
        sampleNeeded: requestType === "sample",
        website,
        message: [
          values.requiredSpecifications ? `Required specifications:\n${values.requiredSpecifications}` : "",
          values.application ? `Application / workflow:\n${values.application}` : "",
          values.notes
        ]
          .filter(Boolean)
          .join("\n\n")
      });

      if (!payload.ok) {
        setSubmitError(requestErrorMessage);
        setSubmitted(null);
        return;
      }

      setSubmitted({
        message: payload.message ?? requestSuccessMessage,
        referenceId: payload.referenceId
      });
    } catch {
      setSubmitError(requestErrorMessage);
      setSubmitted(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request received</p>
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">{title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">{submitted.message}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">{confirmation}</p>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <button
          type="button"
          onClick={() => {
            setValues(Object.fromEntries(fields.map((field) => [field.id, field.options?.[0] ?? ""])));
            setSubmitted(null);
          }}
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          Start another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-api-endpoint="/api/rfq" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="simple-request-website">Website</label>
        <input
          id="simple-request-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id] ?? ""}
            error={errors[field.id]}
            onChange={(value) => {
              setValues((current) => ({ ...current, [field.id]: value }));
              setErrors((current) => ({ ...current, [field.id]: "" }));
            }}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
      >
        {submitting ? "Submitting..." : submitLabel}
      </button>
      {submitError ? <p className="mt-4 text-sm text-bioaxis-accent">{submitError}</p> : null}
    </form>
  );
}

function FormField({
  field,
  value,
  error,
  onChange
}: {
  field: SimpleRequestField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const label = (
    <label htmlFor={field.id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
      {field.label}
      {field.required ? <span className="text-bioaxis-accent"> *</span> : null}
    </label>
  );

  if (field.kind === "textarea") {
    return (
      <div className="md:col-span-2">
        {label}
        <textarea
          id={field.id}
          value={value}
          rows={5}
          onChange={(event) => onChange(event.target.value)}
          className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base text-bioaxis-text"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
        {error ? <p id={`${field.id}-error`} className="mt-2 text-sm text-bioaxis-accent">{error}</p> : null}
      </div>
    );
  }

  if (field.kind === "select") {
    return (
      <div>
        {label}
        <select
          id={field.id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
        >
          {(field.options ?? ["no", "yes"]).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={field.id}
        type={field.kind === "email" ? "email" : "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.id}-error` : undefined}
      />
      {error ? <p id={`${field.id}-error`} className="mt-2 text-sm text-bioaxis-accent">{error}</p> : null}
    </div>
  );
}

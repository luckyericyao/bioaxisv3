"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestErrorMessage, requestSuccessMessage, submitBioAxisRequest } from "@/lib/submitBioAxisRequest";

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  requestType: string;
  message: string;
  website: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  company: "",
  requestType: "contact",
  message: "",
  website: ""
};

const requestTypeOptions = [
  { label: "General contact", value: "contact" },
  { label: "Quote request", value: "quote" },
  { label: "Equivalent product matching", value: "equivalent" },
  { label: "Sample evaluation", value: "sample" },
  { label: "Documentation request", value: "documentation" },
  { label: "Recurring supply support", value: "recurring-supply" }
];

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

export function ContactForm() {
  const [values, setValues] = useState<ContactFormState>(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState<{ message: string; referenceId?: string } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate() {
    const nextErrors: ContactFormErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Please enter an email so BioAxis can follow up.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Please enter an email so BioAxis can follow up.";
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
        company: values.company,
        requestType: values.requestType,
        productName: "Contact request",
        message: values.message,
        website: values.website
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
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">BioAxis has your message.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">{submitted.message}</p>
        <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
          Next steps depend on the request type. BioAxis can review the product context, equivalent path, sample need, documentation request, or recurring supply details you shared.
        </p>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setValues(initialState);
              setSubmitted(null);
            }}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Submit another message
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
    <form onSubmit={handleSubmit} noValidate data-api-endpoint="/api/rfq" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Contact BioAxis</h2>
      <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
        Only your email is required. Add a sourcing question, equivalent request, sample need, documentation note, or recurring supply context if useful.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field id="name" label="Name optional" value={values.name} error={errors.name} onChange={(value) => updateField("name", value)} />
        <Field id="email" label="Email" type="email" value={values.email} error={errors.email} required onChange={(value) => updateField("email", value)} />
        <Field id="company" label="Company optional" value={values.company} error={errors.company} onChange={(value) => updateField("company", value)} />
        <div>
          <label htmlFor="requestType" className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
            Request type
          </label>
          <select
            id="requestType"
            value={values.requestType}
            onChange={(event) => updateField("requestType", event.target.value)}
            className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
          >
            {requestTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.requestType ? <p className="mt-2 text-sm text-bioaxis-accent">{errors.requestType}</p> : null}
        </div>
        <TextArea id="message" label="Message optional" value={values.message} error={errors.message} onChange={(value) => updateField("message", value)} />
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-bioaxis-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">
          Include product names, current supplier or catalog number, specifications, documentation needs, sample requirements, or usage rhythm where helpful.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
        >
          {submitting ? "Submitting..." : "Send message"}
        </button>
      </div>
      {submitError ? <p className="mt-4 text-sm text-bioaxis-accent">{submitError}</p> : null}
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  type = "text",
  required = false,
  onChange
}: {
  id: keyof ContactFormState;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  required?: boolean;
  onChange: (value: string) => void;
}) {
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

function TextArea({
  id,
  label,
  value,
  error,
  required = false,
  onChange
}: {
  id: keyof ContactFormState;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        rows={6}
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

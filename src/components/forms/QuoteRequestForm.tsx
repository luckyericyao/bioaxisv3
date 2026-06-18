"use client";

import { FormEvent, useMemo, useState } from "react";

type QuoteFormState = {
  name: string;
  organization: string;
  email: string;
  product: string;
  lookingFor: string;
  volume: string;
  needSample: "yes" | "no";
  notes: string;
};

const initialState: QuoteFormState = {
  name: "",
  organization: "",
  email: "",
  product: "",
  lookingFor: "",
  volume: "",
  needSample: "no",
  notes: ""
};

type FieldErrors = Partial<Record<keyof QuoteFormState, string>>;

export function QuoteRequestForm() {
  const [formState, setFormState] = useState<QuoteFormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredFields = useMemo(
    () => [
      ["name", "Name is required."],
      ["organization", "Organization is required."],
      ["email", "Email is required."],
      ["product", "Product, catalog number, or supplier is required."],
      ["lookingFor", "Tell BioAxis what you are looking for."]
    ] as const,
    []
  );

  function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FieldErrors = {};

    requiredFields.forEach(([field, message]) => {
      if (!formState[field].trim()) {
        nextErrors[field] = message;
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
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request prepared</p>
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">BioAxis sourcing details are ready.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
          Your request has been prepared. A BioAxis sourcing specialist can use this information to follow up on products, equivalents, samples, and quote options.
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
    <form onSubmit={handleSubmit} noValidate className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="name"
          label="Name"
          value={formState.name}
          error={errors.name}
          onChange={(value) => updateField("name", value)}
        />
        <Field
          id="organization"
          label="Organization"
          value={formState.organization}
          error={errors.organization}
          onChange={(value) => updateField("organization", value)}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={formState.email}
          error={errors.email}
          onChange={(value) => updateField("email", value)}
        />
        <Field
          id="product"
          label="Product / catalog number / supplier"
          value={formState.product}
          error={errors.product}
          onChange={(value) => updateField("product", value)}
        />
        <TextArea
          id="lookingFor"
          label="What are you looking for?"
          value={formState.lookingFor}
          error={errors.lookingFor}
          onChange={(value) => updateField("lookingFor", value)}
        />
        <Field
          id="volume"
          label="Monthly usage / expected volume"
          value={formState.volume}
          error={errors.volume}
          onChange={(value) => updateField("volume", value)}
        />
        <div>
          <label htmlFor="needSample" className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
            Need sample? yes/no
          </label>
          <select
            id="needSample"
            value={formState.needSample}
            onChange={(event) => updateField("needSample", event.target.value as QuoteFormState["needSample"])}
            className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <TextArea
          id="notes"
          label="Notes"
          value={formState.notes}
          error={errors.notes}
          onChange={(value) => updateField("notes", value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-bioaxis-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">
          This client-side form prepares the request details only. BioAxis can connect the request to sourcing workflow infrastructure when backend services are added.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
        >
          Prepare request
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  type?: "email" | "text";
  error?: string;
  onChange: (value: string) => void;
};

function Field({ id, label, value, type = "text", error, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
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

function TextArea({ id, label, value, error, onChange }: TextAreaProps) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
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


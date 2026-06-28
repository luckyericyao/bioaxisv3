"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";

type SearchBoxProps = {
  initialQuery?: string;
  helperText?: string;
  placeholder?: string;
  submitLabel?: string;
  variant?: "hero" | "page";
  className?: string;
};

export function SearchBox({
  initialQuery = "",
  helperText,
  placeholder = "search anything",
  submitLabel = "Search",
  variant = "hero",
  className = ""
}: SearchBoxProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const destination = trimmedQuery ? `/products?q=${encodeURIComponent(trimmedQuery)}` : "/products";
    router.push(destination);
  }

  const shellClass =
    variant === "hero"
      ? "min-h-20 px-4 py-3 sm:min-h-24 sm:px-5"
      : "min-h-16 px-3 py-3 sm:px-4";

  const inputClass =
    variant === "hero"
      ? "text-2xl sm:text-4xl lg:text-5xl"
      : "text-xl sm:text-2xl";

  return (
    <form onSubmit={handleSubmit} className={["w-full", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="sr-only">
        Paste SKU, catalog number, or product list
      </label>
      <div
        className={[
          "flex w-full flex-col gap-3 border border-white/[0.18] bg-black/[0.62] shadow-search backdrop-blur-md transition focus-within:border-bioaxis-accent/80 sm:flex-row sm:items-center",
          shellClass
        ].join(" ")}
      >
        <input
          id={inputId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={[
            "field-focus min-w-0 flex-1 border-0 bg-transparent font-semibold lowercase text-bioaxis-text placeholder:text-bioaxis-dim",
            inputClass
          ].join(" ")}
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
        >
          {submitLabel}
        </button>
      </div>
      {helperText ? <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{helperText}</p> : null}
    </form>
  );
}

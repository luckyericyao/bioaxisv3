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
      ? "min-h-16 px-4 py-3 sm:min-h-[72px] sm:px-5"
      : "min-h-16 px-3 py-3 sm:px-4";

  const inputClass =
    variant === "hero"
      ? "text-base sm:text-lg lg:text-xl"
      : "text-xl sm:text-2xl";

  return (
    <form onSubmit={handleSubmit} className={["w-full", className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className="sr-only">
        Product, catalog reference, or workflow
      </label>
      <div
        className={[
          "flex w-full flex-col gap-3 border border-white/70 bg-white/[0.82] shadow-search backdrop-blur-md transition focus-within:border-bioaxis-ice sm:flex-row sm:items-center",
          shellClass
        ].join(" ")}
      >
        <input
          id={inputId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={[
            "field-focus min-w-0 flex-1 border-0 bg-transparent font-semibold text-bioaxis-text placeholder:text-bioaxis-dim placeholder:whitespace-normal",
            inputClass
          ].join(" ")}
        />
        <button
          type="submit"
          className="inline-flex min-h-12 shrink-0 items-center justify-center border border-bioaxis-text bg-bioaxis-text px-6 text-sm font-bold uppercase text-white transition hover:border-bioaxis-ice hover:bg-bioaxis-ice hover:text-bioaxis-text sm:px-7"
        >
          {submitLabel}
        </button>
      </div>
      {helperText ? <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{helperText}</p> : null}
    </form>
  );
}

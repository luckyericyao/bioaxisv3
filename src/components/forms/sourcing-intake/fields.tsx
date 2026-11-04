export function Field({
  id,
  name,
  label,
  value,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  placeholder,
  onChange
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  type?: "email" | "text";
  required?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text";
  placeholder?: string;
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
        name={name ?? id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  options,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const visibleOptions = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
      >
        <option value="">Not sure</option>
        {visibleOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({
  id,
  label,
  value,
  rows = 5,
  required = false,
  helperText,
  placeholder,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  rows?: number;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        required={required}
        aria-describedby={helperId}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base leading-7 text-bioaxis-text placeholder:text-bioaxis-dim"
      />
      {helperText ? (
        <p id={helperId} className="mt-2 text-sm leading-6 text-bioaxis-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

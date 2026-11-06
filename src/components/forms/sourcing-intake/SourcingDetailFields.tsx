import { getRequestTypeById, requestTypes } from "@/data/requestTypes";
import { RequestTypeSelector } from "../RequestTypeSelector";
import { optionalHelperText, timelineOptions } from "./constants";
import { Field, SelectField, TextArea } from "./fields";
import type { IntakeState, UpdateIntakeField } from "./types";
import type { ReactNode } from "react";

export function SourcingDetailFields({
  state,
  chips,
  updateField,
  toggleChip,
  children
}: {
  state: IntakeState;
  chips: string[];
  updateField: UpdateIntakeField;
  toggleChip: (chip: string) => void;
  children?: ReactNode;
}) {
  const selectedRequestType = getRequestTypeById(state.requestType);

  return (
    <details className="group border border-bioaxis-line bg-bioaxis-panel">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-4 text-left">
        <span>
          <span className="block text-sm font-medium text-bioaxis-text">Add more details (optional)</span>
        </span>
        <span aria-hidden="true" className="text-sm font-semibold  text-bioaxis-accent transition group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-5 border-t border-bioaxis-line p-5 md:grid-cols-2 sm:p-8">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold  text-bioaxis-accent">Request type optional</p>
          <div className="mt-4">
            <RequestTypeSelector
              requestTypes={requestTypes}
              selectedId={state.requestType}
              onSelect={(id) => updateField("requestType", id)}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{selectedRequestType.description}</p>
        </div>
        {chips.length > 0 ? (
          <fieldset className="md:col-span-2">
            <legend className="mb-3 block text-sm font-semibold  text-bioaxis-steel">Review details optional</legend>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {chips.map((chip) => {
                const checked = state.detailChips.includes(chip);
                return (
                  <label
                    key={chip}
                    className={[
                      "flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-xs font-semibold  transition",
                      checked
                        ? "border-bioaxis-accent bg-bioaxis-accent/10 text-bioaxis-accent"
                        : "border-bioaxis-line bg-bioaxis-black text-bioaxis-steel hover:border-bioaxis-accent/70"
                    ].join(" ")}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleChip(chip)} className="h-4 w-4 accent-bioaxis-accent" />
                    <span>{chip}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}
        <Field id="sourcing-name" label="Name optional" value={state.name} onChange={(value) => updateField("name", value)} />
        <Field id="sourcing-company" label="Company or organization optional" value={state.company} onChange={(value) => updateField("company", value)} />
        <Field id="sourcing-phone" label="Phone optional" value={state.phone} onChange={(value) => updateField("phone", value)} />
        <Field id="sourcing-role" label="Role or title optional" value={state.roleTitle} onChange={(value) => updateField("roleTitle", value)} />
        <Field id="sourcing-supplier" label="Current supplier or brand optional" value={state.currentSupplier} onChange={(value) => updateField("currentSupplier", value)} />
        <Field id="sourcing-catalog" label="Catalog number or SKU optional" value={state.catalogNumber} onChange={(value) => updateField("catalogNumber", value)} />
        <Field id="sourcing-quantity" label="Quantity or usage optional" value={state.quantity} onChange={(value) => updateField("quantity", value)} />
        <SelectField id="sourcing-timeline" label="Timeline optional" value={state.timeline} options={timelineOptions} onChange={(value) => updateField("timeline", value)} />
        <Field id="sourcing-region" label="Shipping region optional" value={state.shippingRegion} onChange={(value) => updateField("shippingRegion", value)} />
        <TextArea
          id="sourcing-docs"
          label="Required documents optional"
          value={state.requiredDocuments}
          rows={4}
          placeholder="CoA, SDS, sterility, material statement, lot-level documentation, or supplier specification sheet."
          onChange={(value) => updateField("requiredDocuments", value)}
        />
        <TextArea
          id="sourcing-notes"
          label="Notes optional"
          value={state.notes}
          rows={4}
          placeholder="Add anything useful for BioAxis to review."
          onChange={(value) => updateField("notes", value)}
        />
        <p className="md:col-span-2 text-sm leading-6 text-bioaxis-muted">{optionalHelperText}</p>
        {children}
      </div>
    </details>
  );
}

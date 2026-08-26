export type ReadySupplyEvidenceRow = {
  label: string;
  status: string;
  confirmation: string;
  boundary: string;
};

export type SelectedLineRegistryRecord = {
  line: string;
  supplyMode: string;
  confirmationOwner: string;
  lastConfirmed: string;
  documents: string[];
  samplePath: string;
  buyerResponsibility: string;
};

// No line-level record is published until it has an evidence-backed confirmation.
// This keeps selected-line status separate from generic coverage language.
export const selectedLineRegistry: SelectedLineRegistryRecord[] = [];

export const selectedLineRegistryNote =
  "Line-level status is returned per request after the relevant warehouse or supplier evidence is checked. No public record is treated as current availability.";

export const readySupplyEvidenceRows: ReadySupplyEvidenceRow[] = [
  {
    label: "Availability",
    status: "Selected lines only",
    confirmation: "Confirm per request",
    boundary: "No public real-time inventory feed"
  },
  {
    label: "Supply mode",
    status: "Supplier-coordinated",
    confirmation: "Supply source and owner identified per request",
    boundary: "No warehouse ownership or stocked status is published without line-level evidence"
  },
  {
    label: "Documents",
    status: "CoA, SDS, sterility, and specification records where available",
    confirmation: "Request and organize before purchase",
    boundary: "Buyer-side technical and compliance review remains required"
  },
  {
    label: "Sample path",
    status: "Sample coordination when applicable",
    confirmation: "Availability and quantity confirmed per request",
    boundary: "Buyer evaluates the sample in the intended workflow"
  },
  {
    label: "Dispatch coordination",
    status: "Timing assessed per request",
    confirmation: "Dispatch path confirmed with the response",
    boundary: "No guaranteed lead time or shipment promise"
  },
  {
    label: "Replenishment",
    status: "Repeat supply planning",
    confirmation: "Usage, packaging, and backup source reviewed per request",
    boundary: "Continuity depends on supplier and buyer-side planning"
  },
  {
    label: "Last confirmed",
    status: "No public timestamp",
    confirmation: "Fresh status returned with the request response",
    boundary: "Past confirmation is not treated as current availability"
  }
];

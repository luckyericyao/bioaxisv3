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
  "Line-specific status is not shown as site-wide availability. A request can be checked against current supplier or warehouse evidence; the response should distinguish confirmed details from what remains unknown.";

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
  }
];

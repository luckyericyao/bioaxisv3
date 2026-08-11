export type ReadySupplyEvidenceRow = {
  label: string;
  status: string;
  confirmation: string;
  boundary: string;
};

export const readySupplyEvidenceRows: ReadySupplyEvidenceRow[] = [
  {
    label: "Availability",
    status: "Selected lines only",
    confirmation: "Confirm per request",
    boundary: "No public real-time inventory feed"
  },
  {
    label: "Supply mode",
    status: "Warehouse-backed or supplier-coordinated",
    confirmation: "Supply path identified per request",
    boundary: "Warehouse and supplier evidence remain the source"
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

export const redactedEvidenceExample = [
  ["Record type", "Illustrative selected-line review record"],
  ["Availability", "Confirm per request"],
  ["Document status", "Supplier evidence requested; status depends on line and lot"],
  ["Sample status", "Confirm if the selected line supports a sample path"],
  ["Owner boundary", "BioAxis organizes the request; supplier and buyer own evidence and acceptance"]
] as const;

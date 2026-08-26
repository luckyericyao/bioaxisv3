import { getBioAxisRequestId } from "./clientRequestId";

export type BioAxisEventName =
  | "search"
  | "search_no_result"
  | "search_submit"
  | "search_results_view"
  | "search_result_cta"
  | "cta_click"
  | "sourcing_list_add"
  | "rfq_start"
  | "rfq_submit"
  | "rfq_validation_failed"
  | "rfq_success"
  | "rfq_error"
  | "turnstile_failure"
  | "rfq_delivery"
  | "rfq_queue_write_succeeded"
  | "rfq_queue_write_failed";

export type EventProperties = Record<string, string | number | boolean | undefined>;

export function trackBioAxisEvent(name: BioAxisEventName, properties: EventProperties = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const enrichedProperties = {
    requestId: properties.requestId ?? getBioAxisRequestId(),
    ...properties
  };
  const body = JSON.stringify({
    name,
    properties: enrichedProperties,
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  try {
    const payload = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/analytics", payload)) {
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => undefined);
  } catch {
    // Analytics must never interrupt a sourcing workflow.
  }
}

import type { BioAxisEventName, EventProperties } from "@/lib/trackBioAxisEvent";
import { alertBioAxisFailure } from "./alertBioAxisFailure";

const maxPropertyLength = 180;

function safeProperties(properties: EventProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean")
      .map(([key, value]) => [key.slice(0, 80), typeof value === "string" ? value.slice(0, maxPropertyLength) : value])
  );
}

export async function recordBioAxisEvent(name: BioAxisEventName, properties: EventProperties, path: string) {
  const sanitizedProperties = {
    ...safeProperties(properties),
    path: path.slice(0, 180),
    source: "bioaxis"
  };

  console.info(
    "[BioAxis event]",
    JSON.stringify({ name, properties: sanitizedProperties, timestamp: new Date().toISOString() })
  );

  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    return { mode: "logs" as const };
  }

  const host = (process.env.POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

  try {
    const response = await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event: name,
        distinct_id: typeof properties.requestId === "string" ? properties.requestId : "bioaxis-anonymous",
        properties: sanitizedProperties
      }),
      signal: AbortSignal.timeout(900)
    });

    if (!response.ok) {
      console.warn("[BioAxis event] persistence failed", response.status);
      void alertBioAxisFailure({
        requestId: typeof properties.requestId === "string" ? properties.requestId : undefined,
        stage: "analytics",
        detail: `PostHog capture returned ${response.status}.`
      });
      return { mode: "error" as const };
    }

    return { mode: "posthog" as const };
  } catch {
    console.warn("[BioAxis event] persistence unavailable");
    void alertBioAxisFailure({
      requestId: typeof properties.requestId === "string" ? properties.requestId : undefined,
      stage: "analytics",
      detail: "PostHog capture request failed or timed out."
    });
    return { mode: "error" as const };
  }
}

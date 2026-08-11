type BioAxisFailureAlert = {
  requestId?: string;
  stage: string;
  detail: string;
};

function clean(value: string, limit: number) {
  return value.replace(/[\r\n]/g, " ").slice(0, limit);
}

export async function alertBioAxisFailure({ requestId = "unknown", stage, detail }: BioAxisFailureAlert) {
  const alert = {
    source: "bioaxis",
    requestId: clean(requestId, 100),
    stage: clean(stage, 80),
    detail: clean(detail, 240),
    timestamp: new Date().toISOString()
  };
  const webhookUrl = process.env.BIOAXIS_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[BioAxis alert] not configured", JSON.stringify(alert));
    return "not-configured" as const;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[BioAxis] ${alert.stage} failure (${alert.requestId}): ${alert.detail}`,
        ...alert
      }),
      signal: AbortSignal.timeout(900)
    });

    if (!response.ok) {
      console.warn("[BioAxis alert] webhook failed", response.status, JSON.stringify(alert));
      return "error" as const;
    }

    return "sent" as const;
  } catch {
    console.warn("[BioAxis alert] webhook unavailable", JSON.stringify(alert));
    return "error" as const;
  }
}

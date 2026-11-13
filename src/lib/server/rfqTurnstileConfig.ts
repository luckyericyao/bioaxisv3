export const verificationUnavailableMessage = "Verification is temporarily unavailable. Keep this form open and try again.";

export function getRfqTurnstileConfig() {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  const siteKey = [
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    process.env.TURNSTILE_SITE_KEY,
    process.env.CLOUDFLARE_TURNSTILE_SITE_KEY
  ].map((key) => key?.trim()).find(Boolean) ?? "";

  if (secret && siteKey) return { status: "ready", secret, siteKey } as const;

  // A deployed form or a configured durable queue must never bypass verification.
  if (secret || siteKey || process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview") {
    return { status: "unavailable" } as const;
  }

  return { status: "disabled" } as const;
}

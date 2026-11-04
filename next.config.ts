import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

function normalizeReleaseSha(value: string | undefined) {
  const sha = value?.trim().toLowerCase();
  return sha && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(sha) ? sha : undefined;
}

function buildReleaseSha() {
  const vercelSha = normalizeReleaseSha(process.env.VERCEL_GIT_COMMIT_SHA);
  if (vercelSha) return vercelSha;

  try {
    return normalizeReleaseSha(execFileSync("git", ["rev-parse", "--verify", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    })) ?? "unknown";
  } catch {
    return "unknown";
  }
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com;" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const nextConfig: NextConfig = {
  // Next.js inlines this validated, public identifier into the build artifact.
  env: { BIOAXIS_RELEASE_SHA: buildReleaseSha() },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  }
};

export default nextConfig;

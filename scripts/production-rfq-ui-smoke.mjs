import assert from "node:assert/strict";
import { chromium } from "playwright";

const expectedSha = process.argv[2]?.toLowerCase();
assert.ok(process.argv.length === 3 && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(expectedSha ?? ""),
  "Usage: npm run smoke:production-rfq-ui -- <full-release-sha>");

const origin = "https://bioaxisv3.vercel.app";
const widgetOrigin = "https://challenges.cloudflare.com";

async function checkRelease() {
  const response = await fetch(`${origin}/api/rfq?release-check=${Date.now()}`, {
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000)
  });
  assert.equal(response.status, 200, "Production RFQ readiness");
  assert.equal((await response.json()).release, expectedSha, "Production must serve the expected commit");
}

await checkRelease();
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
try {
  for (const path of ["/products?q=cell", "/equivalent-finder", "/ready-supply", "/request-quote"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    let configRequests = 0;
    let sdkRequests = 0;
    try {
      await page.route("**/*", (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (!["GET", "HEAD"].includes(request.method()) || (url.origin !== origin && url.origin !== widgetOrigin)) {
          return route.abort();
        }
        if (url.origin === origin && url.pathname === "/api/turnstile/config") configRequests += 1;
        if (url.origin === widgetOrigin && url.pathname === "/turnstile/v0/api.js") sdkRequests += 1;
        return route.continue();
      });

      const response = await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
      assert.equal(response?.status(), 200, path);
      if (path !== "/request-quote") {
        await page.waitForLoadState("networkidle", { timeout: 15_000 });
        assert.equal(await page.locator('[data-sourcing-intake="compact"]').count(), 0, `${path}: form mounted before opening`);
        assert.equal(configRequests + sdkRequests, 0, `${path}: verification loaded before opening`);
        await page.locator('[data-sourcing-intake-disclosure="true"] > summary').press("Enter", { timeout: 8_000 });
        await page.locator("#sourcing-email").waitFor({ state: "visible", timeout: 8_000 });
        console.log(`PASS ${path}: sourcing form opens on demand`);
      } else {
        await page.waitForFunction(() => {
          const widget = document.querySelector(".cf-turnstile");
          return typeof window.turnstile?.render === "function" && Boolean(widget?.childElementCount);
        }, null, { timeout: 15_000 });
        assert.ok(configRequests > 0 && sdkRequests > 0, "Production verification must use the configured SDK");
        assert.equal(await page.locator('[aria-label="Verification"] [role="alert"]').count(), 0);
        console.log(`PASS ${path}: official verification widget mounted`);
      }
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
await checkRelease();
console.log(`Production RFQ UI smoke passed for ${expectedSha}; write requests were blocked.`);

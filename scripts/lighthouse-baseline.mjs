import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const usage = `Usage: node scripts/lighthouse-baseline.mjs [options]

  --url <url>                 Target (default: http://localhost:3000/products)
  --output <file>             JSON report (default: artifacts/lighthouse-baseline/<timestamp>.json)
  --mode <auto|vitals|lighthouse>  auto uses an already installed Lighthouse, otherwise Playwright
  --settle-ms <0..30000>       Observation after load in vitals mode (default: 3000)
  --timeout-ms <1000..120000>  Navigation / Lighthouse load timeout (default: 45000)
  --browser-executable <path> Use an existing Chromium binary
  --help                     Show this help without launching a browser

Start the local app separately. This script never installs packages or browsers.
Playwright measurements are lab approximations, not field Core Web Vitals or a Lighthouse score.
No interaction is performed; INP is not measured.`;

function parseOptions(args) {
  const options = { url: "http://localhost:3000/products", mode: "auto", settleMs: 3000, timeoutMs: 45000 };
  const valueOptions = new Map([
    ["--url", "url"], ["--output", "output"], ["--mode", "mode"],
    ["--settle-ms", "settleMs"], ["--timeout-ms", "timeoutMs"], ["--browser-executable", "executablePath"]
  ]);
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--help") return { help: true };
    const key = valueOptions.get(args[index]);
    if (!key || !args[index + 1] || args[index + 1].startsWith("--")) {
      throw new Error(`Unknown option or missing value: ${args[index]}. Use --help.`);
    }
    options[key] = args[++index];
  }
  const url = new URL(options.url);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Use an HTTP(S) URL without embedded credentials.");
  }
  if (!["auto", "vitals", "lighthouse"].includes(options.mode)) throw new Error("Invalid --mode.");
  for (const [key, min, max] of [["settleMs", 0, 30000], ["timeoutMs", 1000, 120000]]) {
    options[key] = Number(options[key]);
    if (!Number.isInteger(options[key]) || options[key] < min || options[key] > max) {
      throw new Error(`Invalid ${key}: expected an integer between ${min} and ${max}.`);
    }
  }
  options.url = url.href;
  options.output = resolve(options.output ?? `artifacts/lighthouse-baseline/${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  return options;
}

function installedLighthouse() {
  try {
    return createRequire(import.meta.url).resolve("lighthouse");
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") return null;
    throw error;
  }
}

async function availableDebuggingPort() {
  const server = createServer();
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", done);
  });
  const { port } = server.address();
  await new Promise((done, reject) => server.close((error) => error ? reject(error) : done()));
  return port;
}

async function vitalsReport(browser, options) {
  const context = await browser.newContext({ viewport: { width: 1365, height: 768 }, deviceScaleFactor: 1 });
  try {
    await context.addInitScript(() => {
      const supported = PerformanceObserver.supportedEntryTypes ?? [];
      const state = { lcpMs: null, cls: null, longTaskExcessMs: null, supportedEntryTypes: supported };
      const observers = [];
      let sessionStart = 0;
      let previousShift = 0;
      let sessionValue = 0;
      const handlers = {
        "largest-contentful-paint": (entry) => { state.lcpMs = entry.startTime; },
        "layout-shift": (entry) => {
          if (entry.hadRecentInput) return;
          if (entry.startTime - previousShift > 1000 || entry.startTime - sessionStart > 5000) {
            sessionStart = entry.startTime;
            sessionValue = 0;
          }
          sessionValue += entry.value;
          previousShift = entry.startTime;
          state.cls = Math.max(state.cls, sessionValue);
        },
        longtask: (entry) => { state.longTaskExcessMs += Math.max(0, entry.duration - 50); }
      };
      for (const [type, handle] of Object.entries(handlers)) {
        if (!supported.includes(type)) continue;
        const observer = new PerformanceObserver((list) => list.getEntries().forEach(handle));
        observer.observe({ type, buffered: true });
        observers.push({ observer, handle });
        if (type === "layout-shift") state.cls = 0;
        if (type === "longtask") state.longTaskExcessMs = 0;
      }
      window.__bioaxisBaselineSnapshot = () => {
        observers.forEach(({ observer, handle }) => observer.takeRecords().forEach(handle));
        const navigation = performance.getEntriesByType("navigation")[0];
        return {
          ...state,
          fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null,
          ttfbMs: navigation?.responseStart ? navigation.responseStart - navigation.startTime : null,
          domContentLoadedMs: navigation?.domContentLoadedEventEnd || null,
          loadMs: navigation?.loadEventEnd || null,
          observedUntilMs: performance.now(),
          inpMs: null
        };
      };
    });
    const page = await context.newPage();
    const response = await page.goto(options.url, { waitUntil: "load", timeout: options.timeoutMs });
    if (!response || !response.ok()) throw new Error(`Target navigation failed: HTTP ${response?.status() ?? "unavailable"}.`);
    await page.waitForTimeout(options.settleMs);
    const metrics = await page.evaluate(() => window.__bioaxisBaselineSnapshot());
    return {
      mode: "playwright-vitals-approximation",
      finalUrl: page.url(),
      status: response.status(),
      viewport: { width: 1365, height: 768, deviceScaleFactor: 1 },
      settleMs: options.settleMs,
      metrics,
      limitations: [
        "One headless desktop lab navigation with no CPU/network throttling; not field Core Web Vitals or a Lighthouse score.",
        "LCP and session-window CLS only cover the observation window; later content, interactions, cross-origin frames and page-lifetime changes are not covered.",
        "INP is null because no user interaction is performed; null metrics indicate an unsupported entry type or an unobserved value.",
        "longTaskExcessMs sums observed long-task duration above 50 ms; it is not Lighthouse Total Blocking Time.",
        "TTFB is navigation responseStart minus navigation startTime; timings vary with the target, cache, browser and machine."
      ]
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) {
    console.log(usage);
    return;
  }
  const lighthousePath = options.mode === "vitals" ? null : installedLighthouse();
  if (options.mode === "lighthouse" && !lighthousePath) {
    throw new Error("Lighthouse is not installed. Use --mode vitals or auto; no dependency was installed.");
  }
  const port = lighthousePath ? await availableDebuggingPort() : undefined;
  const browser = await chromium.launch({
    headless: true,
    executablePath: options.executablePath ?? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    ...(port ? { args: [`--remote-debugging-port=${port}`, "--remote-debugging-address=127.0.0.1"] } : {})
  });
  try {
    let report;
    if (lighthousePath) {
      const { default: lighthouse } = await import(pathToFileURL(lighthousePath).href);
      const result = await lighthouse(options.url, {
        port, hostname: "127.0.0.1", output: "json", logLevel: "error", maxWaitForLoad: options.timeoutMs,
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"]
      });
      if (!result?.lhr || result.lhr.runtimeError) throw new Error(`Lighthouse did not complete: ${result?.lhr?.runtimeError?.code ?? "missing report"}.`);
      report = {
        mode: "lighthouse",
        finalUrl: result.lhr.finalDisplayedUrl ?? result.lhr.finalUrl,
        lighthouseVersion: result.lhr.lighthouseVersion,
        categories: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, category.score])),
        lighthouse: result.lhr,
        limitations: ["A single Lighthouse lab run is not field Core Web Vitals; use the included configSettings when comparing baselines."]
      };
    } else {
      report = await vitalsReport(browser, options);
    }
    await mkdir(dirname(options.output), { recursive: true });
    await writeFile(options.output, `${JSON.stringify({
      schemaVersion: 1,
      capturedAt: new Date().toISOString(),
      requestedUrl: options.url,
      browserVersion: browser.version(),
      ...report
    }, null, 2)}\n`);
    console.log(`Saved ${report.mode} baseline: ${options.output}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`Performance baseline failed: ${error.message}`);
  process.exitCode = 1;
});

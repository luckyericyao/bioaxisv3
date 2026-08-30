import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? process.env.UNIT_TEST_BASE_URL ?? "http://localhost:3000";
const artifactDirectory = resolve(process.env.UNIT_TEST_ARTIFACT_DIR ?? "artifacts/scientific-units");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const navigationAttempts = ["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)
  ? 1
  : Math.max(1, Number.parseInt(process.env.UNIT_NAV_RETRIES ?? "3", 10) || 3);

const cases = [
  { slug: "microliter", unit: "200 µL", path: "/products?q=filtered%20200%20%C2%B5L%20tips" },
  { slug: "micrometer", unit: "0.22 µm", path: "/products?q=PES%200.22%20%C2%B5m" },
  { slug: "milliliter", unit: "1 mL", path: "/products?q=1%20mL%20serological%20pipettes" },
  { slug: "temperature", unit: "-80 °C", path: "/products?q=-80%20%C2%B0C" }
];

await mkdir(artifactDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const failures = [];

async function openRoute(page, path) {
  const url = new URL(path, baseUrl).toString();
  let lastError;

  for (let attempt = 1; attempt <= navigationAttempts; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < navigationAttempts) {
        await page.waitForTimeout(750 * attempt);
      }
    }
  }

  const reason = lastError instanceof Error ? `${lastError.name}: ${lastError.message}` : "unknown navigation error";
  throw new Error(`Navigation failed after ${navigationAttempts} attempts: ${url} (${reason})`, { cause: lastError });
}

try {
  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await openRoute(page, testCase.path);

    const match = await page.evaluate((unit) => {
      const elements = [...document.querySelectorAll("body *")].filter((element) => {
        const text = element.textContent?.trim() ?? "";
        const style = window.getComputedStyle(element);
        return text.includes(unit) && style.display !== "none" && style.visibility !== "hidden";
      });
      const deepest = elements.find((element) => ![...element.children].some((child) => child.textContent?.includes(unit))) ?? elements.at(-1);

      if (!deepest) return null;

      deepest.setAttribute("data-scientific-unit-probe", "true");
      const style = window.getComputedStyle(deepest);
      return {
        text: deepest.textContent?.trim() ?? "",
        textTransform: style.textTransform,
        hiddenFromAccessibility: Boolean(deepest.closest('[aria-hidden="true"]'))
      };
    }, testCase.unit);

    const accessibilitySnapshot = match
      ? await page.locator('[data-scientific-unit-probe="true"]').ariaSnapshot().catch(() => "")
      : "";

    if (!match) {
      failures.push(`${testCase.unit}: exact DOM text was not visible`);
    } else if (match.textTransform === "uppercase") {
      failures.push(`${testCase.unit}: visible text is transformed to uppercase`);
    } else if (!match.text.includes(testCase.unit)) {
      failures.push(`${testCase.unit}: visible and DOM text diverged`);
    } else if (match.hiddenFromAccessibility) {
      failures.push(`${testCase.unit}: visible unit is hidden from the accessibility tree`);
    } else if (!accessibilitySnapshot.includes(testCase.unit)) {
      failures.push(`${testCase.unit}: screen-reader text does not preserve the exact scientific unit`);
    }

    await page.screenshot({ path: resolve(artifactDirectory, `${testCase.slug}-390x844.png`), fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error("Scientific unit regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Scientific unit regression passed for ${baseUrl}`);
console.log("- exact DOM and visible text: µL, µm, mL, °C");
console.log("- accessibility-tree text: exact units preserved and exposed");
console.log("- computed text-transform: not uppercase");
console.log(`- screenshots: ${artifactDirectory}`);

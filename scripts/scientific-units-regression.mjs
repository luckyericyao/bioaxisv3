import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? process.env.UNIT_TEST_BASE_URL ?? "http://localhost:3000";
const artifactDirectory = resolve(process.env.UNIT_TEST_ARTIFACT_DIR ?? "artifacts/scientific-units");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

const cases = [
  { slug: "microliter", unit: "200 µL", path: "/products?q=filtered%20200%20%C2%B5L%20tips" },
  { slug: "micrometer", unit: "0.22 µm", path: "/products?q=PES%200.22%20%C2%B5m" },
  { slug: "milliliter", unit: "1 mL", path: "/products?q=1%20mL%20serological%20pipettes" },
  { slug: "temperature", unit: "-80 °C", path: "/products?q=-80%20%C2%B0C" }
];

await mkdir(artifactDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const failures = [];

try {
  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await page.goto(new URL(testCase.path, baseUrl).toString(), { waitUntil: "networkidle" });

    const match = await page.evaluate((unit) => {
      const elements = [...document.querySelectorAll("body *")].filter((element) => {
        const text = element.textContent?.trim() ?? "";
        const style = window.getComputedStyle(element);
        return text.includes(unit) && style.display !== "none" && style.visibility !== "hidden";
      });
      const deepest = elements.find((element) => ![...element.children].some((child) => child.textContent?.includes(unit))) ?? elements.at(-1);

      if (!deepest) return null;

      const style = window.getComputedStyle(deepest);
      return {
        text: deepest.textContent?.trim() ?? "",
        textTransform: style.textTransform,
        ariaLabel: deepest.getAttribute("aria-label")
      };
    }, testCase.unit);

    if (!match) {
      failures.push(`${testCase.unit}: exact DOM text was not visible`);
    } else if (match.textTransform === "uppercase") {
      failures.push(`${testCase.unit}: visible text is transformed to uppercase`);
    } else if (!match.text.includes(testCase.unit)) {
      failures.push(`${testCase.unit}: visible and DOM text diverged`);
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
console.log("- computed text-transform: not uppercase");
console.log(`- screenshots: ${artifactDirectory}`);

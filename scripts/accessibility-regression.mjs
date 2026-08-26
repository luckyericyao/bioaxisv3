import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? process.env.A11Y_TEST_BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.goto(new URL("/request-quote?requestType=quote", baseUrl).toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });

  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    href: document.activeElement?.getAttribute("href")
  }));
  check(firstFocus.text === "Skip to main content" && firstFocus.href === "#main-content", "skip link is not the first keyboard target");
  await page.keyboard.press("Enter");
  check((await page.evaluate(() => document.activeElement?.id)) === "main-content", "skip link did not move focus to main content");

  const semantics = await page.evaluate(() => ({
    mainCount: document.querySelectorAll("main#main-content").length,
    navLabels: [...document.querySelectorAll("nav")].map((node) => node.getAttribute("aria-label")).filter(Boolean),
    emailLabel: document.querySelector('label[for="sourcing-email"]')?.textContent?.trim(),
    errorLiveRegion: Boolean(document.querySelector('[role="alert"], [aria-live="polite"]')),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  check(semantics.mainCount === 1, "page must expose exactly one main landmark");
  check(semantics.navLabels.length > 0, "navigation landmarks need accessible labels");
  check(Boolean(semantics.emailLabel), "RFQ email input is missing its visible label");
  check(semantics.errorLiveRegion, "RFQ status is not exposed through an alert or live region");
  check(!semantics.horizontalOverflow, "390px RFQ page has horizontal overflow");

  const undersized = await page.evaluate(() =>
    [...document.querySelectorAll("button, summary, input, select, textarea, a.inline-flex, a.flex")]
      .filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && rect.height < 43.5;
      })
      .slice(0, 12)
      .map((node) => `${node.tagName.toLowerCase()}:${node.textContent?.trim().slice(0, 40) || node.getAttribute("aria-label") || node.getAttribute("name")}=${node.getBoundingClientRect().height.toFixed(1)}px`)
  );
  check(undersized.length === 0, `mobile targets below 44px: ${undersized.join(", ")}`);

  await page.setViewportSize({ width: 320, height: 640 });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });
  const narrowLayout = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    characterWrap: [...document.querySelectorAll('[data-product-context-summary="true"] dd')].some((node) => {
      const text = node.textContent?.trim() ?? "";
      const rect = node.getBoundingClientRect();
      const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight);
      return text.length > 12 && rect.height / lineHeight > text.length / 3;
    })
  }));
  check(!narrowLayout.horizontalOverflow, "320px RFQ page has horizontal overflow");
  check(!narrowLayout.characterWrap, "320px context value wraps approximately one character per line");

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(new URL("/products", baseUrl).toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await desktop.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });
  await desktop.waitForTimeout(750);
  const primaryNavigation = desktop.getByRole("navigation", { name: "Primary navigation" });
  await primaryNavigation.getByRole("link", { name: "Products", exact: true }).focus();
  const desktopSearchLink = primaryNavigation.getByRole("link", { name: "Search all products" });
  await desktopSearchLink.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  check(await desktopSearchLink.isVisible(), "desktop Products menu does not open from keyboard focus");
  await desktop.keyboard.press("Escape");
  check(!(await primaryNavigation.getByRole("link", { name: "Search all products" }).isVisible().catch(() => false)), "Escape does not close the Products menu");
  await desktop.close();
  await page.close();
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error("Accessibility regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Accessibility regression passed for ${baseUrl}`);
console.log("- skip link and landmarks");
console.log("- keyboard focus and Escape behavior");
console.log("- RFQ labels and live status");
console.log("- 44px mobile controls and 320px overflow/wrapping");

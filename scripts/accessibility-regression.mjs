import axe from "axe-core";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? process.env.A11Y_TEST_BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
const failures = [];

const criticalRoutes = [
  { label: "home", path: "/" },
  { label: "search", path: "/products?q=filtered%20200%20%C2%B5L%20tips" },
  {
    label: "product template",
    path: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips"
  },
  {
    label: "RFQ",
    path: "/request-quote?requestType=quote&segment=Liquid%20Handling&category=Pipette%20Tips&family=Filtered%20Pipette%20Tips&product=Filtered%20200%20%C2%B5L%20Pipette%20Tips"
  }
];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function openRoute(page, path) {
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(500);
}

async function auditWithAxe(page, label) {
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
      }
    });

    return result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.slice(0, 4).map((node) => node.target.join(" "))
    }));
  });

  for (const violation of violations) {
    failures.push(
      `${label}: axe ${violation.id} (${violation.impact ?? "unknown"}) ${violation.help}; ${violation.targets.join(", ")}`
    );
  }
}

async function checkReflow(page, label, width, zoomLabel) {
  await page.setViewportSize({ width, height: 900 });
  const result = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    focusedTarget: (() => {
      const target = [...document.querySelectorAll("main a[href], main button:not([disabled]), main input:not([disabled])")].find((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      if (!(target instanceof HTMLElement)) return { clipped: false, label: "none" };
      document.documentElement.style.scrollBehavior = "auto";
      const initialRect = target.getBoundingClientRect();
      const targetTop = initialRect.top + scrollY - Math.max(0, (innerHeight - initialRect.height) / 2);
      window.scrollTo(0, Math.max(0, targetTop));
      target.focus();
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const rect = target.getBoundingClientRect();
      return {
        clipped: rect.top < headerBottom - 1 || rect.bottom > innerHeight + 1,
        label: `${target.tagName.toLowerCase()}#${target.id || "none"} top=${rect.top.toFixed(1)} bottom=${rect.bottom.toFixed(1)} header=${headerBottom.toFixed(1)}`
      };
    })()
  }));

  check(
    !result.horizontalOverflow,
    `${label}: ${zoomLabel} reflow has horizontal overflow (${result.scrollWidth}px > ${result.clientWidth}px)`
  );
  check(
    !result.focusedTarget.clipped,
    `${label}: ${zoomLabel} focused control is clipped by sticky or viewport content (${result.focusedTarget.label})`
  );
}

async function checkTextSpacing(page, label) {
  await page.addStyleTag({
    content: `
      * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }
    `
  });

  const result = await page.evaluate(() => {
    const visibleTextNodes = [...document.querySelectorAll("body *")].filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        node.children.length === 0 &&
        !node.closest(".sr-only, [aria-hidden='true']") &&
        Boolean(node.textContent?.trim()) &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      );
    });

    const clipped = visibleTextNodes
      .filter((node) => {
        const style = getComputedStyle(node);
        const clipsX = ["hidden", "clip"].includes(style.overflowX) && node.scrollWidth > node.clientWidth + 1;
        const clipsY = ["hidden", "clip"].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 1;
        return clipsX || clipsY;
      })
      .slice(0, 8)
      .map((node) => `${node.tagName.toLowerCase()}:${node.textContent?.trim().slice(0, 50)}`);

    return {
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      clipped
    };
  });

  check(!result.horizontalOverflow, `${label}: WCAG text-spacing overrides create horizontal overflow`);
  check(result.clipped.length === 0, `${label}: WCAG text-spacing overrides clip text (${result.clipped.join(", ")})`);
}

async function checkRfqStateAnnouncements() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  let submissionCount = 0;

  await page.route("**/api/rfq", async (route) => {
    submissionCount += 1;

    if (submissionCount === 1) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Your request was not stored. Your form is still intact—please retry using this reference.",
          requestId: "BIOAXIS-A11Y-FAIL"
        })
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        mode: "durable-queue",
        requestId: "BIOAXIS-A11Y-TEST",
        referenceId: "BIOAXIS-A11Y-TEST",
        message: "Request received and stored for BioAxis review."
      })
    });
  });

  await openRoute(page, "/request-quote?requestType=quote");
  const email = page.getByLabel("Email *", { exact: true });
  const submit = page.getByRole("button", { name: "Send sourcing request" });
  await email.fill("a11y-regression@example.com");
  check(await submit.isEnabled(), "RFQ state test cannot submit when Turnstile is unavailable in local regression mode");

  if (await submit.isEnabled()) {
    await submit.click();
    const error = page.getByRole("alert");
    await error.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
    check(await error.isVisible().catch(() => false), "RFQ failure is not exposed as an alert");
    check((await email.inputValue()) === "a11y-regression@example.com", "RFQ failure clears the customer email instead of preserving the form");

    await submit.click();
    const reference = page.getByText("Reference: BIOAXIS-A11Y-TEST", { exact: true });
    await reference.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
    check(await reference.isVisible().catch(() => false), "RFQ success does not expose the durable request reference");
    check(
      await reference.evaluate((node) => node.closest('[role="status"]')?.getAttribute("aria-live") === "polite").catch(() => false),
      "RFQ success reference is not inside a polite status region"
    );
  }

  await page.close();
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await openRoute(page, "/request-quote?requestType=quote");

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
    statusLiveRegion: Boolean(document.querySelector('[role="alert"], [role="status"], [aria-live="polite"]')),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  check(semantics.mainCount === 1, "page must expose exactly one main landmark");
  check(semantics.navLabels.length > 0, "navigation landmarks need accessible labels");
  check(Boolean(semantics.emailLabel), "RFQ email input is missing its visible label");
  check(semantics.statusLiveRegion, "RFQ status is not exposed through an alert or live region");
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
    }),
    sourcePathVisible: document.body.innerText.includes("/products/liquid-handling/")
  }));
  check(!narrowLayout.horizontalOverflow, "320px RFQ page has horizontal overflow");
  check(!narrowLayout.characterWrap, "320px context value wraps approximately one character per line");
  check(!narrowLayout.sourcePathVisible, "320px RFQ exposes a long source path");
  await page.close();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await openRoute(desktop, "/products");
  const primaryNavigation = desktop.getByRole("navigation", { name: "Primary navigation" });
  await primaryNavigation.getByRole("link", { name: "Products", exact: true }).focus();
  const desktopSearchLink = primaryNavigation.getByRole("link", { name: "Search all products" });
  await desktopSearchLink.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  check(await desktopSearchLink.isVisible(), "desktop Products menu does not open from keyboard focus");
  await desktop.keyboard.press("Escape");
  check(!(await desktopSearchLink.isVisible().catch(() => false)), "Escape does not close the Products menu");
  await desktop.close();

  if (["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)) {
    await checkRfqStateAnnouncements();
  }

  for (const route of criticalRoutes) {
    const auditPage = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await openRoute(auditPage, route.path);
    await auditWithAxe(auditPage, `${route.label} mobile`);
    await checkTextSpacing(auditPage, `${route.label} mobile`);
    await auditPage.close();

    const reflowPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openRoute(reflowPage, route.path);
    await checkReflow(reflowPage, route.label, 640, "200% zoom equivalent");
    await checkReflow(reflowPage, route.label, 320, "400% zoom equivalent");
    await reflowPage.close();
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error("Accessibility regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Accessibility regression passed for ${baseUrl}`);
console.log("- skip link, landmarks, labels, and live RFQ status");
console.log("- keyboard focus, Products menu, and Escape behavior");
console.log("- 44px mobile controls, hidden source path, and 320px wrapping");
console.log("- preserved form failure alert and polite success/reference announcement");
console.log("- axe-core WCAG A/AA semantics and color contrast on four critical routes");
console.log("- 200%/400% zoom-equivalent reflow and sticky-focus visibility");
console.log("- WCAG text-spacing overrides without overflow or clipped text");

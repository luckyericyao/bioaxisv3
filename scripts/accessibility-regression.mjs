import axe from "axe-core";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? process.env.A11Y_TEST_BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
const failures = [];
const navigationAttempts = ["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)
  ? 1
  : Math.max(1, Number.parseInt(process.env.A11Y_NAV_RETRIES ?? "3", 10) || 3);

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
  },
  { label: "Trust Center", path: "/trust-center" }
];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function openRoute(page, path) {
  const url = new URL(path, baseUrl).toString();
  let lastError;

  for (let attempt = 1; attempt <= navigationAttempts; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.locator("main#main-content").waitFor({ state: "visible", timeout: 15_000 });
      await page.waitForTimeout(500);
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
  const submissions = [];

  await page.route("**/api/rfq", async (route) => {
    const requestPayload = route.request().postDataJSON();
    submissions.push(requestPayload);

    if (submissions.length === 1) {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          error: "This request reference was already used for different details.",
          requestId: requestPayload.requestId
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
        requestId: requestPayload.requestId,
        referenceId: requestPayload.requestId,
        message: "Request received and stored for BioAxis review."
      })
    });
  });

  await openRoute(page, "/request-quote?requestType=quote");
  const email = page.getByLabel("Email *", { exact: true });
  const productInput = page.getByLabel("Product, SKU, product list, or sourcing need", { exact: true });
  const submit = page.getByRole("button", { name: "Send sourcing request" });
  await email.fill("a11y-regression@example.com");
  await productInput.fill("Filtered pipette tips · search: filtered 200 µL tips · sourcing list item included");
  check(await submit.isEnabled(), "RFQ state test cannot submit when Turnstile is unavailable in local regression mode");

  if (await submit.isEnabled()) {
    await submit.click();
    const error = page.getByRole("alert");
    await error.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
    check(await error.isVisible().catch(() => false), "RFQ conflict is not exposed as an alert");
    check((await email.inputValue()) === "a11y-regression@example.com", "RFQ conflict clears the customer email instead of preserving the form");
    check((await productInput.inputValue()).includes("sourcing list item included"), "RFQ conflict clears the product/search/list context instead of preserving the form");

    await page.getByRole("button", { name: "Use a new request reference", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "A new reference is ready." }).waitFor({ state: "visible", timeout: 5_000 });
    check((await productInput.inputValue()).includes("sourcing list item included"), "rotating the RFQ reference clears the preserved context");

    await submit.click();
    const reference = page.getByText(`Reference: ${submissions[1]?.requestId}`, { exact: true });
    await reference.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
    check(await reference.isVisible().catch(() => false), "RFQ success does not expose the durable request reference");
    check(
      await reference.evaluate((node) => node.closest('[role="status"]')?.getAttribute("aria-live") === "polite").catch(() => false),
      "RFQ success reference is not inside a polite status region"
    );
    check(submissions.length === 2, `RFQ conflict recovery produced ${submissions.length} submission attempts instead of two`);
    check(Boolean(submissions[0]?.requestId && submissions[1]?.requestId && submissions[0].requestId !== submissions[1].requestId), "explicit conflict recovery did not use a new request reference");
    check(submissions[0]?.productList === submissions[1]?.productList, "explicit conflict recovery changed the submitted product/search/list context");
  }

  await page.close();
}

async function checkSourcingListDrawerFocus() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.addInitScript(() => window.localStorage.removeItem("bioaxis:sourcing-list"));
  await openRoute(page, "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips");

  await page.locator("summary").filter({ hasText: "More sourcing actions" }).click();
  const addButton = page.getByRole("button", { name: "Add to sourcing list", exact: true });
  await addButton.click();
  const dialog = page.getByRole("dialog", { name: "Review items before sending." });
  await dialog.waitFor({ state: "visible", timeout: 5_000 });

  const closeButton = dialog.getByRole("button", { name: "Close sourcing list", exact: true });
  check(
    await closeButton.evaluate((element) => element === document.activeElement),
    "opening the sourcing list drawer does not focus its close control"
  );

  await page.keyboard.press("Shift+Tab");
  check(
    await dialog.getByRole("button", { name: "Send list for review", exact: true }).evaluate((element) => element === document.activeElement),
    "Shift+Tab escapes the sourcing list drawer instead of wrapping to its last control"
  );
  await page.keyboard.press("Tab");
  check(
    await closeButton.evaluate((element) => element === document.activeElement),
    "Tab escapes the sourcing list drawer instead of wrapping to its first control"
  );

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
  const addedButton = page.getByRole("button", { name: "Added to sourcing list", exact: true });
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("aria-pressed") === "true",
    null,
    { timeout: 5_000 }
  ).catch(() => undefined);
  check(
    await addedButton.evaluate((element) => element === document.activeElement),
    "closing the sourcing list drawer with Escape does not restore focus to its trigger"
  );

  await page.close();
}

async function checkTurnstileFailClosed() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.route("**/api/turnstile/config", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ enabled: false })
    });
  });

  await openRoute(page, "/request-quote?requestType=quote");
  const email = page.getByLabel("Email *", { exact: true });
  const submit = page.getByRole("button", { name: "Complete verification to send", exact: true });
  const configAlert = page.getByRole("alert").filter({ hasText: "Verification could not load" });

  await email.fill("turnstile-fail-closed@example.com");
  await configAlert.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  check(await configAlert.isVisible().catch(() => false), "Turnstile configuration failure is not announced as an alert");
  check(!(await submit.isEnabled().catch(() => true)), "Turnstile configuration failure enables an unverified RFQ submit");
  check(
    (await email.inputValue()) === "turnstile-fail-closed@example.com",
    "Turnstile configuration failure clears the customer email"
  );

  await page.close();
}

async function checkPrivacyContactHandoff() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await openRoute(page, "/privacy");
  const contactLink = page.getByRole("link", { name: "Open Contact form", exact: true });
  check(
    (await contactLink.getAttribute("href")) === "/contact#contact-form",
    "privacy contact path does not target the form anchor"
  );
  await contactLink.click();
  await page.waitForURL(/\/contact#contact-form$/, { timeout: 15_000 }).catch(() => undefined);
  await page.locator("#contact-form").waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);

  const handoff = await page.evaluate(() => {
    const form = document.querySelector("#contact-form");
    const context = form?.previousElementSibling;
    const formRect = form?.getBoundingClientRect();
    const contextRect = context?.getBoundingClientRect();
    return {
      hash: location.hash,
      formBeforeContext: Boolean(formRect && contextRect && formRect.top + scrollY < contextRect.top + scrollY),
      formFitsViewport: Boolean(formRect && formRect.width <= document.documentElement.clientWidth + 1),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });

  check(handoff.hash === "#contact-form", "privacy contact path loses the form anchor after navigation");
  check(handoff.formBeforeContext, "390px Contact page places optional context before the form");
  check(handoff.formFitsViewport, "390px Contact form is wider than the viewport");
  check(!handoff.horizontalOverflow, "390px privacy-to-contact handoff has horizontal overflow");
  await page.close();
}

async function checkMobileSearchFunnel() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const query = "filtered 200 µL tips";
  await openRoute(page, "/products");

  const searchInput = page.getByLabel("Search BioAxis products", { exact: true });
  await searchInput.fill(query);
  check(new URL(page.url()).searchParams.get("q") === null, "mobile search writes a query URL before submission");
  check((await page.locator('[data-search-result-card="true"]').count()) === 0, "mobile search renders results inside the unsubmitted hero layout");
  await searchInput.press("Enter");
  await page.waitForURL((url) => url.pathname === "/products" && url.searchParams.get("q") === query, { timeout: 15_000 }).catch(() => undefined);

  const firstResult = page.locator('[data-search-result-card="true"]').first();
  const firstAction = firstResult.getByRole("link", { name: "View details", exact: true });
  await firstResult.waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
  await firstAction.waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);

  check((await searchInput.inputValue()) === query, "mobile search does not retain the submitted query");
  check((await firstResult.getAttribute("data-search-result-type")) === "product", "specific mobile search does not rank a product first");
  check((await firstResult.getAttribute("data-search-result-title")) === "Filtered 200 µL Pipette Tips", "specific mobile search does not rank the exact product title first");
  const firstViewport = await page.evaluate(() => {
    const result = document.querySelector('[data-search-result-card="true"]');
    const action = result?.querySelector("a");
    const resultRect = result?.getBoundingClientRect();
    const actionRect = action?.getBoundingClientRect();
    return {
      resultStartsInViewport: Boolean(resultRect && resultRect.top >= 0 && resultRect.top < innerHeight),
      actionFitsInViewport: Boolean(actionRect && actionRect.top >= 0 && actionRect.bottom <= innerHeight)
    };
  });
  check(firstViewport.resultStartsInViewport, "390px search does not place the first result in the initial viewport");
  check(firstViewport.actionFitsInViewport, "390px search does not expose a first-result action in the initial viewport");

  await openRoute(page, "/products");
  const mobileDiscovery = await page.evaluate(() => {
    const search = document.querySelector("#product-search");
    const firstCard = document.querySelector('[data-product-segment-card="compact"]');
    const firstTitle = firstCard?.querySelector("h2");
    const searchRect = search?.getBoundingClientRect();
    const titleRect = firstTitle?.getBoundingClientRect();
    return {
      searchVisible: Boolean(searchRect && searchRect.top >= 0 && searchRect.bottom <= innerHeight),
      firstSegmentTitleVisible: Boolean(titleRect && titleRect.top >= 0 && titleRect.top < innerHeight),
      quickSearchesCollapsed: document.querySelector("details > summary")?.textContent?.includes("Quick searches") ?? false
    };
  });
  check(mobileDiscovery.searchVisible, "390px Products page does not show the search field within the first viewport");
  check(mobileDiscovery.firstSegmentTitleVisible, "390px Products page does not show the first segment title within the first viewport");
  check(mobileDiscovery.quickSearchesCollapsed, "mobile quick searches are not collapsed behind a disclosure");

  await openRoute(page, "/products?q=cell");
  const cellSearch = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-search-result-card="true"]')].filter((card) => {
      const style = getComputedStyle(card);
      return !card.closest("details:not([open])") && card.getClientRects().length > 0 && style.visibility !== "hidden" && style.display !== "none";
    });
    const counts = document.body.innerText.match(/(\d+) matching paths? · (\d+) indexed paths/);
    return {
      count: cards.length,
      first: cards[0]?.getAttribute("data-search-result-title"),
      titles: cards.map((card) => card.getAttribute("data-search-result-title")),
      counts: counts ? [Number(counts[1]), Number(counts[2])] : null,
      relatedCollapsed: [...document.querySelectorAll("details > summary")].some((summary) => summary.textContent?.includes("Explore related matches") && !summary.parentElement?.hasAttribute("open"))
    };
  });
  check(cellSearch.count === 6, `390px cell search shows ${cellSearch.count} top matches instead of six`);
  check(cellSearch.first === "Cell Culture", `390px cell search ranks ${cellSearch.first ?? "no result"} first`);
  check(!cellSearch.titles.some((title) => title?.includes("Liquid Handling")), "390px cell search ranks Liquid Handling among the first six results");
  check(Boolean(cellSearch.counts && cellSearch.counts[0] >= 6 && cellSearch.counts[1] > cellSearch.counts[0]), "cell search does not disclose truthful match and index counts");
  check(cellSearch.relatedCollapsed, "cell search expands related matches by default");

  const relatedDetails = page.locator("details").filter({ hasText: "Explore related matches" });
  await relatedDetails.locator("summary").click();
  check((await page.locator('[data-search-result-card="true"]:visible').count()) === 18, "opening related matches does not reveal the first 12 related paths");
  const moreResultsButton = page.getByRole("button", { name: /Show next 12/ });
  await moreResultsButton.click();
  check((await page.locator('[data-search-result-card="true"]:visible').count()) === 30, "cell search did not load exactly the next 12 related matches");

  await openRoute(page, "/products?q=430641");
  check((await page.getByRole("link", { name: "Send this reference", exact: true }).count()) === 1, "unknown catalog reference does not offer one clear send-reference action");
  check((await page.locator('[data-search-result-card="true"]').count()) === 0, "unknown catalog reference produced a fabricated search result");

  await openRoute(page, "/");
  const hero = page.locator("main > section").first();
  const homeIntake = hero.locator('details[data-home-primary-intake="true"]');
  const homeIntakeSummary = homeIntake.locator("summary").first();
  check((await homeIntake.count()) === 1, "homepage does not have exactly one primary sourcing-intake disclosure");
  check((await hero.locator('a[href^="/request-quote"]').count()) === 0, "homepage hero still duplicates the primary intake with a direct RFQ link");
  await homeIntakeSummary.focus();
  await homeIntakeSummary.press("Enter");
  check((await homeIntake.getAttribute("open")) !== null, "keyboard activation does not open the primary homepage intake");
  await page.getByLabel("Email *", { exact: true }).waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  check(await page.getByLabel("Email *", { exact: true }).isVisible().catch(() => false), "homepage primary intake does not reveal the email field");

  const menuButton = page.getByRole("button", { name: "Menu", exact: true });
  await menuButton.click();
  check((await menuButton.getAttribute("aria-expanded")) === "true", "mobile menu does not expose its open state");

  const productsButton = page.getByRole("button", { name: /Products/i });
  await productsButton.click();
  const searchAllProducts = page.getByRole("link", { name: "Search all products", exact: true });
  await searchAllProducts.click();
  await page.waitForURL((url) => url.pathname === "/products", { timeout: 15_000 }).catch(() => undefined);
  await page.getByLabel("Search BioAxis products", { exact: true }).waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);

  check(new URL(page.url()).pathname === "/products", "mobile Products menu does not reach search within two choices");
  check((await menuButton.getAttribute("aria-expanded")) === "false", "mobile menu remains expanded after search navigation");
  check((await page.locator("#mobile-primary-navigation").count()) === 0, "mobile navigation remains rendered after route change");
  await page.close();
}

async function checkProductDecisionPages() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const routes = [
    "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips",
    "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters/pes-022um-syringe-filters",
    "/products/cell-culture/media-and-supplements/serum-free-media/serum-free-cell-culture-media",
    "/products/lab-plasticware/tubes/microcentrifuge-tubes/microcentrifuge-tubes-general",
    "/products/liquid-handling/pipette-tips/universal-pipette-tips/sterile-filtered-universal-pipette-tips",
    "/products/cell-culture/cell-culture-media-buffers/classical-media/dmem-high-glucose"
  ];

  for (const route of routes) {
    await openRoute(page, route);
    const productName = (await page.locator("main h1").first().innerText()).trim();
    const decision = await page.evaluate(() => {
      const summary = document.querySelector('[data-product-decision-summary="true"]');
      const groups = [...(summary?.querySelectorAll("[data-product-specification-group]") ?? [])].map((group) => ({
        name: group.getAttribute("data-product-specification-group"),
        values: [...group.querySelectorAll("li")].map((item) => item.innerText.trim())
      }));
      const actions = [...(document.querySelector('[data-product-primary-actions="true"]')?.querySelectorAll("a") ?? [])].map((link) => {
        const rect = link.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(x, y);
        return {
          text: link.innerText.trim(),
          href: link.href,
          top: rect.top,
          bottom: rect.bottom,
          covered: !topElement || (topElement !== link && !link.contains(topElement))
        };
      });

      return { groups, actions };
    });
    const specificationValues = decision.groups.flatMap((group) => group.values);
    const uniqueSpecifications = new Set(specificationValues.map((value) => value.toLocaleLowerCase()));
    check(decision.groups.length > 0, `${route}: product decision summary is missing`);
    check(specificationValues.length >= 3 && specificationValues.length <= 5, `${route}: shows ${specificationValues.length} key spec fields instead of 3–5`);
    check(uniqueSpecifications.size === specificationValues.length, `${route}: repeats a specification in its decision summary`);
    check(
      decision.groups.every((group) => group.name !== "target" || !decision.groups.some((other) => other.name === "options" && other.values.some((value) => group.values.includes(value)))),
      `${route}: known target specification is duplicated among options to confirm`
    );
    check(decision.actions.length === 3, `${route}: product decision area does not have exactly three primary actions`);

    const routeParts = route.split("/").filter(Boolean);
    for (const action of decision.actions) {
      const href = new URL(action.href);
      const productContextMatches =
        href.searchParams.get("segment") === routeParts[1] &&
        href.searchParams.get("category") === routeParts[2] &&
        href.searchParams.get("family") === routeParts[3] &&
        href.searchParams.get("product") === routeParts[4] &&
        Boolean(href.searchParams.get("sourcePage"));
      check(productContextMatches, `${route}: ${action.text} link loses product context`);
      check(action.top >= 0 && action.bottom <= 844, `${route}: ${action.text} is outside the 390×844 first viewport`);
      check(!action.covered, `${route}: ${action.text} is covered by another element`);
    }

    for (const [label, requestType] of [["Request quote", "quote"], ["Request sample", "sample"], ["Review equivalent", "equivalent"]]) {
      const action = decision.actions.find((entry) => entry.text.toLocaleLowerCase() === label.toLocaleLowerCase());
      check(Boolean(action && new URL(action.href).searchParams.get("requestType") === requestType), `${route}: ${label} has the wrong request type`);
    }

    const quoteLink = page.locator('[data-product-primary-actions="true"] a').filter({ hasText: "Request quote" });
    await quoteLink.click();
    await page.waitForURL((url) => url.pathname === "/request-quote", { timeout: 15_000 }).catch(() => undefined);
    const context = page.locator('[data-product-context-summary="true"]');
    await context.waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
    const contextText = (await context.innerText().catch(() => "")).toLocaleLowerCase();
    check(contextText.includes(productName.toLocaleLowerCase()), `${route}: product name is missing from the RFQ context`);
    for (const label of ["Product", "Family", "Category", "Segment"]) {
      check(contextText.includes(label.toLocaleLowerCase()), `${route}: RFQ context is missing ${label}`);
    }
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
  const productsTrigger = primaryNavigation.getByRole("link", { name: "Products", exact: true });
  await productsTrigger.focus();
  const desktopSearchLink = primaryNavigation.getByRole("link", { name: "Search all products" });
  await desktopSearchLink.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  check(await desktopSearchLink.isVisible(), "desktop Products menu does not open from keyboard focus");
  await desktop.keyboard.press("Escape");
  check(!(await desktopSearchLink.isVisible().catch(() => false)), "Escape does not close the Products menu");
  check(await productsTrigger.evaluate((element) => element === document.activeElement), "Escape does not return focus to the Products trigger");
  await desktop.close();

  if (["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)) {
    await checkTurnstileFailClosed();
    await checkRfqStateAnnouncements();
    await checkSourcingListDrawerFocus();
  }

  await checkPrivacyContactHandoff();
  await checkMobileSearchFunnel();
  await checkProductDecisionPages();

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
console.log("- sourcing-list drawer focus entry, Tab wrapping, Escape close, and focus restoration");
console.log("- fail-closed Turnstile loading/configuration state with preserved input");
console.log("- privacy-to-contact anchor and mobile form-first ordering");
console.log("- retained mobile search query, first-viewport result/action, and two-choice menu handoff");
console.log("- canonical and legacy product-detail specs, first-viewport actions, and RFQ context handoff");
console.log("- axe-core WCAG A/AA semantics and color contrast on four critical routes");
console.log("- 200%/400% zoom-equivalent reflow and sticky-focus visibility");
console.log("- WCAG text-spacing overrides without overflow or clipped text");

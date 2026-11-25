import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3014";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname), "Fault injection is local-only");
const output = path.resolve(process.env.BUYER_SESSION_QA_DIR ?? "artifacts/buyer-session-qa");
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const failures = [];
const evidence = [];
const productPath = "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips";
await mkdir(output, { recursive: true });

const confirmedReceipt = { ok: true, mode: "durable-queue", referenceId: "QA-SESSION-LOCAL-ONLY", message: "Request received and stored for BioAxis review." };

async function scenario(name, init, run, reply = () => confirmedReceipt) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  const submissions = [];
  page.on("pageerror", (error) => errors.push(error.message));
  if (init) await page.addInitScript(init);
  await page.route("**/api/turnstile/config", (route) => route.fulfill({ json: { enabled: false } }));
  await page.route("**/api/rfq", async (route) => {
    submissions.push(route.request().postDataJSON());
    const response = await reply(submissions);
    return route.fulfill({ status: response.status ?? 200, json: response });
  });
  try {
    await run(page, submissions);
    assert.deepEqual(errors, [], "No uncaught browser errors");
    evidence.push({ name, result: "passed", localMockSubmissions: submissions.length });
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    evidence.push({ name, result: "failed", errors, message: error.message });
  } finally {
    await page.screenshot({ path: path.join(output, `${name}.png`) }).catch(() => {});
    await context.close();
  }
}

async function checkConfirmation(page) {
  const reference = page.getByText("Reference: QA-SESSION-LOCAL-ONLY", { exact: true });
  await reference.waitFor();
  await page.waitForFunction(() => document.activeElement?.textContent.trim() === "Start another request");
  const titleBounds = await page.getByRole("heading", { name: "Request received", exact: true }).boundingBox();
  const referenceBounds = await reference.boundingBox();
  assert.ok(titleBounds.y >= 64 && referenceBounds.y + referenceBounds.height <= 844, "Confirmation title and reference are visible together after submission");
}

async function waitForFilters(page, values, targetCount) {
  await page.waitForFunction(({ values, targetCount }) =>
    Object.entries(values).every(([name, value]) => document.querySelector(`select[name="${name}"]`)?.value === value)
    && document.querySelectorAll('[data-sourcing-target="true"]').length === targetCount,
  { values, targetCount });
}

function seedTwoSourcingItems() {
  localStorage.setItem("bioaxis:sourcing-list", JSON.stringify([
    { id: "qa-tabs-tips", title: "QA tabs pipette tips", href: "/products/liquid-handling", quantity: "12 racks" },
    { id: "qa-tabs-plates", title: "QA tabs PCR plates", href: "/products/lab-plasticware", quantity: "2 cases" }
  ]));
}

function readSavedRows(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list") || "[]"));
}

function includeSavedList(page) {
  return page.getByRole("checkbox", { name: "Include saved sourcing list", exact: true });
}

async function editSavedList(page) {
  await page.getByRole("button", { name: "Edit list", exact: true }).click();
  return page.getByRole("dialog");
}

async function sendSelectedList(page, submissions) {
  await page.goto(new URL(productPath, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.getByText("More sourcing actions", { exact: true }).click();
  await page.getByRole("button", { name: "Add to sourcing list", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Quantity", { exact: true }).fill("12 racks");
  await dialog.getByRole("combobox", { name: "Requested action", exact: true }).selectOption("Sample");
  await dialog.getByRole("button", { name: "Send list for review", exact: true }).click();
  await page.waitForURL((url) => url.pathname === "/request-quote");
  const email = page.locator("#sourcing-email");
  await email.waitFor();
  const rect = await email.boundingBox();
  assert.ok(rect.y + rect.height <= 844, "Email remains in the mobile first viewport");
  assert.ok(await includeSavedList(page).isChecked(), "An explicit drawer handoff includes the list");
  await email.fill("qa@example.test");
  await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
  await checkConfirmation(page);
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].sourcingListItems[0].quantity, "12 racks");
  assert.equal(submissions[0].sourcingListItems[0].title, "Filtered 200 µL Pipette Tips");
  assert.equal(submissions[0].sourcingListItems[0].requestedAction, "Sample");
}

try {
  await scenario("01-normal-list-handoff", null, sendSelectedList);
  await scenario("02-malformed-saved-list", () => {
    localStorage.setItem("bioaxis:sourcing-list", JSON.stringify([null, 7, { id: "legacy", title: "Filtered pipette tips", href: "/products/liquid-handling", quantity: "3 cases" }]));
  }, async (page) => {
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    await page.locator("#sourcing-email").waitFor();
    assert.match(await page.locator('[data-sourcing-list-summary="true"]').textContent(), /Filtered pipette tips/);
  });
  await scenario("03-storage-denied", () => {
    for (const kind of ["localStorage", "sessionStorage"]) Object.defineProperty(window, kind, { get() { throw new DOMException("Test-only denied storage", "SecurityError"); } });
  }, sendSelectedList);
  await scenario("04-quota-exceeded", () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("bioaxis:sourcing-list")) throw new DOMException("Test-only storage quota", "QuotaExceededError");
      return original.call(this, key, value);
    };
  }, sendSelectedList);
  await scenario("05-success-with-cleanup-denied", () => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (key) {
      if (key.startsWith("bioaxis:sourcing-list")) throw new DOMException("Test-only cleanup failure", "SecurityError");
      return original.call(this, key);
    };
  }, async (page, submissions) => {
    await page.goto(new URL("/request-quote?productName=Filtered%20pipette%20tips", baseUrl).toString(), { waitUntil: "networkidle" });
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.equal(submissions.length, 1, "A cache cleanup failure must not trigger a second submission");
  });
  await scenario("06-clear-and-history-filters", null, async (page) => {
    await page.goto(new URL("/products?view=configurations&segment=liquid-handling&category=pipette-tips&volume=200+%C2%B5L", baseUrl).toString(), { waitUntil: "networkidle" });
    await page.getByText("Filter sourcing targets", { exact: true }).click();
    const scoped = { segment: "liquid-handling", category: "pipette-tips", volume: "200 µL" };
    const cleared = { segment: "", category: "", volume: "" };
    const scopedCount = await page.locator('[data-sourcing-target="true"]').count();
    const countText = await page.getByRole("status").filter({ hasText: "specific templates" }).innerText();
    const totalCount = Number(countText.match(/(\d+) specific templates/)?.[1]);
    assert.ok(totalCount > scopedCount && scopedCount > 0, "The fixture must distinguish filtered and unfiltered results");
    await waitForFilters(page, scoped, scopedCount);
    await page.getByRole("link", { name: "Clear filters", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("view") === "configurations" && !url.searchParams.has("segment"));
    await waitForFilters(page, cleared, totalCount);
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForURL((url) => url.searchParams.get("segment") === scoped.segment && url.searchParams.get("volume") === scoped.volume);
    await waitForFilters(page, scoped, scopedCount);
    await page.goForward({ waitUntil: "domcontentloaded" });
    await page.waitForURL((url) => url.searchParams.get("view") === "configurations" && !url.searchParams.has("segment"));
    await waitForFilters(page, cleared, totalCount);
  });
  await scenario("07-oversized-list-not-partially-submitted", () => {
    localStorage.setItem("bioaxis:sourcing-list", JSON.stringify(Array.from({ length: 31 }, (_, index) => ({ id: `qa-item-${index}`, title: `QA sourcing item ${index + 1}`, href: "/products/liquid-handling", quantity: `${index + 1} racks` }))));
  }, async (page, submissions) => {
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    const include = includeSavedList(page);
    const warning = page.locator("[data-sourcing-list-summary]").getByRole("status");
    assert.equal(await warning.count(), 0, "A saved list that is not attached must not block an unrelated inquiry");
    await include.check();
    assert.match(await warning.innerText(), /up to 30 sourcing-list items/i);
    assert.equal(await include.getAttribute("aria-describedby"), await warning.getAttribute("id"));
    assert.equal(submissions.length, 0, "The attachment limit must be visible before a submission attempt");
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    assert.match(await page.locator("form").getByRole("alert").innerText(), /up to 30 sourcing-list items/);
    assert.equal(submissions.length, 0);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list")).length), 31);

    await include.uncheck();
    await warning.waitFor({ state: "hidden" });
    assert.equal(await page.locator("form").getByRole("alert").count(), 0, "Removing the attachment clears its validation error");
    await page.locator("#sourcing-product-input").fill("QA separate consumables request");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.equal(submissions.length, 1);
    assert.deepEqual(submissions[0].sourcingListItems, []);
    assert.equal((await readSavedRows(page)).length, 31, "Sending separately must not discard any saved items");
  });
  await scenario("08-unconfirmed-receipt-retains-draft", () => {
    localStorage.setItem("bioaxis:sourcing-list", JSON.stringify([{ id: "qa-preserve", title: "QA pipette tips", href: "/products/liquid-handling", quantity: "12 racks" }]));
  }, async (page, submissions) => {
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    const email = page.locator("#sourcing-email");
    const need = page.locator("#sourcing-product-input");
    const send = page.getByRole("button", { name: "Send sourcing request", exact: true });
    await includeSavedList(page).check();
    await email.fill("qa@example.test");
    await need.fill("Confirm sterile 200 microliter tips.");
    for (const attempt of [1, 2]) {
      await send.click();
      await page.locator("form").getByRole("alert").filter({ hasText: /couldn't confirm/i }).waitFor();
      assert.equal(submissions.length, attempt);
      assert.equal(await email.inputValue(), "qa@example.test");
      assert.equal(await need.inputValue(), "Confirm sterile 200 microliter tips.");
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].quantity), "12 racks");
      assert.equal(await page.getByRole("heading", { name: "Request received", exact: true }).count(), 0);
    }
    await send.click();
    await checkConfirmation(page);
    assert.equal(submissions.length, 3);
    assert.equal(new Set(submissions.map((item) => item.requestId)).size, 1, "Unconfirmed retries keep the same reference");
    assert.equal(new Set(submissions.map((item) => JSON.stringify(item.sourcingListItems))).size, 1, "Unconfirmed retries keep the list intact");
  }, (submissions) => [
    { ok: true, mode: "honeypot", message: "Request received." },
    { ok: true, mode: "durable-queue", referenceId: " " },
    confirmedReceipt
  ][submissions.length - 1]);
  await scenario("09-next-inquiry-uses-fresh-reference", null, async (page, submissions) => {
    for (const productName of ["QA filtered pipette tips", "QA PCR plates"]) {
      await page.goto(new URL(`/request-quote?${new URLSearchParams({ productName })}`, baseUrl).toString(), { waitUntil: "networkidle" });
      await page.locator("#sourcing-email").fill("qa@example.test");
      await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
      await checkConfirmation(page);
      assert.equal(submissions.at(-1).productName, productName);
    }
    assert.notEqual(submissions[0].requestId, submissions[1].requestId, "A new inquiry must not reuse a confirmed reference");
  }, (submissions) => submissions.slice(0, -1).some((item) => item.requestId === submissions.at(-1).requestId)
    ? { status: 409, error: "Reference is already stored." }
    : confirmedReceipt);
  await scenario("10-overlong-text-retained-until-corrected", null, async (page, submissions) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    await page.getByText("Add more details (optional)", { exact: true }).click();
    const need = page.locator("#sourcing-product-input");
    const accepted = "Q".repeat(11_999) + "Z";
    const tooLong = accepted + "!";
    await page.locator("#sourcing-email").fill("qa@example.test");
    await need.fill(tooLong);
    const send = page.getByRole("button", { name: "Send sourcing request", exact: true });
    await send.click();
    const error = page.locator("form").getByRole("alert").filter({ hasText: /Product details.*12,000/ });
    await error.waitFor();
    assert.equal(await error.getAttribute("id"), "sourcing-product-input-error");
    assert.match(await need.getAttribute("aria-describedby"), /sourcing-product-input-error/);
    assert.ok(await need.evaluate((field) => field === document.activeElement));
    const bounds = await error.boundingBox();
    assert.ok(bounds && bounds.y >= 64 && bounds.y + bounds.height <= 844, "The overlength hint stays in the mobile viewport");
    assert.equal(submissions.length, 0, "Overlong input should not make a POST request");
    assert.equal(await need.inputValue(), tooLong);
    await need.fill(accepted);
    await send.click();
    await checkConfirmation(page);
    assert.equal(submissions.length, 1);
    assert.equal(submissions[0].productList, accepted);
  });
  let confirmPending;
  const pendingReceipt = new Promise((resolve) => { confirmPending = resolve; });
  await scenario("11-confirmation-preserves-edits-made-while-sending", () => {
    const rows = JSON.stringify([
      { id: "qa-edit", title: "QA pipette tips", href: "/products/liquid-handling", quantity: "12 racks" },
      { id: "qa-sent", title: "QA PCR plates", href: "/products/lab-plasticware", quantity: "2 cases" }
    ]);
    localStorage.setItem("bioaxis:sourcing-list", rows);
    sessionStorage.setItem("bioaxis:sourcing-list-handoff", JSON.stringify({ id: "1".repeat(32), items: JSON.parse(rows) }));
    sessionStorage.setItem("bioaxis:sourcing-list-submission", "Original handoff.");
  }, async (page, submissions) => {
    try {
      await page.goto(new URL(`/request-quote?requestType=product-list-review&source=sourcing-list&storedInput=1&listHandoff=${"1".repeat(32)}`, baseUrl).toString(), { waitUntil: "networkidle" });
      await page.locator('[data-sourcing-list-summary="true"]').waitFor();
      await page.locator("#sourcing-email").fill("qa@example.test");
      const outgoing = page.waitForRequest((request) => new URL(request.url()).pathname === "/api/rfq" && request.method() === "POST");
      await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
      await outgoing;
      await page.getByRole("button", { name: "Edit list", exact: true }).click();
      await page.getByRole("article", { name: "QA pipette tips" }).getByLabel("Quantity", { exact: true }).fill("24 racks");
      await page.waitForFunction(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].quantity === "24 racks");
      await page.evaluate(() => sessionStorage.setItem("bioaxis:sourcing-list-submission", "A newer handoff."));
      confirmPending(confirmedReceipt);
      await checkConfirmation(page);
      assert.equal(submissions[0].sourcingListItems[0].quantity, "12 racks", "The in-flight request retains the original submission");
      const remaining = await page.evaluate(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list") || "[]"));
      assert.deepEqual(remaining.map(({ id, quantity }) => [id, quantity]), [["qa-edit", "24 racks"]]);
      assert.equal(await page.evaluate(() => sessionStorage.getItem("bioaxis:sourcing-list-submission")), "A newer handoff.");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("bioaxis:sourcing-list-handoff")), null);
      await page.getByRole("button", { name: "Start another request", exact: true }).click();
      await page.getByText("Sourcing list: 1 item saved", { exact: true }).waitFor();
      assert.equal(await includeSavedList(page).isChecked(), false);
    } finally {
      confirmPending(confirmedReceipt);
    }
  }, () => pendingReceipt);
  await scenario("12-unrelated-requests-ignore-stale-handoffs", () => {
    sessionStorage.setItem("bioaxis:sourcing-list-submission", "Private QA text from a different handoff.");
    sessionStorage.setItem("bioaxis:sourcing-list-items", JSON.stringify([{ id: "qa-stale", title: "Unrelated QA plate", href: "/products/lab-plasticware" }]));
  }, async (page, submissions) => {
    for (const route of ["/request-quote", "/request-quote?source=homepage-hero&handoff=manual"]) {
      await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle" });
      assert.equal(await page.locator("#sourcing-product-input").inputValue(), "");
      assert.equal(await page.locator('[data-sourcing-list-summary="true"]').count(), 0);
    }
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.locator("#sourcing-product-input").fill("QA sterile tips for this request.");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.deepEqual(submissions[0].sourcingListItems, []);
    assert.equal(submissions[0].productList, "QA sterile tips for this request.");
    assert.equal(await page.evaluate(() => sessionStorage.getItem("bioaxis:sourcing-list-submission")), "Private QA text from a different handoff.");
    assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem("bioaxis:sourcing-list-items"))[0].id), "qa-stale");
  });
  await scenario("13-explicit-text-handoff-ignores-stale-rows", () => {
    sessionStorage.setItem("bioaxis:sourcing-list-submission", "QA product list typed for this handoff.");
    sessionStorage.setItem("bioaxis:sourcing-list-items", JSON.stringify([{ id: "qa-stale", title: "Unrelated QA plate", href: "/products/lab-plasticware" }]));
  }, async (page, submissions) => {
    await page.goto(new URL("/request-quote?source=homepage-hero&storedInput=1", baseUrl).toString(), { waitUntil: "networkidle" });
    assert.equal(await page.locator("#sourcing-product-input").inputValue(), "QA product list typed for this handoff.");
    assert.equal(await page.locator('[data-sourcing-list-summary="true"]').count(), 0);
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.equal(submissions[0].productList, "QA product list typed for this handoff.");
    assert.deepEqual(submissions[0].sourcingListItems, []);
    assert.equal(await page.evaluate(() => sessionStorage.getItem("bioaxis:sourcing-list-submission")), null);
    assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem("bioaxis:sourcing-list-items"))[0].id), "qa-stale");
  });
  await scenario("14-new-context-on-the-same-route", null, async (page, submissions) => {
    await page.goto(new URL("/request-quote?requestType=sample&productName=QA%20filtered%20tips", baseUrl).toString(), { waitUntil: "networkidle" });
    await page.locator("#sourcing-email").fill("old-qa@example.test");
    await page.locator("#sourcing-product-input").fill("QA prior sample request.");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Request a quote", exact: true }).click();
    await page.waitForURL((url) => url.pathname === "/request-quote" && !url.search);
    await page.waitForFunction(() => !document.querySelector('[data-product-context-summary="true"]'));
    assert.equal(await page.locator("#sourcing-product-input").inputValue(), "");
    assert.equal(await page.locator("#sourcing-email").inputValue(), "");
    await page.locator("#sourcing-email").fill("new-qa@example.test");
    await page.locator("#sourcing-product-input").fill("QA new plate quote.");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.equal(submissions[0].requestType, "quote");
    assert.equal(submissions[0].productList, "QA new plate quote.");
    assert.equal(submissions[0].productName, "");
  });
  await scenario("15-two-tabs-do-not-overwrite-edits", seedTwoSourcingItems, async (page) => {
    const url = new URL("/request-quote", baseUrl).toString();
    await page.goto(url, { waitUntil: "networkidle" });
    const other = await page.context().newPage();
    try {
      await other.goto(url, { waitUntil: "networkidle" });
      const firstDrawer = await editSavedList(page);
      const secondDrawer = await editSavedList(other);
      const tips = { name: "QA tabs pipette tips", exact: true };
      const firstRow = firstDrawer.getByRole("article", tips);
      const secondRow = secondDrawer.getByRole("article", tips);
      await firstRow.getByLabel("Quantity", { exact: true }).fill("24 racks");
      await page.waitForFunction(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].quantity === "24 racks");
      await secondRow.getByLabel("Current supplier", { exact: true }).fill("QA vendor reference");
      await other.waitForFunction(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].currentSupplier === "QA vendor reference");
      assert.equal((await readSavedRows(page))[0].quantity, "24 racks", "An edit from another tab must not overwrite the latest saved quantity");
      const supplier = await firstRow.getByLabel("Current supplier", { exact: true }).elementHandle();
      await page.waitForFunction((input) => input.value === "QA vendor reference", supplier, { timeout: 6_000 });
      const removedRow = firstDrawer.getByRole("article", { name: "QA tabs PCR plates", exact: true });
      await removedRow.getByLabel("Quantity", { exact: true }).focus();
      await secondDrawer.getByRole("button", { name: "Remove QA tabs PCR plates", exact: true }).click();
      await removedRow.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Close sourcing list", null, { timeout: 6_000 });
      assert.equal((await readSavedRows(page)).length, 1);
    } finally {
      await other.close();
    }
  });
  let confirmOtherTab;
  const otherTabReceipt = new Promise((resolve) => { confirmOtherTab = resolve; });
  await scenario("16-receipt-preserves-another-tabs-edits", seedTwoSourcingItems, async (page, submissions) => {
    const url = new URL("/request-quote", baseUrl).toString();
    const other = await page.context().newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle" });
      await other.goto(url, { waitUntil: "networkidle" });
      await includeSavedList(page).check();
      await page.locator("#sourcing-email").fill("qa@example.test");
      const outgoing = page.waitForRequest((request) => new URL(request.url()).pathname === "/api/rfq" && request.method() === "POST");
      await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
      await outgoing;
      const drawer = await editSavedList(other);
      await drawer.getByRole("article", { name: "QA tabs pipette tips", exact: true }).getByLabel("Quantity", { exact: true }).fill("36 racks");
      await other.waitForFunction(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].quantity === "36 racks");
      confirmOtherTab(confirmedReceipt);
      await checkConfirmation(page);
      assert.equal(submissions[0].sourcingListItems[0].quantity, "12 racks", "The outgoing request must keep its original snapshot");
      assert.deepEqual((await readSavedRows(page)).map(({ id, quantity }) => [id, quantity]), [["qa-tabs-tips", "36 racks"]]);
      await drawer.getByRole("article", { name: "QA tabs PCR plates", exact: true }).waitFor({ state: "hidden" });
    } finally {
      confirmOtherTab(confirmedReceipt);
      await other.close();
    }
  }, () => otherTabReceipt);
  await scenario("17-tab-only-draft-does-not-overwrite-shared-list", seedTwoSourcingItems, async (page) => {
    const url = new URL("/request-quote", baseUrl).toString();
    await page.goto(url, { waitUntil: "networkidle" });
    const other = await page.context().newPage();
    try {
      await other.goto(url, { waitUntil: "networkidle" });
      const firstDrawer = await editSavedList(page);
      const secondDrawer = await editSavedList(other);
      await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        window.__qaBlockListWrite = true;
        Storage.prototype.setItem = function (key, value) {
          if (key === "bioaxis:sourcing-list" && window.__qaBlockListWrite) throw new DOMException("Test-only storage quota", "QuotaExceededError");
          return original.call(this, key, value);
        };
      });
      const tips = { name: "QA tabs pipette tips", exact: true };
      const quantity = firstDrawer.getByRole("article", tips).getByLabel("Quantity", { exact: true });
      const notice = firstDrawer.getByRole("status").filter({ hasText: "available in this tab only" });
      await quantity.fill("24 racks");
      await notice.waitFor();
      await secondDrawer.getByRole("article", tips).getByLabel("Notes", { exact: true }).fill("QA other-tab note");
      await other.waitForFunction(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list"))[0].notes === "QA other-tab note");
      await page.evaluate(() => { window.__qaBlockListWrite = false; });
      await quantity.fill("36 racks");
      assert.equal(await quantity.inputValue(), "36 racks");
      const saved = (await readSavedRows(page))[0];
      assert.equal(saved.quantity, "12 racks", "A tab-only draft must not overwrite a changed shared baseline when storage recovers");
      assert.equal(saved.notes, "QA other-tab note");
      assert.ok(await notice.isVisible());
    } finally {
      await other.close();
    }
  });
  for (const [index, phase] of ["headers", "body"].entries()) {
    await scenario(`${18 + index}-stalled-rfq-${phase}`, seedTwoSourcingItems, async (page, submissions) => {
      await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
      await includeSavedList(page).check();
      await page.clock.install();
      await page.evaluate((phase) => {
        const fetch = window.fetch.bind(window);
        window.fetch = (input, options) => {
          if (input !== "/api/rfq" || window.__qaStalledRequest) return fetch(input, options);
          window.__qaStalledRequest = JSON.parse(options.body);
          const onAbort = (fail) => options.signal?.addEventListener("abort", () => {
            window.__qaStalledRequestAborted = true;
            fail(options.signal.reason);
          }, { once: true });
          if (phase === "headers") return new Promise((_, reject) => onAbort(reject));
          return Promise.resolve(new Response(new ReadableStream({ start: (stream) => onAbort((error) => stream.error(error)) }), {
            headers: { "Content-Type": "application/json" }
          }));
        };
      }, phase);

      const email = page.locator("#sourcing-email");
      const input = page.locator("#sourcing-product-input");
      const notes = page.locator("#sourcing-notes");
      const submit = page.getByRole("button", { name: "Send sourcing request", exact: true });
      await email.fill("qa@example.test");
      await input.fill("QA fixture: preserve this product list during a delayed receipt");
      await page.getByText("Add more details (optional)", { exact: true }).click();
      await notes.fill("QA notes included before sending");
      const savedItems = await readSavedRows(page);
      await submit.click();
      await page.waitForFunction(() => Boolean(window.__qaStalledRequest));
      assert.ok(await page.getByRole("button", { name: "Sending...", exact: true }).isDisabled());
      for (const field of [email, input, notes]) assert.ok(await field.isDisabled(), "Fields already sent must not accept edits while awaiting the receipt");
      assert.ok(await page.getByRole("button", { name: "Edit list", exact: true }).isEnabled(), "The independent saved list remains editable");
      await page.clock.fastForward(31_000);

      const alert = page.locator("form").getByRole("alert");
      await alert.waitFor();
      assert.match(await alert.innerText(), /couldn't confirm.*retry using this reference/i);
      assert.equal(await page.evaluate(() => window.__qaStalledRequestAborted), true);
      assert.equal(await email.inputValue(), "qa@example.test");
      assert.match(await input.inputValue(), /preserve this product list/);
      assert.equal(await notes.inputValue(), "QA notes included before sending");
      for (const field of [email, input, notes]) assert.ok(await field.isEnabled(), "After a deadline the preserved draft must be editable again");
      assert.deepEqual(await readSavedRows(page), savedItems, "Unconfirmed submissions must not clear saved items");
      assert.equal(await page.getByRole("heading", { name: "Request received", exact: true }).count(), 0);
      const first = await page.evaluate(() => window.__qaStalledRequest);
      await submit.click();
      await page.getByText(`Reference: ${first.requestId}`, { exact: true }).waitFor();
      assert.equal(submissions.length, 1);
      assert.equal(submissions[0].requestId, first.requestId, "Retry must reuse the original reference after the deadline");
      assert.equal(submissions[0].productList, first.productList);
      assert.deepEqual(submissions[0].sourcingListItems, first.sourcingListItems);
    }, ([retry]) => ({ ...confirmedReceipt, referenceId: retry.requestId }));
  }
  await scenario("20-attachment-scope-is-per-request", seedTwoSourcingItems, async (page, submissions) => {
    const url = new URL("/request-quote?source=homepage-hero&storedInput=1", baseUrl);
    await page.addInitScript(() => sessionStorage.setItem("bioaxis:sourcing-list-submission", "QA typed reference, not the saved list"));
    await page.goto(url.href, { waitUntil: "networkidle" });
    const include = includeSavedList(page);
    const need = page.locator("#sourcing-product-input");
    assert.equal(await include.isChecked(), false);
    assert.equal(await need.inputValue(), "QA typed reference, not the saved list");
    await include.check();
    assert.equal(await need.evaluate((field) => field.required), false);
    await include.uncheck();
    assert.equal(await need.evaluate((field) => field.required), true);
    await page.getByText("Sourcing list: 2 items saved", { exact: true }).waitFor();
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.equal(submissions[0].productList, "QA typed reference, not the saved list");
    assert.deepEqual(submissions[0].sourcingListItems, []);
    assert.equal((await readSavedRows(page)).length, 2);
  });
  await scenario("21-excluded-handoff-remains-saved", () => {
    sessionStorage.setItem("bioaxis:sourcing-list-handoff", JSON.stringify({ id: "2".repeat(32), items: [
      { id: "qa-session-only", title: "QA session-only items", href: "/products/liquid-handling" }
    ] }));
  }, async (page, submissions) => {
    await page.goto(new URL(`/request-quote?source=sourcing-list&storedInput=1&listHandoff=${"2".repeat(32)}`, baseUrl).href, { waitUntil: "networkidle" });
    const include = includeSavedList(page);
    assert.ok(await include.isChecked());
    await include.uncheck();
    await page.locator("#sourcing-product-input").fill("QA standalone request");
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await checkConfirmation(page);
    assert.deepEqual(submissions[0].sourcingListItems, []);
    assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem("bioaxis:sourcing-list-handoff")).items[0].id), "qa-session-only");
  });
  await scenario("22-only-the-matching-drawer-handoff-is-selected", null, async (page, submissions) => {
    async function handoff() {
      await page.goto(new URL(productPath, baseUrl).href, { waitUntil: "domcontentloaded" });
      await page.getByText("More sourcing actions", { exact: true }).click();
      const add = page.getByRole("button", { name: "Add to sourcing list", exact: true }).or(page.getByRole("button", { name: "Added to sourcing list", exact: true }));
      await add.click();
      await page.getByRole("button", { name: "Send list for review", exact: true }).click();
      await page.waitForURL((url) => url.pathname === "/request-quote" && url.searchParams.has("listHandoff"));
      await includeSavedList(page).waitFor();
      assert.ok(await includeSavedList(page).isChecked());
      return page.url();
    }
    const first = await handoff();
    await page.reload({ waitUntil: "networkidle" });
    assert.ok(await includeSavedList(page).isChecked(), "Reload still has the matching drawer snapshot");
    const latest = await handoff();
    assert.notEqual(latest, first, "Each drawer handoff needs a distinct identifier");
    for (const url of [first, new URL("/request-quote?source=sourcing-list&storedInput=1", baseUrl).href, latest]) {
      await page.goto(url, { waitUntil: "networkidle" });
      assert.equal(await includeSavedList(page).isChecked(), url === latest);
      assert.equal(await page.locator("#sourcing-product-input").evaluate((field) => field.required), url !== latest);
    }
    assert.equal(submissions.length, 0);
  });
  await scenario("23-new-saved-rows-stay-outside-an-existing-handoff", null, async (page, submissions) => {
    await page.goto(new URL(productPath, baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.getByText("More sourcing actions", { exact: true }).click();
    await page.getByRole("button", { name: "Add to sourcing list", exact: true }).click();
    await page.getByRole("button", { name: "Send list for review", exact: true }).click();
    await page.waitForURL((url) => url.pathname === "/request-quote" && url.searchParams.has("listHandoff"));
    await page.getByText("Sourcing list: 1 item included", { exact: true }).waitFor();
    const other = await page.context().newPage();
    try {
      const vialPath = "/products/storage-cryopreservation/cryogenic-vials/sterile-cryovials/sterile-cryogenic-vials";
      await other.goto(new URL(vialPath, baseUrl).href, { waitUntil: "domcontentloaded" });
      await other.getByText("More sourcing actions", { exact: true }).click();
      await other.getByRole("button", { name: "Add to sourcing list", exact: true }).click();
      const originalRow = other.getByRole("dialog").getByRole("article", { name: "Filtered 200 µL Pipette Tips", exact: true });
      await originalRow.getByLabel("Quantity", { exact: true }).fill("24 racks");
      const drawer = await editSavedList(page);
      const reviewedRow = drawer.getByRole("article", { name: "Filtered 200 µL Pipette Tips", exact: true });
      await page.waitForFunction(() => document.querySelectorAll("[data-sourcing-list-modal] article").length === 2);
      await page.waitForFunction((field) => field.value === "24 racks", await reviewedRow.getByLabel("Quantity", { exact: true }).elementHandle());
      await page.keyboard.press("Escape");
      assert.ok(await page.getByText("Sourcing list: 1 item included", { exact: true }).isVisible());
      await page.reload({ waitUntil: "networkidle" });
      await page.getByText("Sourcing list: 1 item included", { exact: true }).waitFor();
      await page.locator("#sourcing-email").fill("qa@example.test");
      await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
      await checkConfirmation(page);
      assert.equal(submissions[0].sourcingListItems.length, 1);
      assert.equal(submissions[0].sourcingListItems[0].href, productPath);
      assert.equal(submissions[0].sourcingListItems[0].quantity, "24 racks");
      assert.deepEqual((await readSavedRows(page)).map((item) => item.href), [vialPath]);
      await page.getByRole("button", { name: "Start another request", exact: true }).click();
      await page.getByText("Sourcing list: 1 item saved", { exact: true }).waitFor();
      assert.equal(await includeSavedList(page).isChecked(), false);
    } finally { await other.close(); }
  });
  await scenario("24-deleted-and-readded-rows-stay-outside-the-original-handoff", null, async (page, submissions) => {
    await page.goto(new URL(productPath, baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.getByText("More sourcing actions", { exact: true }).click();
    await page.getByRole("button", { name: "Add to sourcing list", exact: true }).click();
    await page.getByRole("button", { name: "Send list for review", exact: true }).click();
    await page.waitForURL((url) => url.pathname === "/request-quote" && url.searchParams.has("listHandoff"));
    await page.getByText("Sourcing list: 1 item included", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem("bioaxis:sourcing-list-handoff")).followsSavedList), true);
    const other = await page.context().newPage();
    try {
      await other.goto(new URL(productPath, baseUrl).href, { waitUntil: "domcontentloaded" });
      await other.getByText("More sourcing actions", { exact: true }).click();
      await other.getByRole("button", { name: "Added to sourcing list", exact: true }).click();
      await other.getByRole("button", { name: "Remove Filtered 200 µL Pipette Tips", exact: true }).click();
      const list = page.locator("[data-sourcing-list-summary]");
      await list.waitFor({ state: "hidden" });
      assert.equal(await page.evaluate(() => localStorage.getItem("bioaxis:sourcing-list")), null);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await list.count(), 0, "An empty shared list must not restore a deleted reviewed item");
      assert.equal(await page.locator("#sourcing-product-input").evaluate((field) => field.required), true);

      await other.keyboard.press("Escape");
      await other.getByRole("button", { name: "Add to sourcing list", exact: true }).click();
      await other.getByRole("dialog").waitFor();
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page.getByRole("button", { name: "Review sourcing list (1)", exact: true }).waitFor();
      await page.getByRole("button", { name: "Close menu", exact: true }).click();
      assert.equal(await list.count(), 0, "Re-adding the same product must not automatically attach it to the old draft");
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await list.count(), 0, "Reload must not attach a different entry for the same product");
      assert.equal(await page.locator("#sourcing-product-input").evaluate((field) => field.required), true);

      await other.getByRole("button", { name: "Send list for review", exact: true }).click();
      await other.waitForURL((url) => url.pathname === "/request-quote" && url.searchParams.has("listHandoff"));
      await other.getByText("Sourcing list: 1 item included", { exact: true }).waitFor();
      assert.equal(submissions.length, 0);
    } finally { await other.close(); }
  });
  for (const [index, response, finalLabel] of [
    [25, confirmedReceipt, "Request received"],
    [26, { ok: false, status: 503, error: "Local QA failure" }, "Request needs attention"]
  ]) {
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    await scenario(`${index}-collapsed-intake-keeps-request-feedback`, null, async (page, submissions) => {
      try {
        await page.goto(new URL("/equivalent-finder", baseUrl).href, { waitUntil: "networkidle" });
        const disclosure = page.locator("[data-sourcing-intake-disclosure]");
        const summary = disclosure.locator(":scope > summary");
        const badge = summary.locator("[data-sourcing-intake-status]");
        const announcement = page.locator("[data-sourcing-intake-disclosure] + [role='status']");
        await summary.press("Enter");
        await page.locator("#sourcing-product-input").fill("Local buyer-session product requirement");
        await page.locator("#sourcing-email").fill("qa@example.test");
        await page.getByRole("button", { name: "Send review request", exact: true }).click();
        await page.getByRole("button", { name: "Sending...", exact: true }).waitFor();
        await summary.press("Enter");
        await badge.filter({ hasText: "Sending request..." }).waitFor();
        finish(response);
        await badge.filter({ hasText: finalLabel }).waitFor();
        assert.equal(await announcement.textContent(), finalLabel);
        assert.equal(await disclosure.getAttribute("open"), null);
        assert.ok(await summary.evaluate((node) => node === document.activeElement), "Background feedback must not steal focus");
        assert.equal(submissions.length, 1);
        await summary.press("Enter");
        await badge.waitFor({ state: "hidden" });
        if (response.ok) await page.getByText(`Reference: ${response.referenceId}`, { exact: true }).waitFor();
        else {
          await disclosure.getByRole("alert").filter({ hasText: response.error }).waitFor();
          assert.equal(await page.locator("#sourcing-product-input").inputValue(), "Local buyer-session product requirement");
        }
      } finally { finish(response); }
    }, () => pending);
  }
  await scenario("27-field-errors-stay-with-the-focused-input", null, async (page, submissions) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(new URL("/request-quote", baseUrl).href, { waitUntil: "networkidle" });
    const form = page.locator("form[data-api-endpoint]");
    await form.getByText("Add more details (optional)", { exact: true }).click();
    const send = form.getByRole("button", { name: "Send sourcing request", exact: true });

    async function checkFieldError(id) {
      await send.click();
      const input = form.locator(`#${id}`);
      const error = form.getByRole("alert");
      await error.waitFor();
      assert.equal(await error.getAttribute("id"), `${id}-error`);
      assert.equal(await input.getAttribute("aria-invalid"), "true");
      assert.ok((await input.getAttribute("aria-describedby")).split(" ").includes(`${id}-error`));
      assert.ok(await input.evaluate((element) => element === document.activeElement));
      const fieldBounds = await input.boundingBox();
      const errorBounds = await error.boundingBox();
      assert.ok(fieldBounds && errorBounds && fieldBounds.y >= 64 && errorBounds.y + errorBounds.height <= 844,
        "The focused input and its error must share the mobile viewport even with optional details open");
      const gap = errorBounds.y - fieldBounds.y - fieldBounds.height;
      assert.ok(gap >= 0 && gap < 64, "The error must be directly after the field, not in the submit area");
    }

    await checkFieldError("sourcing-product-input");
    await form.locator("#sourcing-product-input").fill("QA product requirement");
    await form.locator("#sourcing-email").fill("invalid");
    await checkFieldError("sourcing-email");
    const longEmail = `${"a".repeat(229)}@example.test`;
    await form.locator("#sourcing-email").fill(longEmail);
    await checkFieldError("sourcing-email");
    assert.match(await form.getByRole("alert").innerText(), /240-character limit/);
    assert.equal(await form.locator("#sourcing-email").inputValue(), longEmail);
    assert.equal(submissions.length, 0, "Field validation failures must not send requests");
  });
  await scenario("28-collapsed-optional-field-errors-are-revealed", null, async (page, submissions) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(new URL("/request-quote", baseUrl).href, { waitUntil: "networkidle" });
    await page.locator("#sourcing-product-input").fill("QA consumables request");
    await page.locator("#sourcing-email").fill("qa@example.test");
    const details = page.locator("details").filter({ has: page.locator("#sourcing-docs") });
    const summary = details.locator(":scope > summary");
    await summary.press("Enter");
    const send = page.getByRole("button", { name: "Send sourcing request", exact: true });

    for (const [id, max] of [["sourcing-docs", 1200], ["sourcing-notes", 8000]]) {
      const field = page.locator(`#${id}`);
      const original = "Q".repeat(max + 1);
      await field.fill(original);
      await summary.press("Enter");
      assert.equal(await details.getAttribute("open"), null);
      await send.click();
      const alert = details.getByRole("alert");
      await alert.waitFor();
      assert.equal(await alert.getAttribute("id"), `${id}-error`);
      assert.equal(await field.getAttribute("aria-describedby"), `${id}-error`);
      assert.ok(await field.evaluate((node) => node === document.activeElement));
      const bounds = await alert.boundingBox();
      assert.ok(bounds && bounds.y >= 64 && bounds.y + bounds.height <= 844, "The optional error stays in the mobile viewport");
      assert.equal(await field.inputValue(), original);
      assert.equal(submissions.length, 0);
      await field.fill(original.slice(0, max));
    }

    await send.click();
    await checkConfirmation(page);
    assert.equal(submissions.length, 1);
    assert.equal(submissions[0].documentationNeeds, "Q".repeat(1200));
    assert.equal(submissions[0].message, "Q".repeat(8000));
  });
  await writeFile(path.join(output, "results.json"), JSON.stringify({ evidence, failures }, null, 2));
  assert.deepEqual(failures, [], "Buyer-session regression failures");
  console.log(`Buyer-session regression passed: ${evidence.length} local scenarios, saved-list recovery, denied storage/quota/cleanup, preserved intent, visible confirmation, URL/control/result history, overflow protection and stalled receipt recovery. Evidence: ${output}`);
} finally { await browser.close(); }

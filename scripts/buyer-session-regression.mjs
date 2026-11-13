import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3014";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname), "Fault injection is local-only");
const output = path.resolve(process.env.BUYER_SESSION_QA_DIR ?? "artifacts/buyer-session-qa");
const browser = await chromium.launch();
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
    await page.locator('[data-sourcing-list-summary="true"]').waitFor();
    await page.locator("#sourcing-email").fill("qa@example.test");
    await page.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    assert.match(await page.locator("form").getByRole("alert").innerText(), /up to 30 sourcing-list items/);
    assert.equal(submissions.length, 0);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bioaxis:sourcing-list")).length), 31);
  });
  await scenario("08-unconfirmed-receipt-retains-draft", () => {
    localStorage.setItem("bioaxis:sourcing-list", JSON.stringify([{ id: "qa-preserve", title: "QA pipette tips", href: "/products/liquid-handling", quantity: "12 racks" }]));
  }, async (page, submissions) => {
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    const email = page.locator("#sourcing-email");
    const need = page.locator("#sourcing-product-input");
    const send = page.getByRole("button", { name: "Send sourcing request", exact: true });
    await page.locator('[data-sourcing-list-summary="true"]').waitFor();
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
    await page.goto(new URL("/request-quote", baseUrl).toString(), { waitUntil: "networkidle" });
    const need = page.locator("#sourcing-product-input");
    const accepted = "Q".repeat(11_999) + "Z";
    const tooLong = accepted + "!";
    await page.locator("#sourcing-email").fill("qa@example.test");
    await need.fill(tooLong);
    const send = page.getByRole("button", { name: "Send sourcing request", exact: true });
    await send.click();
    await page.locator("form").getByRole("alert").filter({ hasText: /Product details.*12,000/ }).waitFor();
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
    sessionStorage.setItem("bioaxis:sourcing-list-items", rows);
    sessionStorage.setItem("bioaxis:sourcing-list-submission", "Original handoff.");
  }, async (page, submissions) => {
    try {
      await page.goto(new URL("/request-quote?requestType=product-list-review&source=sourcing-list&storedInput=1", baseUrl).toString(), { waitUntil: "networkidle" });
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
      assert.equal(await page.evaluate(() => sessionStorage.getItem("bioaxis:sourcing-list-items")), null);
      await page.getByRole("button", { name: "Start another request", exact: true }).click();
      await page.getByText("Sourcing list: 1 item included", { exact: true }).waitFor();
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
  await writeFile(path.join(output, "results.json"), JSON.stringify({ evidence, failures }, null, 2));
  assert.deepEqual(failures, [], "Buyer-session regression failures");
  console.log(`Buyer-session regression passed: ${evidence.length} local scenarios, saved-list recovery, denied storage/quota/cleanup, preserved intent, visible confirmation, URL/control/result history and overflow protection. Evidence: ${output}`);
} finally { await browser.close(); }

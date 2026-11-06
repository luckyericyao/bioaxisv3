import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3012";
const output = path.resolve(process.env.REDESIGN_QA_DIR ?? "artifacts/redesign-qa");
const browser = await chromium.launch({ headless: true });
const evidence = [];
const errors = [];
await mkdir(output, { recursive: true });

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 390, height: 844 }, { width: 320, height: 844 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__brandAnimations = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        if (this.matches("[data-home-brand], [data-brand-axis]")) window.__brandAnimations.push(options.duration);
        return animate.call(this, frames, options);
      };
    });
    for (const route of ["/", "/products", "/request-quote", "/equivalent-finder", "/private-label-oem", "/trust-center", "/contact", "/quality", "/supplier-qualification", "/suppliers", "/support", "/about", "/applications", "/workflows", "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips"]) {
      const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const visible = (node) => node.getClientRects().length && !node.closest("details:not([open]) > :not(summary), .sr-only, [aria-hidden='true']") && getComputedStyle(node).visibility !== "hidden";
        const leaves = [...document.querySelectorAll("main *")].filter((node) => !node.children.length && node.textContent.trim() && visible(node));
        const hero = document.querySelector(".home-hero");
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          family: getComputedStyle(document.body).fontFamily,
          smallText: leaves.filter((node) => parseFloat(getComputedStyle(node).fontSize) < 14).map((node) => node.textContent.slice(0, 60)),
          bodyTypeFailures: [...document.querySelectorAll("main .body-copy, main td")].filter(visible).filter((node) => {
            const style = getComputedStyle(node);
            return style.fontSize !== "16px" || style.lineHeight !== "25px" || style.fontWeight !== "400";
          }).map((node) => node.textContent.trim().slice(0, 70)),
          uppercase: leaves.filter((node) => getComputedStyle(node).textTransform === "uppercase").map((node) => node.textContent.slice(0, 60)),
          brokenImages: [...document.images].filter((node) => visible(node) && (!node.complete || !node.naturalWidth)).map((node) => node.src),
          hero: hero ? {
            title: getComputedStyle(hero.querySelector("h1")).fontSize,
            purposeLines: hero.querySelector(".home-purpose").getBoundingClientRect().height / parseFloat(getComputedStyle(hero.querySelector(".home-purpose")).lineHeight),
            actions: [...hero.querySelectorAll("a")].map((node) => ({ height: node.getBoundingClientRect().height, bottom: node.getBoundingClientRect().bottom })),
            productsTop: document.getElementById("home-products-title").getBoundingClientRect().top
          } : null
        };
      });
      assert.equal(state.overflow, false, `${viewport.width} ${route}: horizontal overflow`);
      assert.match(state.family, /inter/i);
      assert.deepEqual(state.smallText, [], `${viewport.width} ${route}: text below 14px`);
      assert.deepEqual(state.bodyTypeFailures, [], `${viewport.width} ${route}: prose must be 16/25 at weight 400`);
      assert.deepEqual(state.uppercase, [], `${viewport.width} ${route}: forced uppercase`);
      assert.deepEqual(state.brokenImages, [], `${viewport.width} ${route}: missing image`);
      if (state.hero) {
        assert.equal(state.hero.title, viewport.width < 1024 ? "40px" : "68px");
        assert.ok(state.hero.purposeLines <= (viewport.width < 640 ? 3.05 : 2.05));
        assert.equal(state.hero.actions.length, 2);
        assert.ok(state.hero.actions.every((action) => action.height >= 44 && action.bottom < viewport.height));
        assert.ok(state.hero.productsTop > viewport.height, "Brand opening must precede the product directory");
        assert.equal(await page.locator('.home-hero a').first().getAttribute('href'), '#sourcing-value');
        assert.deepEqual(await page.evaluate(() => window.__brandAnimations), [500]);
        await page.screenshot({ path: path.join(output, `home-${viewport.width}.png`) });
        await page.reload({ waitUntil: "networkidle" });
        assert.deepEqual(await page.evaluate(() => window.__brandAnimations), [], "Brand animation must not replay in the session");
      }
      if (route === "/request-quote") {
        assert.ok(await page.locator("#sourcing-product-input").getAttribute("required") !== null);
        await page.screenshot({ path: path.join(output, `rfq-${viewport.width}.png`) });
      }
      if (route.endsWith("/filtered-200ul-pipette-tips")) {
        const actions = page.locator('[data-product-primary-actions="true"] a');
        assert.equal(await actions.count(), 3, "Configuration has one primary and two secondary actions");
        if (viewport.width < 640) {
          const bounds = await actions.evaluateAll((links) => links.map((link) => link.getBoundingClientRect().toJSON()));
          assert.ok(bounds.every((rect) => rect.height >= 44 && rect.bottom <= viewport.height), "Mobile configuration actions remain in the first viewport");
          assert.equal(await page.getByRole("link", { name: "Ask for documents", exact: true }).isVisible(), false);
          const fields = page.getByText("Configuration fields to confirm", { exact: true });
          await fields.click();
          assert.match(await fields.locator("xpath=ancestor::details[1]").innerText(), /racked, reload, or bulk/);
          await fields.click();
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        }
        await page.screenshot({ path: path.join(output, `configuration-${viewport.width}.png`) });
      }
      evidence.push({ viewport, route, ...state });
    }
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await reduced.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(await reduced.evaluate(() => document.querySelector("[data-home-brand]").getAnimations().length), 0);
  await reduced.screenshot({ path: path.join(output, "home-reduced-motion.png") });
  await reduced.close();
  const formPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const submissions = [];
  await formPage.route("**/api/turnstile/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ enabled: false }) }));
  await formPage.route("**/api/rfq", async (route) => {
    submissions.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, mode: "durable-queue", referenceId: "QA-LOCAL-ONLY", message: "Request received and stored for BioAxis review." }) });
  });
  await formPage.goto(new URL("/request-quote", baseUrl).toString());
  const submit = formPage.getByRole("button", { name: "Send sourcing request", exact: true });
  await submit.waitFor({ state: "visible" });
  await formPage.locator("#sourcing-email").fill("qa@example.test");
  await submit.click();
  assert.match(await formPage.locator("form").getByRole("alert").innerText(), /Add a product/);
  assert.equal(await formPage.evaluate(() => document.activeElement.id), "sourcing-product-input");
  await formPage.locator("#sourcing-product-input").fill("PCR plates for assay development");
  await formPage.locator("#sourcing-email").fill("invalid");
  await submit.click();
  assert.match(await formPage.locator("form").getByRole("alert").innerText(), /email/);
  assert.equal(await formPage.evaluate(() => document.activeElement.id), "sourcing-email");
  await formPage.locator("#sourcing-email").fill("qa@example.test");
  await formPage.locator("form").evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
  await formPage.getByText("Reference: QA-LOCAL-ONLY", { exact: true }).waitFor();
  await formPage.screenshot({ path: path.join(output, "rfq-success-mobile.png") });
  assert.equal(submissions.length, 1, "Concurrent submit events must produce one API call");
  assert.equal(submissions[0].productList, "PCR plates for assay development");
  await formPage.goto(new URL("/request-quote?productName=Filtered%20pipette%20tips", baseUrl).toString());
  assert.equal(await formPage.locator("#sourcing-product-input").inputValue(), "");
  assert.equal(await formPage.locator("#sourcing-product-input").getAttribute("required"), null);
  await formPage.locator("#sourcing-email").fill("qa@example.test");
  await submit.click();
  await formPage.getByText("Reference: QA-LOCAL-ONLY", { exact: true }).waitFor();
  assert.equal(submissions[1].productName, "Filtered pipette tips");
  assert.equal(submissions[1].productList, "");
  await formPage.close();
  const listFixture = [{ id: "local-test-only", title: "Filtered 200 µL Pipette Tips", href: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips", quantity: "10 racks", requestedAction: "Quote", addedAt: "2026-11-07T00:00:00.000Z" }];
  const listSubmissions = [];
  for (const width of [390, 320]) {
    const contextPage = await browser.newPage({ viewport: { width, height: 844 } });
    contextPage.on("pageerror", (error) => errors.push(error.message));
    await contextPage.addInitScript((items) => localStorage.setItem("bioaxis:sourcing-list", JSON.stringify(items)), listFixture);
    await contextPage.route("**/api/turnstile/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ enabled: false }) }));
    await contextPage.route("**/api/rfq", async (route) => {
      listSubmissions.push(route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, mode: "durable-queue", referenceId: "QA-CONTEXT-LOCAL-ONLY", message: "Request received and stored for BioAxis review." }) });
    });
    await contextPage.goto(new URL("/request-quote?requestType=quote&segment=liquid-handling&category=pipette-tips&family=filtered-pipette-tips&product=filtered-200ul-pipette-tips", baseUrl).toString(), { waitUntil: "networkidle" });
    await contextPage.locator('[data-sourcing-list-summary="true"]').waitFor();
    const emailBounds = await contextPage.locator("#sourcing-email").boundingBox();
    assert.ok(emailBounds.y + emailBounds.height <= 844, `${width}: product context and list must not displace Email below the first viewport`);
    const context = contextPage.locator('[data-product-context-summary="true"]');
    assert.match(await context.innerText(), /Filtered 200 µL Pipette Tips/);
    assert.match(await context.innerText(), /Sterility: To confirm/);
    assert.equal(await contextPage.locator("#sourcing-product-input").getAttribute("required"), null);
    await contextPage.screenshot({ path: path.join(output, `rfq-context-list-${width}.png`) });
    await contextPage.locator("#sourcing-email").fill("qa@example.test");
    await contextPage.getByRole("button", { name: "Send sourcing request", exact: true }).click();
    await contextPage.getByText("Reference: QA-CONTEXT-LOCAL-ONLY", { exact: true }).waitFor();
    assert.equal(listSubmissions.at(-1).sourcingListItems[0].quantity, "10 racks");
    assert.ok(listSubmissions.at(-1).productContext.relevantSpecs.includes("nominal volume: 200 µL"));
    await contextPage.close();
  }
  const legacyContext = await browser.newPage();
  await legacyContext.goto(new URL("/request-quote?segment=cell-culture&category=cell-culture-media-buffers&family=classical-media&product=dmem-high-glucose", baseUrl).toString(), { waitUntil: "networkidle" });
  await legacyContext.locator('[data-product-context-summary="true"] summary').click();
  assert.match(await legacyContext.getByRole("list", { name: "All source specifications" }).innerText(), /Format: Liquid \/ powder option/);
  await legacyContext.goto(new URL("/request-quote?segment=liquid-handling&category=pipette-tips&family=universal-pipette-tips&product=sterile-filtered-universal-pipette-tips", baseUrl).toString(), { waitUntil: "networkidle" });
  await legacyContext.locator('[data-product-context-summary="true"] summary').click();
  assert.match(await legacyContext.getByRole("list", { name: "All source specifications" }).innerText(), /Sterility: Sterile/);
  assert.match(await legacyContext.getByRole("list", { name: "All source specifications" }).innerText(), /Format: Racked/);
  await legacyContext.close();
  const targets = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await targets.goto(new URL('/products?view=configurations&volume=200+%C2%B5L&barrier=Filtered', baseUrl).toString(), { waitUntil: 'networkidle' });
  assert.equal(await targets.getByRole('form', { name: 'Filter sourcing targets' }).isVisible(), false, 'Mobile filters must not push results below the fold');
  const firstTarget = targets.locator('[data-sourcing-target="true"]').first();
  assert.ok((await firstTarget.boundingBox()).y < 844);
  await targets.screenshot({ path: path.join(output, 'configuration-results-mobile.png') });
  const configurationLink = firstTarget.getByRole('link', { name: 'Configure request', exact: true });
  const configurationPath = new URL(await configurationLink.getAttribute('href'), baseUrl).pathname;
  await configurationLink.click();
  await targets.waitForURL(url => url.pathname === configurationPath);
  assert.match(new URL(targets.url()).searchParams.get('productList'), /Requested volume: 200 µL/);
  await targets.locator('[data-product-primary-actions="true"]').getByRole('link', { name: 'Request a quote', exact: true }).click();
  await targets.waitForURL(url => url.pathname === '/request-quote');
  assert.match(await targets.locator('#sourcing-product-input').inputValue(), /Requested barrier: Filtered/);
  assert.equal(await targets.locator('[data-product-context-summary="true"]').isVisible(), true);
  await targets.goto(new URL('/products?view=configurations&sterility=Non-sterile', baseUrl).toString(), { waitUntil: 'networkidle' });
  const sendRequirement = targets.locator('main a[href^="/request-quote"]');
  assert.equal(await sendRequirement.count(), 1, 'An exact no-match offers one main requirement handoff');
  assert.match(new URL(await sendRequirement.getAttribute('href'), baseUrl).searchParams.get('productList'), /Requested sterility: Non-sterile/);
  await targets.goto(new URL('/products?view=configurations&segment=liquid-handling&category=pipette-tips', baseUrl).toString(), { waitUntil: 'networkidle' });
  await targets.getByText('Filter sourcing targets', { exact: true }).click();
  const filters = targets.getByRole('form', { name: 'Filter sourcing targets' });
  assert.equal(await filters.getByRole('combobox', { name: 'Category', exact: true }).inputValue(), 'pipette-tips');
  await filters.getByRole('combobox', { name: 'Product line', exact: true }).selectOption('cell-culture');
  assert.equal(await filters.getByRole('combobox', { name: 'Category', exact: true }).inputValue(), '', 'Changing line must clear a stale category constraint');
  await filters.getByRole('button', { name: 'Apply filters', exact: true }).click();
  await targets.waitForURL(url => url.searchParams.get('segment') === 'cell-culture');
  assert.equal(new URL(targets.url()).searchParams.get('category'), '');
  await targets.close();
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(path.join(output, "acceptance.json"), JSON.stringify({ evidence, errors, reducedMotion: "passed", clientNeedValidation: "passed", concurrentSubmitGuard: "passed", selectedProductWithoutRetyping: "passed", mobileEmailWithContextAndList: "passed", legacyStructuredSpecifications: "passed", localMockSubmissions: submissions.length + listSubmissions.length }, null, 2));
  console.log(`Redesign acceptance passed: ${evidence.length} page/viewport checks, Inter/type minimums, image loading, first-viewport actions, session motion and reduced motion. Screenshots: ${output}`);
} finally { await browser.close(); }

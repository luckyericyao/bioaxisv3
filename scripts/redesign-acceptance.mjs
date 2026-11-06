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
    for (const route of ["/", "/products", "/request-quote", "/equivalent-finder", "/private-label-oem", "/trust-center", "/contact"]) {
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
          uppercase: leaves.filter((node) => getComputedStyle(node).textTransform === "uppercase").map((node) => node.textContent.slice(0, 60)),
          brokenImages: [...document.images].filter((node) => visible(node) && (!node.complete || !node.naturalWidth)).map((node) => node.src),
          hero: hero ? {
            title: getComputedStyle(hero.querySelector("h1")).fontSize,
            purposeLines: hero.querySelector("p").getBoundingClientRect().height / parseFloat(getComputedStyle(hero.querySelector("p")).lineHeight),
            actions: [...hero.querySelectorAll("a")].map((node) => ({ height: node.getBoundingClientRect().height, bottom: node.getBoundingClientRect().bottom })),
            productsTop: document.getElementById("home-products-title").getBoundingClientRect().top
          } : null
        };
      });
      assert.equal(state.overflow, false, `${viewport.width} ${route}: horizontal overflow`);
      assert.match(state.family, /inter/i);
      assert.deepEqual(state.smallText, [], `${viewport.width} ${route}: text below 14px`);
      assert.deepEqual(state.uppercase, [], `${viewport.width} ${route}: forced uppercase`);
      assert.deepEqual(state.brokenImages, [], `${viewport.width} ${route}: missing image`);
      if (state.hero) {
        assert.equal(state.hero.title, viewport.width < 1024 ? "48px" : "72px");
        assert.ok(state.hero.purposeLines <= 2.05);
        assert.equal(state.hero.actions.length, 2);
        assert.ok(state.hero.actions.every((action) => action.height >= 44 && action.bottom < viewport.height));
        assert.ok(state.hero.productsTop < viewport.height, "Products must begin in the first viewport");
        assert.deepEqual(await page.evaluate(() => window.__brandAnimations), [500, 500]);
        await page.screenshot({ path: path.join(output, `home-${viewport.width}.png`) });
        await page.reload({ waitUntil: "networkidle" });
        assert.deepEqual(await page.evaluate(() => window.__brandAnimations), [], "Brand animation must not replay in the session");
      }
      if (route === "/request-quote") {
        assert.ok(await page.locator("#sourcing-product-input").getAttribute("required") !== null);
        await page.screenshot({ path: path.join(output, `rfq-${viewport.width}.png`) });
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
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(path.join(output, "acceptance.json"), JSON.stringify({ evidence, errors, reducedMotion: "passed", clientNeedValidation: "passed", concurrentSubmitGuard: "passed", selectedProductWithoutRetyping: "passed" }, null, 2));
  console.log(`Redesign acceptance passed: ${evidence.length} page/viewport checks, Inter/type minimums, image loading, first-viewport actions, session motion and reduced motion. Screenshots: ${output}`);
} finally { await browser.close(); }

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { headerNavigationFailures } from "./route-smoke-contracts.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const originalFetch = globalThis.fetch;
const originalExtensions = new Map([".ts", ".tsx"].map((extension) => [extension, require.extensions[extension]]));
const headerFilename = path.resolve("src/components/layout/Header.tsx");
let headerState = [];
let headerStateCursor = 0;

// Exercise real SSR markup without a server, browser, or network access.
Module._resolveFilename = function resolve(request, parent, isMain, options) {
  return originalResolve.call(this, request.startsWith("@/") ? path.resolve("src", request.slice(2)) : request, parent, isMain, options);
};
Module._load = function load(request, parent, isMain) {
  if (request === "react" && parent?.filename === headerFilename) {
    return { ...React, useState: (initial) => [headerState[headerStateCursor++] ?? initial, () => {}] };
  }
  if (request === "@/components/sourcing/SourcingListProvider" && parent?.filename === headerFilename) {
    return { useSourcingList: () => ({ items: [], openDrawer: () => {} }) };
  }
  if (request === "next/navigation") return { useRouter: () => ({ push: () => {} }), usePathname: () => "/" };
  if (request === "next/script") return () => null;
  return originalLoad.call(this, request, parent, isMain);
};
for (const extension of originalExtensions.keys()) {
  require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
}
globalThis.fetch = () => { throw new Error("Static accessibility regression must remain offline"); };

function checkReferences(html) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "Rendered IDs must be unique");
  for (const match of html.matchAll(/\b(?:for|aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert.ok(ids.includes(id), `Missing label/ARIA target ${id}`);
  }
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(filename) : filename.endsWith(".tsx") ? [filename] : [];
  });
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear.reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

try {
  const { Header } = require("../src/components/layout/Header.tsx");
  const { productNavigationSegments } = require("../src/data/productNavigation.ts");
  // Render each disclosure state with real SSR hooks except the injected state.
  // Effects, focus movement, and hydration still require browser acceptance.
  for (const state of [[false, false, false], [false, true, false], [true, false, false], [true, false, true]]) {
    headerState = state;
    headerStateCursor = 0;
    const [menuOpen, productsOpen, mobileProductsOpen] = state;
    const html = renderToStaticMarkup(React.createElement(Header, { productNavigationSegments }));
    checkReferences(html);
    assert.deepEqual(headerNavigationFailures(html, menuOpen), []);
    for (const [id, expanded] of [["mobile-primary-navigation", menuOpen], ["products-segment-dropdown", productsOpen], ["mobile-products-navigation", mobileProductsOpen]]) {
      assert.equal(html.includes(`id="${id}"`), expanded, `${id}: panel must follow its disclosure state`);
      assert.equal(html.includes(`aria-controls="${id}"`), expanded, `${id}: controls must follow the rendered panel`);
    }
    assert.ok(headerNavigationFailures(html, !menuOpen).length > 0, "Smoke must reject the wrong Menu expansion state");
    if (menuOpen) {
      assert.ok(headerNavigationFailures(html.replace('id="mobile-primary-navigation"', ""), true).length > 0, "Smoke must reject a missing controlled panel");
    } else {
      const dangling = html.replace('aria-expanded="false"', 'aria-expanded="false" aria-controls="mobile-primary-navigation"');
      assert.ok(headerNavigationFailures(dangling).length > 0, "Smoke must reject dangling aria-controls on a closed Menu");
    }
  }
  const { SourcingIntakeForm } = require("../src/components/forms/SourcingIntakeForm.tsx");
  const { Field } = require("../src/components/forms/sourcing-intake/fields.tsx");
  const { SearchBox } = require("../src/components/ui/SearchBox.tsx");
  const { CatalogProductBrowser } = require("../src/components/products/catalog/CatalogProductBrowser.tsx");
  for (const compact of [false, true]) {
    const html = renderToStaticMarkup(React.createElement(SourcingIntakeForm, { compact, requestType: "quote" }));
    checkReferences(html);
    assert.match(html, /<form[^>]*aria-labelledby="sourcing-intake-title"/);
    assert.match(html, /<label[^>]*for="sourcing-email"[^>]*>Email<span[^>]*> \*<\/span><\/label>/);
    assert.match(html, /<input[^>]*id="sourcing-email"[^>]*required=""/);
    assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
    assert.match(html, /<button[^>]*type="submit"[^>]*disabled=""/);
  }
  const invalidField = renderToStaticMarkup(React.createElement("div", null,
    React.createElement(Field, { id: "email", label: "Email", value: "", invalid: true, describedBy: "email-error", onChange: () => {} }),
    React.createElement("p", { id: "email-error" }, "Enter email")
  ));
  checkReferences(invalidField);
  assert.match(invalidField, /aria-invalid="true" aria-describedby="email-error"/);

  const searches = renderToStaticMarkup(React.createElement("div", null,
    React.createElement(SearchBox, { helperText: "Search help" }),
    React.createElement(SearchBox, { helperText: "Sourcing help", destination: "sourcing" })
  ));
  checkReferences(searches);
  assert.equal([...searches.matchAll(/<input[^>]*aria-describedby="/g)].length, 2);

  const catalog = renderToStaticMarkup(React.createElement(CatalogProductBrowser, { rows: [] }));
  checkReferences(catalog);
  assert.match(catalog, /<fieldset/);
  assert.match(catalog, /<legend/);
  assert.match(catalog, /<button[^>]*aria-pressed="false"/);
  assert.match(catalog, /role="status"/);

  let disclosures = 0;
  for (const filename of sourceFiles("src")) {
    const source = ts.createSourceFile(filename, readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === "details") {
        const children = node.children.filter((child) => !ts.isJsxText(child) || child.text.trim());
        assert.ok(ts.isJsxElement(children[0]) && children[0].openingElement.tagName.getText(source) === "summary", `${filename}: details must start with native summary`);
      }
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === "summary") {
        disclosures += 1;
        const attributes = node.openingElement.attributes.getText(source);
        const heights = [...attributes.matchAll(/(?:^|["\s])min-h-(\d+)\b/g)].map((match) => Number(match[1]));
        assert.ok(heights.some((height) => height >= 11), `${filename}: summary needs an explicit touch height`);
        assert.doesNotMatch(node.getText(source), /<(?:button|input|select|textarea|a|Link)\b/, `${filename}: summary contains another interactive control`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }

  const palette = require("../tailwind.config.ts").default.theme.extend.colors.bioaxis;
  for (const background of ["#ffffff", palette.black, palette.panelSoft]) {
    const ratio = contrast(palette.dim, background);
    assert.ok(ratio >= 4.5, `Secondary text contrast ${ratio.toFixed(2)} on ${background}`);
  }
  assert.ok(contrast(palette.accent, palette.panelSoft) >= 3);
  assert.ok(contrast(palette.ice, "#111827") >= 3);
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(css, /\.field-focus:focus\s*\{[^}]*outline: 2px solid #0f4c81/);
  assert.match(css, /footer :where\(a, button\):focus-visible\s*\{\s*outline-color: #38bdf8/);
  assert.match(css, /input:not\(\[type="checkbox"\]\):not\(\[type="radio"\]\)/);
  console.log(`Static accessibility regression passed: four Header disclosure states/smoke contracts, form labels/ARIA, named errors, search help, filter state, ${disclosures} native disclosures, palette contrast, and focus CSS.`);
} finally {
  Module._resolveFilename = originalResolve;
  Module._load = originalLoad;
  globalThis.fetch = originalFetch;
  for (const [extension, handler] of originalExtensions) {
    if (handler) require.extensions[extension] = handler;
    else delete require.extensions[extension];
  }
}

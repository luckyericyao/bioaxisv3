# BioAxis accessibility acceptance checklist

## Static component coverage

The local review covers forms, navigation, the sourcing-list drawer, product search and filters, native disclosures, action links, and shared color/focus styles.

- Email validation exposes `aria-invalid` and an existing error description, then focuses Email, including on repeated invalid submissions. The intake form has a heading-derived name. Success keeps confirmation and reference text in a polite status region, moves focus to Start another request outside that region, and returns focus to Email when starting again.
- Search help is associated with its input. Catalog filters expose toggle state with `aria-pressed`, use `fieldset`/`legend` grouping, and announce the matching count. Loading more search results moves focus to the first newly added result.
- Collapsed navigation omits references to unmounted panels. The Products dropdown exposes ordinary navigation links and stays open while a child retains keyboard focus. Escape restores focus to the Products trigger.
- Opening the sourcing-list dialog makes page content `inert`. Tab wraps among visible dialog controls. Closing restores a connected trigger or falls back to main content. Removing an item focuses the next removal action or Close. The empty list has a status message and disabled send action. Page and RFQ navigation close the drawer.
- Native `details`/`summary` semantics provide expanded/collapsed state. Source disclosures have an explicit minimum height of at least 44px and contain no nested interactive controls. Decorative plus signs are hidden from assistive technology. Reviewed buttons and action links use explicit 44px heights, and compact Compare labels provide a 44×44px target. Coarse-pointer sizing excludes checkbox/radio glyphs so their labels carry the larger target.
- Secondary text `#5b6b82` replaces `#64748b`, whose contrast on `#eef3f8` was approximately 4.26. The static gate checks at least 4.5 for secondary text on white, page, and soft-panel backgrounds. Input focus uses an opaque accent outline, focusable scroll regions receive an outline, and footer links use a light focus outline on the dark footer. The homepage document action uses dark green, and the primary disclosure hint inherits its hover text color.

Run the offline gate with the existing dependencies.

```bash
node scripts/accessibility-static-regression.mjs
```

It renders the actual full/compact intake, error field, two search boxes, and an empty catalog filter panel. It checks unique IDs and label/ARIA references, required Email, disabled initial submission, persistent status markup, filter semantics, all native disclosure structures, palette contrast, and focus CSS. Browser focus movement and computed layout remain separate acceptance checks.

Run the offline gate for each candidate build. Browser focus movement, computed layout, VoiceOver announcements, hover/disabled rendering, tap bounds, and reflow need the browser and manual checks below. The script inventory covers the other offline regressions and URL-dependent probes. [Regression checks](regression-checks.md)

## Browser and assistive-technology acceptance

Build and start the app locally, then run the automated check against that build.

```bash
npm run test:a11y-checklist -- http://localhost:3000
```

The script is a release gate for `/`, a populated product search, product sourcing templates, `/request-quote`, and `/trust-center`. It verifies:

- skip link, landmarks, labels, persistent RFQ live status, keyboard-open and Escape-close behavior;
- on a local build, simulated network, durable-write, non-JSON WAF 429, and reference-conflict failures preserve email, product context, search input, and sourcing-list objects; every retry uses a fresh verification token while keeping the same request ID until an explicit new-reference action;
- a fail-closed server-rendered submit state and a simulated Turnstile configuration failure that keeps the request disabled while preserving entered data;
- approximately 44 px mobile controls, hidden RFQ source paths, and 320 px overflow/context wrapping;
- retained mobile search input, the first result and its first action inside the 390 px initial viewport, search-to-detail-to-RFQ query preservation, and a Products-menu search handoff that closes navigation after two choices;
- Tab access to all 12 desktop product segments, Escape focus restoration, sourcing-drawer focus wrapping, and a list-to-RFQ handoff with Email inside the 390×844 first viewport;
- sourcing-drawer background isolation, deletion of its final item with focus retained on Close, empty-list status/disabled submission, same-page View page focus restoration, and drawer closure on RFQ handoff;
- actual quote, sample, and equivalent navigation from six canonical/legacy item pages preserves exact product, family, category, and segment names and selects the matching optional request type; local retry checks also preserve supplier, catalog reference, quantity, custom timing, document requirements, and distinct product/search source URLs;
- axe-core WCAG 2 A/AA, WCAG 2.1 A/AA, and WCAG 2.2 AA rules, including visible text color contrast;
- reflow at 640 px and 320 px CSS viewports, equivalent to 200% and 400% zoom from 1280 px, including focused controls beneath the sticky header;
- WCAG text-spacing overrides without horizontal overflow or clipped text.

For deployed URLs, navigation is retried up to three times when the browser cannot connect; a persistent failure reports the exact URL after the final attempt. Set `A11Y_NAV_RETRIES` only when diagnosing network behavior. Local checks remain single-attempt so application failures are not hidden.

Mocked RFQ and Turnstile failure checks run only against local builds, and the report labels them as skipped for deployed URLs. Their passing result does not prove completion of a real Cloudflare challenge or a production durable write. The deployed drawer test changes only isolated browser storage and does not submit an RFQ.

Complete these assistive-technology and visual spot checks on the same critical routes before each production release. They complement rather than replace the automated gate:

- Keyboard: use Tab, Shift+Tab, Enter, Space, and Escape without a pointer. Focus must remain visible, follow reading order, reach every action, and never become trapped.
- Form transitions and search pagination need a keyboard spot check. Invalid Email must receive focus with its error description. Success must announce the reference and focus Start another request, which returns to Email. Show next 12 must focus the first newly added result, including when the pagination button disappears.
- Native disclosures need an Enter/Space spot check. Confirm expanded/collapsed state is announced, hidden content is excluded from Tab order, and the focus outline remains visible.
- Screen reader: with VoiceOver on macOS/iOS, navigate by landmarks and headings; confirm form labels, required state, verification completion, errors, success, and the request reference are announced once and in context.
- Zoom/reflow: spot-check actual browser zoom at 200% and 400% and compare with the automated reflow result.
- Text spacing: spot-check the automated WCAG text-spacing result in one desktop and one mobile browser.
- Contrast: visually confirm focus, hover, disabled, success, warning, and error states; axe-core automatically gates visible default-state text contrast.
- Mobile: at 320 px and 375 px, confirm tap targets are approximately 44 by 44 px, the RFQ context is one column, no long source path is shown, and no value wraps one character per line.
- Scientific units: run `npm run test:units-visual`; the gate verifies exact DOM text, computed casing, accessibility-tree exposure, and announced unit text. Visually inspect the µL, µm, mL, and °C screenshots as the final glyph check.

Record browser, operating system, assistive technology, tester, date, failures, and evidence links in the release notes. A build is not accessibility-accepted while a critical-path failure remains open.

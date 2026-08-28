# BioAxis accessibility acceptance checklist

Run the automated check against a local or deployed build:

```bash
npm run test:a11y-checklist -- https://bioaxisv3.vercel.app
```

The script is a release gate for `/`, a populated product search, one product sourcing template, and `/request-quote`. It verifies:

- skip link, landmarks, labels, persistent RFQ live status, keyboard-open and Escape-close behavior;
- a simulated durable-write failure that preserves the email and announces an alert, followed by a simulated success that announces its reference in a polite status region;
- approximately 44 px mobile controls, hidden RFQ source paths, and 320 px overflow/context wrapping;
- retained mobile search input, the first result and its first action inside the 390 px initial viewport, and a Products-menu search handoff that closes navigation after two choices;
- axe-core WCAG 2 A/AA, WCAG 2.1 A/AA, and WCAG 2.2 AA rules, including visible text color contrast;
- reflow at 640 px and 320 px CSS viewports, equivalent to 200% and 400% zoom from 1280 px, including focused controls beneath the sticky header;
- WCAG text-spacing overrides without horizontal overflow or clipped text.

Complete these assistive-technology and visual spot checks on the same four routes before each production release. They complement rather than replace the automated gate:

- Keyboard: use Tab, Shift+Tab, Enter, Space, and Escape without a pointer. Focus must remain visible, follow reading order, reach every action, and never become trapped.
- Screen reader: with VoiceOver on macOS/iOS, navigate by landmarks and headings; confirm form labels, required state, verification completion, errors, success, and the request reference are announced once and in context.
- Zoom/reflow: spot-check actual browser zoom at 200% and 400% and compare with the automated reflow result.
- Text spacing: spot-check the automated WCAG text-spacing result in one desktop and one mobile browser.
- Contrast: visually confirm focus, hover, disabled, success, warning, and error states; axe-core automatically gates visible default-state text contrast.
- Mobile: at 320 px and 375 px, confirm tap targets are approximately 44 by 44 px, the RFQ context is one column, no long source path is shown, and no value wraps one character per line.
- Scientific units: run `npm run test:units-visual`; the gate verifies exact DOM text, computed casing, accessibility-tree exposure, and announced unit text. Visually inspect the µL, µm, mL, and °C screenshots as the final glyph check.

Record browser, operating system, assistive technology, tester, date, failures, and evidence links in the release notes. A build is not accessibility-accepted while a critical-path failure remains open.

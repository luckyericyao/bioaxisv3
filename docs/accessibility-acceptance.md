# BioAxis accessibility acceptance checklist

Run the automated check against a local or deployed build:

```bash
npm run test:a11y-checklist -- https://bioaxisv3.vercel.app
```

The script verifies the skip link, landmark/label semantics, keyboard-open and Escape-close behavior, live RFQ status, approximately 44 px mobile controls, and 320 px overflow/context wrapping.

Complete these human checks on `/`, `/products?q=filtered%20200%20%C2%B5L%20tips`, one product template, and `/request-quote` before each production release:

- Keyboard: use Tab, Shift+Tab, Enter, Space, and Escape without a pointer. Focus must remain visible, follow reading order, reach every action, and never become trapped.
- Screen reader: with VoiceOver on macOS/iOS, navigate by landmarks and headings; confirm form labels, required state, verification completion, errors, success, and the request reference are announced once and in context.
- Zoom/reflow: at 200% and 400% browser zoom, confirm no two-dimensional scrolling is needed at a 1280 px viewport, content is not clipped, and sticky navigation does not cover focused controls.
- Text spacing: apply WCAG text-spacing overrides (line height 1.5, paragraph spacing 2, letter spacing 0.12em, word spacing 0.16em); confirm no content or controls overlap.
- Contrast: check normal text at 4.5:1, large text at 3:1, controls/focus indicators at 3:1, including hover, focus, disabled, success, warning, and error states.
- Mobile: at 320 px and 375 px, confirm tap targets are approximately 44 by 44 px, the RFQ context is one column, no long source path is shown, and no value wraps one character per line.
- Scientific units: run `npm run test:units-visual`; visually inspect µL, µm, mL, and °C screenshots and confirm the rendered glyphs match the DOM and announced text.

Record browser, operating system, assistive technology, tester, date, failures, and evidence links in the release notes. A build is not accessibility-accepted while a critical-path failure remains open.

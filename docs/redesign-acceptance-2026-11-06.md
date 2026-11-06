# BioAxis redesign acceptance register

Specification: `BioAxis_改版实施方案_2026-11-05.md`, adopted as the execution specification. The desktop/mobile concept pair was explicitly approved with "按这组稿实施". Base checkout: `bfaca0e`, `main`.

## Delivered implementation

- Local Inter variable font with its complete OFL license, readable fallback and common 400/500/600 typography. White/cool-gray surfaces, ink text and restrained blue actions replace the prior grid/glow background and default uppercase utilities.
- Home: accessible BioAxis H1, one purpose sentence, Browse products and Request sourcing, then five product entries, sourcing support, quality/documents and contact. No homepage email form. Private label/OEM is a service entry rather than a sixth product category.
- Navigation: Products, Sourcing support, Quality & trust and Contact, plus Request quote. Support groups the existing availability, equivalent and OEM routes. Products retains its search link and twelve segment links. Secondary routes remain in the footer.
- Brand animation: 500 ms, opacity/transform only, once per session, reserved layout, static reduced-motion/storage-failure fallback. Links are usable without waiting for an intro.
- RFQ: need first, compact selected context/list, Email, collapsed optional details, verification and one submit. List editing opens the existing drawer. Selected items satisfy the need without retyping.
- Shared client/server need validation accepts meaningful text, references, real product/category context or nonempty selected items. Email alone, blank templates, empty objects/lists and generic service labels do not qualify. All request types, route aliases, source/query/UTM, product hierarchy, list payloads, Turnstile, honeypot, byte limits, request references and retry behavior remain.
- Real third-party reference photographs replace homepage concept imagery. Source, creator, license, crop and checksums are recorded in `docs/redesign-hero-asset.md` and `public/images/redesign/attribution.json`; public image credits disclose authorship and non-endorsement. These images do not represent BioAxis stock or facilities.
- Existing analytics receives homepage entry/action timings and document-level LCP/INP/CLS through Next's Web Vitals hook. Automated browsers and Do Not Track are excluded from these new observations. No new notification or email provider was added.
- Release dependency maintenance: Next/eslint config 15.5.29, sharp 0.35.5, compatible undici/source-map patches, and a scoped Zod override. No forced major framework upgrade or Blob downgrade.

## Acceptance evidence

| Gate | Evidence / status |
| --- | --- |
| G1, five-second comprehension | Pending real participants. Use `docs/redesign-user-check.md`. No synthetic participant results. |
| G2, ten-second task selection | Pending real participants. Same test kit, separately scored tasks. |
| G3, concise first viewport | Browser captures at 1440x900, 1366x768, 390x844 and 320px. One brand/purpose/two-action hero; Products begins in the first viewport. |
| G4, nonblocking motion | 500 ms calls, session reload without replay, reduced-motion static capture; no overlay or entrance gate. |
| G5, common type | Fifteen routes across four viewports (60 checks): Inter, no forced uppercase, no visible information text below 14px. Explicit prose lists, descriptive spans and table cells are asserted at 16px/25px/400; helper text remains 14/21. Page/section/card scales follow shared tokens. |
| G6, compact RFQ | Need before Email; context/list retained; optional details closed; one submit. Shared need and client submission regression cases cover blank and selected-product paths. |
| G7, responsive/keyboard | Accessibility regression checks mobile, 320px, 200%/400% zoom-equivalent reflow, text spacing, menu keyboard/Escape, drawer focus lock/restoration and unobscured actions. |
| G8, reliable states | Local queue tests and browser simulations cover validation, network/503/429 errors, fresh verification, preserved payloads, repeated submit events, 409 reference recovery and server-confirmed success. Test fixtures remain local. |
| G9, readability | Ink/white 16.26:1; secondary/white 6.37:1; secondary/cool-gray 6.07:1; action/white 7.39:1; input border/white 3.66:1. Axe checks six critical routes, including contrast and semantics. |
| G10, real-user p75 | Pending a real traffic window after release. LCP <=2.5s, INP <=200ms, CLS <=0.1 are targets, not achieved claims. Lab results cannot replace field data. |

## Repeatable validation

```sh
npm run lint
npm run build
npm test
npm run test:sourcing-need
SMOKE_BASE_URL=http://127.0.0.1:3012 npm run smoke
npm run test:rfq-payload -- http://127.0.0.1:3012
npm run test:a11y-checklist -- http://127.0.0.1:3012
REDESIGN_QA_DIR=artifacts/redesign-qa npm run test:redesign
npm audit --omit=dev
```

Use a fresh local production server for smoke, then run browser suites. Repeated concurrent suites can legitimately hit the existing analytics limit; do not weaken rate protection to make tests green.

`npm test` retains request-type aliases, taxonomy/search rankings, family/category routes and contexts, structured data, queue behavior, trust evidence, release health, static accessibility, client data boundaries and round-trip safeguards. The new need test exercises the actual API handler with a local queue mock. Browser RFQ responses are explicitly simulated, never real customer submissions.

## Post-release observation

Observe comparable device/source cohorts for about fourteen days; extend if traffic is insufficient. There is no historical conversion baseline and no claimed percentage lift.

| Metric | Prospective definition |
| --- | --- |
| Home to product entry | `cta_click` with `cta=homepage_navigation` and a Products destination, relative to `homepage_view`; deduplicate by request/session reference. |
| First useful action | First homepage navigation event, `msSinceHomeInteractive`. This measures from interactive home mount, not network navigation start; retain that definition in comparisons. |
| RFQ completion | Server-confirmed `rfq_success` relative to first-focus `rfq_start`, grouped by request reference and device/source where available. |
| Meaningful requests | Valid contact plus meaningful product/reference/category/list, enforced by shared validation; do not treat email count alone as success. |
| Errors | Distinguish client validation, Turnstile, network/rate-limit and queue errors. Retry attempts are not distinct leads. |
| Field performance | Group `web_vital` by metric, entryPath and mobile/desktop. Library document-level metrics are not SPA route timings. Calculate p75 only after collecting sufficient real samples. |

The existing server event sink logs events and uses PostHog only if already configured. Production collection and the observation window must be checked independently of local browser fixtures. This register does not mark G1/G2/G10 or the business observation period as passed.

## Typography follow-up, 2026-11-06

Review found that the paragraph rule did not cover prose rendered as lists, descriptive spans or table cells. Scoped `body-copy` markers now cover those components, with shared 16px/25px/400 rules for prose and table data. Navigation, buttons and compact specification labels retain their separate scales. No taxonomy, routes, copy or intake behavior changed.

Passed after this fix: lint, production build (1,027 generated pages), full offline `npm test`, route smoke, expanded 60-view redesign acceptance and the browser accessibility checklist. The latter retains product context, three-action mobile product headers, drawer focus, keyboard navigation, error/retry states, zoom/text-spacing and six-route axe coverage. A direct in-app-browser check also confirmed readable quality-page lists at 390x844 and computed 16px/25px/400 styles.

G1/G2 remain pending: the owner will provide real participant results later. No participant or field-performance outcome is inferred from these automated checks.

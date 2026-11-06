# BioAxis Systematic Design QA

Date: 2026-11-07. This report supersedes the earlier short, light-hero comparison. It verifies implementation quality, not conversion improvement.

## Source And Implementation

Approved source root: `/Users/ericyao/.codex/generated_images/019ed90d-e047-7562-b4f2-20c91c6994ad/`.
Evidence root: `/Users/ericyao/Documents/Codex/2026-06-18/files-mentioned-by-the-user-you/artifacts/bioaxis-systematic-2026-11-06/`.

| Target | Approved source | Source pixels | CSS viewport / implementation pixels |
| --- | --- | --- | --- |
| Desktop Home | `exec-1bb775e0-c9ef-485f-9271-58b21b2ece27.png` | 1487x1058 | 1440x1024 |
| Mobile Home | `exec-7c3e22a0-ccce-4e40-8735-c0bed9712fdc.png` | 853x1844 | 390x844 |
| Desktop configuration | `exec-70ed421a-24ed-4a17-aa0d-871594317386.png` | 1487x1058 | 1440x1024 |
| Mobile configuration | `exec-a5165c45-b159-48af-9b1b-e3040899a931.png` | 852x1846 | 390x844 |

Sources are approximate generated designs, not browser exports. They were normalized to the listed CSS frame with less than 0.3% aspect-ratio difference. Implementation screenshots are browser content at device scale 1, without browser chrome. Source is left and implementation right in each `*-comparison.png`; desktop combined images are 2880x1024, mobile 780x844.

Full views inspected together: `home-desktop-comparison.png`, `home-mobile-comparison.png`, `configuration-desktop-comparison.png`, `configuration-mobile-comparison.png`.
Focused comparisons inspected together: `home-mobile-focus.png` and `configuration-mobile-focus.png`, 780x700, aligned crops starting at y=110. These make heading wrapping, image crop, target table and actions readable at native mobile scale.

Implementation screenshots: `home-desktop.png`, `home-mobile.png`, `configuration-desktop.png`, `configuration-mobile.png`. Default menus are closed; configuration state is the existing filtered 200 µL target, not a new supplier product. Local implementation: production build at `http://127.0.0.1:3012`.

## Fidelity Surfaces

| Surface | Review |
| --- | --- |
| Fonts / typography | Self-hosted Inter, normal case, zero letter spacing, controlled 400/500/600 hierarchy. Hero 68/74 desktop and 40/44 mobile; configuration 36/44 and 30/38. Mobile retains the approved four-line claim. Body stays 16/25 rather than copying smaller raster mock lettering. |
| Layout / rhythm | Dark, unframed consumable scene and left claim; two immediate actions; no product directory in the opening. A hint of the next light value band remains. Bright configuration uses desktop columns and a vertical mobile image/table. Three primary configuration actions fit 390x844. |
| Color / tokens | Ink, cool white, teal and subdued borders follow the brief. White homepage navigation switches to ink panels. Search highlighting was corrected to ink on light teal; focus boundaries remain visible. |
| Images / assets | Standalone bitmap assets, not code-drawn substitutes or a rasterized interface. Clear tips/rack subject matches the direction. Mobile framing exposes tip tops. Configuration illustration is explicitly not a confirmed supplier product; unrelated products do not inherit it. Existing reference photos retain credits. |
| Copy / content | Approved brand claim/purpose retained. Canonical product title/slugs remain authoritative instead of concept capitalization. Target versus To confirm is explicit. Additional explanations/actions stay accessible below or in disclosures. |

## Correction History

| Finding | Fix | Post-fix evidence |
| --- | --- | --- |
| P1: mobile breadcrumbs and prose pushed actions below 844px | Immediate-parent mobile breadcrumb; full desktop/structured breadcrumb retained; concise summary and four key rows; no smaller body text | `configuration-mobile.png`, viewport action checks |
| P2: mobile Home cropped tip tops; configuration image was too small | Taller Home image with adjusted framing; 220px mobile configuration image frame | Updated full-view and focused comparisons |
| P2: hero type/layout differed from approved composition | 500-weight four-line mobile claim, bounded desktop lines, 1280px inner width, near-screen brand opening | Home paired comparisons |
| P1: long general-template labels and raw RFQ specs displaced actions/Email | Short requirement labels; concise RFQ summary with original fields under More context; data/payload unchanged | General microcentrifuge configuration and all three RFQ handoffs tested |
| P1: search mark contrast failed axe after palette change | Ink foreground on 10% teal background | Six-route axe A/AA browser pass |

## Accepted Product Constraints

- Shared desktop navigation stays right-aligned rather than copying the mock's left-spread links; all four groups plus quote are present and keyboard-operable.
- The implementation uses 16px specification data and 44px+ controls, so mobile lower disclosures start later than in the compressed mock. Fields and all three actions remain in view; no text was shrunk to reproduce the raster.
- Configuration uses existing source fields, not the concept's illustrative pipette/platform field. Supplier-confirmation boundaries remain.
- Representative art is disclosed, not inventory or supplier evidence. Approved product photography remains a future replacement, not a hidden missing dependency.

No actionable P0/P1/P2 visual findings remain within the approved targets and readable-type constraints. P3 follow-up: approved, consistently lit product photography can replace representative art when available.

## Functional Evidence

- Explore scrolls to the value band at y=88 below the sticky header; no mandatory entry gate.
- Direct CUA: desktop Products keyboard open, 12 segments, Escape/focus restoration; mobile Escape; configuration-to-RFQ context; responsive screenshots.
- Responsive suite: 15 routes at 1440/1366/390/320 widths, type minima, no overflow/broken images, session motion/reduced motion and runtime-error collection.
- Browser accessibility suite: drawer focus lock/restoration, 44px controls, first mobile search result, selected RFQ Email, 200%/400% zoom-equivalent reflow, text spacing and axe A/AA on six routes.
- Local RFQ fixtures: invalid input, network/503/non-JSON 429/409 recovery, preserved values/context/list, fresh verification state, duplicate-submit guard and server-confirmed reference UI.
- Filter fixture: exact versus opt-in unknown fields, closed mobile filters, result-to-configuration-to-RFQ brief and one-action no-match path.

Machine screenshots/state are in repository-ignored `artifacts/redesign-qa/`. These tests do not assert production CAPTCHA completion or human response.

## Delivery Checklist

- Approved desktop/mobile Home and configuration implemented and compared.
- Search/filter, hierarchy, RFQ context, quality evidence and grouped navigation delivered.
- Existing routes, cautious language, security and retry behavior preserved.
- Enterprise evidence and real-user/long-term observations remain separate; see `docs/systematic-design-implementation.md`.

final result: passed

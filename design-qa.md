# BioAxis redesign visual QA

Date: 2026-11-06. Scope: approved desktop/mobile direction and the adopted execution specification, not an assertion of conversion improvement.

## Visual truth and rendered evidence

Evidence root: `/Users/ericyao/Documents/Codex/2026-06-18/files-mentioned-by-the-user-you/artifacts/bioaxis-redesign-2026-11-05`.

- Source: `home-desktop-design.png` (1586x992) and `home-mobile-design.png` (852x1846), the explicitly selected responsive pair.
- Browser implementation: `implementation/home-1440.png` (1440x900), `home-1366.png` (1366x768), `home-390.png` (390x844), `home-320.png` (320x844), and corresponding `rfq-*.png`.
- Combined full-view comparisons: `implementation/comparison-desktop.png` (2880x900) and `comparison-mobile.png` (780x844). Source is on the left, implementation on the right.
- Focused comparison: `implementation/comparison-hero-focus.png` (1300x260), same 650x260 desktop copy/action regions side by side.
- Machine evidence: `implementation/acceptance.json`; state is production build, default light theme, menus closed, unfilled RFQ. Device scale factor 1. No browser chrome is included.
- Source rasters were normalized to 1440x900 and 390x844 for the combined inputs. They are approximate generated concepts rather than exact CSS exports. The document's explicit font, spacing and control dimensions take precedence over generated raster lettering.

## Fidelity surfaces

| Surface | Observed outcome |
| --- | --- |
| Fonts/typography | Real self-hosted Inter, zero letter spacing, normal case. Home brand 72/76 desktop and 48/52 mobile; purpose 24/34 and 20/28. Body 16/25, helpers 14/21, navigation/actions 14/20. The implementation deliberately does not copy the concept raster's larger/inconsistent lettering. Brand is one accessible H1. |
| Spacing/layout | Centered 1200px content, 20px mobile gutters, 72/64px header, natural-height hero, two actions, Products immediately below it. Actual mobile rows retain the specified readable body size and 48px section spacing; more product entries continue below the viewport instead of copying the concept's compressed five-row fit. No standalone mobile hero photograph. |
| Colors/tokens | White and cool-gray surfaces, ink and secondary text, restrained blue actions. No original grid/glow background. Opaque menus and visible input/focus boundaries. Measured text contrast is 6.07:1 or higher for the specified secondary/primary/action combinations. |
| Images/assets | Real reference photographs with source/creator/license/change records and visible footer credits, not copied concept-generated products or code-drawn substitutes. Subjects are correctly identified consumables. The real-photo replacement is an intentional execution-spec constraint; it does not purport to be BioAxis stock. Images load at all tested widths. The desktop photo is unframed with a soft left mask; no decorative media card. |
| Copy/content | BioAxis + the approved one-sentence purpose and two hero actions. Five product entries, separate OEM service path, sourcing support, quality/documents and contact. No old long hero, inline home form or Email-only badge. RFQ starts with the need and retains selected context before Email. |

## Comparison and correction history

Pre-comparison browser inspection found a missing hero asset, an unstyled plain section heading and mobile action displacement after the type migration. These were corrected with a real licensed asset, shared heading rules, shorter helper copy and tighter decision/search spacing. No typography was shrunk below the specified minima to fix the mobile layout.

The normalized paired full views and focused copy/action region were then inspected together. Remaining visible differences from the concepts are the intentional real-photo substitution, exact document type sizes, solid specified colors and non-compressed mobile list rhythm. These are documented constraints, not unreported pixel-match claims.

Post-fix browser evidence covers:

- Home and RFQ at 1440x900, 1366x768, 390x844 and 320px; all hero actions visible, Products begins in the first viewport, no horizontal overflow or missing images.
- Desktop Products focus/hover, twelve segment links, support grouping, Escape, blur and outside close. Mobile accordions and focus restoration, including a direct CUA check of the support paths and Escape from RFQ.
- Source/product/list handoff, requirement-before-Email order, collapsed details, validation error focus, one submit action and selected context without retyping.
- Local simulations of network/503/429/409/retry and success; no customer submission is used as a test fixture.
- Drawer focus entry/lock/restoration, 44px controls, 200%/400% zoom-equivalent reflow and WCAG text-spacing overrides.
- 500ms first-session motion and reduced-motion static rendering.
- Browser runtime-error capture plus a direct CUA console warning/error check (empty). Axe semantics and color checks on six critical routes.

Follow-up typography check: prose lists, descriptive spans and table data had retained some legacy 14px sizing outside the paragraph rule. These now use 16px/25px/400 body styles. The expanded browser suite passed 15 routes at four widths (60 checks), and a direct 390x844 quality-page screenshot/computed-style inspection confirmed readable lists without horizontal overflow. Homepage structure/assets are unchanged; the paired visual comparisons above remain applicable. The full accessibility suite passed again after the fix.

## Findings

No actionable P0/P1/P2 visual implementation findings remain within this comparison scope.

P3 follow-up: customer-owned, consistently lit studio photography could replace the licensed reference photos later without changing layout, product claims or routes. The current references are real, credited and usable; no unavailable commercial asset is being represented as delivered.

## Implementation checklist

- Shared type, palette, controls, home, navigation and compact RFQ implemented.
- Full-view and focused comparisons inspected; intentional differences recorded.
- Responsive, keyboard, reduced-motion, context and submission-state evidence retained.
- G1/G2 participant checks and G10 field observations remain separate, unrun acceptance gates in `docs/redesign-acceptance-2026-11-06.md`.

final result: passed

# BioAxis systematic design implementation

Execution date: 2026-11-07, Asia/Shanghai. Baseline: `3e9ee12`.
Authoritative owner brief: `BioAxis-Systematic-Design-Plan (1).md`, SHA-256 `505bb8803103c75ec219c0ab09b8627b676c867213f2f612066f4e66970cc2c5`.

The owner selected Home direction 1 and explicitly approved the matching mobile Home and desktop/mobile configuration designs. This replaces the previous light, short homepage opening. Historical acceptance reports describe their own release, not this redesign.

## Eight Deliverables

| Deliverable | Implementation | Verification |
| --- | --- | --- |
| Desktop/mobile Home | Brand opening, value statement, three tasks, five selected product areas, document/sample evidence paths, service process, request entry | Same-size comparisons in `design-qa.md`; responsive acceptance |
| Results and filters | Existing ranked search retained; `/products?view=configurations` compares the 22 existing specific sourcing templates | Exact-field offline regression; no invented SKU index; mobile filters initially collapsed |
| Configuration template | Both taxonomy and legacy product branches use `SourcingConfigurationOverview` | Visible target/confirmation table, primary quote, secondary sample/equivalent, complete deeper routes retained |
| RFQ states | Selected product and up to three source specifications visible; hierarchy/source under More context | Existing verification/error/retry/success fixtures retained; selected product requires no retyping |
| Quality & Documentation | Document package, supplier evidence and buyer responsibilities retained; one concise missing-business-information notice | No certificates, entity details, business contacts or response promises fabricated |
| Shared system | Grouped navigation/footer, Inter, shared scale, light catalog pages, dark brand opening | Header disclosure states, keyboard/focus, static contrast and browser accessibility checks |
| Image specification | WebP generated illustrations with manifest; existing reference-photo credits retained in footer | Subject/crop check at desktop/mobile; generated art is explicitly not supplier/product/inventory evidence |
| Copy/fact verification | Checklist below plus existing owner-intake schema | Evidence gating remains authoritative; no placeholder owner facts published |

## Selection And Context

- Default directory remains 12 segment cards, not a family dump.
- Search, category and family URLs remain directly addressable with unchanged slugs.
- Specific configurations appear before general templates; general templates remain collapsed. Canonical configuration cards offer one clear next step.
- Segment/category pages link directly into configuration comparison. Family pages lead with configuration choice rather than competing RFQ actions.
- Field filters compare explicit target values, not description substrings. Sterile does not match Non-sterile. Ambiguous/unknown fields are excluded unless the buyer opts in; these rows are marked as needing confirmation.
- Filter options describe buyer requirements, not available stock. No exact match means one requirement-submission action.
- Query and filter brief follow the configuration into RFQ. Existing product hierarchy, source page and request type remain intact. Browser-owned sourcing lists are not erased.
- Search references still distinguish unverified catalog inputs from taxonomy matches. The new template count is not a manufacturer SKU or inventory count.

## Component And Asset Rules

| Role | Rule |
| --- | --- |
| Color | Ink `#102A43`, body `#253746`, secondary `#526575`, cool white `#F7F9FB`, line `#D9E3E8`, action `#0B7F86` |
| Type | Inter 400/500/600; body 16/25; helper 14/21; mobile hero 40/44, desktop hero 68/74; configuration 30/38 mobile, 36/44 desktop |
| Width | 1,280px desktop inner content, responsive 20/32px gutters |
| Actions | 44px minimum targets; one filled primary, secondary actions visually quieter; additional procurement actions disclosed |
| Motion | One nonblocking 500ms introduction per session; reduced-motion preference respected; no entry gate |
| Photography | Reference photos remain licensed and attributed; no fog mask or fabricated supplier attribution |
| New art | `public/images/systematic/manifest.json` identifies generated illustrations, uses and evidence limitations |
| Replacement | Replace illustration only with an approved asset whose source, license, representative/product status and intended family are recorded; do not silently turn an illustration into a supplier claim |

## RFQ State Contract

| State | Behavior retained |
| --- | --- |
| Empty | Need input and email, optional procurement details disclosed |
| Selected context | Product/key specifications immediately visible; no need to retype a real selected product |
| Verification loading/failure/expiry | State communicated and submission protected; retry remains available |
| Invalid input | Named error, field focus, draft retained |
| Submitting | In-flight guard prevents duplicate client calls |
| Retryable/server error | No false success; values retained for retry |
| Success | Server-confirmed stored reference shown; no fabricated delivery or response promise |

Browser fixtures intercept only local test requests. They do not weaken production Turnstile, queue validation, payload/rate protection or server-side authority.

## Copy And Company Verification Checklist

- [x] Product hierarchy remains data-driven; no fake configurations, price, stock or supplier relationships added.
- [x] Buyer target is distinct from confirmed supplier specification and document availability.
- [x] No mandatory splash, internal visual-direction label or fake customer outcome appears in the UI.
- [x] Missing legal entity, operating region, enterprise contact and response policy remain explicitly unconfirmed when evidence is absent.
- [x] Supplier documents are not represented as BioAxis certification or buyer-side quality release.
- [ ] Owner-approved enterprise facts and publishable, appropriately redacted evidence: supply through `docs/public-trust-owner-intake.md` when available.
- [ ] Real target-user recognition/entry testing and post-release conversion observation: remain external observations, not technical pass claims.

The last two items are intentionally not fabricated and do not prevent shipping the implemented design. No new notification provider, account, cart, payment or inventory system was introduced.

## Local Continuation Review

The approved direction is appropriate: brand opening and procurement value are separate from product selection, while configuration targets remain distinct from supplier evidence. More new content or another visual direction is not the next priority. The current risk is whether that design survives real context, long fields, mobile layouts and retries.

| Priority / goal | Why first | Acceptance |
| --- | --- | --- |
| P0: stabilize the existing WIP | A render or HTTP 200 does not establish working interactions | Lint, TypeScript, production build, offline regressions and route smoke pass on the same worktree |
| P0: preserve a usable context-to-RFQ path | With both product context and a saved list, Email was below the 390x844 first viewport | Email remains fully visible at 390/320px, selected product and original fields remain accessible, mock submission retains list quantity and specifications, no production submission |
| P1: make configuration comparison honest and reversible | Pending values can look specific; a hidden category could remain after changing product line | Unknown/multi-option fields are not exact targets, conflicting targets stay excluded, changing product line clears category, filters follow into RFQ |
| P1: responsive and accessibility regression | Shared template changes affect many deep routes | 1440/1366/390/320 viewport checks, no horizontal overflow, three mobile configuration actions, complete fields in disclosures, keyboard/drawer/focus and axe checks |

Corrections in this local round:

- Email now precedes context/list summaries; the product input still precedes Email and optional procurement details remain collapsed.
- Legacy product-level specifications and document notes take precedence over generic family context. Structured source fields, rather than tags alone, reach RFQ.
- Empty, pending, TBD/TBC, unknown and array-valued alternatives are marked for confirmation. Field whitespace is normalized; explicit Sterile/Non-sterile matching remains exact.
- Category is an explicit filter, cleared when product line changes, instead of a hidden persistent constraint. Full taxonomy content remains server-side.
- Added context-plus-list mobile and legacy-context browser regressions; the configuration offline regression is now part of `npm test`.

This continuation began as local validation. The approved systematic design was subsequently committed and pushed as `a762a47`; production readiness verified that exact release. Scope/context corrections require the same release checks before inclusion. This note does not authorize production environment or secret changes. Owner-approved company evidence and real-user observations remain outside this technical round.

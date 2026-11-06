# Redesign observation protocol

This is the execution-spec stage E tool and measurement contract, not a claim that the observation window or G10 has passed. G1/G2 participant results are recorded separately in `redesign-user-check.md`.

## Collection prerequisite

Production currently uses the existing console-event sink unless PostHog is already configured. A successful analytics POST in `mode: logs` does not establish a durable fourteen-day history. Verify log retention/export coverage or an already approved collection destination before selecting a window. This change adds no provider, database, notification channel or paid service.

Use production events after this measurement change. Historical events without `eventOrigin` cannot establish server attribution; historical Web Vitals without `metricId` cannot be safely deduplicated. They are excluded from the relevant calculations, not silently treated as complete samples.

## Local report

Keep raw exports in a private location outside the checkout. Do not commit exports or attach raw customer records to a public issue. The report reads newline-delimited event JSON, console lines containing `[BioAxis event] {json}`, or JSON records whose `message` contains that console event. Other log lines are counted as skipped. It does not consume arbitrary provider export schemas or retrieve credentials.

```sh
npm run report:redesign -- /private/path/events.jsonl \
  --from 2026-11-06T00:00:00Z --to 2026-11-20T00:00:00Z
npm run test:redesign-observation
```

The example dates describe a possible window, not completed coverage. `from` is inclusive and `to` exclusive. Output is aggregate JSON only: no request references, emails, product inputs, raw paths or log messages. Preserve the report beside the private export and its export-coverage notes.

## Definitions

| Measure | Calculation / boundary |
| --- | --- |
| Homepage product entry | Distinct request references with both a browser-tagged `homepage_view` and a `homepage_navigation` CTA to `/products` or a product route, divided by observed homepage references. References proxy sessions, not people. |
| First useful action | Earliest first-action homepage navigation per reference; median and p75 of `msSinceHomeInteractive`. The clock begins at interactive mount, not navigation start. |
| RFQ completion | Observed `rfq_start` references with a server-tagged `rfq_queue_write_succeeded`, divided by observed start references. Replayed writes count once. Client `rfq_success` does not establish storage. Unlinked server confirmations are reported separately rather than inflating the rate. |
| Validated requests | Unique server queue confirmations after synchronized contact/meaningful-need validation. This is technical intake eligibility, not proof of sales qualification or a conversion lift. |
| Errors | Started references with a validation, verification, submission or queue-error event, divided by started references. A reference may have both an error and later success; retries are not new leads. |
| Device comparison | Home/start cohorts use their first observed `mobile` or `desktop` value. Missing historical values remain `unknown`. Request-reference rotation can split cohorts; acquisition-source comparison is not supported by the current event schema. |
| Field performance | Latest event for each Web Vitals measurement ID and metric, grouped by mobile/desktop. Nearest-rank p75; LCP target 2500ms, INP 200ms, CLS 0.1. The output shows sample counts and numerical comparison, never an acceptance verdict. |

Explicit QA, synthetic and bot flags are excluded. The new homepage and Web Vitals reporters also skip WebDriver and Do Not Track. Untagged automation cannot be recognized from an export. Timestamp span alone does not prove continuous coverage, adequate traffic, comparable source mix or real participants.

## Review after collection

1. Check production release dates, export retention, gaps, duplicate export ranges, time zone and QA exclusions. Missing data is not zero activity.
2. Review approximately fourteen days, extending for insufficient traffic. Compare the same definitions and device/source mix; there is no historical conversion baseline in this repository.
3. Examine mobile/desktop sample counts, p75, product entry, completion and error rates. Inspect root causes privately; do not expose submitted product text in aggregate reports.
4. Record the observed period, coverage limitations, participant-check status and a short evidence-backed next-iteration list. Do not infer percentage lift, G1/G2 or G10 attainment from local fixtures or a green build.

`test:redesign-observation` uses only local synthetic fixtures. It checks parsing, origin isolation, measurement dedupe, p75, reference intersections, empty windows and privacy of CLI output. It is not production traffic evidence.

## Implementation validation, 2026-11-06

Passed: lint, production build (1,027 generated pages), complete offline `npm test` including the new observation regression, route smoke with runtime rejection of all three reserved queue events, and the browser accessibility checklist. Existing taxonomy/search/context, mobile primary actions, drawer focus, verification/retry and submission behavior remain covered. No page layout, copy, navigation, notification provider or collection credentials changed.

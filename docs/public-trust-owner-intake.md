# Public trust owner evidence intake

Every value and evidence reference in this intake will become public website content. Do not include credentials, private documents, customer data, personal addresses, or internal-only links.

## Required owner response

Copy this block into the task and fill every line:

```text
Legal operating entity:
Public registration evidence:

Operating region and business address:
Public address or registration evidence:

Enterprise-domain contact email:
Public domain-ownership evidence:

Response-time target:
Public operating-policy evidence:

Evidence reviewed on (YYYY-MM-DD):
Approved for public website publication: yes/no
```

## Acceptance standard

- The operating entity must be the entity actually responsible for BioAxis, not a same-name third party.
- The region/address record must be attributable to that same entity.
- The email must use an enterprise-controlled domain. Gmail, Outlook, QQ, 163, iCloud, Yahoo, and similar consumer domains are rejected.
- The response target must state a measurable time window and be backed by an operating policy the owner has approved.
- Each evidence reference must be safe to quote publicly and independently traceable, such as an official registry URL/record number, public address record, DNS/domain record, or published response policy.
- The review date must be a real, non-future date.
- `publicationApproved` must be explicitly true before configuration or deployment.

## File-based handoff

For a file handoff, copy `docs/public-trust-owner-intake.example.json`, fill the copy outside version control, and run:

```bash
npm run validate:trust-intake -- /absolute/path/to/public-trust-owner-intake.json
```

The validator checks completeness, date format, enterprise email domain, measurable response target, and explicit publication approval. It does not prove that a source is authentic; source attribution still requires manual verification before Vercel configuration.

After verification, use `--emit-env-json` to produce the public environment-variable mapping for review. Do not commit the filled intake or emitted file unless the owner explicitly wants those public facts versioned.

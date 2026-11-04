# Public trust owner evidence intake

Values and evidence references approved from this intake are intended for public website content. Keep the handoff limited to publishable owner facts and source references.

## Required owner response

The owner supplies the following fields with source evidence.

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

- The operating entity must be the entity actually responsible for BioAxis, with evidence attributing the record to that entity.
- The region/address record must be attributable to that same entity.
- The email must use an enterprise-controlled domain. The validator rejects `126.com`, `163.com`, `gmail.com`, `hotmail.com`, `icloud.com`, `outlook.com`, `qq.com`, and `yahoo.com`. Review domain ownership manually for all accepted addresses.
- The response target must state a measurable time window and be backed by an operating policy the owner has approved.
- Each evidence reference must be safe to quote publicly and independently traceable, such as an official registry URL/record number, public address record, DNS/domain record, or published response policy.
- The review date must be a real, non-future date.
- `publicationApproved` must be explicitly true for the file-based validator to accept the handoff.

## File-based handoff

For a file handoff, copy `docs/public-trust-owner-intake.example.json`, fill the copy outside version control, and run the structure check.

```bash
npm run validate:trust-intake -- /absolute/path/to/public-trust-owner-intake.json
```

The validator checks completeness, text-length limits, date format, the email-domain denylist, a measurable response target, and explicit publication approval. Authenticity, legal attribution, and domain ownership require manual verification before publication.

After owner verification, the optional `--emit-env-json` flag prints the public environment-variable mapping for review. Treat that output as a publication artifact and keep the filled intake outside version control unless its publication has been approved.

| Intake field | Public value field | Evidence field |
| --- | --- | --- |
| `legalName` | `NEXT_PUBLIC_BIOAXIS_LEGAL_NAME` | `NEXT_PUBLIC_BIOAXIS_LEGAL_EVIDENCE` |
| `operatingRegion` | `NEXT_PUBLIC_BIOAXIS_OPERATING_REGION` | `NEXT_PUBLIC_BIOAXIS_OPERATING_EVIDENCE` |
| `businessEmail` | `NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL` | `NEXT_PUBLIC_BIOAXIS_CONTACT_EVIDENCE` |
| `responseTarget` | `NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET` | `NEXT_PUBLIC_BIOAXIS_RESPONSE_EVIDENCE` |

`evidenceAsOf` maps to `NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF` and applies to all four records. `publicationApproved` is an intake approval gate checked by the validator. The website publication check uses the configured values, evidence references and date.

The example JSON intentionally leaves owner facts empty. Run `npm run test:trust-intake` and `npm run test:trust-evidence` for synthetic validation coverage. [Regression checks](regression-checks.md)

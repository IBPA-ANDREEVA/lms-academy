# BASE03-A documentation verification · 2026-11-04

Scope: documentation only. The owner requested finalization of approved
authentication/authorization/account/enrollment policies, not implementation or
Resource Ownership & Security Validation. The working tree was clean at inspection.
No Vault records or Google Sheet cells were changed.

## Deliverables and coverage

- Created [identity/access policy and next-task handoff](../architecture/identity-access-policy.md).
- Created the [exact permission snapshot](../product/permission-matrix.md).
- Added [PD-014](../product/decisions.md#pd-014--base03-a-authentication-authorization-and-account-lifecycle)
  and precedence notes while preserving prior decision bodies, including PD-013.
- Updated [requirements](../product/requirements.md), [scope](../product/mvp.md) and
  [open questions](../product/open-questions.md): narrowed OQ-016/OQ-032/OQ-092 to
  residual questions and added OQ-095–097 without marking those answers approved.
- Updated [entity map](../architecture/entity-map.md), [module workflows](../architecture/modules.md),
  [overview](../architecture/overview.md), [integration boundary](../architecture/frontend-backend-integration.md),
  [public user flows](../architecture/public-user-flows.md),
  [sitemap policy reference](../architecture/public-sitemap.md),
  [public open questions](../architecture/public-open-questions.md),
  [root instructions](../../AGENTS.md) and [backend instructions](../../backend/AGENTS.md).

| Owner-requested decision | Documented coverage |
| --- | --- |
| Permission matrix | 90 rows / 450 selections, all 12 source columns; Allow/Deny/Conditional/NAN meanings; multiple roles; manual admin management; no inferred resource names/conditions |
| Registration | Email/password MVP; verified email before purchased-course access; 48-hour activation links and secure resend; reauthentication/verification for email changes |
| Recovery | Single-use 30-minute email reset; successful recovery revokes all previous sessions |
| Administrator accounts | Manual creation/management/setup/recovery/email changes; no public admin signup; secure one-time credential setup; password hashes; no permanent user passwords in `.env` |
| Sessions | 30-day absolute / 7-day inactivity; genuine authenticated interaction only; polling excluded; multiple devices; all roles; MFA not required; recent password reauthentication; immediate blocking/role revocation; login after expiry preserves progress |
| Guest claiming | Guest activation account creation; existing-account ownership proof; paid claims survive link expiry; payment and enrollment distinct |
| Course lifecycle | First authorized opening; payment never starts timers; 1 year standard / 3 calendar months mini / 14 consecutive calendar days supported; independent enrollments; retained extension/pause rules; immediate refund/revocation access removal and PD-013 history preservation |
| Deferred handoff | Resource relationships, final Conditional checks, multi-role conflicts, security acceptance scenarios and cross-user protection explicitly left to Resource Ownership & Security Validation |

## Matrix verification and conflicts

Read the supplied live sheet with Google Drive metadata and bounded range tools.
Metadata confirmed `Permission Matrix`, sheet ID 0, 1,000 grid rows, 26 columns,
one frozen header row and three frozen columns. Read `A1:N6` to inspect headers,
then `A1:L100` for the 90 records at rows 2–91. The backup tab was not used as authority.

Selections: **159 Allow, 221 Deny, 60 Conditional, 10 NAN**, totaling 450.
All 90 rows have source status Approved; the 60 Conditional cells still require
final checks. Empty Resource/condition cells remain empty, not guessed. The live
sheet was not edited and remains authoritative beyond this dated snapshot.

Corrected active summaries of superseded introductory-acknowledgment activation,
three-month access for all courses, manager-role exclusion, seven-day/unattended
refund assumptions and expiry-driven homework deletion. PD-013 remains authoritative;
PD-014 does not reopen its refund policy or select a new retention period.
Historical decision bodies, dated QA reports and completed Vault records remain history.

Recorded rather than silently resolved: matrix Admin Deny versus older homework
review/file/conversation access, Guest Allow paired with authenticated-owner text,
MVP stage labels versus later messaging/certificate policy, and unfinished
trainer deadline/access conditions. See OQ-095/OQ-096 and the policy's source
discrepancy table. The selected values remain intact; no bypass or scope expansion
was designed. Provider/session/token mechanisms remain technical choices;
reauthentication recency/activity taxonomy remain OQ-097. Existing access-calendar,
post-expiry, matching, legal, retention and certificate dependencies remain open.

## Verification results

- Passed an inline Python comparison of every snapshot data cell against the
  connector response: 90 rows, 1,080 cells across 12 columns, 450 exact selections,
  sequential sheet-row locators and all 90 source Approved statuses.
- Passed relative file-link and balanced-code-fence checks for changed Markdown.
- Passed unique decision/question ID checks and direct comparison with
  `git show HEAD:docs/product/decisions.md`: PD-001–PD-013 original bodies are
  unchanged; only external precedence notes were added. PD-014 and OQ-095–097
  use unused sequential identifiers. A first validation run used unpadded OQ IDs
  in its assertion; correcting the checker to three digits passed without a policy edit.
- `git diff --check` passed. `git diff --name-only` plus
  `git ls-files --others --exclude-standard` restrict the complete change set to
  16 Markdown documents, including the two instruction files and this report.
  No source code, schema, migration, API, UI, dependency, configuration or runtime
  file changed. No commit, deployment or remote-sheet write was performed.
- Reviewed changed policy prose and searched active product/architecture documents
  for obsolete activation, duration, refund and role assumptions. Retained older
  descriptions are explicitly historical or qualified by the new precedence/conflict
  notes; unanswered workflow conflicts remain open, not silently approved.
- Skipped `pnpm lint`, `pnpm exec next typegen`, `pnpm exec tsc --noEmit`,
  `pnpm build`, browser/feature and backend checks: documentation-only scope,
  no runtime/API changes, and no initialized backend. Mermaid changes were reviewed
  as source, not rendered. No public route, metadata, sitemap behavior or SEO
  component changed; the sitemap edit only corrects a role-policy reference.

No authentication or resource-security implementation is delivered or verified.

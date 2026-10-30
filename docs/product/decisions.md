# LMS approved product decisions

## Purpose and authority

This file is the **single register for confirmed product decisions**. The
product owner is the sole decision authority, so entries do not repeat a
`Decision owner` field. Unresolved questions are maintained exclusively in
[open-questions.md](./open-questions.md). Engineering design and implementation
instructions belong in [architecture](../architecture/overview.md), while
technical tradeoffs and accepted architecture choices belong in
[ADRs](../decisions/0001-modular-monolith.md).

Do not convert a suggested provider, draft, mockup, assumed value, or unapproved
scope correction into an approved decision.

When an OQ is answered:
1. Preserve its original question and ID in the decision entry.
2. Record the precise approved behavior, date, evidence, constraints, and
   affected requirements, scope, schemas, migrations, and tests.
3. Remove the resolved question from the **active** open-questions list only
   after the decision entry preserves its traceability.
4. Update affected documentation. Keep approval evidence where accessible.
   If no shareable evidence URL exists, describe the approval source honestly.

## PD-001 · Clear failure messages and traceable diagnostics

- **Status:** Approved
- **Date:** 2026-10-30
- **Evidence:** Direct product-owner instruction in the LMS planning conversation
  on this date; no repository-accessible approval link supplied.
- **Decision:**
  - Every failed operation must be understandable to the affected user and
    traceable by a developer or operator.
  - User-facing errors use plain language, Russian first for MVP, and describe
    the problem and a useful next step without developer terminology.
  - Developer/operator logs capture sufficient structured context to identify
    what failed, where, why when known, its impact, and how retries or
    recovery proceeded.
  - Diagnostic information must not expose secrets or unnecessary personal
    data, and users must not see internal exception or provider messages.
  - A failure test must verify both the user-facing state and the corresponding
    privacy-safe diagnostic record.
- **Consequences:** Shared error-handling conventions across payment,
  authorization, protected video, uploads, email delivery, and background work.
  Detailed implementation guidance belongs in
  [architecture overview](../architecture/overview.md#error-handling).
- **Still open:** Alert thresholds and escalation (OQ-080); record/log
  retention (OQ-008, OQ-079). PD-001 does not settle any external provider
  selection, payment state policy, or other open question.

## Decision entry template

```md
## PD-XXX · Short decision title

- **Status:** Approved
- **Date:** YYYY-MM-DD
- **Original question:** OQ-XXX · [full original question, if applicable]
- **Evidence:** Approval link or honest source description
- **Decision:** Exact, testable product rule
- **Constraints:** Explicit bounds and remaining unanswered questions
- **Consequences:** Affected requirements, delivery scope, data,
  migrations, operations, and tests
```

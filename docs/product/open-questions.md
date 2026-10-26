# LMS open questions and decision register

## Purpose

This file records unresolved business decisions, ambiguous requirements, and missing acceptance rules found in the original technical specification, wireframes, and Vault plans. Future agents must not silently select answers. Record an approved decision here, link its evidence, and then update [requirements.md](./requirements.md) and [mvp.md](./mvp.md) where behavior or scope changes.

Source references: S1 is `ТЗ_онлайн_академия_и_личные_кабинеты.docx`; S2 is `Онлайн_академия_дизайн_платформы.pdf`; P1 is the LMS Vault's `Full Project Plan.md`, phase plans, and `Roadmap.md`; P2 is the LMS Vault's epic task maps and linked task records. Questions derived from an engineering gap rather than an explicit S1 ambiguity are still unresolved recommendations, not approved business decisions. The original attachments were not present as repository copies in `docs/references/` during this review.

Status vocabulary:

- **Blocking MVP:** a decision is needed for a safe or legally valid first launch.
- **Blocking feature:** the named later feature should not ship without it.
- **Clarify:** implementation can prepare for the decision, but product behavior must not be assumed.

## Highest-priority decisions

| ID | Status | Decision owner | Needed by milestone | Decision needed | Why it matters |
| --- | --- | --- | --- | --- | --- |
| OQ-001 | Blocking MVP | Unassigned | Before payment-provider integration (PM04); no later than MVP acceptance (QA06) | Which payment provider will be used, which merchant account and legal entity receives funds, and which countries/currencies must checkout support? | Determines checkout, webhooks, receipts, wallets, refunds, compliance, and testing. |
| OQ-002 | Blocking MVP | Unassigned | Before protected-video integration (INF06); no later than end-to-end QA (QA04) | Which protected video host will be used and which playback, audio-track, subtitle, signed-link, and watermark capabilities are contracted? | Determines lesson delivery, localization, authorization, cost, and Phase 3 protection feasibility. |
| OQ-003 | Blocking MVP | Unassigned | Before support-expiration implementation and end-to-end QA (QA04) | When do the curator-support clock and recorded-content access clock start, pause, expire, or extend? Is recorded access actually three months? | Controls entitlements, submissions, messaging, reminders, refunds, and support workload. Server-side expiration enforcement is MVP even though the visible countdown remains Phase 2. |
| OQ-004 | Blocking MVP | Unassigned | Before homework media processing (INF08); no later than end-to-end QA (QA04) | What homework photo and video formats, maximum item count, per-file limits, total submission limit, and normalization targets are supported? | The source asks for arbitrary uploads and compression but separately leaves maximum size open; unlimited input is not operationally well-defined. |
| OQ-005 | Blocking MVP | Unassigned | Before trainer review acceptance and end-to-end QA (QA04) | What is the curator response SLA, which timezone and business calendar apply, and what happens when work is overdue? | Needed for queue ordering, notifications, escalation, reporting, and staffing. The 48-hour value is only an example. |
| OQ-006 | Blocking MVP | Unassigned | Before legal pages, production email, and certificate templates; no later than MVP acceptance (QA06) | What is the academy's approved name, domain, sender identities, and certificate issuer identity? | Required for branding, email, legal pages, URLs, and certificates. |
| OQ-007 | Blocking MVP | Unassigned | Before legal sign-off (QA05) and production checkout | What final offer, privacy, refund, and license-disclaimer texts are approved, in which languages, and how are versions retained? | Production checkout cannot collect valid consent against placeholders. |
| OQ-008 | Blocking MVP | Unassigned | Before retention safeguards (INF13); no later than MVP acceptance (QA06) | What record-retention period and deletion exceptions apply to users, payments, consents, homework, messages, audit events, and certificates? | The source says at least a lawyer-defined number of years but supplies no duration. |
| OQ-009 | Blocking MVP | Unassigned | Before end-to-end QA (QA04) | Which prepared courses, lessons, media, prices, trainers, and certificate templates form the launch catalog, and who signs off their readiness? | The MVP plan depends on preloaded content rather than full catalog administration. |
| OQ-010 | Blocking MVP | Unassigned | Before MVP acceptance (QA06) | What operational tools or documented procedures replace the deferred full admin screens at launch? | Staff must be able to support accounts, access, content, certificates, immediate auditable access revocation after confirmed refunds, and manual refund decisions safely. |

## Roles, ownership, and authorization

| ID | Status | Question |
| --- | --- | --- |
| OQ-011 | Clarify | Are `trainer` and `curator` always the same person, or may teaching, content ownership, and homework review be assigned separately? |
| OQ-012 | Clarify | Can multiple curators be assigned to one course or cohort, and can one student be reassigned? What history remains visible after reassignment? |
| OQ-013 | Clarify | What does role switching look like for a multi-role user, and which role is selected after login? |
| OQ-014 | Clarify | Can managers or trainers also be administrators, and are any role combinations prohibited or subject to separation-of-duties controls? |
| OQ-015 | Clarify | What student fields may a curator see beyond display name and course activity? The source explicitly prohibits contact details outside the platform but does not define the allowed profile view. |
| OQ-016 | Clarify | What actions may a blocked user take, and what happens to active enrollments, pending homework, messages, and financial records? |

## Catalog, content, and eligibility

| ID | Status | Question |
| --- | --- | --- |
| OQ-017 | Clarify | Are the six initial directions fixed launch scope, and what taxonomy or slug rules apply when administrators add directions? |
| OQ-018 | Blocking feature | How is eligibility for an advanced course limited to licensed practitioners: declaration, document upload, manual approval, or informational labeling only? |
| OQ-019 | Clarify | Does the Start in the USA module issue a certificate, contribute to a package certificate, contain homework, or have a distinct access duration? |
| OQ-020 | Clarify | Can a lesson have multiple assignments, optional assignments, quizzes, or only the single homework pattern shown in the wireframe? |
| OQ-021 | Clarify | What event marks a video or lesson as viewed: opening it, reaching a percentage, watching a duration, or manually completing it? How are seeking and rewatching handled? |
| OQ-022 | Clarify | May administrators change mandatory assignments or lesson order after students enroll? If so, which version governs existing students and certificate eligibility? |
| OQ-023 | Clarify | Is trainer content editing versioned, and what approval or rollback process applies to changes to a published course? |
| OQ-024 | Blocking feature | Who supplies and approves RU/EN translations, audio, subtitles, trainer credentials, and legal text? What happens when only one language exists? |

## Packages, ownership, and pricing

| ID | Status | Question |
| --- | --- | --- |
| OQ-025 | Blocking feature | Are packages limited to exactly 2, 3, or 6 directions plus Start in the USA, or may administrators assemble any number and combination of products? |
| OQ-026 | Blocking feature | What happens when a buyer already owns one or more package components? Is there prorating, upgrade credit, duplicate access, or no eligibility? |
| OQ-027 | Blocking feature | When the cart suggests a package, does it replace selected lines automatically only after consent, or merely link to a package page? |
| OQ-028 | Blocking feature | What happens to existing enrollments when a package's composition or price changes after purchase? |
| OQ-029 | Blocking MVP | How exactly is the USD 2,500 cap applied to taxes, mandatory fees, materials, discounts, multi-product carts, and non-USD payments? Counsel must confirm the BPPE interpretation. |
| OQ-030 | Clarify | Are prices stored and charged only in USD, or are display and settlement currencies required? |

## Checkout, orders, discounts, and refunds

| ID | Status | Question |
| --- | --- | --- |
| OQ-031 | Blocking MVP | Which payment state is authoritative for fulfillment, and how are asynchronous, disputed, charged-back, or reversed payments handled? |
| OQ-032 | Blocking MVP | What account-matching policy applies when a guest checkout email already belongs to an account? |
| OQ-033 | Clarify | How long does a cart persist, and is it shared across anonymous and authenticated sessions or devices? |
| OQ-034 | Blocking feature | May promo codes stack? Are they single-use per customer? Can a fixed discount exceed the eligible subtotal? How do currency and tax interact with it? |
| OQ-035 | Blocking feature | What happens to promo-code usage counts after cancellation or refund? |
| OQ-036 | Blocking feature | Are partial refunds supported for an order, a package component, or a portion of a course? How are access and accrual reversals prorated? |
| OQ-037 | Blocking MVP | What refund policy and eligibility rules govern administrator decisions, and which reason/evidence fields must be recorded? |
| OQ-038 | Blocking feature | What constitutes acceptable evidence for manager-created manual enrollment, and who may approve or reverse it? |
| OQ-039 | Blocking feature | What order, receipt, tax, and accounting record should a manual enrollment create? |
| OQ-040 | Blocking feature | What is the precedence when referral link, promo code, prior lead ownership, and manual enrollment point to different managers? |
| OQ-041 | Blocking feature | How long does manager attribution persist, and is it first-touch, last-touch, promo-specific, or manually overridden? |

## Learning access, homework, and curator support

| ID | Status | Question |
| --- | --- | --- |
| OQ-042 | Blocking MVP | Does sequential unlocking require video completion, lesson completion, accepted homework, or a configurable combination? |
| OQ-043 | Blocking MVP | What upload failures must be recoverable, and are resumable uploads required for large mobile videos? |
| OQ-044 | Blocking MVP | What malware scanning, media moderation, transcoding failure, and retention rules apply to student uploads? |
| OQ-045 | Clarify | May a student replace or delete a pending submission? Can they submit another revision before the curator acts? |
| OQ-046 | Clarify | Are there assignment due dates distinct from the two-week support expiry, and who configures them? |
| OQ-047 | Blocking feature | Does message history become read-only after support expires, and may administrators reopen or extend support? |
| OQ-048 | Clarify | What happens to an in-review submission when support expires? Must the curator finish it, may the student revise, or does the flow close immediately? |
| OQ-049 | Clarify | Are curator-support periods tracked per course, package component, cohort, or student? |
| OQ-050 | Clarify | Are lesson recordings and materials equally available after support expiry, or do materials have different access rules? |

## Certificates

| ID | Status | Question |
| --- | --- | --- |
| OQ-051 | Blocking MVP | Which profile name is printed for each certificate language, and what validation or approval occurs before issue? |
| OQ-052 | Blocking MVP | Which issue date, trainer name, academy identity, signatures, and visual assets are required on the MVP certificate? |
| OQ-053 | Clarify | Does a package produce one package certificate, individual course certificates, or both? |
| OQ-054 | Clarify | May a certificate be regenerated after a name correction? Does it retain its number and date, and how are prior files treated? |
| OQ-055 | Blocking feature | What exact public data may the QR verification page reveal, and how is unwanted enumeration or search prevented? |
| OQ-056 | Blocking feature | What does a revoked or superseded certificate page show, and who may revoke or restore it? |
| OQ-057 | Clarify | Does course content or completion-rule change ever invalidate previously issued certificates? |

## Trainer and manager finance

| ID | Status | Question |
| --- | --- | --- |
| OQ-058 | Blocking feature | When does a student become eligible for a trainer per-student accrual: payment, access grant, support start, first activity, or refund-window expiry? |
| OQ-059 | Blocking feature | Is the mini-course trainer percentage calculated from gross price, discounted subtotal, net receipts, or amount after fees and taxes? |
| OQ-060 | Blocking feature | Is manager commission calculated from gross sales, discounted subtotal, collected cash, or net revenue? |
| OQ-061 | Blocking feature | How are partial refunds, chargebacks, package allocations, complimentary access, and manual enrollments reflected in accruals? |
| OQ-062 | Blocking feature | What payout cadence, currency, minimum threshold, approval workflow, tax documentation, and overseas payout method apply? |
| OQ-063 | Blocking feature | Can configured rates change over time, and must each sale snapshot the rate that applied at attribution? |
| OQ-064 | Clarify | May a payout be reopened or corrected after being marked paid, and what audit trail is required? |

## Leads, abandoned carts, and communications

| ID | Status | Question |
| --- | --- | --- |
| OQ-065 | Blocking feature | What consent makes an abandoned cart recoverable and permits a manager to see or contact the buyer? |
| OQ-066 | Blocking feature | How are leads assigned, deduplicated, reassigned, closed, and retained? What statuses are required? |
| OQ-067 | Blocking feature | Which contact channels may managers use, and must contact attempts be recorded? |
| OQ-068 | Clarify | Are student-curator messages plain text only, or do they support attachments, voice, moderation, unread state, and retention rules? |
| OQ-069 | Clarify | What are the exact timing, retry, deduplication, localization, unsubscribe, and preference rules for each email notification? |
| OQ-070 | Blocking feature | Which push platform is intended, which events deserve push, and how are device permissions and preferences managed? |

## Reviews, recommendations, and analytics

| ID | Status | Question |
| --- | --- | --- |
| OQ-071 | Blocking feature | Who may submit a review, at what completion point, and may one student review a course more than once? |
| OQ-072 | Blocking feature | What rating scale, moderation states, rejection reasons, editing rules, and public attribution apply? |
| OQ-073 | Blocking feature | Are recommendations manually curated, rule-based, or algorithmic, and which inputs may be used? |
| OQ-074 | Blocking feature | What analytics consent and cookie behavior is required before loading Google Analytics or Meta Pixel? |
| OQ-075 | Blocking feature | What is the canonical event taxonomy and attribution model for conversion and acquisition-cost reporting? |
| OQ-076 | Clarify | Which timezone, currency, refund date, and data freshness rules apply to administrative reports? |
| OQ-077 | Clarify | How are completion rate, new buyer, repeat purchase, average review time, and average order value defined? |

## Operations, security, and data governance

| ID | Status | Question |
| --- | --- | --- |
| OQ-078 | Blocking MVP | What recovery point and recovery time objectives apply to the database and private media? Who performs restoration tests? |
| OQ-079 | Blocking MVP | Which administrator actions must be audited, how long are audit events retained, and who may inspect them? |
| OQ-080 | Blocking MVP | What production monitoring and alert thresholds cover payment failure, email failure, upload processing, video authorization, and scheduled jobs? |
| OQ-081 | Clarify | What privacy rights and deletion/export procedures apply, and which financial, education, certificate, or audit records are exempt from deletion? |
| OQ-082 | Clarify | Are minors permitted to purchase or enroll? If so, what guardian consent or privacy requirements apply? |
| OQ-083 | Clarify | Which jurisdictions besides California or BPPE-related rules govern commerce, privacy, tax, education disclaimers, and recordkeeping? |
| OQ-084 | Blocking feature | What threat model and provider capability define acceptable protected-video behavior, given that screen recording cannot be fully prevented? |

## Scope and planning discrepancies

| ID | Status | Question |
| --- | --- | --- |
| OQ-085 | Blocking MVP | Does the minimal MVP administration slice have approved operational substitutes for course updates, pricing, access correction, certificate support, and refunds? The original specification asks for basic admin, while the Vault defers most CRUD. |
| OQ-086 | Clarify | Should product reporting continue to use the original feature phases, or should Phase 2 and Phase 3 be renamed to match the Vault's single `post-MVP` implementation window? This documentation preserves the original feature distinction. |
| OQ-087 | Clarify | The December 7, 2026 and January 26, 2027 dates are planning targets, not guaranteed commitments. Are these targets still current, who owns reforecasting, and which dependency or capacity changes trigger a revised plan? |
| OQ-088 | Clarify | The original MVP says Russian only, while the catalog requirements mention language visibility and filtering. For MVP, should cards show only Russian availability, or must mixed-language inventory already be supported? |
| OQ-089 | Clarify | The original specification includes the student dashboard's upcoming deadlines and curator responses, but the Vault defers messaging and support countdown. Which reduced MVP dashboard states are required? |

## Decision record template

When a question is resolved, replace its status and append a decision entry using this structure:

```md
### OQ-000 Decision title

- Status: Decided
- Decision owner: Name or role
- Approved on: YYYY-MM-DD
- Evidence: Link to signed policy, issue, or decision record
- Decision: Precise behavior
- Consequences: Affected requirements, release scope, data, migration, and tests
```

Do not delete the original question. Preserving the decision trail helps future coding agents distinguish approved behavior from an implementation assumption.

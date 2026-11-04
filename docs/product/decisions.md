# LMS approved product decisions

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
  - A failure test must verify both the user-facing state and the corresponding privacy-safe diagnostic record.

## PD-002 · Payment Infrastructure

- **Status:** APPROVED
- **Date:** Not specified in supplied approval; recorded 2026-10-30
- **Original question:** OQ-001 · Which payment provider will be used, which merchant account and legal entity receives funds, and which countries/currencies must checkout support?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

**Also resolves:** OQ-030 · Are prices stored and charged only in USD, or are display and settlement currencies required? The approved USD pricing, charges and payouts answer this question.

### Approved decision (verbatim)

- **Provider:** Stripe, using the existing active account owned by the academy's US legal entity.
- **Checkout:** Embedded Stripe Payment Element.
- **Currency:** USD for pricing, charges, and payouts.
- **Geography:** US and international customers where supported.
- **Payment methods:** Cards, Apple Pay, Google Pay, and Klarna where eligible.
- **Installments:** Supported through Klarna for eligible one-time purchases.
- **Subscriptions:** Completely excluded from MVP and all future planned phases.
- **Payouts:** USD to the existing US company bank account.
- **Before launch:** Verify exact legal entity, Stripe account settlement configuration, and payment-method eligibility.

**Related OQs:** OQ-029, OQ-031, OQ-032, OQ-036, and OQ-037 remain separate.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-003 · Video Infrastructure & Protection

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-002 · Which protected video host will be used and which playback, audio-track, subtitle, signed-link, and watermark capabilities are contracted?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- **Infrastructure:** Self-managed video streaming and encryption.
- **Storage:** Private Cloudflare R2.
- **Processing:** Separate VPS/VM running FFmpeg workers; provider and capacity chosen during implementation.
- **Playback:** Encrypted adaptive HLS, maximum 1080p, with 720p and 480p variants.
- **Protection:** Server-side enrollment authorization, short-lived playback access, protected video segments and encryption keys.
- **Watermark:** Moving student-specific identifier in MVP.
- **DRM:** Deferred until after MVP; screen-capture blocking is not guaranteed.
- **Localization:** Selectable RU/EN audio tracks and subtitles where available.
- **Permissions:** Trainers and administrators can upload; only administrators can publish.
- **Uploads:** Resumable; MP4/MOV/WebM with supported codecs, 20 GB and 4 hours maximum per video.
- **Processing:** Persistent queue, initially one concurrent job, three automatic retries, manual recovery.
- **Reliability:** Failed processing cannot publish incomplete content; preserve previous published versions.
- **Monitoring:** Structured diagnostics and understandable user errors under PD-001.
- **Budget:** Target $50–$100/month, subject to capacity testing.
- **Dependencies:** OQ-003 (access periods), OQ-008 (retention).

**Scope changes:** Self-managed hosting replaces the external hosting approach; trainer uploads and watermarks are included in MVP.

**INF03:** Specify implementation, encryption-key management, recovery, supported-browser testing, and operational verification.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-004 · Course Access & Curator Support

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-003 · When do the curator-support clock and recorded-content access clock start, pause, expire, or extend? Is recorded access actually three months?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

**Also resolves:** OQ-050 · Are lesson recordings and materials equally available after support expiry, or do materials have different access rules? PD-004 gives lessons and materials the course-access deadline, independently of support expiry.

### Approved decision (verbatim)

- **Activation:** Both timers start when the student explicitly marks the introductory course page as viewed. This page must explain all important course rules.
- **Curator support:** 14 consecutive calendar days after activation.
- **Course access:** 3 calendar months after activation, including the support period.
- **Tracking:** Independent deadlines for every purchased course.
- **Extensions:** Students can submit a Request Extension form even after support expires. Assigned curators can extend support by up to 14 calendar days per request, but cannot extend course access.
- **Administrators:** Can modify both support and course-access deadlines, approve longer exceptions, and temporarily pause access.
- **Homework:** Curators must review assignments submitted before the permitted deadline even if their review is overdue. Detailed post-expiration transitions remain under OQ-048.
- **Expiration:** Support closes after its deadline. Lessons and materials close after the course-access deadline unless extended.
- **Pauses:** Freeze applicable timers and preserve the exact remaining duration until restoration.
- **Refunds/closure:** Revoke access while preserving historical learning records.
- **Security:** Server-enforced authorization, auditable changes, and PD-001 error handling.

**Dependencies:** OQ-005, OQ-048, OQ-049.

**Implementation:** Separate support/access deadlines per enrollment; support extensions never automatically extend course access. Resolve overlapping extensions and calendar-month calculations consistentl

**Source note (not an additional decision):** The supplied implementation sentence ends at `consistentl`. No missing continuation or calendar/overlap rule has been inferred.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-005 · Homework Media Uploads

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-004 · What homework photo and video formats, maximum item count, per-file limits, total submission limit, and normalization targets are supported?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- **Formats:** All supported photo and video formats, including JPEG, PNG, HEIC, WebP, MP4, MOV and WebM, with automatic normalization.
- **Limits:** 1 GB maximum per file and 1 GB combined original files per submission. No fixed file-count limit.
- **Images:** Auto-orientation, high-quality compression, maximum 2560px processed copies.
- **Videos:** Normalize to H.264/AAC MP4, maximum 1080p.
- **Previews:** Generate thumbnails and playable previews.
- **Uploads:** Resumable, with progress tracking and interruption recovery. Students can preview, remove and replace files.
- **Security:** Private storage, authorized access for the submitting student, assigned curator and administrators, using short-lived signed delivery.
- **Failures:** Clear user-facing errors, structured logs and safe retries following PD-001.
- **Recovery:** Preserve originals until processing succeeds; never corrupt submission history.
- **Retention:** Files follow the course-access lifecycle. Permanent deletion depends on OQ-008 and outstanding review obligations.

**Dependencies:** OQ-003, OQ-008, OQ-043, OQ-044.

**Implementation:** Private media storage, resumable uploads, background processing and server-side authorization.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-006 · Legal Documents & Policies

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-007 · What final offer, privacy, refund, and license-disclaimer texts are approved, in which languages, and how are versions retained?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- **Documents:** Terms of Sale, Privacy Policy, Refund Policy, Licensing Disclaimer.
- **Languages:** Russian and English.
- **Management:** Administrators upload, version and publish documents after legal professional approval.
- **Workflow:** Draft → Approved → Published.
- **Checkout:** Explicit acknowledgment of all four documents before payment.
- **Versioning:** Immutable published versions with acceptance history, timestamps, user and order references.
- **Updates:** Notify affected students. Material changes require renewed acknowledgment at the next checkout; editorial changes require notification only.
- **Access:** Existing course access continues after policy updates.
- **Display:** Public legal pages in footer and required agreements before checkout.
- **Missing documents:** Block checkout if required approved documents are unavailable in the selected language.
- **Security:** Administrator authorization, audit trail, server-side verification and PD-001 failure handling.

**Dependencies:** OQ-006, OQ-008, OQ-037.

**Implementation:** Admin policy management, versioning, RU/EN support, consent tracking, change notifications and checkout validatation

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-007 · Data Retention & Deletion

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-008 · What record-retention period and deletion exceptions apply to users, payments, consents, homework, messages, audit events, and certificates?
- **Evidence:** Direct product-owner approval supplied in the documentation synchronization conversation on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- **Accounts:** Retain until manual deletion or a verified deletion request.
- **Financial records:** Retain until eligible for deletion, subject to legal obligations.
- **Consent records:** Follow account retention, except where legally required longer.
- **Homework and messages:** Delete when the associated course-access period ends, normally after 3 months, accounting for pauses, extensions, outstanding reviews and legal exceptions.
- **Certificates:** Retain certificate records and necessary verification evidence permanently.
- **Operational logs:** 30-day retention for technical errors and routine administrator activity.
- **Critical audit records:** Retain for legally required periods.
- **Account deletion:** Notify administrators. Automatically delete eligible data if no active courses remain and identity and retention checks pass. Otherwise, administrator contacts the student.
- **Backups:** Encrypted, restricted access, 30-day retention.
- **Recovery:** Prevent deleted personal data from being unintentionally restored.
- **Security:** Automated retention safeguards, restricted access and PD-001 error handling.

**Pending legal verification:** Mandatory retention periods, deletion exceptions and applicable privacy requirements.

**Dependencies:** OQ-003, OQ-004, OQ-007, OQ-078, OQ-079, OQ-081.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the 2026-10-30 decision synchronization review in the Vault `Full Project Plan.md`. No implementation, schema, or migration is delivered by this record.

## PD-008 · Curator Response SLA

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-005 · What is the curator response SLA, which timezone and business calendar apply, and what happens when work is overdue?
- **Evidence:** Exact approval supplied by the product owner in the follow-up reply to the documentation synchronization question on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- Review SLA: 48 counted hours from homework submission, counting Monday–Friday continuously and excluding weekends. Public holidays count.
- Timezone: Assigned curator's timezone, captured when homework is submitted. Deadlines are displayed in each viewer's local timezone.
- Revisions: Every new submission or corrected resubmission starts an independent 48-hour deadline. Preserve all review history.
- Notifications: Notify curator immediately upon submission, then at 24, 12, 6 and 1 remaining hours, and when overdue.
- Overdue work: Keep assignments in the review queue. Create persistent, auditable administrator notifications. Contacting the curator is optional.
- Student visibility: Show expected review deadline and current status.
- Administrator permissions: Full review access, including comments, acceptance and revision requests, without changing the assigned curator. Audit all actions.
- Support expiration: Assignments submitted before expiration must still be reviewed. Student revision rules after expiration remain under OQ-048.
- Reliability: Server-side deadline calculation, durable reminders, retry-safe processing, concurrency protection and PD-001 error handling.
Dependencies: OQ-003, OQ-048, OQ-079, OQ-080.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the follow-up decision review in the Vault `Full Project Plan.md`. This update implements no feature or database change.

## PD-009 · Launch Catalog & Content Readiness

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-009 · Which prepared courses, lessons, media, prices, trainers, and certificate templates form the launch catalog, and who signs off their readiness?
- **Evidence:** Exact approval supplied by the product owner in the follow-up reply to the documentation synchronization question on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

- Categories: Administrators manage all educational directions and can add, edit and archive categories without code changes.
- Launch inventory: Course quantity and selection are business decisions. No minimum course count enforced by engineering.
- Authoring: Trainers create courses, lessons and materials for assigned courses. Administrators approve content.
- Readiness: All required lessons, videos, materials and homework must be complete before publication.
- Assignment: Every curator-supported course requires an assigned trainer-curator. Mini-courses do not.
- Languages: Platform supports RU/EN; individual courses can be available in either or both languages.
- Pricing: Trainers propose prices; administrators approve them.
- Certificates: Use an approved default academy template unless an approved custom template exists.
- Publication: Administrators independently control course visibility, sale availability and archiving.
- Existing enrollments: Pausing sales or archiving never revokes existing student entitlements.
- Administration: Full category/course authoring, content approval, pricing approval and publication controls included in MVP.
- Security: Server-side authorization, audit trails and PD-001 failure handling.
Dependencies: OQ-006, OQ-018, OQ-021–024, OQ-029, OQ-051–052.
Implementation: Category management, trainer course editor, administrator review and publishing workflows, content readiness validation and independent sale-state controls.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the follow-up decision review in the Vault `Full Project Plan.md`. This update implements no feature or database change.

## PD-010 · MVP Administration & Operations

- **Status:** APPROVED
- **Date:** 2026-10-30
- **Original question:** OQ-010 · What operational tools or documented procedures replace the deferred full admin screens at launch?
- **Evidence:** Exact approval supplied by the product owner in the follow-up reply to the documentation synchronization question on 2026-10-30; no repository-accessible approval link supplied.

### Approved decision (verbatim)

1. Administration
- All essential business operations must be accessible through the admin dashboard in MVP.
- Routine operations must not require developer intervention.
- Infrastructure recovery and server management remain outside the admin interface.
2. User management
- Administrators can view permitted user information, block/unblock accounts, and manage course access.
- Administrators can manually grant, suspend, restore, and revoke course access.
- Account creation and role assignment are handled through separately defined, authorized workflows.
- All sensitive user and access changes are audited.
3. Orders and refunds
- Eligible refund requests are automatically approved and processed through Stripe without administrator approval.
- Refund eligibility follows the proposed 7-day window after confirmed payment, regardless of course progress, subject to applicable law and the final refund rules.
- Exceptional cases and failed refunds are escalated to administrators.
- Confirmed refunds automatically revoke affected course access.
- Refund processing must be idempotent and must not create duplicate refunds.
- Administrators can inspect orders, refunds, statuses, and exceptions.
4. Certificate management
- LMS automatically calculates completion eligibility.
- Beginner and advanced courses require acceptance of all mandatory homework.
- Mini-courses require completion of all mandatory lessons.
- Every certificate requires administrator review and manual issuance, including mini-courses.
- Eligible certificates appear in an administrator review queue.
- Administrators inspect completion evidence before approving issuance.
- Certificates use the approved default academy template unless an approved custom template is assigned.
- Certificate issuance must be auditable and protected against duplicates.
- Certificate correction, revocation, and reissuance rules remain subject to separate decisions.
5. Course and curator monitoring
- Administrators can inspect all courses, student progress, submissions, review history, deadlines, and course-scoped conversations.
- Administrators can view student requests and their processing statuses.
- Missed curator deadlines generate persistent administrator notifications.
- Administrators have full homework review permissions under OQ-005, without automatically changing the assigned curator.
6. System logs
- Provide a separate administrator-restricted route for operational and error logs.
- Support searching and filtering by date, severity, operation, affected resource, and reference ID.
- Display clear descriptions alongside technical diagnostics.
- Protect sensitive personal information and credentials.
- Retain routine logs for 30 days under OQ-008.
7. Sensitive actions and safety
- Show a confirmation popup explaining the action and its consequences before sensitive administrative operations.
- Require explicit confirmation before proceeding.
- Record the administrator, action, affected resource, timestamp, and outcome.
- Enforce permissions and business rules on the server.
- Handle errors using PD-001: understandable user messages and traceable developer logs.
8. MVP scope
- Full essential administration UI.
- Automatic Stripe refund processing.
- Manual certificate issuance for every course type.
- Course and student monitoring.
- Administrator notifications and operational log viewer.
- No infrastructure-recovery controls in the admin dashboard.
Dependencies: OQ-003, OQ-005, OQ-009, OQ-031, OQ-032, OQ-036, OQ-037, OQ-051–052, OQ-079–080.
Implementation: Admin dashboard, restricted user management, course-access controls, refund automation, certificate eligibility and review queue, course monitoring, notification center, operational log viewer, confirmation dialogs, and comprehensive audit trails.

**Constraints / unresolved qualification:** The supplied seven-day refund window is explicitly **proposed**, subject to applicable law and final refund rules. Automatic Stripe processing is approved; the window and final eligibility policy are not independently approved by this record and remain under OQ-037. Account creation/role-assignment workflows, certificate correction/revocation/reissuance and the listed dependencies are not resolved here. No literal log-viewer URL is supplied.

**Also resolves:** OQ-085 · Does the minimal MVP administration slice have approved operational substitutes for course updates, pricing, access correction, certificate support, and refunds? The original specification asks for basic admin, while the Vault defers most CRUD. PD-010 requires essential operations in the MVP admin dashboard without routine developer intervention; operational substitutes do not replace that requirement.

**Documentation/planning traceability:** See [requirements](./requirements.md), [scope](./mvp.md), [architecture](../architecture/overview.md), and the follow-up decision review in the Vault `Full Project Plan.md`. This update implements no feature or database change.

## PD-011 · Referral capabilities replace the dedicated manager role

- **Status:** Approved
- **Date:** 2026-10-30
- **Evidence:** Direct owner request, “LMS Academy: Architecture & Development Plan Restructuring”, section 9. No shareable approval URL supplied.
- **Decision:** A manager is no longer a separate platform role or dashboard by default. A trainer, curator, administrator or another explicitly authorized user may receive a referral link/attribution capability. Multiple capabilities may coexist. Referral identity and historical attribution are independent of current account roles.
- **Ownership:** Commerce owns partner/link identity, attribution and commissions; Identity owns authorization grants. Existing trainer/curator/account experiences show referral information when authorized. Administrators manage authorized partners. Reuse Notifications. There is no eighth domain or manager-only route.
- **Retained scope:** Referral generation, attribution, commission/reversal calculations, statements and administrative reconciliation remain Full scope. Leads, consent-gated abandoned carts and evidenced manual sales are retained as separately authorized commercial/admin operations, not automatic rights of a referral partner. Their unresolved permission/consent/evidence rules remain blocked.
- **Removed scope:** Dedicated manager dashboard shell, manager-only routing, role-dependent referral identity and duplicate manager UI. MG02 is retired; SALE016–SALE021 retain capability work in Commerce/existing accounts/admin. Completed history remains unchanged.
- **Constraints:** No commission percentage, basis, payout/legal procedure, lead contact permission or manual-sale evidence policy is approved by this change. Historical 10%, USD25 and 30% examples are not new production compensation settings. OQ-011 and remaining separation-of-duties questions stay open.
- **Supersedes:** Manager role/workspace assumptions in S1/S2-derived requirements, phase plans, the Manager Account epic and manager screen registry rows. It does not promote Full finance/referral features into MVP.

### Original question wording retained for traceability

The following questions change terminology, not their unresolved financial/legal substance:

- **OQ-014 (original):** Can managers or trainers also be administrators, and are any role combinations prohibited or subject to separation-of-duties controls?
- **OQ-038 (original):** What constitutes acceptable evidence for manager-created manual enrollment, and who may approve or reverse it?
- **OQ-040 (original):** What is the precedence when referral link, promo code, prior lead ownership, and manual enrollment point to different managers?
- **OQ-041 (original):** How long does manager attribution persist, and is it first-touch, last-touch, promo-specific, or manually overridden?
- **OQ-060 (original):** Is manager commission calculated from gross sales, discounted subtotal, collected cash, or net revenue?
- **OQ-065 (original):** What consent makes an abandoned cart recoverable and permits a manager to see or contact the buyer?
- **OQ-067 (original):** Which contact channels may managers use, and must contact attempts be recorded?

## PD-012 · Fixed release acceptance milestones

- **Status:** Approved
- **Date:** 2026-10-30
- **Evidence:** Same owner restructuring request, sections 2, 11 and 18.
- **Original question:** OQ-087 · The December 7, 2026 and January 26, 2027 dates are planning targets, not guaranteed commitments. Are these targets still current, who owns reforecasting, and which dependency or capacity changes trigger a revised plan?
- **Decision:** MVP production acceptance remains **2026-12-07** and Full production acceptance remains **2027-01-26**. They are immutable in this restructuring; neither deadline nor acceptance meaning may be shifted. The existing **2027-01-20** Full feature cutoff and January21–25 stabilization window are also retained.
- **Constraint:** Fixed dates are not a claim of feasibility. Forecast work past its acceptance milestone must be explicitly flagged. No approved MVP requirement is removed to fit capacity. Scope changes or additional capacity require an explicit owner decision; external approval wait is not engineering effort.
- **Estimation follow-up (2026-10-30):** The owner requested halving each remaining task estimate. Apply exactly once to pending work, preserve scope/tests/completed history and reforecast. This changes the effort assumption, not milestone dates or policy approval. Historical adjusted snapshot: MVP333 h plus Full201.5 h; the MVP capacity deficit persisted. This is provenance, not the current package forecast.
- **Nine-epic follow-up (2026-10-30):** The owner requested coherent 5–10-hour work packages, Russian active planning notes and nine active delivery epics, then confirmed 10 working hours per working day for both phases and requested the tightest credible estimates per package. Preserve the previous reduction as history; do not apply a new blanket factor. Existing weekdays/exclusions remain; no weekend or additional-developer capacity was supplied.
- **Capacity follow-up (2026-11-02):** The owner requested 50 hours per ordinary week and explicitly retained weekends and the November 26, December 25 and January 1 exclusions (40-hour weeks). Remove artificial idle time caused by the two-task daily cap while preserving canonical order, dependencies and per-package estimates. Current remaining effort is 537.5 h (332 MVP + 205.5 Full); no further percentage reduction or overtime is used. Conditional forecasts: MVP December 18, Full January 22; Full capability verification completes January 18 before the January 20 cutoff and the reserved January 21–26 final acceptance window. The MVP capacity deficit remains 82 h.
- **Residual OQ-087:** The daily capacity is now specified. The response to remaining deadline conflicts still requires an explicit scope/capacity decision; the refactor does not move a deadline or cut approved scope.

## PD-013 · BASE02-A domain policy overrides

- **Status:** Approved for conceptual architecture; implementation not delivered
- **Date:** 2026-11-04
- **Evidence:** Direct owner instruction, “Task: BASE02-A — Define the LMS Academy domain entity map and state ownership boundaries”, in this repository chat. No shareable approval URL supplied.
- **Decision:**
  - Preserve one modular monolith, one future database and application-owned stable user identity. Authentication provider is not selected. Internal user identity is independent of external provider identifiers.
  - A user may hold student, trainer, manager and administrator roles concurrently. Guests are unauthenticated. This supersedes PD-011's exclusion of the manager role only; historical attribution remains independent of roles. No new manager permission, dashboard, route or MVP commercial feature is approved.
  - Orders and enrollments/access rights are independent concepts with distinct identities. Administration may grant enrollment without an online purchase; commercial manual-sale evidence requirements remain unresolved.
  - The student's first authorized opening of an enrolled course activates it. Standard courses receive one year of video access; mini-courses receive three months, starting at activation. Supported courses receive 14 days of support from activation. Existing PD-004 independent per-enrollment rights, material-access alignment, extension permissions, pauses and timely-review obligations remain unless explicitly overridden here.
  - Refund eligibility requires a request within 24 hours of payment **and** the purchased course has not been started. Started means activated under the first-opening rule. Administration handles refund execution through Commerce; PD-010's requirement for unattended approval/processing is superseded. This does not select approval mechanics or prohibit automation assisting administration. Verified monetary refund still requires immediate, auditable and replay-safe revocation by Learning without losing financial/learning history.
  - One current trainer/curator per course. Multi-curator/cohort staffing is not assumed; reassignment propagation/history and author-versus-reviewer separation remain unresolved. Mini-courses have no curator support.
  - Preserve all homework attempts, attachments, reviews and curator feedback through revisions, closure and refunds. Access expiry alone does not authorize destructive removal. Reconciliation with PD-007's eventual deletion and applicable legal obligations remains open; no permanent homework retention period is selected.
  - Domain events in BASE02-A are conceptual facts only. No event transport, outbox or event database is designed or implemented by this task.
- **Original question traceability:** OQ-037 originally asked: “What final refund eligibility, legal conditions, exception rules and reason/evidence fields govern automatic Stripe refunds and administrator escalation? PD-010 approves automation, but explicitly calls the seven-day window after confirmed payment, regardless of progress, proposed and subject to applicable law and final rules; do not encode it as final policy.” The base eligibility and execution responsibility are now confirmed above; residual legal, execution and edge-case questions remain OQ-037/OQ-093. OQ-012 originally asked: “Can multiple curators be assigned to one course or cohort, and can one student be reassigned? What history remains visible after reassignment?” One current course assignment is now confirmed; reassignment/visibility remain open.
- **Supersedes:** PD-004 activation trigger and standard-course duration; PD-010 refund eligibility proposal and unattended processing requirement; PD-011 manager-role exclusion; conflicting derived statements in requirements, scope, module workflows and agent instructions. PD-007 expiry-driven homework deletion is subject to the preservation/deletion clarification above. Prior decision bodies remain historical approval evidence.
- **Unchanged:** Seven domains and ADR-0003 runtime boundaries; PD-002 payment provider/currency/no subscriptions; PD-003 media security; PD-005 upload constraints; PD-006 legal approval/acceptance; PD-008 review SLA; PD-009 publishing; PD-010 manual certificate issuance/admin safety; PD-012 deadlines. No package refund behavior, financial exception, production content or scope promotion is inferred.
- **Consequences:** [Entity map](../architecture/entity-map.md) documents conceptual identities, owners, state transitions, scenarios and events. OQ-011–014, OQ-036–039, OQ-048–049, OQ-092–094 and existing completion/certificate/legal dependencies must shape later feature contracts and tests. This documentation task creates no schema, fields, migrations, APIs, UI or business logic and does not reforecast or modify completed Vault history.

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


PD-012 scheduling follow-up, 2026-10-30: the owner requested Russian epic names, sequential epic-specific task numbers, completed-task relocation into the new epic folders, and concentrating on one epic with dependency exceptions. Occasional days above 10 hours are permitted for light work. The working forecast bounds this to one extra hour on at most two weekdays per week for final documentation of settled contracts; this is a conservative planning assumption, not a new product policy. Fixed release dates and scope remain unchanged.

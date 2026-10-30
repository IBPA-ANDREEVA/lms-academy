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

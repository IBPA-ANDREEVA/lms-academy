# LMS delivery scope

> 2026-11-04 precedence update: apply [PD-013](decisions.md#pd-013--base02-a-domain-policy-overrides) to older activation/access/refund/role wording below. Refunds remain MVP with administration-handled execution, within 24 hours of payment and course unstarted; unattended processing is no longer required. Manager membership does not promote commercial workflows or a dashboard into MVP; packages/finance remain later. Use the [entity map](../architecture/entity-map.md) for the distinction between MVP admin access grants and later evidenced offline sales. Homework deletion remains blocked pending preservation/legal reconciliation.

> BASE03-A: [PD-014](decisions.md#pd-014--base03-a-authentication-authorization-and-account-lifecycle) supplies approved identity/session policy and the [90-row permission matrix](permission-matrix.md). Exact selections are preserved; stage-label and older admin review/inspection conflicts remain OQ-096. They do not silently promote later features or authorize a Deny action.

## Purpose

This document divides the product into MVP, Phase 2, and Phase 3 while preserving the priority order in the original technical specification. It also records the dated delivery overlay from the Vault plans.

The phases describe intended scope boundaries, not a claim that every underlying business decision is complete. PD-012 fixes the MVP and Full acceptance deadlines. Feasibility remains conditional on capacity, dependencies, approvals and content readiness; the current forecast does not establish on-time delivery. Unresolved prerequisites remain in [open-questions.md](./open-questions.md), and detailed behavior remains in [requirements.md](./requirements.md).

Source references: S1 is `ТЗ_онлайн_академия_и_личные_кабинеты.docx`; S2 is `Онлайн_академия_дизайн_платформы.pdf`; P1 is the LMS Vault's `Full Project Plan.md`, phase plans, and `Roadmap.md`; P2 is the LMS Vault's epic task maps and linked task records. S1 defines feature priority, S2 supplies interface evidence, and P1/P2 supply delivery planning and engineering slices. The original attachments are now committed under `docs/references/`; earlier review versions preceded that addition. Vault planning source files are not committed here. Approved PD-002–PD-012 (OQ-001–005, OQ-007–010) supersede affected source/Vault assumptions. PD-004 confirms server-enforced support/access deadlines and revocation on refunds/closure; detailed refund and post-expiry rules remain open. The 2026-10-30 Vault restructuring recalculates remaining effort and conditional dates; see [planning audit](../architecture/planning-audit-2026-10-30.md). Fixed acceptance deadlines follow PD-012; forecast overruns are explicit conflicts.

## Planning model and source reconciliation

The original specification defines these phase categories, with approved overrides noted:

- **MVP:** core discovery, purchase, learning, review, full essential administration and authoring (PD-009/PD-010), certificates, email, and Russian;
- **Phase 2:** packages and sales operations, partner and trainer finance, reports, and English;
- **Phase 3:** growth and protection features such as QR verification, push, social login, recommendations, and reviews. PD-003 moves moving student-specific watermarking into MVP.

The original Vault schedule targets an MVP production launch for **December 7, 2026**. It targets both original Phase 2 and original Phase 3 feature work for **December 8, 2026 through January 20, 2027**, then reserves **January 21–26, 2027** for fixes, regression, recovery checks, and release preparation, with a target full production release on **January 26, 2027**. PD-012 preserves these acceptance milestones; projected lateness does not move them.

To avoid losing either intent, this document uses the original feature phases below and treats the Vault dates as a delivery overlay:

| Product phase | Feature priority | Planning target from Vault |
| --- | --- | --- |
| MVP | Launch-critical learning and commerce loop | Target production MVP: December 7, 2026 |
| Phase 2 | Commercial operations, packages, localization, and remaining later administration | Target post-MVP build window; part of the full-release candidate by January 20, 2027 |
| Phase 3 | Growth, trust, protection, and release hardening | Target post-MVP build window; final hardening and target full release on January 26, 2027 |

This differs from the Vault labels, which call all work after December 7 `После MVP`. The distinction here is intentional: it preserves the original specification's priority boundaries.

## MVP

### Outcome

The MVP proves the complete paid-learning loop in production: a user can find a course, create an account, pay, receive access, watch lessons, submit homework, receive trainer feedback, complete the course, and obtain a PDF certificate.

The MVP planning target in the Vault is **December 7, 2026**. The Vault baseline estimated 60 MVP tasks and approximately 296.5 hours before scope expansion. Those figures are historical. The current task-derived workload and explicit milestone conflicts are in the Vault MVP Plan and repository planning audit; no completed UI is counted as working backend.

### Public site and catalog

- Russian-language public navigation and homepage.
- Business-selected course and mini-course catalog, with no engineering minimum count. Full MVP category/course authoring, approval and publication controls follow PD-009; real ready inventory is still required before publication.
- Course and mini-course detail pages with program, trainer, preview, duration, price, level, and available language information.
- Catalog filters needed for the initial inventory, including direction, language availability, and level.
- Shopping cart and checkout entry.
- Public login, registration, email verification, password reset, and recovery interfaces.
- Mobile support for catalog, product, authentication, and checkout flows.
- RU/EN Terms of Sale, Privacy Policy, Refund Policy, and Licensing Disclaimer using legally approved, immutable published versions (PD-006), linked in the footer. This legal-content requirement does not bring full English public navigation into MVP.

Packages, public reviews, recommendation sections, and fully localized English pages are not MVP.

### Identity and authorization

- Email-and-password registration, login, verification, password reset, and sessions.
- Verified email before purchased-course access; 48-hour activation links with secure resend. Paid unclaimed purchases remain claimable after link expiry; existing-account purchase linking requires ownership verification.
- Single-use 30-minute password-reset links; successful recovery revokes all previous sessions. Email changes require reauthentication and verification.
- Manual administrator provisioning/management, password setup/recovery and email changes; secure one-time setup, no public admin signup, hashed passwords and no permanent user passwords in `.env`.
- All roles: 30-day absolute sessions after login, 7-day inactivity expiry refreshed only by genuine authenticated interactions, no polling refresh, multiple devices/sessions allowed. MFA is not required for MVP.
- Recent password reauthentication for sensitive admin actions; immediate blocking/role revocation; login after expiry preserves learning progress. Exact technical mechanisms remain unselected.
- Multi-role data model and server-enforced access rules.
- Minimal role-switching or role-context behavior sufficient for users with multiple roles.
- Minimal administrator navigation and role management.
- Direct API authorization tests for all MVP roles and protected resources.

Google and Apple login are not MVP.

### Payments and enrollment

- Stripe embedded Payment Element using the existing active US-entity account: USD pricing/charges/payouts to the existing US company bank account; US and supported international customers (PD-002).
- Cards, Apple Pay, Google Pay, and Klarna where eligible; Klarna installments for eligible one-time purchases. Verify exact legal entity, settlement configuration and payment-method eligibility before launch.
- Subscriptions excluded from MVP and all future planned phases.
- Persistent cart and server-authoritative price calculation.
- Explicit acknowledgment of all four legal documents, immutable versions, acceptance timestamps/user/order references, and server-side validation. Missing required approved documents in the selected language block checkout (PD-006).
- Server-side USD 2,500 program or package cap validation.
- Idempotent payment callbacks and explicit handling of failed checkout.
- Ownership-verified account resolution, order creation and enrollment after confirmed payment; purchased-course access requires verified email and authorization. Payment never activates enrollment timers.
- Payment confirmation, receipt, enrollment invitation, and sign-in instructions by email.
- Referral identity remains independent of roles (PD-011/PD-013). Manager is in the concurrent-role vocabulary; use the approved matrix selections. No new dashboard or commercial scope is inferred; release discrepancies remain OQ-092/OQ-096.

PD-013 requires administration-handled Stripe refunds in MVP, with requests within 24 hours of payment AND the course unstarted. Confirmed refunds revoke affected access immediately and idempotently. Legal, execution, boundary/race and package details remain OQ-036/OQ-037/OQ-093; unattended processing and the seven-day proposal are superseded. Trainer/partner financial reversals remain later. PD-002 payment-method eligibility still needs launch verification; OQ-029/OQ-031/OQ-032 remain dependencies.

### Student learning

- Student dashboard with purchased courses and progress.
- Ordered lesson list and configurable sequential unlocking.
- Authorized encrypted adaptive HLS player (1080p maximum, 720p/480p variants), resume position and playback speed, selectable RU/EN audio/subtitles where available, and moving student-specific watermark (PD-003).
- Self-managed video on private Cloudflare R2 with separate VPS/VM FFmpeg workers; protected segments/keys and short-lived playback grants. DRM remains after MVP.
- Lesson PDFs, checklists, diagrams, and downloadable materials.
- Mobile-first homework submission with photo and video upload, text comment, and upload previews.
- PD-005 private, resumable homework uploads: maximum 1 GB per file and 1 GB combined originals per submission; no fixed file-count cap. Normalize supported images to maximum 2560px and video to H.264/AAC MP4 maximum 1080p; previews, recovery and authorized signed delivery.
- Homework statuses, revisions, and history.
- PD-013/PD-014 activation on the student's first authorized opening: independent enrollment deadlines of 1 year of standard-course access, 3 calendar months of mini-course access, and 14 consecutive calendar days of support where included. Mini-courses have no support; payment never starts timers. Enforce deadlines server-side.
- Request Extension form remains available after support expiry; assigned curators extend support by up to 14 calendar days per request without extending course access. Administrators may change both deadlines, allow longer exceptions and pause access; freeze applicable timers and restore exact remaining duration.
- Review obligations for work submitted before the permitted deadline survive support expiry and overdue review. Lessons/materials close at the access deadline unless extended.
- A defined post-expiry state for every previously submitted assignment, preserving its explicit status and history. OQ-048 must be decided before the MVP state machine and acceptance tests can be completed.
- Automatic certificate eligibility for main courses and mini-courses according to their completion rules.
- Administrator eligibility-review queue and evidence inspection, followed by manual issuance for every course type, including mini-courses; automatic eligibility must not auto-issue. PDF generation uses the approved default academy template unless an approved custom template is assigned, with unique number, required disclaimer, audit and duplicate protection (PD-009/PD-010).
- Students see homework expected review deadlines and current statuses (PD-008).

The visible 14-day support countdown, full course-scoped messaging experience, recommendations, reviews, full student profile and purchase history are Phase 2 or Phase 3 as listed below. Available RU/EN media selection is part of PD-003 playback; full interface localization remains Phase 2. Deferring the countdown does not defer server-side support-expiration enforcement.

### Trainer-curator workflow

- Trainer dashboard shell and review interface.
- Queue of assigned homework awaiting review.
- Review detail with protected photo and video viewing.
- Text feedback.
- Accept and request-revision actions.

Full trainer course/lesson/material authoring for assigned courses and price proposals are MVP under PD-009; administrators approve content/prices and control publication. PD-003 upload limits still apply. PD-008 brings 48 counted weekday-hour SLA calculation, timezone snapshots, student deadline/status visibility, immediate and 24/12/6/1-hour/overdue notifications and persistent administrator alerts into MVP. Its older administrator review grant conflicts with PD-014 matrix Deny; OQ-096 must reconcile that workflow. Voice feedback, accrual calculation and payout history remain later scope.

### Essential administration

- Full essential admin dashboard without routine developer intervention; infrastructure recovery/server management stay outside it (PD-010).
- View permitted user information; block/unblock accounts; manually grant/suspend/restore/revoke course access. Account creation/role assignment remain separately defined authorized workflows.
- Full category/course authoring, content/pricing approval and independent visibility/sale/archive controls; validate required lessons/video/materials/homework and trainer-curator assignment before publication. Pausing sales/archiving preserves existing entitlements (PD-009).
- Order/refund/status/exception inspection; administration-handled Stripe refunds and immediate confirmed-refund access revocation (PD-013).
- Certificate review queue, completion-evidence inspection and manual issuance for all course types.
- Permitted course/student progress/deadline/request monitoring under the matrix. Older submission/conversation inspection and administrator homework-review scope conflict with selected Admin Deny; OQ-096 remains a delivery blocker for those workflows.
- Persistent administrator notifications and separate restricted operational/error-log viewer with date/severity/operation/resource/reference-ID search/filtering, clear descriptions and protected diagnostics.
- Confirmation popup explaining consequences, explicit confirmation and recent password reauthentication for sensitive administrative operations; server authorization and actor/action/resource/time/outcome audit evidence.
- Administrative audit trail, logging, and backups under PD-007.
- Administrator video upload/publication controls (PD-003), support/access deadline overrides and pause/restore operations (PD-004), and policy upload/version/approval/publication management (PD-006).

PD-009/PD-010 supersede the earlier minimal-admin/seed-only operating assumption. Authoring, refund, certificate and monitoring tasks are included in the revised MVP forecast; any overrun remains a release conflict. Packages, finance/payout exports, business reports and other separately deferred features are not promoted merely by the phrase essential administration. The scope of course-scoped conversations visible to admins must be reconciled with the still-later student messaging work; no new messaging feature set is inferred.

### Notifications

MVP email infrastructure and reusable templates must cover the events needed for the launch loop:

- payment confirmation, receipt, access, and account instructions;
- immediate homework notification, reminders at 24/12/6/1 counted hours remaining and overdue notice for the curator; persistent, auditable administrator overdue notifications (PD-008);
- text feedback or revision response for the student;
- certificate ready;
- policy changes to affected students (material changes require renewed acknowledgment at next checkout, editorial changes notification only; access continues), and account-deletion requests to administrators (PD-006/PD-007).

Assignment-to-student reminders, support-expiry warning, authorized commercial-operation messages, monthly payout summaries and push remain later scope unless separately required. PD-008 review reminders/admin overdue notices and PD-010 refund exceptions/failures are MVP.

### Platform and quality gates

- Data model, migrations, indexes, and non-production fixture data.
- Durable processing, retries, and scheduled-job foundation.
- Private file storage and self-managed encrypted video delivery/processing (PD-003): persistent queue, initially one job, three automatic retries, manual recovery, failed-publication prevention and previous-version preservation.
- Resilient homework media processing.
- PD-007 safeguards as qualified by PD-013: access expiry alone never destroys homework history; preservation/deletion reconciliation remains OQ-008/OQ-094. Permanent certificate evidence, 30-day routine logs/encrypted restricted backups and deletion-restoration safeguards remain required.
- HTTPS, server-side authorization, audit trail, logging, and database backups.
- Automated test framework and CI quality gates.
- Tests for multi-role authorization, payment callbacks, duplicate delivery, failed checkout, and the end-to-end purchase-to-certificate path.
- Tests proving that expired curator support blocks protected actions server-side and that a confirmed refund immediately revokes access with audit evidence.
- Desktop and mobile acceptance testing.
- Final legal sign-off before production payment.
- Production smoke test and documented acceptance decision.

### MVP exit criteria

MVP is complete only when:

1. Implement PD-002–PD-010 and complete their launch checks: Stripe configuration/eligibility, video operational evidence, ready business-selected catalog, legal texts/retention verification, and essential admin UI. OQ-006 remains deferred; final refund rules and other explicit dependencies remain blockers. No temporary policy or minimum course quota is inferred.
2. A guest can complete a real or production-equivalent Russian-language purchase without duplicate fulfillment.
3. Paid fulfillment requires confirmed payment and ownership-verified account resolution; purchased-course access requires verified email and authorization. Separately authorized admin enrollment grants need no online payment (PD-013). No direct request may bypass permissions; payment alone never starts timers.
4. A student can complete the full lesson, homework, revision, acceptance, and certificate flow on a phone and desktop.
5. A curator can review private media and return text feedback without seeing prohibited student contact data.
6. OQ-021, OQ-048, and OQ-049 are decided before their dependent progress, certificate, support-expiry, and authorization tests are accepted.
7. Expired curator support blocks disallowed protected actions, including direct requests, while curators must still review work submitted before the permitted deadline. Detailed post-expiration transitions require OQ-048.
8. Every assignment submitted before expiry retains an explicit lifecycle status and follows the approved post-expiry transition policy; no submitted assignment is stranded in an undefined state.
9. Administration handles eligible Stripe refunds under PD-013 and resolved OQ-037/OQ-093 rules. Confirmed refunds immediately revoke affected access with audit evidence and without duplicates.
10. Launch staff perform all essential business operations through the admin dashboard without developer intervention, including safe access changes, content/pricing approval, monitoring and manual certificate issuance. Infrastructure recovery remains outside the dashboard. PD-008 SLA/reminders and explicit confirmations for sensitive operations pass acceptance.
11. Backups, logging, legal evidence, and the critical email path are operational.
12. PD-014 identity/session requirements pass verification after implementation; unresolved resource conditions and OQ-096 scope/workflow conflicts are resolved before accepting dependent flows. MVP acceptance and production smoke tests pass, with known limitations recorded.

## Phase 2

### Outcome

Phase 2 makes the academy commercially operable beyond the launch cohort: packages and discounts work, authorized referral partners and trainers can see attributable money, administrators manage the catalog and operations directly, curator communication is complete, and the product supports Russian and English.

In the Vault planning schedule, Phase 2 work is interleaved with Phase 3 growth work in the target window from December 8, 2026 through January 20, 2027. The feature boundary below follows the original specification, not the interleaved calendar order. The window is not a guaranteed commitment.

### Packages, promotions, and payment operations

- Package builder for 2, 3, and 6 directions plus the Start in the USA module.
- Fixed package pricing and savings display.
- Package entitlement and cart upgrade suggestions.
- Percentage and fixed-amount promo-code engine with validity, limits, referral-partner association, and product restrictions.
- Referral-partner attribution through promo code, referral link, and manual enrollment.
- Recoverable abandoned-cart tracking under approved consent rules.
- Further payment regression builds on PD-002 eligibility-dependent Stripe methods already included in MVP.
- Trainer/partner accrual corrections; administration-handled Stripe refunds and access revocation are already MVP under PD-013.

### Student account completion

- Course-scoped student-curator messaging.
- Visible 14-day support countdown and richer expiry-state presentation. Server-side expiration enforcement is already required in MVP.
- Student profile with Cyrillic and Latin certificate names, phone, locale, purchase history, and receipts.
- Full RU/EN interface and course localization beyond PD-003 available audio/subtitle selection already required by the MVP player.
- Support-expiry reminders and other complete operational email templates.

### Trainer-curator account completion

- Further refinements to course authoring/publication and SLA workflows already required in MVP by PD-008/PD-009; no baseline deferral.
- Main-course per-student accruals.
- Mini-course percentage earnings.
- Accrued and paid states, payment dates, refund corrections, and trainer payout history.
- Optional voice feedback on homework.

### Referral and commercial capabilities (PD-011)

- Authorized attributed-order views in existing account/admin experiences; no separate manager dashboard.
- Configurable commission calculation after refunds.
- Leads and consent-compliant abandoned-cart pipeline.
- Personal promo codes and referral links for explicitly authorized accounts, independent of roles.
- Separately authorized administrative manual sales with payment evidence and actor/partner attribution; a referral link grants no enrollment permission.
- Commission statement and reconciliation totals.

### Remaining later administration

- Package CRUD and later localized-content expansion beyond PD-009 MVP category/course/lesson authoring.
- Finance rate/commission management and later authorized manual-enrollment operations.
- Further refinements beyond PD-010 essential user/access/order/refund, certificate review/issuance, course monitoring and log operations already required in MVP.
- Certificate correction, revocation and reissuance remain subject to separate decisions, not implied by template or issuance tools.
- Package administration.
- Trainer and partner payout reconciliation and Excel-compatible export.
- Revenue, sales mix, students, trainers, referral partners, and acquisition-source reports.

### Localization and analytics

- Scalable RU/EN localization architecture.
- English public pages, product metadata, course media, and certificate template where content exists.
- Localization QA for navigation, content, and media.
- UTM capture, analytics events, Google Analytics, and Meta Pixel after consent and event definitions are approved.

### Phase 2 exit criteria

Phase 2 is complete when package and promotion totals are correct on the server; attribution, refunds, commissions, and trainer accruals reconcile; administrators can operate the catalog and commercial workflows without developer intervention; and the approved RU/EN experience passes functional and content QA.

## Phase 3

### Outcome

Phase 3 adds growth, trust, and deterrence features, then hardens the complete platform for the full production release.

The original specification assigned QR verification, watermarking, push, social login, recommendations, and reviews to Phase 3. PD-003 supersedes the watermark placement: moving student-specific watermarking is MVP. The Vault plan targets most of these during the broader post-MVP window and uses the final target days for full regression and release preparation.

### Growth and engagement

- Contextual course, mini-course, and package recommendations.
- Public and post-course student ratings and reviews.
- Administrator review moderation and quality dashboards.
- Google and Apple login with safe account linking.
- Push notifications where a channel and user-permission model are approved.

### Certificate trust

- QR code on certificates.
- Public certificate verification page showing approved fields.
- Certificate revocation and a verified registry that preserves history.
- Privacy, enumeration, reissue, and revoked-status rules finalized and tested.

### Video protection

- Further hardening and regression of the PD-003 MVP moving student-specific watermark, short-lived playback access, and protected segments/keys.
- DRM is deferred until after MVP; no implementation, vendor or exact later phase is selected.
- Verification that protected playback and media access remain authorized under the self-managed delivery architecture.

These controls deter sharing and limit unauthorized access; they do not guarantee prevention of screen recording.

### Full-release hardening

- End-to-end tests for packages, promo codes, attribution, refunds, commissions, and payouts.
- Tests for QR verification, watermarking, reviews, recommendations, and social login.
- Mobile performance, accessibility, and media-load audit.
- Backup restoration verification.
- Operations runbook and rollback plan.
- Full regression across Russian and English.
- Production deployment and smoke tests.

### Phase 3 exit criteria

Phase 3 is complete when the growth and trust features satisfy their approved policies, the full cross-role suite passes regression, backup restoration and rollback procedures have been exercised, critical mobile and accessibility defects are resolved, and the full production release passes smoke testing.

## Explicitly deferred until decided

The following items cannot be treated as implementation-ready merely because a phase lists the surrounding feature:

- exact Stripe legal-entity verification, settlement configuration and payment-method eligibility before launch (provider/account ownership/currency are approved);
- video worker provider/capacity, encryption-key management, recovery and supported-browser/operational verification (self-managed R2/FFmpeg architecture is approved);
- remaining calendar/timezone, overlapping-extension and post-expiration transitions;
- remaining SLA implementation/operational edge cases under PD-008 dependencies; its 48 counted weekday-hour rule and notification schedule are approved;
- trainer payout method and financial policy;
- academy name and domain;
- final legally approved RU/EN texts and legal retention periods/exceptions; PD-006/PD-007 workflows and product rules are approved;
- certificate privacy, reissue, and package rules;
- refund, attribution, discount, tax, and currency edge cases.

See [open-questions.md](./open-questions.md) for the decision register.

## Revised planning workflow · 2026-10-30

PD-011's historical manager-role exclusion is superseded by PD-013 membership and PD-014 matrix selections; no dedicated dashboard or silent promotion of Full referral/finance is approved. ADR-0003 preserves frontend features and seven Python domain owners. Every capability epic includes preparation, references where needed, implementation, real integration and scheduled verification. Existing complete task files remain immutable. Follow the current Vault plans and [audit](../architecture/planning-audit-2026-10-30.md), not historical baseline totals.

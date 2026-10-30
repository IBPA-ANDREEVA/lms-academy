# LMS delivery scope

## Purpose

This document divides the product into MVP, Phase 2, and Phase 3 while preserving the priority order in the original technical specification. It also records the dated delivery overlay from the Vault plans.

The phases describe intended scope boundaries, not a claim that every underlying business decision is complete. All dates in this document are planning targets from the Vault records, contingent on the stated capacity, dependencies, approvals, and content readiness. They are not guaranteed delivery commitments. Unresolved prerequisites remain in [open-questions.md](./open-questions.md), and detailed behavior remains in [requirements.md](./requirements.md).

Source references: S1 is `ТЗ_онлайн_академия_и_личные_кабинеты.docx`; S2 is `Онлайн_академия_дизайн_платформы.pdf`; P1 is the LMS Vault's `Full Project Plan.md`, phase plans, and `Roadmap.md`; P2 is the LMS Vault's epic task maps and linked task records. S1 defines feature priority, S2 supplies interface evidence, and P1/P2 supply delivery planning and engineering slices. The original attachments are now committed under `docs/references/`; earlier review versions preceded that addition. Vault planning source files are not committed here. Approved PD-002–PD-010 (OQ-001–005, OQ-007–010) supersede affected source/Vault assumptions. PD-004 confirms server-enforced support/access deadlines and revocation on refunds/closure; detailed refund and post-expiry rules remain open. Original estimates and dates have not been recalculated for the approved scope changes.

## Planning model and source reconciliation

The original specification defines these phase categories, with approved overrides noted:

- **MVP:** core discovery, purchase, learning, review, full essential administration and authoring (PD-009/PD-010), certificates, email, and Russian;
- **Phase 2:** packages and sales operations, manager and trainer finance, reports, and English;
- **Phase 3:** growth and protection features such as QR verification, push, social login, recommendations, and reviews. PD-003 moves moving student-specific watermarking into MVP.

The original Vault schedule targets an MVP production launch for **December 7, 2026**. It targets both original Phase 2 and original Phase 3 feature work for **December 8, 2026 through January 20, 2027**, then reserves **January 21–26, 2027** for fixes, regression, recovery checks, and release preparation, with a target full production release on **January 26, 2027**. These are planning targets, not guaranteed commitments.

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

The MVP planning target in the Vault is **December 7, 2026**. The Vault baseline estimated 60 MVP tasks and approximately 296.5 hours before its visual-polish additions and this decision synchronization. Those figures are historical: PM14/INF17 now carry MVP tags, required slices have expanded, and capacity/dates still need review. No new estimate or delivery commitment is implied.

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
- Automatic account resolution, order creation, enrollment, and access after confirmed payment.
- Payment confirmation, receipt, enrollment invitation, and sign-in instructions by email.
- Initial manager attribution fields may exist in the data model, but manager tools and commission calculations are not MVP.

PD-010 requires automatic Stripe approval/processing of eligible refund requests without administrator approval in MVP, escalation of exceptions/failures, and idempotent confirmed-refund access revocation. Final eligibility remains under OQ-037: the supplied seven-day window after payment, regardless of progress, is explicitly proposed and legally conditional. Trainer/manager financial reversals remain with their later modules. PD-002 supersedes the old wallet deferral; payment-method availability is eligibility-dependent and must be verified before launch. OQ-029, OQ-031, OQ-032, OQ-036 and OQ-037 remain unresolved.

### Student learning

- Student dashboard with purchased courses and progress.
- Ordered lesson list and configurable sequential unlocking.
- Authorized encrypted adaptive HLS player (1080p maximum, 720p/480p variants), resume position and playback speed, selectable RU/EN audio/subtitles where available, and moving student-specific watermark (PD-003).
- Self-managed video on private Cloudflare R2 with separate VPS/VM FFmpeg workers; protected segments/keys and short-lived playback grants. DRM remains after MVP.
- Lesson PDFs, checklists, diagrams, and downloadable materials.
- Mobile-first homework submission with photo and video upload, text comment, and upload previews.
- PD-005 private, resumable homework uploads: maximum 1 GB per file and 1 GB combined originals per submission; no fixed file-count cap. Normalize supported images to maximum 2560px and video to H.264/AAC MP4 maximum 1080p; previews, recovery and authorized signed delivery.
- Homework statuses, revisions, and history.
- PD-004 activation by explicitly marking the introductory course rules page as viewed; independent per-course deadlines of 14 consecutive calendar days of support and 3 calendar months of access. Enforce deadlines server-side.
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

Full trainer course/lesson/material authoring for assigned courses and price proposals are MVP under PD-009; administrators approve content/prices and control publication. PD-003 upload limits still apply. PD-008 brings 48 counted weekday-hour SLA calculation, timezone snapshots, student deadline/status visibility, immediate and 24/12/6/1-hour/overdue notifications, persistent administrator alerts and administrator review permissions into MVP. Voice feedback, accrual calculation and payout history remain later scope.

### Essential administration

- Full essential admin dashboard without routine developer intervention; infrastructure recovery/server management stay outside it (PD-010).
- View permitted user information; block/unblock accounts; manually grant/suspend/restore/revoke course access. Account creation/role assignment remain separately defined authorized workflows.
- Full category/course authoring, content/pricing approval and independent visibility/sale/archive controls; validate required lessons/video/materials/homework and trainer-curator assignment before publication. Pausing sales/archiving preserves existing entitlements (PD-009).
- Order/refund/status/exception inspection; automatic Stripe refunds and confirmed-refund access revocation.
- Certificate review queue, completion-evidence inspection and manual issuance for all course types.
- Course/student progress, submissions, review history/deadlines, course-scoped conversations and student-request status monitoring; full administrator homework review without changing assigned curator.
- Persistent administrator notifications and separate restricted operational/error-log viewer with date/severity/operation/resource/reference-ID search/filtering, clear descriptions and protected diagnostics.
- Confirmation popup explaining consequences and explicit confirmation for sensitive administrative operations; server authorization and actor/action/resource/time/outcome audit evidence.
- Administrative audit trail, logging, and backups under PD-007.
- Administrator video upload/publication controls (PD-003), support/access deadline overrides and pause/restore operations (PD-004), and policy upload/version/approval/publication management (PD-006).

PD-009/PD-010 supersede the earlier minimal-admin/seed-only operating assumption. Existing later-dated authoring, refund, certificate and monitoring task cards now contain required MVP work and need reforecasting. Packages, finance/payout exports, business reports and other separately deferred features are not promoted merely by the phrase essential administration. The scope of course-scoped conversations visible to admins must be reconciled with the still-later student messaging work; no new messaging feature set is inferred.

### Notifications

MVP email infrastructure and reusable templates must cover the events needed for the launch loop:

- payment confirmation, receipt, access, and account instructions;
- immediate homework notification, reminders at 24/12/6/1 counted hours remaining and overdue notice for the curator; persistent, auditable administrator overdue notifications (PD-008);
- text feedback or revision response for the student;
- certificate ready;
- policy changes to affected students (material changes require renewed acknowledgment at next checkout, editorial changes notification only; access continues), and account-deletion requests to administrators (PD-006/PD-007).

Assignment-to-student reminders, support-expiry warning, manager messages, monthly payout summaries and push remain later scope unless separately required. PD-008 review reminders/admin overdue notices and PD-010 refund exceptions/failures are MVP.

### Platform and quality gates

- Data model, migrations, indexes, and non-production fixture data.
- Durable processing, retries, and scheduled-job foundation.
- Private file storage and self-managed encrypted video delivery/processing (PD-003): persistent queue, initially one job, three automatic retries, manual recovery, failed-publication prevention and previous-version preservation.
- Resilient homework media processing.
- PD-007 retention/deletion safeguards, including course-access lifecycle deletion with outstanding-review/legal exceptions, permanent certificate evidence, 30-day routine logs and encrypted restricted backups, and restoration safeguards for deleted personal data. Legal retention verification remains required.
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
3. Access is granted only after confirmed payment and cannot be obtained through direct unauthorized requests.
4. A student can complete the full lesson, homework, revision, acceptance, and certificate flow on a phone and desktop.
5. A curator can review private media and return text feedback without seeing prohibited student contact data.
6. OQ-021, OQ-048, and OQ-049 are decided before their dependent progress, certificate, support-expiry, and authorization tests are accepted.
7. Expired curator support blocks disallowed protected actions, including direct requests, while curators must still review work submitted before the permitted deadline. Detailed post-expiration transitions require OQ-048.
8. Every assignment submitted before expiry retains an explicit lifecycle status and follows the approved post-expiry transition policy; no submitted assignment is stranded in an undefined state.
9. Eligible refunds are automatically approved/processed through Stripe using final approved rules; exceptions/failures reach administrators. Confirmed refunds automatically revoke access with audit evidence and without duplicates.
10. Launch staff perform all essential business operations through the admin dashboard without developer intervention, including safe access changes, content/pricing approval, monitoring and manual certificate issuance. Infrastructure recovery remains outside the dashboard. PD-008 SLA/reminders and explicit confirmations for sensitive operations pass acceptance.
11. Backups, logging, legal evidence, and the critical email path are operational.
12. MVP acceptance and production smoke tests pass, with known limitations recorded.

## Phase 2

### Outcome

Phase 2 makes the academy commercially operable beyond the launch cohort: packages and discounts work, managers and trainers can see attributable money, administrators manage the catalog and operations directly, curator communication is complete, and the product supports Russian and English.

In the Vault planning schedule, Phase 2 work is interleaved with Phase 3 growth work in the target window from December 8, 2026 through January 20, 2027. The feature boundary below follows the original specification, not the interleaved calendar order. The window is not a guaranteed commitment.

### Packages, promotions, and payment operations

- Package builder for 2, 3, and 6 directions plus the Start in the USA module.
- Fixed package pricing and savings display.
- Package entitlement and cart upgrade suggestions.
- Percentage and fixed-amount promo-code engine with validity, limits, manager association, and product restrictions.
- Manager attribution through promo code, referral link, and manual enrollment.
- Recoverable abandoned-cart tracking under approved consent rules.
- Further payment regression builds on PD-002 eligibility-dependent Stripe methods already included in MVP.
- Trainer/manager accrual corrections; automatic Stripe refund processing and access revocation are already MVP under PD-010.

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

### Manager account

- Sales dashboard and attributed order list.
- Configurable commission calculation after refunds.
- Leads and consent-compliant abandoned-cart pipeline.
- Personal promo codes and referral link.
- Manual enrollment with payment evidence and actor attribution.
- Commission statement and reconciliation totals.

### Remaining later administration

- Package CRUD and later localized-content expansion beyond PD-009 MVP category/course/lesson authoring.
- Finance rate/commission management and later manager manual-enrollment operations.
- Further refinements beyond PD-010 essential user/access/order/refund, certificate review/issuance, course monitoring and log operations already required in MVP.
- Certificate correction, revocation and reissuance remain subject to separate decisions, not implied by template or issuance tools.
- Package administration.
- Trainer and manager payout reconciliation and Excel-compatible export.
- Revenue, sales mix, students, trainers, managers, and acquisition-source reports.

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

# LMS delivery scope

## Purpose

This document divides the product into MVP, Phase 2, and Phase 3 while preserving the priority order in the original technical specification. It also records the dated delivery overlay from the Vault plans.

The phases describe intended scope boundaries, not a claim that every underlying business decision is complete. All dates in this document are planning targets from the Vault records, contingent on the stated capacity, dependencies, approvals, and content readiness. They are not guaranteed delivery commitments. Unresolved prerequisites remain in [open-questions.md](./open-questions.md), and detailed behavior remains in [requirements.md](./requirements.md).

Source references: S1 is `ТЗ_онлайн_академия_и_личные_кабинеты.docx`; S2 is `Онлайн_академия_дизайн_платформы.pdf`; P1 is the LMS Vault's `Full Project Plan.md`, phase plans, and `Roadmap.md`; P2 is the LMS Vault's epic task maps and linked task records. S1 defines feature priority, S2 supplies interface evidence, and P1/P2 supply delivery planning and engineering slices. The original attachments are now committed under `docs/references/`; earlier review versions preceded that addition. Vault planning source files are not committed here. The MVP placement of server-side support expiration and immediate auditable access revocation after a confirmed refund are scope corrections pending product-owner approval because the reviewed source set contains no explicit approval evidence. If approved, they narrow the broader deferral implied by P1/P2 without changing the original business rules in S1.

## Planning model and source reconciliation

The original specification defines:

- **MVP:** core discovery, purchase, learning, review, basic administration, certificates, email, and Russian;
- **Phase 2:** packages and sales operations, manager and trainer finance, reports, and English;
- **Phase 3:** growth and protection features such as QR verification, watermarking, push, social login, recommendations, and reviews.

The later Vault plan keeps the MVP feature cut and targets an MVP production launch for **December 7, 2026**. It targets both original Phase 2 and original Phase 3 feature work for **December 8, 2026 through January 20, 2027**, then reserves **January 21–26, 2027** for fixes, regression, recovery checks, and release preparation, with a target full production release on **January 26, 2027**. These are planning targets, not guaranteed commitments.

To avoid losing either intent, this document uses the original feature phases below and treats the Vault dates as a delivery overlay:

| Product phase | Feature priority | Planning target from Vault |
| --- | --- | --- |
| MVP | Launch-critical learning and commerce loop | Target production MVP: December 7, 2026 |
| Phase 2 | Commercial operations, packages, localization, and full administration | Target post-MVP build window; part of the full-release candidate by January 20, 2027 |
| Phase 3 | Growth, trust, protection, and release hardening | Target post-MVP build window; final hardening and target full release on January 26, 2027 |

This differs from the Vault labels, which call all work after December 7 `После MVP`. The distinction here is intentional: it preserves the original specification's priority boundaries.

## MVP

### Outcome

The MVP proves the complete paid-learning loop in production: a user can find a course, create an account, pay, receive access, watch lessons, submit homework, receive trainer feedback, complete the course, and obtain a PDF certificate.

The MVP planning target in the Vault is **December 7, 2026**. The plan estimates 49 tasks and 227.5 hours, based on assumptions documented in the Vault rather than guaranteed delivery capacity or a delivery commitment.

### Public site and catalog

- Russian-language public navigation and homepage.
- Initial course and mini-course catalog populated from prepared data.
- Course and mini-course detail pages with program, trainer, preview, duration, price, level, and available language information.
- Catalog filters needed for the initial inventory, including direction, language availability, and level.
- Shopping cart and checkout entry.
- Public login, registration, email verification, password reset, and recovery interfaces.
- Mobile support for catalog, product, authentication, and checkout flows.
- Public offer, privacy policy, refund policy, and licensing disclaimer using lawyer-approved content.

Packages, public reviews, recommendation sections, and fully localized English pages are not MVP.

### Identity and authorization

- Email-and-password registration, login, verification, password reset, and sessions.
- Multi-role data model and server-enforced access rules.
- Minimal role-switching or role-context behavior sufficient for users with multiple roles.
- Minimal administrator navigation and role management.
- Direct API authorization tests for all MVP roles and protected resources.

Google and Apple login are not MVP.

### Payments and enrollment

- Selected payment provider configured for card checkout.
- Persistent cart and server-authoritative price calculation.
- Mandatory legal consents and versioned evidence.
- Server-side USD 2,500 program or package cap validation.
- Idempotent payment callbacks and explicit handling of failed checkout.
- Automatic account resolution, order creation, enrollment, and access after confirmed payment.
- Payment confirmation, receipt, enrollment invitation, and sign-in instructions by email.
- Initial manager attribution fields may exist in the data model, but manager tools and commission calculations are not MVP.

For MVP, the monetary refund may be performed manually through the payment provider. Once the refund is confirmed, the LMS must immediately revoke the affected access and record an auditable link between the refund confirmation, actor, order, enrollment, timestamp, and resulting access state. Automated provider-side refund initiation and trainer or manager financial reversals remain Phase 2 because those financial modules are not part of MVP. Apple Pay and Google Pay require provider verification and are not launch blockers unless explicitly approved as such.

### Student learning

- Student dashboard with purchased courses and progress.
- Ordered lesson list and configurable sequential unlocking.
- Authorized protected-video player with resume position and playback speed.
- Lesson PDFs, checklists, diagrams, and downloadable materials.
- Mobile-first homework submission with photo and video upload, text comment, and upload previews.
- Private media storage and normalization or compression pipeline within approved limits.
- Homework statuses, revisions, and history.
- Server-side enforcement of the configured curator-support expiration for homework and any enabled course-scoped communication; expired actions must not remain available through direct requests.
- A defined post-expiry state for every previously submitted assignment, preserving its explicit status and history. OQ-048 must be decided before the MVP state machine and acceptance tests can be completed.
- Automatic certificate eligibility for main courses and mini-courses according to their completion rules.
- PDF certificate generation with a unique number and required disclaimer.

The visible 14-day support countdown, full course-scoped messaging experience, recommendations, reviews, full student profile and purchase history, and RU/EN course media controls are Phase 2 or Phase 3 as listed below. Deferring the countdown does not defer server-side support-expiration enforcement.

### Trainer-curator workflow

- Trainer dashboard shell and review interface.
- Queue of assigned homework awaiting review.
- Review detail with protected photo and video viewing.
- Text feedback.
- Accept and request-revision actions.

Trainer course authoring, SLA clocks and overdue alerts, voice feedback, accrual calculation, and payout history are not MVP.

### Minimal administration

- Minimal user and role administration.
- Initial course, lesson, media, pricing, and enrollment data loaded through prepared seed or controlled operational processes.
- Minimal operational access required to support the launch cohort.
- Minimal refund record and immediate access-revocation operation with an audit trail.
- Administrative audit trail, logging, and backups.

The Vault plan deliberately moves complete direction/course/lesson CRUD, publication controls, full order tools, package management, certificate registry, quality dashboards, payout exports, and reports after MVP. This is narrower than the original specification's phrase `basic admin`; it remains acceptable only if launch staff can safely perform every required MVP operation through documented controlled processes.

### Notifications

MVP email infrastructure and reusable templates must cover the events needed for the launch loop:

- payment confirmation, receipt, access, and account instructions;
- new homework for the trainer-curator;
- text feedback or revision response for the student;
- certificate ready.

Assignment reminders, support-expiry warning, SLA warnings, administrator overdue notices, manager messages, monthly payout summaries, and push are later scope unless needed to make a launch workflow safe.

### Platform and quality gates

- Data model, migrations, indexes, and non-production fixture data.
- Durable processing, retries, and scheduled-job foundation.
- Private file storage and protected video hosting integration.
- Resilient homework media processing.
- Legal-record retention safeguards.
- HTTPS, server-side authorization, audit trail, logging, and database backups.
- Automated test framework and CI quality gates.
- Tests for multi-role authorization, payment callbacks, duplicate delivery, failed checkout, and the end-to-end purchase-to-certificate path.
- Tests proving that expired curator support blocks protected actions server-side and that a confirmed refund immediately revokes access with audit evidence.
- Desktop and mobile acceptance testing.
- Final legal sign-off before production payment.
- Production smoke test and documented acceptance decision.

### MVP exit criteria

MVP is complete only when:

1. The payment provider, legal entity, video provider, access duration, upload policy, review SLA, academy identity, and launch legal texts are approved or explicitly handled by a documented temporary launch policy.
2. A guest can complete a real or production-equivalent Russian-language purchase without duplicate fulfillment.
3. Access is granted only after confirmed payment and cannot be obtained through direct unauthorized requests.
4. A student can complete the full lesson, homework, revision, acceptance, and certificate flow on a phone and desktop.
5. A curator can review private media and return text feedback without seeing prohibited student contact data.
6. OQ-021, OQ-048, and OQ-049 are decided before their dependent progress, certificate, support-expiry, and authorization tests are accepted.
7. Expired curator support blocks the protected submission, revision, review, and enabled messaging actions defined by the approved launch policy, including through direct requests.
8. Every assignment submitted before expiry retains an explicit lifecycle status and follows the approved post-expiry transition policy; no submitted assignment is stranded in an undefined state.
9. A confirmed refund immediately revokes affected access and leaves auditable evidence even when the monetary refund was processed manually.
10. Launch staff can support users, correct access safely, record refund decisions, and inspect audit evidence.
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
- Apple Pay, Google Pay, and mobile checkout where supported by the selected provider.
- Automated provider-side refund operations and trainer or manager accrual corrections. Immediate access revocation after a confirmed refund is already required in MVP.

### Student account completion

- Course-scoped student-curator messaging.
- Visible 14-day support countdown and richer expiry-state presentation. Server-side expiration enforcement is already required in MVP.
- Student profile with Cyrillic and Latin certificate names, phone, locale, purchase history, and receipts.
- RU/EN interface and course controls, including available audio tracks and subtitles.
- Support-expiry reminders and other complete operational email templates.

### Trainer-curator account completion

- Trainer-owned course draft and lesson upload interface.
- Administrator approval and publication controls.
- Review SLA clocks, approaching-deadline notifications, overdue highlighting, and administrator notices.
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

### Full administration

- Direction, course, mini-course, lesson, and package CRUD.
- Localized content, lesson ordering, price, publication, sale-state, and trainer assignment controls.
- Full user, role, block, access, rate, and commission management.
- All-order view, refund controls, manual-enrollment inspection, and access state.
- Certificate templates and issuance registry.
- Overdue homework monitoring and curator assignments.
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

The original specification assigns QR verification, watermarking, push, social login, recommendations, and reviews to Phase 3. The Vault plan targets most of these during the broader post-MVP window and uses the final target days for full regression and release preparation.

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

- Personalized student-email watermark overlay in playback.
- Hardened signed playback URLs and expiration.
- Verification that protected playback and media access cannot be reused outside authorized sessions under the selected provider's capabilities.

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

- payment provider and receiving legal entity;
- video-hosting provider;
- exact course-access and curator-support clocks;
- homework file formats, counts, and service limits;
- curator response SLA;
- trainer payout method and financial policy;
- academy name and domain;
- final legal copy and retention period;
- certificate privacy, reissue, and package rules;
- refund, attribution, discount, tax, and currency edge cases.

See [open-questions.md](./open-questions.md) for the decision register.

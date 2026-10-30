# LMS product requirements

## Purpose and source authority

This document defines the intended behavior of the online academy for future product and engineering work. It consolidates the original Russian technical specification, the five-page wireframe PDF, and the LMS planning notes. It describes required behavior, including the owner-approved selections in [decisions.md](./decisions.md), without resolving questions that remain open.

Source references used in this document:

| Reference | Source | Use |
| --- | --- | --- |
| S1 | `ТЗ_онлайн_академия_и_личные_кабинеты.docx` | Original business rules, roles, workflows, constraints, phases, and explicit open questions |
| S2 | `Онлайн_академия_дизайн_платформы.pdf` | Five-page wireframe evidence for the public catalog, student mobile dashboard and lesson, and trainer review queue |
| P1 | LMS Vault: `Full Project Plan.md`, `MVP Plan.md`, `Phase 2 Plan.md`, `Phase 3 Plan.md`, and `Roadmap.md` | Delivery sequencing, target dates, launch assumptions, and manual MVP operations |
| P2 | LMS Vault: `Epic Task Maps/*.md` and linked task records | Implementation slices, quality gates, and engineering refinements |

The original technical specification and wireframe PDF are now available under `docs/references/`. Earlier versions of this document were prepared before repository copies were added. Vault references remain external to this repository and must be validated separately when historical schedule estimates are relied upon.

Source precedence for interpreting this document:

1. Approved product decisions in [decisions.md](./decisions.md) take precedence over superseded source and planning assumptions. The original technical specification remains authoritative where not superseded.
2. The wireframe PDF illustrates expected information architecture and representative interactions; placeholders such as academy name, prices, images, and lesson names are not final content.
3. The Vault plans refine delivery sequencing and implementation slices. They do not silently override the original business rules.
4. Any unresolved conflict or placeholder is recorded in [open-questions.md](./open-questions.md).

Release allocation is maintained in [mvp.md](./mvp.md). A requirement appearing here does not imply that it belongs in the first release.

Unless labeled otherwise, normative product behavior in this document comes from S1, with interface evidence from S2. A **planning refinement** comes from P1 or P2 and narrows delivery or acceptance without changing the underlying business rule. A **scope correction pending product-owner approval** labels only changes for which no explicit approval evidence exists; it does not apply to PD-002–PD-010; explicit proposals within an approved entry remain qualified. An **engineering recommendation** is additional implementation guidance inferred to make a source requirement secure, reliable, or testable; it is not an original business decision and must not be used to resolve an open product question.

## Product goals and operating model

The platform sells online beauty education in Russian and English. It must support discovery, purchase, course delivery, homework review, curator communication, completion certificates, sales attribution, payouts, and administration.

The initial subject directions are:

- nails;
- eyelash extensions;
- eyelash lamination;
- brows;
- makeup;
- cosmetology.

Administrators add, edit and archive educational categories/directions without code changes (PD-009). Course quantity and selection are business decisions; engineering must not enforce a minimum launch course count.

The operating model distinguishes instructor-created content from curator-supported learning:

- A trainer records lessons once and may maintain course materials.
- A curator reviews student work and answers course-scoped questions during a defined support period.
- The specification combines these responsibilities in the `trainer-curator` role. Whether they may be assigned to different people remains unresolved.

## Roles and authorization

### Shared rules

- Supported roles are guest, student, trainer-curator, manager, and administrator.
- One account may hold multiple roles at the same time.
- An administrator assigns and removes roles.
- A user must be able to operate in the appropriate role context without creating duplicate accounts. The exact role-switching experience is not specified.
- Protected course content, homework, messages, financial information, and administrative actions must only be available to authorized users.

**Engineering recommendation:** enforce the source's role-access requirement on the server and at resource level, not only through hidden navigation.

### Guest

A guest may:

- browse public pages, course catalog entries, course previews, package offers, mini-courses, reviews, and legal pages as available in the current release;
- filter and compare products;
- add eligible products to a cart and begin checkout;
- register or sign in as part of purchase.

### Student

A student may:

- access purchased or manually granted products;
- follow course lessons and view progress;
- download lesson materials;
- submit and revise homework where curator support applies;
- communicate with the assigned curator within the relevant course and support period;
- view curator feedback and submission history;
- receive and download eligible certificates;
- manage profile and locale data and review purchase records.

### Trainer-curator

A trainer-curator may:

- see only assigned courses and students needed to perform the role;
- create courses, lessons and materials for assigned courses, and propose prices for administrator approval (PD-009);
- review assigned homework, provide feedback, accept work, or request revision;
- answer course-scoped student questions;
- see their own accrual and payout information when that module is enabled.

A trainer-curator must not:

- publish a course; only administrators approve content/prices and control publication (PD-009);
- see student contact details outside the platform;
- see total academy revenue.

### Manager

A manager may:

- see sales attributed to them and the resulting commission;
- use assigned promo codes and a referral link;
- work with assigned leads and recoverable abandoned carts when consent permits;
- update lead status;
- manually enroll a student after invoice or offline payment, retaining evidence and attribution.

A manager must not see other managers' private pipelines or commissions unless another role explicitly grants that access.

### Administrator

An administrator may manage:

- directions, products, lessons, content versions, prices, packages, and publication state;
- users, account status, roles, trainer assignments, trainer rates, and manager commission rates;
- orders, refunds, promo codes, manual enrollments, and access state;
- homework-review quality and overdue work;
- certificate templates, issuance records, and revocation;
- trainer and manager payout reconciliation;
- operational and business reports.

Administrative actions must be recorded in an audit trail.

## Catalog and product management

### Product types

The catalog must support these product types:

| Product type | Curator support | Homework review | Completion basis |
| --- | --- | --- | --- |
| Beginner course | Required | Timely submissions remain reviewable after support expiry (PD-004) | All required assignments accepted |
| Advanced course | Required | Timely submissions remain reviewable after support expiry (PD-004) | All required assignments accepted |
| Mini-course | None; recorded content only | None | All mandatory lessons completed; administrator review/manual certificate issuance (PD-010) |
| Start in the USA module | None specified | None specified | Not defined |
| Package | Per included course | Per included course | Each included product's own rules |

Advanced courses are intended for licensed practitioners. The source does not define how eligibility is verified.

Example mini-courses in the source are Speed at $40, Effect at $30, and Shapes at $50. These are examples, not immutable production names or prices.

The Start in the USA module is described as covering sanitation, safety, promotion, and client-base development.

### Course records and public presentation

A course record must support:

- localized title and description;
- direction;
- product type;
- level, including beginner or licensed practitioner;
- trainer identity, photo, and credentials;
- ordered lesson program;
- duration;
- price;
- preview video;
- available course languages;
- student reviews when review functionality is enabled;
- independently controlled visibility, sale availability and archiving (PD-009).

**PD-009 publication readiness:** all required lessons, videos, materials and homework must be complete before publication. Every curator-supported course requires an assigned trainer-curator; mini-courses do not. Trainers propose prices and administrators approve them. Pausing sales or archiving never revokes existing student entitlements. Use an approved default academy certificate template unless an approved custom template exists. Full category/course authoring and approval/publication controls are MVP; launch inventory remains business-supplied data, not an engineering quota.

The public catalog must support filtering by direction, course language, and level. The wireframe also shows category tabs and a price area, but does not establish additional filtering rules.

The public product experience must distinguish full courses, packages, mini-courses, and the Start in the USA module. The wireframe shows course cards with level, direction, language, trainer, lesson or curator information, price, and an add-to-cart action.

### Lesson and course structure

- Courses contain an administrator-controlled ordered list of lessons.
- Lessons may contain protected video, downloadable PDF guides, checklists, diagrams, and other authorized materials.
- A course may require sequential unlocking: the next lesson opens after the previous lesson is viewed.
- Sequential unlocking is configurable per course.
- Each lesson may have zero or one homework definition in the presented wireframe; the broader data cardinality is not explicitly decided.
- Administrators control which assignments are mandatory for certificate eligibility.

### Localization and language availability

- The interface must support Russian and English.
- A course may be offered in one or both languages.
- Course language may be delivered through separate audio tracks or subtitles.
- Catalog cards must disclose available languages and the catalog must allow filtering by language.
- The student chooses the relevant audio, subtitle, and interface locale where available.
- Course metadata and legal content require approved localized versions; automatic translation is not stated as acceptable.

### Packages

- An administrator may assemble a package from eligible courses and assign a fixed package price.
- The intended standard package sizes shown in the sources are 2, 3, or 6 directions, plus the Start in the USA module.
- The system must show savings compared with buying the included items separately.
- Curator support and completion rules apply separately to each included course.
- A cart containing products that are also available through a package should offer an eligible package upgrade or replacement.
- Rules for overlap, partial prior ownership, duplicate access, and package changes after sale are unresolved.

## Identity and account lifecycle

- The platform must support email-and-password registration, sign-in, session handling, email verification, password reset, and password change.
- Checkout may create an account when the buyer does not already have one.
- After successful payment, the buyer must receive a receipt and an access or sign-in link.
- Google and Apple sign-in are desired later features.
- Administrators may create and block accounts.
- Blocking an account must prevent protected access without deleting legally or operationally required records.

**Planning refinement (P2):** social sign-in should link safely to existing accounts rather than create unintended duplicates; the matching policy remains open.

The student profile must support:

- certificate name in Cyrillic;
- certificate name in Latin characters;
- email;
- phone;
- interface language;
- purchase history and receipts;
- password change.

## Cart, purchase, and payment

### Cart and pricing

- Guests and signed-in students may add courses, packages, and mini-courses to a cart.
- The checkout must show the final payable amount before payment.
- If separately selected courses qualify for a package, the system must suggest the package and disclose savings.

**Planning refinements (P2):** cart state should persist through authentication and reasonable navigation, and authoritative pricing, discounts, eligibility, and totals should be calculated server-side. The persistence lifetime remains unresolved.

### Price cap

- The total price of one program or package, including all fees and materials, must not exceed USD 2,500.
- The administration interface must reject a price above this threshold.
- Checkout must independently validate the cap; administrative validation alone is insufficient.
- How taxes, payment fees, discounts, currency conversion, and multi-item carts interact with the cap requires legal clarification.

The source links this cap to a BPPE registration exemption. Legal counsel must confirm the applicable rule and final implementation.

### Checkout consent

Before payment, the buyer must explicitly accept:

- the public offer or terms of sale;
- the privacy policy;
- the refund policy;
- the license disclaimer stating that a certificate does not authorize professional practice.

**Approved — PD-006 / OQ-007:** retain immutable published versions and acceptance history with timestamps, user and order references. All four documents require explicit acknowledgment before payment. Block checkout if required approved documents are unavailable in the selected language. Material changes require renewed acknowledgment at the next checkout; editorial changes require notification only. Notify affected students and preserve existing course access. Retention follows PD-007, subject to its pending legal verification.

### Payment processing

- **Approved — PD-002 / OQ-001:** Stripe, using the existing active account owned by the academy's US legal entity, with embedded Stripe Payment Element.
- USD pricing, charges, and payouts to the existing US company bank account; US and international customers where supported.
- Cards, Apple Pay, Google Pay, and Klarna where eligible. Klarna installments apply to eligible one-time purchases.
- Subscriptions are excluded from MVP and all future planned phases.
- Before launch, verify the exact legal entity, Stripe account settlement configuration, and payment-method eligibility. OQ-029, OQ-031, OQ-032, OQ-036, and OQ-037 remain separate.
- Fulfillment occurs only after authoritative payment confirmation.
- Failed, cancelled, or incomplete payment must not grant access.

**Planning refinement (P2):** payment callbacks must be idempotent so duplicates do not create duplicate orders, enrollments, or accruals.

### Order fulfillment and attribution

After confirmed payment, the system must:

- create or resolve the buyer account;
- create the order and order lines;
- grant the corresponding enrollments and access;
- record applicable manager attribution;
- send payment confirmation, receipt, and access instructions.

Every attributable purchase must record the responsible manager through a promo code, referral link, or manual enrollment. Attribution precedence and the handling of unattributed or conflicting signals are unresolved.

### Promo codes

A promo code must support:

- percentage or fixed-amount discount;
- validity period;
- usage limit;
- optional manager association;
- restriction to a specific course or package.

Stacking, per-customer limits, minimum spend, currency behavior, and treatment on refund are unresolved.

### Refunds and access reversal

- **Approved — PD-010 / OQ-010:** eligible refund requests are automatically approved and processed through Stripe without administrator approval; exceptional cases and failures escalate to administrators. Administrators inspect orders, refunds, statuses and exceptions.
- The supplied seven-day window after confirmed payment, regardless of course progress, is explicitly **proposed**, subject to applicable law and final refund rules. OQ-037 remains blocking; do not treat that window as final eligibility policy.

**Approved access revocation — PD-004 / OQ-003; unresolved refund details remain under OQ-036/OQ-037:**

- Once a monetary refund is confirmed, the affected course access must be revoked immediately, including in MVP.
- The revocation must be server-enforced and recorded with the order, refund confirmation, actor, timestamp, affected enrollment, and resulting access state so it is auditable.
- Trainer and manager accruals must be reversed for the refunded sale when those financial modules exist.
- Automatic Stripe refunds and confirmed-refund access revocation are MVP (PD-010). Trainer/manager financial reversals remain with their later financial modules. A manual-provider workflow is not a substitute for the approved automatic refund path.
- Refund handling must be idempotent so repeated confirmation cannot create inconsistent access or financial effects.
- Partial-refund and multi-product order behavior is unresolved.

### Manual enrollments

- A manager may enroll a student following verified invoice or offline payment.
- The enrollment must retain the manager who performed it and payment evidence.
- Manual enrollment must create an auditable order or equivalent commercial record and participate in access, attribution, commission, refund, and reporting rules.

## Student learning experience

### Dashboard

The student dashboard must provide:

- purchased courses;
- progress percentages;
- upcoming assignment deadlines where deadlines exist;
- new curator responses;
- recommended mini-courses and packages when recommendation functionality is enabled;
- completed-course certificate access.

The mobile wireframe emphasizes a today panel, course cards with progress, recommendations, and bottom navigation for courses, assignments, messages, and profile.

### Lesson playback and progress

- Protected video must be playable only by authorized users.
- The player must support playback speed.
- The player must remember the last position and allow resume.
- The player must expose available RU/EN audio or subtitles.
- Lesson-view and course-progress rules must be deterministic and suitable for certificate eligibility.
- Where sequential unlocking is enabled, the platform must prevent bypass through direct requests as well as through the UI.

The precise threshold for considering a video or lesson viewed is unresolved.

### Lesson materials

- Authorized students may view or download the materials attached to an accessible lesson.
- Protected student resources must not be exposed through permanent public links.
- Access to materials follows the course-access deadline unless extended under PD-004.

### Homework submission

- A homework submission may contain photos, video, and a text comment.
- The user must see previews of uploaded media before submission.
- **Approved — PD-005 / OQ-004:** all supported photo/video formats, including JPEG, PNG, HEIC, WebP, MP4, MOV and WebM, with automatic normalization.
- Maximum 1 GB per file and 1 GB combined original files per submission; no fixed file-count limit.
- Images: auto-orientation, high-quality compression, maximum 2560px processed copies. Videos: H.264/AAC MP4, maximum 1080p. Generate thumbnails and playable previews.
- Submission files must be stored privately and made available only to authorized student, assigned curator, and authorized administrators.

**Approved — PD-005:** resumable uploads with progress and interruption recovery; students can preview, remove and replace files. Use short-lived signed delivery, preserve originals until processing succeeds, and never corrupt submission history. Safe retries, understandable errors and structured logs follow PD-001. Retention follows course access and PD-007, including outstanding review obligations. OQ-043/OQ-044 remain dependencies; OQ-045 still governs changes to an already-submitted assignment.

### Homework lifecycle

At minimum, homework supports these student-visible statuses:

- Pending review (`На проверке`);
- Accepted (`Принято`);
- Revision requested (`На доработку`).

The system must preserve submission and review history across revisions. A curator may add text feedback and, later, optional voice feedback. Accepting all mandatory work makes a supported course eligible for a certificate.

### Curator support and messaging

- Student-curator messages are scoped to a course.
- A student may ask questions and receive curator responses while support is active.
- The student must see the remaining curator-support time.
- **Approved — PD-004 / OQ-003:** both timers start when the student explicitly marks the introductory course page as viewed; that page explains all important course rules.
- Support lasts 14 consecutive calendar days; course access lasts 3 calendar months including support. Track separate deadlines per purchased course/enrollment.
- Students can submit a Request Extension form even after support expires. Assigned curators may extend support by up to 14 calendar days per request, never course access. Administrators may modify both deadlines, approve longer exceptions, and temporarily pause access.
- Pauses freeze applicable timers and preserve the exact remaining duration until restoration. Support extensions never automatically extend course access.
- Support closes at its deadline; lessons and materials close at the course-access deadline unless extended. Refunds/closure revoke access while preserving historical learning records, subject to PD-007 retention safeguards.

**Approved server enforcement — PD-004 / OQ-003:**

- From MVP, the server must enforce the configured support expiration when authorizing new homework submissions, homework revisions, curator review actions that the approved expiry policy disallows, and new course-scoped messages if messaging is enabled in that release. A hidden or deferred countdown must not leave expired operations accessible.
- Every assignment submitted before support expires must retain a valid, explicit lifecycle status and its history after expiry. Expiration must not silently discard it, move it to an undefined state, or make its next permitted action ambiguous.
- Curators must review assignments submitted before the permitted deadline even if review is overdue. OQ-048 still blocks detailed post-expiration transitions, including student revision handling.
- PD-008 / OQ-005 now supplies the approved review SLA; OQ-049 remains an unresolved access-clock dependency. Calendar-month calculation and overlapping-extension details require consistent implementation; no specific algorithm was supplied. Reassignment and remaining timezone questions must not be guessed.

The wireframe shows an in-lesson curator hint, text comment area, upload surface, and a button for submitting work for review.

## Trainer and curator workflows

### Course workspace

- A trainer sees owned or assigned courses and the number of active students.
- A trainer creates courses, lessons and materials for assigned courses and proposes prices; administrators approve content and pricing (PD-009).
- Only an administrator may approve and publish trainer-created or edited content.
- Publication must not accidentally expose incomplete or unapproved content.

### Review queue

- The queue contains homework assigned to the curator and awaiting action.
- It is ordered by submission time or response deadline so the most urgent work is clear.
- Each item shows the response deadline.
- Overdue work is visually emphasized and triggers an administrator notification.
- **Approved — PD-008 / OQ-005:** 48 counted hours from submission, counting Monday–Friday continuously, excluding weekends; public holidays count.
- Snapshot the assigned curator's timezone at submission; display deadlines in each viewer's local timezone. Each new submission or corrected resubmission has an independent 48-hour deadline, with all history preserved.
- Notify the curator immediately on submission, at 24, 12, 6 and 1 remaining hours, and when overdue. Overdue work remains in the queue; persistent, auditable administrator notifications are required. Contacting the curator is optional.
- Students see the expected review deadline and current status. Administrators can comment, accept or request revisions without changing the assigned curator; audit every action.
- Timely submissions must still be reviewed after support expiration. OQ-048 still controls student revisions after expiry. Calculate deadlines server-side with durable reminders, retry safety, concurrency protection and PD-001 errors. OQ-079/OQ-080 remain dependencies.

### Review detail

The curator, and an administrator acting under PD-008 without changing the assigned curator, must be able to:

- inspect submitted photos and video;
- read the student's comment and relevant submission history;
- enter text feedback;
- optionally record or attach voice feedback when that feature is enabled;
- accept the work;
- request revision.

The trainer wireframe shows a review queue, selected submission media, comment entry, voice-message option, accept/revision actions, and a monthly accrual summary.

### Accruals and payouts

- For main courses, trainer accrual equals new eligible students in the period multiplied by the trainer's per-student rate.
- The default example rate is USD 25 per student and may be configured by an administrator per trainer.
- For mini-courses, trainer accrual is a percentage of sales.
- The default example mini-course share is 30%.
- Accruals support `Accrued` and `Paid` states and a payment date.
- Refunds reduce the corresponding accrual.
- The trainer sees only their own calculations and payout history.

Eligibility timing, tax treatment, currency, partial refunds, payout cadence, and overseas payout method are unresolved.

## Manager workflows

### Sales and commission

- The manager dashboard shows attributed sales for a selected period.
- Manager commission is calculated after refunds.
- The default example commission is 10%, configurable by an administrator.
- The manager sees a commission statement and reconciliation totals for their own activity.

### Leads and abandoned carts

- A manager may see relevant buyer contact details for assigned leads and recoverable abandoned carts.
- The manager can update lead status.
- Collection and use of contact data must comply with consent rules.
- Abandoned-cart qualification, assignment, retention, contact channels, and status vocabulary are unresolved.

### Promotion and attribution tools

- A manager can view personal promo codes and a referral link.
- Resulting orders retain manager attribution for reporting and commission.
- A manager may manually enroll a student after offline payment according to the rules above.

## Administration

**Approved — PD-010 / OQ-010:** all essential business operations are available in the MVP admin dashboard without routine developer intervention. Infrastructure recovery and server management remain outside the admin interface. Sensitive operations require a confirmation popup explaining consequences and explicit confirmation before proceeding. Enforce permissions/business rules server-side; audit administrator, action, resource, timestamp and outcome, with PD-001 errors/diagnostics.

### Catalog administration

Administrators must be able to:

- create and manage directions without a code change;
- create and edit courses, mini-courses, lessons, and packages;
- order lessons and configure sequential unlocking;
- manage localized metadata and course media versions;
- assign trainers or curators;
- set and validate prices;
- approve content;
- publish, unpublish, and remove products from sale without destroying historical records.

### User and access administration

Administrators must be able to:

- view permitted user information and block/unblock accounts;
- use separately defined, authorized account-creation and role-assignment workflows; PD-010 does not define new account or role-grant rules;
- manually grant, suspend, restore and revoke course access, auditing sensitive changes;
- assign trainers or curators to courses;
- configure trainer rates and manager percentages;
- inspect and correct enrollment access with an audit record; modify support/course-access deadlines, approve longer exceptions, and pause/restore applicable timers under PD-004.

### Sales administration

Administrators must be able to:

- view all orders and details;
- inspect automatic Stripe refund outcomes, exceptions and failures under PD-010; final refund eligibility remains under OQ-037;
- manage promo codes;
- inspect manual enrollments and payment evidence;
- inspect current access state;
- trace manager attribution.

### Quality administration

Administrators must be able to:

- monitor review deadlines and overdue homework by trainer or curator;
- receive persistent, auditable overdue notifications;
- inspect all courses, student progress, submissions, review history, deadlines and course-scoped conversations; view student requests and their processing statuses (PD-010);
- comment, accept or request homework revisions under PD-008 without automatically changing the assigned curator;
- inspect assignment and reassignment of curators;
- moderate student reviews when reviews are enabled.

### Certificate administration

Administrators must be able to:

- manage Russian and English certificate templates;
- inspect eligible certificates in a review queue and review completion evidence before manual issuance for every course type, including mini-courses (PD-010);
- use the approved default academy template unless an approved custom template is assigned;
- inspect the issued-certificate registry and prevent duplicate issuance with audit evidence;
- implement correction, revocation and reissuance only after their separate decisions;
- support public verification when the QR registry is enabled.

### Operational logs

PD-010 requires a separate administrator-restricted route for operational/error logs; its literal URL is not yet selected. Search/filter by date, severity, operation, affected resource and reference ID. Show clear descriptions alongside technical diagnostics, protect sensitive personal information/credentials, and retain routine logs 30 days under PD-007. No infrastructure-recovery controls belong in this viewer.

### Payout administration

Administrators must be able to:

- review monthly trainer and manager accruals;
- reconcile refunds and corrections;
- mark amounts as paid with dates;
- export payout data to Excel-compatible output.

## Certificates

- A supported main or advanced course becomes certificate-eligible when all mandatory assignments are accepted.
- A mini-course becomes certificate-eligible when all mandatory lessons are completed (PD-010); OQ-021 still defines authoritative lesson completion.
- The Start in the USA module and package-level certificate behavior are not defined.
- The LMS calculates eligibility automatically; eligibility does not issue a certificate. Every certificate requires administrator evidence review and manual issuance, including mini-courses. Eligible cases enter an administrator review queue (PD-010).
- Use the approved default academy template unless an approved custom template is assigned (PD-009/PD-010). Issuance is auditable and duplicate-protected.
- After administrator issuance, the student may download the PDF certificate in the required available language.
- Each certificate has a unique number.
- The certificate includes the required disclaimer that it confirms completion of an educational course, is not a license, and does not authorize professional activity.
- In the QR-enabled phase, the certificate contains a QR code leading to a public verification page.
- The public page shows the certificate holder's name, course, issue date, and trainer.
- Revocation must change public verification status while preserving the issuance record.

The exact certificate name source, issue date rules, reissuance behavior, and privacy model for public verification are unresolved.

## Notifications

Email notifications are required unless a release scope explicitly defers a specific template. Push notifications are a later enhancement.

### Student notifications

- purchase confirmation, receipt, and access instructions;
- curator response;
- reminder for an unsubmitted assignment;
- warning three days before curator support expires;
- certificate ready;
- policy-change notices for affected students (PD-006).

### Trainer-curator notifications

- immediate new-homework notification;
- PD-008 reminders at 24, 12, 6 and 1 counted hours remaining, plus overdue notification; delivery must be durable and retry-safe.

### Manager notifications

- new lead;
- recoverable abandoned cart.

### Administrator notifications

- persistent, auditable overdue review notifications;
- refund exceptions and failed refunds under PD-010;
- monthly payout summary;
- account-deletion requests (PD-007).

PD-008 fixes review-notification timing and durable retry-safe delivery. Other notification timing, delivery-channel details, retry parameters, preferences and quiet-hour policies remain unresolved; do not use those gaps to silently change the approved SLA reminders.

## Reporting and analytics

The administrative reporting suite must eventually support:

| Report | Required dimensions or measures |
| --- | --- |
| Revenue | Day, month, direction, course, package, mini-course |
| Sales mix | Share of packages versus individual courses; average order value |
| Students | New buyers, repeat purchases, course completion rate |
| Trainers | Student counts, average review time, accruals |
| Managers | Attributed sales and commission |
| Sources | UTM parameters and promo-code attribution |

- Google Analytics and Meta Pixel are requested to support acquisition analysis.
- Consent, event taxonomy, identity matching, and source-of-truth rules must be defined before implementation.
- Financial and operational reports must account for refunds and manual enrollments consistently.

## Video and protected media

- **Approved — PD-003 / OQ-002:** self-managed streaming and encryption with private Cloudflare R2 and separate VPS/VM FFmpeg workers; provider and capacity chosen during implementation. This replaces external protected-video hosting.
- Encrypted adaptive HLS: maximum 1080p, with 720p and 480p variants.
- Trainers and administrators may upload; only administrators may publish. Resumable MP4/MOV/WebM uploads with supported codecs, maximum 20 GB and 4 hours per video.
- Persistent processing queue, initially one concurrent job, three automatic retries, and manual recovery. Failed processing must not publish incomplete content or replace the previous published version.
- PD-001 diagnostics/errors; target $50–$100/month subject to capacity testing. INF03 must specify implementation, encryption-key management, recovery, supported-browser testing, and operational verification.
- Playback must require LMS authorization.
- Direct links must not provide durable access outside the platform.
- Downloads must not be offered through the product.
- Server-side enrollment authorization, short-lived playback access, and protected video segments and encryption keys are required in MVP.
- A moving student-specific identifier watermark and trainer uploads are MVP. DRM is deferred until after MVP; the identifier format is not selected by PD-003.
- The platform must support multiple audio tracks or RU/EN subtitles where the course provides them.

No browser-based system can guarantee prevention of screen capture. The requirement is deterrence and access control, not an absolute technical guarantee.

## Legal, privacy, and record retention

Public pages must exist for:

- offer or terms of sale;
- privacy policy;
- refund policy;
- professional-license disclaimer.

**Approved — PD-006 / OQ-007:** administrators upload, version and publish Russian and English documents after legal professional approval, using Draft → Approved → Published. Published versions are immutable. Public legal pages are linked in the footer; checkout verifies explicit acknowledgment of all four documents server-side. Administrative authorization, an audit trail, and PD-001 failures are required. Final texts and legal approval evidence remain outstanding under the residual OQ-007.

**Approved — PD-007 / OQ-008:**

- Accounts remain until manual deletion or a verified deletion request. Financial records remain until eligible for deletion subject to legal obligations; consent records follow account retention unless legally required longer.
- Homework and messages are deleted when associated course access ends, normally after 3 months, accounting for pauses, extensions, outstanding reviews and legal exceptions.
- Certificate records and necessary verification evidence are retained permanently.
- Technical-error logs and routine administrator activity have 30-day retention; critical audit records follow legally required periods.
- Account deletion notifies administrators. Automatically delete eligible data only when no active courses remain and identity/retention checks pass; otherwise an administrator contacts the student.
- Backups are encrypted, restricted, and retained 30 days. Recovery must prevent deleted personal data from being unintentionally restored.
- Automated retention safeguards, restricted access and PD-001 failure handling are required. Mandatory retention periods, deletion exceptions and applicable privacy requirements still need legal verification.

The platform must minimize role access to personal data and keep protected student resources private. Detailed privacy rights, deletion exceptions, processor agreements, and jurisdictional requirements are unresolved.

## Security, reliability, and operational requirements

**Business requirements (S1):**

- The application must use HTTPS.
- Role-based access must protect platform functions and data.
- Administrative actions require an audit trail.
- Protected records must survive course closure according to the approved retention policy.

**Planning refinements (P1/P2):**

- Role and resource authorization must cover pages, APIs, files, playback, messages, and administrative actions.
- Payment and enrollment operations must be idempotent and auditable.
- Private uploads must use secure storage and authorized delivery paths.
- Durable event processing, retries, and scheduled jobs must support payment, email, reminders, support expiry, and certificate workflows.
- Database backups, restoration procedures, logging, and a release rollback runbook are required before the full release.

**Engineering recommendation:** seed or fixture data must not expose real student information.

## Accessibility, responsiveness, and quality

**Business requirement (S1):**

- The public site and role dashboards must support mobile and desktop.
- Mobile is a primary learning and homework-submission environment, not a reduced fallback.

**Planning refinements and engineering recommendations (P2):**

- Core flows must be keyboard operable and use semantic, accessible controls.
- Motion must respect accessibility fallbacks when introduced.
- Media and upload experiences must handle constrained mobile bandwidth with clear progress and recoverable errors.
- Release verification must include multi-role authorization, direct API access, payments, duplicate callbacks, failed checkout, the end-to-end learning flow, mobile behavior, performance, accessibility, localization, and media loading.

## End-to-end business workflows

### Purchase to access

1. A guest or student selects an eligible product.
2. The server calculates price, package alternatives, and any valid discount.
3. The buyer authenticates or supplies account details and accepts required legal documents.
4. The payment provider processes payment.
5. Only confirmed payment creates or fulfills the order.
6. The LMS grants access, records attribution, and sends receipt and entry instructions.

### Supported-course completion

1. The student explicitly marks the introductory course page, containing all important course rules, as viewed to activate the independent support/access deadlines; then opens authorized lessons in the configured order.
2. The student watches content and uses lesson materials.
3. The student submits required homework during active support.
4. The curator reviews it within the configured SLA and accepts it or requests revision.
5. The student revises until every mandatory assignment is accepted.
6. The LMS calculates eligibility and queues administrator evidence review; only the administrator's manual issuance produces the certificate (PD-010).

### Mini-course completion

1. The student purchases or receives the mini-course.
2. The student views every required lesson.
3. The LMS calculates eligibility without curator homework review, then queues administrator evidence review and manual issuance (PD-010).

### Refund

1. The server evaluates a refund request using the final approved eligibility rules; the proposed seven-day window remains under OQ-037.
2. Eligible requests are approved and processed through Stripe automatically; exceptions and failures escalate to administrators.
3. Authoritative confirmed refunds revoke affected access automatically and immediately, with audit evidence and no duplicate refunds (PD-010).
4. Related trainer and manager accruals are reversed when those modules exist.
5. The event and actor remain auditable and reports reflect the correction.

### Homework review escalation

1. Submission enters the assigned curator's queue.
2. The server calculates 48 counted weekday hours using the curator timezone captured at submission.
3. Notify immediately, at 24/12/6/1 remaining hours, and overdue (PD-008).
4. Keep overdue work in the queue and create persistent, auditable administrator notifications.
5. Administrators can review/comment/accept/request revision without changing the assigned curator. Separate reassignment policy remains unresolved.

## Traceability for future agents

Before implementing a feature, read [decisions.md](./decisions.md) for approved overrides, use this document for business intent, [mvp.md](./mvp.md) for release inclusion, and [open-questions.md](./open-questions.md) for decisions that must not be guessed. Where a source placeholder remains open, implementation may create a configurable seam or test fixture, but must not encode an unapproved business answer as fact.

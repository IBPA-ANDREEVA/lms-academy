# Screen Composition Specs

This document expresses visual hierarchy and user tasks; it does **not** expand approved product scope. Consult [product requirements](../product/requirements.md) and [MVP scope](../product/mvp.md) before implementation.

**Status legend:** **MVP** = planned for initial release subject to unresolved policies and approvals; **Later** = Phase 2/3; **Design proposal** = visual concept, not an approved shipping requirement. An individual detail below must not be treated as authorized product behavior merely because it appears in a mockup.

## Public homepage

**MVP:** Russian-first navigation, clear hero, directions, real launch courses/mini-courses and catalog access; clear purpose and trust. Visual expression may use geometric composition, imagery and whitespace selectively. Do not invent reviews, counts or testimonials.

**Design proposal:** an isolated interactive learning preview demonstrating lesson → assignment → feedback → progress, with real interactions and explicitly synthetic data. It is a signature **concept**, not a confirmed MVP launch blocker. If approved for a release, keep it in one meaningful homepage section, optionally with course-specific variants elsewhere.

**Later:** packages, recommendations, full English marketing pages and public reviews as scheduled in MVP plan.

**Mobile:** accessible menu and prominent catalog entry; no clipped Unbounded headlines.

## Catalog and course detail

**MVP:** find/compare courses with direction, language availability and level filters; consistent factual course cards; detail page with program, trainer, duration, preview video, level, price and checkout entry. Mini-courses must be identifiable.

**Later:** package comparisons/upgrades, public reviews, advanced promotional modules.

**Design:** photography may lead but buying criteria must remain scannable. Avoid invented inventory or placeholder prices presented as real.

## Authentication and account recovery

**MVP:** sign-in, register, email verification, forgot/reset password, failure and expired-link states. Checkout-to-auth continuation must not silently lose selection.

**Design:** labels and validation must be readable in Russian; no icon-only errors. Explicit success/error states, accessible forms and keyboard focus.

**Later:** Google/Apple sign-in.

## Cart, checkout and payment

**MVP:** cart, server-authoritative final price, buyer identity, explicit agreement to approved terms/refund/license disclaimer, card-payment path, pending/success/failed/cancelled outcomes, confirmed enrollment and access. No paid access based solely on a browser success URL.

**Design:** total, item list and required consents clearly visible on mobile. Do not hide legal terms or use misleading disabled CTA states. Payment provider and some cap policies remain undecided.

**Later:** package upsell, promo/attribution features, wallets according to provider approval.

## Student dashboard

**MVP:** purchased courses and progress, primary continue-learning action, relevant homework status, certificate access when eligible.

**Clarification pending:** dashboard countdown, upcoming deadlines and curator messaging visibility (OQ-089). Do not imply enabled messaging/countdowns merely because future layouts show them.

**Later:** support countdown, messaging, recommendations, purchase history and enhanced profile.

**Design:** quieter functional hierarchy than homepage; no decorative metrics.

## Lesson and practical assignment

**MVP:** protected video, resume/speed, ordered lessons, authorized materials, assignment explanation, photo/video uploads with preview, text comment, revision and feedback status, sequential unlock according to approved rule, certificate-eligibility states. Show uploading, error, retry and completed states.

**Later:** RU/EN media controls when available, richer course-scoped messaging and enhancements scheduled in release plan.

**Design:** video is the primary focus; homework is visible when relevant. Avoid showing unavailable controls in enabled state.

## Trainer-curator review queue and review detail

**MVP:** assigned submission queue, protected media preview, text feedback, accept/revision decisions, student-visible outcome, and safe empty/loading/error states.

**Later:** SLA clocks/overdue alerts, voice feedback, course-authoring UI, accruals and payouts.

**Design:** straightforward lists/tables with clear status and one review action area, not decorative card grids. Do not reveal prohibited contact information.

## Certificate access

**MVP:** visible completion eligibility, missing required work, available PDF download, error/retry states, unique certificate and legal disclaimer under approved templates.

**Later:** QR public verification, revocation presentation and advanced certificate operations as scoped.

**Design:** show next step for ineligible learner and avoid implying a professional license.

## Administration and manager

**MVP:** minimal role/user management, authorized operations needed to keep enrollment/refund/access/certificates supportable; exact substitute procedures remain subject to OQ-010 and OQ-085.

**Later:** full admin catalog CRUD, reports, sales tools, payouts, manager pipelines, advanced trainer features. Do **not** implement a manager dashboard as an MVP deliverable merely because it has a conceptual layout.

**Design:** task-optimized tables and filters; avoid applying marketing-page signatures to operational workspaces.

## Screen definition template

For every implemented screen capture: user role, phase and prerequisite approvals, task/primary action, content hierarchy, real data dependencies, empty/loading/error/success/disabled states, desktop/mobile behavior, accessibility, applicable signature **or none**, and approved visual reference when available.

# Shared UI component candidate inventory

Historical candidate list retained. The repository-backed [component registry](INDEX.md) and its [workflow](README.md) now own active component definitions and approvals derived from current local approved sections. Entries below remain suggestions, not approved definitions; no historical decision is overwritten.

Status: IDENTIFICATION ONLY. No visual variant in this list is approved by the hero mockup.

C01 — PublicHeader. Pages `/`, `/courses`, details, mini-course pages. Job: current valid routes, logo, cart count, login. Owner: public shell. Reference: MISSING. States: menu open/closed, active route, guest/signed-in, mobile.
C02 — PublicFooter. All public routes. Job: approved legal links/disclaimer, brand. Reference: MISSING.
C03 — PrimaryButton / SecondaryLink. Public and account surfaces. Job: one clear real action. Reference: global hero shows plum block CTA as inspiration ONLY; implementation spec MISSING.
C04 — CourseCard. Home selection and course catalog. Job: compare facts and add eligible course. Owner: catalog. Reference: MISSING; not derived from hero.
C05 — MiniCourseCard or CourseCard variant. Same catalog domain; omit curator benefit. Reference: MISSING.
C06 — CategoryNavigation and FilterBar. Catalog and optional homepage discovery. Owner: catalog. Reference: MISSING.
C07 — PurchasePanel / PriceSummary. Course detail, cart, checkout (behavior differs). Owner: commerce-related integration; reference: MISSING.
C08 — MediaFrame / PreviewPlayer. Product detail and learning video use different authorization; avoid unsafe fake shared wrapper. Reference: MISSING.
C09 — Breadcrumbs. Detail pages. Reference: MISSING.
C10 — Form controls / status feedback. Identity, checkout, assignments. Reference: MISSING.
C11 — ProgressIndicator / LearningCourseTile. Student workspace. Reference: MISSING.
C12 — HomeworkUpload / ReviewFeedback. Learning+assignments feature-specific. Reference: MISSING.
C13 — TrainerReviewQueue / ReviewPanel. Assignment feature-specific. Reference: MISSING.
C14 — CertificateDownloadStatus. Certificate feature-specific. Reference: MISSING.

Build order for LA03 follow-up: PublicHeader shell, Button/link primitives, section H-001; then CourseCard and catalog filters only after their own references and specs are approved. Do not prematurely refactor a hero band or decorative typographic collision into a reusable shared component.

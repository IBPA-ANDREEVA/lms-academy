# Screen and section ownership

This file maps task and visual intensity. Canonical route phase and detailed contents remain in `docs/architecture/public-sitemap.md` and `public-page-structure.md`. When they conflict, product/architecture wins and the conflict must be raised; do not silently delete business information to preserve minimalism.

PUBLIC MVP:
- `/` Home: PublicHeader -> `HOME-HERO-001` -> factual CourseDiscovery -> factual MiniCourseDiscovery -> PublicFooter. Direction navigation and a static HowLearningWorks explanation may be integrated without adding redundant sections. Packages Phase 2; Start in USA release undecided; reviews and algorithmic recommendations later. Hero is the most expressive element; commerce sections must be calmer.
- `/courses`: Header -> short category/title introduction -> direction filters -> language/level filters -> result count and reset -> catalog grid/list -> Footer. State: loading, no-match, no-inventory, unavailable, error/retry, ownership. Visual: spacious but functional, no hero collisions.
- `/courses/[slug]`: Breadcrumbs -> title, honest facts, approved content and add action -> trainer -> learning outcomes -> curriculum -> video preview -> detailed purchase panel/terms -> Footer. Later reviews only if approved. Mobile price/CTA must be findable while detailed legality remains accessible.
- `/mini-courses` and `/mini-courses/[slug]`: share appropriate catalog/detail presentation; clearly say recorded-only/no curator. Never imply a 14-day curator.
- `/cart`: selected items -> accurate server-price summary -> remove/continue/checkout actions -> empty and stale price/eligibility/error states. No package upsell in MVP.
- `/checkout`: buyer identity -> reviewed order -> required agreement controls -> payment initiation/status, with explicit pending/success/failure/cancel/retry paths. No fictional provider styling or offer text.
- `/checkout/result`: authorized provider-confirmed state, enrollment/access next action or recovery path. Never expose other people's orders via URL.
- `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`: restrained identity shell; clear labels, errors, expired token and safe continuation to cart/checkout.
- `/offer`, `/privacy`, `/refunds`, `/license-disclaimer`: readable legal shell; approved text/version and links; no experimental headline collisions.

LATER / CONDITIONAL (DO NOT IMPLEMENT JUST BECAUSE A DESIGN DOCUMENT MENTIONS THEM):
- `/packages`, `/packages/[slug]`: Phase 2 composition/pricing/upsell rules pending product policy.
- `/start-in-usa`: proposed; phase/publication undecided.
- `/certificates/verify/[verificationId]`: Phase 3 verification and privacy rules pending approval.

WORKSPACES:
- Student dashboard: purchased courses and progress; MVP continue-learning priority, homework/certificate states where eligible; marketing visual drama absent.
- Student course/lesson: video first, syllabus/progress, private materials, upload-with-preview, feedback and revision. Honor release boundary for messaging/countdown.
- Trainer-curator: submission queue/list -> media/review details -> text accept/revision controls. Prioritize density, safety and deadlines; Phase 2 finance/SLA controls not shown in MVP.
- Manager: later phase; do not materialize dashboard from original PDF solely for illustration.
- Admin: minimal safe MVP operations; full catalog/sales/reporting workspaces later.

EVERY ROUTE/SECTION MUST DOCUMENT:
- Route and release phase.
- User role/goal and one main action.
- Exact required data and what can be omitted.
- Concrete section order / relationships and reusable component IDs.
- Reference IDs with borrow/reject boundaries. `unreviewed` if none.
- Desktop/mobile fit, keyboard and focus behavior.
- Loading/empty/error/success/disabled/not-found states.
- Unknown business policies and dependencies.

Current implementation and reference scope: see `../architecture/frontend-components.md`. The historical home-hero direction is selected, not an approved browser implementation. Use the reference supplied for each requested target.

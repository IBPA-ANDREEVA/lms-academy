<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LMS agent rules

This is a Russian-first beauty education LMS. It is not a generic SaaS dashboard or a cosmetics store. Work in English in repository documentation and engineering communication unless asked otherwise; design real UI copy in Russian first. English product localization follows `docs/product/mvp.md`.

AUTHORITATIVE SOURCES. Read only the ones relevant to the task:
- `docs/product/requirements.md`: business behavior and roles.
- `docs/product/mvp.md`: release inclusion and exclusions.
- `docs/product/open-questions.md`: only unresolved product questions. Never resolve these by guessing.
- `docs/product/decisions.md`: confirmed product decisions; never place approved decisions or binding implementation instructions in the open-question register.
- `docs/architecture/overview.md`, `modules.md`: application boundaries.
- `docs/architecture/public-sitemap.md`, `public-page-structure.md`, `public-user-flows.md`, `public-open-questions.md`: public routes, page contents, transitions, unresolved URL/policy details.
- `docs/design/README.md`: DESIGN ENTRY POINT. Follow its source precedence for visual work.
- `docs/design/DECISIONS.md`: selected visual direction with exact approval scope.
- `docs/design/DIRECTION.md`: art-direction behavior.
- `docs/design/SYSTEM.md`: visual tokens and typography rules.
- `docs/design/SCREENS.md`, `COMPONENTS.md`: screen and component specifications.
- `docs/architecture/frontend-{pages,sections,components,backlog}.md`: maintained frontend registry and reuse audit.
- `docs/design/QA.md`: required visual verification.

PRODUCT SAFETY:
- Roles: guest, student, trainer-curator, manager, administrator; accounts may have multiple roles. Separation of trainer from curator is unresolved.
- No fictional prices, launches, reviews, trainer credentials, performance claims, accreditation, licenses, payment providers, course inventory, legal copy or unapproved routes.
- Do not promote Phase 2/3 features into MVP because a sketch includes them. Approved PD-002–PD-010 override older planning assumptions; read their complete entries before affected work.
- Payments: Stripe embedded Payment Element, existing US-entity account, USD pricing/charges/payouts, eligible cards/Apple Pay/Google Pay/Klarna one-time purchases; no subscriptions in any planned phase (PD-002). Verify legal entity, settlement and method eligibility before launch.
- Video: self-managed private R2 + separate VPS/VM FFmpeg workers, encrypted adaptive HLS (1080p/720p/480p), protected segments/keys and short-lived grants. Moving student identifier watermark and trainer/admin uploads are MVP; only admins publish. Preserve published versions on processing failure. INF03 owns remaining operational design; DRM is after MVP (PD-003).
- Access: explicit introductory-rules-page acknowledgment activates separate per-enrollment 14-calendar-day support and 3-calendar-month access. Enforce extension/pause permissions and timely-homework review obligations from PD-004; do not infer OQ-048/OQ-049 answers.
- Homework: resumable private uploads, 1 GB/file and 1 GB combined originals/submission, no fixed count cap; normalization, previews, safe recovery and delivery follow PD-005.
- Policies: RU/EN legal approval, Draft → Approved → Published, immutable versions, all four checkout acknowledgments, missing-language checkout blocking and change notifications follow PD-006. No generated final legal text.
- Retention/deletion: follow PD-007 lifecycle, review/legal holds, permanent certificate evidence, 30-day routine logs/backups and restoration safeguards. Legal periods/exceptions remain pending; do not treat nominal expiry as unconditional deletion.
- SLA (PD-008/OQ-005): 48 counted hours, continuously Monday–Friday, weekends excluded and public holidays counted. Snapshot assigned curator timezone per submission/resubmission, display viewer-local deadlines; immediate and 24/12/6/1-hour/overdue notifications, persistent admin alerts, and admin review without reassignment are MVP. Preserve OQ-048 post-expiry revision blockers.
- Catalog (PD-009/OQ-009): full category/course authoring, trainer price proposals, admin content/price approval and independent visibility/sale/archive controls are MVP. Validate complete required content and curator assignment before publication; no engineering minimum inventory count; pausing sales/archiving never revokes existing entitlements.
- Administration (PD-010/OQ-010): essential dashboard operations need no routine developer intervention. Automatic eligible Stripe refunds are MVP; the seven-day eligibility window remains explicitly proposed under OQ-037. Certificates have automatic eligibility but always require admin evidence review/manual issuance, including mini-courses. Use approved default/custom templates; do not infer correction/revocation/reissuance policy.
- Include course/student/request monitoring, persistent admin notifications and a separate restricted operational-log route (literal URL still to be specified). Sensitive admin actions need explanatory confirmation, explicit consent, server enforcement and actor/action/resource/time/outcome audit. Infrastructure recovery/server management remains outside admin UI; account creation/role assignment stay separately defined authorized workflows.
- OQ-006 remains intentionally deferred. OQ-005/OQ-009/OQ-010 are approved in PD-008/PD-009/PD-010; their unresolved dependencies and actual launch content/identity/legal readiness must not be inferred.
- Keep payment, access, refund, certificate, student work, identity and media flows secure, authorized server-side, auditable and replay-safe.
- Handle every failure with a plain-language, helpful user message and a separate structured, privacy-safe, traceable engineering diagnostic. No developer terminology in user-facing errors (PD-001).

ARCHITECTURE:
- `src/app`: routes and entry points only.
- `src/features/<module>`: feature-owned domain logic and UI; import other modules only via public interfaces.
- `src/components/ui`: truly generic reusable primitives. Shared product-specific components belong in a clearly documented shared feature/composition layer; do not put commerce rules in `ui`.
- `src/db`: database plumbing; `src/lib`: small technical utilities.
- Modular monolith, Next.js App Router, TypeScript, Tailwind 4, pnpm. Keep dependencies justified; do not introduce architectural changes for design alone.

PAGE → SECTION → COMPONENT HIERARCHY:
- Divide each page into clearly owned sections. Page files should primarily compose sections rather than contain their full implementations.
- Give every substantial section its own component file. Section files should compose independently maintainable internal components instead of becoming monolithic JSX files; give each such component its own file.
- Colocate section-specific components and styles within the owning feature. Trivial decorative elements do not need separate files, and this convention does not require empty section directories.
- Reuse existing shared components. Extract new shared components only when actual reuse justifies them.
- Preserve clear Server/Client Component boundaries and minimize unnecessary `use client`.
- Maintain the frontend page, section and component registries so future agents can locate implementation owners and consumers.

DESIGN IMPLEMENTATION PROTOCOL (MANDATORY FOR UI TASKS):
1. Identify target route, user goal, release phase, states and product data. Verify against sitemap and requirements.
2. Read the frontend registry and inspect existing code first. Open `docs/design/README.md`, `DECISIONS.md`, `DIRECTION.md`, `SYSTEM.md`, relevant specifications, and the exact visual reference supplied by the user for this implementation.
3. Record the supplied reference’s target, borrowed relationships, rejected content and viewport limits in the registry or verification note. A hero reference does not apply to unrelated screens. Generated raster text is not product data or licensed photography.
4. If screen/section/component reference is missing or is `exploratory`, propose a bounded solution. Do not present an invented aesthetic as approved. Ask for human review of materially new visual direction.
5. Use Unbounded for short display typography, Manrope for functional text; do NOT use Angry, Geist or Arial as chosen brand typography. Manrope and Unbounded are self-hosted in `src/assets/fonts` with their OFL licenses; preserve them and verify real Cyrillic rendering.
6. Prefer editorial restraint: dramatic type + one strong photographic image + whitespace, with purpose-built overlap. Never add random geometric blobs, repetitive oversized section numbers, gradients, default card grids, fake sliders or decorative controls.
7. Implement desktop and mobile, Russian first, accessible controls and all applicable loading, empty, error, disabled, success, focus and reduced-motion states. Preserve product facts and legal content.
8. Render screenshots at 1440×900 and 390×844 at minimum; compare against approved composition and record differences. Check a second mobile width and tablet/content breakpoint when appropriate.
9. Report file changes, decisions followed, any unapproved deviations, verified actions and test commands. Do not claim visual approval based on build success.

ICON RULE: `public/icons/{line,filled,duoline,duotone,mono,broken}/...svg` contains six style folders, not numbered `.1` variants. Use inspected explicit paths and `docs/design/icons/USAGE.md`. The existing indigo fill is NOT a new brand color.

GENERAL WORKFLOW:
- Inspect code and diff first. Make focused changes; preserve unrelated work.
- Read installed `node_modules/next/dist/docs/` for affected Next.js APIs per the auto-generated block.
- Run appropriate `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and feature tests where possible; disclose skipped checks.
- Do not delete source documentation, artwork, student data or unrelated files on your own.
- Do not commit, merge, deploy or force-push without explicit authorization.

FRONTEND WORKFLOW (MANDATORY):
1. Before implementing UI, inspect `docs/architecture/frontend-pages.md`, `frontend-sections.md`, `frontend-components.md`, `frontend-backlog.md` and the existing implementations.
2. Always reuse an existing shared component when it fits.
3. Never duplicate shared functionality or styling patterns unnecessarily. Extend the canonical owner when appropriate.
4. Create a new shared component only when reuse is justified by actual consumers or explicitly requested shared scope; record that evidence.
5. Keep page-specific components local to their owning feature/section.
6. Follow the visual reference supplied by the user for each implementation, within product/release constraints. Do not infer approval for unrelated components or invent unavailable content.
7. Update the registry after every page, section or shared-component change: route/owner, purpose, actual implementation path, props, consumers, status and missing work.
8. Do not recreate `/dev/components`, `/dev/sections` or reference-gallery/editor infrastructure. The user-authorized `/preview/components` route is the single lightweight preview of actual shared components. Keep it updated when shared components change; reuse their implementations and clearly label demonstration data. Other UI work stays in the actual application.

REACT MOTION (owner-requested):
- Use the [gsap-react skill](/Users/ivanmakovetskyi/.agents/skills/gsap-react/SKILL.md) for React animation work; read `gsap-core` and `gsap-timeline` when using their APIs.
- Use `gsap` + `@gsap/react`, register `useGSAP`, and run animations in client lifecycle only. Scope every hook to a ref; wrap later animation callbacks with `contextSafe` and clean up observers/listeners. Revert dependency-driven animations on update.
- Respect `prefers-reduced-motion`, including live preference changes. Preserve focus, keyboard tab semantics, user-entered state, and accessible active/inactive panels. Rapid switching and resizing must cancel obsolete animations.
- The HOME-06–09 geometry belongs to the persistent group, not to individual panels. Keep shared seam coordinates intact and background shapes stationary while content switches; size the viewport to the active content, and verify shorter/taller content changes while the switcher is sticky.
- Homepage section folders retain their source order: 02 hero, 03 about, 04 founder, 05 learning preview, 06 courses, 07 packages, 08 mini-courses, 09 Start in USA, 10 reviews, 11 contact. Shared shell owns HOME-01 header and HOME-12 footer.

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
- `docs/product/open-questions.md`: unresolved business choices. Never resolve these by guessing.
- `docs/architecture/overview.md`, `modules.md`: application boundaries.
- `docs/architecture/public-sitemap.md`, `public-page-structure.md`, `public-user-flows.md`, `public-open-questions.md`: public routes, page contents, transitions, unresolved URL/policy details.
- `docs/design/README.md`: DESIGN ENTRY POINT. Follow its source precedence for visual work.
- `docs/design/DECISIONS.md`: selected visual direction with exact approval scope.
- `docs/design/DIRECTION.md`: art-direction behavior.
- `docs/design/SYSTEM.md`: visual tokens and typography rules.
- `docs/design/SCREENS.md`, `COMPONENTS.md`: screen and component specifications.
- `docs/design/references/INDEX.md`: reference approval and sourcing.
- `docs/design/QA.md`: required visual verification.

PRODUCT SAFETY:
- Roles: guest, student, trainer-curator, manager, administrator; accounts may have multiple roles. Separation of trainer from curator is unresolved.
- No fictional prices, launches, reviews, trainer credentials, performance claims, accreditation, licenses, payment providers, course inventory, legal copy or unapproved routes.
- Do not promote Phase 2/3 features into MVP because a sketch includes them.
- Keep payment, access, refund, certificate, student work, identity and media flows secure, authorized server-side, auditable and replay-safe.

ARCHITECTURE:
- `src/app`: routes and entry points only.
- `src/features/<module>`: feature-owned domain logic and UI; import other modules only via public interfaces.
- `src/components/ui`: truly generic reusable primitives. Shared product-specific components belong in a clearly documented shared feature/composition layer; do not put commerce rules in `ui`.
- `src/db`: database plumbing; `src/lib`: small technical utilities.
- Modular monolith, Next.js App Router, TypeScript, Tailwind 4, pnpm. Keep dependencies justified; do not introduce architectural changes for design alone.

DESIGN IMPLEMENTATION PROTOCOL (MANDATORY FOR UI TASKS):
1. Identify target route, user goal, release phase, states and product data. Verify against sitemap and requirements.
2. Open `docs/design/README.md`, `DECISIONS.md`, `DIRECTION.md`, `SYSTEM.md`, the relevant screen/section/component spec, and the EXACT reference image(s). Do not design from prose alone when an image exists.
3. Read each reference's `Borrow`, `Reject`, `Scope`, `Status` and viewport notes. A reference for a hero is NOT a reference for the catalog, checkout or dashboard. A generated raster is NOT a pixel-accurate font, real content or shippable photograph.
4. If screen/section/component reference is missing or is `exploratory`, propose a bounded solution. Do not present an invented aesthetic as approved. Ask for human review of materially new visual direction.
5. Use Unbounded for short display typography, Manrope for functional text; do NOT use Angry, Geist or Arial as chosen brand typography. Current starter has only `Angry.otf`; first verify legal Unbounded font sourcing/installation before claiming exact typography.
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

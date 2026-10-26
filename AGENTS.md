<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LMS Agent Instructions

## Project and approved scope

This repository is a Russian-first beauty education LMS built as a Next.js App Router, TypeScript, Tailwind CSS, pnpm **feature-based modular monolith**.
Read [product requirements](docs/product/requirements.md), [delivery scope](docs/product/mvp.md), [open questions](docs/product/open-questions.md), and [architecture](docs/architecture/overview.md) when your task touches them.
Roles: guest, student, **trainer-curator**, manager, administrator. Accounts may have multiple roles. Trainer/curator role separation is unresolved (OQ-011).

Do not invent business policies, product features, actual courses, prices, statistics, testimonials, provider selections, accreditation or approvals. Unresolved questions remain unresolved until the product owner records a decision.

## Architecture and security

- `src/app`: thin routing, layouts, Server Actions and Route Handlers.
- `src/features`: domain-owned application logic; cross-feature imports use public interfaces only.
- `src/components/ui`: reusable visual primitives; feature-specific components remain within their feature.
- `src/db`: shared database infrastructure, not cross-domain repositories.
- `src/lib`: small technical utilities, not a global domain layer.
- Keep React components focused; divide large components by responsibility, not arbitrary line counts.
- Authenticate and authorize on the server for each protected resource. Validate untrusted inputs; never trust client-supplied roles, prices, completion or ownership.
- Treat payment, enrollment, support expiration, certificates, media and refund workflows as critical, auditable and replay-safe.
- Do not introduce infrastructure, dependencies or broad abstractions without a justified requirement and decision.

## Required frontend workflow

For UI implementation or redesign:
1. Read `docs/design/DIRECTION.md` and `docs/design/SYSTEM.md`.
2. Read `docs/design/COMPONENTS.md` and the relevant sections of `docs/design/SCREENS.md`. Observe phase tags: **MVP**, **later**, or **proposed**.
3. Inspect `docs/design/references/INDEX.md` and any **actual** approved or rejected assets present; never assume a sample filename exists or is approved.
4. Follow `docs/design/icons/USAGE.md` and reuse approved files under `public/icons/` before seeking any icon library or generating artwork.
5. For substantial styling/design tasks, attempt to load the installed `uncodixfy` skill (explicit `$uncodixfy` when supported). If it is missing, say so and continue with the repository's rules. **The approved design documents override generic skill aesthetics.**
6. Use Russian as the reference locale and test English when relevant. Headlines: Unbounded; functional UI: Manrope; approved single-accent palette.
7. Apply the three design signatures **selectively**; they are not required on every screen. Keep student, trainer-curator and administration workspaces primarily functional.
8. Build real accessible interaction states. Demo experiences must use isolated sample data and cannot alter actual learning records.
9. Inspect browser screenshots where tooling is available; check desktop/mobile, Cyrillic wrapping, contrast, keyboard focus, and `docs/design/QA.md`. Report limitations rather than claiming unverified success.

## General development workflow

- Inspect existing code, requirements, decision register and current diff before editing.
- Make focused changes. Preserve unrelated work and avoid speculative refactoring.
- For complex tasks, state the approach; update the relevant source-of-truth docs when behavior or approved design choices change.
- Run relevant validation when supported: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, plus appropriate tests.
- Report exactly what was run and which checks could not be performed.
- Do not remove the auto-generated Next.js agent block above. Consult installed `node_modules/next/dist/docs/` before using new Next.js APIs.

## Git safety

- Do not overwrite unrelated changes or commit secrets.
- Commit only when explicitly requested or permitted by the task workflow. Keep commits focused and reviewable.
- Do not merge, deploy, or force-push without explicit authorization.

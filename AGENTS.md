<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# LMS Agent Instructions

## Project
A Next.js learning management system for beauty education.

Users can purchase courses, complete lessons, submit
assignments, communicate with trainers, and earn certificates.

Core roles: guest, student, trainer, manager, administrator.
Users may have multiple roles.

## Stack
- Next.js App Router
- TypeScript (strict)
- Tailwind CSS
- pnpm
- Feature-based modular monolith

Do not introduce new infrastructure or dependencies
without a concrete feature requirement.

## Architecture
- src/app: routing and request entry points.
- src/features: domain-owned business functionality.
- src/components/ui: generic UI primitives.
- src/db: shared database infrastructure.
- src/lib: shared technical utilities.

Keep route handlers thin.
Keep business rules outside React components.
Keep database access server-side.
Avoid cross-feature access to internal implementation.
Use explicit feature interfaces for cross-module operations.
Keep modularity and divide each major feature into small chunks. Dont create large components(Divide into small chunks then import each of them), dont put different tasks into one file.

Do not introduce abstraction layers without a clear need.

## Security
- Validate untrusted inputs at server boundaries.
- Enforce authentication and resource-level authorization.
- Never trust client-provided roles, prices, or ownership.
- Never expose secrets or protected student resources.
- Treat payment and enrollment operations as critical.

# Frontend Design Instructions

This project is a Russian-first beauty education LMS.

## Before modifying frontend UI

1. Read docs/design/DIRECTION.md.
2. Read docs/design/SYSTEM.md.
3. Read docs/design/COMPONENTS.md.
4. Read the relevant page section in SCREENS.md.
5. Inspect relevant approved and rejected visual references.

## Implementation rules

- Use the established design tokens.
- Do not introduce new fonts or brand colors.
- Do not invent product features, prices, testimonials, or statistics.
- Reuse existing components before creating new ones.
- Keep business logic separate from visual changes.
- Design and test Russian layouts first.

## Visual verification

For user-facing UI changes:
- Render the page in a real browser when possible.
- Check desktop and mobile screenshots.
- Compare against approved references.
- Apply the checklist in docs/design/QA.md.
- Report remaining visual mismatches.

When documentation conflicts, identify the conflict
rather than silently inventing a new design direction.

## Workflow
- Inspect relevant existing code before editing.
- Keep changes focused on the requested task.
- Avoid unrelated refactoring.
- For complex changes, outline the approach first.
- Update relevant documentation when behavior changes.
- Add meaningful tests for business rules.
- Report verification results and known limitations.
- After major change -> update the docs for references and future instructions.

## Verification
Run the checks relevant to changed code:
- pnpm lint
- pnpm exec tsc --noEmit
- pnpm build

Run feature tests when available.
Never claim checks passed without running them.

## Git
- Do not overwrite unrelated changes.
- Never force-push or commit secrets.
- Commit each major change with description, dont push and deploy
- Prefer small, reviewable changes.

## Documentation
Read relevant documentation as needed:
- Product: docs/product/
- Architecture: docs/architecture/
- Design: docs/design/
- Decisions: docs/decisions/

Documentation describes intent; code and tests reveal
current implementation. Report contradictions instead
of silently choosing one.

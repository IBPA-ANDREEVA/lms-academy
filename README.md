# Beauty Academy LMS

Russian-first online beauty education platform supporting course discovery and purchase, protected learning, practical assignments, curator review, certificates and administration. English is a planned supported interface language; the [release plan](docs/product/mvp.md) defines when features ship.

> **Status:** public frontend and review fixtures: homepage, catalogs, detail previews, auth modal, cart and checkout. No production authentication, database, payments or seven server domains are implemented. Browser-test sources and past visual evidence are not end-to-end release acceptance.

## Stack

- Next.js 16.4.3 App Router / React 19 / TypeScript
- Tailwind CSS 4
- pnpm
- Accepted architecture: [modular monolith](docs/decisions/0001-modular-monolith.md) with [frontend/server separation](docs/decisions/0002-frontend-server-separation.md)

Approved [product decisions](docs/product/decisions.md) select Stripe embedded Payment Element (USD) and self-managed encrypted video using private Cloudflare R2 and separate VPS/VM FFmpeg workers. Database/authentication, notification, application hosting, and remaining implementation choices stay subject to recorded decisions.

## Local setup

Install the package manager version declared in `package.json` (Corepack if available), then:

```bash
pnpm install
pnpm dev
```

Development server: http://localhost:3000

Frontend work happens directly in the application. Start with the [frontend registry](docs/architecture/frontend-pages.md), reuse [shared components](docs/architecture/frontend-components.md), and update the registry after every UI change. The development planning routes and reference gallery have been retired. Inspect live shared components at [Component previews](http://localhost:3000/preview/components) while running `pnpm dev`.

Check quality with `pnpm lint`, `pnpm exec next typegen`, `pnpm exec tsc --noEmit`, and `pnpm build`. Component and browser checks are documented in `docs/architecture/frontend-verification.md`.

## Documentation

| Topic | Source of truth |
| --- | --- |
| Product behavior | [Requirements](docs/product/requirements.md) |
| Release phases and MVP | [MVP / phases](docs/product/mvp.md) |
| Unresolved product decisions | [Open questions](docs/product/open-questions.md) |
| Architecture and ownership | [Overview](docs/architecture/overview.md), [Modules](docs/architecture/modules.md), [ADR-0001](docs/decisions/0001-modular-monolith.md) |
| Visual identity and signatures | [Design direction](docs/design/DIRECTION.md) |
| Design tokens and components | [System](docs/design/SYSTEM.md), [Components](docs/design/COMPONENTS.md) |
| Screens and visual verification | [Screens](docs/design/SCREENS.md), [QA](docs/design/QA.md) |
| Icon asset rules | [Icons](docs/design/icons/USAGE.md) |
| Frontend implementation | [Pages](docs/architecture/frontend-pages.md), [Sections](docs/architecture/frontend-sections.md), [Shared components](docs/architecture/frontend-components.md), [Backlog](docs/architecture/frontend-backlog.md) |
| Feature delivery and roadmap audit | [Workflow](docs/architecture/development-workflow.md), [2026-10-30 audit](docs/architecture/planning-audit-2026-10-30.md) |
| Agent workflow | [AGENTS.md](AGENTS.md) |

The original technical specification and wireframe PDF are stored in `docs/references/`; their example course details and prices are not production catalog data.

The [current planning audit](docs/architecture/planning-audit-2026-10-30.md) records nine active delivery epics, Russian task notes, the preserved completed history and the capacity-based forecast. The nine epics do not change the seven server domains. The owner-confirmed capacity is 50 hours per ordinary week (10 per weekday), with weekends and November 26, December 25 and January 1 excluded. The current conditional forecast is MVP December 18, 2026 and Full January 22, 2027; fixed acceptance deadlines remain December 7 and January 26. The Vault has three entry points: Dashboard, Timeline and Full Project Plan.

## Language and design

- Russian-first with English support as specified by the release scope.
- **Unbounded** for short display headings; **Manrope** for UI text.
- Single plum brand accent (`#782858`) with neutrals and distinct semantic status colors.
- Reuse the icon assets already present under `public/icons/`; do not invent alternate icon families.
- Visual references must be explicitly approved before being treated as implementation targets.

Read `AGENTS.md` before agent-driven frontend work.

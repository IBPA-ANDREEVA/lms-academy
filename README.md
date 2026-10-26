# Beauty Academy LMS

Russian-first online beauty education platform supporting course discovery and purchase, protected learning, practical assignments, curator review, certificates and administration. English is a planned supported interface language; the [release plan](docs/product/mvp.md) defines when features ship.

> **Status:** early Next.js scaffold. The repository has product/architecture/design documentation, but most domain features, providers, and the approved visual identity have **not** been implemented. Do not mistake design specifications or placeholders for working features.

## Stack

- Next.js 16.4.3 App Router / React 19 / TypeScript
- Tailwind CSS 4
- pnpm
- Accepted architecture: [feature-based modular monolith](docs/decisions/0001-modular-monolith.md)

Database, authentication, payment, media, notification and hosting providers remain subject to recorded decisions.

## Local setup

Install the package manager version declared in `package.json` (Corepack if available), then:

```bash
pnpm install
pnpm dev
```

Development server: http://localhost:3000

Check quality with `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` once dependencies are installed.

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
| Visual references (pending curation) | [Reference register](docs/design/references/INDEX.md) |
| Agent workflow | [AGENTS.md](AGENTS.md) |

The original technical specification and wireframe PDF are stored in `docs/references/`; their example course details and prices are not production catalog data.

## Language and design

- Russian-first with English support as specified by the release scope.
- **Unbounded** for short display headings; **Manrope** for UI text.
- Single plum brand accent (`#782858`) with neutrals and distinct semantic status colors.
- Reuse the icon assets already present under `public/icons/`; do not invent alternate icon families.
- Visual references must be explicitly approved before being treated as implementation targets.

Read `AGENTS.md` before agent-driven frontend work.

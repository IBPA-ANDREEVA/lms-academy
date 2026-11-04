# ADR-0002: Frontend features and server business domains

> 2026-11-03 status update: [ADR-0003](0003-python-backend-architecture.md) supersedes the Next.js/TypeScript backend runtime, backend code placement and direct frontend/domain calls below. Seven-domain ownership, security, consistency and frontend separation remain. The original decision body is retained as history; use ADR-0003 for current implementation.

- Status: Accepted
- Date: 2026-10-30
- Authority: explicit owner request, “LMS Academy: Architecture & Development Plan Restructuring”, sections 3–8.
- Supersedes: ADR-0001 **code placement and UI ownership only**. The modular monolith, seven domains, consistency and security rules remain accepted.

## Decision

```text
src/
  app/                       # thin Next.js routes, entry points, composition
  features/                  # frontend pages, numbered sections and local components
    home/
    catalog/
    course-detail/
    commerce/
    identity/
    public-shell/
    ...                      # actual frontend features as implemented
  components/ui/             # genuinely generic visual primitives
  server/                    # authoritative server-only business domains
    identity/
    catalog/
    commerce/
    learning/
    assignments/
    certificates/
    notifications/
  db/                        # connections, transactions, migrations, schema plumbing
  lib/                       # small technical utilities
```

Keep every existing frontend file in place. Frontend feature names and boundaries need not match business domains. Pages compose sections; substantial sections compose independently maintained local components. Reuse the existing frontend registries and supplied reference workflow. Do not move UI into route-local folders or backend domains.

Each `src/server/<domain>` owns rules, authorization, use cases, domain migrations/schema ownership and persistence operations. Export narrow commands/queries from an explicitly server-only public entry. Serializable contracts may live in a separate dependency-free `contracts.ts` and be imported **as types** by frontend code; never re-export server commands from a client-facing feature barrel. Server Components and thin actions/handlers call the domain public entry. A Server Component under `src/features` is still presentation: it may compose authorized DTOs, not implement policy or issue direct database queries. Browser modules cannot import server runtime code.

Domains communicate by narrow local interfaces and explicit transaction context. One owner writes each record. Do not create generic services/repositories for every table. Use focused functions first; private persistence helpers are justified by actual use. `src/db` is not an eighth business domain. Referrals, financial attribution and commissions belong to Commerce; checkout acceptance records also belong to Commerce. Policy-document management/publication ownership remains a feature-preparation decision in SALE002; the earlier unconditional Commerce-publication statement is superseded by the owner's explicit nine-epic refactoring request. Learning owns course conversations; Assignments owns review voice/media; the seven-domain boundary stays intact. Cross-domain read models and injected narrow contracts must avoid synchronous import cycles.

The existing Assignments homework-definition baseline is not relocated by this ADR. SITE009/WORK001 must examine definition/mandatory-version ownership and publication-readiness contracts before implementing the schema; previously proposed changes are not approved by the planning refactor.

Catalog owns course-video records/publication; Learning owns playback authorization; Assignments owns homework assets. R2/FFmpeg adapters and technical worker execution do not introduce a media business microservice. The already approved separate worker runtime remains under PD-003.

## Why

The working public frontend has page/section/component boundaries that serve design iteration. Backend ownership must stay independent of those screens so webhooks, jobs, admin operations and UI share authoritative rules. Combining both in seven feature folders would force unnecessary frontend migration and obscure fixture-versus-backend status.

Alternatives rejected: route-local UI migration, backend domains owning React layouts, a service per table, and new microservices. No provider or dependency is selected by this ADR.

## Consequences and verification

- The nine delivery epics are separate from the seven business domains; epic 09 contains distinct MVP and Full acceptance phases.
- No runtime scaffold is needed in this planning change. Create server files with the first real implementation, not empty layers.
- Update overview/modules/AGENTS and follow [development workflow](../architecture/development-workflow.md).
- Protected operations test authorization, constraints, concurrency, retries and privacy-safe errors at their owning domain.
- Client import checks and contract tests belong to implementation tasks. Current frontend fixtures do not establish working authentication, pricing, fulfillment or database persistence.
- An epic is complete only after required implementation, real integration, scheduled epic verification and accurate evidence. Final system acceptance remains separate.

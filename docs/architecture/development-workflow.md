# Feature delivery workflow

Authority: owner restructuring request (2026-10-30); [ADR-0002](../decisions/0002-frontend-server-separation.md), with runtime/code placement superseded by [ADR-0003](../decisions/0003-python-backend-architecture.md). This is a planning workflow, not implementation or blanket visual approval. The operational source is the existing LMS Obsidian project; [audit](planning-audit-2026-10-30.md) records provenance and verification.

## Prepare one feature

Keep preparation within the coherent capability epic. Read only relevant requirements, approved decisions and unresolved questions. Produce one compact specification when meaningful design is needed, preferably `docs/architecture/features/<preparation-task-id>.md`; do not create empty notes now. Include:

1. Technical approach and rationale using existing tools where possible.
2. Owned entities/relationships, a small ER diagram if useful, constraints/indexes, transactions and immutable history.
3. Public Python query/command contracts, versioned HTTP/Pydantic request/response contracts and OpenAPI compatibility, resource authorization and session propagation.
4. Business states/transitions and edge cases.
5. Failure/recovery, durable jobs where necessary and risk-based tests.
6. Exact product decisions blocking specific slices, approved answers, concise recommendations/alternatives for remaining questions.
7. A concrete implementation breakdown using existing task IDs rather than a document-generation backlog.

Ready means the unblocked slices can be implemented without significant architectural guessing. A remaining product question must block its named implementation; it cannot be converted into a default. Research may settle technical choices with a focused ADR without pretending to approve business/legal policy. A missing identity/legal input does not block unrelated UI or pure technical research.

## Build and connect the interface

UI planning specifies route, user goal, ordered sections, interactions, shared versus local components, data/contracts, all relevant states and mobile behavior. Update the frontend registries. Follow **sections → components → supplied references → implementation**. Missing references remain pending and block final visual implementation; no new aesthetic is declared approved here.

Preserve existing `src/features` ownership and numbered sections. `src/app` composes routes and delivery adapters. The seven Python `backend/app/modules` domains own business behavior; Next.js and FastAPI communicate over HTTP rather than local TypeScript calls. Stable contracts permit frontend fixture implementation and backend implementation to proceed independently. Prefer reviewing the visual interface before final wiring; do not build the entire backend before any usable frontend. UI fixtures are clearly labeled and do not claim authentication, payment or persistence.

Integration uses generated TypeScript contracts from FastAPI OpenAPI and replaces fixtures with authorized HTTP queries/mutations; validates input; tests state, error, persistence and transaction behavior; removes obsolete demonstration data only in integrated paths; preserves UI boundaries. Reuse actual shared components and maintain their preview when they change.

## Cross-runtime implementation and verification

Root AGENTS applies throughout; backend/AGENTS additionally governs Python. The current backend is empty structure only. A separate initialization task selects/pins Python, dependencies, static checker (mypy recommended), database driver, auth/session transport and contract-generation tools, and creates runnable commands. Implement neither fake endpoints nor speculative layers to satisfy a plan.

Feature contracts name both frontend consumers and Python owners, allowed version overlap, transaction boundaries, privacy-safe errors/correlation, and required worker behavior. Export OpenAPI and review generated types/client changes; never hand-copy Python schemas into TypeScript. Keep fixtures explicitly preview-only until real integration passes. Next.js never accesses authoritative tables.

Run frontend lint/type/build and affected browser/SEO checks; once configured, run uv/Ruff/static-checker/pytest checks, PostgreSQL migration/transaction/concurrency tests, API authorization/contract checks and actual integration checks. No backend tests are runnable from empty directories. Deployments are independent: migrations must support the API/worker compatibility window, and HTTP contracts must support overlapping frontend/backend versions. Record missing implementation separately from failed checks.

## Finish a capability

Each epic has explicit scheduled verification, including separate MVP/Full gates for mixed-phase epics. Select applicable rule/constraint/transaction, integration, cross-user authorization, failure/retry, responsive, accessibility and regression checks. Frontend-only verification does not invent database tests. Pending implementation keeps verification pending. Final system-wide acceptance still tests the complete purchase-to-certificate and refund/recovery paths.

A task is done only when its acceptance and actual evidence exist. An epic is done only when required implementation, real integration, verification and current documentation all exist. Research/design completion and a build result never establish backend or visual acceptance.

## Scheduling and preservation

The active plan has exactly nine delivery epics: Public Website & Catalog; Platform Foundation & Identity; Student Dashboard & Learning; Commerce & Referrals; Video & Media Infrastructure; Homework & Curator Workspace; Certificates & Notifications; Administration & Operations; Polishing & Testing. These are delivery groupings, not the seven server-domain boundaries. Essential admin operations are scheduled with their capabilities, before the consolidation in epic 08.

Use coherent work packages, generally 5–10 hours. The November 2 follow-up fills 10 hours per weekday in canonical order, without the old hard limit of two task entries. A short finish can lead to 3–4 consecutive entries; these are not newly fragmented work packages. Short preparation, publication contracts and release gates remain separate when merging would introduce false dependencies. The owner confirmed **10 hours per working day for both phases** and requested aggressive per-package estimates on 2026-10-30. The owner reconfirmed 50 hours per ordinary week and explicitly retained weekends and the exclusions November 26, December 25 and January 1; those weeks have 40 hours. No overtime is allocated. An early final week or the fixed Full QA reservation can leave unused capacity. Extra agents are not additional capacity in this forecast.

The previous 2–6-hour slices and their owner-directed 50% reduction are historical provenance. The new packages absorb that already-adjusted scope; do not halve estimates again. Current estimates reuse implemented UI and remove unnecessary handoffs, include local tests, and exclude external approval wait and unknown defect volume. They are optimistic budgets, not measured delivery speed. Canonical task metadata, rather than copied totals here, drives the forecast.

Following the explicitly authorized migration below, completed tasks retain their current bytes, filenames, IDs, statuses and estimates; original records remain archived. Pending tasks use Russian titles and three sections: Проблема, Что сделать, Готово, когда. Original-to-current IDs resolve through the retained JSON mapping and task aliases. Existing individual task CSS is immutable in the planning redesign; Dashboard styles use their own scope.

PD-012 fixes MVP **2026-12-07**, Full **2027-01-26**, Full feature cutoff **2027-01-20** and January 21–25 stabilization. Epic 09 has a pre-MVP Phase A target reservation and a post-MVP/pre-Full Phase B reservation. Actual dependency/resource forecasts are separate; if they miss the reserved window, show the conflict instead of marking QA scheduled successfully before incomplete prerequisites. Every capability retains phase-appropriate verification, followed by final cross-epic acceptance. No commit, push or deployment is authorized by planning.

Homework-definition relocation is not approved here: SITE009/WORK001 review the current Assignments baseline, Catalog readiness and any proposed change before schema implementation. SALE002 resolves policy-publication ownership among the existing domains; Commerce already owns checkout acceptance evidence. Neither question creates a new domain or a platform-wide blocker.


Owner follow-up (2026-10-30): active epic names and folders are Russian. Tasks use one semantic prefix per epic and contiguous three-digit display numbers, completed work first, then MVP and Full. Follow the canonical order in the Vault `Resources/ordered-epics.json`; concentrate on one epic per phase and detour only for its dependency, with an explicit return. Do not pick unrelated tasks merely to fill a day. The owner explicitly authorized moving/renaming the 12 historical completed files into their new epic folders; their contents, original internal IDs, completion data and modification times remain immutable. Future completed-task moves still require explicit authorization. Up to one extra hour, at most twice weekly, may finish lightweight documentation of already settled contracts; heavy work stays within the normal day. Deadlines remain fixed and conflicts remain visible.


Additional explicit owner authorization (same session): completed notes must also match the new style and titles. The 12 completed records were therefore reformatted with current epic IDs and the same three Russian sections. Preserve their completed status, original estimates, date tags and recorded time ranges. Original byte-identical sources are archived in Vault `Resources/completed-originals.zip`; `ordered-epics.json` records both original and authorized formatted hashes. This supersedes the earlier content/ID immutability restriction only for the authorized formatting migration; do not infer new implementation evidence or reopen completed work.

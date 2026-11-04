# LMS Python backend

**Status: structural preparation only. The Python runtime has not yet been implemented.** This directory contains instructions and intentionally empty directories. There is no application entry point, dependency manifest/lockfile, router, model, database connection, migration, authentication, job or API client. Do not run an assumed startup command or treat `.gitkeep` as delivered functionality.

Read the root [AGENTS.md](../AGENTS.md), local [AGENTS.md](AGENTS.md), [ADR-0003](../docs/decisions/0003-python-backend-architecture.md), [module contracts](../docs/architecture/modules.md) and [integration contract](../docs/architecture/frontend-backend-integration.md) before implementation.

## Approved architecture and intended stack

One Python FastAPI modular monolith owns authoritative operations. The existing Next.js 16 / React / TypeScript / Tailwind frontend remains in this repository and deploys independently. They communicate through versioned HTTP/JSON REST APIs and OpenAPI contracts. Python modules communicate through narrow local interfaces, not seven network services.

The selected stack is FastAPI, Pydantic v2, SQLAlchemy 2, Alembic and PostgreSQL; Neon is the intended database host, not a provisioned service. Tooling is uv, pytest and Ruff; mypy is the proposed static checker, to confirm and configure at initialization. Python version, exact dependency pins, database driver/sync strategy, hosting, authentication library and durable-job executor remain technical selections. No dependencies are installed by this change.

## Directory conventions

```text
backend/
  AGENTS.md
  README.md
  app/
    api/                     # future version mounting / HTTP composition
    core/                    # small technical configuration, logging, clock helpers
    db/                      # engine/session/transaction and metadata plumbing
    modules/
      identity/
      catalog/
      commerce/
      learning/
      assignments/
      certificates/
      notifications/
    jobs/                    # durable execution wiring; domain handlers keep owners
  alembic/
    versions/                # future reviewed schema revisions
  tests/
    unit/
    integration/
    api/
```

Each leaf currently contains only `.gitkeep`. API, core, db and jobs are technical boundaries, never additional business domains.

| Domain | Responsibility |
| --- | --- |
| Identity | Accounts, authentication, sessions, roles and explicit capabilities |
| Catalog | Course/lesson definitions, prices, publication/readiness, course-media references |
| Commerce | Orders, payments, refunds, cart/quotes, consent acceptance and commercial attribution |
| Learning | Enrollments, access/support, progress and enrollment-scoped conversations |
| Assignments | Existing homework-definition baseline, submissions, reviews and homework assets |
| Certificates | Eligibility evaluation and issuance records; admin review/manual issuance |
| Notifications | Delivery of committed notification intents and delivery outcomes |

The complete ownership and dependency matrix in `docs/architecture/modules.md` takes precedence over this short map. PD-011 adds referral capabilities, never a manager role. Homework-definition ownership and policy-publication ownership remain their existing preparation decisions.

## Future internal module organization

Create files only when their responsibilities exist; a small operation may need only a few files. These names are conventions, not scaffolding requirements:

| Optional file | Responsibility |
| --- | --- |
| `router.py` | Thin FastAPI routes: HTTP inputs, dependencies, operation call, response mapping |
| `schemas.py` | Pydantic request/response models; never expose ORM records wholesale |
| `models.py` | SQLAlchemy mappings and constraints for this domain's records |
| `service.py` | Named use cases, resource checks and explicit workflow transaction boundary |
| `policies.py` | Business decisions/state transitions independent of FastAPI/ORM where practical |
| `persistence.py` or a focused adapter | Private domain queries/writes when separation has a real purpose |
| `public.py` | Documented narrow cross-module interface when another module actually consumes it |

Split growing files by use case; do not mandate base services, repository-per-table classes, interfaces for every function or empty layers. Technical adapters do not acquire domain ownership.

## Future development and verification

Prepare a bounded feature contract, record blocking product questions, then initialize the runtime in a separate implementation task. That task selects supported Python/pinned packages, creates `pyproject.toml` and `uv.lock`, configures checks and documents real commands. No initialization is implied here.

Thereafter use uv for reproducible environments, Ruff for formatting/lint, a configured static checker and pytest. Expected future checks are `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy app`, and `uv run pytest` from this directory; they are **not available yet**. Unit tests isolate rules, PostgreSQL integration tests cover migrations/constraints/transactions/concurrency, and API tests cover schemas, authentication, authorization and error/privacy contracts. Do not substitute SQLite for PostgreSQL acceptance.

Alembic revisions are reviewed, tested from an empty and supported prior database, and applied once by a controlled release step. Never migrate automatically from every API/worker process. Use additive expand/contract changes across independently deployed frontend/API versions. Test recovery and data preservation before destructive changes.

Export OpenAPI deterministically, review its compatibility diff and generate TypeScript integration types/client in the implementation slice. Preserve existing frontend preview behavior until real integration is verified. See [prioritized recommendations](../docs/architecture/python-backend-recommendations.md) for unresolved selections and release gates.

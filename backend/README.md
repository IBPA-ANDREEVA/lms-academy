# LMS Python backend

**Status: BASE02-B database migration foundation implemented.** Python/uv dependencies, Alembic's empty baseline, shared metadata, an explicit no-op seed, PostgreSQL integration tests and guarded backup/recovery commands exist. There is no FastAPI application, domain table/model, authentication, job or HTTP client. Empty domain directories remain preparation, not delivered features. See the [database runbook](../docs/architecture/database-migrations.md) and [verification evidence](../docs/qa/BASE02-B-database-foundation-2026-11-04.md).

Read the root [AGENTS.md](../AGENTS.md), local [AGENTS.md](AGENTS.md), [ADR-0003](../docs/decisions/0003-python-backend-architecture.md), [module contracts](../docs/architecture/modules.md) and [integration contract](../docs/architecture/frontend-backend-integration.md) before implementation.

## Approved architecture and intended stack

One Python FastAPI modular monolith owns authoritative operations. The existing Next.js 16 / React / TypeScript / Tailwind frontend remains in this repository and deploys independently. They communicate through versioned HTTP/JSON REST APIs and OpenAPI contracts. Python modules communicate through narrow local interfaces, not seven network services.

The target stack remains FastAPI, Pydantic v2, SQLAlchemy 2, Alembic and PostgreSQL. The foundation uses Python 3.12, synchronous SQLAlchemy/Psycopg 3 for operator commands, uv/uv.lock, pytest, Ruff and strict mypy. FastAPI/Pydantic and application request/session/pooling strategy are not initialized. The owner reports a provisioned Neon project with four branches; this task's independent verification uses isolated local PostgreSQL. Hosting, authentication and durable-job selections remain separate work.

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
    versions/                # immutable applied empty baseline; future reviewed revisions
  scripts/
    verify_postgres.py        # creates/stops its own disposable local cluster
  tests/
    unit/
    integration/
    api/
```

Domain, API, core and jobs leaves still contain only `.gitkeep`. `app/db` now contains configuration, metadata/base, no-op seed and recovery utilities. API, core, db and jobs remain technical boundaries, never additional business domains.

| Domain | Responsibility |
| --- | --- |
| Identity | Accounts, authentication, sessions, roles and explicit capabilities |
| Catalog | Course/lesson definitions, prices, publication/readiness, course-media references |
| Commerce | Orders, payments, refunds, cart/quotes, consent acceptance and commercial attribution |
| Learning | Enrollments, access/support, progress and enrollment-scoped conversations |
| Assignments | Existing homework-definition baseline, submissions, reviews and homework assets |
| Certificates | Eligibility evaluation and issuance records; admin review/manual issuance |
| Notifications | Delivery of committed notification intents and delivery outcomes |

The complete ownership and dependency matrix in `docs/architecture/modules.md` takes precedence over this short map. PD-013 restores concurrent manager membership; referral capability remains independent. Homework-definition ownership and policy-publication ownership remain their existing preparation decisions.

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

Prepare a bounded feature contract and record blocking product questions before adding domain models or APIs. Follow the [exact new-table process](../docs/architecture/database-migrations.md#adding-the-first-domain-table). Do not rewrite baseline `5c9789a48cba` or put domain mappings in `app/db`.

Run from this directory:

```powershell
uv sync --locked
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest -q
uv run alembic history
uv run alembic heads
uv run python -m app.db.seed --environment development
# Requires a complete PostgreSQL 18 distribution:
$env:POSTGRES_BIN = 'C:\path\to\postgresql18\bin'
uv run python scripts/verify_postgres.py
```

Without explicit test credentials, pytest reports database skips. The isolated harness provides its own temporary credentials and runs live migration/rollback/recovery checks. The applied baseline is excluded from Ruff to preserve its exact bytes. `uv run mypy` checks app, Alembic environment, tests and the harness. Domain/API tests remain future work; SQLite cannot substitute for PostgreSQL acceptance.

Alembic online commands require `LMS_ENV` and `MIGRATION_DATABASE_URL`; there is no fallback to the future runtime `DATABASE_URL`, and `.env` is never auto-loaded. Select the authorized direct endpoint before any upgrade. Backup/restore credentials are separate. Commands, environment guards and their limits are documented in the [runbook](../docs/architecture/database-migrations.md).

Alembic revisions are reviewed, tested from an empty and supported prior database, and applied once by a controlled release step. Never migrate automatically from every API/worker process. Use additive expand/contract changes across independently deployed frontend/API versions. Test recovery and data preservation before destructive changes.

Export OpenAPI deterministically, review its compatibility diff and generate TypeScript integration types/client in the implementation slice. Preserve existing frontend preview behavior until real integration is verified. See [prioritized recommendations](../docs/architecture/python-backend-recommendations.md) for unresolved selections and release gates.

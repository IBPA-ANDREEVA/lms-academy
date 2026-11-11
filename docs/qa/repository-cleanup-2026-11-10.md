# Repository cleanup — 2026-11-10

## Scope and evidence

The owner authorized removing unused project files and generated Next.js folders, creating separate commits for major changes, and opening a PR. The starting worktree was clean at `40fbeed` on `refactor/clean-directory`.

- Removed 837 numbered copies: 810 documentation/evidence copies, 20 frontend source/style copies and seven browser-test copies. Of these, 821 were byte-identical to retained canonical files. The other 16 were unreferenced source/test variants. Repository-wide text checks found no consumers of their filenames or extensionless basenames; canonical application implementations remain unchanged.
- Compared all 821 retained canonical files against the deleted copies in the base commit. Unique documentation, photography, icon variants, database diagrams and explicitly preserved `.archive` sources remain. The historical `tests/circle-loading.browser 2.mjs` remains because CI documentation/evidence references it.
- Removed 14 redundant `.gitkeep` files: 13 in directories already containing tracked implementations/tests and one retired `src/db/schema` placeholder. Removed the now-empty `src/db` tree. Kept placeholders for documented future frontend features, optional API transport, backend jobs/API tests and end-to-end tests.
- Removed five local generated directories: `.next`, `.next-land03-preview`, `.next-land03-real`, `.next-land03-build-preview` and `.next-land03-build-real` (approximately 1.4 GB before verification). No Next.js server was running. Removed the `.next` output recreated by validation and the incremental TypeScript cache after checks; the next development/build command regenerates them.
- Removed the empty tracked `dbml-error.log` and ignored future instances. Consolidated redundant Next output patterns in Git/ESLint ignores and removed stale isolated-output includes/exclusions from TypeScript configuration. Preserved default Next generated-type includes and the `LMS_BUILD_DIR` override for future isolated verification.

No active route, UI implementation, component API, product data, dependency, schema, migration or backend behavior changed. The four frontend registries record unchanged canonical ownership. No source documentation or unique visual evidence was discarded merely because it lacks a runtime import.

## Verification

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed |
| `node --test tests/*.test.mjs` | Six passed |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm exec next typegen` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm build` | Passed; expected disconnected-Catalog diagnostics |
| Backend `uv run ruff check .` | Passed |
| Backend `uv run ruff format --check .` | Passed, 52 files |
| Backend `uv run mypy` | Passed, 46 source files |
| Backend `uv run pytest -q` | 128 passed, 28 integration cases skipped without isolated PostgreSQL credentials |
| Canonical byte verification | All 821 identical copies retain an unchanged canonical file |
| `git diff --check` | Passed |

Browser/visual tests were not rerun because active UI implementations are unchanged. PostgreSQL harness, migration and schema-render checks were not rerun because backend changes only remove empty redundant placeholders. No visual approval or product integration is claimed. Historical archives, distinct assets and evidence, installed dependencies, environments and local verification evidence remain intentionally preserved.

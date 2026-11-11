# CI blockers and CodeQL triage — 2026-11-10

Scope: preserve application behavior, repair CI source classification, secure local verification tools, rerun checks, and commit the requested work in separate logical changes. No application routes, UI copy, authentication, database models, schema revisions or product rules were changed. No push, merge or deployment is authorized by this work.

## Six TypeScript errors

All six errors belonged to four unreferenced ` 2.ts/tsx` copies of D-020 motion code. D-021 explicitly replaced CircleLoader with SplashLoader, removed the course-only scroll hook, and returned AcademyStory to document flow. The [component registry](../architecture/frontend-components.md) and [section registry](../architecture/frontend-sections.md) record those active owners. Restoring the retired symbols would contradict that implementation.

The four files now have `.archive` suffixes, matching the repository's existing historical-source convention. Their contents are byte-for-byte identical to their prior committed sources. There are no new TypeScript exclusions, error suppressions, invented motion tokens or runtime replacements. An import audit inspected 763 static/dynamic literal imports in 210 existing JS/TS files and found no consumers of these copies; application source has no dynamic directory loader for them.

| Archived file under `src/` | SHA-256 before and after |
| --- | --- |
| `features/component-preview/motion-preview 2.tsx.archive` | `0eb61d3f2c44f001fba9d93298e58a7755358c3404873a05f088384663c90097` |
| `features/home/composition/academy-story 2.tsx.archive` | `3300f697fad31e4c53f2cb28924c643ef98d5092fa606affc1a3f69e5556a454` |
| `features/home/sections/06-courses/components/use-featured-course-scroll 2.ts.archive` | `ffb1e1fea21abf8f96c4cb0ec8d28c6f42b768b997c75da91cb00b9d69525049` |
| `features/public-shell/circle-loader 2.tsx.archive` | `b65d1ba3b0e816421f29f6c2e5e8d411c9a1db0b63b6142b9a7eeda3649cdb89` |

## CodeQL findings

### Alerts 2 and 3: request forgery in browser-test proxies

[Alert 2](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/2) and [alert 3](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/3) correctly identified that `new URL(request.url, base)` accepts absolute and scheme-relative URLs. A request to a locally running test proxy could choose a different upstream. These servers bind to loopback and run only as explicit browser tests; they are not application endpoints. That limits exposure but does not make the unsafe forwarding correct.

Both scripts now use the same test-only `tests/helpers/loopback-proxy.mjs`. It accepts a loopback HTTP origin configured by the operator, uses fixed hostname/port request options, rejects non-origin-form targets, and overwrites the forwarded Host header. Request data can supply only a path, never the upstream authority. Node's HTTP client does not follow redirects. Normal Next asset/Flight queries, HTTP methods/bodies and streamed responses are preserved. No remote-service proxy support is implied by `FRONTEND_URL`; these harnesses require a local server.

Regression tests send real HTTP requests through a proxy into a disposable loopback upstream. They verify streamed shell/segment data, POST bodies, Next query paths, Host/encoding normalization, encoded path handling and rejection of absolute/scheme-relative/backslash targets without an upstream request. Configuration tests reject external origins, credentials, non-HTTP schemes and base paths/query/fragments.

### Alert 1: temporary clear-text bootstrap credential

[Alert 1](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/1) identified a real plaintext write in `backend/scripts/verify_postgres.py`. It was a random, ephemeral credential for a fresh isolated cluster in a private temporary directory, removed immediately after `initdb`, not an LMS account password or shared database credential. Nevertheless the file was unnecessary.

The macOS/Linux harness now sends the password through `subprocess.run(input=...)` to `initdb --pwfile=/dev/stdin`. No password file or command-line secret is created, and stdout/stderr remain suppressed. SCRAM authentication, environment sanitization, random credentials, loopback binding, live pid/data-directory proof, all migration/constraint/recovery tests, and owned-cluster teardown remain intact. There is no disk fallback when `/dev/stdin` is unavailable. Unit tests cover successful initialization and initdb failure, including no credential file, no command-line secret, no startup after initdb failure and temporary-directory cleanup.

No alert was dismissed and no query/path was suppressed. GitHub still analyzes the remote revision until these local commits are pushed through a separately authorized action. The next default-setup scan must verify closure; a local analysis cannot change GitHub alert state.

## Verification

| Check | Result |
| --- | --- |
| Frozen pnpm install | Passed; package versions and lockfile unchanged |
| ESLint | Passed |
| `node --test tests/*.test.mjs` | 6 passed, including 2 proxy regressions; existing module-type warnings remain visible |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm exec next typegen` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm build` | Passed, including build-time TypeScript; expected disconnected-Catalog diagnostics remain |
| Production browser smoke | Home and `/preview/components`, 1440×900 and 390×844: current Splash controls work, retired Circle/sticky-story/course-only motion absent, no document overflow or page errors |
| Backend Ruff and format check | Passed, 52 files formatted |
| Backend strict mypy | Passed, 46 source files |
| `uv run pytest -q` | 128 passed; 28 integration cases deliberately skipped without harness credentials |
| `POSTGRES_BIN=/opt/homebrew/opt/postgresql@18/bin uv run python scripts/verify_postgres.py` | 156 passed with PostgreSQL 18.6; no skipped integration cases |
| Focused PostgreSQL tool regressions after typing correction | 9 passed |
| `uv run python scripts/schema_docs.py --check` | Passed |
| `actionlint` 1.7.12, both workflows | Passed; backend workflow unchanged |
| Archive byte comparisons / `git diff --check` | Passed |
| Local CodeQL default suites, CLI 2.27.4 | Passed: JavaScript/TypeScript 87 rules / 209 files, Python 43 rules / 54 files; zero findings in both, including the two alerted rule IDs |

The local scan used the official checksum-verified CodeQL bundle, query packs `codeql/javascript-queries` 2.5.0 and `codeql/python-queries` 1.9.0, and their complete `*-code-scanning.qls` default suites. Both extractions used `--build-mode=none`; both SARIF invocations reported successful execution. The [machine-readable summary](evidence/ci-security-2026-11-10/codeql-summary.json) records rule/coverage counts, relevant source hashes and SARIF hashes. Current code/config files were compared with the analyzed snapshot before committing. No local SARIF was uploaded over GitHub's default setup.

The browser smoke used the already bundled external Playwright and installed Chrome; no dependency was added. Historical full browser scripts were not represented as passing. Visual direction and runtime components were unchanged, so no new visual approval is claimed. Linux-hosted CI and GitHub alert closure remain to be checked after an authorized push.

## Commit scope

The owner requested committing everything in separate major changes. This includes the already-pending shared security instructions (`AGENTS.md`, `SECURITY.md`, `CLAUDE.md`) and deletion of `backend/app/modules/identity/models 2.py.archive`. That deletion existed before this follow-up; it removes an archived copy, not the active Identity model or an applied migration. Keep those changes separately identified from the CI, frontend archival, proxy and PostgreSQL fixes.

## References

- [GitHub CodeQL request-forgery guidance](https://codeql.github.com/codeql-query-help/javascript/js-request-forgery/)
- [GitHub CodeQL clear-text-storage guidance](https://codeql.github.com/codeql-query-help/python/py-clear-text-storage-sensitive-data/)
- [PostgreSQL 18 initdb](https://www.postgresql.org/docs/18/app-initdb.html) and [password-file implementation](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/bin/initdb/initdb.c)
- [Python subprocess input pipes](https://docs.python.org/3.12/library/subprocess.html#subprocess.run)
- [Official local CodeQL analysis workflow](https://docs.github.com/en/code-security/tutorials/customize-code-scanning/analyze-code)

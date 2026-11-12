# PostgreSQL installation-directory detection fix

The owner supplied a GitHub Actions failure before database initialization: the
harness required `<prefix>/share/postgres.bki`, which is not a portable installation
layout. This failure concerns local CI tools, not the Neon schema or migrations.

The harness now invokes `pg_config --sharedir` from the selected POSTGRES_BIN,
checks that the reported absolute directory contains postgres.bki, and supplies
that directory to `initdb -L`. Environment sanitization, PostgreSQL 18 validation,
isolated cluster creation and cleanup remain intact. No migration changed.

Added seven regression cases: flat, nested and versioned shared directories;
empty, relative and missing directory responses; failed pg_config with no guessed
fallback. The selected executable, sanitized environment and bounded lookup are
also asserted.

Local verification on PostgreSQL 18.6: Ruff passed; format check passed (31 files);
strict mypy passed (27 files); full isolated harness **149 passed, no skips**.
`git diff --check` passed. GitHub Actions has not been rerun with the fix; Linux
layout selection has regression coverage, while the full local run was on macOS.

Reference: [pg_config --sharedir](https://www.postgresql.org/docs/18/app-pgconfig.html)
and [initdb input directory](https://www.postgresql.org/docs/18/app-initdb.html).

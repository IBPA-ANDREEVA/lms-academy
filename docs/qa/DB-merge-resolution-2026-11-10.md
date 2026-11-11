# Database branch merge resolution · 2026-11-10

Resolved the in-progress merge of main into feat/db-setup. Preserved the applied
November 6 migration and UTC sessions; registered all 31 tables including incoming
Identity authentication storage. Removed nested historical conflict markers from
the canonical metadata registry and foundation test.

The incoming pending status/default now lives in additive revision 20261110_01.
The transactional enum replacement preserves existing statuses, requires a users
table lock, and refuses downgrade while pending users exist. The token-purpose
Python enum retains VARCHAR(48) storage compatibility. Refreshed generated
DBML/Graphviz, rendering hashes and the physical snapshot.

Preserved eight duplicate Python files byte-for-byte with .py.archive suffixes.
This prevents duplicate revision registration and execution of obsolete copied
tests without deleting the originals. Corrected incoming import/format/type
errors; no frontend behavior or integration contract was changed.

Validation:
- Ruff lint and format checks passed (52 formatted Python files).
- Strict mypy passed (46 source files).
- Plain pytest: 126 passed, 28 PostgreSQL-dependent skips.
- PostgreSQL 18.6 isolated harness: 154 passed in 21.89 seconds.
- Fresh isolated development upgrade and Alembic check passed, with no drift.
- Physical snapshot and generated-document checks passed.
- Applied 20261106_01 is byte-identical to the feat/db-setup parent.
- No frontend checks: no frontend changes.
- No remote/shared database changes, push or deployment.

This merge does not certify the incoming Identity feature for release. Existing
partial service code still needs its own security/policy delivery work, including
token logging/delivery, approved 48-hour/30-minute lifetimes, verification evidence,
safe API diagnostics, and complete session/recovery behavior. Those shortcomings
were not converted into feature-completion claims by resolving this merge.

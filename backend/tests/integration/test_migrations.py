import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory
from conftest import new_database
from sqlalchemy import inspect, text
from sqlalchemy.engine import URL

from app.db.config import DatabaseConfigurationError, database_engine
from app.db.metadata import migration_metadata
from app.db.recovery import (
    RecoveryError,
    backup,
    require_empty_target,
    restore,
    revision,
)

pytestmark = pytest.mark.integration
BACKEND = Path(__file__).resolve().parents[2]


def alembic(
    url: URL, *args: str, config: Path | None = None, success: bool = True
) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.update(
        {
            "LMS_ENV": "test",
            "MIGRATION_DATABASE_URL": url.render_as_string(hide_password=False),
        }
    )
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "alembic",
            "-c",
            str(config or BACKEND / "alembic.ini"),
            *args,
        ],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    if success and result.returncode:
        pytest.fail("Alembic failed: " + result.stdout + result.stderr, pytrace=False)
    return result


def test_fresh_upgrade_repeatability_revision_and_seed(
    disposable_database: URL,
) -> None:
    engine = database_engine(disposable_database)
    try:
        assert inspect(engine).get_table_names() == []
        alembic(disposable_database, "upgrade", "head")
        expected = ScriptDirectory.from_config(
            Config(str(BACKEND / "alembic.ini"))
        ).get_current_head()
        assert revision(disposable_database) == expected
        expected_tables = sorted(["alembic_version", *migration_metadata().tables])
        assert sorted(inspect(engine).get_table_names()) == expected_tables
        alembic(disposable_database, "check")
        # Synthetic test data, never a shipped domain table or production revision.
        with engine.begin() as connection:
            connection.execute(
                text(
                    "CREATE TABLE preservation_probe (id integer PRIMARY KEY, value text NOT NULL)"
                )
            )
            connection.execute(
                text("INSERT INTO preservation_probe VALUES (1, 'synthetic record')")
            )
        alembic(disposable_database, "upgrade", "head")
        current = alembic(disposable_database, "current", "--check-heads")
        assert expected in current.stdout + current.stderr
        for _ in range(2):
            result = subprocess.run(
                [sys.executable, "-m", "app.db.seed", "--environment", "test"],
                cwd=BACKEND,
                capture_output=True,
                text=True,
                check=True,
            )
            assert '"records_written": 0' in result.stdout
        with engine.connect() as connection:
            assert connection.execute(
                text("SELECT * FROM preservation_probe")
            ).all() == [(1, "synthetic record")]
            assert connection.scalar(text("SELECT count(*) FROM alembic_version")) == 1
        assert sorted(inspect(engine).get_table_names()) == sorted(
            [*expected_tables, "preservation_probe"]
        )
    finally:
        engine.dispose()


def test_live_connection_rechecks_environment_and_preserves_explicit_options(
    disposable_database: URL, monkeypatch: pytest.MonkeyPatch
) -> None:
    url = disposable_database.update_query_dict(
        {"sslmode": "disable", "connect_timeout": "7", "channel_binding": "disable"}
    )
    engine = database_engine(url)
    try:
        with engine.connect() as connection:
            original_search_path = connection.scalar(text("SHOW search_path"))
            assert connection.scalar(text("SELECT current_database()")) == url.database
        with monkeypatch.context() as ambient:
            ambient.setenv("PGHOSTADDR", "192.0.2.1")
            ambient.setenv("PGOPTIONS", "-c search_path=unintended_schema")
            with pytest.raises(DatabaseConfigurationError, match="Inherited"):
                engine.connect()
            rejected = alembic(url, "current", success=False)
            assert rejected.returncode != 0
            assert "Inherited PostgreSQL" in rejected.stdout + rejected.stderr
            assert "192.0.2.1" not in rejected.stdout + rejected.stderr
            assert "unintended_schema" not in rejected.stdout + rejected.stderr
        # NullPool creates a fresh physical connection after each close.
        with engine.connect() as connection:
            assert connection.scalar(text("SHOW search_path")) == original_search_path
            assert connection.scalar(text("SELECT current_database()")) == url.database
    finally:
        engine.dispose()


def test_failed_migration_rolls_back_ddl_data_and_revision(
    disposable_database: URL, tmp_path: Path
) -> None:
    alembic(disposable_database, "upgrade", "head")
    before = revision(disposable_database)
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "CREATE TABLE preservation_probe (id integer PRIMARY KEY, value text)"
                )
            )
            connection.execute(
                text("INSERT INTO preservation_probe VALUES (1, 'preserved')")
            )
        # Isolated copy only: intentional failing revision never enters shipped history.
        shutil.copytree(
            BACKEND / "alembic",
            tmp_path / "alembic",
            ignore=shutil.ignore_patterns("__pycache__"),
        )
        config = tmp_path / "alembic.ini"
        original = (BACKEND / "alembic.ini").read_text()
        config.write_text(
            original.replace(
                "prepend_sys_path = %(here)s",
                f"prepend_sys_path = {BACKEND.as_posix()}",
            )
        )
        (tmp_path / "alembic/versions/rollback_probe.py").write_text(f'''
from alembic import op
revision = "rollback_probe"
down_revision = "{before}"
branch_labels = None
depends_on = None
def upgrade():
    op.execute("CREATE TABLE rollback_probe (id integer PRIMARY KEY)")
    op.execute("UPDATE preservation_probe SET value = 'must roll back'")
    op.execute("INSERT INTO rollback_probe VALUES (1)")
    op.execute("INSERT INTO rollback_probe VALUES (1)")
def downgrade():
    pass
''')
        result = alembic(
            disposable_database, "upgrade", "head", config=config, success=False
        )
        assert result.returncode != 0
        assert "DB_MIGRATION_FAILED" in result.stderr
        assert "sqlstate=23505" in result.stderr
        assert "must roll back" not in result.stdout + result.stderr
        assert "Traceback" not in result.stdout + result.stderr
        assert revision(disposable_database) == before
        assert "rollback_probe" not in inspect(engine).get_table_names()
        with engine.connect() as connection:
            assert (
                connection.scalar(text("SELECT value FROM preservation_probe"))
                == "preserved"
            )
        alembic(disposable_database, "upgrade", "head")
    finally:
        engine.dispose()


def test_backup_restore_and_destination_guards(
    disposable_database: URL, postgres_admin_url: URL, tmp_path: Path
) -> None:
    if not os.environ.get("POSTGRES_BIN"):
        pytest.skip("POSTGRES_BIN absent; PostgreSQL 18 recovery tools required")
    alembic(disposable_database, "upgrade", "head")
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "CREATE TABLE recovery_probe (id integer PRIMARY KEY, value text NOT NULL)"
                )
            )
            connection.execute(
                text(
                    "INSERT INTO recovery_probe VALUES (1, 'synthetic recovery evidence')"
                )
            )
    finally:
        engine.dispose()
    archive = tmp_path / "baseline.dump"
    backup(archive, disposable_database)
    assert archive.read_bytes().startswith(b"PGDMP")
    with pytest.raises(RecoveryError, match="already exists"):
        backup(archive, disposable_database)
    with pytest.raises(RecoveryError, match="Source and destination"):
        restore(archive, disposable_database, str(disposable_database.database))
    with new_database(postgres_admin_url) as target:
        with pytest.raises(RecoveryError, match="confirm-target"):
            restore(archive, target, "wrong")
        restore(archive, target, str(target.database))
        assert revision(target) == revision(disposable_database)
        restored = database_engine(target)
        try:
            with restored.connect() as connection:
                assert connection.execute(
                    text("SELECT * FROM recovery_probe")
                ).all() == [(1, "synthetic recovery evidence")]
            with pytest.raises(RecoveryError, match="not empty"):
                restore(archive, target, str(target.database))
            with restored.connect() as connection:
                assert (
                    connection.scalar(text("SELECT count(*) FROM recovery_probe")) == 1
                )
        finally:
            restored.dispose()
    with new_database(postgres_admin_url) as target:
        occupied = database_engine(target)
        try:
            with occupied.begin() as connection:
                connection.execute(text("CREATE SCHEMA unrelated"))
            with pytest.raises(RecoveryError, match="not empty"):
                require_empty_target(target, str(target.database))
        finally:
            occupied.dispose()
    # A tampered archive must be rejected before connecting to a destination.
    with archive.open("ab") as stream:
        stream.write(b"tampered")
    with pytest.raises(RecoveryError, match="checksum"):
        restore(
            archive, disposable_database.set(database="unused_target"), "unused_target"
        )

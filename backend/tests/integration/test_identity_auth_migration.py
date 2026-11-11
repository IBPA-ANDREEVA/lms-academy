"""Run only via the project's isolated PostgreSQL-18 test harness."""

import os
import subprocess
import sys
from pathlib import Path
from uuid import uuid4

import pytest
from sqlalchemy import inspect, text
from sqlalchemy.engine import URL
from sqlalchemy.exc import IntegrityError

from app.db.config import database_engine

pytestmark = pytest.mark.integration
BACKEND = Path(__file__).resolve().parents[2]
PREVIOUS_HEAD = "20261106_02"
AUTH_HEAD = "20261110_01"
AUTH_TABLES = {
    "identity_credentials",
    "identity_sessions",
    "identity_action_tokens",
}


def run_alembic(
    url: URL, *args: str, success: bool = True
) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.update(
        {
            "LMS_ENV": "test",
            "MIGRATION_DATABASE_URL": url.render_as_string(hide_password=False),
        }
    )
    result = subprocess.run(
        [sys.executable, "-m", "alembic", *args],
        cwd=BACKEND,
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )
    if success and result.returncode:
        pytest.fail("Isolated Alembic check failed: " + result.stdout + result.stderr)
    return result


def current_revision(url: URL) -> str:
    engine = database_engine(url)
    try:
        with engine.connect() as connection:
            return str(
                connection.scalar(text("SELECT version_num FROM alembic_version"))
            )
    finally:
        engine.dispose()


def test_upgrade_preserves_existing_users_and_profiles(
    disposable_database: URL,
) -> None:
    run_alembic(disposable_database, "upgrade", PREVIOUS_HEAD)
    user_id = uuid4()
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "INSERT INTO users (id, email, status) VALUES (:id, :email, 'active')"
                ),
                {"id": user_id, "email": "existing-student@example.test"},
            )
            connection.execute(
                text("INSERT INTO profiles (user_id) VALUES (:id)"), {"id": user_id}
            )
        run_alembic(disposable_database, "upgrade", AUTH_HEAD)
        assert current_revision(disposable_database) == AUTH_HEAD
        assert AUTH_TABLES <= set(inspect(engine).get_table_names())
        with engine.connect() as connection:
            assert connection.scalar(text("SELECT COUNT(*) FROM users")) == 1
            assert connection.scalar(text("SELECT COUNT(*) FROM profiles")) == 1
        run_alembic(disposable_database, "check")
        run_alembic(disposable_database, "upgrade", "head")
        assert current_revision(disposable_database) == AUTH_HEAD
    finally:
        engine.dispose()


def test_constraints_and_multiple_devices(disposable_database: URL) -> None:
    run_alembic(disposable_database, "upgrade", AUTH_HEAD)
    user_id = uuid4()
    second_user = uuid4()
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "INSERT INTO users (id, email, status) VALUES (:id, :email, 'active')"
                ),
                {"id": user_id, "email": "student@example.test"},
            )
            connection.execute(
                text(
                    "INSERT INTO users (id, email, status) VALUES (:id, :email, 'active')"
                ),
                {"id": second_user, "email": "trainer@example.test"},
            )
            connection.execute(
                text(
                    "INSERT INTO identity_credentials (user_id, password_hash) "
                    "VALUES (:id, :hash)"
                ),
                {"id": user_id, "hash": "$argon2id$synthetic-not-a-valid-hash"},
            )
            for digest in (b"a" * 32, b"b" * 32):
                connection.execute(
                    text("""
                        INSERT INTO identity_sessions
                            (id, user_id, secret_digest, absolute_expires_at)
                        VALUES (:id, :user_id, :digest, now() + interval '30 days')
                    """),
                    {"id": uuid4(), "user_id": user_id, "digest": digest},
                )
            connection.execute(
                text("""
                    INSERT INTO identity_action_tokens
                        (id, user_id, purpose, secret_digest, expires_at)
                    VALUES (:id, :user_id, 'verify_email', :digest,
                            now() + interval '48 hours')
                """),
                {"id": uuid4(), "user_id": user_id, "digest": b"c" * 32},
            )
        with engine.connect() as connection:
            assert (
                connection.scalar(
                    text("SELECT COUNT(*) FROM identity_sessions WHERE user_id=:id"),
                    {"id": user_id},
                )
                == 2
            )

        invalid_cases = (
            (
                "INSERT INTO identity_sessions "
                "(id, user_id, secret_digest, absolute_expires_at) "
                "VALUES (:id,:user_id,:digest,now() + interval '30 days')",
                {"id": uuid4(), "user_id": user_id, "digest": b"short"},
                "23514",
            ),
            (
                "INSERT INTO identity_sessions "
                "(id, user_id, secret_digest, absolute_expires_at) "
                "VALUES (:id,:user_id,:digest,now() + interval '30 days')",
                {"id": uuid4(), "user_id": second_user, "digest": b"a" * 32},
                "23505",
            ),
            (
                "INSERT INTO identity_action_tokens "
                "(id, user_id, purpose, secret_digest, expires_at) "
                "VALUES (:id,:user_id,'   ',:digest,now() + interval '48 hours')",
                {"id": uuid4(), "user_id": user_id, "digest": b"d" * 32},
                "23514",
            ),
            (
                "INSERT INTO identity_credentials (user_id, password_hash) "
                "VALUES (:id, 'hash')",
                {"id": uuid4()},
                "23503",
            ),
        )
        for sql, params, expected_sqlstate in invalid_cases:
            with pytest.raises(IntegrityError) as exc_info, engine.begin() as conn:
                conn.execute(text(sql), params)
            assert getattr(exc_info.value.orig, "sqlstate", None) == expected_sqlstate
    finally:
        engine.dispose()


def test_downgrade_refuses_data_loss_and_empty_roundtrip(
    disposable_database: URL,
) -> None:
    run_alembic(disposable_database, "upgrade", AUTH_HEAD)
    user_id = uuid4()
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "INSERT INTO users (id, email, status) VALUES (:id, :email, 'active')"
                ),
                {"id": user_id, "email": "preserve@example.test"},
            )
            connection.execute(
                text(
                    "INSERT INTO identity_credentials (user_id, password_hash) "
                    "VALUES (:id, 'synthetic-hash')"
                ),
                {"id": user_id},
            )
        rejected = run_alembic(
            disposable_database, "downgrade", PREVIOUS_HEAD, success=False
        )
        assert rejected.returncode != 0
        assert current_revision(disposable_database) == AUTH_HEAD
        assert AUTH_TABLES <= set(inspect(engine).get_table_names())
        with engine.begin() as connection:
            assert (
                connection.scalar(text("SELECT COUNT(*) FROM identity_credentials"))
                == 1
            )
            connection.execute(text("DELETE FROM identity_credentials"))

        run_alembic(disposable_database, "downgrade", PREVIOUS_HEAD)
        assert current_revision(disposable_database) == PREVIOUS_HEAD
        assert not AUTH_TABLES.intersection(inspect(engine).get_table_names())
        with engine.connect() as connection:
            assert connection.scalar(text("SELECT COUNT(*) FROM users")) == 1
        run_alembic(disposable_database, "upgrade", AUTH_HEAD)
        assert AUTH_TABLES <= set(inspect(engine).get_table_names())
    finally:
        engine.dispose()


def test_pending_default_and_downgrade_preserve_accounts(
    disposable_database: URL,
) -> None:
    run_alembic(disposable_database, "upgrade", "20261109_01")
    existing_id, pending_id = uuid4(), uuid4()
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            connection.execute(
                text("INSERT INTO users (id, email) VALUES (:id, :email)"),
                {"id": existing_id, "email": "existing@example.test"},
            )
        run_alembic(disposable_database, "upgrade", AUTH_HEAD)
        with engine.begin() as connection:
            assert (
                connection.scalar(
                    text("SELECT status::text FROM users WHERE id=:id"),
                    {"id": existing_id},
                )
                == "active"
            )
            connection.execute(
                text("INSERT INTO users (id, email) VALUES (:id, :email)"),
                {"id": pending_id, "email": "pending@example.test"},
            )
            assert (
                connection.scalar(
                    text("SELECT status::text FROM users WHERE id=:id"),
                    {"id": pending_id},
                )
                == "pending"
            )
        run_alembic(disposable_database, "downgrade", "20261109_01", success=False)
        assert current_revision(disposable_database) == AUTH_HEAD
        with engine.begin() as connection:
            assert connection.scalar(text("SELECT count(*) FROM users")) == 2
            connection.execute(
                text("UPDATE users SET status='active' WHERE id=:id"),
                {"id": pending_id},
            )
        run_alembic(disposable_database, "downgrade", "20261109_01")
        run_alembic(disposable_database, "upgrade", AUTH_HEAD)
        run_alembic(disposable_database, "check")
    finally:
        engine.dispose()

"""Only create/drop databases minted in this test run; never reset a supplied DB."""

import os
from collections.abc import Iterator
from contextlib import contextmanager
from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.pool import NullPool

from app.db.config import DatabaseConfigurationError, database_url


@pytest.fixture(scope="session")
def postgres_admin_url() -> URL:
    if not os.environ.get("TEST_POSTGRES_ADMIN_URL"):
        pytest.skip(
            "TEST_POSTGRES_ADMIN_URL absent; use scripts/verify_postgres.py for isolation"
        )
    if (
        os.environ.get("TEST_POSTGRES_ALLOW_CREATE_DATABASE")
        != "create-new-databases-only"
    ):
        pytest.fail(
            "Explicit TEST_POSTGRES_ALLOW_CREATE_DATABASE authorization is required"
        )
    try:
        return database_url("TEST_POSTGRES_ADMIN_URL")
    except DatabaseConfigurationError as exc:
        pytest.fail(str(exc))


@contextmanager
def new_database(admin_url: URL) -> Iterator[URL]:
    name = "base02_" + uuid4().hex
    engine = create_engine(
        admin_url,
        isolation_level="AUTOCOMMIT",
        poolclass=NullPool,
        hide_parameters=True,
        connect_args={"connect_timeout": 10},
    )
    created = False
    try:
        try:
            with engine.connect() as connection:
                # Identifier consists only of our constant prefix and UUID hex.
                connection.execute(text(f'CREATE DATABASE "{name}" TEMPLATE template0'))
                created = True
        except SQLAlchemyError:
            pytest.fail(
                "Could not create disposable database; verify test credentials/CREATEDB",
                pytrace=False,
            )
        yield admin_url.set(database=name)
    finally:
        try:
            if created:
                with engine.connect() as connection:
                    connection.execute(text(f'DROP DATABASE "{name}"'))
        except SQLAlchemyError:
            pytest.fail(
                "Disposable database cleanup failed; inspect this test server",
                pytrace=False,
            )
        finally:
            engine.dispose()


@pytest.fixture
def disposable_database(postgres_admin_url: URL) -> Iterator[URL]:
    with new_database(postgres_admin_url) as url:
        yield url

"""Bounded, synchronous development units of work; no import-time connections."""

import os
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass, field

import psycopg
from sqlalchemy import create_engine, event
from sqlalchemy.engine import URL
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import ConnectionPoolEntry

from app.db.config import (
    DatabaseConfigurationError,
    database_url,
    require_clean_pg_environment,
)


@dataclass(frozen=True)
class ApplicationDatabaseSettings:
    """Explicit non-production target; labels cannot prove remote branch identity."""

    url: URL = field(repr=False)

    @classmethod
    def from_environment(cls) -> "ApplicationDatabaseSettings":
        if os.environ.get("LMS_ENV") not in {"development", "test"}:
            raise DatabaseConfigurationError(
                "Application database foundation permits development/test only."
            )
        url = database_url("DATABASE_URL")
        if url.host in {"localhost", "127.0.0.1", "::1"}:
            if url.database != "lms_dev" and not (url.database or "").startswith(
                "base02_"
            ):
                raise DatabaseConfigurationError(
                    "Select an isolated local LMS database."
                )
        elif (
            os.environ.get("DATABASE_NONPRODUCTION_HOST") != url.host
            or os.environ.get("DATABASE_NONPRODUCTION_NAME") != url.database
            or url.query.get("sslmode") not in {"require", "verify-full"}
        ):
            raise DatabaseConfigurationError(
                "Confirm the non-production endpoint/name and require TLS."
            )
        return cls(url=url)


def _configure_connection(
    connection: psycopg.Connection[tuple[object, ...]], _record: ConnectionPoolEntry
) -> None:
    # Fixed technical settings, never user input or ambient PGOPTIONS.
    with connection.cursor() as cursor:
        cursor.execute("SET TIME ZONE 'America/Los_Angeles'")
        cursor.execute("SET statement_timeout = '30s'")
        cursor.execute("SET lock_timeout = '5s'")
        cursor.execute("SET idle_in_transaction_session_timeout = '60s'")
    connection.commit()


class ApplicationDatabase:
    """One instance per process; dispose at shutdown. One session per unit of work."""

    def __init__(self, settings: ApplicationDatabaseSettings) -> None:
        self.engine = create_engine(
            settings.url.set(port=settings.url.port or 5432),
            pool_size=5,
            max_overflow=0,
            pool_timeout=10,
            pool_recycle=1800,
            pool_pre_ping=True,
            hide_parameters=True,
            connect_args={
                "connect_timeout": settings.url.query.get("connect_timeout", "10"),
                "passfile": os.devnull,
            },
        )
        event.listen(self.engine, "do_connect", require_clean_pg_environment)
        event.listen(self.engine, "connect", _configure_connection)
        self.sessions = sessionmaker(
            self.engine, expire_on_commit=False, autobegin=False
        )

    @contextmanager
    def unit_of_work(self) -> Iterator[Session]:
        """The caller owns the transaction; participants must not commit it."""
        with self.sessions.begin() as session:
            yield session

    def dispose(self) -> None:
        self.engine.dispose()

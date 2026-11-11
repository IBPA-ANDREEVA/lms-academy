"""Application database connections; migrations use separate credentials."""

import os
from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from app.db.config import (
    database_url,
    require_clean_pg_environment,
)


@lru_cache(maxsize=1)
def get_runtime_engine() -> Engine:
    """Create one bounded connection pool per API process."""
    url = database_url("DATABASE_URL")

    engine = create_engine(
        url.set(port=url.port or 5432),
        pool_size=2,
        max_overflow=0,
        pool_timeout=10,
        pool_pre_ping=True,
        hide_parameters=True,
        connect_args={
            "connect_timeout": url.query.get("connect_timeout", "10"),
            "passfile": os.devnull,
        },
    )

    event.listen(
        engine,
        "do_connect",
        require_clean_pg_environment,
    )
    return engine


def get_session() -> Iterator[Session]:
    """Provide a fresh session; the operation owns commits."""
    with Session(get_runtime_engine()) as session:
        yield session

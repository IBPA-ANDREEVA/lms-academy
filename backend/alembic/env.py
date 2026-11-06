"""Operator-run migrations, never invoked by API or worker startup."""

import logging
import os
from logging.config import fileConfig

from alembic.util import CommandError
from sqlalchemy import create_engine, pool
from sqlalchemy.exc import DBAPIError

from alembic import context
from app.db.config import DatabaseConfigurationError, database_url, require_environment
from app.db.metadata import migration_metadata

config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name, disable_existing_loggers=False)


def run_migrations() -> None:
    require_environment(os.environ.get("LMS_ENV"))
    url = database_url("MIGRATION_DATABASE_URL")
    metadata = migration_metadata()
    if context.is_offline_mode():
        context.configure(
            url=url,
            target_metadata=metadata,
            literal_binds=True,
            dialect_opts={"paramstyle": "named"},
            transactional_ddl=True,
            transaction_per_migration=False,
        )
        with context.begin_transaction():
            context.run_migrations()
        return

    engine = create_engine(
        url,
        poolclass=pool.NullPool,
        hide_parameters=True,
        connect_args={"connect_timeout": 10},
    )
    try:
        with engine.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=metadata,
                compare_type=True,
                transactional_ddl=True,
                transaction_per_migration=False,
            )
            # Transactional DDL and revision bookkeeping commit together.
            # Explicit autocommit operations need a separate recovery plan.
            with context.begin_transaction():
                context.run_migrations()
    finally:
        engine.dispose()


try:
    run_migrations()
except DatabaseConfigurationError as exc:
    raise CommandError(str(exc)) from None
except Exception as exc:
    # Driver messages/SQL may contain credentials or data. Emit only safe codes.
    state = getattr(exc.orig, "sqlstate", None) if isinstance(exc, DBAPIError) else None
    logging.getLogger("alembic.env").error(
        "code=DB_MIGRATION_FAILED error_type=%s sqlstate=%s",
        type(exc).__name__,
        state,
    )
    raise CommandError(
        "Database operation failed. Check the selected environment and revision history; "
        "transactional changes were rolled back. See the migration recovery runbook."
    ) from None

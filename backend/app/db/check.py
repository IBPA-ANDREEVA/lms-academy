"""Read-only database connectivity test."""

from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

from app.db.config import DatabaseConfigurationError
from app.db.runtime import get_runtime_engine


def main() -> None:
    engine: Engine | None = None

    try:
        engine = get_runtime_engine()

        with engine.connect() as connection:
            database_name: str = str(
                connection.execute(text("SELECT current_database()")).scalar_one()
            )

        print(f"Database connection OK: {database_name}")

    except (DatabaseConfigurationError, SQLAlchemyError, OSError):
        print(
            "Database connection failed. "
            "Check the development endpoint and credentials."
        )
        raise SystemExit(1) from None

    finally:
        if engine is not None:
            engine.dispose()


if __name__ == "__main__":
    main()

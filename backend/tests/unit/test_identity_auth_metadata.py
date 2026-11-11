"""Pure metadata checks; do not require PostgreSQL credentials."""

from sqlalchemy import CheckConstraint, ForeignKeyConstraint, create_mock_engine
from sqlalchemy.schema import CreateTable

from app.db.metadata import migration_metadata


def test_identity_auth_models_are_explicitly_registered() -> None:
    metadata = migration_metadata()
    dialect = create_mock_engine(
        "postgresql+psycopg://", lambda *_args, **_kwargs: None
    ).dialect
    for table_name in (
        "users",
        "profiles",
        "identity_credentials",
        "identity_sessions",
        "identity_action_tokens",
    ):
        assert table_name in metadata.tables
    for table_name in (
        "identity_credentials",
        "identity_sessions",
        "identity_action_tokens",
    ):
        table = metadata.tables[table_name]
        assert any(
            isinstance(fk, ForeignKeyConstraint)
            and fk.referred_table.name == "users"
            and fk.ondelete == "RESTRICT"
            for fk in table.constraints
        )
        sql = str(CreateTable(table).compile(dialect=dialect))
        assert "CREATE TABLE" in sql
        assert any(isinstance(check, CheckConstraint) for check in table.constraints)

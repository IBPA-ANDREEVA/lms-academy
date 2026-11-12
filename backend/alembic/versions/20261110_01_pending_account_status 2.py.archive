"""Reconcile pending account status without rewriting applied migrations.

Revision ID: 20261110_01
Revises: 20261109_01

Existing account statuses remain unchanged. Replace the enum transactionally so
the new default can be used during the same upgrade transaction.
"""

from alembic import op

revision = "20261110_01"
down_revision = "20261109_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE users ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TYPE account_status RENAME TO account_status_previous")
    op.execute("CREATE TYPE account_status AS ENUM ('active', 'blocked', 'pending')")
    op.execute(
        "ALTER TABLE users ALTER COLUMN status TYPE account_status "
        "USING status::text::account_status"
    )
    op.execute("ALTER TABLE users ALTER COLUMN status SET DEFAULT 'pending'")
    op.execute("DROP TYPE account_status_previous")


def downgrade() -> None:
    op.execute("LOCK TABLE users IN ACCESS EXCLUSIVE MODE")
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM users WHERE status = 'pending') THEN
                RAISE EXCEPTION 'PENDING_ACCOUNT_DOWNGRADE_REQUIRES_NO_PENDING_USERS';
            END IF;
        END $$
    """)
    op.execute("ALTER TABLE users ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TYPE account_status RENAME TO account_status_pending")
    op.execute("CREATE TYPE account_status AS ENUM ('active', 'blocked')")
    op.execute(
        "ALTER TABLE users ALTER COLUMN status TYPE account_status "
        "USING status::text::account_status"
    )
    op.execute("ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active'")
    op.execute("DROP TYPE account_status_pending")

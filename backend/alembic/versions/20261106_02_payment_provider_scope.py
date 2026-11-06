"""Keep payment identity unique within its provider, not across providers.

Revision ID: 20261106_02
Revises: 20261106_01

Live drift verification found an extra single-column unique constraint in the
initial revision. Preserve that applied local history and repair additively.
No data changes. Downgrade may reject newly valid cross-provider duplicate IDs;
PostgreSQL rolls back the constraint/revision change without deleting records.
"""

from alembic import op

revision = "20261106_02"
down_revision = "20261106_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("uq_payments_provider_payment_id", "payments", type_="unique")


def downgrade() -> None:
    op.create_unique_constraint(
        "uq_payments_provider_payment_id", "payments", ["provider_payment_id"]
    )

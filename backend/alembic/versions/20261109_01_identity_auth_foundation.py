"""Add credential, revocable session and single-use action-token storage.

Revision ID: 20261109_01
Revises: 20261106_02

Existing business tables remain unchanged. This is storage, not working login.
Downgrade refuses to discard populated authentication evidence.
"""

import sqlalchemy as sa

from alembic import op

revision = "20261109_01"
down_revision = "20261106_02"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "identity_credentials",
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "length(btrim(password_hash)) > 0",
            name=op.f("ck_identity_credentials_hash_nonblank"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_identity_credentials_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("user_id", name=op.f("pk_identity_credentials")),
    )

    op.create_table(
        "identity_sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("secret_digest", sa.LargeBinary(length=32), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "last_interaction_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("absolute_expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "password_reauthenticated_at", sa.DateTime(timezone=True), nullable=True
        ),
        sa.CheckConstraint(
            "octet_length(secret_digest) = 32",
            name=op.f("ck_identity_sessions_digest_length"),
        ),
        sa.CheckConstraint(
            "absolute_expires_at > created_at",
            name=op.f("ck_identity_sessions_positive_lifetime"),
        ),
        sa.CheckConstraint(
            "last_interaction_at >= created_at",
            name=op.f("ck_identity_sessions_interaction_after_creation"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_identity_sessions_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_identity_sessions")),
        sa.UniqueConstraint(
            "secret_digest", name=op.f("uq_identity_sessions_secret_digest")
        ),
    )
    op.create_index(
        op.f("ix_identity_sessions_user_id"), "identity_sessions", ["user_id"]
    )

    op.create_table(
        "identity_action_tokens",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("purpose", sa.String(length=48), nullable=False),
        sa.Column("secret_digest", sa.LargeBinary(length=32), nullable=False),
        sa.Column("target_email", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "length(btrim(purpose)) > 0",
            name=op.f("ck_identity_action_tokens_purpose_nonblank"),
        ),
        sa.CheckConstraint(
            "octet_length(secret_digest) = 32",
            name=op.f("ck_identity_action_tokens_digest_length"),
        ),
        sa.CheckConstraint(
            "expires_at > created_at",
            name=op.f("ck_identity_action_tokens_positive_lifetime"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_identity_action_tokens_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_identity_action_tokens")),
        sa.UniqueConstraint(
            "secret_digest", name=op.f("uq_identity_action_tokens_secret_digest")
        ),
    )
    op.create_index(
        "ix_identity_action_tokens_user_purpose",
        "identity_action_tokens",
        ["user_id", "purpose"],
    )


def downgrade() -> None:
    # Lock and check in one transaction: no concurrent inserts can race the drop.
    op.execute("""
        DO $$ BEGIN
            LOCK TABLE identity_action_tokens, identity_sessions,
                       identity_credentials IN ACCESS EXCLUSIVE MODE;
            IF EXISTS (SELECT 1 FROM identity_action_tokens)
                OR EXISTS (SELECT 1 FROM identity_sessions)
                OR EXISTS (SELECT 1 FROM identity_credentials)
            THEN
                RAISE EXCEPTION 'IDENTITY_AUTH_DOWNGRADE_REQUIRES_EMPTY_TABLES';
            END IF;
        END $$
    """)
    op.drop_index(
        "ix_identity_action_tokens_user_purpose",
        table_name="identity_action_tokens",
    )
    op.drop_table("identity_action_tokens")
    op.drop_index(op.f("ix_identity_sessions_user_id"), table_name="identity_sessions")
    op.drop_table("identity_sessions")
    op.drop_table("identity_credentials")

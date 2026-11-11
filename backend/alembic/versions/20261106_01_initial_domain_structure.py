"""Reviewed initial domain structure; see database/schema-contract.md.

No data is seeded. Upgrade is additive from the immutable empty baseline.
Downgrade refuses populated tables, and never uses CASCADE. No live model imports.

Revision ID: 20261106_01
Revises: 5c9789a48cba
Create Date: 2026-11-06 14:38:17.290847

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20261106_01"
down_revision: str | Sequence[str] | None = "5c9789a48cba"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    postgresql.ENUM("active", "blocked", "pending", name="account_status").create(
        op.get_bind(), checkfirst=False
    )
    postgresql.ENUM("course", "miniCourse", name="course_type").create(
        op.get_bind(), checkfirst=False
    )
    postgresql.ENUM("image", "pdf", "document", "archive", name="lesson_doc").create(
        op.get_bind(), checkfirst=False
    )
    postgresql.ENUM("ru", "en", name="locale").create(op.get_bind(), checkfirst=False)
    postgresql.ENUM("web", "email", name="notification_channel").create(
        op.get_bind(), checkfirst=False
    )
    postgresql.ENUM("2", "3", "6", name="package_type").create(
        op.get_bind(), checkfirst=False
    )
    postgresql.ENUM("student", "trainer", "manager", "admin", name="user_role").create(
        op.get_bind(), checkfirst=False
    )
    op.create_table(
        "categories",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_categories")),
    )
    op.create_table(
        "packages",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "type",
            postgresql.ENUM("2", "3", "6", name="package_type", create_type=False),
            nullable=True,
        ),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.CheckConstraint("currency = 'USD'", name=op.f("ck_packages_currency_usd")),
        sa.CheckConstraint(
            "price_cents >= 0", name=op.f("ck_packages_price_nonnegative")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_packages")),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column(
            "roles",
            postgresql.ARRAY(
                postgresql.ENUM(
                    "student",
                    "trainer",
                    "manager",
                    "admin",
                    name="user_role",
                    create_type=False,
                )
            ),
            server_default=sa.text("ARRAY['student']::user_role[]"),
            nullable=False,
        ),
        sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("referral_code", sa.String(length=50), nullable=True),
        sa.Column(
            "status",
            postgresql.ENUM(
                "active", "blocked", name="account_status", create_type=False
            ),
            server_default=sa.text("'active'"),
            nullable=False,
        ),
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
            "coalesce(array_ndims(roles), 1) = 1 AND array_position(roles, NULL) IS NULL AND cardinality(roles) = ((roles @> ARRAY['student']::user_role[])::int + (roles @> ARRAY['trainer']::user_role[])::int + (roles @> ARRAY['manager']::user_role[])::int + (roles @> ARRAY['admin']::user_role[])::int)",
            name=op.f("ck_users_roles_set"),
        ),
        sa.CheckConstraint(
            "length(btrim(email)) > 0", name=op.f("ck_users_email_nonblank")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_users")),
    )
    op.create_index(
        "uq_users_email_ci", "users", [sa.literal_column("lower(email)")], unique=True
    )
    op.create_index(
        "uq_users_referral_code_ci",
        "users",
        [sa.literal_column("lower(referral_code)")],
        unique=True,
    )
    op.create_table(
        "certificate_templates",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column(
            "locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            nullable=False,
        ),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("template_key", sa.Text(), nullable=False),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("approved_by", sa.Uuid(), nullable=True),
        sa.Column("issuer_identity", sa.Text(), nullable=True),
        sa.CheckConstraint(
            "(approved_at IS NULL AND approved_by IS NULL AND issuer_identity IS NULL) OR (approved_at IS NOT NULL AND approved_by IS NOT NULL AND issuer_identity IS NOT NULL AND length(btrim(issuer_identity)) > 0)",
            name=op.f("ck_certificate_templates_approval_evidence"),
        ),
        sa.CheckConstraint(
            "version > 0", name=op.f("ck_certificate_templates_version_positive")
        ),
        sa.ForeignKeyConstraint(
            ["approved_by"],
            ["users.id"],
            name=op.f("fk_certificate_templates_approved_by_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_certificate_templates")),
        sa.UniqueConstraint("id", "locale", name="uq_certificate_templates_id_locale"),
        sa.UniqueConstraint(
            "name", "locale", "version", name=op.f("uq_certificate_templates_name")
        ),
    )
    op.create_table(
        "courses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("category_id", sa.Uuid(), nullable=True),
        sa.Column("trainer_id", sa.Uuid(), nullable=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("author", sa.Text(), nullable=True),
        sa.Column(
            "locales",
            postgresql.ARRAY(
                postgresql.ENUM("ru", "en", name="locale", create_type=False)
            ),
            nullable=True,
        ),
        sa.Column("price_cents", sa.BigInteger(), nullable=True),
        sa.Column(
            "type",
            postgresql.ENUM(
                "course", "miniCourse", name="course_type", create_type=False
            ),
            nullable=False,
        ),
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
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.Column(
            "is_visible", sa.Boolean(), server_default=sa.text("false"), nullable=False
        ),
        sa.Column(
            "is_for_sale", sa.Boolean(), server_default=sa.text("false"), nullable=False
        ),
        sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("content_approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("price_approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("currency = 'USD'", name=op.f("ck_courses_currency_usd")),
        sa.CheckConstraint(
            "price_cents IS NULL OR price_cents >= 0",
            name=op.f("ck_courses_price_nonnegative"),
        ),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["categories.id"],
            name=op.f("fk_courses_category_id_categories"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["trainer_id"],
            ["users.id"],
            name=op.f("fk_courses_trainer_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_courses")),
    )
    op.create_table(
        "notifications",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("type", sa.Text(), nullable=False),
        sa.Column(
            "channel",
            postgresql.ENUM(
                "web", "email", name="notification_channel", create_type=False
            ),
            nullable=False,
        ),
        sa.Column(
            "status", sa.Text(), server_default=sa.text("'pending'"), nullable=False
        ),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("action_url", sa.Text(), nullable=True),
        sa.Column(
            "attachments", postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
        sa.Column(
            "attempt_count", sa.Integer(), server_default=sa.text("0"), nullable=False
        ),
        sa.Column("deduplication_key", sa.Text(), nullable=False),
        sa.Column("next_retry_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_error_code", sa.Text(), nullable=True),
        sa.Column("provider_message_id", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("event_key", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "attempt_count >= 0", name=op.f("ck_notifications_attempts_nonnegative")
        ),
        sa.CheckConstraint(
            "length(btrim(deduplication_key)) > 0 AND length(btrim(event_key)) > 0",
            name=op.f("ck_notifications_dedup_nonblank"),
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_notifications_status_nonblank")
        ),
        sa.CheckConstraint(
            "length(btrim(type)) > 0", name=op.f("ck_notifications_type_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_notifications_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_notifications")),
        sa.UniqueConstraint(
            "deduplication_key", name=op.f("uq_notifications_deduplication_key")
        ),
        sa.UniqueConstraint(
            "event_key", "user_id", "channel", name=op.f("uq_notifications_event_key")
        ),
    )
    op.create_table(
        "orders",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=True),
        sa.Column("subtotal_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "discount_cents",
            sa.BigInteger(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column("total_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("policy", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
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
        sa.CheckConstraint("currency = 'USD'", name=op.f("ck_orders_currency_usd")),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_orders_status_nonblank")
        ),
        sa.CheckConstraint(
            "subtotal_cents >= 0 AND discount_cents >= 0 AND total_cents >= 0",
            name=op.f("ck_orders_money_nonnegative"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_orders_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_orders")),
    )
    op.create_table(
        "profiles",
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("first_name", sa.String(length=100), nullable=True),
        sa.Column("last_name", sa.String(length=100), nullable=True),
        sa.Column("phone", sa.String(length=30), nullable=True),
        sa.Column(
            "preferred_locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            server_default=sa.text("'ru'"),
            nullable=False,
        ),
        sa.Column("avatar_key", sa.Text(), nullable=True),
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
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_profiles_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("user_id", name=op.f("pk_profiles")),
    )
    op.create_table(
        "course_localizations",
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column(
            "locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            nullable=False,
        ),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(
            ["course_id"],
            ["courses.id"],
            name=op.f("fk_course_localizations_course_id_courses"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint(
            "course_id", "locale", name=op.f("pk_course_localizations")
        ),
    )
    op.create_table(
        "modules",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.CheckConstraint(
            "position >= 0", name=op.f("ck_modules_position_nonnegative")
        ),
        sa.ForeignKeyConstraint(
            ["course_id"],
            ["courses.id"],
            name=op.f("fk_modules_course_id_courses"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_modules")),
        sa.UniqueConstraint("course_id", "position", name=op.f("uq_modules_course_id")),
        sa.UniqueConstraint("id", "course_id", name="uq_modules_id_course"),
    )
    op.create_table(
        "order_items",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("order_id", sa.Uuid(), nullable=False),
        sa.Column("package_id", sa.Uuid(), nullable=True),
        sa.Column("course_id", sa.Uuid(), nullable=True),
        sa.Column("title_snapshot", sa.Text(), nullable=False),
        sa.Column("price_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "discount_cents",
            sa.BigInteger(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column("total_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "currency = 'USD'", name=op.f("ck_order_items_currency_usd")
        ),
        sa.CheckConstraint(
            "(course_id IS NOT NULL AND package_id IS NULL) OR (course_id IS NULL AND package_id IS NOT NULL)",
            name=op.f("ck_order_items_one_product"),
        ),
        sa.CheckConstraint(
            "price_cents >= 0 AND discount_cents >= 0 AND total_cents >= 0",
            name=op.f("ck_order_items_money_nonnegative"),
        ),
        sa.ForeignKeyConstraint(
            ["course_id"],
            ["courses.id"],
            name=op.f("fk_order_items_course_id_courses"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            name=op.f("fk_order_items_order_id_orders"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["package_id"],
            ["packages.id"],
            name=op.f("fk_order_items_package_id_packages"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_order_items")),
        sa.UniqueConstraint("id", "order_id", name="uq_order_items_id_order"),
    )
    op.create_table(
        "package_courses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column("package_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(
            ["course_id"],
            ["courses.id"],
            name=op.f("fk_package_courses_course_id_courses"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["package_id"],
            ["packages.id"],
            name=op.f("fk_package_courses_package_id_packages"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_package_courses")),
        sa.UniqueConstraint(
            "package_id", "course_id", name=op.f("uq_package_courses_package_id")
        ),
    )
    op.create_table(
        "payments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("order_id", sa.Uuid(), nullable=False),
        sa.Column(
            "provider", sa.Text(), server_default=sa.text("'stripe'"), nullable=False
        ),
        sa.Column("provider_payment_id", sa.Text(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("amount_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("currency = 'USD'", name=op.f("ck_payments_currency_usd")),
        sa.CheckConstraint(
            "amount_cents >= 0", name=op.f("ck_payments_amount_nonnegative")
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_payments_status_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            name=op.f("fk_payments_order_id_orders"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_payments")),
        sa.UniqueConstraint("id", "order_id", name="uq_payments_id_order"),
        sa.UniqueConstraint(
            "provider", "provider_payment_id", name=op.f("uq_payments_provider")
        ),
        sa.UniqueConstraint(
            "provider_payment_id", name=op.f("uq_payments_provider_payment_id")
        ),
    )
    op.create_table(
        "enrollments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column("order_item_id", sa.Uuid(), nullable=True),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("granted_by", sa.Uuid(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("activated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("access_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("support_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("grant_reason", sa.Text(), nullable=True),
        sa.Column("granted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "(order_item_id IS NULL AND granted_by IS NOT NULL AND grant_reason IS NOT NULL AND length(btrim(grant_reason)) > 0 AND granted_at IS NOT NULL) OR (order_item_id IS NOT NULL AND granted_by IS NULL AND grant_reason IS NULL AND granted_at IS NULL)",
            name=op.f("ck_enrollments_source_provenance"),
        ),
        sa.CheckConstraint(
            "activated_at IS NOT NULL OR (access_expires_at IS NULL AND support_expires_at IS NULL)",
            name=op.f("ck_enrollments_activation_before_deadlines"),
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_enrollments_status_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["course_id"],
            ["courses.id"],
            name=op.f("fk_enrollments_course_id_courses"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["granted_by"],
            ["users.id"],
            name=op.f("fk_enrollments_granted_by_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["order_item_id"],
            ["order_items.id"],
            name=op.f("fk_enrollments_order_item_id_order_items"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_enrollments_user_id_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_enrollments")),
        sa.UniqueConstraint("id", "course_id", name="uq_enrollments_id_course"),
        sa.UniqueConstraint("id", "user_id", name="uq_enrollments_id_user"),
        sa.UniqueConstraint(
            "order_item_id", "course_id", name=op.f("uq_enrollments_order_item_id")
        ),
    )
    op.create_table(
        "lessons",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("module_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.CheckConstraint(
            "position >= 0", name=op.f("ck_lessons_position_nonnegative")
        ),
        sa.ForeignKeyConstraint(
            ["module_id", "course_id"],
            ["modules.id", "modules.course_id"],
            name="fk_lessons_module_course",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_lessons")),
        sa.UniqueConstraint("id", "course_id", name="uq_lessons_id_course"),
        sa.UniqueConstraint("module_id", "position", name=op.f("uq_lessons_module_id")),
    )
    op.create_table(
        "payment_events",
        sa.Column("provider_event_id", sa.Text(), nullable=False),
        sa.Column("payment_id", sa.Uuid(), nullable=True),
        sa.Column("event_type", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column(
            "received_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_payment_events_status_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["payment_id"],
            ["payments.id"],
            name=op.f("fk_payment_events_payment_id_payments"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("provider_event_id", name=op.f("pk_payment_events")),
    )
    op.create_table(
        "refunds",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("order_id", sa.Uuid(), nullable=False),
        sa.Column("payment_id", sa.Uuid(), nullable=False),
        sa.Column("order_item_id", sa.Uuid(), nullable=True),
        sa.Column("amount_cents", sa.BigInteger(), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default=sa.text("'USD'"),
            nullable=False,
        ),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("provider_refund_id", sa.Text(), nullable=True),
        sa.Column(
            "requested_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("request_key", sa.Text(), nullable=False),
        sa.CheckConstraint("currency = 'USD'", name=op.f("ck_refunds_currency_usd")),
        sa.CheckConstraint("amount_cents > 0", name=op.f("ck_refunds_amount_positive")),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_refunds_status_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            name=op.f("fk_refunds_order_id_orders"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["order_item_id", "order_id"],
            ["order_items.id", "order_items.order_id"],
            name="fk_refunds_item_order",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["payment_id", "order_id"],
            ["payments.id", "payments.order_id"],
            name="fk_refunds_payment_order",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_refunds")),
        sa.UniqueConstraint(
            "provider_refund_id", name=op.f("uq_refunds_provider_refund_id")
        ),
        sa.UniqueConstraint("request_key", name=op.f("uq_refunds_request_key")),
    )
    op.create_table(
        "assignments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "attachments", postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
        sa.Column(
            "is_required", sa.Boolean(), server_default=sa.text("true"), nullable=False
        ),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(
            ["lesson_id", "course_id"],
            ["lessons.id", "lessons.course_id"],
            name="fk_assignments_lesson_course",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_assignments")),
        sa.UniqueConstraint("id", "course_id", name="uq_assignments_id_course"),
    )
    op.create_table(
        "certificate_requests",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("requested_by", sa.Uuid(), nullable=True),
        sa.Column("reviewed_by", sa.Uuid(), nullable=True),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("review_comment", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "length(btrim(status)) > 0",
            name=op.f("ck_certificate_requests_status_nonblank"),
        ),
        sa.ForeignKeyConstraint(
            ["enrollment_id"],
            ["enrollments.id"],
            name=op.f("fk_certificate_requests_enrollment_id_enrollments"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["requested_by"],
            ["users.id"],
            name=op.f("fk_certificate_requests_requested_by_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["reviewed_by"],
            ["users.id"],
            name=op.f("fk_certificate_requests_reviewed_by_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_certificate_requests")),
        sa.UniqueConstraint(
            "id", "enrollment_id", name="uq_certificate_requests_id_enrollment"
        ),
    )
    op.create_table(
        "course_messages",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("sent_by", sa.Uuid(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("attachment_key", sa.Text(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("edited_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "status IN ('draft', 'sent', 'failed')",
            name=op.f("ck_course_messages_delivery_status"),
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_course_messages_status_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["enrollment_id"],
            ["enrollments.id"],
            name=op.f("fk_course_messages_enrollment_id_enrollments"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["sent_by"],
            ["users.id"],
            name=op.f("fk_course_messages_sent_by_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_course_messages")),
    )
    op.create_table(
        "lesson_docs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=True),
        sa.Column("storage_key", sa.Text(), nullable=False),
        sa.Column(
            "type",
            postgresql.ENUM(
                "image",
                "pdf",
                "document",
                "archive",
                name="lesson_doc",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column(
            "locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            nullable=False,
        ),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint("version > 0", name=op.f("ck_lesson_docs_version_positive")),
        sa.ForeignKeyConstraint(
            ["lesson_id"],
            ["lessons.id"],
            name=op.f("fk_lesson_docs_lesson_id_lessons"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_lesson_docs")),
    )
    op.create_table(
        "lesson_media",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("storage_key", sa.Text(), nullable=False),
        sa.Column(
            "locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            nullable=False,
        ),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "processing_status",
            sa.Text(),
            server_default=sa.text("'pending'"),
            nullable=False,
        ),
        sa.Column("processed_key", sa.Text(), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("published_by", sa.Uuid(), nullable=True),
        sa.CheckConstraint(
            "(published_at IS NULL) = (published_by IS NULL)",
            name=op.f("ck_lesson_media_publication_evidence"),
        ),
        sa.CheckConstraint(
            "length(btrim(processing_status)) > 0",
            name=op.f("ck_lesson_media_processing_status_nonblank"),
        ),
        sa.CheckConstraint(
            "version > 0", name=op.f("ck_lesson_media_version_positive")
        ),
        sa.ForeignKeyConstraint(
            ["lesson_id"],
            ["lessons.id"],
            name=op.f("fk_lesson_media_lesson_id_lessons"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["published_by"],
            ["users.id"],
            name=op.f("fk_lesson_media_published_by_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_lesson_media")),
        sa.UniqueConstraint(
            "lesson_id", "locale", "version", name=op.f("uq_lesson_media_lesson_id")
        ),
    )
    op.create_table(
        "lesson_progress",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column(
            "video_position_seconds",
            sa.Integer(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column(
            "is_completed",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.CheckConstraint(
            "video_position_seconds >= 0",
            name=op.f("ck_lesson_progress_position_nonnegative"),
        ),
        sa.ForeignKeyConstraint(
            ["enrollment_id", "course_id"],
            ["enrollments.id", "enrollments.course_id"],
            name="fk_progress_enrollments_course",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["lesson_id", "course_id"],
            ["lessons.id", "lessons.course_id"],
            name="fk_progress_lessons_course",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_lesson_progress")),
        sa.UniqueConstraint(
            "enrollment_id", "lesson_id", name=op.f("uq_lesson_progress_enrollment_id")
        ),
    )
    op.create_table(
        "student_requests",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("requested_by", sa.Uuid(), nullable=False),
        sa.Column("reviewed_by", sa.Uuid(), nullable=True),
        sa.Column("type", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("attachment_key", sa.Text(), nullable=True),
        sa.Column("deadline_extension", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "type <> 'externalRefund'", name=op.f("ck_student_requests_no_money_refund")
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0",
            name=op.f("ck_student_requests_status_nonblank"),
        ),
        sa.CheckConstraint(
            "length(btrim(type)) > 0", name=op.f("ck_student_requests_type_nonblank")
        ),
        sa.ForeignKeyConstraint(
            ["enrollment_id"],
            ["enrollments.id"],
            name=op.f("fk_student_requests_enrollment_id_enrollments"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["requested_by"],
            ["users.id"],
            name=op.f("fk_student_requests_requested_by_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["reviewed_by"],
            ["users.id"],
            name=op.f("fk_student_requests_reviewed_by_users"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_student_requests")),
    )
    op.create_table(
        "certificates",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("certificate_number", sa.Text(), nullable=False),
        sa.Column("request_id", sa.Uuid(), nullable=False),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("template_id", sa.Uuid(), nullable=False),
        sa.Column("issued_to", sa.Uuid(), nullable=False),
        sa.Column("issued_by", sa.Uuid(), nullable=False),
        sa.Column("student_name", sa.Text(), nullable=False),
        sa.Column("course_title", sa.Text(), nullable=False),
        sa.Column("trainer_name", sa.Text(), nullable=True),
        sa.Column(
            "locale",
            postgresql.ENUM("ru", "en", name="locale", create_type=False),
            nullable=False,
        ),
        sa.Column("pdf_key", sa.Text(), nullable=False),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("issuer_identity", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["enrollment_id", "issued_to"],
            ["enrollments.id", "enrollments.user_id"],
            name="fk_certificates_enrollment_user",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["issued_by"],
            ["users.id"],
            name=op.f("fk_certificates_issued_by_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["request_id", "enrollment_id"],
            ["certificate_requests.id", "certificate_requests.enrollment_id"],
            name="fk_certificates_request_enrollment",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["template_id", "locale"],
            ["certificate_templates.id", "certificate_templates.locale"],
            name="fk_certificates_template_locale",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_certificates")),
        sa.UniqueConstraint(
            "certificate_number", name=op.f("uq_certificates_certificate_number")
        ),
    )
    op.create_table(
        "submissions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("assignment_id", sa.Uuid(), nullable=False),
        sa.Column("enrollment_id", sa.Uuid(), nullable=False),
        sa.Column("previous_submission_id", sa.Uuid(), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("attempt", sa.Integer(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("review_due_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("curator_timezone", sa.Text(), nullable=True),
        sa.Column("course_id", sa.Uuid(), nullable=False),
        sa.Column("previous_attempt", sa.Integer(), nullable=True),
        sa.Column("assigned_curator_id", sa.Uuid(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "(attempt = 1 AND previous_submission_id IS NULL AND previous_attempt IS NULL) OR (attempt > 1 AND previous_submission_id IS NOT NULL AND previous_attempt IS NOT NULL AND previous_attempt > 0 AND previous_attempt < attempt)",
            name=op.f("ck_submissions_attempt_order"),
        ),
        sa.CheckConstraint(
            "length(btrim(status)) > 0", name=op.f("ck_submissions_status_nonblank")
        ),
        sa.CheckConstraint(
            "submitted_at IS NULL OR (review_due_at IS NOT NULL AND curator_timezone IS NOT NULL AND length(btrim(curator_timezone)) > 0 AND assigned_curator_id IS NOT NULL)",
            name=op.f("ck_submissions_sla_snapshot"),
        ),
        sa.ForeignKeyConstraint(
            ["assigned_curator_id"],
            ["users.id"],
            name=op.f("fk_submissions_assigned_curator_id_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["assignment_id", "course_id"],
            ["assignments.id", "assignments.course_id"],
            name="fk_submissions_assignments_course",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["enrollment_id", "course_id"],
            ["enrollments.id", "enrollments.course_id"],
            name="fk_submissions_enrollments_course",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            [
                "previous_submission_id",
                "assignment_id",
                "enrollment_id",
                "previous_attempt",
            ],
            [
                "submissions.id",
                "submissions.assignment_id",
                "submissions.enrollment_id",
                "submissions.attempt",
            ],
            name="fk_submissions_previous_attempt",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_submissions")),
        sa.UniqueConstraint(
            "assignment_id",
            "enrollment_id",
            "attempt",
            name=op.f("uq_submissions_assignment_id"),
        ),
        sa.UniqueConstraint(
            "id",
            "assignment_id",
            "enrollment_id",
            "attempt",
            name="uq_submissions_predecessor_target",
        ),
    )
    op.create_table(
        "submission_attachments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("submission_id", sa.Uuid(), nullable=False),
        sa.Column("storage_key", sa.Text(), nullable=False),
        sa.Column("preview_key", sa.Text(), nullable=True),
        sa.Column("file_type", sa.Text(), nullable=True),
        sa.Column("file_size_bytes", sa.BigInteger(), nullable=True),
        sa.Column("processing_status", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "upload_status",
            sa.Text(),
            server_default=sa.text("'pending'"),
            nullable=False,
        ),
        sa.Column("upload_id", sa.Text(), nullable=True),
        sa.Column("object_version", sa.Text(), nullable=True),
        sa.Column("derived_key", sa.Text(), nullable=True),
        sa.Column("version", sa.Integer(), server_default=sa.text("1"), nullable=False),
        sa.CheckConstraint(
            "file_size_bytes IS NULL OR (file_size_bytes BETWEEN 0 AND 1000000000)",
            name=op.f("ck_submission_attachments_size_bounds"),
        ),
        sa.CheckConstraint(
            "length(btrim(processing_status)) > 0",
            name=op.f("ck_submission_attachments_processing_status_nonblank"),
        ),
        sa.CheckConstraint(
            "length(btrim(upload_status)) > 0",
            name=op.f("ck_submission_attachments_upload_status_nonblank"),
        ),
        sa.CheckConstraint(
            "version > 0", name=op.f("ck_submission_attachments_version_positive")
        ),
        sa.ForeignKeyConstraint(
            ["submission_id"],
            ["submissions.id"],
            name=op.f("fk_submission_attachments_submission_id_submissions"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_submission_attachments")),
    )
    op.create_table(
        "submission_reviews",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("submission_id", sa.Uuid(), nullable=False),
        sa.Column("reviewer_id", sa.Uuid(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column(
            "attachments", postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
        sa.Column("decision", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "length(btrim(decision)) > 0",
            name=op.f("ck_submission_reviews_decision_nonblank"),
        ),
        sa.ForeignKeyConstraint(
            ["reviewer_id"],
            ["users.id"],
            name=op.f("fk_submission_reviews_reviewer_id_users"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["submission_id"],
            ["submissions.id"],
            name=op.f("fk_submission_reviews_submission_id_submissions"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_submission_reviews")),
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Destructive reversal is allowed only for an entirely empty foundation.
    op.execute(
        "LOCK TABLE public.assignments, public.categories, public.certificate_requests, public.certificate_templates, public.certificates, public.course_localizations, public.course_messages, public.courses, public.enrollments, public.lesson_docs, public.lesson_media, public.lesson_progress, public.lessons, public.modules, public.notifications, public.order_items, public.orders, public.package_courses, public.packages, public.payment_events, public.payments, public.profiles, public.refunds, public.student_requests, public.submission_attachments, public.submission_reviews, public.submissions, public.users IN ACCESS EXCLUSIVE MODE"
    )
    op.execute(
        "DO $$ BEGIN IF EXISTS (SELECT 1 FROM public.assignments) OR EXISTS (SELECT 1 FROM public.categories) OR EXISTS (SELECT 1 FROM public.certificate_requests) OR EXISTS (SELECT 1 FROM public.certificate_templates) OR EXISTS (SELECT 1 FROM public.certificates) OR EXISTS (SELECT 1 FROM public.course_localizations) OR EXISTS (SELECT 1 FROM public.course_messages) OR EXISTS (SELECT 1 FROM public.courses) OR EXISTS (SELECT 1 FROM public.enrollments) OR EXISTS (SELECT 1 FROM public.lesson_docs) OR EXISTS (SELECT 1 FROM public.lesson_media) OR EXISTS (SELECT 1 FROM public.lesson_progress) OR EXISTS (SELECT 1 FROM public.lessons) OR EXISTS (SELECT 1 FROM public.modules) OR EXISTS (SELECT 1 FROM public.notifications) OR EXISTS (SELECT 1 FROM public.order_items) OR EXISTS (SELECT 1 FROM public.orders) OR EXISTS (SELECT 1 FROM public.package_courses) OR EXISTS (SELECT 1 FROM public.packages) OR EXISTS (SELECT 1 FROM public.payment_events) OR EXISTS (SELECT 1 FROM public.payments) OR EXISTS (SELECT 1 FROM public.profiles) OR EXISTS (SELECT 1 FROM public.refunds) OR EXISTS (SELECT 1 FROM public.student_requests) OR EXISTS (SELECT 1 FROM public.submission_attachments) OR EXISTS (SELECT 1 FROM public.submission_reviews) OR EXISTS (SELECT 1 FROM public.submissions) OR EXISTS (SELECT 1 FROM public.users) THEN RAISE EXCEPTION 'SCHEMA_DOWNGRADE_REQUIRES_EMPTY_TABLES'; END IF; END $$;"
    )
    op.drop_table("submission_reviews")
    op.drop_table("submission_attachments")
    op.drop_table("submissions")
    op.drop_table("certificates")
    op.drop_table("student_requests")
    op.drop_table("lesson_progress")
    op.drop_table("lesson_media")
    op.drop_table("lesson_docs")
    op.drop_table("course_messages")
    op.drop_table("certificate_requests")
    op.drop_table("assignments")
    op.drop_table("refunds")
    op.drop_table("payment_events")
    op.drop_table("lessons")
    op.drop_table("enrollments")
    op.drop_table("payments")
    op.drop_table("package_courses")
    op.drop_table("order_items")
    op.drop_table("modules")
    op.drop_table("course_localizations")
    op.drop_table("profiles")
    op.drop_table("orders")
    op.drop_table("notifications")
    op.drop_table("courses")
    op.drop_table("certificate_templates")
    op.drop_index("uq_users_referral_code_ci", table_name="users")
    op.drop_index("uq_users_email_ci", table_name="users")
    op.drop_table("users")
    op.drop_table("packages")
    op.drop_table("categories")

    postgresql.ENUM(name="user_role").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="package_type").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="notification_channel").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="locale").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="lesson_doc").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="course_type").drop(op.get_bind(), checkfirst=False)
    postgresql.ENUM(name="account_status").drop(op.get_bind(), checkfirst=False)

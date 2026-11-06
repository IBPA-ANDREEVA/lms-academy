"""Commerce-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    subtotal_cents: Mapped[int] = mapped_column(BigInteger)
    discount_cents: Mapped[int] = mapped_column(BigInteger, server_default=text("0"))
    total_cents: Mapped[int] = mapped_column(BigInteger)
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    status: Mapped[str] = mapped_column(Text)
    policy: Mapped[dict[str, object] | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        CheckConstraint(
            "subtotal_cents >= 0 AND discount_cents >= 0 AND total_cents >= 0",
            name="money_nonnegative",
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    order_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("orders.id", ondelete="RESTRICT")
    )
    package_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("packages.id", ondelete="RESTRICT")
    )
    course_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("courses.id", ondelete="RESTRICT")
    )
    title_snapshot: Mapped[str] = mapped_column(Text)
    price_cents: Mapped[int] = mapped_column(BigInteger)
    discount_cents: Mapped[int] = mapped_column(BigInteger, server_default=text("0"))
    total_cents: Mapped[int] = mapped_column(BigInteger)
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        CheckConstraint(
            "(course_id IS NOT NULL AND package_id IS NULL) OR (course_id IS NULL AND package_id IS NOT NULL)",
            name="one_product",
        ),
        CheckConstraint(
            "price_cents >= 0 AND discount_cents >= 0 AND total_cents >= 0",
            name="money_nonnegative",
        ),
        UniqueConstraint("id", "order_id", name="uq_order_items_id_order"),
    )


class Payment(Base):
    __tablename__ = "payments"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    order_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("orders.id", ondelete="RESTRICT")
    )
    provider: Mapped[str] = mapped_column(Text, server_default=text("'stripe'"))
    provider_payment_id: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text)
    amount_cents: Mapped[int] = mapped_column(BigInteger)
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        UniqueConstraint("id", "order_id", name="uq_payments_id_order"),
        UniqueConstraint("provider", "provider_payment_id"),
        CheckConstraint("amount_cents >= 0", name="amount_nonnegative"),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class PaymentEvent(Base):
    __tablename__ = "payment_events"
    provider_event_id: Mapped[str] = mapped_column(Text, primary_key=True)
    payment_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("payments.id", ondelete="RESTRICT")
    )
    event_type: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text)
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class Refund(Base):
    __tablename__ = "refunds"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    order_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("orders.id", ondelete="RESTRICT")
    )
    payment_id: Mapped[UUID] = mapped_column(Uuid)
    order_item_id: Mapped[UUID | None] = mapped_column(Uuid)
    amount_cents: Mapped[int] = mapped_column(BigInteger)
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    status: Mapped[str] = mapped_column(Text)
    reason: Mapped[str | None] = mapped_column(Text)
    provider_refund_id: Mapped[str | None] = mapped_column(Text, unique=True)
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    request_key: Mapped[str] = mapped_column(Text, unique=True)
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        CheckConstraint("amount_cents > 0", name="amount_positive"),
        ForeignKeyConstraint(
            ["payment_id", "order_id"],
            ["payments.id", "payments.order_id"],
            name="fk_refunds_payment_order",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["order_item_id", "order_id"],
            ["order_items.id", "order_items.order_id"],
            name="fk_refunds_item_order",
            ondelete="RESTRICT",
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )

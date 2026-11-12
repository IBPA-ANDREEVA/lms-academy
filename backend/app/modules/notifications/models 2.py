"""Notifications-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    type: Mapped[str] = mapped_column(Text)
    channel: Mapped[str] = mapped_column(
        Enum("web", "email", name="notification_channel")
    )
    status: Mapped[str] = mapped_column(Text, server_default=text("'pending'"))
    title: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    action_url: Mapped[str | None] = mapped_column(Text)
    attachments: Mapped[dict[str, object] | None] = mapped_column(JSONB)
    attempt_count: Mapped[int] = mapped_column(Integer, server_default=text("0"))
    deduplication_key: Mapped[str] = mapped_column(Text, unique=True)
    next_retry_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_error_code: Mapped[str | None] = mapped_column(Text)
    provider_message_id: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    event_key: Mapped[str] = mapped_column(Text)
    __table_args__ = (
        CheckConstraint("attempt_count >= 0", name="attempts_nonnegative"),
        CheckConstraint(
            "length(btrim(deduplication_key)) > 0 AND length(btrim(event_key)) > 0",
            name="dedup_nonblank",
        ),
        UniqueConstraint("event_key", "user_id", "channel"),
        CheckConstraint("length(btrim(type)) > 0", name="type_nonblank"),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )

"""Learning-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    course_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("courses.id", ondelete="RESTRICT")
    )
    order_item_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("order_items.id", ondelete="RESTRICT")
    )
    user_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    granted_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    status: Mapped[str] = mapped_column(Text)
    activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    access_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    support_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    grant_reason: Mapped[str | None] = mapped_column(Text)
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        UniqueConstraint("order_item_id", "course_id"),
        UniqueConstraint("id", "course_id", name="uq_enrollments_id_course"),
        UniqueConstraint("id", "user_id", name="uq_enrollments_id_user"),
        CheckConstraint(
            "(order_item_id IS NULL AND granted_by IS NOT NULL AND grant_reason IS NOT NULL AND length(btrim(grant_reason)) > 0 AND granted_at IS NOT NULL) OR (order_item_id IS NOT NULL AND granted_by IS NULL AND grant_reason IS NULL AND granted_at IS NULL)",
            name="source_provenance",
        ),
        CheckConstraint(
            "activated_at IS NOT NULL OR (access_expires_at IS NULL AND support_expires_at IS NULL)",
            name="activation_before_deadlines",
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    enrollment_id: Mapped[UUID] = mapped_column(Uuid)
    lesson_id: Mapped[UUID] = mapped_column(Uuid)
    video_position_seconds: Mapped[int] = mapped_column(
        Integer, server_default=text("0")
    )
    is_completed: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    course_id: Mapped[UUID] = mapped_column(Uuid)
    __table_args__ = (
        UniqueConstraint("enrollment_id", "lesson_id"),
        CheckConstraint("video_position_seconds >= 0", name="position_nonnegative"),
        ForeignKeyConstraint(
            ["enrollment_id", "course_id"],
            ["enrollments.id", "enrollments.course_id"],
            name="fk_progress_enrollments_course",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["lesson_id", "course_id"],
            ["lessons.id", "lessons.course_id"],
            name="fk_progress_lessons_course",
            ondelete="RESTRICT",
        ),
    )


class StudentRequest(Base):
    __tablename__ = "student_requests"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    enrollment_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("enrollments.id", ondelete="RESTRICT")
    )
    requested_by: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    reviewed_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    type: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    attachment_key: Mapped[str | None] = mapped_column(Text)
    deadline_extension: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        CheckConstraint("type <> 'externalRefund'", name="no_money_refund"),
        CheckConstraint("length(btrim(type)) > 0", name="type_nonblank"),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class CourseMessage(Base):
    __tablename__ = "course_messages"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    enrollment_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("enrollments.id", ondelete="RESTRICT")
    )
    sent_by: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    content: Mapped[str | None] = mapped_column(Text)
    attachment_key: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        CheckConstraint(
            "status IN ('draft', 'sent', 'failed')", name="delivery_status"
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )

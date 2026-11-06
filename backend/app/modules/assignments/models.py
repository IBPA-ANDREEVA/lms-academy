"""Assignments-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    BigInteger,
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
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Assignment(Base):
    __tablename__ = "assignments"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    lesson_id: Mapped[UUID] = mapped_column(Uuid)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    attachments: Mapped[dict[str, object] | None] = mapped_column(JSONB)
    is_required: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    course_id: Mapped[UUID] = mapped_column(Uuid)
    __table_args__ = (
        ForeignKeyConstraint(
            ["lesson_id", "course_id"],
            ["lessons.id", "lessons.course_id"],
            name="fk_assignments_lesson_course",
            ondelete="RESTRICT",
        ),
        UniqueConstraint("id", "course_id", name="uq_assignments_id_course"),
    )


class Submission(Base):
    __tablename__ = "submissions"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    assignment_id: Mapped[UUID] = mapped_column(Uuid)
    enrollment_id: Mapped[UUID] = mapped_column(Uuid)
    previous_submission_id: Mapped[UUID | None] = mapped_column(Uuid)
    message: Mapped[str | None] = mapped_column(Text)
    attempt: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(Text)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    review_due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    curator_timezone: Mapped[str | None] = mapped_column(Text)
    course_id: Mapped[UUID] = mapped_column(Uuid)
    previous_attempt: Mapped[int | None] = mapped_column(Integer)
    assigned_curator_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    __table_args__ = (
        ForeignKeyConstraint(
            ["assignment_id", "course_id"],
            ["assignments.id", "assignments.course_id"],
            name="fk_submissions_assignments_course",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["enrollment_id", "course_id"],
            ["enrollments.id", "enrollments.course_id"],
            name="fk_submissions_enrollments_course",
            ondelete="RESTRICT",
        ),
        UniqueConstraint("assignment_id", "enrollment_id", "attempt"),
        UniqueConstraint(
            "id",
            "assignment_id",
            "enrollment_id",
            "attempt",
            name="uq_submissions_predecessor_target",
        ),
        ForeignKeyConstraint(
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
        CheckConstraint(
            "(attempt = 1 AND previous_submission_id IS NULL AND previous_attempt IS NULL) OR (attempt > 1 AND previous_submission_id IS NOT NULL AND previous_attempt IS NOT NULL AND previous_attempt > 0 AND previous_attempt < attempt)",
            name="attempt_order",
        ),
        CheckConstraint(
            "submitted_at IS NULL OR (review_due_at IS NOT NULL AND curator_timezone IS NOT NULL AND length(btrim(curator_timezone)) > 0 AND assigned_curator_id IS NOT NULL)",
            name="sla_snapshot",
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class SubmissionAttachment(Base):
    __tablename__ = "submission_attachments"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    submission_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("submissions.id", ondelete="RESTRICT")
    )
    storage_key: Mapped[str] = mapped_column(Text)
    preview_key: Mapped[str | None] = mapped_column(Text)
    file_type: Mapped[str | None] = mapped_column(Text)
    file_size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    processing_status: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    upload_status: Mapped[str] = mapped_column(Text, server_default=text("'pending'"))
    upload_id: Mapped[str | None] = mapped_column(Text)
    object_version: Mapped[str | None] = mapped_column(Text)
    derived_key: Mapped[str | None] = mapped_column(Text)
    version: Mapped[int] = mapped_column(Integer, server_default=text("1"))
    __table_args__ = (
        CheckConstraint("version > 0", name="version_positive"),
        CheckConstraint(
            "file_size_bytes IS NULL OR (file_size_bytes BETWEEN 0 AND 1000000000)",
            name="size_bounds",
        ),
        CheckConstraint(
            "length(btrim(processing_status)) > 0", name="processing_status_nonblank"
        ),
        CheckConstraint(
            "length(btrim(upload_status)) > 0", name="upload_status_nonblank"
        ),
    )


class SubmissionReview(Base):
    __tablename__ = "submission_reviews"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    submission_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("submissions.id", ondelete="RESTRICT")
    )
    reviewer_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    content: Mapped[str | None] = mapped_column(Text)
    attachments: Mapped[dict[str, object] | None] = mapped_column(JSONB)
    decision: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    __table_args__ = (
        CheckConstraint("length(btrim(decision)) > 0", name="decision_nonblank"),
    )

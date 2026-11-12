"""Certificates-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum,
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


class CertificateRequest(Base):
    __tablename__ = "certificate_requests"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    requested_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    reviewed_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("enrollments.id", ondelete="RESTRICT")
    )
    status: Mapped[str] = mapped_column(Text)
    review_comment: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        UniqueConstraint(
            "id", "enrollment_id", name="uq_certificate_requests_id_enrollment"
        ),
        CheckConstraint("length(btrim(status)) > 0", name="status_nonblank"),
    )


class CertificateTemplate(Base):
    __tablename__ = "certificate_templates"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    locale: Mapped[str] = mapped_column(Enum("ru", "en", name="locale"))
    version: Mapped[int] = mapped_column(Integer)
    template_key: Mapped[str] = mapped_column(Text)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    approved_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    issuer_identity: Mapped[str | None] = mapped_column(Text)
    __table_args__ = (
        CheckConstraint("version > 0", name="version_positive"),
        UniqueConstraint("name", "locale", "version"),
        UniqueConstraint("id", "locale", name="uq_certificate_templates_id_locale"),
        CheckConstraint(
            "(approved_at IS NULL AND approved_by IS NULL AND issuer_identity IS NULL) OR (approved_at IS NOT NULL AND approved_by IS NOT NULL AND issuer_identity IS NOT NULL AND length(btrim(issuer_identity)) > 0)",
            name="approval_evidence",
        ),
    )


class Certificate(Base):
    __tablename__ = "certificates"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    certificate_number: Mapped[str] = mapped_column(Text, unique=True)
    request_id: Mapped[UUID] = mapped_column(Uuid)
    enrollment_id: Mapped[UUID] = mapped_column(Uuid)
    template_id: Mapped[UUID] = mapped_column(Uuid)
    issued_to: Mapped[UUID] = mapped_column(Uuid)
    issued_by: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    student_name: Mapped[str] = mapped_column(Text)
    course_title: Mapped[str] = mapped_column(Text)
    trainer_name: Mapped[str | None] = mapped_column(Text)
    locale: Mapped[str] = mapped_column(Enum("ru", "en", name="locale"))
    pdf_key: Mapped[str] = mapped_column(Text)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    issuer_identity: Mapped[str] = mapped_column(Text)
    __table_args__ = (
        ForeignKeyConstraint(
            ["request_id", "enrollment_id"],
            ["certificate_requests.id", "certificate_requests.enrollment_id"],
            name="fk_certificates_request_enrollment",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["enrollment_id", "issued_to"],
            ["enrollments.id", "enrollments.user_id"],
            name="fk_certificates_enrollment_user",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["template_id", "locale"],
            ["certificate_templates.id", "certificate_templates.locale"],
            name="fk_certificates_template_locale",
            ondelete="RESTRICT",
        ),
    )

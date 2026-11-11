"""Catalog-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Course(Base):
    __tablename__ = "courses"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    category_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("categories.id", ondelete="RESTRICT")
    )
    trainer_id: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    title: Mapped[str] = mapped_column(Text)
    author: Mapped[str | None] = mapped_column(Text)
    locales: Mapped[list[str] | None] = mapped_column(
        ARRAY(Enum("ru", "en", name="locale"))
    )
    price_cents: Mapped[int | None] = mapped_column(BigInteger)
    type: Mapped[str] = mapped_column(Enum("course", "miniCourse", name="course_type"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    is_visible: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    is_for_sale: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    content_approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    price_approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        CheckConstraint(
            "price_cents IS NULL OR price_cents >= 0", name="price_nonnegative"
        ),
    )


class CourseLocalization(Base):
    __tablename__ = "course_localizations"
    course_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("courses.id", ondelete="RESTRICT"), primary_key=True
    )
    locale: Mapped[str] = mapped_column(
        Enum("ru", "en", name="locale"), primary_key=True
    )
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)


class CourseModule(Base):
    __tablename__ = "modules"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    course_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("courses.id", ondelete="RESTRICT")
    )
    title: Mapped[str] = mapped_column(Text)
    position: Mapped[int] = mapped_column(Integer)
    __table_args__ = (
        UniqueConstraint("course_id", "position"),
        UniqueConstraint("id", "course_id", name="uq_modules_id_course"),
        CheckConstraint("position >= 0", name="position_nonnegative"),
    )


class Lesson(Base):
    __tablename__ = "lessons"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    module_id: Mapped[UUID] = mapped_column(Uuid)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    position: Mapped[int] = mapped_column(Integer)
    course_id: Mapped[UUID] = mapped_column(Uuid)
    __table_args__ = (
        UniqueConstraint("module_id", "position"),
        UniqueConstraint("id", "course_id", name="uq_lessons_id_course"),
        CheckConstraint("position >= 0", name="position_nonnegative"),
        ForeignKeyConstraint(
            ["module_id", "course_id"],
            ["modules.id", "modules.course_id"],
            name="fk_lessons_module_course",
            ondelete="RESTRICT",
        ),
    )


class LessonMedia(Base):
    __tablename__ = "lesson_media"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    lesson_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("lessons.id", ondelete="RESTRICT")
    )
    title: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    storage_key: Mapped[str] = mapped_column(Text)
    locale: Mapped[str] = mapped_column(Enum("ru", "en", name="locale"))
    version: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    processing_status: Mapped[str] = mapped_column(
        Text, server_default=text("'pending'")
    )
    processed_key: Mapped[str | None] = mapped_column(Text)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    published_by: Mapped[UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    __table_args__ = (
        UniqueConstraint("lesson_id", "locale", "version"),
        CheckConstraint("version > 0", name="version_positive"),
        CheckConstraint(
            "(published_at IS NULL) = (published_by IS NULL)",
            name="publication_evidence",
        ),
        CheckConstraint(
            "length(btrim(processing_status)) > 0", name="processing_status_nonblank"
        ),
    )


class LessonDocument(Base):
    __tablename__ = "lesson_docs"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    lesson_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("lessons.id", ondelete="RESTRICT")
    )
    title: Mapped[str | None] = mapped_column(Text)
    storage_key: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(
        Enum("image", "pdf", "document", "archive", name="lesson_doc")
    )
    locale: Mapped[str] = mapped_column(Enum("ru", "en", name="locale"))
    version: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    __table_args__ = (CheckConstraint("version > 0", name="version_positive"),)


class Package(Base):
    __tablename__ = "packages"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    price_cents: Mapped[int] = mapped_column(BigInteger)
    type: Mapped[str | None] = mapped_column(Enum("2", "3", "6", name="package_type"))
    currency: Mapped[str] = mapped_column(String(3), server_default=text("'USD'"))
    __table_args__ = (
        CheckConstraint("currency = 'USD'", name="currency_usd"),
        CheckConstraint("price_cents >= 0", name="price_nonnegative"),
    )


class PackageCourse(Base):
    __tablename__ = "package_courses"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    course_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("courses.id", ondelete="RESTRICT")
    )
    package_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("packages.id", ondelete="RESTRICT")
    )
    __table_args__ = (UniqueConstraint("package_id", "course_id"),)

"""Identity-owned physical mappings; no workflows or cross-domain ORM writes.

See docs/architecture/database/schema-contract.md for policy deferrals.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
  CheckConstraint,
  DateTime,
  Enum,
  ForeignKey,
  Index,
  String,
  Text,
  Uuid,
  func,
  text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
  __tablename__ = "users"
  id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
  email: Mapped[str] = mapped_column(String(255))
  roles: Mapped[list[str]] = mapped_column(
    ARRAY(Enum("student", "trainer", "manager", "admin", name="user_role")),
    server_default=text("ARRAY['student']::user_role[]"),
  )
  email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
  referral_code: Mapped[str | None] = mapped_column(String(50))
  status: Mapped[str] = mapped_column(
    Enum("active", "blocked", "pending", name="account_status"),
    server_default=text("'pending'"),
  )
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=text("now()")
  )
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=text("now()")
  )
  __table_args__ = (
    Index("uq_users_email_ci", func.lower(email), unique=True),
    Index("uq_users_referral_code_ci", func.lower(referral_code), unique=True),
    CheckConstraint(
      "coalesce(array_ndims(roles), 1) = 1 AND array_position(roles, NULL) IS NULL AND cardinality(roles) = ((roles @> ARRAY['student']::user_role[])::int + (roles @> ARRAY['trainer']::user_role[])::int + (roles @> ARRAY['manager']::user_role[])::int + (roles @> ARRAY['admin']::user_role[])::int)",
      name="roles_set",
    ),
    CheckConstraint("length(btrim(email)) > 0", name="email_nonblank"),
  )


class Profile(Base):
  __tablename__ = "profiles"
  user_id: Mapped[UUID] = mapped_column(
    Uuid, ForeignKey("users.id", ondelete="RESTRICT"), primary_key=True
  )
  first_name: Mapped[str | None] = mapped_column(String(100))
  last_name: Mapped[str | None] = mapped_column(String(100))
  phone: Mapped[str | None] = mapped_column(String(30))
  preferred_locale: Mapped[str] = mapped_column(
    Enum("ru", "en", name="locale"), server_default=text("'ru'")
  )
  avatar_key: Mapped[str | None] = mapped_column(Text)
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=text("now()")
  )
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=text("now()")
  )

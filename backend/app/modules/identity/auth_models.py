"""Identity authentication storage, separate from public account/profile data.

These are storage primitives only. No registration, session validation, password
hashing, email delivery, or account-recovery operation is implemented here.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    LargeBinary,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.modules.identity.constants import TokenPurpose


class PasswordCredential(Base):
    __tablename__ = "identity_credentials"

    user_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), primary_key=True
    )
    password_hash: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint("length(btrim(password_hash)) > 0", name="hash_nonblank"),
    )


class IdentitySession(Base):
    __tablename__ = "identity_sessions"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), index=True
    )
    # SHA-256 digest of a cryptographically random opaque session secret.
    # Never persist the raw cookie or log its contents.
    secret_digest: Mapped[bytes] = mapped_column(LargeBinary(32), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    # Only genuine user interaction may advance this timestamp; no polling.
    last_interaction_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    absolute_expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    password_reauthenticated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    __table_args__ = (
        CheckConstraint("octet_length(secret_digest) = 32", name="digest_length"),
        CheckConstraint("absolute_expires_at > created_at", name="positive_lifetime"),
        CheckConstraint(
            "last_interaction_at >= created_at", name="interaction_after_creation"
        ),
    )


class IdentityActionToken(Base):
    __tablename__ = "identity_action_tokens"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT")
    )
    # Purpose, duration and eligibility are validated by future Identity services.
    purpose: Mapped[TokenPurpose] = mapped_column(
        SQLEnum(
            TokenPurpose,
            name="token_purpose",
            native_enum=False,
            length=48,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )
    # Digest of a high-entropy single-use verification/recovery secret.
    secret_digest: Mapped[bytes] = mapped_column(LargeBinary(32), unique=True)
    # Future email-change verification can bind the new address to the token.
    target_email: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    consumed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        Index("ix_identity_action_tokens_user_purpose", "user_id", "purpose"),
        CheckConstraint("length(btrim(purpose)) > 0", name="purpose_nonblank"),
        CheckConstraint("octet_length(secret_digest) = 32", name="digest_length"),
        CheckConstraint("expires_at > created_at", name="positive_lifetime"),
    )

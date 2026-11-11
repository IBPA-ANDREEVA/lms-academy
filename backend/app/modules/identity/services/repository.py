from datetime import datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.identity.auth_models import IdentityActionToken
from app.modules.identity.constants import TokenPurpose
from app.modules.identity.models import User


def get_user_by_email(session: Session, email: str) -> User | None:

    statement = (
        select(User)
        .where(func.lower(User.email) == email.strip().lower())
        .with_for_update()
    )
    return session.scalar(statement)


def get_user_by_id(session: Session, user_id: UUID) -> User | None:

    statement = select(User).where(User.id == user_id).with_for_update()
    return session.scalar(statement)


def get_token_by_digest(
    session: Session,
    digest: bytes,
    purpose: TokenPurpose,
) -> IdentityActionToken | None:

    statement = (
        select(IdentityActionToken)
        .where(
            IdentityActionToken.secret_digest == digest,
            IdentityActionToken.purpose == purpose,
            IdentityActionToken.revoked_at.is_(None),
        )
        .with_for_update()
        .execution_options(populate_existing=True)
    )

    return session.scalar(statement)


def get_last_token_time(
    session: Session,
    user_id: UUID,
    purpose: TokenPurpose,
) -> datetime | None:

    statement = (
        select(IdentityActionToken.created_at)
        .where(
            IdentityActionToken.user_id == user_id,
            IdentityActionToken.purpose == purpose,
        )
        .order_by(IdentityActionToken.created_at.desc())
        .limit(1)
    )

    return session.scalar(statement)

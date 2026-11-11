from enum import StrEnum
from datetime import timedelta


class TokenPurpose(StrEnum):
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"


TOKEN_LIFETIMES = {
    TokenPurpose.EMAIL_VERIFICATION: timedelta(hours=24),
    TokenPurpose.PASSWORD_RESET: timedelta(minutes=60),
}

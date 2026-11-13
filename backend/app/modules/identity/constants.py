from datetime import timedelta
from enum import StrEnum


class TokenPurpose(StrEnum):
  EMAIL_VERIFICATION = "email_verification"
  PASSWORD_RESET = "password_reset"


TOKEN_LIFETIMES = {
  TokenPurpose.EMAIL_VERIFICATION: timedelta(hours=48),
  TokenPurpose.PASSWORD_RESET: timedelta(minutes=30),
}

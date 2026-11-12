from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints


class BaseResponse(BaseModel):
  message: str


ProfileName = Annotated[
  str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)
]


class RegisterRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  first_name: ProfileName
  last_name: ProfileName
  email: EmailStr = Field(max_length=255)
  password: str = Field(min_length=8, max_length=255, repr=False)


class VerifyEmailRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  token: str = Field(min_length=1, max_length=256, repr=False)


class ResendVerificationRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  email: EmailStr = Field(max_length=255)


class LoginRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  email: EmailStr = Field(max_length=255)
  password: str = Field(min_length=8, max_length=1024, repr=False)


class CurrentUserResponse(BaseModel):
  model_config = ConfigDict(extra="forbid")

  id: UUID
  email: EmailStr = Field(max_length=255)
  first_name: str | None
  last_name: str | None
  roles: list[str]
  status: str
  email_verified_at: datetime | None


class ForgotPasswordRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  email: EmailStr = Field(max_length=255)


class ResetPasswordRequest(BaseModel):
  model_config = ConfigDict(extra="forbid")

  token: str = Field(min_length=1, max_length=256, repr=False)
  password: str = Field(min_length=8, max_length=255, repr=False)


class SessionResponse(BaseModel):
  id: UUID
  created_at: datetime
  last_interaction_at: datetime
  absolute_expires_at: datetime
  is_current: bool


class SessionsResponse(BaseModel):
  sessions: list[SessionResponse]
  next_cursor: UUID | None = None


class IdentityErrorDetail(BaseModel):
  code: str
  message: str
  correlation_id: str


class IdentityErrorResponse(BaseModel):
  detail: IdentityErrorDetail

"""Transport checks use provider doubles; no real email is sent."""

from unittest.mock import Mock
from urllib.parse import parse_qs, urlsplit

import pytest
import resend
from resend.exceptions import ResendError

from app.integrations.resend_email import EmailDeliveryError, ResendEmailSender
from app.main import configure_email
from app.modules.notifications.email_service import EmailService


def test_email_links_content_and_disabled_delivery() -> None:
  sender = Mock(spec=ResendEmailSender)
  sender.send.return_value = "provider-id"
  service = EmailService(sender=sender, app_base_url="https://academy.example/")
  assert (
    service.send_password_reset_email(to="test@example.com", raw_token="a&b?#")
    == "provider-id"
  )
  text = sender.send.call_args.kwargs["text"]
  url = text.splitlines()[0].split(": ", 1)[1]
  assert urlsplit(url).path == "/reset-password"
  assert parse_qs(urlsplit(url).query) == {"token": ["a&b?#"]}
  assert "30 минут" in text
  service.send_verification_email(to="test@example.com", raw_token="verification")
  assert "48 часов" in sender.send.call_args.kwargs["text"]
  with pytest.raises(EmailDeliveryError):
    EmailService().send_verification_email(to="test@example.com", raw_token="secret")


@pytest.mark.parametrize(
  "url",
  [
    "http://academy.example",
    "https://user:password@academy.example",
    "https://academy.example/?redirect=evil",
    "https://academy.example/#token",
    "https://academy.example/subpath",
    "//academy.example",
    "https://academy.example\n",
  ],
)
def test_email_rejects_unsafe_base_url(url: str) -> None:
  with pytest.raises(ValueError):
    EmailService(sender=Mock(spec=ResendEmailSender), app_base_url=url)


def test_provider_error_sanitized(
  monkeypatch: pytest.MonkeyPatch,
  caplog: pytest.LogCaptureFixture,
) -> None:
  secret = "private@example.com private-token"
  send = Mock(
    side_effect=ResendError(
      code=500, message=secret, error_type="server_error", suggested_action="retry"
    )
  )
  monkeypatch.setattr(resend.Emails, "send", send)
  service = EmailService(
    ResendEmailSender("test@example.com"), "https://academy.example"
  )
  with pytest.raises(EmailDeliveryError) as caught:
    service.send_password_reset_email(
      to="private@example.com", raw_token="private-token"
    )
  assert secret not in str(caught.value)
  assert "private@example.com" not in caplog.text
  assert "private-token" not in caplog.text
  assert "correlation_id=" in caplog.text


def test_email_configuration(monkeypatch: pytest.MonkeyPatch) -> None:
  for name in ("EMAIL_ENABLED", "RESEND_API_KEY", "EMAIL_FROM", "APP_BASE_URL"):
    monkeypatch.delenv(name, raising=False)
  assert configure_email().sender is None
  monkeypatch.setenv("EMAIL_ENABLED", "true")
  with pytest.raises(ValueError):
    configure_email()
  monkeypatch.setenv("RESEND_API_KEY", "test-placeholder")
  monkeypatch.setenv("EMAIL_FROM", "test@example.com")
  monkeypatch.setenv("APP_BASE_URL", "https://academy.example")
  monkeypatch.setattr(resend, "api_key", None)
  monkeypatch.setattr(resend, "default_http_client", None)
  assert configure_email().sender is not None
  assert resend.api_key == "test-placeholder"

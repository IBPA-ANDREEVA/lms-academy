import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import resend
from fastapi import FastAPI

from app.api.router import api_router
from app.db.session import ApplicationDatabase, ApplicationDatabaseSettings
from app.integrations.resend_email import ResendEmailSender
from app.modules.notifications.email_service import EmailService


def configure_email() -> EmailService:
    enabled = os.environ.get("EMAIL_ENABLED", "false")
    if enabled not in {"true", "false"}:
        raise ValueError("EMAIL_ENABLED must be true or false.")
    if enabled == "false":
        return EmailService()

    names = ("RESEND_API_KEY", "EMAIL_FROM", "APP_BASE_URL")
    if any(not os.environ.get(name, "").strip() for name in names):
        raise ValueError(
            "Enabled email requires RESEND_API_KEY, EMAIL_FROM and APP_BASE_URL."
        )

    service = EmailService(
        sender=ResendEmailSender(from_address=os.environ["EMAIL_FROM"]),
        app_base_url=os.environ["APP_BASE_URL"],
    )
    resend.api_key = os.environ["RESEND_API_KEY"]
    resend.default_http_client = resend.RequestsClient(timeout=10)

    return service


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.email_service = configure_email()
    db = ApplicationDatabase(ApplicationDatabaseSettings.from_environment())
    app.state.database = db

    try:
        yield
    finally:
        db.dispose()


app = FastAPI(
    title="LMS Academy API",
    lifespan=lifespan,
)

app.include_router(api_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

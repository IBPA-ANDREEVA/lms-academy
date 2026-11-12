import os
import resend

from app.integrations.resend_email import ResendEmailSender
from app.modules.notifications.email_service import EmailService

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.db.session import (
    ApplicationDatabase,
    ApplicationDatabaseSettings,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    db = ApplicationDatabase(ApplicationDatabaseSettings.from_environment())
    app.state.database = db

    resend.api_key = os.environ("RESEND_API_KEY")

    sender = ResendEmailSender(from_address=os.environ("EMAIL_FROM"))

    app.state.email_service = EmailService(sender=sender, app_base_url=os.environ("APP_BASE_URL"))

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


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
    db = ApplicationDatabase(
        ApplicationDatabaseSettings.from_environment()
    )
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

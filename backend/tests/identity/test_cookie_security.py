import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.router import api_router


@pytest.mark.parametrize("path", ["/login", "/logout"])
@pytest.mark.parametrize(
  "origin", [None, "null", "https://evil.example", "https://testserver.evil.example"]
)
def test_cookie_mutations_reject_missing_or_foreign_origin(
  path: str,
  origin: str | None,
) -> None:
  app = FastAPI()
  app.include_router(api_router)
  client = TestClient(app, base_url="https://testserver")
  response = client.post(
    "/api/v1/auth" + path,
    json={"email": "test@example.com", "password": "test-password"},
    headers={"Origin": origin} if origin else {},
  )
  assert response.status_code == 403
  assert response.headers["cache-control"] == "no-store"
  assert "set-cookie" not in response.headers

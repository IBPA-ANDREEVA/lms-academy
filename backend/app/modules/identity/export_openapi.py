"""Export contracts without starting the application or connecting to a DB."""

import json
from pathlib import Path

from app.main import app

BACKEND = Path(__file__).resolve().parents[3]


def main() -> None:
  destination = BACKEND / "openapi" / "identity.json"
  destination.parent.mkdir(exist_ok=True)

  destination.write_text(json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n")


if __name__ == "__main__":
  main()

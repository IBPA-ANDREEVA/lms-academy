"""Explicit no-op until domain epics approve concrete reference data."""

import argparse
import json

from app.db.config import ENVIRONMENTS, require_environment


def seed(environment: str) -> int:
    require_environment(environment)
    # Intentionally no connection, users, passwords, courses or schema changes.
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--environment", required=True, choices=ENVIRONMENTS)
    args = parser.parse_args()
    print(
        json.dumps(
            {
                "operation": "seed",
                "environment": args.environment,
                "status": "no_op_no_approved_reference_data",
                "records_written": seed(args.environment),
            }
        )
    )


if __name__ == "__main__":
    main()

"""Explicit operator-only smoke test; never run automatically."""

import argparse

from app.main import configure_email


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--to", required=True, help="Operator-controlled test mailbox")
    args = parser.parse_args()
    service = configure_email()
    service.send_verification_email(to=args.to, raw_token="nonfunctional-smoke-test")
    print("Test email accepted by provider (not proof of inbox delivery).")


if __name__ == "__main__":
    main()

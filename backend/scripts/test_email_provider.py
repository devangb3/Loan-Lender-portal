from __future__ import annotations

import sys
from pathlib import Path

from sqlmodel import Session

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings
from app.core.db import engine, init_db
from app.modules.notifications.service import NotificationService


def test_email_provider() -> None:
    print("=" * 64)
    print("Testing Email Provider (Gmail or Console)")
    print("=" * 64)

    provider = settings.email_provider.strip().lower()
    print(f"Provider: {provider}")
    print(f"From: {settings.email_from}")

    if provider not in {"gmail", "console"}:
        print("❌ EMAIL_PROVIDER must be 'gmail' or 'console'")
        return

    if provider == "gmail":
        if not settings.gmail_username or not settings.gmail_app_password:
            print("❌ Gmail mode requires GMAIL_USERNAME and GMAIL_APP_PASSWORD")
            return
        print("✅ Gmail credentials configured")
    else:
        print("⚠️  Console mode: no real email will be sent")

    target = input("Enter recipient email (or press Enter to skip): ").strip()
    if not target:
        print("⏭️  Skipping send test")
        return

    init_db()
    with Session(engine) as session:
        service = NotificationService(session)
        try:
            service.send_email(
                to_email=target,
                subject="Loan Portal Email Test",
                html="<h2>Email test success</h2><p>Your provider config works.</p>",
            )
            session.commit()
            print("✅ send_email() completed. Check inbox (or logs for console mode).")
        except Exception as exc:
            session.rollback()
            print(f"❌ send_email() failed: {exc}")


if __name__ == "__main__":
    test_email_provider()

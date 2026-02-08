from __future__ import annotations

import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, select

from app.common.base import UserRole
from app.core.db import engine, init_db
from app.core.security import get_password_hash
from app.modules.auth.models import User


def main() -> None:
    init_db()
    email = input("Admin email: ").strip().lower()
    password = getpass.getpass("Admin password: ")
    full_name = input("Admin full name: ").strip() or "Platform Admin"

    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            print("Admin user already exists.")
            return

        admin = User(
            email=email,
            hashed_password=get_password_hash(password),
            role=UserRole.ADMIN,
            full_name=full_name,
            is_active=True,
            is_email_verified=True,
        )
        session.add(admin)
        session.commit()
        print(f"Created admin user: {email}")


if __name__ == "__main__":
    main()

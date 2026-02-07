from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.borrowers.models import BorrowerProfile


class BorrowerRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_user_id(self, user_id: UUID) -> BorrowerProfile | None:
        return self.session.exec(select(BorrowerProfile).where(BorrowerProfile.user_id == user_id)).first()

    def get_by_email(self, email: str) -> BorrowerProfile | None:
        return self.session.exec(select(BorrowerProfile).where(BorrowerProfile.email == email.lower())).first()

    def save(self, borrower: BorrowerProfile) -> BorrowerProfile:
        self.session.add(borrower)
        self.session.flush()
        return borrower

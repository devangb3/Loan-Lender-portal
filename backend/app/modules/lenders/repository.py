from __future__ import annotations

from sqlmodel import Session, select

from app.modules.lenders.models import Lender


class LenderRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_many(self, lenders: list[Lender]) -> None:
        for lender in lenders:
            self.session.add(lender)
        self.session.flush()

    def list_filtered(
        self,
        query: str | None,
        specialty: str | None,
        state: str | None,
        property_type: str | None,
        min_loan: float | None,
        max_loan: float | None,
        offset: int,
        limit: int,
    ) -> list[Lender]:
        stmt = select(Lender)
        if query:
            stmt = stmt.where(Lender.lender_name.ilike(f"%{query}%"))
        if specialty:
            stmt = stmt.where(Lender.specialty.ilike(f"%{specialty}%"))
        if state:
            stmt = stmt.where(Lender.states.ilike(f"%{state}%"))
        if property_type:
            stmt = stmt.where(Lender.property_types.ilike(f"%{property_type}%"))
        if min_loan is not None:
            stmt = stmt.where(Lender.max_loan >= min_loan)
        if max_loan is not None:
            stmt = stmt.where(Lender.min_loan <= max_loan)

        stmt = stmt.offset(offset).limit(limit).order_by(Lender.lender_name)
        return list(self.session.exec(stmt))

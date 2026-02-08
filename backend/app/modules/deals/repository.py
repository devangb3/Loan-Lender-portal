from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.deals.models import Deal


class DealRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, deal: Deal) -> Deal:
        self.session.add(deal)
        self.session.flush()
        return deal

    def list_for_partner(self, partner_id: UUID) -> list[Deal]:
        stmt = select(Deal).where(Deal.partner_id == partner_id).order_by(Deal.created_at.desc())
        return list(self.session.exec(stmt))

    def list_all(self) -> list[Deal]:
        stmt = select(Deal).order_by(Deal.created_at.desc())
        return list(self.session.exec(stmt))

    def get_by_id(self, deal_id: UUID) -> Deal | None:
        return self.session.get(Deal, deal_id)

    def save(self, deal: Deal) -> Deal:
        self.session.add(deal)
        self.session.flush()
        return deal

    def delete(self, deal_id: UUID) -> None:
        deal = self.get_by_id(deal_id)
        if deal:
            self.session.delete(deal)
            self.session.flush()

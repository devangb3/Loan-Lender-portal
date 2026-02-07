from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.commissions.models import Commission


class CommissionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, commission: Commission) -> Commission:
        self.session.add(commission)
        self.session.flush()
        return commission

    def get_by_id(self, commission_id: UUID) -> Commission | None:
        return self.session.get(Commission, commission_id)

    def get_by_deal_id(self, deal_id: UUID) -> Commission | None:
        return self.session.exec(select(Commission).where(Commission.deal_id == deal_id)).first()

    def list_for_partner(self, partner_id: UUID) -> list[Commission]:
        stmt = select(Commission).where(Commission.partner_id == partner_id)
        return list(self.session.exec(stmt))

    def list_all(self) -> list[Commission]:
        stmt = select(Commission)
        return list(self.session.exec(stmt))

    def save(self, commission: Commission) -> Commission:
        self.session.add(commission)
        self.session.flush()
        return commission

from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.partners.models import PartnerProfile


class PartnerRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_user_id(self, user_id: UUID) -> PartnerProfile | None:
        return self.session.exec(select(PartnerProfile).where(PartnerProfile.user_id == user_id)).first()

    def get_by_id(self, partner_id: UUID) -> PartnerProfile | None:
        return self.session.get(PartnerProfile, partner_id)

    def list_all(self) -> list[PartnerProfile]:
        return list(self.session.exec(select(PartnerProfile)))

    def save(self, partner: PartnerProfile) -> PartnerProfile:
        self.session.add(partner)
        self.session.flush()
        return partner

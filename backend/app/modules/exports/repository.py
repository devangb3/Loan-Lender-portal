from __future__ import annotations

from sqlmodel import Session, select

from app.modules.borrowers.models import BorrowerProfile
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile


class ExportRepository:
    def __init__(self, session: Session):
        self.session = session

    def deals(self) -> list[Deal]:
        return self.session.exec(select(Deal)).all()

    def partners(self) -> list[PartnerProfile]:
        return self.session.exec(select(PartnerProfile)).all()

    def borrowers(self) -> list[BorrowerProfile]:
        return self.session.exec(select(BorrowerProfile)).all()

    def commissions(self) -> list[Commission]:
        return self.session.exec(select(Commission)).all()

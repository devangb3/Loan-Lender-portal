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
        return list(self.session.exec(select(Deal)))

    def partners(self) -> list[PartnerProfile]:
        return list(self.session.exec(select(PartnerProfile)))

    def borrowers(self) -> list[BorrowerProfile]:
        return list(self.session.exec(select(BorrowerProfile)))

    def commissions(self) -> list[Commission]:
        return list(self.session.exec(select(Commission)))

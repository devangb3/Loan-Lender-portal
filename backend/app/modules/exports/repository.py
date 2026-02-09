from __future__ import annotations

from collections.abc import Iterable

from sqlmodel import Session, select

from app.modules.borrowers.models import BorrowerProfile
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile


class ExportRepository:
    def __init__(self, session: Session):
        self.session = session

    def deals(self) -> Iterable[Deal]:
        return self.session.exec(select(Deal))

    def partners(self) -> Iterable[PartnerProfile]:
        return self.session.exec(select(PartnerProfile))

    def borrowers(self) -> Iterable[BorrowerProfile]:
        return self.session.exec(select(BorrowerProfile))

    def commissions(self) -> Iterable[Commission]:
        return self.session.exec(select(Commission))

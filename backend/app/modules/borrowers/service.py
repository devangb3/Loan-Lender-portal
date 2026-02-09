from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.common.exceptions import NotFoundException
from app.modules.auth.models import User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.schemas import BorrowerDashboardResponse, BorrowerDealItem
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile


class BorrowerService:
    def __init__(self, session: Session):
        self.session = session

    @staticmethod
    def _to_item(deal: Deal, partner_name: str | None) -> BorrowerDealItem:
        return BorrowerDealItem(
            id=str(deal.id),
            property_address=deal.property_address,
            loan_amount=deal.loan_amount,
            stage=deal.stage,
            referring_partner_name=partner_name,
            created_at=deal.created_at,
            stage_changed_at=deal.stage_changed_at,
        )

    def _list_deal_rows(self, borrower_id: UUID) -> list[tuple[Deal, str | None]]:
        stmt = (
            select(Deal, User.full_name)
            .join(PartnerProfile, PartnerProfile.id == Deal.partner_id, isouter=True)
            .join(User, User.id == PartnerProfile.user_id, isouter=True)
            .where(Deal.borrower_id == borrower_id)
            .order_by(Deal.created_at.desc())
        )
        return list(self.session.exec(stmt))

    def dashboard(self, borrower: BorrowerProfile) -> BorrowerDashboardResponse:
        rows = self._list_deal_rows(borrower.id)
        items = [self._to_item(deal=deal, partner_name=partner_name) for deal, partner_name in rows]
        return BorrowerDashboardResponse(deals=items)

    def get_deal_detail(self, borrower: BorrowerProfile, deal_id: UUID) -> BorrowerDealItem:
        stmt = (
            select(Deal, User.full_name)
            .join(PartnerProfile, PartnerProfile.id == Deal.partner_id, isouter=True)
            .join(User, User.id == PartnerProfile.user_id, isouter=True)
            .where(Deal.id == deal_id, Deal.borrower_id == borrower.id)
        )
        row = self.session.exec(stmt).first()
        if not row:
            raise NotFoundException("Deal not found")
        deal, partner_name = row
        return self._to_item(deal=deal, partner_name=partner_name)

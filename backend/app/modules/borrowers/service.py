from __future__ import annotations

from sqlmodel import Session, select

from app.modules.auth.models import User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.schemas import BorrowerDashboardResponse, BorrowerDealItem
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile


class BorrowerService:
    def __init__(self, session: Session):
        self.session = session

    def dashboard(self, borrower: BorrowerProfile) -> BorrowerDashboardResponse:
        deals = list(self.session.exec(select(Deal).where(Deal.borrower_id == borrower.id)))
        items: list[BorrowerDealItem] = []
        for deal in deals:
            partner_name = None
            partner = self.session.get(PartnerProfile, deal.partner_id)
            if partner:
                user = self.session.get(User, partner.user_id)
                partner_name = user.full_name if user else None
            items.append(
                BorrowerDealItem(
                    id=str(deal.id),
                    property_address=deal.property_address,
                    loan_amount=deal.loan_amount,
                    stage=deal.stage,
                    referring_partner_name=partner_name,
                    created_at=deal.created_at,
                )
            )
        return BorrowerDashboardResponse(deals=items)

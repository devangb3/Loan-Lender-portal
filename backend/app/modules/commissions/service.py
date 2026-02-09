from __future__ import annotations

from uuid import UUID

from sqlmodel import Session

from app.common.base import CommissionStatus
from app.common.exceptions import BadRequestException, NotFoundException
from app.modules.commissions.models import Commission
from app.modules.commissions.repository import CommissionRepository
from app.modules.commissions.schemas import CommissionResponse, PartnerCommissionSummary
from app.modules.commissions.validators import validate_amount, validate_status_transition
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile


class CommissionService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = CommissionRepository(session)

    def create_for_deal(self, deal_id: UUID, amount: float) -> Commission:
        validate_amount(amount)
        if self.repo.get_by_deal_id(deal_id):
            raise BadRequestException("Commission already exists for this deal")

        deal = self.session.get(Deal, deal_id)
        if not deal:
            raise NotFoundException("Deal not found")

        commission = Commission(deal_id=deal.id, partner_id=deal.partner_id, amount=amount, status=CommissionStatus.PENDING)
        self.repo.create(commission)
        self.session.commit()
        self.session.refresh(commission)
        return commission

    @staticmethod
    def _to_response(item: Commission, deal_property_address: str | None) -> CommissionResponse:
        return CommissionResponse(
            id=str(item.id),
            deal_id=str(item.deal_id),
            deal_property_address=deal_property_address,
            partner_id=str(item.partner_id),
            amount=item.amount,
            status=item.status,
        )

    def create_for_deal_response(self, deal_id: UUID, amount: float) -> CommissionResponse:
        item = self.create_for_deal(deal_id, amount)
        joined = self.repo.get_with_deal_address(item.id)
        if not joined:
            return self._to_response(item, None)
        commission, deal_property_address = joined
        return self._to_response(commission, deal_property_address)

    def update_status(self, commission_id: UUID, status: CommissionStatus) -> Commission:
        commission = self.repo.get_by_id(commission_id)
        if not commission:
            raise NotFoundException("Commission not found")
        validate_status_transition(commission.status, status)

        commission.status = status
        self.repo.save(commission)
        self.session.commit()
        self.session.refresh(commission)
        return commission

    def update_status_response(self, commission_id: UUID, status: CommissionStatus) -> CommissionResponse:
        item = self.update_status(commission_id, status)
        joined = self.repo.get_with_deal_address(item.id)
        if not joined:
            return self._to_response(item, None)
        commission, deal_property_address = joined
        return self._to_response(commission, deal_property_address)

    def partner_summary(self, partner: PartnerProfile) -> PartnerCommissionSummary:
        commissions = self.repo.list_for_partner(partner.id)

        pending = sum(c.amount for c in commissions if c.status == CommissionStatus.PENDING)
        earned = sum(c.amount for c in commissions if c.status == CommissionStatus.EARNED)
        paid = sum(c.amount for c in commissions if c.status == CommissionStatus.PAID)
        goal = partner.commission_goal or 0
        progress = (paid / goal * 100) if goal > 0 else 0

        return PartnerCommissionSummary(
            ytd_earnings=paid,
            commission_goal=goal,
            progress_pct=round(progress, 2),
            pending=pending,
            earned=earned,
            paid=paid,
        )

    def list_all(self) -> list[Commission]:
        return self.repo.list_all()

    def list_all_responses(self) -> list[CommissionResponse]:
        return [
            self._to_response(item=commission, deal_property_address=deal_property_address)
            for commission, deal_property_address in self.repo.list_with_deal_address()
        ]

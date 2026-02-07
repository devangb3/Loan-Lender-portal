from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session

from app.common.base import CommissionStatus
from app.common.exceptions import BadRequestException, NotFoundException
from app.modules.commissions.models import Commission
from app.modules.commissions.repository import CommissionRepository
from app.modules.commissions.schemas import PartnerCommissionSummary
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

    def update_status(self, commission_id: UUID, status: CommissionStatus) -> Commission:
        commission = self.repo.get_by_id(commission_id)
        if not commission:
            raise NotFoundException("Commission not found")
        validate_status_transition(commission.status, status)

        commission.status = status
        commission.updated_at = datetime.now(UTC)
        self.repo.save(commission)
        self.session.commit()
        self.session.refresh(commission)
        return commission

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

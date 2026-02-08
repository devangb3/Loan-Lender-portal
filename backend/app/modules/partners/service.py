from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.common.base import CommissionStatus, DealStage
from app.common.exceptions import NotFoundException
from app.modules.auth.models import User
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.partners.models import PartnerProfile
from app.modules.partners.repository import PartnerRepository
from app.modules.partners.schemas import PartnerAdminMetricsResponse, PartnerDashboardResponse, PartnerUpdateRequest
from app.modules.partners.validators import validate_commission_goal


class PartnerService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = PartnerRepository(session)

    def dashboard(self, partner: PartnerProfile) -> PartnerDashboardResponse:
        deals = list(self.session.exec(select(Deal).where(Deal.partner_id == partner.id)))
        commissions = list(self.session.exec(select(Commission).where(Commission.partner_id == partner.id)))

        deals_submitted = len(deals)
        deals_closed = len([d for d in deals if d.stage == DealStage.CLOSED])
        total_volume = sum(d.loan_amount for d in deals)
        pending_commission = sum(c.amount for c in commissions if c.status == CommissionStatus.PENDING)
        ytd_earnings = sum(c.amount for c in commissions if c.status == CommissionStatus.PAID)

        return PartnerDashboardResponse(
            deals_submitted=deals_submitted,
            deals_closed=deals_closed,
            total_loan_volume=total_volume,
            pending_commission=pending_commission,
            ytd_earnings=ytd_earnings,
        )

    def list_for_admin(self) -> list[PartnerAdminMetricsResponse]:
        partners = self.repo.list_all()
        out: list[PartnerAdminMetricsResponse] = []
        for partner in partners:
            deals = list(self.session.exec(select(Deal).where(Deal.partner_id == partner.id)))
            commissions = list(self.session.exec(select(Commission).where(Commission.partner_id == partner.id)))
            deal_count = len(deals)
            closed_count = len([d for d in deals if d.stage == DealStage.CLOSED])
            conversion = (closed_count / deal_count) if deal_count else 0
            total_volume = sum(d.loan_amount for d in deals)
            owed = sum(c.amount for c in commissions if c.status != CommissionStatus.PAID)

            out.append(
                PartnerAdminMetricsResponse(
                    id=str(partner.id),
                    user_id=str(partner.user_id),
                    company=partner.company,
                    tier=partner.tier,
                    is_approved=partner.is_approved,
                    is_active=partner.is_active,
                    deal_count=deal_count,
                    conversion_rate=round(conversion, 2),
                    total_volume=total_volume,
                    commission_owed=owed,
                )
            )
        return out

    def update_partner(self, partner_id: UUID, payload: PartnerUpdateRequest) -> PartnerProfile:
        partner = self.repo.get_by_id(partner_id)
        if not partner:
            raise NotFoundException("Partner not found")

        status_changed = payload.is_active is not None or payload.is_approved is not None

        if payload.tier is not None:
            partner.tier = payload.tier
        if payload.commission_goal is not None:
            validate_commission_goal(payload.commission_goal)
            partner.commission_goal = payload.commission_goal
        if payload.is_approved is not None:
            partner.is_approved = payload.is_approved
        if payload.is_active is not None:
            partner.is_active = payload.is_active

        if status_changed:
            user = self.session.get(User, partner.user_id)
            if not user:
                raise NotFoundException("Partner user not found")

            if payload.is_active is not None:
                user.is_active = payload.is_active

            if partner.is_active and partner.is_approved:
                user.is_active = True
                user.is_email_verified = True

        self.repo.save(partner)
        self.session.commit()
        self.session.refresh(partner)
        return partner

    def deactivate_partner(self, partner_id: UUID) -> PartnerProfile:
        partner = self.repo.get_by_id(partner_id)
        if not partner:
            raise NotFoundException("Partner not found")
        
        partner.is_active = False
        user = self.session.get(User, partner.user_id)
        if not user:
            raise NotFoundException("Partner user not found")
        user.is_active = False
        
        self.repo.save(partner)
        self.session.commit()
        self.session.refresh(partner)
        return partner

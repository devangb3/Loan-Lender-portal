from __future__ import annotations

from uuid import UUID

from sqlalchemy import case, func
from sqlmodel import Session, select

from app.common.base import CommissionStatus, DealStage
from app.common.exceptions import BadRequestException, NotFoundException
from app.core.config import settings
from app.modules.auth.models import User
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.notifications.service import NotificationService
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

        deal_metrics_stmt = (
            select(
                Deal.partner_id,
                func.count(Deal.id),
                func.sum(case((Deal.stage == DealStage.CLOSED, 1), else_=0)),
                func.coalesce(func.sum(Deal.loan_amount), 0.0),
            )
            .group_by(Deal.partner_id)
        )
        deal_metrics_by_partner = {
            partner_id: {
                "deal_count": int(deal_count or 0),
                "closed_count": int(closed_count or 0),
                "total_volume": float(total_volume or 0),
            }
            for partner_id, deal_count, closed_count, total_volume in self.session.exec(deal_metrics_stmt)
        }

        commission_metrics_stmt = (
            select(
                Commission.partner_id,
                func.coalesce(
                    func.sum(case((Commission.status != CommissionStatus.PAID, Commission.amount), else_=0.0)),
                    0.0,
                ),
            )
            .group_by(Commission.partner_id)
        )
        commission_owed_by_partner = {
            partner_id: float(owed or 0)
            for partner_id, owed in self.session.exec(commission_metrics_stmt)
        }

        out: list[PartnerAdminMetricsResponse] = []
        for partner in partners:
            metrics = deal_metrics_by_partner.get(
                partner.id,
                {"deal_count": 0, "closed_count": 0, "total_volume": 0.0},
            )
            deal_count = metrics["deal_count"]
            closed_count = metrics["closed_count"]
            conversion = (closed_count / deal_count) if deal_count else 0
            total_volume = metrics["total_volume"]
            owed = commission_owed_by_partner.get(partner.id, 0.0)

            out.append(
                PartnerAdminMetricsResponse(
                    id=str(partner.id),
                    user_id=str(partner.user_id),
                    company=partner.company,
                    tier=partner.tier,
                    commission_goal=partner.commission_goal,
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

        was_approved = partner.is_approved
        status_changed = payload.is_active is not None or payload.is_approved is not None

        if payload.tier is not None:
            partner.tier = payload.tier
        if payload.commission_goal is not None:
            validate_commission_goal(payload.commission_goal)
            partner.commission_goal = payload.commission_goal
        if payload.is_approved is True:
            partner.is_approved = True
            partner.is_active = True
        elif payload.is_approved is not None:
            partner.is_approved = payload.is_approved

        if payload.is_active is True and not partner.is_approved:
            raise BadRequestException("Partner must be approved before activation")
        if payload.is_active is not None:
            partner.is_active = payload.is_active

        if status_changed:
            user = self.session.get(User, partner.user_id)
            if not user:
                raise NotFoundException("Partner user not found")

            user.is_active = partner.is_active
            user.is_email_verified = partner.is_approved

            if not was_approved and partner.is_approved:
                login_link = f"{settings.frontend_url.rstrip('/')}/auth/login"
                NotificationService(self.session).send_email(
                    to_email=user.email,
                    subject="Your partner account is approved",
                    html=(
                        "<p>Your partner account has been approved.</p>"
                        f"<p>You can now log in here: <a href='{login_link}'>{login_link}</a></p>"
                    ),
                )

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

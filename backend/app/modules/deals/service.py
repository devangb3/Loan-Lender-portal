from __future__ import annotations

import secrets
from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.common.base import DealStage, UserRole
from app.common.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.core.config import settings
from app.core.security import get_password_hash
from app.modules.auth.models import User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.repository import BorrowerRepository
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.deals.repository import DealRepository
from app.modules.deals.schemas import AdminDealDetailResponse, DealListItem, DealSubmitRequest, PartnerDealDetailResponse
from app.modules.deals.validators import validate_loan_amount
from app.modules.lenders.models import Lender
from app.modules.notifications.service import NotificationService
from app.modules.partners.models import PartnerProfile
from app.modules.pipeline.models import DealStageEvent
from app.modules.pipeline.service import PipelineService
from app.modules.substages.models import SubStage


class DealService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = DealRepository(session)
        self.borrowers = BorrowerRepository(session)
        self.notifications = NotificationService(session)
        self._lender_name_cache: dict[UUID, str | None] = {}
        self._substage_name_cache: dict[UUID, str | None] = {}
        self._partner_name_cache: dict[UUID, str | None] = {}

    def _resolve_lender_name(self, lender_id: UUID | None) -> str | None:
        if lender_id is None:
            return None
        if lender_id in self._lender_name_cache:
            return self._lender_name_cache[lender_id]

        lender = self.session.get(Lender, lender_id)
        lender_name = lender.lender_name if lender else None
        self._lender_name_cache[lender_id] = lender_name
        return lender_name

    def _resolve_partner_name(self, partner_id: UUID | None) -> str | None:
        if partner_id is None:
            return None
        if partner_id in self._partner_name_cache:
            return self._partner_name_cache[partner_id]

        partner = self.session.get(PartnerProfile, partner_id)
        if partner:
            user = self.session.get(User, partner.user_id)
            name = user.full_name if user else None
        else:
            name = None
        self._partner_name_cache[partner_id] = name
        return name

    def _resolve_substage_name(self, substage_id: UUID | None) -> str | None:
        if substage_id is None:
            return None
        if substage_id in self._substage_name_cache:
            return self._substage_name_cache[substage_id]

        substage = self.session.get(SubStage, substage_id)
        name = substage.name if substage else None
        self._substage_name_cache[substage_id] = name
        return name

    def submit_deal(
        self,
        partner: PartnerProfile,
        payload: DealSubmitRequest,
    ) -> Deal:
        validate_loan_amount(payload.loan_amount)
        borrower_email = payload.borrower_email.strip().lower()

        borrower_profile = self.borrowers.get_by_email(borrower_email)
        if not borrower_profile:
            borrower_user = self.session.exec(select(User).where(User.email == borrower_email)).first()
            if borrower_user:
                if borrower_user.role != UserRole.BORROWER:
                    raise BadRequestException("Borrower email already belongs to another account")
                borrower_profile = self.borrowers.get_by_user_id(borrower_user.id)
                if not borrower_profile:
                    borrower_profile = BorrowerProfile(
                        user_id=borrower_user.id,
                        email=borrower_email,
                        phone_number=payload.borrower_phone,
                    )
                    self.borrowers.save(borrower_profile)
            else:
                temp_password = self._generate_temporary_password()
                borrower_user = User(
                    email=borrower_email,
                    hashed_password=get_password_hash(temp_password),
                    role=UserRole.BORROWER,
                    full_name=payload.borrower_name,
                    is_active=True,
                    is_email_verified=True,
                    must_reset_password=True,
                )
                self.session.add(borrower_user)
                self.session.flush()

                borrower_profile = BorrowerProfile(
                    user_id=borrower_user.id,
                    email=borrower_email,
                    phone_number=payload.borrower_phone,
                )
                self.borrowers.save(borrower_profile)

                login_link = f"{settings.frontend_url.rstrip('/')}/auth/login"
                self.notifications.send_email(
                    to_email=borrower_user.email,
                    subject="Your borrower portal access details",
                    html=(
                        "<p>Your loan application has been created in the Loan Referral Platform.</p>"
                        f"<p>Login here: <a href='{login_link}'>{login_link}</a></p>"
                        f"<p>Email: <strong>{borrower_user.email}</strong><br/>"
                        f"Temporary password: <strong>{temp_password}</strong></p>"
                        "<p>Please reset your password after your first login.</p>"
                    ),
                )

        if borrower_profile is None:
            raise BadRequestException("Unable to resolve borrower profile")

        if borrower_profile.phone_number != payload.borrower_phone:
            borrower_profile.phone_number = payload.borrower_phone
            self.borrowers.save(borrower_profile)

        deal = Deal(
            partner_id=partner.id,
            borrower_id=borrower_profile.id,
            property_type=payload.property_type,
            property_address=payload.property_address,
            loan_amount=payload.loan_amount,
            transaction_type=payload.transaction_type,
            borrower_name=payload.borrower_name,
            borrower_email=borrower_email,
            borrower_phone=payload.borrower_phone,
            stage=DealStage.SUBMITTED,
            stage_changed_at=datetime.now(UTC),
        )
        self.repo.create(deal)

        PipelineService(self.session).record_stage_event(
            deal_id=deal.id,
            actor_user_id=partner.user_id,
            from_stage=None,
            to_stage=DealStage.SUBMITTED,
            reason="Deal submitted",
        )

        self.session.commit()
        self.session.refresh(deal)
        return deal

    @staticmethod
    def _generate_temporary_password() -> str:
        return f"Tmp{secrets.token_hex(6)}A1"

    def list_partner_deals(self, partner: PartnerProfile) -> list[DealListItem]:
        deals = self.repo.list_for_partner(partner.id)
        return [
            DealListItem(
                id=str(d.id),
                property_address=d.property_address,
                loan_amount=d.loan_amount,
                stage=d.stage,
                substage_id=str(d.substage_id) if d.substage_id else None,
                lender_id=str(d.lender_id) if d.lender_id else None,
                lender_name=self._resolve_lender_name(d.lender_id),
                created_at=d.created_at,
            )
            for d in deals
        ]

    def list_all_deals(self) -> list[DealListItem]:
        deals = self.repo.list_all()
        return [
            DealListItem(
                id=str(d.id),
                property_address=d.property_address,
                loan_amount=d.loan_amount,
                stage=d.stage,
                substage_id=str(d.substage_id) if d.substage_id else None,
                lender_id=str(d.lender_id) if d.lender_id else None,
                lender_name=self._resolve_lender_name(d.lender_id),
                partner_full_name=self._resolve_partner_name(d.partner_id),
                created_at=d.created_at,
            )
            for d in deals
        ]

    def get_partner_deal(self, deal_id: UUID, partner: PartnerProfile) -> PartnerDealDetailResponse:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        if deal.partner_id != partner.id:
            raise ForbiddenException("Cannot access this deal")
        return self._to_partner_detail(deal)

    def get_admin_deal(self, deal_id: UUID) -> AdminDealDetailResponse:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        return self._to_admin_detail(deal)

    def _to_partner_detail(self, deal: Deal) -> PartnerDealDetailResponse:
        stage_changed_at = deal.stage_changed_at
        if stage_changed_at.tzinfo is None:
            stage_changed_at = stage_changed_at.replace(tzinfo=UTC)
        days = max((datetime.now(UTC) - stage_changed_at).days, 0)
        return PartnerDealDetailResponse(
            id=str(deal.id),
            property_type=deal.property_type,
            property_address=deal.property_address,
            loan_amount=deal.loan_amount,
            transaction_type=deal.transaction_type,
            borrower_name=deal.borrower_name,
            borrower_email=deal.borrower_email,
            borrower_phone=deal.borrower_phone,
            stage=deal.stage,
            substage_id=str(deal.substage_id) if deal.substage_id else None,
            substage_name=self._resolve_substage_name(deal.substage_id),
            lender_id=str(deal.lender_id) if deal.lender_id else None,
            lender_name=self._resolve_lender_name(deal.lender_id),
            created_at=deal.created_at,
            updated_at=deal.updated_at,
            days_in_current_stage=days,
        )

    def _to_admin_detail(self, deal: Deal) -> AdminDealDetailResponse:
        base = self._to_partner_detail(deal)
        partner = self.session.get(PartnerProfile, deal.partner_id)
        partner_user = self.session.get(User, partner.user_id) if partner else None
        return AdminDealDetailResponse(
            **base.model_dump(),
            internal_notes=deal.internal_notes,
            partner_id=str(deal.partner_id),
            partner_company=partner.company if partner else None,
            partner_branch=partner.branch if partner else None,
            partner_phone_number=partner.phone_number if partner else None,
            partner_tier=partner.tier if partner else None,
            partner_full_name=partner_user.full_name if partner_user else None,
            partner_email=partner_user.email if partner_user else None,
        )

    def update_internal_notes(self, deal_id: UUID, notes: str | None) -> Deal:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        deal.internal_notes = notes
        self.repo.save(deal)
        self.session.commit()
        self.session.refresh(deal)
        return deal

    def _delete_related_records(self, deal_id: UUID) -> None:
        """Delete all records related to a deal before deleting the deal itself."""
        # Delete deal stage events
        stage_events = list(self.session.exec(select(DealStageEvent).where(DealStageEvent.deal_id == deal_id)))
        for event in stage_events:
            self.session.delete(event)

        # Delete commission if exists
        commission = self.session.exec(select(Commission).where(Commission.deal_id == deal_id)).first()
        if commission:
            self.session.delete(commission)

    def delete_deal(self, deal_id: UUID) -> None:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")

        self._delete_related_records(deal_id)

        # Now delete the deal itself
        self.repo.delete(deal_id)
        self.session.commit()

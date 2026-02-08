from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Session, select

from app.common.base import DealStage, UserRole
from app.common.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.core.security import get_password_hash
from app.modules.auth.models import AuthToken, User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.repository import BorrowerRepository
from app.modules.commissions.models import Commission
from app.modules.deals.models import Deal
from app.modules.deals.repository import DealRepository
from app.modules.deals.schemas import DealDetailResponse, DealListItem, DealSubmitRequest
from app.modules.deals.validators import validate_loan_amount
from app.modules.notifications.service import NotificationService
from app.modules.partners.models import PartnerProfile
from app.modules.pipeline.models import DealStageEvent
from app.modules.pipeline.service import PipelineService


class DealService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = DealRepository(session)
        self.borrowers = BorrowerRepository(session)
        self.notifications = NotificationService(session)

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
                borrower_user = User(
                    email=borrower_email,
                    hashed_password=get_password_hash(str(uuid4())),
                    role=UserRole.BORROWER,
                    full_name=payload.borrower_name,
                    is_active=False,
                    is_email_verified=False,
                )
                self.session.add(borrower_user)
                self.session.flush()

                borrower_profile = BorrowerProfile(
                    user_id=borrower_user.id,
                    email=borrower_email,
                    phone_number=payload.borrower_phone,
                )
                self.borrowers.save(borrower_profile)

                invite_token = AuthToken(
                    user_id=borrower_user.id,
                    token=str(uuid4()),
                    token_type="borrower_invite",
                    expires_at=AuthToken.default_expiry(72),
                )
                self.session.add(invite_token)
                self.notifications.send_email(
                    to_email=borrower_user.email,
                    subject="You were invited to review your loan status",
                    html=f"Use this invite token to activate your borrower account: {invite_token.token}",
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
                created_at=d.created_at,
            )
            for d in deals
        ]

    def get_partner_deal(self, deal_id: UUID, partner: PartnerProfile) -> DealDetailResponse:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        if deal.partner_id != partner.id:
            raise ForbiddenException("Cannot access this deal")
        return self._to_detail(deal)

    def get_admin_deal(self, deal_id: UUID) -> DealDetailResponse:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        return self._to_detail(deal)

    def _to_detail(self, deal: Deal) -> DealDetailResponse:
        stage_changed_at = deal.stage_changed_at
        if stage_changed_at.tzinfo is None:
            stage_changed_at = stage_changed_at.replace(tzinfo=UTC)
        days = max((datetime.now(UTC) - stage_changed_at).days, 0)
        return DealDetailResponse(
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
            lender_id=str(deal.lender_id) if deal.lender_id else None,
            internal_notes=deal.internal_notes,
            created_at=deal.created_at,
            updated_at=deal.updated_at,
            days_in_current_stage=days,
        )

    def update_internal_notes(self, deal_id: UUID, notes: str | None) -> Deal:
        deal = self.repo.get_by_id(deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        deal.internal_notes = notes
        deal.updated_at = datetime.now(UTC)
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

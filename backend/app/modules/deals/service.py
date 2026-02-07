from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlmodel import Session

from app.common.base import DealStage, UserRole
from app.common.exceptions import ForbiddenException, NotFoundException
from app.core.security import get_password_hash
from app.modules.auth.models import AuthToken, User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.repository import BorrowerRepository
from app.modules.deals.models import Deal
from app.modules.deals.repository import DealRepository
from app.modules.deals.schemas import DealDetailResponse, DealListItem, DealSubmitRequest
from app.modules.deals.validators import validate_loan_amount
from app.modules.files.service import FileService
from app.modules.notifications.service import NotificationService
from app.modules.partners.models import PartnerProfile
from app.modules.pipeline.service import PipelineService


class DealService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = DealRepository(session)
        self.borrowers = BorrowerRepository(session)
        self.notifications = NotificationService(session)

    async def submit_deal(
        self,
        partner: PartnerProfile,
        payload: DealSubmitRequest,
        upload: UploadFile | None,
    ) -> Deal:
        validate_loan_amount(payload.loan_amount)

        borrower = self.borrowers.get_by_email(payload.borrower_email)
        if borrower:
            borrower_profile = borrower
            borrower_user = self.session.get(User, borrower_profile.user_id)
        else:
            borrower_user = User(
                email=payload.borrower_email.lower(),
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
                email=payload.borrower_email.lower(),
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

        deal = Deal(
            partner_id=partner.id,
            borrower_id=borrower_profile.id,
            property_type=payload.property_type,
            property_address=payload.property_address,
            loan_amount=payload.loan_amount,
            transaction_type=payload.transaction_type,
            borrower_name=payload.borrower_name,
            borrower_email=payload.borrower_email.lower(),
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

        if upload:
            await FileService(self.session).save_deal_file(deal.id, partner.user_id, upload)

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
        days = max((datetime.now(UTC) - deal.stage_changed_at).days, 0)
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

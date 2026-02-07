from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.common.base import DealStage
from app.common.exceptions import NotFoundException
from app.modules.auth.models import User
from app.modules.deals.models import Deal
from app.modules.lenders.models import Lender
from app.modules.notifications.service import NotificationService
from app.modules.partners.models import PartnerProfile
from app.modules.pipeline.models import DealStageEvent
from app.modules.pipeline.repository import PipelineRepository
from app.modules.pipeline.schemas import KanbanDealItem, StageEventResponse
from app.modules.pipeline.validators import validate_decline_reason, validate_stage_transition


class PipelineService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = PipelineRepository(session)

    def record_stage_event(
        self,
        deal_id: UUID,
        actor_user_id: UUID,
        from_stage: DealStage | None,
        to_stage: DealStage,
        reason: str | None,
        from_substage_id: UUID | None = None,
        to_substage_id: UUID | None = None,
    ) -> DealStageEvent:
        event = DealStageEvent(
            deal_id=deal_id,
            actor_user_id=actor_user_id,
            from_stage=from_stage,
            to_stage=to_stage,
            from_substage_id=from_substage_id,
            to_substage_id=to_substage_id,
            reason=reason,
        )
        return self.repo.create_event(event)

    def kanban(self) -> dict[str, list[KanbanDealItem]]:
        deals = list(self.session.exec(select(Deal)))
        board: dict[str, list[KanbanDealItem]] = {stage.value: [] for stage in DealStage}
        for deal in deals:
            board[deal.stage.value].append(
                KanbanDealItem(
                    id=str(deal.id),
                    property_address=deal.property_address,
                    loan_amount=deal.loan_amount,
                    partner_id=str(deal.partner_id),
                    borrower_id=str(deal.borrower_id),
                    stage=deal.stage,
                    substage_id=str(deal.substage_id) if deal.substage_id else None,
                )
            )
        return board

    def move_stage(self, deal_id: UUID, actor_user_id: UUID, new_stage: DealStage, reason: str | None) -> Deal:
        deal = self.session.get(Deal, deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        validate_stage_transition(deal.stage, new_stage)

        from_stage = deal.stage
        deal.stage = new_stage
        deal.stage_changed_at = datetime.now(UTC)
        deal.updated_at = datetime.now(UTC)
        self.session.add(deal)

        self.record_stage_event(
            deal_id=deal.id,
            actor_user_id=actor_user_id,
            from_stage=from_stage,
            to_stage=new_stage,
            reason=reason,
            from_substage_id=deal.substage_id,
            to_substage_id=deal.substage_id,
        )

        self.session.commit()
        self.session.refresh(deal)
        return deal

    def update_substage(self, deal_id: UUID, actor_user_id: UUID, substage_id: UUID | None) -> Deal:
        deal = self.session.get(Deal, deal_id)
        if not deal:
            raise NotFoundException("Deal not found")

        old_substage = deal.substage_id
        deal.substage_id = substage_id
        deal.updated_at = datetime.now(UTC)
        self.session.add(deal)

        self.record_stage_event(
            deal_id=deal.id,
            actor_user_id=actor_user_id,
            from_stage=deal.stage,
            to_stage=deal.stage,
            reason="Sub-stage updated",
            from_substage_id=old_substage,
            to_substage_id=substage_id,
        )

        self.session.commit()
        self.session.refresh(deal)
        return deal

    def accept(self, deal_id: UUID, actor_user_id: UUID) -> Deal:
        return self.move_stage(deal_id, actor_user_id, DealStage.ACCEPTED, "Deal accepted")

    def decline(self, deal_id: UUID, actor_user_id: UUID, reason: str) -> Deal:
        validate_decline_reason(reason)
        deal = self.move_stage(deal_id, actor_user_id, DealStage.DECLINED, reason)

        partner = self.session.get(PartnerProfile, deal.partner_id)
        if partner:
            partner_user = self.session.get(User, partner.user_id)
            if partner_user:
                NotificationService(self.session).send_email(
                    to_email=partner_user.email,
                    subject="Deal declined",
                    html=f"Deal at {deal.property_address} was declined. Reason: {reason}",
                )
                self.session.commit()

        return deal

    def assign_lender(self, deal_id: UUID, actor_user_id: UUID, lender_id: UUID) -> Deal:
        deal = self.session.get(Deal, deal_id)
        if not deal:
            raise NotFoundException("Deal not found")
        lender = self.session.get(Lender, lender_id)
        if not lender:
            raise NotFoundException("Lender not found")

        deal.lender_id = lender.id
        deal.updated_at = datetime.now(UTC)
        self.session.add(deal)

        self.record_stage_event(
            deal_id=deal.id,
            actor_user_id=actor_user_id,
            from_stage=deal.stage,
            to_stage=deal.stage,
            reason=f"Assigned lender {lender.lender_name}",
        )

        self.session.commit()
        self.session.refresh(deal)
        return deal

    def list_events(self, deal_id: UUID) -> list[StageEventResponse]:
        events = self.repo.list_events_for_deal(deal_id)
        return [
            StageEventResponse(
                id=str(event.id),
                deal_id=str(event.deal_id),
                from_stage=event.from_stage,
                to_stage=event.to_stage,
                reason=event.reason,
                created_at=event.created_at,
            )
            for event in events
        ]

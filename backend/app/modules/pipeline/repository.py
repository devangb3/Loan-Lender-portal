from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.pipeline.models import DealStageEvent


class PipelineRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_event(self, event: DealStageEvent) -> DealStageEvent:
        self.session.add(event)
        self.session.flush()
        return event

    def list_events_for_deal(self, deal_id: UUID) -> list[DealStageEvent]:
        stmt = select(DealStageEvent).where(DealStageEvent.deal_id == deal_id).order_by(DealStageEvent.created_at)
        return list(self.session.exec(stmt))

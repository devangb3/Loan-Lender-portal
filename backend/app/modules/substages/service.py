from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.common.exceptions import NotFoundException
from app.modules.deals.models import Deal
from app.modules.pipeline.models import DealStageEvent
from app.modules.substages.models import SubStage
from app.modules.substages.repository import SubStageRepository
from app.modules.substages.schemas import SubStageCreateRequest, SubStageResponse, SubStageUpdateRequest
from app.modules.substages.validators import validate_substage_name


class SubStageService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = SubStageRepository(session)

    def create(self, payload: SubStageCreateRequest) -> SubStage:
        validate_substage_name(payload.name)
        item = SubStage(**payload.model_dump())
        self.repo.create(item)
        self.session.commit()
        self.session.refresh(item)
        return item

    def list_all(self) -> list[SubStageResponse]:
        return [
            SubStageResponse(
                id=str(s.id),
                name=s.name,
                main_stage=s.main_stage,
                order_index=s.order_index,
                is_active=s.is_active,
            )
            for s in self.repo.list_all()
        ]

    def update(self, substage_id: UUID, payload: SubStageUpdateRequest) -> SubStage:
        item = self.repo.get(substage_id)
        if not item:
            raise NotFoundException("Sub-stage not found")
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(item, key, value)
        self.repo.save(item)
        self.session.commit()
        self.session.refresh(item)
        return item

    def delete(self, substage_id: UUID) -> None:
        item = self.repo.get(substage_id)
        if not item:
            raise NotFoundException("Sub-stage not found")

        deals = list(self.session.exec(select(Deal).where(Deal.substage_id == substage_id)))
        for deal in deals:
            deal.substage_id = None
            self.session.add(deal)

        events = list(
            self.session.exec(
                select(DealStageEvent).where(
                    (DealStageEvent.from_substage_id == substage_id) | (DealStageEvent.to_substage_id == substage_id)
                )
            )
        )
        for event in events:
            if event.from_substage_id == substage_id:
                event.from_substage_id = None
            if event.to_substage_id == substage_id:
                event.to_substage_id = None
            self.session.add(event)

        self.repo.delete(item)
        self.session.commit()

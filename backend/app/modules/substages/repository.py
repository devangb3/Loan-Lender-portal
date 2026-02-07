from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.substages.models import SubStage


class SubStageRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, item: SubStage) -> SubStage:
        self.session.add(item)
        self.session.flush()
        return item

    def list_all(self) -> list[SubStage]:
        return list(self.session.exec(select(SubStage).order_by(SubStage.main_stage, SubStage.order_index)))

    def get(self, substage_id: UUID) -> SubStage | None:
        return self.session.get(SubStage, substage_id)

    def save(self, item: SubStage) -> SubStage:
        self.session.add(item)
        self.session.flush()
        return item

    def delete(self, item: SubStage) -> None:
        self.session.delete(item)

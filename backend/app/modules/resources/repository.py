from __future__ import annotations

from sqlmodel import Session, select

from app.modules.resources.models import ResourceItem


class ResourceRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_active(self) -> list[ResourceItem]:
        stmt = select(ResourceItem).where(ResourceItem.is_active.is_(True)).order_by(ResourceItem.category, ResourceItem.order_index)
        return list(self.session.exec(stmt))

    def list_all(self) -> list[ResourceItem]:
        stmt = select(ResourceItem).order_by(ResourceItem.category, ResourceItem.order_index)
        return list(self.session.exec(stmt))

    def create(self, item: ResourceItem) -> ResourceItem:
        self.session.add(item)
        self.session.flush()
        return item

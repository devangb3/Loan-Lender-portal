from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.modules.files.models import FileAsset


class FileRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, asset: FileAsset) -> FileAsset:
        self.session.add(asset)
        self.session.flush()
        return asset

    def list_for_deal(self, deal_id: UUID) -> list[FileAsset]:
        stmt = select(FileAsset).where(FileAsset.deal_id == deal_id)
        return list(self.session.exec(stmt))

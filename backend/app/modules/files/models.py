from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class FileAsset(SQLModel, table=True):
    __tablename__ = "file_assets"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    deal_id: UUID = Field(foreign_key="deals.id", index=True)
    uploaded_by_user_id: UUID = Field(foreign_key="users.id", index=True)
    original_filename: str
    storage_path: str
    size_bytes: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

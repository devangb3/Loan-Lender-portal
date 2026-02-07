from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from app.common.base import DealStage


class SubStage(SQLModel, table=True):
    __tablename__ = "sub_stages"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str
    main_stage: DealStage = Field(index=True)
    order_index: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

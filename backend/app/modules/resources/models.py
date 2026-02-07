from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class ResourceItem(SQLModel, table=True):
    __tablename__ = "resource_items"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    category: str = Field(index=True)
    title: str
    content: str
    order_index: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

from __future__ import annotations

from app.common.base import UUIDTimestampModel

from sqlmodel import Field


class ResourceItem(UUIDTimestampModel, table=True):
    __tablename__ = "resource_items"

    category: str = Field(index=True)
    title: str
    content: str
    order_index: int = Field(default=0)
    is_active: bool = Field(default=True)

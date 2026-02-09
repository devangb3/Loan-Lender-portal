from __future__ import annotations

from sqlmodel import Field

from app.common.base import DealStage, UUIDTimestampModel


class SubStage(UUIDTimestampModel, table=True):
    __tablename__ = "sub_stages"

    name: str
    main_stage: DealStage = Field(index=True)
    order_index: int = Field(default=0)
    is_active: bool = Field(default=True)

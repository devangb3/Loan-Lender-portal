from __future__ import annotations

from pydantic import BaseModel

from app.common.base import DealStage


class SubStageCreateRequest(BaseModel):
    name: str
    main_stage: DealStage
    order_index: int = 0
    is_active: bool = True


class SubStageUpdateRequest(BaseModel):
    name: str | None = None
    main_stage: DealStage | None = None
    order_index: int | None = None
    is_active: bool | None = None


class SubStageResponse(BaseModel):
    id: str
    name: str
    main_stage: DealStage
    order_index: int
    is_active: bool

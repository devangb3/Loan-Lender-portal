from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.common.base import DealStage


class KanbanDealItem(BaseModel):
    id: str
    property_address: str
    loan_amount: float
    partner_id: str
    borrower_id: str
    stage: DealStage
    substage_id: str | None


class StageUpdateRequest(BaseModel):
    stage: DealStage
    reason: str | None = None


class SubstageUpdateRequest(BaseModel):
    substage_id: str | None = None


class DeclineRequest(BaseModel):
    reason: str


class LenderAssignRequest(BaseModel):
    lender_id: str


class StageEventResponse(BaseModel):
    id: str
    deal_id: str
    from_stage: DealStage | None
    to_stage: DealStage
    reason: str | None
    created_at: datetime

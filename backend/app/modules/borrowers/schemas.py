from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.common.base import DealStage


class BorrowerDealItem(BaseModel):
    id: str
    property_address: str
    loan_amount: float
    stage: DealStage
    referring_partner_name: str | None
    created_at: datetime
    stage_changed_at: datetime


class BorrowerDashboardResponse(BaseModel):
    deals: list[BorrowerDealItem]

from __future__ import annotations

from pydantic import BaseModel

from app.common.base import CommissionStatus


class CommissionCreateRequest(BaseModel):
    amount: float


class CommissionStatusUpdateRequest(BaseModel):
    status: CommissionStatus


class CommissionResponse(BaseModel):
    id: str
    deal_id: str
    deal_property_address: str | None = None
    partner_id: str
    amount: float
    status: CommissionStatus


class PartnerCommissionSummary(BaseModel):
    ytd_earnings: float
    commission_goal: float
    progress_pct: float
    pending: float
    earned: float
    paid: float

from __future__ import annotations

from pydantic import BaseModel

from app.common.base import PartnerTier


class PartnerProfileResponse(BaseModel):
    id: str
    user_id: str
    company: str
    branch: str | None
    phone_number: str
    tier: PartnerTier
    commission_goal: float
    is_approved: bool
    is_active: bool


class PartnerDashboardResponse(BaseModel):
    deals_submitted: int
    deals_closed: int
    total_loan_volume: float
    pending_commission: float
    ytd_earnings: float


class PartnerAdminMetricsResponse(BaseModel):
    id: str
    user_id: str
    company: str
    tier: PartnerTier
    commission_goal: float
    is_approved: bool
    is_active: bool
    deal_count: int
    conversion_rate: float
    total_volume: float
    commission_owed: float


class PartnerUpdateRequest(BaseModel):
    tier: PartnerTier | None = None
    commission_goal: float | None = None
    is_approved: bool | None = None
    is_active: bool | None = None

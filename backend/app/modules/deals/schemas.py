from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.common.base import DealStage, PartnerTier, PropertyType, TransactionType


class DealSubmitRequest(BaseModel):
    property_type: PropertyType
    property_address: str
    loan_amount: float
    transaction_type: TransactionType
    borrower_name: str
    borrower_email: EmailStr
    borrower_phone: str


class DealListItem(BaseModel):
    id: str
    property_address: str
    loan_amount: float
    stage: DealStage
    substage_id: str | None
    lender_id: str | None
    lender_name: str | None = None
    partner_full_name: str | None = None
    created_at: datetime


class PartnerDealDetailResponse(BaseModel):
    id: str
    property_type: PropertyType
    property_address: str
    loan_amount: float
    transaction_type: TransactionType
    borrower_name: str
    borrower_email: EmailStr
    borrower_phone: str
    stage: DealStage
    substage_id: str | None
    substage_name: str | None = None
    lender_id: str | None
    lender_name: str | None = None
    created_at: datetime
    updated_at: datetime
    days_in_current_stage: int


class AdminDealDetailResponse(PartnerDealDetailResponse):
    internal_notes: str | None
    partner_id: str
    partner_company: str | None = None
    partner_branch: str | None = None
    partner_phone_number: str | None = None
    partner_tier: PartnerTier | None = None
    partner_full_name: str | None = None
    partner_email: EmailStr | None = None


class DealNotesUpdateRequest(BaseModel):
    internal_notes: str | None = None

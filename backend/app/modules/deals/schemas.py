from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.common.base import DealStage, PropertyType, TransactionType


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
    created_at: datetime


class DealDetailResponse(BaseModel):
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
    lender_id: str | None
    internal_notes: str | None
    created_at: datetime
    updated_at: datetime
    days_in_current_stage: int


class DealNotesUpdateRequest(BaseModel):
    internal_notes: str | None = None

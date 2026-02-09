from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Field

from app.common.base import DealStage, PropertyType, TransactionType, UUIDTimestampModel


class Deal(UUIDTimestampModel, table=True):
    __tablename__ = "deals"

    partner_id: UUID = Field(foreign_key="partner_profiles.id", index=True)
    borrower_id: UUID = Field(foreign_key="borrower_profiles.id", index=True)
    lender_id: UUID | None = Field(default=None, foreign_key="lenders.id", index=True)
    substage_id: UUID | None = Field(default=None, foreign_key="sub_stages.id", index=True)

    property_type: PropertyType
    property_address: str
    loan_amount: float
    transaction_type: TransactionType

    borrower_name: str
    borrower_email: str
    borrower_phone: str

    stage: DealStage = Field(default=DealStage.SUBMITTED, index=True)
    stage_changed_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    internal_notes: str | None = None

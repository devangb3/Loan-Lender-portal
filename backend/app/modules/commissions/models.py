from __future__ import annotations

from uuid import UUID

from sqlmodel import Field

from app.common.base import CommissionStatus, UUIDTimestampModel


class Commission(UUIDTimestampModel, table=True):
    __tablename__ = "commissions"

    deal_id: UUID = Field(foreign_key="deals.id", unique=True, index=True)
    partner_id: UUID = Field(foreign_key="partner_profiles.id", index=True)
    amount: float
    status: CommissionStatus = Field(default=CommissionStatus.PENDING, index=True)

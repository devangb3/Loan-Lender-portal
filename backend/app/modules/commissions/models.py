from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from app.common.base import CommissionStatus


class Commission(SQLModel, table=True):
    __tablename__ = "commissions"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    deal_id: UUID = Field(foreign_key="deals.id", unique=True, index=True)
    partner_id: UUID = Field(foreign_key="partner_profiles.id", index=True)
    amount: float
    status: CommissionStatus = Field(default=CommissionStatus.PENDING, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class UserRole(str, Enum):
    PARTNER = "partner"
    BORROWER = "borrower"
    ADMIN = "admin"


class DealStage(str, Enum):
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    CLOSING = "closing"
    CLOSED = "closed"
    DECLINED = "declined"


class CommissionStatus(str, Enum):
    PENDING = "pending"
    EARNED = "earned"
    PAID = "paid"


class PartnerTier(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


class PropertyType(str, Enum):
    MULTIFAMILY = "multifamily"
    RETAIL = "retail"
    OFFICE = "office"
    INDUSTRIAL = "industrial"
    MIXED_USE = "mixed_use"
    LAND = "land"
    HOSPITALITY = "hospitality"
    OTHER = "other"


class TransactionType(str, Enum):
    PURCHASE = "purchase"
    REFINANCE = "refinance"
    CASH_OUT_REFINANCE = "cash_out_refinance"
    CONSTRUCTION = "construction"
    BRIDGE = "bridge"


class TimestampModel(SQLModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

    @field_validator("created_at", "updated_at", mode="before")
    @classmethod
    def ensure_datetime(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value


class UUIDModel(SQLModel):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)


class UUIDTimestampModel(UUIDModel, TimestampModel):
    pass

from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from app.common.base import PartnerTier


class PartnerProfile(SQLModel, table=True):
    __tablename__ = "partner_profiles"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, index=True)
    company: str
    branch: str | None = None
    phone_number: str
    tier: PartnerTier = Field(default=PartnerTier.BRONZE)
    commission_goal: float = Field(default=0)
    is_approved: bool = Field(default=False)
    is_active: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

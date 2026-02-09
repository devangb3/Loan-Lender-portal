from __future__ import annotations

from uuid import UUID

from sqlmodel import Field

from app.common.base import PartnerTier, UUIDTimestampModel


class PartnerProfile(UUIDTimestampModel, table=True):
    __tablename__ = "partner_profiles"

    user_id: UUID = Field(foreign_key="users.id", unique=True, index=True)
    company: str
    branch: str | None = None
    phone_number: str
    tier: PartnerTier = Field(default=PartnerTier.BRONZE)
    commission_goal: float = Field(default=0)
    is_approved: bool = Field(default=False)
    is_active: bool = Field(default=False)

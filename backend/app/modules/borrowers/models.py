from __future__ import annotations

from uuid import UUID

from sqlmodel import Field

from app.common.base import UUIDTimestampModel


class BorrowerProfile(UUIDTimestampModel, table=True):
    __tablename__ = "borrower_profiles"

    user_id: UUID = Field(foreign_key="users.id", unique=True, index=True)
    email: str = Field(index=True)
    phone_number: str | None = None

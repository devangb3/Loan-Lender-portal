from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class BorrowerProfile(SQLModel, table=True):
    __tablename__ = "borrower_profiles"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, index=True)
    email: str = Field(index=True)
    phone_number: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

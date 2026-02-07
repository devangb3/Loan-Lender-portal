from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Lender(SQLModel, table=True):
    __tablename__ = "lenders"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    lender_name: str = Field(index=True)
    contact_name: str
    contact_email: str
    contact_phone: str
    specialty: str
    property_types: str
    states: str
    min_loan: float
    max_loan: float
    notes: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

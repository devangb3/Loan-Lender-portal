from __future__ import annotations

from app.common.base import UUIDTimestampModel
from sqlmodel import Field


class Lender(UUIDTimestampModel, table=True):
    __tablename__ = "lenders"

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

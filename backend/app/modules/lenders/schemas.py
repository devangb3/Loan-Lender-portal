from __future__ import annotations

from pydantic import BaseModel


class LenderResponse(BaseModel):
    id: str
    lender_name: str
    contact_name: str
    contact_email: str
    contact_phone: str
    specialty: str
    property_types: str
    states: str
    min_loan: float
    max_loan: float
    notes: str | None


class LenderImportError(BaseModel):
    row_number: int
    error: str


class LenderImportResponse(BaseModel):
    imported_count: int
    skipped_count: int
    errors: list[LenderImportError]

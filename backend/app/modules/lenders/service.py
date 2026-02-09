from __future__ import annotations

import csv
import io
from uuid import UUID

from fastapi import UploadFile
from sqlmodel import Session, select

from app.common.exceptions import NotFoundException
from app.common.utils import paginate
from app.modules.deals.models import Deal
from app.modules.lenders.models import Lender
from app.modules.lenders.repository import LenderRepository
from app.modules.lenders.schemas import LenderImportError, LenderImportResponse, LenderResponse
from app.modules.lenders.validators import parse_float, validate_csv_columns


class LenderService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = LenderRepository(session)

    async def import_csv(self, upload: UploadFile) -> LenderImportResponse:
        raw = (await upload.read()).decode("utf-8", errors="replace")
        reader = csv.DictReader(io.StringIO(raw))
        validate_csv_columns(reader.fieldnames or [])

        lenders: list[Lender] = []
        errors: list[LenderImportError] = []

        for idx, row in enumerate(reader, start=2):
            try:
                lenders.append(
                    Lender(
                        lender_name=(row.get("lender_name") or "").strip(),
                        contact_name=(row.get("contact_name") or "").strip(),
                        contact_email=(row.get("contact_email") or "").strip(),
                        contact_phone=(row.get("contact_phone") or "").strip(),
                        specialty=(row.get("specialty") or "").strip(),
                        property_types=(row.get("property_types") or "").strip(),
                        states=(row.get("states") or "").strip(),
                        min_loan=parse_float((row.get("min_loan") or "0").strip(), "min_loan"),
                        max_loan=parse_float((row.get("max_loan") or "0").strip(), "max_loan"),
                        notes=(row.get("notes") or "").strip() or None,
                    )
                )
            except Exception as exc:
                errors.append(LenderImportError(row_number=idx, error=str(exc)))

        if lenders:
            self.repo.create_many(lenders)
        self.session.commit()

        return LenderImportResponse(imported_count=len(lenders), skipped_count=len(errors), errors=errors)

    def list_lenders(
        self,
        page: int,
        page_size: int,
        query: str | None,
        specialty: str | None,
        state: str | None,
        property_type: str | None,
        min_loan: float | None,
        max_loan: float | None,
    ) -> list[LenderResponse]:
        offset, limit = paginate(page, page_size)
        lenders = self.repo.list_filtered(query, specialty, state, property_type, min_loan, max_loan, offset, limit)

        return [
            LenderResponse(
                id=str(item.id),
                lender_name=item.lender_name,
                contact_name=item.contact_name,
                contact_email=item.contact_email,
                contact_phone=item.contact_phone,
                specialty=item.specialty,
                property_types=item.property_types,
                states=item.states,
                min_loan=item.min_loan,
                max_loan=item.max_loan,
                notes=item.notes,
            )
            for item in lenders
        ]

    def _delete_related_records(self, lender_id: UUID) -> None:
        """Handle related records before deleting a lender."""
        deals = list(self.session.exec(select(Deal).where(Deal.lender_id == lender_id)))
        for deal in deals:
            deal.lender_id = None
            self.session.add(deal)

    def delete_lender(self, lender_id: UUID) -> None:
        lender = self.repo.get_by_id(lender_id)
        if not lender:
            raise NotFoundException("Lender not found")

        self._delete_related_records(lender_id)

        self.repo.delete(lender_id)
        self.session.commit()

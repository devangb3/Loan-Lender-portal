from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.lenders.schemas import LenderImportResponse, LenderResponse
from app.modules.lenders.service import LenderService

router = APIRouter()


@router.post("/admin/lenders/import", response_model=LenderImportResponse)
async def import_lenders_csv(
    file: UploadFile = File(...),
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> LenderImportResponse:
    return await LenderService(session).import_csv(file)


@router.get("/admin/lenders", response_model=list[LenderResponse])
def list_lenders(
    page: int = 1,
    page_size: int = 20,
    query: str | None = None,
    specialty: str | None = None,
    state: str | None = None,
    property_type: str | None = None,
    min_loan: float | None = None,
    max_loan: float | None = None,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[LenderResponse]:
    return LenderService(session).list_lenders(page, page_size, query, specialty, state, property_type, min_loan, max_loan)

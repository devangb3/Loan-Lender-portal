from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.exports.service import ExportService

router = APIRouter()


@router.get("/admin/exports/deals")
def export_deals(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> StreamingResponse:
    return ExportService(session).export_deals()


@router.get("/admin/exports/partners")
def export_partners(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> StreamingResponse:
    return ExportService(session).export_partners()


@router.get("/admin/exports/borrowers")
def export_borrowers(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> StreamingResponse:
    return ExportService(session).export_borrowers()


@router.get("/admin/exports/commissions")
def export_commissions(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> StreamingResponse:
    return ExportService(session).export_commissions()

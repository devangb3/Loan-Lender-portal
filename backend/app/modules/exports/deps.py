from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.exports.repository import ExportRepository


def get_export_repository(session: Session = Depends(get_session)) -> ExportRepository:
    return ExportRepository(session)

from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.lenders.repository import LenderRepository


def get_lender_repository(session: Session = Depends(get_session)) -> LenderRepository:
    return LenderRepository(session)

from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.commissions.repository import CommissionRepository


def get_commission_repository(session: Session = Depends(get_session)) -> CommissionRepository:
    return CommissionRepository(session)

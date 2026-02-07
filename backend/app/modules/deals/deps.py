from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.deals.repository import DealRepository


def get_deal_repository(session: Session = Depends(get_session)) -> DealRepository:
    return DealRepository(session)

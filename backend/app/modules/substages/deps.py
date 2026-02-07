from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.substages.repository import SubStageRepository


def get_substage_repository(session: Session = Depends(get_session)) -> SubStageRepository:
    return SubStageRepository(session)

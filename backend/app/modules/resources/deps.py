from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.resources.repository import ResourceRepository


def get_resource_repository(session: Session = Depends(get_session)) -> ResourceRepository:
    return ResourceRepository(session)

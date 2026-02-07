from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.files.repository import FileRepository


def get_file_repository(session: Session = Depends(get_session)) -> FileRepository:
    return FileRepository(session)

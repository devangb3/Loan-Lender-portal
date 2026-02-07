from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.notifications.repository import NotificationRepository


def get_notification_repository(session: Session = Depends(get_session)) -> NotificationRepository:
    return NotificationRepository(session)

from __future__ import annotations

from sqlmodel import Session

from app.modules.notifications.models import NotificationLog


class NotificationRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, log: NotificationLog) -> NotificationLog:
        self.session.add(log)
        self.session.flush()
        return log

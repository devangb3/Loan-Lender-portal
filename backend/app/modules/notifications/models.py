from __future__ import annotations

from sqlmodel import Field

from app.common.base import UUIDTimestampModel


class NotificationLog(UUIDTimestampModel, table=True):
    __tablename__ = "notification_logs"

    recipient_email: str = Field(index=True)
    subject: str
    provider: str = "console"
    status: str = "queued"

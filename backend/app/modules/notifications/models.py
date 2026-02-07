from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class NotificationLog(SQLModel, table=True):
    __tablename__ = "notification_logs"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    recipient_email: str = Field(index=True)
    subject: str
    provider: str = "resend"
    status: str = "queued"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

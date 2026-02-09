from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlmodel import Field, SQLModel

from app.common.base import UUIDTimestampModel, UserRole


class User(UUIDTimestampModel, table=True):
    __tablename__ = "users"

    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: UserRole
    is_active: bool = Field(default=True)
    is_email_verified: bool = Field(default=False)
    must_reset_password: bool = Field(default=False)
    full_name: str | None = None


class AuthToken(UUIDTimestampModel, table=True):
    __tablename__ = "auth_tokens"

    user_id: UUID = Field(foreign_key="users.id", index=True)
    token: str = Field(index=True, unique=True)
    token_type: str = Field(index=True)
    expires_at: datetime
    consumed_at: datetime | None = None

    @staticmethod
    def default_expiry(hours: int = 24) -> datetime:
        return datetime.now(UTC) + timedelta(hours=hours)

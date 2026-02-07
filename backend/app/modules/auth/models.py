from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from app.common.base import UserRole


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: UserRole
    is_active: bool = Field(default=True)
    is_email_verified: bool = Field(default=False)
    full_name: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)


class AuthToken(SQLModel, table=True):
    __tablename__ = "auth_tokens"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    token: str = Field(index=True, unique=True)
    token_type: str = Field(index=True)
    expires_at: datetime
    consumed_at: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

    @staticmethod
    def default_expiry(hours: int = 24) -> datetime:
        return datetime.now(UTC) + timedelta(hours=hours)

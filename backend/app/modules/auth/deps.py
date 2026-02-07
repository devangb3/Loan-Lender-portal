from __future__ import annotations

from collections.abc import Callable
from typing import Annotated
from uuid import UUID

from fastapi import Cookie, Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.common.exceptions import ForbiddenException
from app.core.db import get_session
from app.core.security import TokenError, decode_token
from app.modules.auth.models import User
from app.modules.auth.repository import AuthRepository


def get_current_user(
    access_token: Annotated[str | None, Cookie(alias="access_token")] = None,
    session: Session = Depends(get_session),
) -> User:
    if not access_token:
        raise ForbiddenException("Not authenticated")

    try:
        payload = decode_token(access_token, expected_type="access")
    except TokenError as exc:
        raise ForbiddenException("Invalid session") from exc

    user_id = UUID(payload["sub"])
    repo = AuthRepository(session)
    user = repo.get_user_by_id(user_id)
    if not user or not user.is_active:
        raise ForbiddenException("User not active")

    return user


def require_roles(*roles: UserRole) -> Callable:
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise ForbiddenException("Insufficient permissions")
        return user

    return dependency

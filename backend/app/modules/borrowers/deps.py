from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.common.exceptions import ForbiddenException
from app.core.db import get_session
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.borrowers.models import BorrowerProfile
from app.modules.borrowers.repository import BorrowerRepository


def get_current_borrower_profile(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> BorrowerProfile:
    if user.role != UserRole.BORROWER:
        raise ForbiddenException("Borrower role required")
    profile = BorrowerRepository(session).get_by_user_id(user.id)
    if not profile:
        raise ForbiddenException("Borrower profile missing")
    return profile

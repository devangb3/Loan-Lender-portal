from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.common.exceptions import ForbiddenException
from app.core.db import get_session
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.partners.models import PartnerProfile
from app.modules.partners.repository import PartnerRepository


def get_current_partner_profile(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> PartnerProfile:
    if user.role != UserRole.PARTNER:
        raise ForbiddenException("Partner role required")

    profile = PartnerRepository(session).get_by_user_id(user.id)
    if not profile:
        raise ForbiddenException("Partner profile missing")
    return profile

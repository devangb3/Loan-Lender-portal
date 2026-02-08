from __future__ import annotations

from app.common.base import UserRole
from app.modules.auth.models import User
from app.modules.partners.models import PartnerProfile
from app.modules.partners.schemas import PartnerUpdateRequest
from app.modules.partners.service import PartnerService


class _RepoStub:
    def __init__(self, partner: PartnerProfile):
        self.partner = partner

    def get_by_id(self, partner_id):  # noqa: ANN001
        if partner_id == self.partner.id:
            return self.partner
        return None

    def save(self, partner: PartnerProfile) -> PartnerProfile:
        self.partner = partner
        return partner


class _SessionStub:
    def __init__(self, user: User):
        self.user = user
        self.commit_called = False
        self.refreshed = None

    def get(self, model, key):  # noqa: ANN001
        if model is User and key == self.user.id:
            return self.user
        return None

    def commit(self) -> None:
        self.commit_called = True

    def refresh(self, obj) -> None:  # noqa: ANN001
        self.refreshed = obj


def _build_user_partner(*, user_active: bool, user_verified: bool, partner_active: bool, partner_approved: bool) -> tuple[User, PartnerProfile]:
    user = User(
        email="partner@example.com",
        hashed_password="hashed",
        role=UserRole.PARTNER,
        is_active=user_active,
        is_email_verified=user_verified,
    )
    partner = PartnerProfile(
        user_id=user.id,
        company="Acme Lending",
        phone_number="1234567890",
        is_active=partner_active,
        is_approved=partner_approved,
    )
    return user, partner


def test_admin_activation_marks_user_verified_for_partner_login() -> None:
    user, partner = _build_user_partner(
        user_active=True,
        user_verified=False,
        partner_active=False,
        partner_approved=False,
    )
    session = _SessionStub(user)
    service = PartnerService(session)  # type: ignore[arg-type]
    service.repo = _RepoStub(partner)  # type: ignore[assignment]

    updated = service.update_partner(partner.id, PartnerUpdateRequest(is_active=True, is_approved=True))

    assert updated.is_active is True
    assert updated.is_approved is True
    assert user.is_active is True
    assert user.is_email_verified is True
    assert session.commit_called is True
    assert session.refreshed is partner


def test_admin_deactivation_syncs_user_active_flag() -> None:
    user, partner = _build_user_partner(
        user_active=True,
        user_verified=True,
        partner_active=True,
        partner_approved=True,
    )
    session = _SessionStub(user)
    service = PartnerService(session)  # type: ignore[arg-type]
    service.repo = _RepoStub(partner)  # type: ignore[assignment]

    updated = service.update_partner(partner.id, PartnerUpdateRequest(is_active=False, is_approved=False))

    assert updated.is_active is False
    assert updated.is_approved is False
    assert user.is_active is False
    assert user.is_email_verified is True
    assert session.commit_called is True
    assert session.refreshed is partner

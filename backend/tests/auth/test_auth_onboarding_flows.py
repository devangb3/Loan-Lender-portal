from __future__ import annotations

from uuid import uuid4

import pytest
from sqlmodel import SQLModel, Session, create_engine, select

from app.common.base import PartnerTier, PropertyType, TransactionType, UserRole
from app.common.exceptions import ForbiddenException
from app.core.security import get_password_hash, verify_password
from app.modules.auth.models import AuthToken, User
from app.modules.auth.schemas import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    PartnerSignupRequest,
    ResetPasswordRequest,
)
from app.modules.auth.service import AuthService
from app.modules.deals.service import DealService
from app.modules.deals.schemas import DealSubmitRequest
from app.modules.partners.models import PartnerProfile
from app.modules.partners.schemas import PartnerUpdateRequest
from app.modules.partners.service import PartnerService

# Ensure all SQLModel tables are registered before create_all().
from app.modules.auth import models as _auth_models  # noqa: F401
from app.modules.borrowers import models as _borrower_models  # noqa: F401
from app.modules.commissions import models as _commission_models  # noqa: F401
from app.modules.deals import models as _deal_models  # noqa: F401
from app.modules.lenders import models as _lender_models  # noqa: F401
from app.modules.notifications import models as _notification_models  # noqa: F401
from app.modules.partners import models as _partner_models  # noqa: F401
from app.modules.pipeline import models as _pipeline_models  # noqa: F401
from app.modules.resources import models as _resource_models  # noqa: F401
from app.modules.substages import models as _substage_models  # noqa: F401


@pytest.fixture
def session() -> Session:
  engine = create_engine("sqlite://", connect_args={"check_same_thread": False})
  SQLModel.metadata.create_all(engine)
  with Session(engine) as db_session:
    yield db_session


def test_partner_signup_does_not_create_verify_token(session: Session) -> None:
  service = AuthService(session)
  user = service.signup_partner(
    PartnerSignupRequest(
      name="Partner User",
      email="partner@example.com",
      password="StrongPass1",
      company="Acme Lending",
      branch="Austin",
      phone_number="5551234567",
    )
  )

  partner = session.exec(select(PartnerProfile).where(PartnerProfile.user_id == user.id)).first()
  tokens = list(session.exec(select(AuthToken).where(AuthToken.user_id == user.id)))

  assert user.is_active is False
  assert user.is_email_verified is False
  assert partner is not None
  assert partner.is_approved is False
  assert partner.is_active is False
  assert tokens == []


def test_partner_first_approval_sends_single_email(session: Session, monkeypatch: pytest.MonkeyPatch) -> None:
  sent_messages: list[dict[str, str]] = []

  def fake_send_email(self, to_email: str, subject: str, html: str) -> None:
    sent_messages.append({"to": to_email, "subject": subject, "html": html})

  monkeypatch.setattr("app.modules.partners.service.NotificationService.send_email", fake_send_email)

  user = User(
    email="newpartner@example.com",
    hashed_password=get_password_hash("StrongPass1"),
    role=UserRole.PARTNER,
    full_name="New Partner",
    is_active=False,
    is_email_verified=False,
  )
  session.add(user)
  session.flush()

  partner = PartnerProfile(
    user_id=user.id,
    company="Summit Capital",
    branch=None,
    phone_number="5559876543",
    tier=PartnerTier.BRONZE,
    is_approved=False,
    is_active=False,
  )
  session.add(partner)
  session.commit()
  session.refresh(partner)

  service = PartnerService(session)
  service.update_partner(partner.id, PartnerUpdateRequest(is_approved=True))

  refreshed_user = session.get(User, user.id)
  refreshed_partner = session.get(PartnerProfile, partner.id)
  assert refreshed_user is not None
  assert refreshed_partner is not None
  assert refreshed_partner.is_approved is True
  assert refreshed_partner.is_active is True
  assert refreshed_user.is_active is True
  assert refreshed_user.is_email_verified is True
  assert len(sent_messages) == 1
  assert sent_messages[0]["subject"] == "Your partner account is approved"

  service.update_partner(partner.id, PartnerUpdateRequest(is_active=True))
  assert len(sent_messages) == 1


def test_new_borrower_gets_temp_password_and_is_not_resent(session: Session, monkeypatch: pytest.MonkeyPatch) -> None:
  sent_messages: list[dict[str, str]] = []

  def fake_send_email(self, to_email: str, subject: str, html: str) -> None:
    sent_messages.append({"to": to_email, "subject": subject, "html": html})

  monkeypatch.setattr("app.modules.notifications.service.NotificationService.send_email", fake_send_email)

  partner_user = User(
    email="approved.partner@example.com",
    hashed_password=get_password_hash("StrongPass1"),
    role=UserRole.PARTNER,
    full_name="Approved Partner",
    is_active=True,
    is_email_verified=True,
  )
  session.add(partner_user)
  session.flush()

  partner_profile = PartnerProfile(
    user_id=partner_user.id,
    company="Peak Finance",
    branch=None,
    phone_number="5551112233",
    tier=PartnerTier.SILVER,
    is_approved=True,
    is_active=True,
  )
  session.add(partner_profile)
  session.commit()
  session.refresh(partner_profile)

  deal_service = DealService(session)
  payload = DealSubmitRequest(
    property_type=PropertyType.MULTIFAMILY,
    property_address="123 Main St, Austin, TX",
    loan_amount=500000,
    transaction_type=TransactionType.PURCHASE,
    borrower_name="Borrower User",
    borrower_email="borrower@example.com",
    borrower_phone="5552223344",
  )

  deal_service.submit_deal(partner_profile, payload)

  borrower_user = session.exec(select(User).where(User.email == "borrower@example.com")).first()
  assert borrower_user is not None
  assert borrower_user.role == UserRole.BORROWER
  assert borrower_user.is_active is True
  assert borrower_user.is_email_verified is True
  assert borrower_user.must_reset_password is True
  assert len(sent_messages) == 1
  assert "Temporary password" in sent_messages[0]["html"]
  assert "/auth/login" in sent_messages[0]["html"]

  first_hash = borrower_user.hashed_password

  second_payload = payload.model_copy(update={"property_address": "456 Oak Ave, Austin, TX"})
  deal_service.submit_deal(partner_profile, second_payload)

  borrower_user_after = session.exec(select(User).where(User.email == "borrower@example.com")).first()
  assert borrower_user_after is not None
  assert borrower_user_after.hashed_password == first_hash
  assert len(sent_messages) == 1


def test_forgot_password_sends_reset_link_and_reset_clears_must_reset(
  session: Session,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  sent_messages: list[dict[str, str]] = []

  def fake_send_email(self, to_email: str, subject: str, html: str) -> None:
    sent_messages.append({"to": to_email, "subject": subject, "html": html})

  monkeypatch.setattr("app.modules.notifications.service.NotificationService.send_email", fake_send_email)

  user = User(
    email="reset.user@example.com",
    hashed_password=get_password_hash("StrongPass1"),
    role=UserRole.BORROWER,
    full_name="Reset User",
    is_active=True,
    is_email_verified=True,
    must_reset_password=True,
  )
  session.add(user)
  session.commit()
  session.refresh(user)

  service = AuthService(session)
  service.forgot_password(ForgotPasswordRequest(email=user.email))

  token = session.exec(select(AuthToken).where(AuthToken.user_id == user.id, AuthToken.token_type == "password_reset")).first()
  assert token is not None
  assert len(sent_messages) == 1
  assert "/auth/reset-password?token=" in sent_messages[0]["html"]

  service.reset_password(ResetPasswordRequest(token=token.token, new_password="ResetPass2"))

  refreshed_user = session.get(User, user.id)
  refreshed_token = session.get(AuthToken, token.id)
  assert refreshed_user is not None
  assert refreshed_token is not None
  assert refreshed_user.must_reset_password is False
  assert verify_password("ResetPass2", refreshed_user.hashed_password) is True
  assert refreshed_token.consumed_at is not None


def test_change_password_requires_current_password_and_clears_flag(session: Session) -> None:
  user = User(
    email=f"change-{uuid4()}@example.com",
    hashed_password=get_password_hash("StrongPass1"),
    role=UserRole.ADMIN,
    full_name="Admin User",
    is_active=True,
    is_email_verified=True,
    must_reset_password=True,
  )
  session.add(user)
  session.commit()
  session.refresh(user)

  service = AuthService(session)
  with pytest.raises(ForbiddenException):
    service.change_password(user, ChangePasswordRequest(current_password="WrongPass1", new_password="BrandNew1"))

  service.change_password(user, ChangePasswordRequest(current_password="StrongPass1", new_password="BrandNew1"))
  refreshed_user = session.get(User, user.id)
  assert refreshed_user is not None
  assert refreshed_user.must_reset_password is False
  assert verify_password("BrandNew1", refreshed_user.hashed_password) is True

from __future__ import annotations
import datetime
from datetime import UTC
from uuid import uuid4

from sqlmodel import Session
from sqlmodel import select

from app.common.base import PartnerTier, UserRole
from app.common.exceptions import BadRequestException, ForbiddenException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.modules.auth.models import AuthToken, User
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import (
    BorrowerInviteAcceptRequest,
    ForgotPasswordRequest,
    LoginRequest,
    PartnerSignupRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
)
from app.modules.auth.validators import validate_password
from app.modules.notifications.service import NotificationService
from app.modules.partners.models import PartnerProfile


class AuthService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = AuthRepository(session)
        self.notifications = NotificationService(session)

    def signup_partner(self, payload: PartnerSignupRequest) -> User:
        validate_password(payload.password)
        existing = self.repo.get_user_by_email(payload.email)
        if existing:
            raise BadRequestException("Email already in use")

        user = User(
            email=payload.email.lower(),
            hashed_password=get_password_hash(payload.password),
            role=UserRole.PARTNER,
            full_name=payload.name,
            is_email_verified=False,
        )
        self.repo.create_user(user)

        partner_profile = PartnerProfile(
            user_id=user.id,
            company=payload.company,
            branch=payload.branch,
            phone_number=payload.phone_number,
            tier=PartnerTier.BRONZE,
            is_approved=False,
            is_active=False,
        )
        self.session.add(partner_profile)

        verify_token = AuthToken(
            user_id=user.id,
            token=str(uuid4()),
            token_type="verify_email",
            expires_at=AuthToken.default_expiry(48),
        )
        self.repo.create_token(verify_token)

        self.notifications.send_email(
            to_email=user.email,
            subject="Verify your partner account",
            html=f"Use token {verify_token.token} to verify your account.",
        )

        self.session.commit()
        self.session.refresh(user)
        return user

    def login(self, payload: LoginRequest) -> tuple[User, str, str]:
        user = self.repo.get_user_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise ForbiddenException("Invalid email or password")
        if not user.is_active:
            raise ForbiddenException("Account inactive")
        if not user.is_email_verified:
            raise ForbiddenException("Email verification required")
        if user.role == UserRole.PARTNER:
            partner_profile = self.session.exec(
                select(PartnerProfile).where(PartnerProfile.user_id == user.id)
            ).first()
            if not partner_profile or not (partner_profile.is_active and partner_profile.is_approved):
                raise ForbiddenException("Partner account pending approval/activation")

        access = create_access_token(str(user.id))
        refresh = create_refresh_token(str(user.id))
        return user, access, refresh

    def forgot_password(self, payload: ForgotPasswordRequest) -> None:
        user = self.repo.get_user_by_email(payload.email)
        if not user:
            return

        token = AuthToken(
            user_id=user.id,
            token=str(uuid4()),
            token_type="password_reset",
            expires_at=AuthToken.default_expiry(2),
        )
        self.repo.create_token(token)
        self.notifications.send_email(
            to_email=user.email,
            subject="Reset your password",
            html=f"Reset token: {token.token}",
        )
        self.session.commit()

    def reset_password(self, payload: ResetPasswordRequest) -> None:
        validate_password(payload.new_password)
        token = self.repo.get_valid_token(payload.token, "password_reset")
        if not token:
            raise BadRequestException("Invalid or expired reset token")

        user = self.repo.get_user_by_id(token.user_id)
        if not user:
            raise BadRequestException("Invalid reset user")

        user.hashed_password = get_password_hash(payload.new_password)
        user.updated_at = datetime.now(UTC)
        self.repo.save(user)
        self.repo.consume_token(token)
        self.session.commit()

    def verify_email(self, payload: VerifyEmailRequest) -> User:
        token = self.repo.get_valid_token(payload.token, "verify_email")
        if not token:
            raise BadRequestException("Invalid or expired verification token")

        user = self.repo.get_user_by_id(token.user_id)
        if not user:
            raise BadRequestException("User not found")

        user.is_email_verified = True
        self.repo.save(user)
        self.repo.consume_token(token)
        self.session.commit()
        self.session.refresh(user)
        return user

    def accept_borrower_invite(self, payload: BorrowerInviteAcceptRequest) -> User:
        validate_password(payload.password)
        token = self.repo.get_valid_token(payload.token, "borrower_invite")
        if not token:
            raise BadRequestException("Invalid or expired invite token")

        user = self.repo.get_user_by_id(token.user_id)
        if not user:
            raise BadRequestException("Invite user missing")

        user.hashed_password = get_password_hash(payload.password)
        user.full_name = payload.full_name
        user.is_active = True
        user.is_email_verified = True
        self.repo.save(user)
        self.repo.consume_token(token)
        self.session.commit()
        self.session.refresh(user)
        return user

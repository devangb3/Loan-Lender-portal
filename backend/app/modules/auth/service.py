from __future__ import annotations
from uuid import uuid4

from sqlmodel import Session
from sqlmodel import select

from app.common.base import PartnerTier, UserRole
from app.common.exceptions import BadRequestException, ForbiddenException
from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.modules.auth.models import AuthToken, User
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    PartnerSignupRequest,
    ResetPasswordRequest,
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
            is_active=False,
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

        self.session.commit()
        self.session.refresh(user)
        return user

    def login(self, payload: LoginRequest) -> tuple[User, str]:
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
        return user, access

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
        reset_link = f"{settings.frontend_url.rstrip('/')}/auth/reset-password?token={token.token}"
        self.notifications.send_email(
            to_email=user.email,
            subject="Reset your password",
            html=(
                "<p>You requested a password reset for your Loan Referral Platform account.</p>"
                f"<p><a href='{reset_link}'>Reset Password</a></p>"
                "<p>If you did not request this, you can ignore this email.</p>"
            ),
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
        user.must_reset_password = False
        self.repo.save(user)
        self.repo.consume_token(token)
        self.session.commit()

    def change_password(self, user: User, payload: ChangePasswordRequest) -> None:
        if not verify_password(payload.current_password, user.hashed_password):
            raise ForbiddenException("Current password is incorrect")

        validate_password(payload.new_password)
        if verify_password(payload.new_password, user.hashed_password):
            raise BadRequestException("New password must be different from current password")

        user.hashed_password = get_password_hash(payload.new_password)
        user.must_reset_password = False
        self.repo.save(user)
        self.session.commit()

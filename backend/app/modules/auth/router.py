from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session

from app.core.config import settings
from app.core.db import get_session
from app.modules.auth.deps import get_current_user
from app.modules.auth.schemas import (
    AuthResponse,
    BorrowerInviteAcceptRequest,
    ForgotPasswordRequest,
    LoginRequest,
    PartnerSignupRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    UserResponse,
)
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/auth")


@router.post("/partner/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def partner_signup(payload: PartnerSignupRequest, session: Session = Depends(get_session)) -> AuthResponse:
    service = AuthService(session)
    user = service.signup_partner(payload)
    return AuthResponse(user=UserResponse(id=str(user.id), email=user.email, role=user.role, full_name=user.full_name))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, session: Session = Depends(get_session)) -> AuthResponse:
    service = AuthService(session)
    user, access, refresh = service.login(payload)

    secure = settings.env != "development"
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 86400,
    )

    return AuthResponse(user=UserResponse(id=str(user.id), email=user.email, role=user.role, full_name=user.full_name))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")


@router.get("/me", response_model=AuthResponse)
def me(user=Depends(get_current_user)) -> AuthResponse:
    return AuthResponse(user=UserResponse(id=str(user.id), email=user.email, role=user.role, full_name=user.full_name))


@router.post("/password/forgot", status_code=status.HTTP_204_NO_CONTENT)
def forgot_password(payload: ForgotPasswordRequest, session: Session = Depends(get_session)):
    AuthService(session).forgot_password(payload)


@router.post("/password/reset", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(payload: ResetPasswordRequest, session: Session = Depends(get_session)):
    AuthService(session).reset_password(payload)


@router.post("/verify-email", response_model=AuthResponse)
def verify_email(payload: VerifyEmailRequest, session: Session = Depends(get_session)) -> AuthResponse:
    user = AuthService(session).verify_email(payload)
    return AuthResponse(user=UserResponse(id=str(user.id), email=user.email, role=user.role, full_name=user.full_name))


@router.post("/borrower/invite/accept", response_model=AuthResponse)
def borrower_invite_accept(
    payload: BorrowerInviteAcceptRequest,
    response: Response,
    session: Session = Depends(get_session),
) -> AuthResponse:
    service = AuthService(session)
    user = service.accept_borrower_invite(payload)
    access = service.login(LoginRequest(email=user.email, password=payload.password))[1]

    secure = settings.env != "development"
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )

    return AuthResponse(user=UserResponse(id=str(user.id), email=user.email, role=user.role, full_name=user.full_name))

from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field

from app.common.base import UserRole


class PartnerSignupRequest(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)
    company: str = Field(min_length=2)
    branch: str | None = None
    phone_number: str = Field(min_length=7)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


class VerifyEmailRequest(BaseModel):
    token: str


class BorrowerInviteAcceptRequest(BaseModel):
    token: str
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=2)


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: UserRole
    full_name: str | None


class AuthResponse(BaseModel):
    user: UserResponse

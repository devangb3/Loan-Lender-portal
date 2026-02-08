from __future__ import annotations

import hashlib
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenError(Exception):
    pass


def _prepare_password_for_bcrypt(password: str) -> str:
    """
    Prepare password for bcrypt hashing.
    
    Bcrypt has a 72-byte limit. For longer passwords, we hash them with SHA-256
    first to get a fixed 32-byte hash, then bcrypt that hash.
    This allows users to use passwords of any length while maintaining security.
    """
    password_bytes = password.encode("utf-8")
    
    # If password is 72 bytes or less, use it directly
    if len(password_bytes) <= 72:
        return password
    
    # For longer passwords, hash with SHA-256 first (produces 32 bytes)
    sha256_hash = hashlib.sha256(password_bytes).hexdigest()
    return sha256_hash


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a bcrypt hash.
    
    Handles both direct bcrypt hashes and SHA-256 pre-hashed passwords.
    """
    # Try direct verification first (for passwords <= 72 bytes)
    if pwd_context.verify(plain_password, hashed_password):
        return True
    
    # If direct verification fails and password is long, try SHA-256 pre-hash
    password_bytes = plain_password.encode("utf-8")
    if len(password_bytes) > 72:
        sha256_hash = hashlib.sha256(password_bytes).hexdigest()
        return pwd_context.verify(sha256_hash, hashed_password)
    
    return False


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Handles passwords longer than 72 bytes by pre-hashing with SHA-256.
    """
    prepared_password = _prepare_password_for_bcrypt(password)
    return pwd_context.hash(prepared_password)


def create_token(subject: str, expires_delta: timedelta, token_type: str) -> str:
    expire = datetime.now(UTC) + expires_delta
    payload: dict[str, Any] = {"sub": subject, "exp": expire, "type": token_type}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str) -> str:
    return create_token(
        subject=subject,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        token_type="access",
    )


def create_refresh_token(subject: str) -> str:
    return create_token(
        subject=subject,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
        token_type="refresh",
    )


def decode_token(token: str, expected_type: str | None = None) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise TokenError("Invalid token") from exc

    token_type = payload.get("type")
    if expected_type and token_type != expected_type:
        raise TokenError("Invalid token type")

    if not payload.get("sub"):
        raise TokenError("Token missing subject")

    return payload

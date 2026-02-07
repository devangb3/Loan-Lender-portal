from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.modules.auth.models import AuthToken, User


class AuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str) -> User | None:
        return self.session.exec(select(User).where(User.email == email.lower())).first()

    def get_user_by_id(self, user_id: UUID) -> User | None:
        return self.session.get(User, user_id)

    def create_user(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        return user

    def create_token(self, auth_token: AuthToken) -> AuthToken:
        self.session.add(auth_token)
        self.session.flush()
        return auth_token

    def get_valid_token(self, token: str, token_type: str) -> AuthToken | None:
        stmt = select(AuthToken).where(
            AuthToken.token == token,
            AuthToken.token_type == token_type,
            AuthToken.consumed_at.is_(None),
            AuthToken.expires_at > datetime.now(UTC),
        )
        return self.session.exec(stmt).first()

    def consume_token(self, auth_token: AuthToken) -> None:
        auth_token.consumed_at = datetime.now(UTC)
        self.session.add(auth_token)

    def save(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        return user

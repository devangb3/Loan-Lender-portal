from __future__ import annotations

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Loan Referral Platform API"
    env: str = "development"
    debug: bool = True
    api_prefix: str = "/api/v1"

    database_url: str = "postgresql+psycopg://loan_portal:loan_portal@localhost:5432/loan_portal"

    jwt_secret_key: str = Field(default="please-change-me", min_length=12)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    frontend_url: str = "http://localhost:6173"

    email_provider: str = "console"
    email_from: str = "noreply@example.com"
    email_reply_to: str | None = None

    gmail_username: str | None = None
    gmail_app_password: str | None = None

    google_places_api_key: str | None = None


settings = Settings()

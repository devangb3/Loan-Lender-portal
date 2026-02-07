from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Loan Referral Platform API"
    env: str = "development"
    debug: bool = True
    api_prefix: str = "/api/v1"

    database_url: str = "sqlite:///./loan_portal.db"

    jwt_secret_key: str = Field(default="please-change-me", min_length=12)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    frontend_url: str = "http://localhost:5173"

    upload_dir: str = "./uploads"

    resend_api_key: str | None = None
    email_from: str = "noreply@example.com"

    google_places_api_key: str | None = None


settings = Settings()

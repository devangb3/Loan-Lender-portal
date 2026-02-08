from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router as api_router
from app.core.config import settings
from app.core.db import init_db
from app.core.logging import configure_logging

logger = logging.getLogger(__name__)


def _build_allowed_origins() -> list[str]:
    configured = settings.frontend_url.rstrip("/")
    candidates = {
        configured,
        "http://localhost:5173",
        "http://localhost:6173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:6173",
    }
    return sorted(origin for origin in candidates if origin)


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging(settings.debug)
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    init_db()
    logger.info("Application startup complete")
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs" if settings.env == "development" else None,
    redoc_url="/redoc" if settings.env == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.api_prefix)

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(autouse=True)
def ensure_upload_dir() -> None:
    Path("uploads").mkdir(exist_ok=True)


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as c:
        yield c

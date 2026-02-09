from __future__ import annotations

from app.main import health


def test_health_endpoint() -> None:
    assert health() == {"status": "ok"}

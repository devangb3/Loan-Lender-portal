from __future__ import annotations

import pytest

from app.common.exceptions import BadRequestException
from app.modules.auth.validators import validate_password


def test_password_policy_accepts_strong_password() -> None:
    validate_password("StrongPass1")


def test_password_policy_rejects_weak_password() -> None:
    with pytest.raises(BadRequestException):
        validate_password("weak")

from __future__ import annotations

import re

from app.common.exceptions import BadRequestException


PASSWORD_POLICY = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$")


def validate_password(password: str) -> None:
    if not PASSWORD_POLICY.match(password):
        raise BadRequestException(
            "Password must be at least 8 chars and include upper/lowercase letters and a number"
        )

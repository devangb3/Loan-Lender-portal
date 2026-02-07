from __future__ import annotations

from app.common.exceptions import BadRequestException


def validate_substage_name(name: str) -> None:
    if len(name.strip()) < 2:
        raise BadRequestException("Sub-stage name is too short")

from __future__ import annotations

from app.common.exceptions import BadRequestException


def validate_commission_goal(goal: float) -> None:
    if goal < 0:
        raise BadRequestException("Commission goal cannot be negative")

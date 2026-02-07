from __future__ import annotations

from app.common.base import DealStage
from app.common.exceptions import BadRequestException


def validate_decline_reason(reason: str) -> None:
    if len(reason.strip()) < 3:
        raise BadRequestException("Decline reason must be meaningful")


def validate_stage_transition(current: DealStage, target: DealStage) -> None:
    if current == DealStage.DECLINED and target != DealStage.DECLINED:
        raise BadRequestException("Declined deals cannot be moved without reopening workflow")

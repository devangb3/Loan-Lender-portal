from __future__ import annotations

from app.common.base import CommissionStatus
from app.common.exceptions import BadRequestException


STATUS_ORDER = {
    CommissionStatus.PENDING: 1,
    CommissionStatus.EARNED: 2,
    CommissionStatus.PAID: 3,
}


def validate_amount(amount: float) -> None:
    if amount <= 0:
        raise BadRequestException("Commission amount must be positive")


def validate_status_transition(current: CommissionStatus, target: CommissionStatus) -> None:
    if STATUS_ORDER[target] < STATUS_ORDER[current]:
        raise BadRequestException("Commission status is forward-only")

from __future__ import annotations

import pytest

from app.common.base import CommissionStatus
from app.common.exceptions import BadRequestException
from app.modules.commissions.validators import validate_status_transition


def test_forward_transition_allowed() -> None:
    validate_status_transition(CommissionStatus.PENDING, CommissionStatus.EARNED)


def test_backward_transition_rejected() -> None:
    with pytest.raises(BadRequestException):
        validate_status_transition(CommissionStatus.PAID, CommissionStatus.PENDING)

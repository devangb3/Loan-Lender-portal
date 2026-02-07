from __future__ import annotations

from app.common.exceptions import BadRequestException


def validate_loan_amount(amount: float) -> None:
    if amount <= 0:
        raise BadRequestException("Loan amount must be greater than zero")

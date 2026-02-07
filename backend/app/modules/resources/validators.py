from __future__ import annotations

from app.common.exceptions import BadRequestException

ALLOWED_CATEGORIES = {"scripts", "faq", "loan_types"}


def validate_category(category: str) -> None:
    if category not in ALLOWED_CATEGORIES:
        raise BadRequestException("Category must be one of scripts, faq, loan_types")

from __future__ import annotations

import pytest

from app.common.exceptions import BadRequestException
from app.modules.lenders.validators import validate_csv_columns


def test_csv_columns_validation_success() -> None:
    validate_csv_columns(
        [
            "lender_name",
            "contact_name",
            "contact_email",
            "contact_phone",
            "specialty",
            "property_types",
            "states",
            "min_loan",
            "max_loan",
        ]
    )


def test_csv_columns_validation_failure() -> None:
    with pytest.raises(BadRequestException):
        validate_csv_columns(["lender_name", "contact_name"])

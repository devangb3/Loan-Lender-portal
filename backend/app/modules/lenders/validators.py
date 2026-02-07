from __future__ import annotations

from app.common.exceptions import BadRequestException

REQUIRED_COLUMNS = [
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


def validate_csv_columns(columns: list[str]) -> None:
    missing = [col for col in REQUIRED_COLUMNS if col not in columns]
    if missing:
        raise BadRequestException(f"Missing required columns: {', '.join(missing)}")


def parse_float(value: str, field_name: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise BadRequestException(f"Invalid number for {field_name}") from exc

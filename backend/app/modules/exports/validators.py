from __future__ import annotations

from app.common.exceptions import BadRequestException

ALLOWED_EXPORTS = {"deals", "partners", "borrowers", "commissions"}


def validate_export_entity(entity: str) -> None:
    if entity not in ALLOWED_EXPORTS:
        raise BadRequestException("Unsupported export entity")

from __future__ import annotations

from pathlib import Path

from app.common.exceptions import BadRequestException

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"}
MAX_SIZE_BYTES = 15 * 1024 * 1024


def validate_upload(filename: str, size_bytes: int) -> None:
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise BadRequestException("Unsupported file type")
    if size_bytes > MAX_SIZE_BYTES:
        raise BadRequestException("File too large")

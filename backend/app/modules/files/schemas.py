from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class FileAssetResponse(BaseModel):
    id: str
    original_filename: str
    size_bytes: int
    created_at: datetime

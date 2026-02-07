from __future__ import annotations

from pydantic import BaseModel


class ExportMeta(BaseModel):
    entity: str
    row_count: int

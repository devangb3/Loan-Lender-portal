from __future__ import annotations

from pydantic import BaseModel


class ResourceResponse(BaseModel):
    id: str
    category: str
    title: str
    content: str
    order_index: int


class ResourceCreateRequest(BaseModel):
    category: str
    title: str
    content: str
    order_index: int = 0
    is_active: bool = True

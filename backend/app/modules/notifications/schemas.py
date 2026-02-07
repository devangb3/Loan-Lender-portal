from __future__ import annotations

from pydantic import BaseModel, EmailStr


class EmailMessage(BaseModel):
    to_email: EmailStr
    subject: str
    html: str

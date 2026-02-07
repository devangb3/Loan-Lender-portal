from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from app.common.base import DealStage


class DealStageEvent(SQLModel, table=True):
    __tablename__ = "deal_stage_events"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    deal_id: UUID = Field(foreign_key="deals.id", index=True)
    actor_user_id: UUID = Field(foreign_key="users.id")
    from_stage: DealStage | None = None
    to_stage: DealStage
    from_substage_id: UUID | None = Field(default=None, foreign_key="sub_stages.id")
    to_substage_id: UUID | None = Field(default=None, foreign_key="sub_stages.id")
    reason: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

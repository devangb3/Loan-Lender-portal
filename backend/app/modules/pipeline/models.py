from __future__ import annotations

from uuid import UUID

from sqlmodel import Field

from app.common.base import DealStage, UUIDTimestampModel


class DealStageEvent(UUIDTimestampModel, table=True):
    __tablename__ = "deal_stage_events"

    deal_id: UUID = Field(foreign_key="deals.id", index=True)
    actor_user_id: UUID = Field(foreign_key="users.id")
    from_stage: DealStage | None = None
    to_stage: DealStage
    from_substage_id: UUID | None = Field(default=None, foreign_key="sub_stages.id")
    to_substage_id: UUID | None = Field(default=None, foreign_key="sub_stages.id")
    reason: str | None = None

from __future__ import annotations

from datetime import UTC, datetime
from typing import Generator

from sqlalchemy import event
from sqlalchemy import inspect as sa_inspect
from sqlmodel import Session, create_engine

from app.core.config import settings

engine = create_engine(settings.database_url, echo=settings.debug, pool_pre_ping=True)


@event.listens_for(Session, "before_flush")
def _touch_updated_at(session: Session, _flush_context, _instances) -> None:
    now = datetime.now(UTC)
    for item in session.dirty:
        if not hasattr(item, "updated_at"):
            continue
        state = sa_inspect(item)
        has_non_audit_change = any(
            attr.key != "updated_at" and state.attrs[attr.key].history.has_changes()
            for attr in state.mapper.column_attrs
        )
        if not has_non_audit_change:
            continue
        setattr(item, "updated_at", now)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

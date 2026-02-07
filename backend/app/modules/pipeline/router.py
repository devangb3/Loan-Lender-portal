from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.auth.models import User
from app.modules.pipeline.schemas import DeclineRequest, LenderAssignRequest, StageUpdateRequest, SubstageUpdateRequest
from app.modules.pipeline.service import PipelineService

router = APIRouter()


@router.get("/admin/kanban")
def admin_kanban(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, list[dict[str, object]]]:
    board = PipelineService(session).kanban()
    return {key: [item.model_dump() for item in value] for key, value in board.items()}


@router.patch("/admin/deals/{deal_id}/stage")
def admin_change_stage(
    deal_id: UUID,
    payload: StageUpdateRequest,
    user: User = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    deal = PipelineService(session).move_stage(deal_id, user.id, payload.stage, payload.reason)
    return {"id": str(deal.id), "stage": deal.stage, "updated_at": deal.updated_at}


@router.patch("/admin/deals/{deal_id}/substage")
def admin_change_substage(
    deal_id: UUID,
    payload: SubstageUpdateRequest,
    user: User = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    substage_id = UUID(payload.substage_id) if payload.substage_id else None
    deal = PipelineService(session).update_substage(deal_id, user.id, substage_id)
    return {"id": str(deal.id), "substage_id": str(deal.substage_id) if deal.substage_id else None}


@router.post("/admin/deals/{deal_id}/accept")
def admin_accept_deal(
    deal_id: UUID,
    user: User = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    deal = PipelineService(session).accept(deal_id, user.id)
    return {"id": str(deal.id), "stage": deal.stage}


@router.post("/admin/deals/{deal_id}/decline")
def admin_decline_deal(
    deal_id: UUID,
    payload: DeclineRequest,
    user: User = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    deal = PipelineService(session).decline(deal_id, user.id, payload.reason)
    return {"id": str(deal.id), "stage": deal.stage, "reason": payload.reason}


@router.patch("/admin/deals/{deal_id}/assign-lender")
def admin_assign_lender(
    deal_id: UUID,
    payload: LenderAssignRequest,
    user: User = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    deal = PipelineService(session).assign_lender(deal_id, user.id, UUID(payload.lender_id))
    return {"id": str(deal.id), "lender_id": str(deal.lender_id)}


@router.get("/admin/deals/{deal_id}/events")
def admin_deal_events(
    deal_id: UUID,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[dict[str, object]]:
    return [event.model_dump() for event in PipelineService(session).list_events(deal_id)]

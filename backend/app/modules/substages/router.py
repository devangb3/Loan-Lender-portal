from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.substages.schemas import SubStageCreateRequest, SubStageResponse, SubStageUpdateRequest
from app.modules.substages.service import SubStageService

router = APIRouter()


@router.post("/admin/substages", response_model=SubStageResponse)
def create_substage(
    payload: SubStageCreateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> SubStageResponse:
    item = SubStageService(session).create(payload)
    return SubStageResponse(
        id=str(item.id),
        name=item.name,
        main_stage=item.main_stage,
        order_index=item.order_index,
        is_active=item.is_active,
    )


@router.get("/admin/substages", response_model=list[SubStageResponse])
def list_substages(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[SubStageResponse]:
    return SubStageService(session).list_all()


@router.patch("/admin/substages/{substage_id}", response_model=SubStageResponse)
def update_substage(
    substage_id: UUID,
    payload: SubStageUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> SubStageResponse:
    item = SubStageService(session).update(substage_id, payload)
    return SubStageResponse(
        id=str(item.id),
        name=item.name,
        main_stage=item.main_stage,
        order_index=item.order_index,
        is_active=item.is_active,
    )


@router.delete("/admin/substages/{substage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_substage(
    substage_id: UUID,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
):
    SubStageService(session).delete(substage_id)

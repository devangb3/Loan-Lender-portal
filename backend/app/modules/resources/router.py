from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.resources.schemas import ResourceCreateRequest, ResourceResponse
from app.modules.resources.service import ResourceService

router = APIRouter()


@router.get("/partner/resources", response_model=list[ResourceResponse])
def partner_resources(
    _: object = Depends(require_roles(UserRole.PARTNER)),
    session: Session = Depends(get_session),
) -> list[ResourceResponse]:
    return ResourceService(session).list_for_partner()


@router.post("/admin/resources", response_model=ResourceResponse)
def admin_create_resource(
    payload: ResourceCreateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> ResourceResponse:
    return ResourceService(session).create(payload)

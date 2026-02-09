from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.commissions.schemas import (
    CommissionCreateRequest,
    CommissionResponse,
    CommissionStatusUpdateRequest,
    PartnerCommissionSummary,
)
from app.modules.commissions.service import CommissionService
from app.modules.partners.deps import get_current_partner_profile

router = APIRouter()


@router.post("/admin/deals/{deal_id}/commission", response_model=CommissionResponse)
def create_commission(
    deal_id: UUID,
    payload: CommissionCreateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> CommissionResponse:
    return CommissionService(session).create_for_deal_response(deal_id, payload.amount)


@router.patch("/admin/commissions/{commission_id}/status", response_model=CommissionResponse)
def update_commission_status(
    commission_id: UUID,
    payload: CommissionStatusUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> CommissionResponse:
    return CommissionService(session).update_status_response(commission_id, payload.status)


@router.get("/admin/commissions", response_model=list[CommissionResponse])
def list_commissions(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[CommissionResponse]:
    return CommissionService(session).list_all_responses()


@router.get("/partner/commissions/summary", response_model=PartnerCommissionSummary)
def partner_commission_summary(
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> PartnerCommissionSummary:
    return CommissionService(session).partner_summary(partner)

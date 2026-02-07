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
    item = CommissionService(session).create_for_deal(deal_id, payload.amount)
    return CommissionResponse(
        id=str(item.id),
        deal_id=str(item.deal_id),
        partner_id=str(item.partner_id),
        amount=item.amount,
        status=item.status,
    )


@router.patch("/admin/commissions/{commission_id}/status", response_model=CommissionResponse)
def update_commission_status(
    commission_id: UUID,
    payload: CommissionStatusUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> CommissionResponse:
    item = CommissionService(session).update_status(commission_id, payload.status)
    return CommissionResponse(
        id=str(item.id),
        deal_id=str(item.deal_id),
        partner_id=str(item.partner_id),
        amount=item.amount,
        status=item.status,
    )


@router.get("/admin/commissions", response_model=list[CommissionResponse])
def list_commissions(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[CommissionResponse]:
    items = CommissionService(session).list_all()
    return [
        CommissionResponse(
            id=str(item.id),
            deal_id=str(item.deal_id),
            partner_id=str(item.partner_id),
            amount=item.amount,
            status=item.status,
        )
        for item in items
    ]


@router.get("/partner/commissions/summary", response_model=PartnerCommissionSummary)
def partner_commission_summary(
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> PartnerCommissionSummary:
    return CommissionService(session).partner_summary(partner)

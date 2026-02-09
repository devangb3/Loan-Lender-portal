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
from app.modules.commissions.models import Commission
from app.modules.commissions.service import CommissionService
from app.modules.deals.models import Deal
from app.modules.partners.deps import get_current_partner_profile

router = APIRouter()


def to_commission_response(item: Commission, session: Session) -> CommissionResponse:
    deal = session.get(Deal, item.deal_id)
    return CommissionResponse(
        id=str(item.id),
        deal_id=str(item.deal_id),
        deal_property_address=deal.property_address if deal else None,
        partner_id=str(item.partner_id),
        amount=item.amount,
        status=item.status,
    )


@router.post("/admin/deals/{deal_id}/commission", response_model=CommissionResponse)
def create_commission(
    deal_id: UUID,
    payload: CommissionCreateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> CommissionResponse:
    item = CommissionService(session).create_for_deal(deal_id, payload.amount)
    return to_commission_response(item, session)


@router.patch("/admin/commissions/{commission_id}/status", response_model=CommissionResponse)
def update_commission_status(
    commission_id: UUID,
    payload: CommissionStatusUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> CommissionResponse:
    item = CommissionService(session).update_status(commission_id, payload.status)
    return to_commission_response(item, session)


@router.get("/admin/commissions", response_model=list[CommissionResponse])
def list_commissions(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[CommissionResponse]:
    items = CommissionService(session).list_all()
    return [to_commission_response(item, session) for item in items]


@router.get("/partner/commissions/summary", response_model=PartnerCommissionSummary)
def partner_commission_summary(
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> PartnerCommissionSummary:
    return CommissionService(session).partner_summary(partner)

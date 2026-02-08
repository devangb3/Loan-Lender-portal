from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.common.base import UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.partners.deps import get_current_partner_profile
from app.modules.partners.schemas import (
    PartnerAdminMetricsResponse,
    PartnerDashboardResponse,
    PartnerProfileResponse,
    PartnerUpdateRequest,
)
from app.modules.partners.service import PartnerService

router = APIRouter()


@router.get("/partner/dashboard", response_model=PartnerDashboardResponse)
def partner_dashboard(
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> PartnerDashboardResponse:
    return PartnerService(session).dashboard(partner)


@router.get("/admin/partners", response_model=list[PartnerAdminMetricsResponse])
def admin_list_partners(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[PartnerAdminMetricsResponse]:
    return PartnerService(session).list_for_admin()


@router.patch("/admin/partners/{partner_id}", response_model=PartnerProfileResponse)
def admin_update_partner(
    partner_id: UUID,
    payload: PartnerUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> PartnerProfileResponse:
    partner = PartnerService(session).update_partner(partner_id, payload)
    return PartnerProfileResponse(
        id=str(partner.id),
        user_id=str(partner.user_id),
        company=partner.company,
        branch=partner.branch,
        phone_number=partner.phone_number,
        tier=partner.tier,
        commission_goal=partner.commission_goal,
        is_approved=partner.is_approved,
        is_active=partner.is_active,
    )


@router.post("/admin/partners/{partner_id}/deactivate", response_model=PartnerProfileResponse)
def admin_deactivate_partner(
    partner_id: UUID,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> PartnerProfileResponse:
    partner = PartnerService(session).deactivate_partner(partner_id)
    return PartnerProfileResponse(
        id=str(partner.id),
        user_id=str(partner.user_id),
        company=partner.company,
        branch=partner.branch,
        phone_number=partner.phone_number,
        tier=partner.tier,
        commission_goal=partner.commission_goal,
        is_approved=partner.is_approved,
        is_active=partner.is_active,
    )

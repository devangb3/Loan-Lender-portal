from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Form, status
from sqlmodel import Session

from app.common.base import PropertyType, TransactionType, UserRole
from app.core.db import get_session
from app.modules.auth.deps import require_roles
from app.modules.deals.schemas import DealDetailResponse, DealListItem, DealNotesUpdateRequest, DealSubmitRequest
from app.modules.deals.service import DealService
from app.modules.partners.deps import get_current_partner_profile
from app.modules.pipeline.service import PipelineService

router = APIRouter()


@router.post("/partner/deals", response_model=DealDetailResponse)
async def partner_submit_deal(
    property_type: PropertyType = Form(...),
    property_address: str = Form(...),
    loan_amount: float = Form(...),
    transaction_type: TransactionType = Form(...),
    borrower_name: str = Form(...),
    borrower_email: str = Form(...),
    borrower_phone: str = Form(...),
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> DealDetailResponse:
    payload = DealSubmitRequest(
        property_type=property_type,
        property_address=property_address,
        loan_amount=loan_amount,
        transaction_type=transaction_type,
        borrower_name=borrower_name,
        borrower_email=borrower_email,
        borrower_phone=borrower_phone,
    )
    deal = DealService(session).submit_deal(partner, payload)
    return DealService(session).get_partner_deal(deal.id, partner)


@router.get("/partner/deals", response_model=list[DealListItem])
def partner_list_deals(
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> list[DealListItem]:
    return DealService(session).list_partner_deals(partner)


@router.get("/partner/deals/{deal_id}", response_model=DealDetailResponse)
def partner_get_deal(
    deal_id: UUID,
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> DealDetailResponse:
    return DealService(session).get_partner_deal(deal_id, partner)


@router.get("/partner/deals/{deal_id}/events")
def partner_get_deal_events(
    deal_id: UUID,
    partner=Depends(get_current_partner_profile),
    session: Session = Depends(get_session),
) -> list[dict[str, object]]:
    DealService(session).get_partner_deal(deal_id, partner)
    return [event.model_dump() for event in PipelineService(session).list_events(deal_id)]


@router.get("/admin/deals", response_model=list[DealListItem])
def admin_list_deals(
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> list[DealListItem]:
    return DealService(session).list_all_deals()


@router.get("/admin/deals/{deal_id}", response_model=DealDetailResponse)
def admin_get_deal(
    deal_id: UUID,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> DealDetailResponse:
    return DealService(session).get_admin_deal(deal_id)


@router.patch("/admin/deals/{deal_id}/notes", response_model=DealDetailResponse)
def admin_update_deal_notes(
    deal_id: UUID,
    payload: DealNotesUpdateRequest,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
) -> DealDetailResponse:
    DealService(session).update_internal_notes(deal_id, payload.internal_notes)
    return DealService(session).get_admin_deal(deal_id)


@router.delete("/admin/deals/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_deal(
    deal_id: UUID,
    _: object = Depends(require_roles(UserRole.ADMIN)),
    session: Session = Depends(get_session),
):
    DealService(session).delete_deal(deal_id)

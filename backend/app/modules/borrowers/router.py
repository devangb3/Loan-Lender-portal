from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.db import get_session
from app.modules.borrowers.deps import get_current_borrower_profile
from app.modules.borrowers.schemas import BorrowerDashboardResponse, BorrowerDealItem
from app.modules.borrowers.service import BorrowerService

router = APIRouter()


@router.get("/borrower/dashboard", response_model=BorrowerDashboardResponse)
def borrower_dashboard(
    borrower=Depends(get_current_borrower_profile),
    session: Session = Depends(get_session),
) -> BorrowerDashboardResponse:
    return BorrowerService(session).dashboard(borrower)


@router.get("/borrower/deals", response_model=BorrowerDashboardResponse)
def borrower_deals(
    borrower=Depends(get_current_borrower_profile),
    session: Session = Depends(get_session),
) -> BorrowerDashboardResponse:
    return BorrowerService(session).dashboard(borrower)


@router.get("/borrower/deals/{deal_id}", response_model=BorrowerDealItem)
def borrower_deal_detail(
    deal_id: UUID,
    borrower=Depends(get_current_borrower_profile),
    session: Session = Depends(get_session),
) -> BorrowerDealItem:
    return BorrowerService(session).get_deal_detail(borrower, deal_id)

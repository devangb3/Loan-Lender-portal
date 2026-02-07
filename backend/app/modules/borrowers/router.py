from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.common.exceptions import NotFoundException
from app.core.db import get_session
from app.modules.borrowers.deps import get_current_borrower_profile
from app.modules.borrowers.schemas import BorrowerDashboardResponse
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


@router.get("/borrower/deals/{deal_id}")
def borrower_deal_detail(
    deal_id: str,
    borrower=Depends(get_current_borrower_profile),
    session: Session = Depends(get_session),
) -> dict[str, object]:
    dashboard = BorrowerService(session).dashboard(borrower)
    for deal in dashboard.deals:
        if deal.id == deal_id:
            return deal.model_dump()
    raise NotFoundException("Deal not found")

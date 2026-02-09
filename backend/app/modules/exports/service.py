from __future__ import annotations

from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.common.utils import to_csv_response
from app.modules.exports.repository import ExportRepository


class ExportService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = ExportRepository(session)

    def export_deals(self) -> StreamingResponse:
        headers = [
            "id",
            "partner_id",
            "borrower_id",
            "property_address",
            "loan_amount",
            "stage",
            "transaction_type",
        ]
        rows = (
            {
                "id": str(d.id),
                "partner_id": str(d.partner_id),
                "borrower_id": str(d.borrower_id),
                "property_address": d.property_address,
                "loan_amount": d.loan_amount,
                "stage": d.stage.value,
                "transaction_type": d.transaction_type.value,
            }
            for d in self.repo.deals()
        )
        return to_csv_response("deals.csv", headers=headers, rows=rows)

    def export_partners(self) -> StreamingResponse:
        headers = ["id", "user_id", "company", "tier", "is_approved", "is_active", "commission_goal"]
        rows = (
            {
                "id": str(p.id),
                "user_id": str(p.user_id),
                "company": p.company,
                "tier": p.tier.value,
                "is_approved": p.is_approved,
                "is_active": p.is_active,
                "commission_goal": p.commission_goal,
            }
            for p in self.repo.partners()
        )
        return to_csv_response("partners.csv", headers=headers, rows=rows)

    def export_borrowers(self) -> StreamingResponse:
        headers = ["id", "user_id", "email", "phone_number"]
        rows = (
            {
                "id": str(b.id),
                "user_id": str(b.user_id),
                "email": b.email,
                "phone_number": b.phone_number,
            }
            for b in self.repo.borrowers()
        )
        return to_csv_response("borrowers.csv", headers=headers, rows=rows)

    def export_commissions(self) -> StreamingResponse:
        headers = ["id", "deal_id", "partner_id", "amount", "status"]
        rows = (
            {
                "id": str(c.id),
                "deal_id": str(c.deal_id),
                "partner_id": str(c.partner_id),
                "amount": c.amount,
                "status": c.status.value,
            }
            for c in self.repo.commissions()
        )
        return to_csv_response("commissions.csv", headers=headers, rows=rows)

from __future__ import annotations

from sqlmodel import Session

from app.modules.resources.models import ResourceItem
from app.modules.resources.repository import ResourceRepository
from app.modules.resources.schemas import ResourceCreateRequest, ResourceResponse
from app.modules.resources.validators import validate_category

SEED_RESOURCES = [
    {
        "category": "scripts",
        "title": "Opening Commercial Conversation",
        "content": "Ask homeowners who own businesses about refinancing or acquisition financing opportunities.",
        "order_index": 1,
    },
    {
        "category": "faq",
        "title": "How long does approval take?",
        "content": "Most deals move from submitted to accepted within a few business days when complete.",
        "order_index": 1,
    },
    {
        "category": "loan_types",
        "title": "Bridge Loan",
        "content": "Short-term financing for transitional assets until permanent financing is secured.",
        "order_index": 1,
    },
]


class ResourceService:
    def __init__(self, session: Session):
        self.session = session
        self.repo = ResourceRepository(session)

    def _ensure_seed(self) -> None:
        if self.repo.list_all():
            return
        for item in SEED_RESOURCES:
            self.repo.create(ResourceItem(**item))
        self.session.commit()

    def list_for_partner(self) -> list[ResourceResponse]:
        self._ensure_seed()
        return [
            ResourceResponse(
                id=str(item.id),
                category=item.category,
                title=item.title,
                content=item.content,
                order_index=item.order_index,
            )
            for item in self.repo.list_active()
        ]

    def create(self, payload: ResourceCreateRequest) -> ResourceResponse:
        validate_category(payload.category)
        item = ResourceItem(**payload.model_dump())
        self.repo.create(item)
        self.session.commit()
        self.session.refresh(item)
        return ResourceResponse(
            id=str(item.id),
            category=item.category,
            title=item.title,
            content=item.content,
            order_index=item.order_index,
        )

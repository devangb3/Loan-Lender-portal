"""initial schema

Revision ID: 20260207_0001
Revises:
Create Date: 2026-02-07
"""

from __future__ import annotations

from alembic import op
from sqlmodel import SQLModel

from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.borrowers import models as borrower_models  # noqa: F401
from app.modules.commissions import models as commission_models  # noqa: F401
from app.modules.deals import models as deal_models  # noqa: F401
from app.modules.files import models as file_models  # noqa: F401
from app.modules.lenders import models as lender_models  # noqa: F401
from app.modules.notifications import models as notification_models  # noqa: F401
from app.modules.partners import models as partner_models  # noqa: F401
from app.modules.pipeline import models as pipeline_models  # noqa: F401
from app.modules.resources import models as resource_models  # noqa: F401
from app.modules.substages import models as substage_models  # noqa: F401


revision = "20260207_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    SQLModel.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    SQLModel.metadata.drop_all(bind=bind)

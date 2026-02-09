"""make borrower_phone nullable

Revision ID: 4816ddafa704
Revises: 20260209_0004
Create Date: 2026-02-09 09:00:03.212168

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4816ddafa704'
down_revision = '20260209_0004'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('deals', 'borrower_phone',
               existing_type=sa.VARCHAR(),
               nullable=True)


def downgrade() -> None:
    op.alter_column('deals', 'borrower_phone',
               existing_type=sa.VARCHAR(),
               nullable=False)

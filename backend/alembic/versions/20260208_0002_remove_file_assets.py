"""remove legacy file assets table

Revision ID: 20260208_0002
Revises: 20260207_0001
Create Date: 2026-02-08
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260208_0002"
down_revision = "20260207_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if inspector.has_table("file_assets"):
        op.drop_table("file_assets")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if inspector.has_table("file_assets"):
        return

    op.create_table(
        "file_assets",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("deal_id", sa.Uuid(), nullable=False),
        sa.Column("uploaded_by_user_id", sa.Uuid(), nullable=False),
        sa.Column("original_filename", sa.String(), nullable=False),
        sa.Column("storage_path", sa.String(), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["deal_id"], ["deals.id"]),
        sa.ForeignKeyConstraint(["uploaded_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_file_assets_deal_id"), "file_assets", ["deal_id"], unique=False)
    op.create_index(op.f("ix_file_assets_uploaded_by_user_id"), "file_assets", ["uploaded_by_user_id"], unique=False)

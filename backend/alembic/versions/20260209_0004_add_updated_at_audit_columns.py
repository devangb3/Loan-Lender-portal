"""add updated_at audit columns

Revision ID: 20260209_0004
Revises: 20260209_0003
Create Date: 2026-02-09
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


revision = "20260209_0004"
down_revision = "20260209_0003"
branch_labels = None
depends_on = None

AUDIT_TABLES = ("auth_tokens", "notification_logs", "deal_stage_events")


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    for table_name in AUDIT_TABLES:
        columns = {column["name"] for column in inspector.get_columns(table_name)}
        if "updated_at" in columns:
            continue
        op.add_column(
            table_name,
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.text("CURRENT_TIMESTAMP"),
            ),
        )
        op.alter_column(table_name, "updated_at", server_default=None)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    for table_name in AUDIT_TABLES:
        columns = {column["name"] for column in inspector.get_columns(table_name)}
        if "updated_at" not in columns:
            continue
        op.drop_column(table_name, "updated_at")

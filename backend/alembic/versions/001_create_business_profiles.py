"""create business_profiles table

Revision ID: 001
Revises:
Create Date: 2026-03-10 00:00:00.000000

"""

from typing import Any

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: str | None = None
branch_labels: Any = None
depends_on: Any = None


def upgrade() -> None:
    op.create_table(
        "business_profiles",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            unique=True,
            nullable=False,
        ),
        sa.Column("industry", sa.String(), nullable=False),
        sa.Column("states", postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column("employee_count", sa.String(), nullable=False),
        sa.Column("entity_type", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
    )
    op.create_index(
        op.f("ix_business_profiles_user_id"),
        "business_profiles",
        ["user_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_business_profiles_user_id"),
        table_name="business_profiles",
    )
    op.drop_table("business_profiles")

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, field_validator

EmployeeCount = Literal["1-10", "11-50", "51-200", "201-500", "500+"]
EntityType = Literal[
    "LLC", "S-Corp", "C-Corp", "Sole Proprietor", "Partnership", "Nonprofit", "Other"
]


class BusinessProfileCreate(BaseModel):
    industry: str
    states: list[str]
    employee_count: EmployeeCount
    entity_type: EntityType

    @field_validator("states")
    @classmethod
    def states_not_empty(cls, v: list[str]) -> list[str]:
        if len(v) < 1:
            raise ValueError("states must have at least one entry")
        return v


class BusinessProfileResponse(BusinessProfileCreate):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

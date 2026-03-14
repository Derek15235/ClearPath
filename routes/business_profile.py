from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.business_profile import BusinessProfile
from app.schemas.business_profile import BusinessProfileCreate, BusinessProfileResponse

router = APIRouter(prefix="/api/business-profile", tags=["business-profile"])


@router.post("/", response_model=BusinessProfileResponse, status_code=201)
async def create_business_profile(
    body: BusinessProfileCreate,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BusinessProfile:
    user_id = str(user["sub"])

    existing = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    )
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Business profile already exists")

    profile = BusinessProfile(
        user_id=user_id,
        industry=body.industry,
        states=body.states,
        employee_count=body.employee_count,
        entity_type=body.entity_type,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/", response_model=BusinessProfileResponse)
async def get_business_profile(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BusinessProfile:
    user_id = str(user["sub"])

    result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile


@router.put("/", response_model=BusinessProfileResponse)
async def update_business_profile(
    body: BusinessProfileCreate,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BusinessProfile:
    user_id = str(user["sub"])

    result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")

    profile.industry = body.industry
    profile.states = body.states
    profile.employee_count = body.employee_count
    profile.entity_type = body.entity_type

    await db.commit()
    await db.refresh(profile)
    return profile

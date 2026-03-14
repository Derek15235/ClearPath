import pytest
from httpx import AsyncClient

VALID_PROFILE = {
    "industry": "Technology",
    "states": ["CA", "NY"],
    "employee_count": "11-50",
    "entity_type": "LLC",
}


async def test_create_profile_returns_201(client: AsyncClient):
    response = await client.post("/api/business-profile/", json=VALID_PROFILE)
    assert response.status_code == 201
    data = response.json()
    assert data["industry"] == "Technology"
    assert data["states"] == ["CA", "NY"]
    assert data["employee_count"] == "11-50"
    assert data["entity_type"] == "LLC"
    assert "id" in data
    assert "user_id" in data


async def test_create_duplicate_returns_409(client: AsyncClient):
    await client.post("/api/business-profile/", json=VALID_PROFILE)
    response = await client.post("/api/business-profile/", json=VALID_PROFILE)
    assert response.status_code == 409


async def test_get_profile_after_creation(client: AsyncClient):
    await client.post("/api/business-profile/", json=VALID_PROFILE)
    response = await client.get("/api/business-profile/")
    assert response.status_code == 200
    data = response.json()
    assert data["industry"] == "Technology"


async def test_get_profile_returns_404_when_none(client: AsyncClient):
    response = await client.get("/api/business-profile/")
    assert response.status_code == 404


async def test_put_updates_profile(client: AsyncClient):
    await client.post("/api/business-profile/", json=VALID_PROFILE)
    updated = {**VALID_PROFILE, "industry": "Healthcare", "states": ["TX"]}
    response = await client.put("/api/business-profile/", json=updated)
    assert response.status_code == 200
    data = response.json()
    assert data["industry"] == "Healthcare"
    assert data["states"] == ["TX"]


async def test_put_returns_404_when_no_profile(client: AsyncClient):
    updated = {**VALID_PROFILE, "industry": "Healthcare"}
    response = await client.put("/api/business-profile/", json=updated)
    assert response.status_code == 404

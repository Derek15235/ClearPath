import pytest
from httpx import AsyncClient


async def test_generate_compliance_items(client: AsyncClient):
    response = await client.post("/api/compliance/generate")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "generated"
    assert isinstance(data["items"], list)
    assert len(data["items"]) >= 3
    item = data["items"][0]
    assert "id" in item
    assert "title" in item
    assert "category" in item
    assert "severity" in item
    assert "description" in item

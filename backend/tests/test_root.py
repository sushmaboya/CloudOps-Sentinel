"""Tests for root greeting endpoint."""

from fastapi.testclient import TestClient


def test_root_endpoint_status(client: TestClient):
    """Verify GET / returns HTTP 200 with platform identity."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "CloudOps Sentinel" in data["message"]
    assert data["status"] == "Running"
    assert "timestamp" in data
    assert data["version"] == "1.0.0"
    assert data["docs_url"] == "/docs"
    assert data["environment"] == "development"

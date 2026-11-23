"""Tests for health check endpoint."""

from fastapi.testclient import TestClient


def test_health_endpoint_healthy(client: TestClient):
    """Verify GET /health returns service health and component metrics."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "CloudOps Sentinel"
    assert data["health"] == "Healthy"
    assert data["uptime_seconds"] >= 0
    assert data["version"] == "1.0.0"
    assert "components" in data
    assert isinstance(data["components"], list)
    assert len(data["components"]) > 0

    # Validate component structure
    first_component = data["components"][0]
    assert "name" in first_component
    assert "status" in first_component
    assert "latency_ms" in first_component
    assert first_component["status"] == "healthy"

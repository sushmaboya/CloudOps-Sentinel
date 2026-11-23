"""Tests for system and deployment status endpoint."""

from fastapi.testclient import TestClient


def test_system_status_endpoint(client: TestClient):
    """Verify GET /api/v1/status returns comprehensive system state and deployment metadata."""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["environment"] == "development"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
    assert "services" in data
    assert isinstance(data["services"], list)
    assert len(data["services"]) >= 4

    # Validate microservices metadata
    for svc in data["services"]:
        assert "service_id" in svc
        assert "name" in svc
        assert "status" in svc
        assert "role" in svc
        assert "version" in svc
        assert svc["status"] == "operational"

    # Validate deployment section
    deployment = data["deployment"]
    assert deployment["environment"] == "development"
    assert deployment["current_version"] == "1.0.0"
    assert deployment["branch"] == "master"
    assert deployment["ci_status"] == "success"
    assert deployment["rollback_available"] is True

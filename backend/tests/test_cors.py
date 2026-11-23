"""Tests for CORS and security configuration."""

from fastapi.testclient import TestClient


def test_cors_headers(client: TestClient):
    """Verify CORS headers are returned for allowed origins."""
    headers = {
        "Origin": "http://localhost:5173",
    }
    response = client.get("/api/v1/metrics", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"

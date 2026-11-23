"""Tests for metrics and monitoring endpoint."""

from fastapi.testclient import TestClient


def test_metrics_endpoint_structure(client: TestClient):
    """Verify GET /api/v1/metrics returns explicitly labeled simulated metrics."""
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()

    # 1. Explicit Simulation Notice verification
    assert "simulated_notice" in data
    notice = data["simulated_notice"]
    assert notice["is_simulated"] is True
    assert "Simulated" in notice["notice"]
    assert notice["simulated_region"] == "us-east-1"

    # 2. Host telemetry verification
    assert "telemetry" in data
    telemetry = data["telemetry"]
    assert 0 <= telemetry["cpu_percent"] <= 100
    assert 0 <= telemetry["memory_percent"] <= 100
    assert telemetry["memory_total_gb"] > 0
    assert telemetry["disk_free_gb"] > 0
    assert telemetry["latency_p95_ms"] > 0

    # 3. Compute metrics verification
    assert "compute" in data
    compute = data["compute"]
    assert compute["ec2_instances_total"] >= compute["ec2_instances_running"]
    assert compute["ecs_clusters_total"] >= 1
    assert compute["lambda_functions_count"] >= 1

    # 4. Database metrics verification
    assert "database" in data
    database = data["database"]
    assert database["rds_instances_count"] >= 1
    assert database["primary_db_status"] == "available"
    assert database["cache_clusters_count"] >= 1

    # 5. History time series points for frontend charting
    assert "history" in data
    assert isinstance(data["history"], list)
    assert len(data["history"]) > 5
    first_pt = data["history"][0]
    assert "timestamp" in first_pt
    assert "cpu" in first_pt
    assert "memory" in first_pt

    # 6. Active alerts verification
    assert "alerts" in data
    assert isinstance(data["alerts"], list)
    assert len(data["alerts"]) > 0
    for alert in data["alerts"]:
        assert alert["is_simulated"] is True
        assert "[Simulated]" in alert["message"]

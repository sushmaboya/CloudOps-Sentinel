"""Metrics and monitoring aggregation service with simulated cloud telemetry."""

import math
import time
from datetime import datetime, timezone, timedelta
from typing import List

from app.models.health import ComponentHealth
from app.models.status import MicroserviceStatus, DeploymentInfo, SystemStatusResponse
from app.models.metrics import (
    MetricsResponse,
    SimulatedNotice,
    SystemTelemetry,
    ComputeMetrics,
    DatabaseMetrics,
    MetricHistoryPoint,
    ActiveAlert,
)


class MetricsService:
    """Service to produce structured, clearly labeled simulated cloud metrics."""

    _start_time: float = time.time()

    @classmethod
    def get_uptime_seconds(cls) -> float:
        """Calculate elapsed uptime since service start."""
        return round(time.time() - cls._start_time, 2)

    @classmethod
    def get_components_health(cls) -> List[ComponentHealth]:
        """Return diagnostic health checks for internal service dependencies."""
        return [
            ComponentHealth(
                name="FastAPI Core Engine",
                status="healthy",
                latency_ms=1.2,
                details="HTTP event loop responding normally",
            ),
            ComponentHealth(
                name="Configuration Provider",
                status="healthy",
                latency_ms=0.4,
                details="Pydantic Settings loaded successfully",
            ),
            ComponentHealth(
                name="Simulated Telemetry Pipeline",
                status="healthy",
                latency_ms=2.8,
                details="Synthetic data generation active (Phase 1 preview)",
            ),
            ComponentHealth(
                name="Alert Dispatcher",
                status="healthy",
                latency_ms=1.5,
                details="Mock notification queue operational",
            ),
        ]

    @classmethod
    def get_system_status(cls, environment: str = "development", version: str = "1.0.0") -> SystemStatusResponse:
        """Produce system health and deployment metadata."""
        now_iso = datetime.now(timezone.utc).isoformat()

        services = [
            MicroserviceStatus(
                service_id="svc-api-gateway",
                name="API Gateway & Ingress",
                status="operational",
                role="Reverse proxy and route authorization",
                version="1.0.0",
                last_heartbeat=now_iso,
            ),
            MicroserviceStatus(
                service_id="svc-telemetry-engine",
                name="Telemetry & Metrics Collector",
                status="operational",
                role="Aggregates simulated time-series metrics",
                version="1.0.0",
                last_heartbeat=now_iso,
            ),
            MicroserviceStatus(
                service_id="svc-remediation-controller",
                name="Auto-Remediation Controller",
                status="operational",
                role="Monitors thresholds and triggers automated runbooks",
                version="1.0.0",
                last_heartbeat=now_iso,
            ),
            MicroserviceStatus(
                service_id="svc-alert-manager",
                name="Alert Notification Hub",
                status="operational",
                role="Dispatches critical alarms to operations teams",
                version="1.0.0",
                last_heartbeat=now_iso,
            ),
        ]

        deployment = DeploymentInfo(
            environment=environment,
            current_version=version,
            release_tag=f"v{version}-phase1",
            commit_sha="phase1-base",
            deployed_at=datetime.fromtimestamp(cls._start_time, timezone.utc).isoformat(),
            branch="master",
            ci_status="success",
            rollback_available=True,
            active_deployments_count=0,
        )

        return SystemStatusResponse(
            status="operational",
            environment=environment,
            version=version,
            timestamp=now_iso,
            incident_count=0,
            active_deployments=0,
            services=services,
            deployment=deployment,
        )

    @classmethod
    def get_metrics(
        cls,
        is_simulated: bool = True,
        simulated_region: str = "us-east-1",
    ) -> MetricsResponse:
        """Generate structured simulated cloud infrastructure metrics and telemetry."""
        now = datetime.now(timezone.utc)
        now_ts = now.timestamp()

        # Dynamic variation using sinusoidal curves to create realistic dashboard updates
        cycle = (now_ts % 3600) / 3600.0 * 2 * math.pi
        cpu_dynamic = round(32.0 + 12.0 * math.sin(cycle) + 4.0 * math.cos(cycle * 2), 1)
        mem_dynamic = round(48.5 + 6.0 * math.cos(cycle), 1)
        requests_dynamic = round(128.0 + 35.0 * math.sin(cycle), 1)
        latency_dynamic = round(14.2 + 3.5 * math.cos(cycle * 3), 1)

        telemetry = SystemTelemetry(
            cpu_percent=cpu_dynamic,
            memory_percent=mem_dynamic,
            memory_used_gb=round(16.0 * (mem_dynamic / 100.0), 2),
            memory_total_gb=16.0,
            disk_percent=42.3,
            disk_free_gb=180.4,
            network_in_mbps=round(24.5 + 8.0 * math.sin(cycle), 2),
            network_out_mbps=round(41.2 + 12.0 * math.cos(cycle), 2),
            request_rate_rps=requests_dynamic,
            latency_p95_ms=latency_dynamic,
            error_rate_pct=0.02,
        )

        compute = ComputeMetrics(
            ec2_instances_total=12,
            ec2_instances_running=11,
            ec2_instances_stopped=1,
            ec2_cpu_average_pct=round(28.4 + 8.0 * math.sin(cycle), 1),
            ecs_clusters_total=3,
            ecs_tasks_running=18,
            lambda_functions_count=14,
            lambda_invocations_last_hour=int(4250 + 600 * math.sin(cycle)),
            lambda_error_rate_pct=0.03,
        )

        database = DatabaseMetrics(
            rds_instances_count=2,
            primary_db_status="available",
            rds_connections_active=int(38 + 14 * math.sin(cycle)),
            rds_cpu_pct=round(22.1 + 5.0 * math.cos(cycle), 1),
            rds_storage_free_gb=142.8,
            cache_clusters_count=1,
            cache_hit_rate_pct=98.4,
        )

        # Generate 12 historical time points (last 60 minutes in 5-minute buckets)
        history: List[MetricHistoryPoint] = []
        for i in range(12, -1, -1):
            past_time = now - timedelta(minutes=i * 5)
            past_cycle = ((now_ts - i * 300) % 3600) / 3600.0 * 2 * math.pi
            history.append(
                MetricHistoryPoint(
                    timestamp=past_time.strftime("%H:%M"),
                    cpu=round(30.0 + 10.0 * math.sin(past_cycle) + 3.0 * math.cos(past_cycle * 2), 1),
                    memory=round(46.0 + 5.0 * math.cos(past_cycle), 1),
                    requests=round(120.0 + 30.0 * math.sin(past_cycle), 1),
                    latency=round(13.5 + 3.0 * math.cos(past_cycle * 3), 1),
                )
            )

        alerts = [
            ActiveAlert(
                alert_id="ALT-SIM-001",
                severity="info",
                service="CloudWatch Simulated Metrics",
                message="[Simulated] Synthetic telemetry pipeline active for Phase 1 local preview.",
                triggered_at=(now - timedelta(hours=2)).isoformat(),
                is_simulated=True,
            ),
            ActiveAlert(
                alert_id="ALT-SIM-002",
                severity="warning",
                service="RDS PostgreSQL [Simulated]",
                message="[Simulated] Storage usage crossed 75% on replica instance us-east-1b.",
                triggered_at=(now - timedelta(minutes=24)).isoformat(),
                is_simulated=True,
            ),
        ]

        return MetricsResponse(
            simulated_notice=SimulatedNotice(
                is_simulated=is_simulated,
                notice=(
                    "Simulated infrastructure metrics for Phase 1 local development and dashboard preview. "
                    "No live AWS resources are accessed or provisioned in this phase."
                ),
                simulated_region=simulated_region,
            ),
            timestamp=now.isoformat(),
            telemetry=telemetry,
            compute=compute,
            database=database,
            history=history,
            alerts=alerts,
        )

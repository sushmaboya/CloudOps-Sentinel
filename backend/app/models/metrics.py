"""Simulated infrastructure and system telemetry metrics schemas."""

from typing import List
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class SimulatedNotice(BaseModel):
    """Explicit disclosure indicating simulated telemetry."""

    is_simulated: bool = Field(True, description="Always true for simulated Phase 1 metrics")
    notice: str = Field(
        "Simulated infrastructure metrics for Phase 1 local development and dashboard preview. "
        "No live AWS resources are accessed or provisioned in this phase.",
        description="Public notice disclosing synthetic data generation",
    )
    simulated_region: str = Field("us-east-1", description="Simulated AWS cloud region")


class ComputeMetrics(BaseModel):
    """Simulated compute infrastructure metrics (EC2, ECS, Lambda)."""

    ec2_instances_total: int = Field(8, description="Simulated total EC2 instances")
    ec2_instances_running: int = Field(7, description="Simulated running EC2 instances")
    ec2_instances_stopped: int = Field(1, description="Simulated stopped EC2 instances")
    ec2_cpu_average_pct: float = Field(24.5, description="Simulated fleet-wide average CPU %")
    ecs_clusters_total: int = Field(2, description="Simulated ECS container clusters")
    ecs_tasks_running: int = Field(14, description="Simulated running ECS container tasks")
    lambda_functions_count: int = Field(12, description="Simulated serverless Lambda functions")
    lambda_invocations_last_hour: int = Field(3420, description="Simulated Lambda invocations in last hour")
    lambda_error_rate_pct: float = Field(0.04, description="Simulated Lambda error rate %")


class DatabaseMetrics(BaseModel):
    """Simulated database infrastructure metrics (RDS, ElastiCache)."""

    rds_instances_count: int = Field(2, description="Simulated RDS database instances (Primary + Replica)")
    primary_db_status: str = Field("available", description="Simulated primary DB engine state")
    rds_connections_active: int = Field(42, description="Simulated active database client connections")
    rds_cpu_pct: float = Field(18.2, description="Simulated RDS CPU utilization %")
    rds_storage_free_gb: float = Field(148.5, description="Simulated available disk space in GB")
    cache_clusters_count: int = Field(1, description="Simulated Redis cache clusters")
    cache_hit_rate_pct: float = Field(96.8, description="Simulated cache hit ratio %")


class SystemTelemetry(BaseModel):
    """Host/API system health and performance telemetry."""

    cpu_percent: float = Field(..., description="Current CPU utilization %")
    memory_percent: float = Field(..., description="Current RAM memory utilization %")
    memory_used_gb: float = Field(..., description="Memory used in Gigabytes")
    memory_total_gb: float = Field(..., description="Total system memory in Gigabytes")
    disk_percent: float = Field(..., description="Root filesystem storage utilization %")
    disk_free_gb: float = Field(..., description="Free storage space in Gigabytes")
    network_in_mbps: float = Field(..., description="Network input throughput (MB/s)")
    network_out_mbps: float = Field(..., description="Network output throughput (MB/s)")
    request_rate_rps: float = Field(..., description="Incoming HTTP request rate (req/sec)")
    latency_p95_ms: float = Field(..., description="p95 HTTP latency in milliseconds")
    error_rate_pct: float = Field(..., description="HTTP 5xx error rate %")


class MetricHistoryPoint(BaseModel):
    """Historical time-series point for charting."""

    timestamp: str = Field(..., description="Time label (e.g. HH:MM:SS)")
    cpu: float = Field(..., description="Simulated CPU %")
    memory: float = Field(..., description="Simulated Memory %")
    requests: float = Field(..., description="Simulated requests/sec")
    latency: float = Field(..., description="Simulated latency ms")


class ActiveAlert(BaseModel):
    """Active monitoring alert item."""

    alert_id: str = Field(..., description="Unique alert identifier")
    severity: str = Field(..., description="Severity level: info, warning, critical")
    service: str = Field(..., description="Target service/resource")
    message: str = Field(..., description="Descriptive alert text")
    triggered_at: str = Field(..., description="ISO 8601 trigger timestamp")
    is_simulated: bool = Field(True, description="Flag indicating simulated alert")


class MetricsResponse(BaseModel):
    """Complete metrics response payload."""

    simulated_notice: SimulatedNotice = Field(
        default_factory=SimulatedNotice,
        description="Explicit simulation notice",
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )
    telemetry: SystemTelemetry = Field(..., description="System telemetry metrics")
    compute: ComputeMetrics = Field(..., description="Simulated cloud compute fleet metrics")
    database: DatabaseMetrics = Field(..., description="Simulated database infrastructure metrics")
    history: List[MetricHistoryPoint] = Field(
        default_factory=list, description="Historical time-series data points for charts"
    )
    alerts: List[ActiveAlert] = Field(
        default_factory=list, description="Current simulated active alerts"
    )

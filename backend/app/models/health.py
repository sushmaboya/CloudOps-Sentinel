"""Health and root endpoint response schemas."""

from typing import Dict, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class ComponentHealth(BaseModel):
    """Health check state of an individual internal subsystem."""

    name: str = Field(..., description="Subsystem component name")
    status: str = Field(..., description="Status: healthy, degraded, or offline")
    latency_ms: float = Field(..., description="Response latency in milliseconds")
    details: Optional[str] = Field(None, description="Optional diagnostic details")


class RootResponse(BaseModel):
    """API root / greeting response."""

    message: str = Field("Welcome to CloudOps Sentinel!", description="Greeting message")
    status: str = Field("Running", description="Application lifecycle state")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )
    version: str = Field("1.0.0", description="API version")
    docs_url: str = Field("/docs", description="Interactive OpenAPI documentation path")
    environment: str = Field("development", description="Runtime environment")


class HealthResponse(BaseModel):
    """Comprehensive health check response."""

    service: str = Field("CloudOps Sentinel", description="Service identifier")
    health: str = Field("Healthy", description="Overall health state")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )
    uptime_seconds: float = Field(..., description="Service uptime in seconds")
    version: str = Field("1.0.0", description="Application version")
    environment: str = Field("development", description="Runtime environment")
    components: List[ComponentHealth] = Field(
        default_factory=list, description="Subsystem health statuses"
    )

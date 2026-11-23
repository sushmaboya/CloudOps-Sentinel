"""System and deployment status response schemas."""

from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class MicroserviceStatus(BaseModel):
    """Status of an individual internal microservice or worker."""

    service_id: str = Field(..., description="Unique service identifier")
    name: str = Field(..., description="Human-readable service name")
    status: str = Field(..., description="operational, degraded, or maintenance")
    role: str = Field(..., description="Functional role of the service")
    version: str = Field(..., description="Deployed semantic version")
    last_heartbeat: str = Field(..., description="ISO 8601 timestamp of last heartbeat")


class DeploymentInfo(BaseModel):
    """Current build and deployment metadata."""

    environment: str = Field("development", description="Current target environment")
    current_version: str = Field("1.0.0", description="Active semantic release version")
    release_tag: str = Field("v1.0.0-phase1", description="Git release tag")
    commit_sha: str = Field("phase1-init", description="Git commit SHA reference")
    deployed_at: str = Field(..., description="ISO 8601 deployment timestamp")
    branch: str = Field("master", description="Git source branch")
    ci_status: str = Field("success", description="Latest CI pipeline status: success, running, failed")
    rollback_available: bool = Field(True, description="Whether previous version rollback snapshot is ready")
    active_deployments_count: int = Field(0, description="In-flight deployments count")


class SystemStatusResponse(BaseModel):
    """Aggregate system status response."""

    status: str = Field(..., description="Global status: operational, degraded, maintenance")
    environment: str = Field(..., description="Operating environment")
    version: str = Field(..., description="System version")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )
    incident_count: int = Field(0, description="Active unresolved incident count")
    active_deployments: int = Field(0, description="Number of currently deploying jobs")
    services: List[MicroserviceStatus] = Field(
        default_factory=list, description="Subsystem microservices"
    )
    deployment: DeploymentInfo = Field(..., description="Deployment metadata")

"""Root and health check endpoints."""

from fastapi import APIRouter
from app.core.config import settings
from app.models.health import HealthResponse, RootResponse
from app.services.metrics_service import MetricsService

router = APIRouter(tags=["Health & Diagnostics"])


@router.get(
    "/",
    response_model=RootResponse,
    summary="Root greeting and service status",
    description="Returns basic operational status and service information.",
)
def get_root() -> RootResponse:
    """Return platform metadata, operational status, and API documentation reference."""
    return RootResponse(
        message=f"Welcome to {settings.PROJECT_NAME}!",
        status="Running",
        version=settings.VERSION,
        docs_url="/docs",
        environment=settings.ENVIRONMENT,
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health status",
    description="Returns detailed uptime, environment, and subsystem health checks.",
)
def get_health() -> HealthResponse:
    """Return system health and component check latencies."""
    return HealthResponse(
        service=settings.PROJECT_NAME,
        health="Healthy",
        uptime_seconds=MetricsService.get_uptime_seconds(),
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        components=MetricsService.get_components_health(),
    )

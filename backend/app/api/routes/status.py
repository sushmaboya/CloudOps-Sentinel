"""System and deployment status endpoints."""

from fastapi import APIRouter
from app.core.config import settings
from app.models.status import SystemStatusResponse
from app.services.metrics_service import MetricsService

router = APIRouter(tags=["System Status"])


@router.get(
    "/status",
    response_model=SystemStatusResponse,
    summary="Global system and deployment status",
    description="Returns aggregate health status, microservice components, and deployment information.",
)
def get_system_status() -> SystemStatusResponse:
    """Return platform operational status and deployment metadata."""
    return MetricsService.get_system_status(
        environment=settings.ENVIRONMENT,
        version=settings.VERSION,
    )

"""Infrastructure and performance metrics endpoints."""

from fastapi import APIRouter
from app.core.config import settings
from app.models.metrics import MetricsResponse
from app.services.metrics_service import MetricsService

router = APIRouter(tags=["Metrics & Monitoring"])


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    summary="Simulated infrastructure metrics and telemetry",
    description=(
        "Returns simulated cloud infrastructure metrics (EC2, ECS, Lambda, RDS) "
        "and host performance telemetry for monitoring dashboards. "
        "All cloud resources are explicitly labeled as simulated in Phase 1."
    ),
)
def get_metrics() -> MetricsResponse:
    """Return structured simulated telemetry and performance metrics."""
    return MetricsService.get_metrics(
        is_simulated=settings.IS_SIMULATED,
        simulated_region=settings.SIMULATION_REGION,
    )

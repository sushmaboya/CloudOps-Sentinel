"""API v1 router composition."""

from fastapi import APIRouter
from app.api.routes import status, metrics, health

api_v1_router = APIRouter()

api_v1_router.include_router(status.router)
api_v1_router.include_router(metrics.router)
api_v1_router.include_router(health.router, prefix="/system")

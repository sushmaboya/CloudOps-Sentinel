"""FastAPI application factory and entry point."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.router import api_v1_router


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.DESCRIPTION,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Configure CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handler
    @application.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "error": "InternalServerError",
                "message": "An unexpected error occurred while processing the request.",
                "details": str(exc) if settings.DEBUG else None,
            },
        )

    # Mount Root and Health check endpoints
    application.include_router(health_router)

    # Mount API v1 endpoints (/api/v1/status, /api/v1/metrics)
    application.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    return application


app = create_application()

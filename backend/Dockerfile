# ==============================================================================
# CloudOps Sentinel - Backend Dockerfile
# Multi-stage, non-root, production-optimized container for FastAPI
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Dependencies
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runtime

LABEL maintainer="CloudOps Sentinel DevOps Team" \
      version="1.0.0" \
      description="CloudOps Sentinel FastAPI Backend Engine"

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    ENVIRONMENT=production \
    PORT=8000 \
    HOST=0.0.0.0

# Install curl for reliable container health check
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copy pre-compiled dependencies from builder stage
COPY --from=builder /opt/venv /opt/venv

# Create dedicated non-root application user
RUN groupadd --gid 10001 appgroup && \
    useradd --uid 10001 --gid appgroup --shell /bin/false --no-create-home appuser && \
    mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

# Copy application package and entry point
COPY --chown=appuser:appgroup app /app/app
COPY --chown=appuser:appgroup main.py /app/main.py

# Run as non-root user
USER appuser

EXPOSE 8000

# Native healthcheck using FastAPI /health
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

ENTRYPOINT ["uvicorn"]
CMD ["main:app", "--host", "0.0.0.0", "--port", "8000"]

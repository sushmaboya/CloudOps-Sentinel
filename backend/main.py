"""Main backend entry point for CloudOps Sentinel.

Exposes the configured FastAPI application instance from the modular app package.
Can be executed directly via `python main.py` or with `uvicorn main:app --reload`.
"""

import sys
from pathlib import Path

# Ensure the backend directory is in the import search path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app, create_application
from app.core.config import settings

__all__ = ["app", "create_application"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )

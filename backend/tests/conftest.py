"""Shared test fixtures for CloudOps Sentinel backend."""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in python path
backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.main import app


@pytest.fixture(scope="module")
def client():
    """Module-scoped FastAPI TestClient fixture."""
    with TestClient(app) as test_client:
        yield test_client

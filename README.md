# CloudOps Sentinel

**Cloud operations dashboard prototype**

CloudOps Sentinel is a local dashboard and API project for exploring cloud-operations concepts. The dashboard currently uses generated, simulated demo telemetry. It does not connect to AWS, monitor live AWS resources, provision infrastructure, or perform automated remediation.

---

## Architecture & Technology Stack

### Phase 1: Dashboard Foundation

- **Backend:**
  - Python 3.12
  - [FastAPI](https://fastapi.tiangolo.com/), [Pydantic v2](https://docs.pydantic.dev/), and [Uvicorn](https://www.uvicorn.org/)
  - [Pytest](https://docs.pytest.org/) and [HTTPX](https://www.python-httpx.org/) for API tests

- **Frontend:**
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vite.dev/) and [Tailwind CSS v4](https://tailwindcss.com/)
  - [Recharts](https://recharts.org/) for charts of simulated time-series data
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Axios](https://axios-http.com/) for API requests and [Oxlint](https://oxc.rs/) for linting

## Project Status

### Completed

- **Phase 1 — Dashboard foundation:** FastAPI health, status, and metrics endpoints; a React dashboard; and backend tests. Cloud fleet values and alerts are simulated demo data.
- **Phase 2 — Containerization and CI configuration:** Backend and frontend Dockerfiles, Docker Compose, a GitHub Actions workflow, and a Jenkins pipeline definition. These configure build/test checks; hosted pipeline execution depends on the corresponding runner setup.

Neither phase deploys to AWS or implements live AWS monitoring or automated remediation.

### Future roadmap

- **Phase 3 — Cloud integration:** Terraform-based infrastructure provisioning and integration with real cloud services and telemetry.
- **Phase 4 — Observability and operations:** Prometheus/Grafana integration, live alerting, and reviewed runbook automation (for example, Ansible or Puppet).

---

## Repository Structure

```
CloudOps-Sentinel/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI factory, CORS, exception handlers
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py            # API v1 router composition
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── health.py        # GET / and GET /health
│   │   │       ├── status.py        # GET /api/v1/status
│   │   │       └── metrics.py       # GET /api/v1/metrics
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py            # Pydantic Settings & CORS parsing
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── health.py            # Health & Root Pydantic schemas
│   │   │   ├── status.py            # Microservice & Deployment schemas
│   │   │   └── metrics.py           # Simulated Cloud Metrics schemas
│   │   └── services/
│   │       ├── __init__.py
│   │       └── metrics_service.py   # Telemetry & simulated cloud fleet service
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py              # TestClient fixtures
│   │   ├── test_root.py             # GET / verification
│   │   ├── test_health.py           # GET /health verification
│   │   ├── test_status.py           # GET /api/v1/status verification
│   │   ├── test_metrics.py          # GET /api/v1/metrics verification
│   │   └── test_cors.py             # CORS header verification
│   ├── .env.example
│   ├── Dockerfile
│   ├── pytest.ini
│   ├── requirements.txt
│   └── main.py                      # Standalone execution entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertsFeed.tsx               # Active incidents & alarms feed
│   │   │   ├── BackendHealth.tsx            # Subsystem health & uptime diagnostics
│   │   │   ├── DeploymentStatus.tsx         # Release metadata & microservices
│   │   │   ├── Header.tsx                   # Branding, live status, auto-polling
│   │   │   ├── InfrastructureOverview.tsx   # Simulated EC2, ECS, Lambda, RDS fleet
│   │   │   ├── MonitoringCharts.tsx         # Recharts CPU, Memory & Traffic graphs
│   │   │   ├── SimulationNotice.tsx         # Explicit Phase 1 synthetic data disclosure
│   │   │   └── StatusCards.tsx              # High-level KPI status cards
│   │   ├── services/
│   │   │   └── api.ts                       # Axios client & error handler
│   │   ├── types/
│   │   │   └── api.ts                       # TypeScript schemas matching FastAPI backend
│   │   ├── App.tsx                          # Dashboard orchestrator & refresh lifecycle
│   │   ├── index.css                        # Tailwind CSS v4 entry
│   │   ├── main.tsx                         # React 19 root
│   │   └── vite-env.d.ts                    # Vite client types
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── ansible/                         # Preserved for future phase runbooks
├── monitoring/                      # Preserved for Prometheus/Grafana configs
├── nagios/                          # Preserved for Nagios integration
├── puppet/                          # Preserved for Puppet manifests
├── terraform/                       # Preserved for AWS IaC modules
├── logs/                            # Local application log storage
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions validation and image builds
├── .gitignore
├── docker-compose.yml
├── Jenkinsfile
├── requirements.txt
└── README.md
```

---

## Backend API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root greeting, API version, and documentation link. |
| `GET` | `/health` | System health check, uptime, and internal subsystem diagnostic latencies. |
| `GET` | `/api/v1/status` | Demo system status, release metadata, and simulated service state. |
| `GET` | `/api/v1/metrics` | Explicitly labeled simulated cloud metrics (EC2, ECS, Lambda, RDS) and system telemetry. |
| `GET` | `/docs` | Interactive Swagger / OpenAPI documentation UI. |
| `GET` | `/redoc` | Redoc API documentation UI. |

> [!NOTE]
> **Synthetic Data Disclosure:** Cloud infrastructure metrics and alerts are generated demo data (`is_simulated: true`). No AWS credentials or live cloud resources are used.

---

## Local Setup & Execution Guide

### Prerequisites
- Python 3.12
- Node.js 22 and npm
- Docker with the Compose plugin (only needed to run the containers)

---

### 1. Backend Setup & Run

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3.12 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. If you need local overrides and do not already have a `.env`, copy the example:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   ```
   Keep local `.env` files and credentials out of Git.

5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Or directly:
   ```bash
   python main.py
   ```

6. Verify the server is running by opening:
   - API Root: [http://localhost:8000/](http://localhost:8000/)
   - Health Check: [http://localhost:8000/health](http://localhost:8000/health)
   - Status: [http://localhost:8000/api/v1/status](http://localhost:8000/api/v1/status)
   - Metrics: [http://localhost:8000/api/v1/metrics](http://localhost:8000/api/v1/metrics)
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Running Backend Tests

Run the complete automated test suite using `pytest`:

```bash
cd backend
pytest -v
```

The suite should report five passing tests:
```
tests/test_cors.py::test_cors_headers PASSED
tests/test_health.py::test_health_endpoint_healthy PASSED
tests/test_metrics.py::test_metrics_endpoint_structure PASSED
tests/test_root.py::test_root_endpoint_status PASSED
tests/test_status.py::test_system_status_endpoint PASSED

======================== 5 passed ========================
```

---

### 3. Frontend Setup & Run

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm ci
   ```

3. If you need local overrides and do not already have a `.env`, copy the example:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:5173/](http://localhost:5173/) to interact with the CloudOps Sentinel Dashboard.

---

### 4. Frontend Verification (Lint & Build)

Execute static type checking, linting, and production compilation:

```bash
cd frontend

# TypeScript strict type checking
npm run typecheck

# High-performance oxlint linting
npm run lint

# Production bundle build
npm run build
```

---

### 5. Run with Docker Compose

From the repository root, build and start the local demo stack:

```bash
docker compose up --build
```

Open the dashboard at [http://localhost:3000/](http://localhost:3000/) or the API at [http://localhost:8000/](http://localhost:8000/). Stop the stack with:

```bash
docker compose down
```

This runs the local application only; it does not deploy to AWS.

---

## Phase 1 Completion Checklist

- [x] Inspected existing workspace and preserved legacy directories (`ansible/`, `monitoring/`, `nagios/`, `puppet/`, `terraform/`, `logs/`).
- [x] Designed modular, scalable architecture separating API routes, models, services, and core configurations.
- [x] Implemented FastAPI endpoints: `GET /`, `GET /health`, `GET /api/v1/status`, `GET /api/v1/metrics`.
- [x] Configured Pydantic Settings with CORS middleware allowing local React clients.
- [x] Implemented simulated infrastructure metrics service with explicit `is_simulated: true` disclosures.
- [x] Developed comprehensive pytest test suite covering all endpoints and CORS headers (100% pass rate).
- [x] Built a React 19 + TypeScript + Vite + Tailwind CSS v4 dashboard with charts for simulated telemetry.
- [x] Added backend health indicator, status cards, compute/database overview, deployment section, and active alarms.
- [x] Connected frontend to backend through an Axios API service with error handling and configurable polling.
- [x] Verified zero TypeScript compilation errors and zero lint warnings (`oxlint`).
- [x] Configured safe `.env.example` templates, `requirements.txt`, `package.json` scripts, and comprehensive `.gitignore`.
- [x] Verified production build artifacts compile without errors.

## Phase 2 Completion Checklist

- [x] Added multi-stage backend and frontend Dockerfiles and a Docker Compose configuration.
- [x] Added GitHub Actions CI and a Jenkins pipeline definition for tests, frontend checks, and image builds.
- [x] Added Compose health checks and local container smoke-test configuration.

These are container and CI configuration deliverables, not an AWS deployment or proof of a hosted pipeline run.

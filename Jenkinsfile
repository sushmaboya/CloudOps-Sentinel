// =============================================================================
// CloudOps Sentinel - Jenkins Declarative CI/CD Pipeline (Phase 2)
// Multi-stage automation: Checkout, Backend Test, Frontend Validate, Docker Build
// =============================================================================

pipeline {
    agent {
        label 'linux'
    }

    environment {
        APP_NAME        = 'cloudops-sentinel'
        BACKEND_IMAGE   = 'cloudops-sentinel-backend'
        FRONTEND_IMAGE  = 'cloudops-sentinel-frontend'
        IMAGE_TAG       = "${env.BUILD_NUMBER ?: 'phase2-local'}"
        COMPOSE_PROJECT_NAME = "cloudops-sentinel-ci-${env.BUILD_NUMBER ?: 'local'}"
        PYTHON_VERSION  = '3.12'
        NODE_VERSION    = '22'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        timestamps()
        timeout(time: 25, unit: 'MINUTES')
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    stages {
        // ---------------------------------------------------------------------
        // Stage 1: Checkout Source Code
        // ---------------------------------------------------------------------
        stage('Checkout') {
            steps {
                echo "--> Stage 1: Checking out source code..."
                checkout scm
            }
        }

        // ---------------------------------------------------------------------
        // Stage 2: Verify Linux Agent Toolchain
        // ---------------------------------------------------------------------
        stage('Verify Agent Tools') {
            steps {
                echo "--> Verifying Python, Node.js, Docker, and Docker Compose..."
                sh '''
                    python3.12 --version
                    python3.12 -c 'import os, sys; expected = tuple(map(int, os.environ["PYTHON_VERSION"].split("."))); assert sys.version_info[:2] == expected, sys.version'

                    node -e 'if (process.versions.node.split(".")[0] !== process.env.NODE_VERSION) { console.error(`Node.js ${process.env.NODE_VERSION} is required`); process.exit(1); }'
                    npm --version

                    docker --version
                    docker compose version
                    docker compose up --help | grep -q -- '--no-build'
                    docker compose up --help | grep -q -- '--wait-timeout'
                    docker info >/dev/null
                    command -v curl >/dev/null
                '''
            }
        }

        // ---------------------------------------------------------------------
        // Stage 3: Backend Testing & Pytest Execution
        // ---------------------------------------------------------------------
        stage('Backend Testing') {
            steps {
                echo "--> Stage 3: Executing Backend tests and validations..."
                dir('backend') {
                    sh '''
                        echo "Creating Python virtual environment..."
                        python3.12 -m venv .venv
                        . .venv/bin/activate

                        echo "Installing backend dependencies..."
                        python -m pip install --upgrade pip
                        python -m pip install -r requirements.txt

                        echo "Running Pytest suite with JUnit XML reporting..."
                        python -m pytest -v --junitxml=pytest-results.xml
                    '''
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 4: Frontend Validation, Linting & Build
        // ---------------------------------------------------------------------
        stage('Frontend Validation') {
            steps {
                echo "--> Stage 4: Validating Frontend TypeScript, Lint, and Vite Build..."
                dir('frontend') {
                    sh '''
                        echo "Installing npm dependencies..."
                        npm ci

                        echo "Running strict TypeScript type check..."
                        npm run typecheck

                        echo "Running Oxlint linter..."
                        npm run lint

                        echo "Building production bundle..."
                        npm run build
                    '''
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 5: Docker Image Build & Assembly
        // ---------------------------------------------------------------------
        stage('Docker Image Build') {
            steps {
                echo "--> Stage 5: Building production Docker container images..."
                echo "Validating docker-compose.yml configuration syntax..."
                sh 'docker compose config'

                echo "Building Backend Docker image: ${BACKEND_IMAGE}:${IMAGE_TAG}..."
                sh 'docker build --tag "$BACKEND_IMAGE:$IMAGE_TAG" --tag "$BACKEND_IMAGE:latest" ./backend'

                echo "Building Frontend Docker image: ${FRONTEND_IMAGE}:${IMAGE_TAG}..."
                sh 'docker build --tag "$FRONTEND_IMAGE:$IMAGE_TAG" --tag "$FRONTEND_IMAGE:latest" ./frontend'
            }
        }

        // ---------------------------------------------------------------------
        // Stage 6: Container Smoke Test (Docker Compose)
        // ---------------------------------------------------------------------
        stage('Compose Smoke Test') {
            steps {
                echo "--> Stage 6: Verifying container orchestration via Docker Compose..."
                sh '''
                    echo "Starting services and waiting for healthy containers..."
                    docker compose up --no-build -d --wait --wait-timeout 90

                    docker compose ps

                    echo "Testing backend health endpoint..."
                    curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 2 --retry-max-time 30 http://127.0.0.1:8000/health

                    echo "Testing frontend healthz endpoint..."
                    curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 2 --retry-max-time 30 http://127.0.0.1:3000/healthz
                '''
            }
        }
    }

    // -------------------------------------------------------------------------
    // Post-Pipeline Reporting & Notifications
    // -------------------------------------------------------------------------
    post {
        always {
            echo "--> Cleaning up Docker Compose resources and archiving results..."
            catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE', message: 'Docker Compose cleanup failed') {
                sh 'docker compose down --remove-orphans'
            }
            junit allowEmptyResults: true, testResults: 'backend/pytest-results.xml'
            archiveArtifacts allowEmptyArchive: true, artifacts: 'frontend/dist/**'
        }
        success {
            echo "================================================================="
            echo " SUCCESS: CloudOps Sentinel Phase 2 CI Pipeline passed all stages."
            echo " Artifacts and Docker images built successfully for tag: ${IMAGE_TAG}"
            echo "================================================================="
        }
        failure {
            echo "================================================================="
            echo " FAILURE: CloudOps Sentinel CI Pipeline encountered errors."
            echo " Check console logs above for stage failure details."
            echo "================================================================="
        }
    }
}

# ==============================================================================
# CloudOps Sentinel - Frontend Dockerfile
# Multi-stage, non-root, production-optimized container for React 19 + Vite
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies using package lockfile
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy application source code and configurations
COPY . .

# Build argument to allow overriding API base URL at build time
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Compile strict TypeScript and production Vite bundle
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Minimal Non-Root Nginx Web Server
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

LABEL maintainer="CloudOps Sentinel DevOps Team" \
      version="1.0.0" \
      description="CloudOps Sentinel React Dashboard Server"

# Copy custom non-root Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Prepare directories and adjust permissions for unprivileged 'nginx' user
RUN touch /tmp/nginx.pid && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /usr/share/nginx/html \
                         /etc/nginx \
                         /var/cache/nginx \
                         /tmp \
                         /var/log/nginx

# Run as unprivileged user
USER nginx

EXPOSE 8080

# Healthcheck targeting internal unprivileged healthz endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O - http://localhost:8080/healthz || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]

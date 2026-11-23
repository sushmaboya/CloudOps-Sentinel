/**
 * Type definitions matching the CloudOps Sentinel FastAPI backend schemas.
 */

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'offline' | string;
  latency_ms: number;
  details?: string | null;
}

export interface HealthResponse {
  service: string;
  health: string;
  timestamp: string;
  uptime_seconds: number;
  version: string;
  environment: string;
  components: ComponentHealth[];
}

export interface RootResponse {
  message: string;
  status: string;
  timestamp: string;
  version: string;
  docs_url: string;
  environment: string;
}

export interface MicroserviceStatus {
  service_id: string;
  name: string;
  status: 'operational' | 'degraded' | 'maintenance' | string;
  role: string;
  version: string;
  last_heartbeat: string;
}

export interface DeploymentInfo {
  environment: string;
  current_version: string;
  release_tag: string;
  commit_sha: string;
  deployed_at: string;
  branch: string;
  ci_status: 'success' | 'running' | 'failed' | string;
  rollback_available: boolean;
  active_deployments_count: number;
}

export interface SystemStatusResponse {
  status: 'operational' | 'degraded' | 'maintenance' | string;
  environment: string;
  version: string;
  timestamp: string;
  incident_count: number;
  active_deployments: number;
  services: MicroserviceStatus[];
  deployment: DeploymentInfo;
}

export interface SimulatedNotice {
  is_simulated: boolean;
  notice: string;
  simulated_region: string;
}

export interface SystemTelemetry {
  cpu_percent: number;
  memory_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  disk_percent: number;
  disk_free_gb: number;
  network_in_mbps: number;
  network_out_mbps: number;
  request_rate_rps: number;
  latency_p95_ms: number;
  error_rate_pct: number;
}

export interface ComputeMetrics {
  ec2_instances_total: number;
  ec2_instances_running: number;
  ec2_instances_stopped: number;
  ec2_cpu_average_pct: number;
  ecs_clusters_total: number;
  ecs_tasks_running: number;
  lambda_functions_count: number;
  lambda_invocations_last_hour: number;
  lambda_error_rate_pct: number;
}

export interface DatabaseMetrics {
  rds_instances_count: number;
  primary_db_status: string;
  rds_connections_active: number;
  rds_cpu_pct: number;
  rds_storage_free_gb: number;
  cache_clusters_count: number;
  cache_hit_rate_pct: number;
}

export interface MetricHistoryPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  requests: number;
  latency: number;
}

export interface ActiveAlert {
  alert_id: string;
  severity: 'info' | 'warning' | 'critical' | string;
  service: string;
  message: string;
  triggered_at: string;
  is_simulated: boolean;
}

export interface MetricsResponse {
  simulated_notice: SimulatedNotice;
  timestamp: string;
  telemetry: SystemTelemetry;
  compute: ComputeMetrics;
  database: DatabaseMetrics;
  history: MetricHistoryPoint[];
  alerts: ActiveAlert[];
}

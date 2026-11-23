import axios, { AxiosError } from 'axios';
import type {
  HealthResponse,
  MetricsResponse,
  RootResponse,
  SystemStatusResponse,
} from '../types/api';

/**
 * Resolve API base URL from environment or fallback to local default.
 */
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Handle API error formatting.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; detail?: string }>;
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
    if (axiosErr.response?.data?.detail) {
      return axiosErr.response.data.detail;
    }
    if (axiosErr.code === 'ERR_NETWORK') {
      return `Unable to connect to backend at ${API_BASE_URL}. Ensure FastAPI is running on port 8000.`;
    }
    return axiosErr.message;
  }
  return 'An unexpected network error occurred.';
}

/**
 * CloudOps Sentinel API Service functions.
 */
export const sentinelApi = {
  /**
   * Root welcome endpoint
   */
  async getRoot(): Promise<RootResponse> {
    const res = await apiClient.get<RootResponse>('/');
    return res.data;
  },

  /**
   * Comprehensive health check
   */
  async getHealth(): Promise<HealthResponse> {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },

  /**
   * System & Deployment status
   */
  async getStatus(): Promise<SystemStatusResponse> {
    const res = await apiClient.get<SystemStatusResponse>('/api/v1/status');
    return res.data;
  },

  /**
   * Simulated Cloud Infrastructure Metrics & Telemetry
   */
  async getMetrics(): Promise<MetricsResponse> {
    const res = await apiClient.get<MetricsResponse>('/api/v1/metrics');
    return res.data;
  },
};

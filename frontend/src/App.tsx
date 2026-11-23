import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Code2,
  ExternalLink,
  Heart,
  Terminal,
} from 'lucide-react';
import { Header } from './components/Header';
import { SimulationNotice } from './components/SimulationNotice';
import { BackendHealth } from './components/BackendHealth';
import { StatusCards } from './components/StatusCards';
import { MonitoringCharts } from './components/MonitoringCharts';
import { InfrastructureOverview } from './components/InfrastructureOverview';
import { DeploymentStatus } from './components/DeploymentStatus';
import { AlertsFeed } from './components/AlertsFeed';
import { getErrorMessage, sentinelApi } from './services/api';
import type {
  HealthResponse,
  MetricsResponse,
  SystemStatusResponse,
} from './types/api';

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(10000);

  /**
   * Fetch all telemetry and health data concurrently from FastAPI backend.
   */
  const fetchData = useCallback(async (showLoading: boolean = false) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const [healthData, statusData, metricsData] = await Promise.all([
        sentinelApi.getHealth(),
        sentinelApi.getStatus(),
        sentinelApi.getMetrics(),
      ]);

      setHealth(healthData);
      setStatus(statusData);
      setMetrics(metricsData);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Failed to load telemetry:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  // Periodic polling setup
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);
    return () => clearInterval(timer);
  }, [autoRefreshInterval, fetchData]);

  const isBackendHealthy = health?.health === 'Healthy' && !error;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation & Controls */}
      <Header
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        isBackendHealthy={isBackendHealthy}
        onRefresh={() => {
          void fetchData(true);
        }}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Network Error Alert Banner */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-rose-300 text-sm block">
                Backend Connection Disconnected
              </span>
              <p className="text-xs text-rose-200/80 mt-1">{error}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => {
                    void fetchData(true);
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                >
                  Retry Connection
                </button>
                <span className="text-[11px] text-slate-400">
                  Tip: Run <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded">python -m uvicorn main:app --reload</code> in the backend folder.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Phase 1 Synthetic Data Notice */}
        <SimulationNotice notice={metrics?.simulated_notice} />

        {/* System KPI Status Cards */}
        <StatusCards status={status} telemetry={metrics?.telemetry} />

        {/* Backend Health Check Card */}
        <BackendHealth health={health} isLoading={isLoading} error={error} />

        {/* Interactive Monitoring Overview & Charts */}
        <MonitoringCharts history={metrics?.history} />

        {/* Infrastructure Compute & Database Overview */}
        <InfrastructureOverview
          compute={metrics?.compute}
          database={metrics?.database}
        />

        {/* Deployment Metadata & Microservices */}
        <DeploymentStatus
          deployment={status?.deployment}
          services={status?.services}
        />

        {/* Live Alerts Feed */}
        <AlertsFeed alerts={metrics?.alerts} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>CloudOps Sentinel — Professional AWS DevOps Automation & Monitoring</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> React 19 + TypeScript + FastAPI
            </span>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

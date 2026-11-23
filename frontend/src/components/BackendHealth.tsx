import React from 'react';
import { CheckCircle2, Clock, Cpu, Server, XCircle } from 'lucide-react';
import type { HealthResponse } from '../types/api';

interface BackendHealthProps {
  health: HealthResponse | null;
  isLoading: boolean;
  error?: string | null;
}

export const BackendHealth: React.FC<BackendHealthProps> = ({
  health,
  isLoading,
  error,
}) => {
  const formatUptime = (seconds?: number) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Backend Health & Core Subsystems</h2>
            <p className="text-xs text-slate-400">
              Live API telemetry from FastAPI service at <code className="text-indigo-300">/health</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {health?.health === 'Healthy' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Service Status: Operational
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              <XCircle className="w-4 h-4 text-rose-400" />
              Service Status: {error ? 'Offline' : 'Degraded'}
            </span>
          )}
        </div>
      </div>

      {/* Subsystem Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-b border-slate-800/80">
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
            Service Title
          </span>
          <span className="text-sm font-semibold text-slate-100 mt-1 block truncate">
            {health?.service || 'CloudOps Sentinel'}
          </span>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
            Service Version
          </span>
          <span className="text-sm font-semibold text-indigo-300 mt-1 block">
            v{health?.version || '1.0.0'}
          </span>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
            Runtime Environment
          </span>
          <span className="text-sm font-semibold text-amber-300 uppercase mt-1 block">
            {health?.environment || 'development'}
          </span>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Uptime
          </span>
          <span className="text-sm font-semibold text-emerald-300 mt-1 block">
            {isLoading && !health ? 'Loading...' : formatUptime(health?.uptime_seconds)}
          </span>
        </div>
      </div>

      {/* Component Checks Sub-table */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          Component Health Diagnostics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {health?.components && health.components.length > 0 ? (
            health.components.map((comp) => (
              <div
                key={comp.name}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {comp.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      comp.status === 'healthy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{comp.details || 'Operational'}</span>
                  <span className="font-mono text-cyan-400 shrink-0">
                    {comp.latency_ms}ms
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-xs text-slate-400">
              {error ? `Health check unreachable: ${error}` : 'Awaiting component response...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Database,
  HardDrive,
  Layers,
} from 'lucide-react';
import type { SystemStatusResponse, SystemTelemetry } from '../types/api';

interface StatusCardsProps {
  status: SystemStatusResponse | null;
  telemetry?: SystemTelemetry;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  status,
  telemetry,
}) => {
  const cpuVal = telemetry?.cpu_percent ?? 0;
  const memVal = telemetry?.memory_percent ?? 0;
  const diskVal = telemetry?.disk_percent ?? 0;
  const reqVal = telemetry?.request_rate_rps ?? 0;
  const latVal = telemetry?.latency_p95_ms ?? 0;
  const incidents = status?.incident_count ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Fleet CPU Utilization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Fleet CPU Usage</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">
            {cpuVal.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">simulated load</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              cpuVal > 80 ? 'bg-rose-500' : cpuVal > 60 ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, cpuVal))}%` }}
          />
        </div>
      </div>

      {/* Memory Utilization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Memory Utilization</span>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">
            {memVal.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">
            ({telemetry?.memory_used_gb?.toFixed(1) || '0'} / {telemetry?.memory_total_gb?.toFixed(0) || '16'} GB)
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              memVal > 85 ? 'bg-rose-500' : memVal > 70 ? 'bg-amber-500' : 'bg-cyan-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, memVal))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-cyan-400" /> Disk Usage
          </span>
          <span className="font-mono text-cyan-300">
            {diskVal.toFixed(1)}% ({telemetry?.disk_free_gb?.toFixed(0) ?? 0} GB free)
          </span>
        </div>
      </div>

      {/* Traffic & Latency */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">API Throughput</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">
            {reqVal.toFixed(0)} <span className="text-sm font-normal text-slate-400">rps</span>
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            p95: {latVal.toFixed(1)}ms
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-1 border-t border-slate-800/60">
          <span>5xx Error Rate</span>
          <span className="text-emerald-400 font-mono">
            {(telemetry?.error_rate_pct ?? 0.02).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Microservice & Incident Status */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">System State</span>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400 uppercase tracking-tight">
            {status?.status || 'Active'}
          </span>
          <span className="text-xs text-slate-400">
            ({status?.services?.length || 4} services)
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-1 border-t border-slate-800/60">
          <span>Active Incidents</span>
          <span
            className={`font-semibold flex items-center gap-1 ${
              incidents === 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {incidents > 0 && <AlertTriangle className="w-3 h-3" />}
            {incidents} Unresolved
          </span>
        </div>
      </div>
    </div>
  );
};

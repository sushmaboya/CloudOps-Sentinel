import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import type { MetricHistoryPoint } from '../types/api';

interface MonitoringChartsProps {
  history?: MetricHistoryPoint[];
}

export const MonitoringCharts: React.FC<MonitoringChartsProps> = ({ history = [] }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Monitoring Overview & Telemetry Trends
            </h2>
            <p className="text-xs text-slate-400">
              Real-time time series telemetry for compute resources and HTTP throughput
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md self-start sm:self-auto">
          Last 60 Minutes (5m intervals)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        {/* CPU & Memory Utilization Chart */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              CPU & Memory Fleet Utilization (%)
            </h4>
            <span className="text-[11px] text-slate-400">Simulated Target Fleet</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  name="CPU %"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  name="Memory %"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMem)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Rate & Latency Chart */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              API Requests (req/s) & Latency (ms)
            </h4>
            <span className="text-[11px] text-slate-400">Gateway Telemetry</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="requests"
                  name="Throughput (rps)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  name="Latency (ms)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

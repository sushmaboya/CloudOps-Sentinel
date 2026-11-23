import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Shield,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  isBackendHealthy: boolean;
  onRefresh: () => void;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (interval: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLoading,
  isBackendHealthy,
  onRefresh,
  autoRefreshInterval,
  setAutoRefreshInterval,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-xl shadow-inner">
              <Shield className="w-6 h-6 text-indigo-400" />
              <Activity className="w-3.5 h-3.5 text-cyan-400 absolute bottom-1 right-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  CloudOps Sentinel
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Phase 1 Foundation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                DevOps Automation, Infrastructure Monitoring & Auto-Remediation
              </p>
            </div>
          </div>

          {/* Quick Controls & Health Status */}
          <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
            {/* Backend Health Pill */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                isBackendHealthy
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {isBackendHealthy ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Backend: Healthy (Port 8000)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Backend: Unreachable</span>
                </>
              )}
            </div>

            {/* Refresh Interval Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Poll:</span>
              <select
                aria-label="Polling frequency"
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900">Off</option>
                <option value={5000} className="bg-slate-900">5s</option>
                <option value={10000} className="bg-slate-900">10s</option>
                <option value={30000} className="bg-slate-900">30s</option>
              </select>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh telemetry now"
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>{isLoading ? 'Updating...' : 'Sync'}</span>
            </button>

            {/* Timestamp */}
            {lastUpdated && (
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-slate-500" />
                <span>
                  {lastUpdated.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

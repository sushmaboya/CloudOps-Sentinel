import React from 'react';
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info } from 'lucide-react';
import type { ActiveAlert } from '../types/api';

interface AlertsFeedProps {
  alerts?: ActiveAlert[];
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts = [] }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Info className="w-3 h-3 text-cyan-400" />
            Info
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Cloud Alarms & Active Events
            </h2>
            <p className="text-xs text-slate-400">
              Live operational incident alerts and automated remediations
            </p>
          </div>
        </div>
        <span className="text-xs bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-300 font-medium">
          {alerts.length} Active {alerts.length === 1 ? 'Alarm' : 'Alarms'}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.alert_id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                {getSeverityBadge(alert.severity)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      {alert.service}
                    </span>
                    {alert.is_simulated && (
                      <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Simulated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 sm:text-right shrink-0">
                <span className="block font-mono">
                  {new Date(alert.triggered_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-[10px] text-slate-400">ID: {alert.alert_id}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            No active alarms. All systems operating within normal thresholds.
          </div>
        )}
      </div>
    </div>
  );
};

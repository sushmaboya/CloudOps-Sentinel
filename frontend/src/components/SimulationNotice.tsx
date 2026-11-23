import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import type { SimulatedNotice } from '../types/api';

interface SimulationNoticeProps {
  notice?: SimulatedNotice;
}

export const SimulationNotice: React.FC<SimulationNoticeProps> = ({ notice }) => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="font-semibold text-amber-300 text-sm block">
            Phase 1 Foundation — Simulated Cloud Telemetry Active
          </span>
          <p className="text-xs text-amber-200/80 mt-0.5">
            {notice?.notice ||
              'Infrastructure metrics are synthetically generated for local dashboard verification. No live AWS resources are accessed or provisioned in Phase 1.'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0 bg-amber-950/40 px-3 py-1.5 rounded-md border border-amber-500/20 text-xs">
        <Info className="w-3.5 h-3.5 text-amber-400" />
        <span>Region: <strong className="text-amber-200 uppercase">{notice?.simulated_region || 'us-east-1'}</strong></span>
      </div>
    </div>
  );
};

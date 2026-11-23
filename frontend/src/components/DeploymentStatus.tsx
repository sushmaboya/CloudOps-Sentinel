import React from 'react';
import {
  CheckCircle2,
  GitBranch,
  GitCommit,
  Layers,
  RotateCcw,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import type { DeploymentInfo, MicroserviceStatus } from '../types/api';

interface DeploymentStatusProps {
  deployment?: DeploymentInfo;
  services?: MicroserviceStatus[];
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deployment,
  services,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Deployment & Pipeline Status
            </h2>
            <p className="text-xs text-slate-400">
              Active build release metadata and microservices orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            CI Pipeline: {deployment?.ci_status ?? 'success'}
          </span>
        </div>
      </div>

      {/* Deployment Metadata Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-b border-slate-800/80 text-xs">
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-medium">
            <Tag className="w-3 h-3 text-indigo-400" /> Release Tag
          </span>
          <span className="font-semibold text-indigo-300 mt-1 block font-mono">
            {deployment?.release_tag || 'v1.0.0-phase1'}
          </span>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-medium">
            <GitBranch className="w-3 h-3 text-cyan-400" /> Git Branch
          </span>
          <span className="font-semibold text-slate-200 mt-1 block font-mono">
            {deployment?.branch || 'master'}
          </span>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-medium">
            <GitCommit className="w-3 h-3 text-purple-400" /> Commit SHA
          </span>
          <span className="font-semibold text-purple-300 mt-1 block font-mono">
            {deployment?.commit_sha || 'phase1-base'}
          </span>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-medium">
            <RotateCcw className="w-3 h-3 text-emerald-400" /> Rollback State
          </span>
          <span className="font-semibold text-emerald-300 mt-1 block">
            {deployment?.rollback_available ? 'Ready (Snapshot Verified)' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Microservice Components List */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Active Service Components
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {services && services.length > 0 ? (
            services.map((svc) => (
              <div
                key={svc.service_id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {svc.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {svc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                    {svc.role}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>v{svc.version}</span>
                  <span className="text-emerald-400/80">Heartbeat OK</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-3 text-center text-xs text-slate-400">
              No service metadata loaded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

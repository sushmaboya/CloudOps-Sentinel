import React from 'react';
import {
  Database,
  HardDrive,
  Layers,
  Server,
  Zap,
} from 'lucide-react';
import type { ComputeMetrics, DatabaseMetrics } from '../types/api';

interface InfrastructureOverviewProps {
  compute?: ComputeMetrics;
  database?: DatabaseMetrics;
}

export const InfrastructureOverview: React.FC<InfrastructureOverviewProps> = ({
  compute,
  database,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Cloud Infrastructure Overview
            </h2>
            <p className="text-xs text-slate-400">
              Simulated AWS Compute, Serverless, and Database Fleet
            </p>
          </div>
        </div>
        <span className="text-xs bg-slate-800/80 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md self-start sm:self-auto font-mono">
          AWS: us-east-1 (Simulated)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Compute Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Compute & Container Fleet
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* EC2 Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">Amazon EC2</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold">
                  Virtual VMs
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-white">
                    {compute?.ec2_instances_running ?? 0}
                  </span>
                  <span className="text-xs text-slate-400"> / {compute?.ec2_instances_total ?? 0} Running</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-cyan-300 block">
                    {compute?.ec2_cpu_average_pct ?? 0}%
                  </span>
                  <span className="text-[10px] text-slate-400">Avg CPU</span>
                </div>
              </div>
            </div>

            {/* ECS Containers Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">Amazon ECS</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold">
                  Containers
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-white">
                    {compute?.ecs_tasks_running ?? 0}
                  </span>
                  <span className="text-xs text-slate-400"> Active Tasks</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-indigo-300 block">
                    {compute?.ecs_clusters_total ?? 0}
                  </span>
                  <span className="text-[10px] text-slate-400">Clusters</span>
                </div>
              </div>
            </div>

            {/* Lambda Serverless */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-slate-300">AWS Lambda Functions</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Error rate: {compute?.lambda_error_rate_pct ?? 0}%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-lg font-bold text-white">
                    {compute?.lambda_functions_count ?? 0}
                  </span>
                  <span className="text-slate-400 ml-1">Deploys</span>
                </div>
                <div className="text-slate-300">
                  <span className="font-semibold text-white">
                    {(compute?.lambda_invocations_last_hour ?? 0).toLocaleString()}
                  </span>
                  <span className="text-slate-400 ml-1">invocations / hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Caching Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Databases & Managed Storage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* RDS PostgreSQL */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">RDS PostgreSQL</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">
                  {database?.primary_db_status || 'available'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-white">
                    {database?.rds_connections_active ?? 0}
                  </span>
                  <span className="text-xs text-slate-400"> Active Conns</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-cyan-300 block">
                    {database?.rds_cpu_pct ?? 0}%
                  </span>
                  <span className="text-[10px] text-slate-400">DB CPU</span>
                </div>
              </div>
            </div>

            {/* Storage & Caching */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">ElastiCache Redis</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold">
                  In-Memory
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-white">
                    {database?.cache_hit_rate_pct ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400"> Hit Rate</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-300 block">
                    {database?.cache_clusters_count ?? 1} Cluster
                  </span>
                  <span className="text-[10px] text-slate-400">Ready</span>
                </div>
              </div>
            </div>

            {/* Storage Metrics */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-medium text-slate-300">Free Database Storage Volume</span>
                </div>
                <span className="text-indigo-300 font-mono text-xs">
                  {database?.rds_storage_free_gb ?? 0} GB Free
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: '72%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

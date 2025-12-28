'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResourceCard from '@/components/monitoring/ResourceCard';
import NetworkCard from '@/components/monitoring/NetworkCard';
import ServiceHealthCard from '@/components/monitoring/ServiceHealthCard';
import SystemHealthCard from '@/components/monitoring/SystemHealthCard';
import { useMonitoring } from '@/hooks/useMonitoring';
import Button from '@/components/ui/Button';

export default function Monitoring() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data, loading, error, refetch } = useMonitoring(autoRefresh, 5000);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-green-500 to-emerald-600" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                VPS Monitoring
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Real-time monitoring of server resources and services
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {autoRefresh ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  )}
                </svg>
              }
            >
              {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
            </Button>
            <Button 
              variant="primary" 
              onClick={refetch} 
              disabled={loading}
              loading={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResourceCard
            type="cpu"
            title="CPU Usage"
            value={data?.cpu?.usage}
            percentage={data?.cpu?.percentage}
            status={data?.cpu?.status}
            unit="%"
            loading={loading}
          />
          <ResourceCard
            type="ram"
            title="RAM Usage"
            value={data?.ram?.used}
            used={data?.ram?.used}
            total={data?.ram?.total}
            percentage={data?.ram?.percentage}
            status={data?.ram?.status}
            unit="GB"
            loading={loading}
          />
          <ResourceCard
            type="disk"
            title="Disk Usage"
            value={data?.disk?.used}
            used={data?.disk?.used}
            total={data?.disk?.total}
            percentage={data?.disk?.percentage}
            status={data?.disk?.status}
            unit="GB"
            loading={loading}
          />
          <ResourceCard
            type="load"
            title="Load Average"
            value={data?.load_average?.value}
            status={data?.load_average?.status}
            loading={loading}
          />
        </div>

        {/* Network, Service, and System Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <NetworkCard data={data?.network} loading={loading} />
          <ServiceHealthCard data={data?.service} loading={loading} />
          <SystemHealthCard data={data?.system} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
}

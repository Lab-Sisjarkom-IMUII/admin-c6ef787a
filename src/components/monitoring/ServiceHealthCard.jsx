'use client';

import Card from '@/components/ui/Card';

function StatusIndicator({ status }) {
  const isUp = status === 'up' || status === 'online' || status === true;
  
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isUp ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span className={`text-sm font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}

export default function ServiceHealthCard({ data, loading = false }) {
  return (
    <Card glass className="relative">
      {loading && (
        <div className="absolute inset-0 bg-[var(--card)]/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
        Service Health
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]">
          <span className="text-sm text-[var(--foreground)]">IMUII Server</span>
          <StatusIndicator status={data?.imuii_server?.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[var(--muted)]">
            <p className="text-xs text-[var(--foreground)]/60 mb-1">API Response Time</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {data?.api_response_time !== undefined ? `${data.api_response_time}ms` : '--'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--muted)]">
            <p className="text-xs text-[var(--foreground)]/60 mb-1">Error Rate (5xx)</p>
            <p className={`text-lg font-semibold ${
              (data?.error_rate || 0) > 5 ? 'text-red-400' : 'text-[var(--foreground)]'
            }`}>
              {data?.error_rate !== undefined ? `${data.error_rate}%` : '--'}
            </p>
          </div>
        </div>

        {data?.queue_status && (
          <div className="p-3 rounded-lg bg-[var(--muted)]">
            <p className="text-xs text-[var(--foreground)]/60 mb-1">Queue Status</p>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {data.queue_status}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

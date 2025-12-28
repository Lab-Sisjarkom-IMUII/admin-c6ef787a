'use client';

import Card from '@/components/ui/Card';

function formatUptime(seconds) {
  if (!seconds) return '--';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function formatDate(dateString) {
  if (!dateString) return '--';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return '--';
  }
}

export default function SystemHealthCard({ data, loading = false }) {
  return (
    <Card glass className="relative">
      {loading && (
        <div className="absolute inset-0 bg-[var(--card)]/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
        System Health
      </h3>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--foreground)]/60 mb-1">Uptime</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatUptime(data?.uptime)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--foreground)]/60 mb-1">Last Reboot</p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {formatDate(data?.last_reboot || data?.lastReboot)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--foreground)]/60 mb-1">OS Info</p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {data?.os_info || (data?.osInfo ? `${data.osInfo.name} ${data.osInfo.version}` : '--')}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <p className="text-xs text-[var(--foreground)]/60 mb-1">Time Sync</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                (data?.time_sync || data?.timeSync) === 'synced' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-sm font-medium text-[var(--foreground)]">
              {(data?.time_sync || data?.timeSync) === 'synced' ? 'Synced' : 'Not Synced'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

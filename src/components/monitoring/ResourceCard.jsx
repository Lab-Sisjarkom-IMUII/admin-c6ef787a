'use client';

import Card from '@/components/ui/Card';

function StatusBadge({ status }) {
  const statusConfig = {
    healthy: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Healthy' },
    warning: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Warning' },
    critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Critical' },
  };

  const config = statusConfig[status] || statusConfig.healthy;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function ResourceCard({ type, title, value, percentage, used, total, unit = '', status = 'healthy', loading = false }) {
  const getStatus = () => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 70) return 'warning';
    return 'healthy';
  };

  const actualStatus = status || getStatus();

  return (
    <Card glass className="relative">
      {loading && (
        <div className="absolute inset-0 bg-[var(--card)]/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground)]/60 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {value !== undefined ? value : '--'}
            </span>
            {unit && (
              <span className="text-sm text-[var(--foreground)]/60">{unit}</span>
            )}
          </div>
        </div>
        <StatusBadge status={actualStatus} />
      </div>

      {used !== undefined && total !== undefined && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-[var(--foreground)]/60 mb-1">
            <span>{used} {unit} / {total} {unit}</span>
            <span>{percentage?.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                actualStatus === 'critical'
                  ? 'bg-red-500'
                  : actualStatus === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage || 0, 100)}%` }}
            />
          </div>
        </div>
      )}

      {percentage !== undefined && (!used || !total) && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-[var(--foreground)]/60 mb-1">
            <span>Usage</span>
            <span>{percentage?.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                actualStatus === 'critical'
                  ? 'bg-red-500'
                  : actualStatus === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage || 0, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

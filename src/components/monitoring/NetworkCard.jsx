'use client';

import Card from '@/components/ui/Card';

export default function NetworkCard({ data, loading = false }) {
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <Card glass className="relative">
      {loading && (
        <div className="absolute inset-0 bg-[var(--card)]/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
        Network Monitoring
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--foreground)]/60">Incoming</span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {data?.incoming ? formatBytes(data.incoming) : '--'} /s
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${Math.min((data?.incoming_percentage || 0), 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--foreground)]/60">Outgoing</span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {data?.outgoing ? formatBytes(data.outgoing) : '--'} /s
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${Math.min((data?.outgoing_percentage || 0), 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--foreground)]/60 mb-1">Packet Loss</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {data?.packet_loss !== undefined ? `${data.packet_loss}%` : data?.packetLoss !== undefined ? `${data.packetLoss}%` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--foreground)]/60 mb-1">Latency</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {data?.latency !== undefined ? `${data.latency}ms` : '--'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

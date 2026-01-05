'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';

const PAGE_SIZE = 4;

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '--';
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function formatUptime(seconds) {
  if (!seconds && seconds !== 0) return '--';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function StatusDot({ status }) {
  const normalized = (status || '').toLowerCase();
  const isOnline = normalized === 'online' || normalized === 'up';
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}
      title={status || 'unknown'}
    />
  );
}

export default function Pm2ProcessesCard({ processes = [], loading = false }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(processes.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processes.slice(start, start + PAGE_SIZE);
  }, [processes, page]);

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1));
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <Card glass className="relative">
      {loading && (
        <div className="absolute inset-0 bg-[var(--card)]/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">PM2 Processes</h3>
        <span className="text-xs text-[var(--foreground)]/60">
          {processes.length} total
        </span>
      </div>

      {processes.length ? (
        <div className="space-y-3">
          {pageItems.map((proc) => (
            <div key={`${proc.id}-${proc.name}`} className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={proc.status} />
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {proc.name || `#${proc.id}`}
                    </p>
                    <span className="text-xs text-[var(--foreground)]/50">
                      {proc.namespace || 'default'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/60">
                    pid {proc.pid || '--'} • restarts {proc.restarts ?? '--'}
                  </p>
                </div>
                <div className="text-right text-xs text-[var(--foreground)]/70">
                  <div>{proc.cpuPercent?.toFixed ? `${proc.cpuPercent.toFixed(1)}%` : '--'} CPU</div>
                  <div>{formatBytes(proc.memoryBytes)}</div>
                  <div>{formatUptime(proc.uptimeSec)}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between text-xs text-[var(--foreground)]/70">
            <span>
              Page {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={page === 1}
                className="px-2 py-1 rounded border border-[var(--border)] disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={page === totalPages}
                className="px-2 py-1 rounded border border-[var(--border)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-[var(--foreground)]/60">Belum ada proses PM2 yang aktif.</div>
      )}
    </Card>
  );
}

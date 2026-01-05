'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Pm2LogsCard({ logs = [], loading = false, onRefresh }) {
  return (
    <Card glass className="p-0 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-[var(--border)]/60 bg-[var(--muted)]/40 gap-2">
        <div>
          <p className="text-sm text-[var(--foreground)]/70">PM2 Cleanup Logs</p>
          <p className="text-xs text-[var(--foreground)]/50">/var/log/pm2-cleanup.log</p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          loading={loading}
          icon={(
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        >
          Refresh
        </Button>
      </div>
      <div className="bg-black text-green-400 font-mono text-xs md:text-sm px-6 py-4 max-h-[45vh] overflow-y-auto whitespace-pre-wrap">
        {loading && logs.length === 0 ? (
          <div className="text-green-300/70">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-green-300/70">Belum ada log untuk ditampilkan.</div>
        ) : (
          logs.join('\n')
        )}
      </div>
    </Card>
  );
}

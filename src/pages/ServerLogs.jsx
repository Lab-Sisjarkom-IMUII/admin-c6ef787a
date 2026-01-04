'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useServerLogs } from '@/hooks/useServerLogs';

export default function ServerLogs() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { logs, loading, error, refetch, clearLogs } = useServerLogs(autoRefresh, 5000);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-600" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Server Terminal Logs
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Auto polling 5s, append-only tanpa websocket
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 ml-4">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              icon={(
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {autoRefresh ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  )}
                </svg>
              )}
            >
              {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
            </Button>
            <Button
              variant="primary"
              onClick={() => refetch({ reset: true })}
              disabled={loading}
              loading={loading}
              icon={(
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            >
              Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={clearLogs}
              icon={(
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            >
              Clear
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Card glass className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]/60 bg-[var(--muted)]/40">
            <div className="text-sm text-[var(--foreground)]/70">
              {autoRefresh ? 'Auto-refresh aktif' : 'Auto-refresh berhenti'}
            </div>
            <div className="text-xs text-[var(--foreground)]/50">
              Menampilkan max 200 baris terakhir
            </div>
          </div>
          <div className="bg-black text-green-400 font-mono text-xs md:text-sm px-6 py-4 max-h-[65vh] overflow-y-auto whitespace-pre-wrap">
            {loading && logs.length === 0 ? (
              <div className="text-green-300/70">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-green-300/70">Belum ada log untuk ditampilkan.</div>
            ) : (
              logs.join('\n')
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

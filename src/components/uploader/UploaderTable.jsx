'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';

export default function UploaderTable({ uploaders, loading, onRefresh, onViewDetail }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <Card glass className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Template Uploaders</h2>
          <p className="text-sm text-[var(--foreground)]/60">
            Daftar semua akun template uploader yang terdaftar.
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            loading={loading}
          >
            Refresh
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border)]/60 overflow-hidden bg-[var(--muted)]/40">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)]/60 text-[var(--foreground)]/70">
                <th className="px-4 py-3 text-left font-medium">Username</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Last Login</th>
                <th className="px-4 py-3 text-left font-medium">Created At</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {loading ? (
                [...Array(3)].map((_, idx) => (
                  <tr key={idx} className="hover:bg-[var(--muted)]/40">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : uploaders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-[var(--foreground)]/60 text-sm"
                  >
                    Belum ada template uploader yang terdaftar.
                  </td>
                </tr>
              ) : (
                uploaders.map((uploader) => (
                  <tr
                    key={uploader.id}
                    className="hover:bg-[var(--muted)]/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--foreground)] font-medium">
                      {uploader.username || '--'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/80">
                      {uploader.email || '--'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/80">
                      {uploader.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={uploader.is_active ? 'success' : 'danger'}
                        variant="soft"
                      >
                        {uploader.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/70 text-xs">
                      {formatDate(uploader.last_login_at)}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/60 text-xs">
                      {formatDate(uploader.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail?.(uploader)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}


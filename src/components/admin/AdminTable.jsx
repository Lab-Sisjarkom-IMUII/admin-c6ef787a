'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminTable({ admins, loading, onRefresh }) {
  return (
    <Card glass className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Admin List</h2>
          <p className="text-sm text-[var(--foreground)]/60">
            Daftar admin yang memiliki akses ke IMUII Admin.
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
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Last Login</th>
                <th className="px-4 py-3 text-left font-medium">Created At</th>
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
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[var(--foreground)]/60 text-sm"
                  >
                    Belum ada data admin. Backend perlu menambahkan endpoint manajemen admin
                    (catatan TODO untuk backend).
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-[var(--muted)]/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {admin.username || '--'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/80">
                      {admin.email || '--'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30">
                        {admin.role || 'admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/70">
                      {admin.last_login_at
                        ? new Date(admin.last_login_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]/60 text-xs">
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleString()
                        : '—'}
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



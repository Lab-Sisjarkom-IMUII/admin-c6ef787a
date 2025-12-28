'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminTable from '@/components/admin/AdminTable';
import AdminFormModal from '@/components/admin/AdminFormModal';
import { useAdmins } from '@/hooks/useAdmins';
import Button from '@/components/ui/Button';

export default function AdminManagement() {
  const { admins, loading, error, fetchAdmins, createAdmin } = useAdmins();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async (values) => {
    const result = await createAdmin(values);
    return result;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full gradient-primary" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Admin Management
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Kelola akun admin yang memiliki akses ke IMUII Admin.
              Fitur ini memerlukan endpoint manajemen admin di backend.
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <Button
              variant="outline"
              onClick={fetchAdmins}
              disabled={loading}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Tambah Admin
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/40 p-4">
            <p className="text-sm text-yellow-300">
              {error}
            </p>
            <p className="text-xs text-yellow-300/80 mt-1">
              Catatan: kemungkinan endpoint manajemen admin belum tersedia di backend.
              Backend perlu menambahkan endpoint seperti <code>GET /api/v1/admin/admins</code>{' '}
              dan <code>POST /api/v1/admin/admins</code>.
            </p>
          </div>
        )}

        {/* Admin Table */}
        <AdminTable admins={admins} loading={loading} onRefresh={fetchAdmins} />

        {/* Create Admin Modal */}
        <AdminFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAdmin}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}



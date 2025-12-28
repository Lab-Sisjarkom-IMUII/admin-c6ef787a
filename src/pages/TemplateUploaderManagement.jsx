'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UploaderTable from '@/components/uploader/UploaderTable';
import UploaderDetailModal from '@/components/uploader/UploaderDetailModal';
import { useTemplateUploaders } from '@/hooks/useTemplateUploaders';
import Button from '@/components/ui/Button';

export default function TemplateUploaderManagement() {
  const { uploaders, loading, error, pagination, fetchUploaders } = useTemplateUploaders();
  const [selectedUploader, setSelectedUploader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUploaders(1, 10);
  }, [fetchUploaders]);

  const handleViewDetail = (uploader) => {
    setSelectedUploader(uploader);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUploader(null);
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
                Template Uploaders
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Kelola dan monitor semua akun template uploader yang terdaftar di sistem.
              Lihat detail uploader dan template yang sudah mereka upload.
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchUploaders(pagination.page, pagination.limit)}
              disabled={loading}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {/* Uploaders Table */}
        <UploaderTable
          uploaders={uploaders}
          loading={loading}
          onRefresh={() => fetchUploaders(pagination.page, pagination.limit)}
          onViewDetail={handleViewDetail}
        />

        {/* Pagination Info */}
        {!loading && uploaders.length > 0 && (
          <div className="text-sm text-[var(--foreground)]/60 text-center">
            Menampilkan {uploaders.length} dari {pagination.total} uploader
            {pagination.total > pagination.limit && (
              <span className="ml-2">
                (Halaman {pagination.page} dari {Math.ceil(pagination.total / pagination.limit)})
              </span>
            )}
          </div>
        )}

        {/* Detail Modal */}
        <UploaderDetailModal
          uploader={selectedUploader}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </DashboardLayout>
  );
}


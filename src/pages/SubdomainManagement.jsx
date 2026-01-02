'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubdomainTable from '@/components/subdomain/SubdomainTable';
import SubdomainFilters from '@/components/subdomain/SubdomainFilters';
import ReserveSubdomainModal from '@/components/subdomain/ReserveSubdomainModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AlertModal from '@/components/ui/AlertModal';
import { useSubdomains } from '@/hooks/useSubdomains';
import Button from '@/components/ui/Button';

export default function SubdomainManagement() {
  const { subdomains, loading, error, pagination, fetchSubdomains, reserveSubdomain, releaseSubdomain } = useSubdomains();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, subdomain: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', variant: 'error' });
  const [releasing, setReleasing] = useState(false);
  const hasActiveFilters = Boolean(
    search ||
    sourceFilter !== 'all' ||
    statusFilter !== 'all'
  );
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  useEffect(() => {
    if (hasActiveFilters) {
      fetchSubdomains(1, 100, { loadAll: true });
    } else {
      fetchSubdomains(1, 25);
    }
  }, [fetchSubdomains, hasActiveFilters]);

  const refreshSubdomains = (pageOverride) => {
    if (hasActiveFilters) {
      return fetchSubdomains(1, 100, { loadAll: true });
    }
    return fetchSubdomains(pageOverride ?? pagination.page, pagination.limit);
  };

  const filteredSubdomains = useMemo(() => {
    return subdomains.filter((subdomain) => {
      const matchesSearch = !search || 
        subdomain.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
        subdomain.full_domain?.toLowerCase().includes(search.toLowerCase());
      
      const matchesSource = sourceFilter === 'all' || 
        subdomain.source === sourceFilter || 
        (sourceFilter === 'reserved' && subdomain.status === 'reserved');
      const matchesStatus = statusFilter === 'all' || subdomain.status === statusFilter;
      
      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [subdomains, search, sourceFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setSourceFilter('all');
    setStatusFilter('all');
  };

  const handleRowClick = (subdomain) => {
    // TODO: Open detail modal
    console.log('Subdomain clicked:', subdomain);
  };

  const handleReserve = async (subdomain) => {
    const result = await reserveSubdomain(subdomain, { loadAll: hasActiveFilters });
    if (result.success) {
      setIsReserveModalOpen(false);
    } else {
      throw new Error(result.error || 'Failed to reserve subdomain');
    }
  };

  const handleReleaseClick = (subdomain) => {
    setConfirmModal({ isOpen: true, subdomain });
  };

  const handleConfirmRelease = async () => {
    const { subdomain } = confirmModal;
    if (!subdomain) return;

    setReleasing(true);
    setConfirmModal({ isOpen: false, subdomain: null });

    // For reserved subdomains from /admin/subdomains/active, use source_id as the ID
    // For reserved subdomains from /admin/subdomains/reserved, use id
    const subdomainId = subdomain.id || subdomain.source_id;
    if (!subdomainId) {
      setAlertModal({
        isOpen: true,
        message: 'Cannot release: Subdomain ID not found',
        variant: 'error',
      });
      setReleasing(false);
      return;
    }

    const result = await releaseSubdomain(subdomainId, { loadAll: hasActiveFilters });
    setReleasing(false);

    if (!result.success) {
      setAlertModal({
        isOpen: true,
        message: result.error || 'Failed to release subdomain',
        variant: 'error',
      });
    } else {
      setAlertModal({
        isOpen: true,
        message: `Subdomain "${subdomain.subdomain}.imuii.id" has been released successfully.`,
        variant: 'success',
      });
    }
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
                Subdomain Management
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              View and manage subdomains. Reserve subdomains to secure them before use.
            </p>
          </div>
          <div className="flex gap-3 ml-4">
            <Button 
              variant="accent" 
              onClick={() => setIsReserveModalOpen(true)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Reserve Subdomain
            </Button>
            <Button 
              variant="primary" 
              onClick={() => refreshSubdomains()} 
              disabled={loading}
              loading={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Sync from Server
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <SubdomainFilters
          search={search}
          onSearchChange={setSearch}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <SubdomainTable
          subdomains={filteredSubdomains}
          loading={loading}
          onRowClick={handleRowClick}
          onDelete={handleReleaseClick}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-[var(--foreground)]/60">
          <span>
            Menampilkan {filteredSubdomains.length} dari {pagination.total} subdomain
          </span>
          {pagination.total > pagination.limit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshSubdomains(pagination.page - 1)}
                disabled={loading || pagination.page <= 1}
              >
                Prev
              </Button>
              <span>
                Halaman {pagination.page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshSubdomains(pagination.page + 1)}
                disabled={loading || pagination.page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Reserve Subdomain Modal */}
        <ReserveSubdomainModal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          onSubmit={handleReserve}
        />

        {/* Confirm Release Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, subdomain: null })}
          onConfirm={handleConfirmRelease}
          title="Release Subdomain"
          message={
            confirmModal.subdomain
              ? `Are you sure you want to release "${confirmModal.subdomain.subdomain}.imuii.id"? This will make it available for use by projects or portfolios.`
              : ''
          }
          confirmText="Release"
          cancelText="Cancel"
          variant="warning"
          loading={releasing}
        />

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ isOpen: false, message: '', variant: 'error' })}
          title={alertModal.variant === 'success' ? 'Success' : alertModal.variant === 'error' ? 'Error' : 'Alert'}
          message={alertModal.message}
          variant={alertModal.variant}
        />
      </div>
    </DashboardLayout>
  );
}

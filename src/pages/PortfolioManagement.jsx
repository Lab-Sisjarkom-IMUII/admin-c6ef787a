'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import PortfolioFilters from '@/components/portfolio/PortfolioFilters';
import PortfolioDetailModal from '@/components/portfolio/PortfolioDetailModal';
import { usePortfolios } from '@/hooks/usePortfolios';
import Button from '@/components/ui/Button';


export default function PortfolioManagement() {
  const { portfolios, loading, error, pagination, fetchPortfolios } = usePortfolios();
  const [search, setSearch] = useState('');
  const [domainSearch, setDomainSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasActiveFilters = Boolean(
    search ||
    domainSearch ||
    ownerFilter ||
    statusFilter !== 'all'
  );
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  useEffect(() => {
    if (hasActiveFilters) {
      fetchPortfolios(1, 100, { loadAll: true });
    } else {
      fetchPortfolios(1, 25);
    }
  }, [fetchPortfolios, hasActiveFilters]);

  const refreshPortfolios = (pageOverride) => {
    if (hasActiveFilters) {
      return fetchPortfolios(1, 100, { loadAll: true });
    }
    return fetchPortfolios(pageOverride ?? pagination.page, pagination.limit);
  };

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((portfolio) => {
      const matchesSearch = !search || 
        portfolio.name?.toLowerCase().includes(search.toLowerCase());
      
      const matchesDomain = !domainSearch || 
        portfolio.domain_name?.toLowerCase().includes(domainSearch.toLowerCase()) ||
        portfolio.deploy_url?.toLowerCase().includes(domainSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || portfolio.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesOwner = !ownerFilter || 
        portfolio.user?.email?.toLowerCase().includes(ownerFilter.toLowerCase()) ||
        portfolio.user?.name?.toLowerCase().includes(ownerFilter.toLowerCase());
      
      return matchesSearch && matchesDomain && matchesStatus && matchesOwner;
    });
  }, [portfolios, search, domainSearch, statusFilter, ownerFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setDomainSearch('');
    setStatusFilter('all');
    setOwnerFilter('');
  };

  const handleView = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const handleDelete = (portfolio) => {
    // TODO: Implement delete functionality
    console.log('Delete portfolio:', portfolio);
    refreshPortfolios(); // Refresh list
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full gradient-accent" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Portfolio Management
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              View and delete portfolios. Editing is restricted to portfolio owners.
            </p>
          </div>
          <div className="ml-4">
            <Button 
              variant="primary" 
              onClick={() => refreshPortfolios()} 
              disabled={loading}
              loading={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Refresh
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
        <PortfolioFilters
          search={search}
          onSearchChange={setSearch}
          domainSearch={domainSearch}
          onDomainSearchChange={setDomainSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          ownerFilter={ownerFilter}
          onOwnerFilterChange={setOwnerFilter}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <PortfolioTable
          portfolios={filteredPortfolios}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-[var(--foreground)]/60">
          <span>
            Menampilkan {filteredPortfolios.length} dari {pagination.total} portfolio
          </span>
          {pagination.total > pagination.limit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshPortfolios(pagination.page - 1)}
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
                onClick={() => refreshPortfolios(pagination.page + 1)}
                disabled={loading || pagination.page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <PortfolioDetailModal
          portfolio={selectedPortfolio}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPortfolio(null);
          }}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}

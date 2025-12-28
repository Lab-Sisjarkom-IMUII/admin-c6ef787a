'use client';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function SubdomainFilters({ search, onSearchChange, sourceFilter, onSourceFilterChange, statusFilter, onStatusFilterChange, onClear }) {
  const hasActiveFilters = sourceFilter !== 'all' || statusFilter !== 'all' || search;
  
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by subdomain name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              className="px-4 py-2.5 pr-10 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer hover:border-[var(--primary)]/50"
            >
              <option value="all">All Sources</option>
              <option value="project">Project</option>
              <option value="portfolio">Portfolio</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[var(--foreground)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-2.5 pr-10 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer hover:border-[var(--primary)]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[var(--foreground)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {hasActiveFilters && (
            <Button variant="outline" onClick={onClear} icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }>
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[var(--foreground)]/60">Active filters:</span>
          {search && (
            <Badge variant="soft" color="default">
              Search: {search}
            </Badge>
          )}
          {sourceFilter !== 'all' && (
            <Badge variant="soft" color="primary">
              Source: {sourceFilter}
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="soft" color="info">
              Status: {statusFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

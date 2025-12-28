'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

function StatusBadge({ status }) {
  const statusConfig = {
    active: { color: 'success', pulse: true },
    inactive: { color: 'default' },
    reserved: { color: 'warning' },
  };

  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <Badge variant="soft" color={config.color} pulse={config.pulse}>
      {status === 'active' && (
        <div className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {status === 'active' ? 'Active' : status === 'reserved' ? 'Reserved' : 'Inactive'}
    </Badge>
  );
}

function SourceBadge({ source }) {
  if (!source || source === 'reserved') {
    return <Badge variant="soft" color="info">Reserved</Badge>;
  }
  
  const isProject = source === 'project';
  return (
    <Badge variant="soft" color={isProject ? 'primary' : 'accent'}>
      {isProject ? 'Project' : 'Portfolio'}
    </Badge>
  );
}

export default function SubdomainTable({ subdomains, loading, onRowClick, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '--';
    }
  };

  if (loading) {
    return (
      <Card glass>
        <SkeletonTable rows={5} cols={7} className="p-4" />
      </Card>
    );
  }

  if (subdomains.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        }
        title="No Subdomains Found"
        description="There are no subdomains matching your current filters."
      />
    );
  }

  return (
    <Card glass className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--card)]/80 backdrop-blur-sm z-10">
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Subdomain</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Full Domain</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Source</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Source Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Created At</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subdomains.map((subdomain, index) => (
              <tr
                key={subdomain.id || index}
                onClick={() => onRowClick && onRowClick(subdomain)}
                className="border-b border-[var(--border)]/50 hover:bg-gradient-to-r hover:from-[var(--primary)]/5 hover:to-transparent cursor-pointer transition-all duration-200 group"
              >
                <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {subdomain.subdomain || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/80">{subdomain.full_domain || '--'}</td>
                <td className="py-4 px-6">
                  <SourceBadge source={subdomain.source} />
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/70">{subdomain.source_name || '--'}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={subdomain.status} />
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/60">{formatDate(subdomain.created_at)}</td>
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  {subdomain.source === 'reserved' && onDelete && (subdomain.id || subdomain.source_id) ? (
                    <button
                      onClick={() => onDelete(subdomain)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Release
                    </button>
                  ) : (
                    <span className="text-sm text-[var(--foreground)]/20">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

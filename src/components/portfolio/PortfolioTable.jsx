'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getPortfolioStatusColor, getPortfolioStatusLabel } from '@/utils/status';

function StatusBadge({ status }) {
  const statusMap = {
    deployed: 'success',
    draft: 'default',
  };
  
  return (
    <Badge variant="soft" color={statusMap[status] || 'default'}>
      {getPortfolioStatusLabel(status)}
    </Badge>
  );
}

export default function PortfolioTable({ portfolios, loading, onRowClick, onView, onDelete }) {
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
        <SkeletonTable rows={5} cols={8} className="p-4" />
      </Card>
    );
  }

  if (portfolios.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
        title="No Portfolios Found"
        description="There are no portfolios matching your current filters."
      />
    );
  }

  return (
    <Card glass className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--card)]/80 backdrop-blur-sm z-10">
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Portfolio Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Domain Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Deploy URL</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Owner</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Template</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Created At</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio, index) => (
              <tr
                key={portfolio.id || index}
                onClick={() => onRowClick && onRowClick(portfolio)}
                className="border-b border-[var(--border)]/50 hover:bg-gradient-to-r hover:from-[var(--accent)]/5 hover:to-transparent cursor-pointer transition-all duration-200 group"
              >
                <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {portfolio.name || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/80">{portfolio.domain_name || '--'}</td>
                <td className="py-4 px-6 text-sm">
                  {portfolio.deploy_url ? (
                    <a
                      href={portfolio.deploy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 hover:underline transition-colors"
                    >
                      {portfolio.deploy_url}
                    </a>
                  ) : '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/70">
                  {portfolio.user?.email || portfolio.user?.name || '--'}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={portfolio.status} />
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" color="default">
                    {portfolio.template?.name || '--'}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/60">{formatDate(portfolio.created_at)}</td>
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView && onView(portfolio)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      }
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(portfolio)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Card>
  );
}

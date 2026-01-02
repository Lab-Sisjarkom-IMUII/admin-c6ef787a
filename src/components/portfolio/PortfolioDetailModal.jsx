'use client';

import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getPortfolioStatusColor, getPortfolioStatusLabel } from '@/utils/status';

export default function PortfolioDetailModal({ portfolio, isOpen, onClose, onDelete }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !portfolio) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '--';
    }
  };

  const liveUrl = portfolio.deploy_url
    || (portfolio.status === 'deployed' && portfolio.domain_name ? `https://${portfolio.domain_name}.imuii.id` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card glass className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Portfolio Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Portfolio Name</label>
            <p className="text-[var(--foreground)]">{portfolio.name || '--'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Domain Name</label>
            <p className="text-[var(--foreground)]">{portfolio.domain_name || '--'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Live URL</label>
            <p className="text-[var(--foreground)]">
              {liveUrl ? (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                  {liveUrl}
                </a>
              ) : '--'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Status</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPortfolioStatusColor(portfolio.status)}`}>
                {getPortfolioStatusLabel(portfolio.status)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Template</label>
            <p className="text-[var(--foreground)]">{portfolio.template?.name || '--'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]/60">Owner</label>
            <div className="mt-1">
              <p className="text-[var(--foreground)]">{portfolio.user?.name || portfolio.user?.email || '--'}</p>
              {portfolio.user?.email && (
                <p className="text-sm text-[var(--foreground)]/60">{portfolio.user.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)]/60">Created At</label>
              <p className="text-[var(--foreground)]">{formatDate(portfolio.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--foreground)]/60">Updated At</label>
              <p className="text-[var(--foreground)]">{formatDate(portfolio.updated_at)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this portfolio?')) {
                    onDelete(portfolio);
                    onClose();
                  }
                }}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

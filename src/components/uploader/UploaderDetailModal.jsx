'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { apiRequest } from '@/utils/api';

export default function UploaderDetailModal({ uploader, isOpen, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (isOpen && uploader?.id) {
      fetchTemplates();
    } else {
      setTemplates([]);
      setError(null);
    }
  }, [isOpen, uploader?.id]);

  const fetchTemplates = async () => {
    if (!uploader?.id) return;
    
    setLoadingTemplates(true);
    setError(null);
    try {
      // Fetch all templates and filter by uploader_id
      // Using /templates endpoint which should return all templates
      const response = await apiRequest(`/templates?page=1&limit=1000`);
      const allTemplates = response.templates || response.data?.templates || [];
      
      // Filter templates by uploader_id
      const uploaderTemplates = Array.isArray(allTemplates)
        ? allTemplates.filter(t => t.uploader_id === uploader.id)
        : [];
      
      setTemplates(uploaderTemplates);
    } catch (err) {
      console.error('Failed to fetch uploader templates:', err);
      setError(err.message || 'Gagal memuat template uploader.');
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  if (!isOpen || !uploader) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '--';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card glass className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Uploader Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Uploader Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)]/50 pb-2">
              Informasi Uploader
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Username</label>
                <p className="text-[var(--foreground)] font-medium">{uploader.username || '--'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Email</label>
                <p className="text-[var(--foreground)]">{uploader.email || '--'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Name</label>
                <p className="text-[var(--foreground)]">{uploader.name || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Status</label>
                <div className="mt-1">
                  <Badge color={uploader.is_active ? 'success' : 'danger'} variant="soft">
                    {uploader.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Last Login</label>
                <p className="text-[var(--foreground)]">{formatDate(uploader.last_login_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Created At</label>
                <p className="text-[var(--foreground)]">{formatDate(uploader.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Uploaded Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)]/50 pb-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Templates yang Diupload ({templates.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTemplates}
                disabled={loadingTemplates}
                loading={loadingTemplates}
              >
                Refresh
              </Button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            {loadingTemplates ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-[var(--border)]/50 bg-[var(--muted)]/40">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="p-6 text-center rounded-lg border border-[var(--border)]/50 bg-[var(--muted)]/40">
                <p className="text-[var(--foreground)]/60">
                  Uploader ini belum mengupload template apapun.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-[var(--border)]/50 bg-[var(--muted)]/40 hover:bg-[var(--muted)]/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-[var(--foreground)]">
                            {template.name || 'Untitled Template'}
                          </h4>
                          {template.owner_type === 'uploader' && (
                            <Badge color="info" variant="soft">
                              Uploader Template
                            </Badge>
                          )}
                        </div>
                        {template.description && (
                          <p className="text-sm text-[var(--foreground)]/70 mb-2 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-[var(--foreground)]/50">
                          <span>Created: {formatDate(template.created_at)}</span>
                          {template.updated_at && (
                            <span>Updated: {formatDate(template.updated_at)}</span>
                          )}
                        </div>
                      </div>
                      {template.thumbnail_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="w-20 h-20 object-cover rounded-lg border border-[var(--border)]/50"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}


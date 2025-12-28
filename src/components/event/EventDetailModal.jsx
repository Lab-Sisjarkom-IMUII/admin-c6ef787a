'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getEventStatusColor, getEventStatusLabel } from '@/utils/status';
import { apiRequest } from '@/utils/api';

export default function EventDetailModal({ event, isOpen, onClose, onEdit, onDelete }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    if (isOpen && event?.id) {
      document.body.style.overflow = 'hidden';
      loadProjects();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, event]);

  const loadProjects = async () => {
    if (!event?.id) return;
    setLoadingProjects(true);
    try {
      const response = await apiRequest(`/admin/events/${event.id}/projects`);
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { success: true, projects: [...] } }
      // Mock data: response = { success: true, projects: [...] }
      setProjects(response.projects || response.data?.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '--';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card glass className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)]/60">Event Name</label>
              <p className="text-[var(--foreground)] text-lg font-semibold">{event.name || '--'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)]/60">Description</label>
              <p className="text-[var(--foreground)]">{event.description || '--'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Start Date</label>
                <p className="text-[var(--foreground)]">{formatDate(event.start_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">End Date</label>
                <p className="text-[var(--foreground)]">{formatDate(event.end_date)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)]/60">Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getEventStatusColor(event.status)}`}>
                  {getEventStatusLabel(event.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Created At</label>
                <p className="text-[var(--foreground)]">{formatDate(event.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]/60">Updated At</label>
                <p className="text-[var(--foreground)]">{formatDate(event.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="border-t border-[var(--border)] pt-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Registered Projects ({event.project_count || 0})
            </h3>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 bg-[var(--muted)] rounded-lg">
                <p className="text-[var(--foreground)]/60">No projects registered for this event</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{project.name || '--'}</p>
                        <p className="text-sm text-[var(--foreground)]/60">
                          Owner: {project.owner?.email || project.owner?.name || '--'}
                        </p>
                        <p className="text-xs text-[var(--foreground)]/50 mt-1">
                          Registered: {formatDate(project.registered_at)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        project.status === 'deployed'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {project.status || '--'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button variant="primary" onClick={() => onEdit(event)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    onDelete(event);
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

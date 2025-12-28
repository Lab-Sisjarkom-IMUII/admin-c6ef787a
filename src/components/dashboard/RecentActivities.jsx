'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';
import { getProjectStatusColor, getProjectStatusLabel } from '@/utils/status';
import { getPortfolioStatusColor, getPortfolioStatusLabel } from '@/utils/status';
import { getEventStatusColor, getEventStatusLabel } from '@/utils/status';

function StatusBadge({ status, type = 'project' }) {
  let colorClass, label;
  
  if (type === 'project') {
    colorClass = getProjectStatusColor(status);
    label = getProjectStatusLabel(status);
  } else if (type === 'portfolio') {
    colorClass = getPortfolioStatusColor(status);
    label = getPortfolioStatusLabel(status);
  } else {
    colorClass = getEventStatusColor(status);
    label = getEventStatusLabel(status);
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return '--';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  } catch {
    return '--';
  }
}

export default function RecentActivities({ projects, portfolios, events, subdomains, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card glass key={i}>
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Projects */}
      <Card glass>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Projects</h3>
          <Link href="/dashboard/projects" className="text-sm text-[var(--primary)] hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {projects && projects.length > 0 ? (
            projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">{project.name}</p>
                    <p className="text-xs text-[var(--foreground)]/60 mt-1">
                      {project.owner?.name || project.owner?.email || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={project.status} type="project" />
                    <span className="text-xs text-[var(--foreground)]/50">
                      {formatDate(project.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--foreground)]/60 text-center py-4">No projects yet</p>
          )}
        </div>
      </Card>

      {/* Recent Events */}
      <Card glass>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Upcoming Events</h3>
          <Link href="/dashboard/events" className="text-sm text-[var(--primary)] hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">{event.name}</p>
                    <p className="text-xs text-[var(--foreground)]/60 mt-1">
                      {event.project_count || 0} projects
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={event.status} type="event" />
                    <span className="text-xs text-[var(--foreground)]/50">
                      {formatDate(event.start_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--foreground)]/60 text-center py-4">No events yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}

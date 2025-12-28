'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getEventStatusColor, getEventStatusLabel } from '@/utils/status';

function StatusBadge({ status }) {
  const statusMap = {
    active: 'success',
    upcoming: 'info',
    completed: 'default',
    cancelled: 'danger',
  };
  
  return (
    <Badge variant="soft" color={statusMap[status] || 'default'}>
      {getEventStatusLabel(status)}
    </Badge>
  );
}

export default function EventTable({ events, loading, onRowClick, onView, onEdit, onDelete }) {
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

  if (events.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        title="No Events Found"
        description="There are no events matching your current filters."
      />
    );
  }

  return (
    <Card glass className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--card)]/80 backdrop-blur-sm z-10">
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Event Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Description</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Start Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">End Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Project Count</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Created At</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id || index}
                onClick={() => onRowClick && onRowClick(event)}
                className="border-b border-[var(--border)]/50 hover:bg-gradient-to-r hover:from-[var(--primary)]/5 hover:to-transparent cursor-pointer transition-all duration-200 group"
              >
                <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {event.name || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/80 max-w-xs truncate">
                  {event.description || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/70">{formatDate(event.start_date)}</td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/70">{formatDate(event.end_date)}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={event.status} />
                </td>
                <td className="py-4 px-6">
                  <Badge variant="soft" color="primary">
                    {event.project_count || 0} Projects
                  </Badge>
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/60">{formatDate(event.created_at)}</td>
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView && onView(event)}
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
                      onClick={() => onEdit && onEdit(event)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(event)}
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

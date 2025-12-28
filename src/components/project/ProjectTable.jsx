'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getProjectStatusColor, getProjectStatusLabel } from '@/utils/status';

function StatusBadge({ status }) {
  const statusMap = {
    deployed: 'success',
    building: 'warning',
    failed: 'danger',
    draft: 'default',
  };
  
  return (
    <Badge variant="soft" color={statusMap[status] || 'default'}>
      {getProjectStatusLabel(status)}
    </Badge>
  );
}

export default function ProjectTable({ projects, loading, onRowClick, onView, onDelete }) {
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

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        }
        title="No Projects Found"
        description="There are no projects matching your current filters."
      />
    );
  }

  return (
    <Card glass className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--card)]/80 backdrop-blur-sm z-10">
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Project Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Description</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Owner</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Source</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Created At</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-[var(--foreground)]/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id || index}
                onClick={() => onRowClick && onRowClick(project)}
                className="border-b border-[var(--border)]/50 hover:bg-gradient-to-r hover:from-[var(--primary)]/5 hover:to-transparent cursor-pointer transition-all duration-200 group"
              >
                <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {project.name || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/80 max-w-xs truncate">
                  {project.description || '--'}
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/70">
                  {project.owner?.email || project.owner?.name || '--'}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={project.status} />
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" color="default">
                    {project.source?.toUpperCase() || '--'}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-sm text-[var(--foreground)]/60">{formatDate(project.created_at)}</td>
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView && onView(project)}
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
                      onClick={() => onDelete && onDelete(project)}
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

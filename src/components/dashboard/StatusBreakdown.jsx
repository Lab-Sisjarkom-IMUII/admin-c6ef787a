'use client';

import Card from '@/components/ui/Card';

export default function StatusBreakdown({ projects, portfolios, events, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card glass key={i}>
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const ProjectBreakdown = () => {
    if (!projects?.byStatus) return null;
    
    const total = Object.values(projects.byStatus).reduce((sum, val) => sum + val, 0);
    const statusColors = {
      deployed: 'bg-green-500',
      building: 'bg-yellow-500',
      pending: 'bg-blue-500',
      failed: 'bg-red-500',
      initialized: 'bg-blue-500',
      inactive: 'bg-gray-500',
    };

    return (
      <Card glass>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Projects Status</h3>
        <div className="space-y-3">
          {Object.entries(projects.byStatus).map(([status, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[var(--foreground)] capitalize">{status}</span>
                  <span className="text-sm text-[var(--foreground)]/60">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusColors[status] || 'bg-gray-500'} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const PortfolioBreakdown = () => {
    if (!portfolios?.byStatus) return null;
    
    const total = Object.values(portfolios.byStatus).reduce((sum, val) => sum + val, 0);
    const statusColors = {
      deployed: 'bg-green-500',
      draft: 'bg-blue-500',
    };

    return (
      <Card glass>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Portfolios Status</h3>
        <div className="space-y-3">
          {Object.entries(portfolios.byStatus).map(([status, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[var(--foreground)] capitalize">{status}</span>
                  <span className="text-sm text-[var(--foreground)]/60">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusColors[status] || 'bg-gray-500'} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const EventBreakdown = () => {
    if (!events?.byStatus) return null;
    
    const total = Object.values(events.byStatus).reduce((sum, val) => sum + val, 0);
    const statusColors = {
      active: 'bg-green-500',
      upcoming: 'bg-blue-500',
      completed: 'bg-yellow-500',
      inactive: 'bg-gray-500',
    };

    return (
      <Card glass>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Events Status</h3>
        <div className="space-y-3">
          {Object.entries(events.byStatus).map(([status, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[var(--foreground)] capitalize">{status}</span>
                  <span className="text-sm text-[var(--foreground)]/60">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusColors[status] || 'bg-gray-500'} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ProjectBreakdown />
      <PortfolioBreakdown />
      <EventBreakdown />
    </div>
  );
}

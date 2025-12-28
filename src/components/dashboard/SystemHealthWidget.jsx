'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function SystemHealthWidget({ monitoring, loading }) {
  if (loading) {
    return (
      <Card glass>
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 90) return 'Critical';
    if (percentage >= 70) return 'Warning';
    return 'Healthy';
  };

  return (
    <Card glass>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            System Health
          </h3>
          <p className="text-sm text-[var(--foreground)]/60">
            Quick overview of server resources
          </p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          monitoring?.serviceStatus === 'up' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`} />
      </div>

      <div className="space-y-4 mb-6">
        {/* CPU */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">CPU Usage</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {monitoring?.cpu?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatusColor(monitoring?.cpu || 0)}`}
              style={{ width: `${Math.min(monitoring?.cpu || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">RAM Usage</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {monitoring?.ram?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatusColor(monitoring?.ram || 0)}`}
              style={{ width: `${Math.min(monitoring?.ram || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* Disk */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Disk Usage</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {monitoring?.disk?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatusColor(monitoring?.disk || 0)}`}
              style={{ width: `${Math.min(monitoring?.disk || 0, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <Link href="/dashboard/monitoring">
        <Button variant="outline" className="w-full">
          View Full Monitoring
        </Button>
      </Link>
    </Card>
  );
}

'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import SystemHealthWidget from '@/components/dashboard/SystemHealthWidget';
import RecentActivities from '@/components/dashboard/RecentActivities';
import StatusBreakdown from '@/components/dashboard/StatusBreakdown';
import QuickActions from '@/components/dashboard/QuickActions';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in">
        {/* Welcome Section */}
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 rounded-full gradient-primary" />
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2 bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 bg-clip-text">
                Welcome back, {user?.username || 'Admin'}!
              </h1>
              <p className="text-[var(--foreground)]/60 text-lg">
                Here's what's happening with your infrastructure today
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="fade-scale" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Total Projects"
              value={stats?.projects?.total || 0}
              subtitle={`${stats?.projects?.byStatus?.deployed || 0} deployed`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              }
              color="primary"
              link="/dashboard/projects"
            >
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  {stats?.projects?.byStatus?.deployed || 0} Deployed
                </span>
                <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {stats?.projects?.byStatus?.building || 0} Building
                </span>
              </div>
            </StatCard>
          </div>

          <div className="fade-scale" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Total Portfolios"
              value={stats?.portfolios?.total || 0}
              subtitle={`${stats?.portfolios?.byStatus?.deployed || 0} deployed`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              color="accent"
              link="/dashboard/portfolios"
            >
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  {stats?.portfolios?.byStatus?.deployed || 0} Deployed
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {stats?.portfolios?.byStatus?.draft || 0} Draft
                </span>
              </div>
            </StatCard>
          </div>

          <div className="fade-scale" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Active Events"
              value={stats?.events?.total || 0}
              subtitle={`${stats?.events?.byStatus?.active || 0} active, ${stats?.events?.byStatus?.upcoming || 0} upcoming`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              color="blue"
              link="/dashboard/events"
            />
          </div>

          <div className="fade-scale" style={{ animationDelay: '0.4s' }}>
            <StatCard
              title="Active Subdomains"
              value={stats?.subdomains?.active || 0}
              subtitle={`${stats?.subdomains?.total || 0} total`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              color="green"
              link="/dashboard/subdomains"
            />
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="lg:col-span-2">
            <SystemHealthWidget 
              monitoring={stats?.monitoring} 
              loading={loading}
            />
          </div>
          <QuickActions />
        </div>

        {/* Status Breakdown */}
        <div className="fade-in" style={{ animationDelay: '0.6s' }}>
          <StatusBreakdown
            projects={stats?.projects}
            portfolios={stats?.portfolios}
            events={stats?.events}
            loading={loading}
          />
        </div>

        {/* Recent Activities */}
        <div className="fade-in" style={{ animationDelay: '0.7s' }}>
          <RecentActivities
            projects={stats?.projects?.recent}
            portfolios={stats?.portfolios?.recent}
            events={stats?.events?.upcoming}
            subdomains={stats?.subdomains?.recent}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

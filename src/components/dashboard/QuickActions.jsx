'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Create Event',
      description: 'Create a new event',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'accent',
      onClick: () => router.push('/dashboard/events'),
    },
    {
      title: 'View Monitoring',
      description: 'Check server status',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'primary',
      onClick: () => router.push('/dashboard/monitoring'),
    },
    {
      title: 'Manage Projects',
      description: 'View all projects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: 'blue',
      onClick: () => router.push('/dashboard/projects'),
    },
    {
      title: 'Subdomains',
      description: 'Manage subdomains',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      color: 'green',
      onClick: () => router.push('/dashboard/subdomains'),
    },
  ];

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              p-4 rounded-lg border border-[var(--border)] 
              bg-[var(--muted)] hover:bg-[var(--card)]
              transition-all duration-200 hover:scale-[1.02]
              text-left group
            `}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
              action.color === 'accent' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
              action.color === 'primary' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' :
              action.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {action.icon}
            </div>
            <p className="font-medium text-[var(--foreground)] text-sm mb-1">{action.title}</p>
            <p className="text-xs text-[var(--foreground)]/60">{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

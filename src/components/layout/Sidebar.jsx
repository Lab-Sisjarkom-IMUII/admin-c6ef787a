'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// SVG Icons Components
const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MonitoringIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SubdomainIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const ProjectIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const PortfolioIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const EventIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AdminIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 20h5m8-9a4 4 0 10-8 0 4 4 0 008 0zM9 11a4 4 0 10-8 0 4 4 0 008 0z"
    />
  </svg>
);

const UploaderIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const menuSections = [
  {
    title: 'Overview',
    items: [
      { 
        name: 'Dashboard', 
        path: '/dashboard', 
        icon: DashboardIcon,
        shortName: 'Dashboard'
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { 
        name: 'VPS Monitoring', 
        path: '/dashboard/monitoring', 
        icon: MonitoringIcon,
        shortName: 'Monitoring'
      },
    ],
  },
  {
    title: 'Management',
    items: [
      { 
        name: 'Projects', 
        path: '/dashboard/projects', 
        icon: ProjectIcon,
        shortName: 'Projects'
      },
      { 
        name: 'Portfolios', 
        path: '/dashboard/portfolios', 
        icon: PortfolioIcon,
        shortName: 'Portfolios'
      },
      { 
        name: 'Subdomains', 
        path: '/dashboard/subdomains', 
        icon: SubdomainIcon,
        shortName: 'Subdomains'
      },
      { 
        name: 'Events', 
        path: '/dashboard/events', 
        icon: EventIcon,
        shortName: 'Events'
      },
      { 
        name: 'Admins', 
        path: '/dashboard/admins', 
        icon: AdminIcon,
        shortName: 'Admins'
      },
      { 
        name: 'Template Uploaders', 
        path: '/dashboard/template-uploaders', 
        icon: UploaderIcon,
        shortName: 'Uploaders'
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50
          bg-[var(--card)] glass border-r border-[var(--border)]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/5 to-transparent">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 group"
            onClick={handleLinkClick}
          >
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-glow-primary/30 group-hover:scale-110 group-hover:shadow-glow-primary/50 transition-all duration-300 overflow-hidden">
              <Image
                src="/MainLogo.png"
                alt="IMUII Logo"
                width={48}
                height={48}
                className="object-contain w-full h-full"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors duration-200">
                IMUII Admin
              </h2>
              <p className="text-xs text-[var(--foreground)]/50">
                Control Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Header */}
                <div className="px-3 mb-3 mt-6 first:mt-0">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                    <p className="text-xs font-semibold text-[var(--foreground)]/40 uppercase tracking-wider px-2">
                      {section.title}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    // For Dashboard, only active if exact match
                    // For other routes, active if exact match or starts with path + '/'
                    const isActive = item.path === '/dashboard' 
                      ? pathname === item.path
                      : pathname === item.path || pathname.startsWith(item.path + '/');
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={handleLinkClick}
                        className={`
                          group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-300
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-[var(--primary)]/15 to-[var(--primary)]/5 text-[var(--primary)] shadow-sm'
                              : 'text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--foreground)] hover:translate-x-1'
                          }
                        `}
                      >
                        {/* Active Indicator Bar with Glow */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-glow-primary" />
                        )}
                        
                        {/* Icon with Animation */}
                        <div className={`
                          flex-shrink-0 w-5 h-5 transition-all duration-300
                          ${isActive 
                            ? 'text-[var(--primary)] scale-110' 
                            : 'text-[var(--foreground)]/50 group-hover:text-[var(--foreground)] group-hover:scale-110'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        {/* Label */}
                        <span className={`
                          font-medium text-sm flex-1 transition-colors duration-200
                          ${isActive ? 'text-[var(--primary)] font-semibold' : ''}
                        `}>
                          {item.name}
                        </span>
                        
                        {/* Active Glow Effect */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-lg bg-[var(--primary)]/10 pointer-events-none blur-sm" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-[var(--border)] bg-gradient-to-t from-[var(--muted)] to-transparent">
          <div className="px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)]/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500/50 animate-ping" />
              </div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                System Online
              </p>
            </div>
            <p className="text-xs text-[var(--foreground)]/50">
              {user?.username || 'Admin'} • v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Dashboard', path: '/dashboard' }];
    
    if (paths.length > 1) {
      paths.slice(1).forEach((path, index) => {
        const fullPath = '/' + paths.slice(0, index + 2).join('/');
        const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ name, path: fullPath });
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--card)] glass border-b border-[var(--border)] shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Center: Breadcrumbs */}
        <nav className="flex-1 lg:ml-0 ml-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-[var(--foreground)]/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-[var(--foreground)]">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors duration-200"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Right: User Info & Logout */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition-all duration-200 hover:scale-105"
          >
            <div className="relative w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-glow-primary/20">
              {user?.username?.[0]?.toUpperCase() || 'A'}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--card)]" />
            </div>
            <span className="hidden md:block text-sm font-medium text-[var(--foreground)]">
              {user?.username || 'Admin'}
            </span>
            <svg
              className={`w-4 h-4 text-[var(--foreground)]/60 transition-transform duration-300 ${
                showUserMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] glass border border-[var(--border)] rounded-lg shadow-xl z-20 slide-up">
                <div className="p-2">
                  <div className="px-3 py-3 border-b border-[var(--border)]">
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {user?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/60 mt-0.5">
                      Administrator
                    </p>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      }
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

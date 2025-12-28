'use client';

import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-[var(--accent)]/10 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(13,148,136,0.2),transparent_50%)]" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <div className="max-w-md">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 overflow-hidden">
                  <Image
                    src="/MainLogo.png"
                    alt="IMUII Logo"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                <h1 className="text-4xl font-bold text-white">
                  IMUII
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Admin Panel
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Manage and monitor your infrastructure with powerful admin tools
              </p>
            </div>
            
            {/* Features List */}
            <div className="space-y-4 mt-12">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Real-time Monitoring</p>
                  <p className="text-white/60 text-sm">Track server resources and performance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Project Management</p>
                  <p className="text-white/60 text-sm">Manage all projects and deployments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Event Organization</p>
                  <p className="text-white/60 text-sm">Organize and track events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 overflow-hidden">
                <Image
                  src="/MainLogo.png"
                  alt="IMUII Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                IMUII Admin
              </h1>
            </div>
          </div>
          
          {/* Login Card */}
          <div className="glass rounded-2xl border border-[var(--border)] p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Welcome Back
              </h2>
              <p className="text-[var(--foreground)]/60">
                Sign in to continue to your admin dashboard
              </p>
            </div>
            
            <LoginForm />
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--foreground)]/50">
              Secure admin access • Protected by authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  link,
  children,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof value === 'number') {
      setIsAnimating(true);
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(increment * step, value);
        setDisplayValue(Math.floor(current));
        
        if (step >= steps) {
          setDisplayValue(value);
          setIsAnimating(false);
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorConfigs = {
    primary: {
      iconBg: 'gradient-primary',
      iconText: 'text-white',
      iconGlow: 'shadow-glow-primary',
      trendUp: 'text-[var(--primary)]',
    },
    accent: {
      iconBg: 'gradient-accent',
      iconText: 'text-white',
      iconGlow: 'shadow-glow-accent',
      trendUp: 'text-[var(--accent)]',
    },
    green: {
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      iconText: 'text-white',
      iconGlow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      trendUp: 'text-green-400',
    },
    blue: {
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      iconText: 'text-white',
      iconGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      trendUp: 'text-blue-400',
    },
    yellow: {
      iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      iconText: 'text-white',
      iconGlow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
      trendUp: 'text-yellow-400',
    },
  };

  const config = colorConfigs[color] || colorConfigs.primary;

  const content = (
    <Card 
      glass 
      hover 
      interactive={!!link}
      className={`h-full fade-scale ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`relative w-14 h-14 rounded-xl ${config.iconBg} flex items-center justify-center ${config.iconGlow} transition-transform duration-300 group-hover:scale-110`}>
          <div className={config.iconText}>
            {icon}
          </div>
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? config.trendUp : 'text-red-400'}`}>
            {trend > 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
              </svg>
            )}
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-sm font-medium text-[var(--foreground)]/60 mb-2">{title}</p>
        <p className={`text-4xl font-bold text-[var(--foreground)] transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-sm text-[var(--foreground)]/50 mt-2">{subtitle}</p>
        )}
      </div>
      
      {children && <div className="mt-5">{children}</div>}
    </Card>
  );

  if (link) {
    return <Link href={link} className="group block">{content}</Link>;
  }

  return content;
}

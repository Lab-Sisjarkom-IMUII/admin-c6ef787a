'use client';

import { useEffect } from 'react';
import Card from './Card';
import Button from './Button';

export default function AlertModal({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'info', // 'success', 'error', 'warning', 'info'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    success: {
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    error: {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    warning: {
      icon: (
        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    info: {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
  };

  const styles = variantStyles[variant] || variantStyles.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card glass className="w-full max-w-md">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {styles.icon}
              <div className="absolute inset-0 bg-current opacity-10 rounded-full blur-xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-3">
            {title}
          </h2>

          {/* Message */}
          <div className={`rounded-lg ${styles.bgColor} border ${styles.borderColor} p-4 mb-6`}>
            <p className="text-[var(--foreground)]/80 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              className="min-w-[120px]"
              onClick={onClose}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


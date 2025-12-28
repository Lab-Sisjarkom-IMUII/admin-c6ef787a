'use client';

import { useEffect } from 'react';
import Card from './Card';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info'
  loading = false,
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

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: (
        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    info: {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

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
          <p className="text-[var(--foreground)]/70 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              className={`flex-1 ${styles.confirmButton}`}
              onClick={handleConfirm}
              disabled={loading}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


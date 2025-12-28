'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ReserveSubdomainModal({ isOpen, onClose, onSubmit }) {
  const [subdomain, setSubdomain] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubdomain('');
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!subdomain || subdomain.trim().length === 0) {
      newErrors.subdomain = 'Subdomain name is required';
    } else if (!/^[a-z0-9-]+$/.test(subdomain.trim())) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    } else if (subdomain.trim().length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    } else if (subdomain.trim().length > 63) {
      newErrors.subdomain = 'Subdomain must be less than 63 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(subdomain.trim());
      onClose();
    } catch (error) {
      console.error('Error reserving subdomain:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <Card glass className="w-full max-w-md slide-up shadow-xl relative z-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">Reserve Subdomain</h2>
            <p className="text-sm text-[var(--foreground)]/60">Secure a subdomain for future use</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Subdomain Name"
              type="text"
              value={subdomain}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                setSubdomain(value);
                if (errors.subdomain) {
                  setErrors({ ...errors, subdomain: '' });
                }
              }}
              error={errors.subdomain}
              placeholder="my-reserved-subdomain"
              disabled={loading}
              autoFocus
            />
            <p className="mt-2 text-sm text-[var(--foreground)]/60">
              Full domain will be: <span className="font-medium text-[var(--foreground)]">{subdomain || 'subdomain'}.imuii.id</span>
            </p>
            <p className="mt-1 text-xs text-[var(--foreground)]/50">
              Only lowercase letters, numbers, and hyphens are allowed
            </p>
          </div>

          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-400 leading-relaxed">
              This will reserve the subdomain for future use. It will be marked as "Reserved" until assigned to a project or portfolio.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" disabled={loading} loading={loading}>
              Reserve Subdomain
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

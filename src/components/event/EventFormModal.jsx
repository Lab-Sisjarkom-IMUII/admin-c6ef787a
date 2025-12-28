'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function EventFormModal({ event, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (event) {
        // Edit mode
        setFormData({
          name: event.name || '',
          description: event.description || '',
          start_date: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '',
          end_date: event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '',
          status: event.status || 'active',
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'active',
        });
      }
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, event]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
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
      <Card glass className="w-full max-w-2xl max-h-[90vh] overflow-y-auto slide-up shadow-xl relative z-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)] sticky top-0 bg-[var(--card)]/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <p className="text-sm text-[var(--foreground)]/60">
              {event ? 'Update event information' : 'Add a new event to the system'}
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Event Name *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter event name"
            disabled={loading}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description (optional)"
              disabled={loading}
              rows={4}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              error={errors.start_date}
              disabled={loading}
            />

            <Input
              label="End Date *"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              error={errors.end_date}
              disabled={loading}
              min={formData.start_date}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={loading}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-400">{errors.status}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" disabled={loading} loading={loading}>
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

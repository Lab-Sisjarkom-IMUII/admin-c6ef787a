'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventTable from '@/components/event/EventTable';
import EventFilters from '@/components/event/EventFilters';
import EventFormModal from '@/components/event/EventFormModal';
import EventDetailModal from '@/components/event/EventDetailModal';
import { useEvents } from '@/hooks/useEvents';
import Button from '@/components/ui/Button';

export default function EventManagement() {
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = !search || 
        event.name?.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (event) => {
    setFormMode('edit');
    setSelectedEvent(event);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (event) => {
    if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
      const result = await deleteEvent(event.id);
      if (result.success) {
        // Success - events will be refreshed automatically
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'create') {
      const result = await createEvent(formData);
      if (result.success) {
        setIsFormModalOpen(false);
        setSelectedEvent(null);
      }
    } else {
      const result = await updateEvent(selectedEvent.id, formData);
      if (result.success) {
        setIsFormModalOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-500 to-cyan-600" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Event Management
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Create and manage events to organize projects
            </p>
          </div>
          <div className="flex gap-3 ml-4">
            <Button 
              variant="primary" 
              onClick={fetchEvents} 
              disabled={loading}
              loading={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Refresh
            </Button>
            <Button 
              variant="accent" 
              onClick={handleCreate}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create Event
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <EventTable
          events={filteredEvents}
          loading={loading}
          onRowClick={handleView}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Form Modal */}
        <EventFormModal
          event={formMode === 'edit' ? selectedEvent : null}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleFormSubmit}
        />
      </div>
    </DashboardLayout>
  );
}

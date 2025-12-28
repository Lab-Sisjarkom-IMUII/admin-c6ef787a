'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/events/all');
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, events: [...], total: ..., page: ..., limit: ... }
      // Mock data: response = { success: true, events: [...], total: ..., page: ..., limit: ... }
      setEvents(response.events || response.data?.events || []);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      await fetchEvents();
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { id: "...", ... } }
      // Mock data: response = { success: true, event: {...} }
      return { success: true, data: response.data || response.event || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/admin/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
      await fetchEvents();
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { id: "...", ... } }
      // Mock data: response = { success: true, event: {...} }
      return { success: true, data: response.data || response.event || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const deleteEvent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/admin/events/${id}`, {
        method: 'DELETE',
      });
      await fetchEvents();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const getEventDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/admin/events/${id}`);
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { id: "...", ... } }
      // Mock data: response = event object langsung
      return { success: true, data: response.data || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventProjects = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/admin/events/${id}/projects`);
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { success: true, projects: [...] } }
      // Mock data: response = { success: true, projects: [...] }
      return { success: true, data: response.projects || response.data?.projects || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventDetail,
    getEventProjects,
  };
}

'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/projects/all');
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, projects: [...], total: ..., page: ..., limit: ... }
      // Mock data: response = { success: true, projects: [...], total: ..., page: ..., limit: ... }
      setProjects(response.projects || response.data?.projects || []);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
  };
}

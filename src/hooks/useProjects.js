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

  /**
   * Deploy project (trigger deployment) - Admin can redeploy any project
   * Uses admin-specific endpoint: POST /api/v1/admin/projects/:id/deploy
   * @param {string} projectId - Project ID (UUID)
   * @param {string} [commitSha="latest"] - Commit SHA (default: "latest")
   * @param {string} [branch="main"] - Branch name (default: "main")
   * @returns {Promise<Object>} Deploy response
   */
  const deployProject = useCallback(async (projectId, commitSha = "latest", branch = "main") => {
    try {
      // Use admin-specific endpoint for redeploy
      const response = await apiRequest(`/admin/projects/${projectId}/deploy`, {
        method: 'POST',
        body: JSON.stringify({
          commit_sha: commitSha,
          branch: branch,
        }),
      });
      
      // API response format: { success: true, message: "..." }
      return {
        success: response.success !== false,
        message: response.message || 'Deployment triggered successfully',
        data: response.data || response,
      };
    } catch (err) {
      throw new Error(err.message || 'Failed to trigger deployment');
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    deployProject,
  };
}

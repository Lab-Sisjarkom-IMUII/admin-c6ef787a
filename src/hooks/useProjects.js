'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
  });

  const fetchProjects = useCallback(async (page = 1, limit = 25, options = {}) => {
    const { loadAll = false } = options;
    setLoading(true);
    setError(null);
    try {
      const fetchPage = async (pageNumber, pageLimit) => {
        const response = await apiRequest(`/admin/projects/all?page=${pageNumber}&limit=${pageLimit}`);
        const list = response.projects || response.data?.projects || [];
        return {
          list: Array.isArray(list) ? list : [],
          total: response.total ?? (Array.isArray(list) ? list.length : 0),
          page: response.page || pageNumber,
          limit: response.limit || pageLimit,
        };
      };

      if (!loadAll) {
        // apiRequest() sudah normalize response via extractApiResponse()
        // API sebenarnya: response = { success: true, projects: [...], total: ..., page: ..., limit: ... }
        // Mock data: response = { success: true, projects: [...], total: ..., page: ..., limit: ... }
        const pageData = await fetchPage(page, limit);
        setProjects(pageData.list);
        setPagination({
          total: pageData.total,
          page: pageData.page,
          limit: pageData.limit,
        });
        return;
      }

      const pageLimit = Math.min(limit, 100);
      const firstPage = await fetchPage(1, pageLimit);
      const totalItems = firstPage.total;
      const totalPages = Math.max(1, Math.ceil(totalItems / pageLimit));
      const allProjects = [...firstPage.list];

      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        const pageData = await fetchPage(currentPage, pageLimit);
        allProjects.push(...pageData.list);
      }

      setProjects(allProjects);
      setPagination({
        total: totalItems,
        page: 1,
        limit: totalItems > 0 ? totalItems : pageLimit,
      });
    } catch (err) {
      setError(err.message);
      setProjects([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
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
    pagination,
    fetchProjects,
    deployProject,
  };
}

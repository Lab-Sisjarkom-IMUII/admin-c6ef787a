'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useTemplateUploaders() {
  const [uploaders, setUploaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchUploaders = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/admin/template-uploaders?page=${page}&limit=${limit}`);
      // Extract uploaders from response
      const list = response.uploaders || response.data?.uploaders || [];
      setUploaders(Array.isArray(list) ? list : []);
      
      // Update pagination
      if (response.total !== undefined) {
        setPagination({
          total: response.total || 0,
          page: response.page || page,
          limit: response.limit || limit,
        });
      }
    } catch (err) {
      console.error('Failed to fetch template uploaders:', err);
      setError(
        err.message || 'Gagal memuat daftar template uploader.'
      );
      setUploaders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUploaderTemplates = useCallback(async (uploaderId) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all templates and filter by uploader_id
      // Note: Endpoint /templates mungkin tidak include uploader info, 
      // jadi kita coba endpoint yang ada atau filter di frontend
      const response = await apiRequest(`/templates?page=1&limit=1000`);
      const allTemplates = response.templates || response.data?.templates || [];
      
      // Filter templates by uploader_id
      const uploaderTemplates = Array.isArray(allTemplates)
        ? allTemplates.filter(t => t.uploader_id === uploaderId)
        : [];
      
      return uploaderTemplates;
    } catch (err) {
      console.error('Failed to fetch uploader templates:', err);
      setError(err.message || 'Gagal memuat template uploader.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploaders,
    loading,
    error,
    pagination,
    fetchUploaders,
    fetchUploaderTemplates,
  };
}


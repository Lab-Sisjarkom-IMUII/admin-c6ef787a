'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useSubdomains() {
  const [subdomains, setSubdomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubdomains = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch active subdomains (includes projects, portfolios, and reserved subdomains)
      // The /admin/subdomains/active endpoint already includes reserved subdomains
      // with source="reserved" and source_id containing the reserved subdomain ID
      const response = await apiRequest('/admin/subdomains/active');
      const subdomains = response.subdomains || response.data?.subdomains || [];
      setSubdomains(Array.isArray(subdomains) ? subdomains : []);
    } catch (err) {
      console.error('Failed to fetch subdomains:', err);
      setError(err.message);
      setSubdomains([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reserveSubdomain = useCallback(async (subdomain) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/subdomains/reserve', {
        method: 'POST',
        body: JSON.stringify({ subdomain }),
      });
      await fetchSubdomains(); // Refresh list
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, message: "...", data: { id: "...", ... } }
      // Mock data: response = { success: true, data: {...} }
      return { success: true, data: response.data || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSubdomains]);

  const releaseSubdomain = useCallback(async (subdomainId) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint sesuai docs API: DELETE /api/v1/admin/subdomains/reserved/:id
      await apiRequest(`/admin/subdomains/reserved/${subdomainId}`, {
        method: 'DELETE',
      });
      await fetchSubdomains(); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSubdomains]);

  return {
    subdomains,
    loading,
    error,
    fetchSubdomains,
    reserveSubdomain,
    releaseSubdomain,
  };
}

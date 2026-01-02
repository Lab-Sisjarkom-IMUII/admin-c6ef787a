'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useSubdomains() {
  const [subdomains, setSubdomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
  });

  const fetchSubdomains = useCallback(async (page = 1, limit = 25, options = {}) => {
    const { loadAll = false } = options;
    setLoading(true);
    setError(null);
    try {
      // Fetch active subdomains (includes projects, portfolios, and reserved subdomains)
      // The /admin/subdomains/active endpoint already includes reserved subdomains
      // with source="reserved" and source_id containing the reserved subdomain ID
      const fetchPage = async (pageNumber, pageLimit) => {
        const response = await apiRequest(`/admin/subdomains/active?page=${pageNumber}&limit=${pageLimit}`);
        const list = response.subdomains || response.data?.subdomains || [];
        return {
          list: Array.isArray(list) ? list : [],
          total: response.total ?? (Array.isArray(list) ? list.length : 0),
          page: response.page || pageNumber,
          limit: response.limit || pageLimit,
        };
      };

      if (!loadAll) {
        const pageData = await fetchPage(page, limit);
        setSubdomains(pageData.list);
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
      const allSubdomains = [...firstPage.list];

      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        const pageData = await fetchPage(currentPage, pageLimit);
        allSubdomains.push(...pageData.list);
      }

      setSubdomains(allSubdomains);
      setPagination({
        total: totalItems,
        page: 1,
        limit: totalItems > 0 ? totalItems : pageLimit,
      });
    } catch (err) {
      console.error('Failed to fetch subdomains:', err);
      setError(err.message);
      setSubdomains([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const reserveSubdomain = useCallback(async (subdomain, refreshOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/subdomains/reserve', {
        method: 'POST',
        body: JSON.stringify({ subdomain }),
      });
      const refreshPage = refreshOptions.page ?? pagination.page;
      const refreshLimit = refreshOptions.limit ?? pagination.limit;
      await fetchSubdomains(refreshPage, refreshLimit, refreshOptions); // Refresh list
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
  }, [fetchSubdomains, pagination.page, pagination.limit]);

  const releaseSubdomain = useCallback(async (subdomainId, refreshOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint sesuai docs API: DELETE /api/v1/admin/subdomains/reserved/:id
      await apiRequest(`/admin/subdomains/reserved/${subdomainId}`, {
        method: 'DELETE',
      });
      const refreshPage = refreshOptions.page ?? pagination.page;
      const refreshLimit = refreshOptions.limit ?? pagination.limit;
      await fetchSubdomains(refreshPage, refreshLimit, refreshOptions); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSubdomains, pagination.page, pagination.limit]);

  return {
    subdomains,
    loading,
    error,
    pagination,
    fetchSubdomains,
    reserveSubdomain,
    releaseSubdomain,
  };
}

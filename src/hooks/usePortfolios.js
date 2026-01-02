'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
  });

  const fetchPortfolios = useCallback(async (page = 1, limit = 25, options = {}) => {
    const { loadAll = false } = options;
    setLoading(true);
    setError(null);
    try {
      const fetchPage = async (pageNumber, pageLimit) => {
        const response = await apiRequest(`/admin/portfolios/all?page=${pageNumber}&limit=${pageLimit}`);
        const list = response.portfolios || response.data?.portfolios || [];
        return {
          list: Array.isArray(list) ? list : [],
          total: response.total ?? (Array.isArray(list) ? list.length : 0),
          page: response.page || pageNumber,
          limit: response.limit || pageLimit,
        };
      };

      if (!loadAll) {
        // apiRequest() sudah normalize response via extractApiResponse()
        // API sebenarnya: response = { success: true, portfolios: [...], total: ..., page: ..., limit: ... }
        // Mock data: response = { success: true, portfolios: [...], total: ..., page: ..., limit: ... }
        const pageData = await fetchPage(page, limit);
        setPortfolios(pageData.list);
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
      const allPortfolios = [...firstPage.list];

      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        const pageData = await fetchPage(currentPage, pageLimit);
        allPortfolios.push(...pageData.list);
      }

      setPortfolios(allPortfolios);
      setPagination({
        total: totalItems,
        page: 1,
        limit: totalItems > 0 ? totalItems : pageLimit,
      });
    } catch (err) {
      setError(err.message);
      setPortfolios([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    portfolios,
    loading,
    error,
    pagination,
    fetchPortfolios,
  };
}

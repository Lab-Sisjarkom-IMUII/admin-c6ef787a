'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/portfolios/all');
      // apiRequest() sudah normalize response via extractApiResponse()
      // API sebenarnya: response = { success: true, portfolios: [...], total: ..., page: ..., limit: ... }
      // Mock data: response = { success: true, portfolios: [...], total: ..., page: ..., limit: ... }
      setPortfolios(response.portfolios || response.data?.portfolios || []);
    } catch (err) {
      setError(err.message);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    portfolios,
    loading,
    error,
    fetchPortfolios,
  };
}

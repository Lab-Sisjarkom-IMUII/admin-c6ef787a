'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

const DEFAULT_LIMIT = 200;

export function usePm2Logs(autoRefresh = true, interval = 5000) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      params.set('limit', DEFAULT_LIMIT.toString());

      const response = await apiRequest(`/admin/monitoring/pm2/logs?${params.toString()}`);
      const nextLogs = Array.isArray(response?.logs) ? response.logs : [];
      setLogs(nextLogs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();

    if (autoRefresh) {
      const intervalId = setInterval(fetchLogs, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval, fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
